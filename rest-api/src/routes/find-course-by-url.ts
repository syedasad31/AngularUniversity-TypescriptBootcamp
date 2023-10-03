import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../datasource";
import {Course} from "../model/Course";
import {Lesson} from "../model/Lesson";

export async function findCourseByUrl(request: Request, response: Response, next: NextFunction) {
    try {
        logger.debug(`Called findCourseByUrl`);
        const courseUrl = request.params.courseUrl;

        if(!courseUrl) {
            throw `Could not extract course url from request param`;
        }

        const course = await AppDataSource.getRepository(Course)
            .findOneBy({
                url: courseUrl
        });

        if(!course) {
            const msg = `Could not find course for this url ${courseUrl}`;
            logger.error(msg);
            response.status(404).json(msg);
            return;
        }

        const totalLessons = await AppDataSource.getRepository(Lesson)
            .createQueryBuilder("lessons")
            .where("lessons.courseId=:courseId", {
                courseId: course.id
            }).getCount();

        response.status(200).json({
            course,
            totalLessons
        });
    }
    catch (e) {
        logger.error(`Error calling findCourseByUrl`);
        return next(e);
    }
}
