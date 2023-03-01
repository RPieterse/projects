import handler from "app/middleware/next-connect";
import { deleteCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

const signOut = async (req: NextApiRequest, res: NextApiResponse) => {
  deleteCookie("auth_token", { req, res });
  return res.status(200).send(true);
};

handler({ authentication: "jwt" }).delete(signOut);
