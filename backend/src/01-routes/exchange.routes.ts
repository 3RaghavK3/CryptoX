import { Router } from "express";
import * as exchangeController from "../03-controllers/exchange.controller.js";

const router = Router();

router.get("/rates", exchangeController.getRates);

export default router;
