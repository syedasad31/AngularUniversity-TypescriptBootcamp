import {logger} from "../logger";
import {AppDataSource} from "../datasource";
import {Course} from "../model/Course";
import {NextFunction, Request, Response} from "express";
import {error} from "winston";

export async function getAllCourses(request: Request, response: Response,
                                    next: NextFunction) {
    logger.debug("getAllCourses called");
    try {
        const courses = await AppDataSource.getRepository(Course)
            .createQueryBuilder("courses")
            .leftJoinAndSelect("courses.lessons", "LESSONS")
            .orderBy("courses.seqNo")
            .getMany();
        response.status(200).json({courses});
    }
    catch (e) {
        logger.error(`Error calling getAllCourses`);
        return next(error);
    }
}
