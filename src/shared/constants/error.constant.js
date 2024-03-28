export const ErrorCode = {
  VALIDATION_FAILED: '400000',
  USER_NAME_EXIST: '400001',
  GAME_EXISTED: '400002',
  GAME_SEARCH_FAILED: '400003',
  GAME_NOT_FOUND: '400004',
  ROUTE_NOT_FOUND: '404001',
  UNAUTHORIZED: '401001',
  LOGIN_FAILED: '401002',
  FORBIDDEN: '403001',
};

export const ErrorMessage = {
  USER_NAME_EXIST: 'Username already taken',
  GAME_EXISTED: 'Game name already exist',
  GAME_SEARCH_FAILED: 'Cannot search game',
  GAME_NOT_FOUND: 'Game not found',
  ROUTE_NOT_FOUND: 'Not found route',
  UNAUTHORIZED: 'Please authenticate',
  LOGIN_FAILED: 'Incorrect username or password',
  FORBIDDEN: 'Missing required permission to perform this action',
};
