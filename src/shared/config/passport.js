import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { User } from '../../models/user.model.js';
import { TOKEN_TYPE } from '../constants/app.constant.js';
import { GlobalConfig } from './globalConfig.js';

const jwtOptions = {
  secretOrKey: GlobalConfig.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== TOKEN_TYPE.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
