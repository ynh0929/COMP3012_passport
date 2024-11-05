"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const checkAuth_1 = require("../middleware/checkAuth");
const express_session_1 = require("express-session");
const router = express_1.default.Router();
const sessionStore = new express_session_1.MemoryStore();
router.get("/login", checkAuth_1.forwardAuthenticated, (req, res) => {
    console.log(typeof req.flash);
    res.render("login", { messages: { error: req.flash("error") } });
});
router.get("/github", passport_1.default.authenticate("github"));
router.get("/github/callback", passport_1.default.authenticate("github", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true,
}));
router.post("/login", passport_1.default.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    /* FIX ME: 😭 failureMsg needed when login fails */
    failureFlash: true,
}), (req, res) => {
    console.log("Session after login:", req.session);
});
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
router.get("/dashboard", checkAuth_1.ensureAdmin, (req, res) => {
    sessionStore.all((err, sessions) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error retrieving sessions");
        }
        const activeSessions = sessions
            ? Object.entries(sessions).map(([sessionId, sessionData]) => {
                var _a;
                return ({
                    sessionId,
                    userId: (_a = sessionData.passport) === null || _a === void 0 ? void 0 : _a.user,
                });
            })
            : []; // No active sessions
        console.log("Active sessions:", activeSessions);
        res.render("dashboard", { user: req.user, sessions: activeSessions });
    });
});
// Route to revoke a specific session by ID
router.post("/dashboard", checkAuth_1.ensureAdmin, (req, res) => {
    const sessionId = req.body.sessionID;
    req.sessionStore.destroy(sessionId, (err) => {
        if (err) {
            console.error("Error revoking session:", err);
            return res.status(500).send("Error revoking session.");
        }
        res.redirect("/auth/login");
    });
});
exports.default = router;
