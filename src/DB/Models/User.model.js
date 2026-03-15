import { model, Schema } from 'mongoose';
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from '../../common/enums/user.enum.js';

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
      required: function () {
        return this.provider === ProviderEnum.System;
      },
    },
    phone: String, // is this supposed to be unique? never used Saraha before
    birth_date: Date,
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      get: (val) => Object.keys(GenderEnum)[val],
    },
    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.User,
      get: (val) => Object.keys(RoleEnum)[val],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    provider: {
      type: Number,
      enum: Object.values(ProviderEnum),
      required: true,
      get: (val) => Object.keys(ProviderEnum)[val],
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model('User', userSchema);
