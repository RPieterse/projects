import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  JwtFromRequestFunction,
} from "passport-jwt";
import User from "@root/models/user";

interface JwtPayload {
  id: string;
  // Add any other properties from your JWT payload here
}

const cookieExtractor: JwtFromRequestFunction = (req: any) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["auth_token"];
  }
  return token;
};

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    cookieExtractor,
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload: JwtPayload, done) => {
    if (!jwtPayload.id) return done(null, false);

    try {
      const user = await User.findById(jwtPayload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);
