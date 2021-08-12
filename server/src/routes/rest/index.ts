import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript online-docs Server!');
});

export default router;
