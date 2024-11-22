import express, { json } from "express";
import multer from "multer";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, basename } from "path";
import { convert } from "libreoffice-convert";
import { promisify } from "util";
// Promisify the convert function for async/await usage
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your existing code

dotenv.config();

const convertAsync = promisify(convert);
const app = express();
const port = process.env.PORT || 4000;

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Serve static files (e.g., HTML frontend)
app.use(json());

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
));

// Upload .docx and extract metadata
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Extract metadata (e.g., file size, name, and type)
    const metadata = {
      fileName,
      fileSize: `${(req.file.size / 1024).toFixed(2)} KB`,
      fileType: req.file.mimetype,
    };

    res.status(200).json({
      message: "File uploaded successfully.",
      metadata,
      filePath: filePath,
    });
  } catch (err) {
    res.status(500).json({ error: "Error uploading file." });
  }
});

import { exec } from "child_process";

// Convert .docx to PDF and add optional password
app.post("/api/convert", async (req, res) => {
  try {
    const { filePath, password } = req.body;

    if (!existsSync(filePath)) {
      return res.status(404).json({ error: "File not found." });
    }

    const inputFile = readFileSync(filePath);
    const pdfPath = join("uploads", `${basename(filePath, ".docx")}.pdf`);

    // Convert .docx to .pdf
    const pdfFile = await convertAsync(inputFile, ".pdf", undefined);
    writeFileSync(pdfPath, pdfFile);

    let finalPdfPath = pdfPath;

    // Add password protection if specified
    if (password) {
      const protectedPdfPath = join(
        "uploads",
        `${basename(filePath, ".docx")}-protected.pdf`
      );

      // Use qpdf to add password protection
      exec(
        `qpdf --encrypt ${password} ${password} 256 -- ${pdfPath} ${protectedPdfPath}`,
        (error, stdout, stderr) => {
          if (error) {
            console.error("Error protecting PDF:", stderr);
            return res
              .status(500)
              .json({ error: "Error adding password protection." });
          }

          finalPdfPath = protectedPdfPath;

          fs.unlinkSync(filePath);
          res.status(200).json({
            message: "File converted successfully.",
            downloadUrl: `http://localhost:${port}/download/${basename(
              finalPdfPath
            )}`,
          });
        }
      );
    } else {
      fs.unlinkSync(filePath);
      res.status(200).json({
        message: "File converted successfully.",
        downloadUrl: `http://localhost:${port}/download/${basename(pdfPath)}`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error converting file." });
  }
});

app.get("/", (_, res) => {
  return res.status(200).json({
    success: true,
    message: "Hello From the server.",
  });
});

// Download converted PDF
app.get("/download/:fileName", async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = join(__dirname, "uploads", fileName);

  if (!existsSync(filePath)) {
    return res.status(404).json({ error: "File not found." });
  }

  await res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
    } else {
      fs.unlinkSync(filePath);
      console.log("File deleted successfully.");
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
