import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../datasource";
import {calculatePasswordHash} from "../utils";
import {User} from "../model/User";
import * as crypto from "crypto";

export async function createUser(request: Request, response: Response, next: NextFunction) {
    try {
        logger.debug(`createUser called`);
        const {email, pictureUrl, password, isAdmin} = request.body;

        if(!email) {
            throw `No data available, cannot save course.`;
        }

        if(!password) {
            throw `No data available, cannot save course.`;
        }
        const repo = AppDataSource.getRepository(User);
        const user= await repo.createQueryBuilder("users")
            .where("email = :email", {email})
            .getOne();
        if(user) {
            const message = `User already exists ${email}`;
            logger.error(message);
            response.status(400).json({message});
        }

        const passwordSalt = crypto.randomBytes(64).toString("hex");
        const passwordHash = await calculatePasswordHash(password, passwordSalt);
        const newUser = repo.create({
            email,
            pictureUrl,
            isAdmin,
            passwordHash,
            passwordSalt
        });
        await AppDataSource.manager.save(newUser);
        response.status(200).json({
            email,
            pictureUrl,
            isAdmin
        });

    }
    catch (e) {
        logger.error(`Error calling createUser`);
        return next(e);
    }
}
