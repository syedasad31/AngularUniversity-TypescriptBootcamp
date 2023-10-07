import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";

const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

export async function checkIfAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authJwtToken = request.headers.authorization;
    if(!authJwtToken) {
        logger.info(`Authentication is denied`);
        response.status(403);
        return;
    }
    checkJwtValidity(authJwtToken)
        .then(user => {
            logger.info(`Authentication successful`);
            request['user'] = user;
            next();
        })
        .catch(err => {
            logger.error(`Could not validate token`, err);
            response.status(403);
        });
}

async function checkJwtValidity(authToken: string){
    const user = await jwt.verify(authToken, JWT_SECRET);
    logger.info(`Found user details in JWT: `, user);
    return user;
}
