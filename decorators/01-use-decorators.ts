//@SealClass()
//@DatabaseService()
import {Log, LoggingLevel} from "./02-method-decorator";

class DbService {

    //@Perf()
    @Log(LoggingLevel.DEBUG)
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
