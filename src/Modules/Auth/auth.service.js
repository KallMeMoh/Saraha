import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { UserModel } from '../../DB/Models/User.model.js';
import { JWT_SECRET, SALT_ROUNDS } from '../../../config/config.service.js';
import {
  conflictException,
  notFoundException,
  unauthorizedException,
} from '../../common/response/response.js';
import DBRepo from '../../DB/db.repository.js';
import { encrypt } from '../../common/utils/security/encrypt.js';

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

  const token = jwt.sign({ role: existingUser.role }, JWT_SECRET, {
    subject: existingUser._id.toString(),
    expiresIn: '1h',
    jwtid: randomUUID(), // for blacklisting tokens in the future
  });

  return token;
};
