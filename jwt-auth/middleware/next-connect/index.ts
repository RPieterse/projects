import { NextApiRequest, NextApiResponse } from "next";
import nc, { Options } from "next-connect";
import passport from "passport";
import handlePermissions from "app/middleware/permissions/handlePermissions";
import db from "app/database/index";

const handler = (options: Options<NextApiRequest, NextApiResponse>) =>
  nc<NextApiRequest, NextApiResponse>(options);

export default (
  options?: Options<NextApiRequest, NextApiResponse>,
  authentication?: "jwt"
) => {
  const _h = handler({
    onError(error, _, res) {
      res
        .status(501)
        .json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
      res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
    ...options,
  });

  if (authentication && authentication !== "jwt") {
    throw new Error("Invalid authentication method");
  }

  if (authentication) {
    _h.use(passport.authenticate(authentication, { session: false }));
  }
  _h.use(handlePermissions);
  _h.use(() => db.connect());

  return _h;
};
