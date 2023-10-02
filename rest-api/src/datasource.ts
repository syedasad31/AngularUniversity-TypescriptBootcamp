import {DataSource} from "typeorm";
import {Course} from "./model/Course";
import {Lesson} from "./model/Lesson";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    //url: `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    entities: [
        Course,
        Lesson
    ],
    synchronize: true,
    logging: true
});
