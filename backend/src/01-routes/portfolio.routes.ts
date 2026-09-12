import { Router } from 'express';
import { PortfolioController } from '../03-controllers/portfolio.controller.js';

const router = Router();
const portfolioController = new PortfolioController();

router.post('/evaluate', portfolioController.evaluate.bind(portfolioController));

export default router;
