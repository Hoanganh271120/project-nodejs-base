import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { ROLE_ENUM } from '../shared/config/roles.js';
import { MIN_PASSWORD_LENGTH } from '../shared/constants/app.constant.js';
import { paginate, toJSON } from './plugins/index.plugin.js';

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: ROLE_ENUM,
      default: ROLE_ENUM.USER,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if username is taken
 * @param {string} username - Username
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
  const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, MIN_PASSWORD_LENGTH);
  }
  next();
});

export const User = mongoose.model('User', userSchema);
