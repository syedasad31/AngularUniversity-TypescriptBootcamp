import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../datasource";
import {Course} from "../model/Course";
import {Lesson} from "../model/Lesson";
import {isInteger} from "../utils";

export async function deleteCourseAndLesson(request: Request, response: Response, next: NextFunction) {
    try {
        logger.debug(`deleteCourseAndLesson called`);
        const courseId = request.params.courseId;

        if(!isInteger(courseId)) {
            throw `Invalid course Id ${courseId}`;
        }

        const course = await AppDataSource.manager.transaction(
            async (tem) => {

                await tem.createQueryBuilder()
                    .delete()
                    .from(Lesson)
                    .where("courseId = :courseId", {courseId})
                    .execute();

                await tem.createQueryBuilder()
                    .delete()
                    .from(Course)
                    .where("id = :courseId", {courseId})
                    .execute();
            }
        );

        response.status(200).json({
            message: `Course deleted successfully ${courseId}`
        });

    }
    catch (e) {
        logger.error(`Error calling deleteCourseAndLesson`);
        return next(e);
    }
}
