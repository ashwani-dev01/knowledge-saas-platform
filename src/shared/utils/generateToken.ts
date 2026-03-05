import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
  organizationId: number;
}

export const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};