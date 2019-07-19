import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Category } from '../category/category.entity';

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Category, category => category.question)
    category: Category;

    @Column()
    option1: string;

    @Column()
    option2: string;

    @Column({ default: 0 })
    option1Votes: number;

    @Column({ default: 0 })
    option2Votes: number;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
