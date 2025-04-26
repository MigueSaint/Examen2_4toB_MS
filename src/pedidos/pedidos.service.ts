import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,

    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const productos = await this.productoRepository.findByIds(createPedidoDto.productosIds);

    if (productos.length !== createPedidoDto.productosIds.length) {
      throw new NotFoundException('Algunos productos no fueron encontrados');
    }

    const pedido = this.pedidoRepository.create({
      clienteNombre: createPedidoDto.clienteNombre,
      productos,
    });

    return this.pedidoRepository.save(pedido);
  }

  findAll(): Promise<Pedido[]> {
    return this.pedidoRepository.find({ relations: ['productos'] });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({ where: { id }, relations: ['productos'] });

    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }
    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);

    if (updatePedidoDto.productosIds) {
      const productos = await this.productoRepository.findByIds(updatePedidoDto.productosIds);
      if (productos.length !== updatePedidoDto.productosIds.length) {
        throw new NotFoundException('Algunos productos no fueron encontrados para actualizar');
      }
      pedido.productos = productos;
    }

    pedido.clienteNombre = updatePedidoDto.clienteNombre ?? pedido.clienteNombre;

    return this.pedidoRepository.save(pedido);
  }

  async remove(id: number): Promise<void> {
    const pedido = await this.findOne(id);
    await this.pedidoRepository.remove(pedido);
  }
}
