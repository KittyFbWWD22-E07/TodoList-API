import { verifyToken } from "../utils/jwt.js";
import {User} from "../models/user.js";
import createError from "http-errors";

export const protect = function (){
    return async (req, res, next) => {
        let token;
        try {
        // to get token from authorization header
            const authHeader = req.headers["authorization"];
            token =
                authHeader && authHeader.startsWith("Bearer")
                && authHeader.split(" ")[1];
         // to get the token from the cookie
                token = req.cookies.access_token;
            if (!token) {
                throw createError(401, "Token not found");
            }

            const decoded = await verifyToken(token, process.env.JWT_SECRET);
            console.log("decoded:", decoded);

            const user = await User.findById(decoded.id);
            if (!user) {
                throw createError(401, "User not found");
            }

            let update_in_sec = parseInt(user.updatedAt.getTime() / 1000);
            if (decoded.iat < update_in_sec) {
                throw createError(401, "Token is expired, please login again");
            }
            req.jwt = decoded;
            next();
        } catch (error) {
            next(error);
        }
}
}

export const authorize = (...roles) => {
    return (req, res, next) => {
        try {
            if(!roles.includes(req.jwt.roles)){
                throw createError(403, "you don't have permission to access");
            }
            next();
        } catch (error) {
            next(error);
        }
    }
};