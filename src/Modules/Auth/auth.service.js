import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../DB/Models/User.model.js';
import { SALT_ROUNDS } from '../../../config/config.service.js';
import {
  badRequestException,
  conflictException,
  notFoundException,
  unauthorizedException,
} from '../../common/response/response.js';
import DBRepo from '../../DB/db.repository.js';
import { encrypt } from '../../common/utils/security/encrypt.js';
import { TokenType } from '../../common/enums/token.enum.js';
import { getSignature } from '../../common/utils/security/signature.js';
import { GenderEnum, RoleEnum } from '../../common/enums/user.enum.js';
import { sendOTPEmail } from '../../common/utils/email/sendOTPEmail.js';
import { OTPModel } from '../../DB/Models/OTP.model.js';

export const signup = async (bodyData) => {
  const { email } = bodyData;

  // this hurts my soul more than it hurts yours
  const existingUser = await DBRepo.findOne({
    Model: UserModel,
    filters: { email },
  });

  if (existingUser) return conflictException('Email already exists');

  let gender = GenderEnum[bodyData.gender];

  let phone = undefined;
  if (bodyData.phone) phone = encrypt(bodyData.phone);

  const hashed_password = await hash(bodyData.password, SALT_ROUNDS);

  // this one too
  const user = await DBRepo.create({
    Model: UserModel,
    data: { ...bodyData, gender, phone, hashed_password },
  });

  sendOTPEmail(user).catch((err) =>
    console.error('Failed to email OTP: ', err),
  );

  return user;
};

export const login = async (bodyData) => {
  const { email, password } = bodyData;

  // this hurts my soul more than it hurts yours
  let existingUser = await DBRepo.findOne({
    Model: UserModel,
    filters: { email },
  });

  if (!existingUser) return notFoundException('User does not exist');

  let { _id, role, hashed_password } = existingUser.toObject({
    getters: false,
  });
  const matchedPassword = await compare(password, hashed_password);

  if (!matchedPassword) return unauthorizedException('Invalid credentials');

  const { accessSignature, refreshSignature } = getSignature(role);

  // I hate this...
  const accessToken = jwt.sign({ sub: _id }, accessSignature, {
    audience: [role, TokenType.Access],
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ sub: _id }, refreshSignature, {
    audience: [role, TokenType.Refresh],
    expiresIn: '1y',
  });

  return { accessToken, refreshToken };
};

export const rotateToken = async (userId) => {
  const user = await DBRepo.findOne({
    Model: UserModel,
    filters: { _id: userId },
  });

  if (!user) return notFoundException('Account does not exist');

  const { accessSignature } = getSignature(RoleEnum[user.role]);
  const newAccessToken = jwt.sign({ sub: userId }, accessSignature, {
    audience: [RoleEnum[user.role], TokenType.Access],
    expiresIn: '15m',
  });

  return { accessToken: newAccessToken };
};

export const resendOTP = async (userId) => {
  const [user, otp] = await Promise.all([
    DBRepo.findOne({ Model: UserModel, filters: { _id: userId } }),
    DBRepo.exists({ Model: OTPModel, filters: { authorId: userId } }),
  ]);

  if (!user) return notFoundException('Account does not exist');
  if (user.verified) return conflictException('Account already verified');
  if (otp) return;

  await sendOTPEmail(user);
};

export const verifyOTP = async (userId, code) => {
  const [user, otp] = await Promise.all([
    DBRepo.findOne({ Model: UserModel, filters: { _id: userId } }),
    DBRepo.findOne({
      Model: OTPModel,
      filters: { authorId: userId, code },
    }),
  ]);

  if (!user) return notFoundException('Account does not exist');
  if (user.verified) return conflictException('Account already verified');
  if (!otp) return unauthorizedException('Invalid OTP code');

  await otp.deleteOne();

  user.verified = true;
  await user.save();
};
