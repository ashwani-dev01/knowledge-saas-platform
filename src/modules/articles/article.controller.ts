import { Request, Response } from "express";
import {
  createArticle,
  getAllArticles,
  getArticleById,
} from "./article.service";
import { AuthRequest } from "../../shared/middleware/auth.middleware";

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;

    const article = await createArticle(
      title,
      content,
      req.user.userId,
      req.user.organizationId
    );

    res.status(201).json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const articles = await getAllArticles(
      req.user.organizationId
    );

    res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOne = async (req: AuthRequest, res: Response) => {
  try {
    const article = await getArticleById(
      Number(req.params.id),
      req.user.organizationId
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};