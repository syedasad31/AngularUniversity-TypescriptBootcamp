import * as dotenv from "dotenv";
const result = dotenv.config();
import {COURSES, USERS} from "./db-data";
import {AppDataSource} from "../datasource";
import {DeepPartial} from "typeorm";
import {Course} from "./Course";
import {Lesson} from "./Lesson";
import {User} from "./User";
import {calculatePasswordHash} from "../utils";

async function  populateDb() {
    await AppDataSource.initialize();
    console.log('Database connection ready');

    const courses = Object.values(COURSES) as DeepPartial<Course>[];
    const courseRepo = AppDataSource.getRepository(Course);
    const lessonRepo = AppDataSource.getRepository(Lesson);


    for(let courseData of courses) {
        const course = courseRepo.create(courseData);
        await courseRepo.save(course);

        for(let lessonData of courseData.lessons) {
            const lesson = lessonRepo.create(lessonData);
            lesson.course = course;
            await lessonRepo.save(lesson);
        }
    }


    const users = Object.values(USERS) as any[];
    const userRepo = AppDataSource.getRepository(User);

    for(let userData of users) {
        const {email, pictureUrl, isAdmin, passwordSalt, plainTextPassword} = userData;
        const user = userRepo.create({
            email,
            pictureUrl,
            isAdmin,
            passwordSalt,
            passwordHash: await calculatePasswordHash(plainTextPassword, passwordSalt)
        });
        await AppDataSource.manager.save(user);
    }


}

populateDb()
    .then(() => {
        console.log('Finished populating database');
        process.exit(0);
    })
    .catch(err => {
        console.log('Error populating database', err);
    });
