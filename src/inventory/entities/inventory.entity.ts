import { Item } from "src/items/entities/item.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Inventory {
    @PrimaryColumn()
    id: number;

    @ManyToOne(() => Item, (item) => item.inventory, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @Column('numeric', { precision: 10, scale: 2 })
    quantity: number;

    @UpdateDateColumn()
    updatedAt: Date;
}
