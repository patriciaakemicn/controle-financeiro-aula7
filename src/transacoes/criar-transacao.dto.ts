import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CriarTransacaoDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(0.01)
  valor: number;

  @IsIn(['receita', 'despesa'])
  tipo: 'receita' | 'despesa';

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsBoolean()
  consumoConsciente: boolean;
}
