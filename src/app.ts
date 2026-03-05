import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import { authenticate } from "./shared/middleware/auth.middleware";
import articleRoutes from "./modules/articles/article.routes";
import { globalErrorHandler } from "./shared/middleware/error.middleware";
import { setupSwagger } from "./docs/swagger";

const app = express();

app.use(express.json());
setupSwagger(app);
app.use(cors());
app.use(helmet());
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use(globalErrorHandler);
app.get("/health", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route working 🚀",
  });
});

export default app;