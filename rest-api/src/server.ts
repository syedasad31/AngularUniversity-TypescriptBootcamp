import * as dotenv from "dotenv";
const result = dotenv.config();
if(result.error) {
    logger.error(`Error loading environment variables, aborting`);
    process.exit(1);
}

import "reflect-metadata";
import * as express from 'express';
import {root} from "./routes/root";
import {isInteger} from "./utils";
import {logger} from "./logger";

///Datasource initialization must be done after environment variables are set because
///these variables are used in datasource.ts which needs to be set before using
///These variables are set by using dotenv.config()
import {AppDataSource} from "./datasource";
import {getAllCourses} from "./routes/get-all-courses";
import {defaultErrorHandler} from "./middlewares/default-error-handler";
import {findCourseByUrl} from "./routes/find-course-by-url";
import {findLessonsForCourse} from "./routes/find-lessons-for-course";
import {updateCourse} from "./routes/update-course";
import {createCourse} from "./routes/create-course";
import {deleteCourseAndLesson} from "./routes/delete-course";
import {createUser} from "./routes/create-user";
import {login} from "./routes/login";
import {checkIfAuthenticated} from "./middlewares/authentication-middleware";
import {checkIfAdmin} from "./middlewares/admin-only-middleware";

const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

function setupExpress() {
    app.use(cors({origin:true}));
    app.use(bodyParser.json);
    app.route("/").get(root);
    app.route("/api/courses").get(checkIfAuthenticated, getAllCourses);
    app.route("/api/courses/:courseUrl").get(checkIfAuthenticated, findCourseByUrl);
    app.route("/api/courses/:courseId/lessons").get(checkIfAuthenticated, findLessonsForCourse);
    app.route("/api/courses/:courseId").patch(checkIfAuthenticated, updateCourse);
    app.route("/api/courses").post(checkIfAuthenticated, createCourse);
    app.route("/api/courses/:courseId").delete(checkIfAuthenticated, deleteCourseAndLesson);
    app.route("/api/users").post(checkIfAuthenticated, checkIfAdmin, createUser);
    app.route("/api/login").post(login);
    app.use(defaultErrorHandler);
}

function startServer() {
    let port;
    const portEnv = process.env.PORT;
    if(isInteger(portEnv)) {
        port = parseInt(portEnv);
    }
    const portArg = process.argv[2];
    if(!port && isInteger(portArg)) {
        port = parseInt(portArg);
    }

    app.listen(port, () => {
        logger.info(`HTTP REST API Server is running at http://localhost:${port}`);
    });
}

AppDataSource.initialize().then(() => {
    logger.info("Datasource initialized successfully");
    setupExpress();
    startServer();
})
    .catch(err => {
        logger.error("Error database initialization", err);
        process.exit(1);
    });
