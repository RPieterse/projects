import handler from "app/middleware/next-connect";

handler({ authentication: "jwt" }).get(async (_, res) => {
  res.json([
    { id: 1, name: "Book 1" },
    { id: 2, name: "Book 2" },
  ]);
});
