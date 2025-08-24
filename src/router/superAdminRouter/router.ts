import express, {Router} from "express";
import {superAdminLogin} from "../../controller/login";
import {resetPassword} from "../../controller/resetPassword";
import {superAdminLogout} from "../../controller/logout";
import {isAdminLoggedIN} from "../../middleware/superAdminMiddleware/middleware";
import {getSuperAdminProfile} from "../../controller/getSuperAdmin";

const superAdminRouter = Router();

superAdminRouter.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send("success");
})

superAdminRouter.post("/login", superAdminLogin);

superAdminRouter.put("/reset-password", isAdminLoggedIN, resetPassword);
superAdminRouter.patch("/logout", isAdminLoggedIN, superAdminLogout);
superAdminRouter.get("/admin-profile", isAdminLoggedIN, getSuperAdminProfile);


export default superAdminRouter;