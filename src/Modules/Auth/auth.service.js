import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../DB/Models/User.model.js';
import { SALT_ROUNDS } from '../../../config/config.service.js';
import {
  conflictException,
  notFoundException,
  unauthorizedException,
} from '../../common/response/response.js';
import DBRepo from '../../DB/db.repository.js';
import { encrypt } from '../../common/utils/security/encrypt.js';
import { TokenType } from '../../common/enums/token.enum.js';
import { getSignature } from '../../common/utils/security/signature.js';

export const signup = async (bodyData) => {
  const { email } = bodyData;

  // this hurts my soul more than it hurts yours
  const existingUser = await DBRepo.findOne({
    Model: UserModel,
    filters: { email },
  });

  if (existingUser) return conflictException('Email already exists');

  let phone = undefined;
  if (bodyData.phone) phone = encrypt(bodyData.phone);

  const hashed_password = await hash(bodyData.password, SALT_ROUNDS);

  // this one too
  const result = await DBRepo.create({
    Model: UserModel,
    data: { ...bodyData, phone, hashed_password },
  });

  return result;
};

export const login = async (bodyData) => {
  const { email, password } = bodyData;

  // this hurts my soul more than it hurts yours
  const existingUser = await DBRepo.findOne({
    Model: UserModel,
    filters: { email },
  });

  if (!existingUser) return notFoundException('User does not exist');

  const matchedPassword = await compare(password, existingUser.hashed_password);

  if (!matchedPassword) return unauthorizedException('Invalid credentials');

  const { accessSignature, refreshSignature } = getSignature(role);

  // I hate this...
  const accessToken = jwt.sign({ sub: existingUser._id }, accessSignature, {
    audience: [existingUser.role, TokenType.Access],
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ sub: existingUser._id }, refreshSignature, {
    audience: [existingUser.role, TokenType.Refresh],
    expiresIn: '1y',
  });

  return { accessToken, refreshToken };
};

export const rotateToken = async (userId, userRole) => {
  const { accessSignature } = getSignature(userRole);
  const newAccessToken = jwt.sign({ sub: userId }, accessSignature, {
    audience: [userRole, TokenType.Access],
    expiresIn: '15m',
  });

  return { accessToken: newAccessToken };
};
