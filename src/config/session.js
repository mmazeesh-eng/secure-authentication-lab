const session = require("express-session");

const sessionMiddleware = session({
    name: "student_portal.sid",

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    rolling: true,

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    }
});

module.exports = sessionMiddleware;