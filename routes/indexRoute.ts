import express from "express";
import { ensureAdmin, forwardAuthenticated, ensureAuthenticated } from "../middleware/checkAuth";

declare module "express-session" {
  interface SessionData {
    passport?: { user: number };
  }
}
const router = express.Router();

interface SessionData {
  passport?: { user?: string };
}

export const sessionStore = {
  sessions: new Map<string, SessionData>(),

  getAllSessions(callback: (err: Error | null, sessions?: { [key: string]: SessionData }) => void): void {
    callback(null, Object.fromEntries(this.sessions));
  },

  addSession(sessionId: string, sessionData: SessionData): void {
    this.sessions.set(sessionId, sessionData);
  },

  revokeSession(sessionId: string, callback: (err?: Error) => void): void {
    if (!this.sessions.has(sessionId)) {
      callback(new Error(`Session ID ${sessionId} not found.`));
    } else {
      this.sessions.delete(sessionId);
      callback();
    }
  },
};

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
    sessions: [],
  });
});


export default router;
