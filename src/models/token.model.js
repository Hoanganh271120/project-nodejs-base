import mongoose from 'mongoose';
import { TOKEN_TYPE } from '../shared/constants/app.constant.js';
import { toJSON } from './plugins/index.plugin.js';

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [TOKEN_TYPE.REFRESH],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
export const Token = mongoose.model('Token', tokenSchema);
