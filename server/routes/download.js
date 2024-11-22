import { Router } from "express";
import { download } from "../controllers/download.js";

const router = Router();

router.get("/:fileName", download);

export default router;