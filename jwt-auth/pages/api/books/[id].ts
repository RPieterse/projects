import handler from "app/middleware/next-connect";
import db from "app/database/index";

db.connect();

handler({}, "jwt").get(async (req, res) => {
  res.json({ id: req.query.id, name: "Book 1" });
});
