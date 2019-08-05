import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('accumulus')
export class Accumulus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    nuages: string;

    @CreateDateColumn()
    createdAt: string;
}
