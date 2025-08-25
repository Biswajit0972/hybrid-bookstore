import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {DecodedToken} from "../../utils/types";

export const Authentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization || req.cookies.accessToken;

        if (!token) {
            res.status(401).json({flag: false, message: "Unauthorized Access"});
        }

        let extractToken = "";

        if (token?.startsWith("Bearer ")) {
            extractToken = token?.split(" ")[1]
        } else {
            extractToken = token;
        }


        const decodedToken = jwt.verify(extractToken, process.env.ACCESS_TOKEN_SECRET || "") as DecodedToken;

        if (!decodedToken) {
            res.status(401).json({flag: false, message: "Unauthorized Access"});
        }

        req.headers.role = decodedToken.role;
        req.headers.AuthUserId = decodedToken.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({flag: false, message: "Unauthorized Access"});
    }
}