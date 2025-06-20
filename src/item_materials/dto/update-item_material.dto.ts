import { PartialType } from '@nestjs/swagger';
import { CreateItemMaterialDto } from './create-item_material.dto';

export class UpdateItemMaterialDto extends PartialType(CreateItemMaterialDto) {}
