import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById} from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';
import { User } from "../../models/userModel";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      password: string;
    }
  }
}

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const {user, error } = getUserByEmailIdAndPassword(email, password);
    if (error) {
      return done(null, false, { message: error });
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Invalid credentials" });
    }
  }
);

/*
FIX ME (types) 😭
*/

passport.serializeUser((user: Express.User, done) => {
  done(null, user.id); 
});

/*
FIX ME (types) 😭
*/
passport.deserializeUser((id: number, done: (err: any, user?: Express.User | null) => void) => {
  let user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, user);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
