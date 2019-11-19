import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export const getCompanyFromEmail = (email: string): string => {
    return email.split('@')[1].split('.')[0];
};

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    givenName: string;

    @Column({ nullable: true })
    familyName: string;

    @Column({ nullable: true })
    company: string;

    @Column({ nullable: true })
    pictureUrl: string;

    @Column({ default: false })
    isAdmin: boolean;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
