import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";

export async function checkIfAdmin(request: Request, response: Response, next: NextFunction) {
    const user = request["user"];
    if(!user?.isAdmin) {
        logger.error(`User is not Admin, access denied`);
        response.sendStatus(403);
        return;
    }

    next();
}
