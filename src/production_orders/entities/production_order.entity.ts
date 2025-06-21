import { Item } from "src/items/entities/item.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductionOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.manager_in, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'manager_id' })
    manager: User;

    @ManyToOne(() => Item, (item) => item.production_orders, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @Column('numeric', { precision: 10, scale: 2 })
    quantity: number;

    @Column('date')
    deadline: Date;

    @Column({ default: 'pending' })
    status: 'pending' | 'in_progress' | 'finished' | 'cancelled';
    
    @CreateDateColumn()
    createdAt: Date;
}
