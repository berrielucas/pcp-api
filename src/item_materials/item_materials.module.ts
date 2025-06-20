import { Module } from '@nestjs/common';
import { ItemMaterialsService } from './item_materials.service';
import { ItemMaterialsController } from './item_materials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemMaterial } from './entities/item_material.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemMaterial]),
  ],
  controllers: [ItemMaterialsController],
  providers: [ItemMaterialsService],
  exports: [ItemMaterialsService],
})
export class ItemMaterialsModule {}
