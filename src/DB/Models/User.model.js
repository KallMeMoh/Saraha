import { model, Schema } from 'mongoose';
import { GenderEnum, RoleEnum } from '../../common/enums/user.enum.js';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    phone: String, // is this supposed to be unique? never used Saraha before
    birth_date: Date,
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      required: true,
      get: (val) =>
        Object.keys(GenderEnum).find((key) => GenderEnum[key] === val),
    },
    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.User,
      get: (val) => Object.keys(RoleEnum).find((key) => RoleEnum[key] === val),
    },
    verified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model('User', userSchema);
