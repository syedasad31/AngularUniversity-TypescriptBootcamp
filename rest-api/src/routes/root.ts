import {Request, Response} from "express";

export function root(request: Request, response: Response) {
    response.status(200).send("<h1>v3 Express Server is up and running</hr>")

}
