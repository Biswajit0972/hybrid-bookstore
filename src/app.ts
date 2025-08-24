import express from 'express';
import superAdminRouter from "./router/superAdminRouter/router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(superAdminRouter)

export default app