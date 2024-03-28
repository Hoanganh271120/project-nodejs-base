import mongoose from 'mongoose';
import { Game } from '../src/models/game.model.js';
import { User } from '../src/models/user.model.js';
import { GlobalConfig } from '../src/shared/config/globalConfig.js';
import { logger } from '../src/shared/config/logger.js';
import { seedAdmin, seedGames, seedUser } from './data.js';

mongoose
  .connect(GlobalConfig.mongoose.url, GlobalConfig.mongoose.options)
  .then(() => {
    logger.info('Connected to MongoDB to seed data');
  })
  .catch((error) => {
    logger.error(error);
  });

const seedDB = async () => {
  await Game.deleteMany({});
  await User.deleteMany();
  await User.insertMany(seedAdmin);
  await User.insertMany(seedUser);
  await Game.insertMany(seedGames);
};

seedDB().then(() => {
  logger.info('Seed data successfully.');
  mongoose.connection.close();
});
