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
const app = express();

function setupExpress() {
    app.route("/").get(root);
    app.route("/api/courses").get(getAllCourses);
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
