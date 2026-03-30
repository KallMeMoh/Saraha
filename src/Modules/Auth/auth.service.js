import { compare, hash } from 'bcrypt';
import { UserModel } from '../../DB/Models/User.model.js';
import { CLIENT_ID, SALT_ROUNDS } from '../../config/index.js';
import DatabaseRepo from '../../DB/mongoose.repository.js';
import { encrypt } from '../../common/utils/security/encrypt.js';
import { ProviderEnum } from '../../common/enums/user.enum.js';
import { sendOTPEmail } from '../../common/utils/email/sendOTPEmail.js';
import { OTPModel } from '../../DB/Models/OTP.model.js';
import { HttpError } from '../../common/errors/HttpError.js';
import { OAuth2Client } from 'google-auth-library';
import { generateTokens } from '../../common/utils/security/token.js';

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

  sendOTPEmail(user).catch((err) =>
    console.error('Failed to email OTP: ', err),
  );

  return user;
};

export const login = async ({ email, password }) => {
  // this hurts my soul more than it hurts yours
  let existingUser = await DatabaseRepo.findOne({
    Model: UserModel,
    filters: { email },
  });

  if (!existingUser) throw new HttpError(404, 'User does not exist');

  let { _id, roleValue, hashed_password } = existingUser;

  const matchedPassword = await compare(password, hashed_password);
  if (!matchedPassword) throw new HttpError(401, 'Invalid credentials');

  return generateTokens(_id, roleValue);
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

export const rotateToken = async (userId) => {
  const user = await DatabaseRepo.findOne({
    Model: UserModel,
    filters: { _id: userId },
  });

  if (!user) throw new HttpError(404, 'Account does not exist');

  const { accessToken: newAccessToken } = generateTokens(
    user._id,
    user.roleValue,
  );

  return newAccessToken;
};

export const resendOTP = async (userId) => {
  const [user, otp] = await Promise.all([
    DatabaseRepo.findOne({ Model: UserModel, filters: { _id: userId } }),
    DatabaseRepo.exists({ Model: OTPModel, filters: { authorId: userId } }),
  ]);

  if (!user) throw new HttpError(404, 'Account does not exist');
  if (user.verified) throw new HttpError(409, 'Account already verified');
  if (otp) return;

  await sendOTPEmail(user);
};

export const verifyOTP = async (userId, code) => {
  const [user, otp] = await Promise.all([
    DatabaseRepo.findOne({ Model: UserModel, filters: { _id: userId } }),
    DatabaseRepo.findOne({
      Model: OTPModel,
      filters: { authorId: userId, code },
    }),
  ]);

  if (!user || !otp) throw new HttpError(401, 'Invalid or expired OTP');
  if (user.verified) throw new HttpError(409, 'Account already verified');

  await otp.deleteOne();

  user.verified = true;
  await user.save();
};
