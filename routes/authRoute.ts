import express from "express";
import passport from 'passport';
import session from "express-session";
import { ensureAdmin, forwardAuthenticated, ensureAuthenticated } from "../middleware/checkAuth";
import { SessionData } from "express-session";
import { MemoryStore } from "express-session";

declare module "express-session" {
  interface SessionData {
    passport?: { user: string };
  }
}

const router = express.Router();
const sessionStore = new MemoryStore();

router.get("/login", forwardAuthenticated, (req, res) => {
  console.log(typeof req.flash);
  res.render("login", { messages: {error: req.flash("error")} });
})

router.get("/github", passport.authenticate("github"));

router.get("/github/callback", passport.authenticate("github", {
  successRedirect: "/dashboard",
  failureRedirect: "/auth/login",
  failureFlash: true,
}));

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    /* FIX ME: 😭 failureMsg needed when login fails */
    failureFlash: true,
  }),
  (req, res) => {
    console.log("Session after login:", req.session);
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ error: 'Failed to log out' });
    }
    // Destroy the session
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return res.status(500).send({ error: 'Failed to destroy session' });
      }

      // Clear the session cookie and redirect to login
      res.clearCookie("connect.sid");
      res.redirect("/auth/login");
    });
  });
});


// Admin route
router.get("/dashboard", ensureAdmin, (req, res) => {
  sessionStore.all((err: Error | null, sessions?: { [key: string]: any } | null) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error retrieving sessions");
    }

    const activeSessions = sessions
      ? Object.entries(sessions).map(([sessionId, sessionData]) => ({
          sessionId,
          userId: sessionData.passport?.user,
        }))
      : []; // No active sessions

    console.log("Active sessions:", activeSessions);
    res.render("dashboard", { user: req.user, sessions: activeSessions });
  });
});

// Route to revoke a specific session by ID
router.post("/dashboard", ensureAdmin, (req, res) => {
  const sessionId = req.body.sessionID;
  req.sessionStore.destroy(sessionId, (err) => {
  if (err) {
    console.error("Error revoking session:", err);
    return res.status(500).send("Error revoking session.");
  }
  res.redirect("/auth/login");
  });
});
export default router;
