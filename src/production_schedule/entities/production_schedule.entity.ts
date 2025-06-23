import { Machine } from "src/machines/entities/machine.entity";
import { ProductionOrder } from "src/production_orders/entities/production_order.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ProductionSchedule {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProductionOrder, (productionOrder) => productionOrder.schedule)
    @JoinColumn({ name: 'order_id' })
    production_order: ProductionOrder;

    @ManyToOne(() => Machine, (machine) => machine.schedule)
    @JoinColumn({ name: 'machine_id' })
    machine: Machine;

    @ManyToOne(() => User, (user) => user.schedule)
    @JoinColumn({ name: 'operator_id' })
    operator: User;

    @Column({ default: 'pending' })
    status: 'pending' | 'started' | 'completed';

    @Column('datetime', { nullable: true })
    start_time: Date;

    @Column('datetime', { nullable: true })
    end_time: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
