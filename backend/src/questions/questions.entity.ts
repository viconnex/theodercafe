import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Categories } from '../categories/categories.entity';

@Entity()
export class Questions {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Categories, category => category.questions)
    category: Categories;

    @Column()
    option1: string;

    @Column()
    option2: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
