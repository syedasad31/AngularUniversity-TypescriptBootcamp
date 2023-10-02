import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Course} from "./Course";

@Entity({
    name: "LESSONS"
})
export class Lesson {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    seqNo: number;
    @Column()
    title: string;
    @Column()
    duration: string;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    lastUpdatedAt: Date;

    @ManyToOne(()=> Course, course=> course.lessons)
    @JoinColumn({
        name: "courseId"
    })
    course: Course;
}
