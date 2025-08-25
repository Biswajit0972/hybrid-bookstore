import express, {Router} from "express";
import {userLogin} from "../../controller/user/login";
import {userRegistration} from "../../controller/user/signup";

const userRouter = Router();

//public routes

userRouter.post("/api/user/login", userLogin);
userRouter.post("/api/user/signup", userRegistration);

export default userRouter;