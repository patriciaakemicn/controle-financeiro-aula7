import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransacaoSchema } from './transacao.model';
import { TransacoesController } from './transacoes.controller';
import { TransacoesService } from './transacoes.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Transacao', schema: TransacaoSchema }])],
  controllers: [TransacoesController],
  providers: [TransacoesService],
})
export class TransacoesModule {}
