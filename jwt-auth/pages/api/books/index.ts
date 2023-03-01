import handler from "app/middleware/next-connect";
import db from "app/database/index";

db.connect();

handler({}, "jwt").get(async (_, res) => {
  res.json([
    { id: 1, name: "Book 1" },
    { id: 2, name: "Book 2" },
  ]);
});
