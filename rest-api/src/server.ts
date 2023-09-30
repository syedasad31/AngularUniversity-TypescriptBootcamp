import * as dotenv from "dotenv";
import * as express from 'express';
import {root} from "./routes/root";
import {isInteger} from "./utils";

const result = dotenv.config();
if(result.error) {
    console.log(`Error loading environment variables, aborting`);
    process.exit(1);
}
console.log(process.env.PORT);
const app = express();

function setupExpress() {
    app.route("/").get(root);
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
        console.log(`HTTP REST API Server is running at http://localhost:${port}`);
    });
}

setupExpress();
startServer();
