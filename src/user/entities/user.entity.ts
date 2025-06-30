import { Alert } from 'src/alerts/entities/alert.entity';
import { ProductionOrder } from 'src/production_orders/entities/production_order.entity';
import { ProductionSchedule } from 'src/production_schedule/entities/production_schedule.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: 'operador' })
  role: 'admin' | 'operador';

  @Column({ default: true })
  firsh_login: boolean;

  @OneToMany(() => Alert, (alert) => alert.user)
  alerts: Alert[];

  @OneToMany(() => ProductionOrder, (productionOrder) => productionOrder.manager)
  manager_in: ProductionOrder[];

  @OneToMany(() => ProductionSchedule, (productionSchedule) => productionSchedule.production_order)
  schedule: ProductionSchedule[];

  @CreateDateColumn()
  createdAt: Date;
}

