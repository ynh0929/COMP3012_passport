import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById} from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';

declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
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
    const {user, error} = getUserByEmailIdAndPassword(email, password);
    if(error){
      return done(null, false, { message: error });
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Your login details are not valid. Please try again" });
    }
  }
);

/*
FIX ME (types) 😭
*/

passport.serializeUser((user: Express.User, done: (err: any, id?: number) => void) => {
  done(null, user.id); 
});

/*
FIX ME (types) 😭
*/
passport.deserializeUser((id: number, done: (err: any, user?: Express.User | false | null) => void) => {
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
