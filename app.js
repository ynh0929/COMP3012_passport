"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const passportMiddleware_1 = __importDefault(require("./middleware/passportMiddleware"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const indexRoute_1 = __importDefault(require("./routes/indexRoute"));
const dotenv_1 = __importDefault(require("dotenv"));
const indexRoute_2 = require("./routes/indexRoute");
dotenv_1.default.config();
const port = process.env.port || 8000;
const app = (0, express_1.default)();
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use((0, express_session_1.default)({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: new express_session_1.default.MemoryStore(),
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
app.use((0, connect_flash_1.default)());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(passport_1.default.authenticate('session'));
// Middleware for express
app.use(express_1.default.json());
app.use(express_ejs_layouts_1.default);
app.use(express_1.default.urlencoded({ extended: true }));
(0, passportMiddleware_1.default)(app);
app.use((req, res, next) => {
    var _a;
    console.log(`User details are: `);
    console.log(req.user);
    console.log("Entire session object:");
    console.log(req.session);
    console.log("Session ID: ", req.sessionID);
    console.log(`Session details are: `);
    console.log(req.session.passport);
    const sessionId = req.sessionID;
    const sessionData = Object.assign(Object.assign({}, req.session), { passport: Object.assign(Object.assign({}, req.session.passport), { user: String((_a = req.session.passport) === null || _a === void 0 ? void 0 : _a.user) }) });
    if (req.session) {
        indexRoute_2.sessionStore.addSession(sessionId, sessionData);
    }
    next();
});
app.use("/", indexRoute_1.default);
app.use("/auth", authRoute_1.default);
app.listen(port, () => {
    console.log(`🚀 Server has started on port ${port}`);
});
