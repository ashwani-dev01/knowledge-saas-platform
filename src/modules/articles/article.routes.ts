import { Router } from "express";
import { create, getAll, getOne } from "./article.controller";
import { authenticate } from "../../shared/middleware/auth.middleware";



const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, getAll);
router.get("/:id", authenticate, getOne);

export default router;