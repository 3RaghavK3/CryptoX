import { Router } from "express";
import * as usersController from "../03-controllers/users.controller.js";
import { authenticate } from "../02-middleware/authenticate.js";
import validate from "../02-middleware/validation.js";
import { updateCurrencySchema } from "../06-validations/users.validation.js";

const router = Router();

router.use(authenticate);

router.get("/me", usersController.getMe);
router.patch("/currency", validate(updateCurrencySchema), usersController.updateCurrency);
export default router;
