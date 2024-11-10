"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const checkAuth_1 = require("../middleware/checkAuth");
const indexRoute_1 = require("./indexRoute");
const router = express_1.default.Router();
router.get("/login", checkAuth_1.forwardAuthenticated, (req, res) => {
    console.log(typeof req.flash);
    res.render("login", { messages: { error: req.flash("error") } });
});
router.get("/github", passport_1.default.authenticate("github", { scope: ['user:email'] }));
router.get("/github/callback", passport_1.default.authenticate("github", {
    failureRedirect: "/login",
}), function (req, res) {
    res.redirect("/dashboard");
});
router.post("/login", passport_1.default.authenticate("local", {
    failureRedirect: "/auth/login",
    /* FIX ME: 😭 failureMsg needed when login fails */
    failureFlash: true,
}), (req, res) => {
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
});
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
            res.clearCookie("connect.sid", { path: "/" });
            res.redirect("/auth/login");
        });
    });
});
// Admin route
router.get("/admin", checkAuth_1.ensureAdmin, (req, res) => {
    indexRoute_1.sessionStore.getAllSessions((err, sessions) => {
        if (err) {
            console.error("Error retrieving sessions:", err);
            return res.render("admin", {
                user: req.user,
                sessions: [],
                error: "Error retrieving sessions",
            });
        }
        const activeSessions = sessions ? Object.entries(sessions).map(([sessionId, sessionData]) => {
            var _a;
            return ({
                sessionId,
                userId: ((_a = sessionData.passport) === null || _a === void 0 ? void 0 : _a.user) || "Unknown",
            });
        }) : [];
        res.render("admin", { user: req.user, sessions: activeSessions });
    });
});
// Revoke session
router.post("/admin", checkAuth_1.ensureAdmin, (req, res) => {
    const sessionId = req.body.sessionId;
    if (!sessionId) {
        return res.status(400).send("Session ID is required");
    }
    indexRoute_1.sessionStore.revokeSession(sessionId, (err) => {
        if (err) {
            console.error("Error revoking session:", err);
            return res.status(500).send("Error revoking session.");
        }
        console.log("Session revoked successfully:", sessionId);
        res.redirect("/auth/admin");
    });
});
exports.default = router;
