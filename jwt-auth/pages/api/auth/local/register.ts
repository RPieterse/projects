import handler from "app/middleware/next-connect";
import User from "app/models/user";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";

handler().post(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  try {
    const user = await User.create({ email, password });
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
      maxAge: 60 * 60 * 24,
    });

    res.status(200).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});
