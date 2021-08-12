import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: null,
    route: '/auth',
  });
});

router.post('/register', async (req: Request, res: Response) => {
  // const result = await register(req.body);
  // if (!result.success) res.statusCode = 400;
  // res.status(201).json(result);
});

router.post('/login', async (req: Request, res: Response) => {
  // console.log(req.body);
  // const result = await login(req.body);
  // if (!result.success) res.statusCode = 400;
  // res.status(201).json(result);
});

export default router;
