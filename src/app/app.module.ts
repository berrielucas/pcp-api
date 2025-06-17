import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { RawMaterialsModule } from 'src/raw-materials/raw-materials.module';

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
    UserModule,
    ProductModule,
    RawMaterialsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
