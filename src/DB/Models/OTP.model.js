import { model, Schema } from 'mongoose';

const OTPSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

export const OTPModel = model('OTP', OTPSchema);
