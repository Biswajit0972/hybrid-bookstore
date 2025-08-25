import express from 'express';
import superAdminRouter from "./router/superAdminRouter/router";
import userRouter from "./router/user/route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(superAdminRouter);
app.use(userRouter);

export default app