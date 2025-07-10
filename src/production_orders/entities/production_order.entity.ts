import { Item } from "src/items/entities/item.entity";
import { ProductionPerformance } from "src/production_performance/entities/production_performance.entity";
import { ProductionSchedule } from "src/production_schedule/entities/production_schedule.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductionOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.manager_in, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'manager_id' })
    manager: User;

    @ManyToOne(() => Item, (item) => item.production_orders, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @Column('numeric', { precision: 10, scale: 2 })
    quantity: number;

    @Column('numeric', { precision: 10, scale: 2 , nullable: true })
    approved_quantity: number;

    @Column('date')
    deadline: Date;

    @Column({ default: 'pending' })
    status: 'pending' | 'in_progress' | 'finished' | 'cancelled';

    @Column({ nullable: true })
    start_time: Date;

    @Column({ nullable: true })
    end_time: Date;

    @OneToOne(() => ProductionPerformance, (productionPerformance) => productionPerformance.production_order)
    performance: ProductionPerformance;

    @OneToMany(() => ProductionSchedule, (productionSchedule) => productionSchedule.production_order)
    schedule: ProductionSchedule[];
    
    @CreateDateColumn()
    createdAt: Date;
}
