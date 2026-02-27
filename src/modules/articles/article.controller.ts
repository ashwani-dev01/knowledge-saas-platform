import { Response } from "express";
import prisma from "../../shared/config/prisma";
import { AuthRequest } from "../../shared/middleware/auth.middleware";
import { createArticleSchema } from "../../validators/article.validator";
import { summarizeText } from "../ai/ai.service";

// =====================
// CREATE ARTICLE
// =====================


export const createArticle = async (req: AuthRequest, res: Response) => {
  try {

    const validatedData = createArticleSchema.parse(req.body);

    const article = await prisma.article.create({
      data: {
        ...validatedData,
        authorId: req.user.userId,
        organizationId: req.user.organizationId,
      },
    });

    res.status(201).json({
      success: true,
      data: article,
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.errors?.[0]?.message || error.message
    });
  }
};


// =====================
// GET ALL ARTICLES
// =====================
export const getAllArticles = async (req: AuthRequest, res: Response) => {
  try {

    const filter: any = {
      organizationId: req.user.organizationId
    };

    // VIEWER can only see published
    if (req.user.role === "VIEWER") {
      filter.isPublished = true;
    }

    const articles = await prisma.article.findMany({
      where: filter,
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json({
      success: true,
      data: articles,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch articles",
    });
  }
};


// =====================
// GET SINGLE ARTICLE
// =====================
export const getArticleById = async (req: AuthRequest, res: Response) => {
  try {

    const article = await prisma.article.findFirst({
      where: {
        id: Number(req.params.id),
        organizationId: req.user.organizationId
      }
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    // VIEWER cannot see unpublished
    if (req.user.role === "VIEWER" && !article.isPublished) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    res.status(200).json({
      success: true,
      data: article
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// UPDATE ARTICLE
// =====================
export const updateArticle = async (req: AuthRequest, res: Response) => {
  try {

    const article = await prisma.article.findFirst({
      where: {
        id: Number(req.params.id),
        organizationId: req.user.organizationId
      }
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    // ADMIN can edit any
    // EDITOR can edit only own
    if (
      req.user.role === "EDITOR" &&
      article.authorId !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can edit only your own articles"
      });
    }

    // VIEWER cannot edit
    if (req.user.role === "VIEWER") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const updated = await prisma.article.update({
      where: { id: article.id },
      data: req.body
    });

    res.status(200).json({
      success: true,
      data: updated
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// DELETE ARTICLE
// =====================
export const deleteArticle = async (req: AuthRequest, res: Response) => {
  try {

    // Only ADMIN can delete
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only ADMIN can delete articles"
      });
    }

    const article = await prisma.article.findFirst({
      where: {
        id: Number(req.params.id),
        organizationId: req.user.organizationId
      }
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    await prisma.article.delete({
      where: { id: article.id }
    });

    res.status(200).json({
      success: true,
      message: "Article deleted successfully"
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// =====================
// SUMMARIZE ARTICLE (AI)
// =====================



export const summarizeArticle = async (req: AuthRequest, res: Response) => {
  try {

    const article = await prisma.article.findFirst({
      where: {
        id: Number(req.params.id),
        organizationId: req.user.organizationId
      }
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    // VIEWER cannot use AI
    if (req.user.role === "VIEWER") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // ✅ If summary already exists, return it (optional smart logic)
    if (article.summary) {
      return res.status(200).json({
        success: true,
        summary: article.summary,
        message: "Summary already exists"
      });
    }

    // 🔥 Generate summary
    const summary = await summarizeText(article.content);

    // 🔥 Save summary in database
    await prisma.article.update({
      where: { id: article.id },
      data: { summary }
    });

    res.status(200).json({
      success: true,
      summary
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

