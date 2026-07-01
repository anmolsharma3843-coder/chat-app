// index.js

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

import userRoutes from "./Routes/userRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import groupRoutes from "./Routes/groupRoutes.js";
import SearchRoutes from './Routes/SearchRoutes.js'

import { socketHandler } from "./Socket/socketHandler.js";
import { ConnectDB } from "./config/db.js";

dotenv.config();

const app = express();

// --------------------
// Middleware
// --------------------
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// --------------------
// Routes
// --------------------
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/groups", groupRoutes);
app.use('/search',SearchRoutes)
app.use('/uploads',express.static('uploads'))
// --------------------
// Test Route
// --------------------
app.get("/", (req, res) => {
  res.send("Chat Server Running 🚀");
});

// --------------------
// MongoDB Connection
// --------------------
ConnectDB()

// --------------------
// HTTP Server
// --------------------
const server = http.createServer(app);

// --------------------
// Socket.IO
// --------------------
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

socketHandler(io);

// --------------------
// Start Server
// --------------------
const PORT =
  process.env.PORT || 4600;


server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});