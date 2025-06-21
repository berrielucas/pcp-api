import { Module } from '@nestjs/common';
import { ItemMaterialsService } from './item_materials.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemMaterial } from './entities/item_material.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemMaterial]),
  ],
  controllers: [],
  providers: [ItemMaterialsService],
  exports: [ItemMaterialsService],
})
export class ItemMaterialsModule {}
