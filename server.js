require("dotenv").config();

const express = require("express");
const helmet = require("helmet");

const sessionMiddleware = require("./src/config/session");
const authRoutes = require("./src/routes/auth");

const app = express();

const PORT = process.env.PORT || 3000;

// Validate environment configuration
if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is missing.");
}

// Security headers
app.use(helmet());

// Request parsing
app.use(express.json({ limit: "10kb" }));

// Session configuration
app.use(sessionMiddleware);

// Home route
app.get("/", (req, res) => {
    res.json({
        project: "Secure Authentication Lab",
        status: "Running",
        message: "Authentication service is operational."
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Resource not found."
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error("Server error:", error.message);

    if (res.headersSent) {
        return next(error);
    }

    res.status(500).json({
        success: false,
        message: "Internal server error."
    });
});

// Start server
app.listen(PORT, () => {
    console.log("================================");
    console.log("SECURE AUTHENTICATION LAB");
    console.log(`Server running on port ${PORT}`);
    console.log("================================");
});