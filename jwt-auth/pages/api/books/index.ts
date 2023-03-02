import handler from "@root/middleware/next-connect";

handler().get(async (_, res) => {
  res.json([
    { id: 1, name: "Book 1" },
    { id: 2, name: "Book 2" },
  ]);
});
