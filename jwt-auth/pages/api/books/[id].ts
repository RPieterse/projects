import handler from "app/middleware/next-connect";

handler({
  authentication: "jwt",
}).get(async (req, res) => {
  res.json({ id: req.query.id, name: "Book 1" });
});
