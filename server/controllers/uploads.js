import { exec } from "child_process";
const convertAsync = promisify(convert);
import { convert } from "libreoffice-convert";
import { promisify } from "util";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { join, basename } from "path";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 4000;

function scheduleFileDeletion(filePath, delay = 5 * 60 * 1000) {
  setTimeout(() => {
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
  }, delay);
}

export const upload = async (req, res) => {
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
};

export const convertTopdf = async (req, res) => {
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
          scheduleFileDeletion(finalPdfPath);
          scheduleFileDeletion(filePath);

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
      scheduleFileDeletion(pdfPath);
      scheduleFileDeletion(filePath);
      res.status(200).json({
        message: "File converted successfully.",
        downloadUrl: `http://localhost:${port}/download/${basename(pdfPath)}`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error converting file." });
  }
};
