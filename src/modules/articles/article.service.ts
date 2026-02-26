import prisma from "../../shared/config/prisma";

export const createArticle = async (
  title: string,
  content: string,
  authorId: number,
  organizationId: number
) => {
  return prisma.article.create({
    data: {
      title,
      content,
      authorId,
      organizationId,
      isPublished: true,
    },
  });
};

export const getAllArticles = async (organizationId: number) => {
  return prisma.article.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });
};

export const getArticleById = async (
  id: number,
  organizationId: number
) => {
  return prisma.article.findFirst({
    where: {
      id,
      organizationId,
    },
  });
};