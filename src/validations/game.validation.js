import Joi from 'joi';
import { CATEGORY_ENUM, GENRE_ENUM, MIN_UPDATE_FIELD, PLATFORM_ENUM } from '../shared/constants/app.constant.js';
import { objectId } from './custom.validation.js';

const createGame = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    category: Joi.array()
      .items(Joi.string().valid(...CATEGORY_ENUM))
      .default([])
      .single(),
    genre: Joi.array()
      .items(Joi.string().valid(...GENRE_ENUM))
      .default([])
      .single(),
    platform: Joi.array()
      .items(Joi.string().valid(...PLATFORM_ENUM))
      .default([])
      .single(),
    thumbnail: Joi.string(),
  }),
};

const queryGame = {
  params: Joi.object().keys({
    gameId: Joi.string().custom(objectId),
  }),
};

const queryGames = {
  query: Joi.object().keys({
    name: Joi.string(),
    category: Joi.array().items(Joi.string()).single(),
    platform: Joi.array().items(Joi.string()).single(),
    genre: Joi.array().items(Joi.string()).single(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateGame = {
  params: Joi.object().keys({
    gameId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      category: Joi.array().valid(...CATEGORY_ENUM),
      genre: Joi.array().valid(...GENRE_ENUM),
      platform: Joi.array().valid(...PLATFORM_ENUM),
      thumbnail: Joi.string(),
    })
    .min(MIN_UPDATE_FIELD),
};

const deleteGame = {
  params: Joi.object().keys({
    gameId: Joi.string().custom(objectId),
  }),
};

export default {
  createGame,
  queryGames,
  queryGame,
  updateGame,
  deleteGame,
};
