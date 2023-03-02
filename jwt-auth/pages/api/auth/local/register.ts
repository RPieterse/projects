import handler from "app/middleware/next-connect";
import User from "app/models/user";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import stringHelpers from "app/helpers/strings";
import { NextHandler } from "next-connect";
import mongoose from "mongoose";

const validate = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  switch (req.method?.toLowerCase()) {
    case "post":
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Email and password required" });
      }
      if (!stringHelpers.isEmail(req.body.email)) {
        return res.status(400).json({ message: "Email is invalid" });
      }
      if (!stringHelpers.isValidPassword(req.body.password)) {
        return res.status(400).json({ message: "Password is invalid" });
      }
      return next();
    default:
      return next();
  }
};

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({
      email,
      password,
      username: email.split("@")[0],
      role: "user",
    }).catch((err) => {
      return res
        .status(400)
        .json({ message: (err as mongoose.Error.ValidationError).errors });
    });
    if (!user) {
      return res.status(400).json({ message: "User not created" });
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
    res.status(400).json({ message: err.message });
  }
};

handler({ validate }).post(register);
