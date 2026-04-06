import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { UserModel } from '../../database/models/user.model.js';
import {
  CLIENT_ID,
  FRONTEND_URL,
  PENDING_AUTH_SIGNATURE,
  SALT_ROUNDS,
} from '../../config/index.js';
import DatabaseRepo from '../../database/mongoose.repository.js';
import { encrypt } from '../../common/utils/security/encrypt.js';
import { ProviderEnum } from '../../common/enums/user.enum.js';
import { sendOTPEmail } from '../../common/utils/email/send-otp-email.js';
import { HttpError } from '../../common/errors/HttpError.js';
import { generateTokens } from '../../common/utils/security/token.js';
import RedisRepo from '../../database/redis.repository.js';
import { TokenType } from '../../common/enums/token.enum.js';
import { sendPasswordResetEmail } from '../../common/utils/email/send-password-reset-email.js';

export const signup = async ({
  username,
  email,
  gender,
  birth_date,
  phone,
  password,
}) => {
  // this hurts my soul more than it hurts yours
  const userExists = await DatabaseRepo.exists({
    Model: UserModel,
    filters: { email },
  });

  if (userExists) throw new HttpError(409, 'User already exists');

  const data = {
    username,
    email,
    phone: encrypt(phone),
    gender,
    birth_date,
    hashed_password: await hash(password, SALT_ROUNDS),
    provider: ProviderEnum.System,
  };

  // this one too
  const user = await DatabaseRepo.create({ Model: UserModel, data });

  sendOTPEmail(
    `otp:signup:${user._id}`,
    user,
    'Verify your SarahaClone account',
    'complete your registration',
  ).catch((err) => console.error('Failed to email OTP: ', err));

  return user;
};

export const login = async ({ email, password }) => {
  // this hurts my soul more than it hurts yours
  let user = await DatabaseRepo.findOne({
    Model: UserModel,
    filters: { email },
  });

  if (!user) throw new HttpError(404, 'Account does not exist');

  const tries = await RedisRepo.get(`auth:login-counter:${user._id}`);
  if (tries && tries > 5)
    throw new HttpError(401, 'Account temporarily banned, try again later');

  const matchedPassword = await compare(password, user.hashed_password);
  if (!matchedPassword) {
    const loginCounter = await RedisRepo.incr(`auth:login-counter:${user._id}`);
    if (loginCounter === 1)
      RedisRepo.expire(`auth:login-counter:${user._id}`, 1800);
    throw new HttpError(401, 'Invalid credentials');
  }

  if (user.has2FA) {
    const token = jwt.sign({ sub: user._id }, PENDING_AUTH_SIGNATURE, {
      audience: [TokenType.PendingAuth],
      expiresIn: '10m',
    });

    await sendOTPEmail(
      `auth:login-2fa:${user._id}`,
      user,
      'Your SarahaClone login confirmation code',
      'confirm your login attempt',
    );

    return {
      requires2FA: true,
      token,
    };
  } else return generateTokens(user._id, user.roleValue);
};

export const confirmLogin = async ({ otp, token }) => {
  const { sub = undefined } = jwt.verify(token, PENDING_AUTH_SIGNATURE);

  const [user, code] = await Promise.all([
    DatabaseRepo.findOne({
      Model: UserModel,
      filters: { _id: sub },
    }),
    RedisRepo.get(`auth:login-2fa:${sub}`),
  ]);

  if (!user) throw new HttpError(404, 'Account does not exist');
  if (!code) throw new HttpError(404, 'OTP Expired, please login again');

  const tries = await RedisRepo.get(`auth:login-counter:${user._id}`);
  if (tries && tries > 5)
    throw new HttpError(401, 'Account temporarily banned, try again later');

  if (otp !== code) {
    const loginCounter = await RedisRepo.incr(`auth:login-counter:${user._id}`);
    if (loginCounter === 1)
      RedisRepo.expire(`auth:login-counter:${user._id}`, 1800);
    throw new HttpError(401, 'Invalid credentials');
  }

  return generateTokens(user._id, user.roleValue);
};

const client = new OAuth2Client();
export const googleSignup = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });

  const { given_name, email, picture, email_verified } = ticket.getPayload();

  const user = await DatabaseRepo.findOne({
    Model: UserModel,
    filters: { email },
  });

  if (user) throw new HttpError(409, 'Account already exists');

  await DatabaseRepo.create({
    Model: UserModel,
    data: {
      username: given_name,
      email,
      verified: email_verified,
      avatar: picture,
      provider: ProviderEnum.Google,
    },
  });
};

export const googleLogin = async () => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });

  const { email } = ticket.getPayload();

  const user = await DatabaseRepo.findOne({
    Model: UserModel,
    filters: {
      email,
      provider: ProviderEnum.Google,
    },
  });

  if (!user) throw new HttpError(401, 'Invalid credentials');

  return generateTokens(user._id, user.roleValue);
};

export const rotateToken = async (userId, jti) => {
  const user = await DatabaseRepo.findOne({
    Model: UserModel,
    filters: { _id: userId },
  });

  if (!user) throw new HttpError(404, 'Account does not exist');

  const { accessToken: newAccessToken } = generateTokens(
    user._id,
    user.roleValue,
    jti,
  );

  return newAccessToken;
};

export const resetPassword = async ({ email }) => {
  const user = await DatabaseRepo.findOne({
    Model: UserModel,
    filters: { email },
  });

  if (!user) return;

  const token = randomBytes(32).toString('hex');
  await RedisRepo.set(`auth:password-reset:${token}`, `${user._id}`, 'EX', 900);
  await sendPasswordResetEmail(
    user.email,
    `${FRONTEND_URL}/reset-password?token=${token}`,
  );
};

export const verifyResetPassword = async (token, { new_password }) => {
  const userId = await RedisRepo.get(`auth:password-reset:${token}`);
  const user = DatabaseRepo.findOne({
    Model: UserModel,
    filters: { _id: userId },
  });

  if (!user) throw new HttpError(404, 'Account does not exist');

  user.hashed_password = await hash(new_password, SALT_ROUNDS);
  await user.save();
};

export const blacklistToken = async (jti) => {
  const ttl = 365 * 24 * 60 * 60;
  await RedisRepo.set(`jwt:blacklist:${jti}`, '1', 'EX', ttl);
};
