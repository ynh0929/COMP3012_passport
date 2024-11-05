import express from "express";
import { ensureAuthenticated } from "../middleware/checkAuth";
import { ensureAdmin } from "../middleware/checkAuth";

const router = express.Router();

interface SessionData {
  passport?: { user?: string };
}

const sessionStore = {
  sessions: new Map<string, SessionData>(),
  getAllSessions(callback: (err: Error | null, sessions?: { [key: string]: SessionData }) => void): void {
    callback(null, Object.fromEntries(this.sessions));
  },
  revokeSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  },
};

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
    sessionId: req.sessionID,
  });
});



export default router;
