import { Body, Controller, Get, Post } from '@nestjs/common';
import { CriarTransacaoDto } from './criar-transacao.dto';
import { TransacoesService } from './transacoes.service';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  @Post()
  cadastrar(@Body() dados: CriarTransacaoDto) {
    return this.transacoesService.cadastrar(dados);
  }

  @Get()
  listar() {
    return this.transacoesService.listar();
  }
}
