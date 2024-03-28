import passport from 'passport';
import { ROLE_PERMISSION } from '../shared/config/roles.js';
import { ErrorCode, ErrorMessage } from '../shared/constants/error.constant.js';
import { CustomError } from '../utils/custom-error.js';

export const verifyCallback = (req, resolve, reject, requiredPermission) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new CustomError({ code: ErrorCode.UNAUTHORIZED, message: ErrorMessage.UNAUTHORIZED }));
  }
  req.user = user;

  if (requiredPermission.length) {
    const userPermissions = ROLE_PERMISSION.get(user.role);
    const hasPermission = requiredPermission.every((requiredRight) => userPermissions.includes(requiredRight));
    if (!hasPermission && req.params.userId !== user.id) {
      return reject(new CustomError({ code: ErrorCode.FORBIDDEN, message: ErrorMessage.FORBIDDEN }));
    }
  }

  resolve();
};

export const auth = (requiredPermission) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredPermission))(
      req,
      res,
      next,
    );
  })
    .then(() => next())
    .catch((err) => next(err));
};
