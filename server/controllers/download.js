import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { join } from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const download = async (req, res) => {
    
  const fileName = req.params.fileName;
  const dirname = __dirname.split('/').splice(0, __dirname.split('/').length - 1).join('/');

  const filePath = join(dirname, "uploads", fileName);
  

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
};
