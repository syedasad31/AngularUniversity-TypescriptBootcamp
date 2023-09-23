import {Log, LoggingLevel, Seal} from "./02-method-decorator";

@Seal()
//@DatabaseService()

class DbService {

    //@Perf()
    @Log(LoggingLevel.INFO)
    saveData(data:any) {
        console.log(`saving data in database...`)
    }

    hello() {}
}

const db = new DbService();
db.saveData({hello: "hello World"})

class Course {
    id:string;
    title:string;
    constructor(title:string) {
    }
}
