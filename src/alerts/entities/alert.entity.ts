import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Alert {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'general' })
    alert_type: 'error' |'general' | 'order_update' | 'order_completed' | 'restock' | 'inventory_low';

    @ManyToOne(() => User, (user) => user.alerts, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: true })
    reference_id: number;

    @Column()
    message: string;

    @Column({ default: false })
    is_read: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
