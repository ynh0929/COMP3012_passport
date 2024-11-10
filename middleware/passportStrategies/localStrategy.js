"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const userController_1 = require("../../controllers/userController");
const localStrategy = new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => {
    const { user, error } = (0, userController_1.getUserByEmailIdAndPassword)(email, password);
    if (error) {
        return done(null, false, { message: error });
    }
    if (user) {
        return done(null, user);
    }
    else {
        return done(null, false, { message: "Your login details are not valid. Please try again" });
    }
});
/*
FIX ME (types) 😭
*/
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
/*
FIX ME (types) 😭
*/
passport_1.default.deserializeUser((id, done) => {
    let user = (0, userController_1.getUserById)(id);
    if (user) {
        done(null, user);
    }
    else {
        done({ message: "User not found" }, user);
    }
});
const passportLocalStrategy = {
    name: 'local',
    strategy: localStrategy,
};
exports.default = passportLocalStrategy;
