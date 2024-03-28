import httpStatus from 'http-status';
import { gameService } from '../services/index.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { pick } from '../utils/pick.js';

const createGame = asyncHandler(async (req, res) => {
  const createdGame = await gameService.createGame(req.body);
  res.status(httpStatus.CREATED).send({ games: createdGame });
});

const queryGames = asyncHandler(async (req, res) => {
  const name = req.query.name || undefined;
  const filter = pick(req.query, ['category', 'platform', 'genre']);
  const queryOption = pick(req.query, ['sortBy', 'limit', 'page']);

  const searchCondition = {
    name: new RegExp(name, 'i'),
  };
  const filterCondition = Object.keys(filter).reduce((filterObject, key) => {
    filterObject[key] = {};
    filterObject[key].$in = filter[key];
    return filterObject;
  }, {});

  const result = await gameService.queryGames(
    {
      ...searchCondition,
      ...filterCondition,
    },
    queryOption,
  );

  res.status(httpStatus.OK).send({ result });
});

const queryOneGame = asyncHandler(async (req, res) => {
  const game = await gameService.getGameById(req.params.gameId);
  res.status(httpStatus.OK).send({ game });
});

const updateGame = asyncHandler(async (req, res) => {
  const updatedGame = await gameService.updateGame(req.params.gameId, req.body);
  res.status(httpStatus.OK).send({ updatedGame });
});

const deleteGame = asyncHandler(async (req, res) => {
  const deletedGame = await gameService.deleteGame(req.params.gameId);
  res.status(httpStatus.OK).send({ deletedGame });
});

export default {
  createGame,
  queryGames,
  queryOneGame,
  updateGame,
  deleteGame,
};
