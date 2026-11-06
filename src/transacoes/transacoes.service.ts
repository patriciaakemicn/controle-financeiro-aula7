import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transacao, TransacaoDocument } from './transacao.model';
import { CriarTransacaoDto } from './criar-transacao.dto';

@Injectable()
export class TransacoesService {
  constructor(@InjectModel('Transacao') private readonly transacaoModel: Model<Transacao>) {}

  private formatar(transacao: TransacaoDocument) {
    return {
      id: transacao._id.toString(),
      descricao: transacao.descricao,
      valor: transacao.valor,
      tipo: transacao.tipo,
      categoria: transacao.categoria,
      consumoConsciente: transacao.consumoConsciente,
    };
  }

  async cadastrar(dados: CriarTransacaoDto) {
    const transacao = new this.transacaoModel(dados);
    return this.formatar(await transacao.save());
  }

  async listar() {
    const transacoes = await this.transacaoModel.find().exec();
    let receitas = 0;
    let despesas = 0;
    let impulso = 0;
    for (const transacao of transacoes) {
      // O calculo em centavos evita erros de soma com valores decimais.
      const centavos = Math.round(transacao.valor * 100);
      if (transacao.tipo === 'receita') {
        receitas += centavos;
      } else {
        despesas += centavos;
        if (transacao.consumoConsciente === false) impulso += centavos;
      }
    }
    return {
      historico: transacoes.map(transacao => this.formatar(transacao)),
      metricas: {
        saldoTotal: (receitas - despesas) / 100,
        totalDespesas: despesas / 100,
        totalGastoImpulso: impulso / 100,
      },
    };
  }
}
