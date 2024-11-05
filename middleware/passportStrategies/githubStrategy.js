"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_github2_1 = require("passport-github2");
const userModel_1 = require("../../models/userModel");
const passport = require("passport");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID || "Ov23liRK1aHD1SNCB8er");
console.log("GITHUB_CLIENT_SECRET:", process.env.GITHUB_CLIENT_SECRET || "2cae66a0443a70a224f31d23a9b78fdfdb4b0232");
console.log("GITHUB_CALLBACK_URL:", process.env.GITHUB_CALLBACK_URL || "http://localhost:8000/auth/github/callback");
const githubStrategy = new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!profile.username) {
            return done(new Error('No username found in profile'), null);
        }
        let user = yield userModel_1.userModel.findOne(profile.id);
        if (!user) {
            user = yield userModel_1.userModel.create({
                name: profile.username,
                email: "",
                password: "",
                role: 'user',
            });
        }
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
passport.use('github', githubStrategy);
const passportGitHubStrategy = {
    name: 'github',
    strategy: githubStrategy,
};
exports.default = passportGitHubStrategy;
