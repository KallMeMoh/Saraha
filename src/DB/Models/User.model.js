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
        return this.providerValue === ProviderEnum.System;
      },
    },
    phone: String, // is this supposed to be unique? never used Saraha before
    birth_date: Date,
    genderValue: {
      type: Number,
      enum: Object.values(GenderEnum),
    },
    roleValue: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.User,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    covers: {
      type: [String],
      default: [],
    },
    gallery: {
      type: [String],
      default: [],
    },
    provider: {
      type: Number,
      enum: Object.values(ProviderEnum),
      required: true,
    },
    visits: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema
  .virtual('gender')
  .get(function () {
    return Object.keys(GenderEnum).find(
      (key) => GenderEnum[key] === this.genderValue,
    );
  })
  .set(function (name) {
    const value = GenderEnum[name];
    if (value !== undefined || value !== null) this.genderValue = value;
  });

userSchema
  .virtual('role')
  .get(function () {
    return Object.keys(RoleEnum).find(
      (key) => RoleEnum[key] === this.roleValue,
    );
  })
  .set(function (name) {
    const value = RoleEnum[name];
    if (value !== undefined || value !== null) this.roleValue = value;
  });

userSchema.virtual('age').get(function () {
  if (!this.birth_date) return null;
  const diff = Date.now() - this.birth_date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});

export const UserModel = model('User', userSchema);
