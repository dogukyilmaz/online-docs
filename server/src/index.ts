import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript online-docs Server!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
