import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../datasource";
import {Course} from "../model/Course";
import {Lesson} from "../model/Lesson";
import {isInteger} from "../utils";

export async function createCourse(request: Request, response: Response, next: NextFunction) {
    try {
        logger.debug(`createCourse called`);
        const data = request.body;

        if(!data) {
            throw `No data available, cannot save course.`;
        }

        const course = await AppDataSource.manager.transaction(
            "REPEATABLE READ",
            async (tem) => {
                let repository = tem.getRepository(Course);
                const result = await repository
                    .createQueryBuilder("courses")
                    .select("MAX(courses.seqNo)", "max")
                    .getRawOne();

                const course = repository
                    .create({
                        ...data,
                        seqNo: (result?.max ?? 0) + 1
                    });
                await repository.save(course);
                return course;
            }
        );

        response.status(200).json({course});

    }
    catch (e) {
        logger.error(`Error calling createCourse`);
        return next(e);
    }
}
