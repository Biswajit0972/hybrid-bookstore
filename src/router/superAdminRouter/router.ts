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

superAdminRouter.post("/api/superadmin/login", superAdminLogin);

superAdminRouter.put("/reset-password", isAdminLoggedIN, resetPassword);
superAdminRouter.post("/api/superadmin/logout", isAdminLoggedIN, superAdminLogout);
superAdminRouter.get("/api/superadmin/me", isAdminLoggedIN, getSuperAdminProfile);


export default superAdminRouter;