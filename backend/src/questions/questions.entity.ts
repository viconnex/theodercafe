import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity()
export class Questions {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Category, category => category.questions)
    category: Category;

    @Column()
    option1: string;

    @Column()
    option2: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
