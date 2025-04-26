import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from 'src/productos/entities/producto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductosExistPipe implements PipeTransform {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async transform(productosIds: number[]) {
    const productos = await this.productoRepository.findByIds(productosIds);
    if (productos.length !== productosIds.length) {
      throw new NotFoundException('Algunos productos no existen');
    }
    return productosIds;
  }
}
