import {logger} from "../logger";
import {AppDataSource} from "../datasource";
import {Course} from "../model/Course";
import {Request, Response} from "express";

export async function getAllCourses(request: Request, response: Response) {
    logger.debug("getAllCourses called");
    const courses = await AppDataSource.getRepository(Course)
        .createQueryBuilder("courses")
        .leftJoinAndSelect("courses.lessons", "LESSONS")
        .orderBy("courses.seqNo")
        .getMany();
    response.status(200).json({courses});
}
