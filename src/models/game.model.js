import mongoose from 'mongoose';
import { CATEGORY_ENUM, GENRE_ENUM, PLATFORM_ENUM } from '../shared/constants/app.constant.js';
import { paginate, toJSON } from './plugins/index.plugin.js';

const gameSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    thumbnail: {
      type: String,
    },
    category: {
      type: [String],
      enum: CATEGORY_ENUM,
      default: [],
    },
    genre: {
      type: [String],
      enum: GENRE_ENUM,
      default: [],
    },
    platform: {
      type: [String],
      enum: PLATFORM_ENUM,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
gameSchema.plugin(toJSON);
gameSchema.plugin(paginate);

gameSchema.index({ name: 'text' });

/**
 * Check if username is taken
 * @param {string} name - Game name
 * @param {ObjectId} [excludeGameId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
gameSchema.statics.isGameNameTaken = async function (name, excludeUserId) {
  const game = await this.findOne({ name, _id: { $ne: excludeUserId } });
  return !!game;
};

export const Game = mongoose.model('Game', gameSchema);
