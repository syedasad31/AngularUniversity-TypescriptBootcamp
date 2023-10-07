import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../datasource";
import {Course} from "../model/Course";
import {Lesson} from "../model/Lesson";
import {isInteger} from "../utils";

export async function updateCourse(request: Request, response: Response, next: NextFunction) {
    try {
        logger.debug(`updateCourse called`);
        const courseId = request.params.courseId,
            changes = request.body;

        if(!isInteger(courseId)) {
            throw `Invalid course Id ${courseId}`;
        }

        await AppDataSource.createQueryBuilder()
            .update(Course)
            .set(changes)
            .where("id = :courseId", {courseId})
            .execute();
        response.status(200).json({
            message: `Course ${courseId} was updated successfully`
        });

    }
    catch (e) {
        logger.error(`Error calling updateCourse`);
        return next(e);
    }
}
