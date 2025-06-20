import { Inventory } from "src/inventory/entities/inventory.entity";
import { ItemMaterial } from "src/item_materials/entities/item_material.entity";
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
    inventory: Inventory;

    @OneToMany(() => ItemMaterial, (itemMaterial) => itemMaterial.item)
    raw_materials: ItemMaterial[];

    @OneToMany(() => ItemMaterial, (itemMaterial) => itemMaterial.raw_material)
    used_in: ItemMaterial[];
}
