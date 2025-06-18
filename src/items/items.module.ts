import { forwardRef, Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    forwardRef(() => InventoryModule),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
