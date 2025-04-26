import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PedidosModule } from './pedidos/pedidos.module';
import { ProductosModule } from './productos/productos.module';
import { Producto } from './productos/entities/producto.entity';
import { Pedido } from './pedidos/entities/pedido.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [PedidosModule, ProductosModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '12345',
    database: 'Examen2_4toB_GP',
    entities: [Pedido,Producto], 
    retryDelay: 3000,
    autoLoadEntities: true,
    synchronize: true,
    logging: true
})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
