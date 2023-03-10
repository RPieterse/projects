import handler from "@root/middleware/next-connect";
import User from "@root/models/user";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { isEmail, isValidPassword } from "@root/helpers/strings";

export const validate = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  switch (req.method?.toLowerCase()) {
    case "post":
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: "Email and password required" });
      }
      if (!isEmail(req.body.email)) {
        return res.status(400).json({ error: "Email is invalid" });
      }
      if (!isValidPassword(req.body.password)) {
        return res.status(400).json({ error: "Password is invalid" });
      }
      return next();
    default:
      return next();
  }
};

export const login = async (req: NextApiRequest, res: NextApiResponse) => {
  // login user with email and password using the findByEmailAndPassword method from the user model and return the user and jwt token as n http only cookie
  const { email, password } = req.body;
  try {
    const user = await User.findByEmailAndPassword(email, password);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
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

    res.status(200).json(user.sanitize());
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export default handler({ validate, authentication: "jwt" }).post(login);
