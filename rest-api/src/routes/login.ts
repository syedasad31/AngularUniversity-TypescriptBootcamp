import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../datasource";
import {User} from "../model/User";
import {calculatePasswordHash} from "../utils";

const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
export async function login(request: Request, response: Response, next: NextFunction) {
    try {
        logger.debug(`createUser called`);
        const {email, password} = request.body;

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
        if(!user) {
            const message = `User not exists ${email}`;
            logger.error(message);
            response.status(400).json({message});
        }
        const passwordHash = await calculatePasswordHash(password, user.passwordSalt);
        if(passwordHash != user.passwordHash) {
            const message = `Wrong Credentials`;
            logger.info(`${message} user with ${email}`);
            response.status(400).json({message});
            return;
        }
        const {pictureUrl, isAdmin} = user;

        const authJwt = {
          userId: user.id,
          email,
          isAdmin
        };
        const auth = await jwt.sign(authJwt, JWT_SECRET);
        response.status(200).json({
            user: {
                email,
                pictureUrl,
                isAdmin
            },
            auth
        });
    }
    catch (e) {
        logger.error(`Error calling createUser`);
        return next(e);
    }
}
