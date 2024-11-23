import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import https from "https";
import fs from 'fs';

const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

// Your existing code

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(json());

app.use(cors());

import uploadRoutes from "./routes/uploads.js";
import downloadRoutes from "./routes/download.js";

app.use("/", uploadRoutes);
app.use("/download", downloadRoutes);

app.get("/", (_, res) => {
  res.send("This is a Word to pdf API");
});

// Start the server
https.createServer(options, app).listen(4000, () => {
  console.log('Server running at https://localhost:4000/');
});
