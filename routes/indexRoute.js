"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionStore = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
exports.sessionStore = {
    sessions: new Map(),
    getAllSessions(callback) {
        callback(null, Object.fromEntries(this.sessions));
    },
    addSession(sessionId, sessionData) {
        this.sessions.set(sessionId, sessionData);
    },
    revokeSession(sessionId, callback) {
        if (!this.sessions.has(sessionId)) {
            callback(new Error(`Session ID ${sessionId} not found.`));
        }
        else {
            this.sessions.delete(sessionId);
            callback();
        }
    },
};
router.get("/", (req, res) => {
    res.send("welcome");
});
router.get("/dashboard", checkAuth_1.ensureAuthenticated, (req, res) => {
    res.render("dashboard", {
        user: req.user,
        sessions: [],
    });
});
exports.default = router;
