import { Request, Response } from 'express';
import { AIEvaluatorService } from '../04-services/ai-evaluator.service.js';

const aiEvaluatorService = new AIEvaluatorService();

export class PortfolioController {
  async evaluate(req: Request, res: Response) {
    try {
      const { portfolio } = req.body;
      
      if (!portfolio || !Array.isArray(portfolio) || portfolio.length === 0) {
        return res.status(400).json({ error: "Invalid or empty portfolio provided." });
      }

      const evaluation = await aiEvaluatorService.evaluatePortfolio(portfolio);
      
      return res.status(200).json({ success: true, evaluation });
    } catch (error: any) {
      console.error("Error evaluating portfolio:", error);
      return res.status(500).json({ 
        success: false, 
        error: error.message || "An error occurred during portfolio evaluation." 
      });
    }
  }
}
