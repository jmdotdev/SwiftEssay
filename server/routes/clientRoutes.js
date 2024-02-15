import express from "express"
import { registerClientController } from "../controllers/clientController.js";
export const clientRouter = express.Router();

clientRouter.post('/registerClient',registerClientController)