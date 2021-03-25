'use strict'

import config from '../config';
import User from '../models/user.model';
import passportJWT from 'passport-jwt';

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const jwtOptions = {
  secretOrKey: config.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const jwtStrategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  User.findById(jwtPayload.sub, (err, user) => {
    if (err) {
      return done(err, null)
    }

    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  })
})

export { jwtOptions, jwtStrategy }
