import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../datasource";
import {Course} from "../model/Course";
import {Lesson} from "../model/Lesson";
import {isInteger} from "../utils";

export async function findLessonsForCourse(request: Request, response: Response, next: NextFunction) {
    try {
        logger.debug(`Called findLessonsForCourse`);
        const courseId = request.params.courseId,
            query = request.query as any,
            pageNumber = query.pageNumber ?? "0",
            pageSize = query.pageSize ?? "5";

        if(!isInteger(courseId)) {
            throw `Invalid course Id ${courseId}`;
        }

        if(!isInteger(pageNumber)) {
            throw `Invalid pageNumber ${pageNumber}`;
        }

        if(!isInteger(pageSize)) {
            throw `Invalid pageSize ${pageSize}`;
        }

        const lessons = await AppDataSource.getRepository(Lesson)
            .createQueryBuilder("lessons")
            .where("lessons.courseId: courseId", {courseId: courseId})
            .orderBy("lessons.seqNo")
            .skip(pageNumber * pageSize)
            .take(pageSize)
            .getMany();

        response.status(200)
            .json({lessons});

    }
    catch (e) {
        logger.error(`Error calling findLessonsForCourse`);
        return next(e);
    }
}
