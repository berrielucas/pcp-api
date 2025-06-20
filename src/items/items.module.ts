import { forwardRef, Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { InventoryModule } from 'src/inventory/inventory.module';
import { ItemMaterialsModule } from 'src/item_materials/item_materials.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    forwardRef(() => InventoryModule),
    forwardRef(() => ItemMaterialsModule),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
