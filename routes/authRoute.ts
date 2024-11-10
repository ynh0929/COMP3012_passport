import express from "express";
import passport from 'passport';
import session from "express-session";
import { ensureAdmin, forwardAuthenticated, ensureAuthenticated } from "../middleware/checkAuth";
import { sessionStore } from "./indexRoute";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  console.log(typeof req.flash);
  res.render("login", { messages: {error: req.flash("error")} });
})

router.get("/github", passport.authenticate("github", { scope: ['user:email'] }));

router.get("/github/callback", passport.authenticate("github", {
  failureRedirect: "/login",}),
  function(req, res) {
    res.redirect("/dashboard");
  });

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    /* FIX ME: 😭 failureMsg needed when login fails */
    failureFlash: true,
  }),
  (req, res) => {
    console.log("Session after login:", req.session);
    console.log("User after login:", req.user);

     // Redirect based on role
     if (req.user && req.user.role === "admin") {
      res.redirect("/auth/admin"); 
    }  
    else if (req.user && req.user.role === "user") {
      res.redirect("/dashboard"); 
    }
    else {
      res.redirect("/auth/login");
    }
  }
  
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    //Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send({ error: 'Failed to destroy session' });
      }

      // Clear the session cookie and redirect to login
      res.clearCookie("connect.sid", {path: "/"});
      res.redirect("/auth/login");
    });
  });
});

// Admin route
router.get("/admin", ensureAdmin, (req, res) => {
  sessionStore.getAllSessions((err, sessions) => {
    if (err) {
      console.error("Error retrieving sessions:", err);
      return res.render("admin", {
        user: req.user,
        sessions: [],
        error: "Error retrieving sessions",
      });
    }

    const activeSessions = sessions ? Object.entries(sessions).map(([sessionId, sessionData]) => ({
        sessionId,
        userId: sessionData.passport?.user || "Unknown",
    })) : [];

    res.render("admin", { user: req.user, sessions: activeSessions });
  });
});

// Revoke session
router.post("/admin", ensureAdmin, (req, res) => {
  const sessionId = req.body.sessionId;
  if (!sessionId) {
    return res.status(400).send("Session ID is required");
  }

  sessionStore.revokeSession(sessionId, (err) => {
    if (err) {
      console.error("Error revoking session:", err);
      return res.status(500).send("Error revoking session.");
    }

    console.log("Session revoked successfully:", sessionId);
    res.redirect("/auth/admin");
  });
});

export default router;