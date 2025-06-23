import { ProductionSchedule } from "src/production_schedule/entities/production_schedule.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Machine {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => ProductionSchedule, (productionSchedule) => productionSchedule.production_order)
    schedule: ProductionSchedule[];

    @CreateDateColumn()
    createdAt: Date;
}
