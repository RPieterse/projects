import { NextApiRequest, NextApiResponse } from "next";
import { UserDocument } from "app/models/user";
import { NextHandler } from "next-connect";

interface ExtendedRequest extends NextApiRequest {
  user?: UserDocument;
}

interface PermissionModel {
  path: string;
  roles: { role: string; methods: string[] }[];
}

export default (
  req: ExtendedRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const requestBase = `${req.headers["x-forwarded-proto"] || "http"}://${
    req.headers.host
  }`;
  const requestUrl = new URL(req.url!, requestBase);
  const permissions =
    require("app/middleware/permissions/permissions.json") as PermissionModel[];

  // get permission for current request
  const permission = permissions.find(
    (p: PermissionModel) => p.path === requestUrl.pathname
  );

  // if user is not logged in
  if (!req.user) {
    // check if permission includes guest role
    const guestPermission = permission?.roles.find((r) => r.role === "guest");

    // if permission has role guest and method is allowed, allow request
    if (guestPermission) {
      if (guestPermission.methods.includes(req.method!)) {
        return next();
      }
    }
    return res.status(401).json({ message: "Unauthorized" });
  }

  // if user is logged in check if path includes user role and method is allowed

  const userPermission = permission?.roles.find(
    (r) => r.role.toLowerCase() === req.user?.role.toLowerCase()
  );
  if (userPermission && userPermission.methods.includes(req.method!)) {
    return next();
  }

  return res.status(401).json({ message: "Unauthorized" });
};
