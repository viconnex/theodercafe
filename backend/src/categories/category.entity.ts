import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Questions } from '../questions/questions.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(type => Questions, question => question.category)
    questions: Questions[];

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
