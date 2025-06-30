import { ProductionOrder } from "src/production_orders/entities/production_order.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductionPerformance {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProductionOrder, (productionOrder) => productionOrder.performance)
    @JoinColumn({ name: 'order_id' })
    production_order: ProductionOrder;

    @Column('numeric', { precision: 10, scale: 2 })
    efficiency: number;

    @Column('numeric', { precision: 10, scale: 2 })
    productivity: number;

    @Column('numeric', { precision: 10, scale: 2 })
    quality: number;

    @CreateDateColumn()
    recordedAt: Date;
}
