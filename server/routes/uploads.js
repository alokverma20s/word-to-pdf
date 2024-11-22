import { Router } from "express";
import multer from "multer";
import { convertTopdf, upload } from "../controllers/uploads.js";

const router = Router();

// Multer setup for file uploads
const fileUpload = multer({ dest: "uploads/" });


router.post("/upload", fileUpload.single("file"), upload);
router.post("/convert", convertTopdf);


export default router;