import handler from "@root/middleware/next-connect";

handler().get(async (req, res) => {
  res.json({ id: req.query.id, name: "Book 1" });
});
