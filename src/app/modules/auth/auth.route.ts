import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router();

router.post("/signup", authControllers.usersignUp);
router.post("/login");

export const AuthRoutes = router;
