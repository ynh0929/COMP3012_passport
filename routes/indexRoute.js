"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
const sessionStore = {
    sessions: new Map(),
    getAllSessions(callback) {
        callback(null, Object.fromEntries(this.sessions));
    },
    revokeSession(sessionId) {
        this.sessions.delete(sessionId);
    },
};
router.get("/", (req, res) => {
    res.send("welcome");
});
router.get("/dashboard", checkAuth_1.ensureAuthenticated, (req, res) => {
    res.render("dashboard", {
        user: req.user,
        sessionId: req.sessionID,
    });
});
exports.default = router;
