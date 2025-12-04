import express from 'express';
import lRouter from './location.ts'
const mainRouter = express.Router();
mainRouter.use('/location',lRouter);
export default mainRouter;