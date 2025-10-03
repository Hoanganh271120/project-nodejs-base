import { jest } from '@jest/globals';
import gameService from './game.service.js';
import { Game } from '../models/game.model.js';
import { CustomError } from '../utils/custom-error.js';

jest.mock('../models/game.model.js');

// Manually mock static methods
Game.isGameNameTaken = jest.fn();
Game.create = jest.fn();
Game.paginate = jest.fn();
Game.findById = jest.fn();
Game.deleteOne = jest.fn();

describe('Game Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGame', () => {
    it('should throw error if game name is taken', async () => {
      Game.isGameNameTaken.mockResolvedValue(true);
      await expect(gameService.createGame({ username: 'test' })).rejects.toThrow(CustomError);
    });

    it('should create and return game if name is not taken', async () => {
      Game.isGameNameTaken.mockResolvedValue(false);
      Game.create.mockResolvedValue({ name: 'test' });
      const result = await gameService.createGame({ name: 'test' });
      expect(result).toEqual({ name: 'test' });
    });
  });

  describe('queryGames', () => {
    it('should return paginated games', async () => {
      Game.paginate.mockResolvedValue({ data: [], page: 1, limit: 10, totalPages: 1, totalResults: 0 });
      const result = await gameService.queryGames({}, {});
      expect(result).toHaveProperty('data');
    });
  });

  describe('getGameById', () => {
    it('should throw error if game not found', async () => {
      Game.findById.mockResolvedValue(null);
      await expect(gameService.getGameById('id')).rejects.toThrow(CustomError);
    });

    it('should return game if found', async () => {
      Game.findById.mockResolvedValue({ name: 'test' });
      const result = await gameService.getGameById('id');
      expect(result).toEqual({ name: 'test' });
    });
  });

  describe('updateGame', () => {
    let save;
    let mockGame;
    beforeEach(() => {
      save = jest.fn();
      mockGame = { name: 'old', save };
      gameService.getGameById = jest.fn().mockResolvedValue(mockGame);
    });

    it('should throw error if new name is taken', async () => {
      Game.isGameNameTaken.mockResolvedValue(true);
      await expect(gameService.updateGame('id', { name: 'new' })).rejects.toThrow(CustomError);
    });
  });

  describe('deleteGame', () => {
    it('should delete and return result', async () => {
      Game.deleteOne.mockResolvedValue({ deletedCount: 1 });
      const result = await gameService.deleteGame('id');
      expect(result).toEqual({ deletedCount: 1 });
    });
  });
});
