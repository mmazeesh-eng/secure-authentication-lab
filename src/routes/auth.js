const express = require("express");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const loginLimiter = require("../middleware/rateLimit");

const router = express.Router();

// Temporary local user storage
const users = new Map();

// Registration validation
const registerSchema = z.object({
    email: z.string().trim().email().max(254),
    password: z.string()
        .min(12)
        .refine(
            (value) => Buffer.byteLength(value, "utf8") <= 72,
            "Password is too long"
        )
});

// Login validation
const loginSchema = z.object({
    email: z.string().trim().email().max(254),
    password: z.string().min(1).max(72)
});

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const result = registerSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid registration details."
            });
        }

        const email = result.data.email.toLowerCase();
        const password = result.data.password;

        if (users.has(email)) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        users.set(email, {
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "Account registered successfully."
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to complete registration."
        });
    }
});

// LOGIN
router.post("/login", loginLimiter, async (req, res) => {
    try {
        const result = loginSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const email = result.data.email.toLowerCase();
        const password = result.data.password;

        const user = users.get(email);

        const passwordMatches = user
            ? await bcrypt.compare(password, user.password)
            : false;

        if (!user || !passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        req.session.regenerate((error) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Unable to create a secure session."
                });
            }

            req.session.user = {
                email: user.email
            };

            req.session.save((saveError) => {
                if (saveError) {
                    return res.status(500).json({
                        success: false,
                        message: "Unable to create a secure session."
                    });
                }

                return res.json({
                    success: true,
                    message: "Login successful."
                });
            });
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Authentication service unavailable."
        });
    }
});

// CHECK SESSION
router.get("/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    return res.json({
        success: true,
        user: req.session.user
    });
});

// LOGOUT
router.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: "Unable to complete logout."
            });
        }

        res.clearCookie("student_portal.sid", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/"
        });

        return res.json({
            success: true,
            message: "Logged out successfully."
        });
    });
});

module.exports = router;