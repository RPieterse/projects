import handler from "@root/middleware/next-connect";
import { deleteCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

export const signOut = async (req: NextApiRequest, res: NextApiResponse) => {
  deleteCookie("auth_token", { req, res });
  return res.status(200).send(true);
};

export default handler().delete(signOut);
