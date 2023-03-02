import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler, Options } from "next-connect";
import passport from "passport";
import handlePermissions from "@root/middleware/permissions/handlePermissions";
import db from "@root/database/index";
import "@root/middleware/passport/jwt";

const handler = (options: Options<NextApiRequest, NextApiResponse>) =>
  nc<NextApiRequest, NextApiResponse>(options);

export default (config?: {
  options?: Options<NextApiRequest, NextApiResponse>;
  authentication?: "jwt";
  validate?: (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextHandler
  ) => void;
  middleware?: ((
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextHandler
  ) => void)[];
}) => {
  // Destructure config object
  const { options, authentication, validate, middleware } = config || {};

  // This is the handler that is returned from this function with default options
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

  // Check authentication method
  if (authentication && authentication !== "jwt") {
    throw new Error("Invalid authentication method");
  }

  // Connect to database
  if (process.env.USE_MEMORY_DB === "true") {
    _h.use(
      async (_1: NextApiRequest, _2: NextApiResponse, next: NextHandler) => {
        await db.connectMemoryDb();
        next();
      }
    );
  } else {
    _h.use(
      async (_1: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
        try {
          await db.connect();
          next();
        } catch (err) {
          console.log(err);
          res.status(500).json({ error: "Something went wrong on our side!" });
        }
      }
    );
  }

  // Authenticate request
  if (authentication) {
    _h.use(
      async (req: NextApiRequest, _2: NextApiResponse, next: NextHandler) => {
        if (
          req.headers?.authorization &&
          req.headers?.authorization.startsWith("Bearer ")
        ) {
          _h.use(passport.authenticate(authentication, { session: false }));
        }
        if (req.cookies?.auth_token) {
          _h.use(
            passport.authenticate(authentication, {
              session: false,
            })
          );
        }
        next();
      }
    );
    _h.use(handlePermissions);
  }

  // Validate request body
  if (typeof validate === "function") {
    _h.use(validate);
  }

  // Add custom middleware
  if (
    middleware &&
    Array.isArray(config?.middleware) &&
    middleware.length > 0
  ) {
    middleware.forEach((m) => _h.use(m));
  }

  return _h;
};
