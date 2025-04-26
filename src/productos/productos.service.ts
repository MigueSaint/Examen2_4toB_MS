import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) { }

  create(createProductoDto: CreateProductoDto) {
    const producto = this.productoRepository.create(createProductoDto);
    return this.productoRepository.save(producto);
  }

  findAll() {
    return this.productoRepository.find();
  }

  async findOne(id: number) {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return producto;
  }

  async patch(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.findOne(id);
    Object.assign(producto, updateProductoDto);
    return this.productoRepository.save(producto);
  }

  async put(id: number, updateProductoDto: UpdateProductoDto) {
    const { nombre, precio } = updateProductoDto;

    if (nombre === undefined || precio === undefined) {
      throw new BadRequestException('Debes enviar todos los campos obligatorios: nombre y precio');
    }

    const producto = await this.findOne(id);
    producto.nombre = nombre;
    producto.precio = precio;

    return this.productoRepository.save(producto);
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    return this.productoRepository.remove(producto);
  }
}
