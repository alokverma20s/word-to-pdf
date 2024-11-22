import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";

// Your existing code

dotenv.config();


const app = express();
const port = process.env.PORT || 4000;

app.use(json());

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
));

import uploadRoutes from "./routes/uploads.js";
import downloadRoutes from "./routes/download.js";

app.use('/api', uploadRoutes);
app.use('/download', downloadRoutes);


app.get("/", (_, res) => {
  return res.status(200).json({
    success: true,
    message: "Hello From the server.",
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
