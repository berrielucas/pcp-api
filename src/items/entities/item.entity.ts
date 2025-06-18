import { Inventory } from "src/inventory/entities/inventory.entity";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    unit: string;

    @Column()
    item_type: 'product' | 'raw_material' | 'both';

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => Inventory, (inventory) => inventory.item)
    inventory: Inventory[];
}
