import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler, Options } from "next-connect";
import passport from "passport";
import handlePermissions from "app/middleware/permissions/handlePermissions";
import db from "app/database/index";

const handler = (options: Options<NextApiRequest, NextApiResponse>) =>
  nc<NextApiRequest, NextApiResponse>(options);

export default (config?: {
  options?: Options<NextApiRequest, NextApiResponse>;
  authentication?: "jwt";
  useMemoryDb?: boolean;
  validate?: (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextHandler
  ) => void; // update function signature
}) => {
  const { options, authentication, useMemoryDb, validate } = config || {};
  const _h = handler({
    onError(error, _, res) {
      res
        .status(501)
        .json({ error: `Something went wrong on our side! ${error.message}` });
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
  if (useMemoryDb) {
    _h.use(() => db.connect("memory"));
  } else {
    _h.use(() => db.connect());
  }

  _h.use(handlePermissions);

  if (typeof validate === "function") {
    _h.use(validate);
  }

  return _h;
};
