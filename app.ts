import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import path from "path";
import passportMiddleware from './middleware/passportMiddleware';
import authRoute from "./routes/authRoute";
import indexRoute from "./routes/indexRoute";
import dotenv from "dotenv";
import { sessionStore } from "./routes/indexRoute"; 

dotenv.config();

const port = process.env.port || 8000;

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: new session.MemoryStore(),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use (flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
passportMiddleware(app);

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.session);
  console.log("Session ID: " , req.sessionID);

  console.log(`Session details are: `);
  console.log((req.session as any).passport);

  const sessionId = req.sessionID;
  const sessionData = {
    ...req.session,
    passport: {
      ...req.session.passport,
      user: String(req.session.passport?.user)
    }
  };
  if (req.session) {
    sessionStore.addSession(sessionId, sessionData);
  }
  next();
});

app.use("/", indexRoute);
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});
