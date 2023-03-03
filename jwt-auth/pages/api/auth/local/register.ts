import handler from "@root/middleware/next-connect";
import User from "@root/models/user";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import stringHelpers from "@root/helpers/strings";
import { NextHandler } from "next-connect";

export const validate = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  switch (req.method?.toLowerCase()) {
    case "put":
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: "Email and password required" });
      }
      if (!stringHelpers.isEmail(req.body.email)) {
        return res.status(400).json({ error: "Email is invalid" });
      }
      if (!stringHelpers.isValidPassword(req.body.password)) {
        return res.status(400).json({ error: "Password is invalid" });
      }
      return next();
    default:
      return next();
  }
};

export const register = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({
      email,
      password,
      username: email.split("@")[0],
      role: "user",
    });

    if (!user) {
      return res.status(400).json({ error: "User not created" });
    }

    // create jwt token using jwt
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    // set jwt token as http only cookie using cookies-next that expires in 1 day
    setCookie("auth_token", token, {
      res,
      req,
      httpOnly: true,
      maxAge: parseInt(process.env.COOKIE_EXPIRE || "86400"),
    });
    return res.status(200).json(user.sanitize());
  } catch (err: any) {
    if (err.message.includes("duplicate key error")) {
      return res.status(400).json({ error: "Email already exists" });
    }
    return res.status(400).json({ error: err.message });
  }
};

export default handler({ validate, authentication: "jwt" }).put(register);
