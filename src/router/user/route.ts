import express, {Router} from "express";
import {userLogin} from "../../controller/user/login";
import {userRegistration} from "../../controller/user/signup";
import {Authentication} from "../../middleware/userMiddlewares/Authentication";
import {userProfile} from "../../controller/user/userProfile";
import {changeUserRole} from "../../controller/user/changeRole";
import {userLogout} from "../../controller/user/logout";

const userRouter = Router();



userRouter.post("/api/user/login", userLogin);
userRouter.post("/api/user/signup", userRegistration);

userRouter.get("/api/user-profile", Authentication, userProfile);
userRouter.patch("/api/user/change-role", Authentication, changeUserRole)
userRouter.post("/api/user/logout", Authentication, userLogout);

export default userRouter;