import { Request, Response } from "express";
import { registerOrganization, loginUser } from "./auth.service";
import { generateToken } from "../../shared/utils/generateToken";

export const register = async (req: Request, res: Response) => {
  try {
    const { orgName, name, email, password } = req.body;

    const { user, organization } = await registerOrganization(
      orgName,
      name,
      email,
      password
    );

    const token = generateToken({
      userId: user.id,
      organizationId: organization.id,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: "Organization created successfully",
      token,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    const token = generateToken({
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};