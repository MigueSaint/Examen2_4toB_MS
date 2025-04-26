import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  // 🆕 Método PATCH - actualización parcial
  async patch(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);

    if (updatePedidoDto.productosIds) {
      const productos = await this.productoRepository.findByIds(updatePedidoDto.productosIds);
      if (productos.length !== updatePedidoDto.productosIds.length) {
        throw new NotFoundException('Algunos productos no fueron encontrados para actualizar');
      }
      pedido.productos = productos;
    }

    if (updatePedidoDto.clienteNombre !== undefined) {
      pedido.clienteNombre = updatePedidoDto.clienteNombre;
    }

    return this.pedidoRepository.save(pedido);
  }

  // 🆕 Método PUT - actualización total
  async put(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const { clienteNombre, productosIds } = updatePedidoDto;

    if (clienteNombre === undefined || !Array.isArray(productosIds) || productosIds.length === 0) {
      throw new BadRequestException('Debes enviar clienteNombre y una lista válida de productosIds');
    }

    const pedido = await this.findOne(id);

    const productos = await this.productoRepository.findByIds(productosIds);
    if (productos.length !== productosIds.length) {
      throw new NotFoundException('Algunos productos no fueron encontrados para actualizar');
    }

    pedido.clienteNombre = clienteNombre;
    pedido.productos = productos;

    return this.pedidoRepository.save(pedido);
  }

  async remove(id: number): Promise<void> {
    const pedido = await this.findOne(id);
    await this.pedidoRepository.remove(pedido);
  }
}
