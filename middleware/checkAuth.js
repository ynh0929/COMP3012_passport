"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forwardAuthenticated = exports.ensureAdmin = exports.ensureAuthenticated = void 0;
const ensureAuthenticated = (req, res, next) => {
    // if the user is authenticated, continue with the request
    if (req.isAuthenticated()) {
        return next();
    }
    // if the user is not authenticated, redirect to the login page
    res.redirect("/auth/login");
};
exports.ensureAuthenticated = ensureAuthenticated;
const ensureAdmin = (req, res, next) => {
    // if the user is authenticated and has the role of admin, continue with the request
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    // if the user is not authenticated or does not have the role of admin, redirect to the login page
    res.redirect("/auth/login");
};
exports.ensureAdmin = ensureAdmin;
/*
FIX ME (types) 😭
*/
const forwardAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/dashboard");
};
exports.forwardAuthenticated = forwardAuthenticated;
