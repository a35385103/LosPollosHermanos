import express from 'express';
import lRouter from './location.ts'
import eRouter from './employee.ts'
import mRouter from './menu.ts';
const mainRouter = express.Router();
mainRouter.use('/location',lRouter);
mainRouter.use('/employee', eRouter);
mainRouter.use('/menu', mRouter); 
export default mainRouter;