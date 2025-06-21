import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ItemsModule } from 'src/items/items.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { MachinesModule } from 'src/machines/machines.module';
import { ItemMaterialsModule } from 'src/item_materials/item_materials.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'pcp',
      password: 'postgres',
      autoLoadEntities: true, // Carrega todas as entidades
      synchronize: true, // Sincroniza tudo com o BD - Não deve ser usado em produção
    }),
    forwardRef(() => UserModule),
    forwardRef(() => InventoryModule),
    forwardRef(() => ItemsModule),
    forwardRef(() => ItemMaterialsModule),
    forwardRef(() => MachinesModule),
  ],
})
export class AppModule {}
