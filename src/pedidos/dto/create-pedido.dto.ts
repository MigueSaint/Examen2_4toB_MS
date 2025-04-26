import { IsString, IsArray, IsInt, ArrayNotEmpty, Min } from 'class-validator';

export class CreatePedidoDto {
  @IsString()
  clienteNombre: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  productosIds: number[];
}
