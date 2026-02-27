import { Router } from "express";
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  summarizeArticle
} from "./article.controller";

import { authenticate } from "../../shared/middleware/auth.middleware";
import { authorize } from "../../shared/middleware/role.middleware";
import { validate } from "../../shared/middleware/validate.middleware";

import {
  createArticleSchema,
  updateArticleSchema
} from "../../validators/article.validator";

const router = Router();

// =====================
// CREATE ARTICLE
// ADMIN + EDITOR only
// =====================
router.post(
  "/",
  authenticate,
  authorize(["ADMIN", "EDITOR"]),
  validate(createArticleSchema),
  createArticle
);
router.post(
  "/:id/summarize",
  authenticate,
  authorize(["ADMIN", "EDITOR"]),
  summarizeArticle
);

// =====================
// GET ALL ARTICLES
// All authenticated users
// =====================
router.get(
  "/",
  authenticate,
  getAllArticles
);

// =====================
// GET SINGLE ARTICLE
// All authenticated users
// =====================
router.get(
  "/:id",
  authenticate,
  getArticleById
);

// =====================
// UPDATE ARTICLE
// ADMIN can update any
// EDITOR can update own (logic in controller)
// =====================
router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN", "EDITOR"]),
  validate(updateArticleSchema),
  updateArticle
);

// =====================
// DELETE ARTICLE
// ADMIN only
// =====================
router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  deleteArticle
);

export default router;