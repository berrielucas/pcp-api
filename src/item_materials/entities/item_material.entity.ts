import { Item } from "src/items/entities/item.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ItemMaterial {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Item, (item) => item.raw_materials, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @ManyToOne(() => Item, (item) => item.used_in, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'raw_material_id' })
    raw_material: Item;

    @Column('numeric', { precision: 10, scale: 2 })
    quantity: number;
}
