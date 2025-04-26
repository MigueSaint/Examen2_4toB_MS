import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clienteNombre: string;

  @ManyToMany(() => Producto)
  @JoinTable()
  productos: Producto[];
}
