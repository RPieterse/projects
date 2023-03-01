import handler from "app/middleware/next-connect";
import { deleteCookie } from "cookies-next";

handler({}, "jwt").delete(async (req, res) => {
  deleteCookie("auth_token", { req, res });
  return res.status(200).send(true);
});
