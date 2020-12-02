import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('accumulus')
export class Accumulus {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    nuages: string

    @CreateDateColumn()
    createdAt: string
}
