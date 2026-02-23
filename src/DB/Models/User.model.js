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
    phone: String,
    birth_date: Date,
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      required: true,
    },
    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.User,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model('User', userSchema);
