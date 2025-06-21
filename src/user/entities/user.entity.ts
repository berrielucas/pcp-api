import { Alert } from 'src/alerts/entities/alert.entity';
import { ProductionOrder } from 'src/production_orders/entities/production_order.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'operador' })
  role: 'admin' | 'operador';

  @OneToMany(() => Alert, (alert) => alert.user)
  alerts: Alert[];

  @OneToMany(() => ProductionOrder, (productionOrder) => productionOrder.manager)
  manager_in: ProductionOrder[];

  @CreateDateColumn()
  createdAt: Date;
}

