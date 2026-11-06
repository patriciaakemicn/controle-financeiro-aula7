import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import request from 'supertest';
import { TransacoesController } from '../src/transacoes/transacoes.controller';
import { TransacoesService } from '../src/transacoes/transacoes.service';
import { TransacaoSchema } from '../src/transacoes/transacao.model';
import { model } from 'mongoose';

// Usa o schema verdadeiro, mas substitui o acesso ao banco nos testes HTTP.
const Modelo = model('TransacaoTeste', TransacaoSchema);
let registros: InstanceType<typeof Modelo>[] = [];
class BancoTeste extends Modelo {
  async save(): Promise<this> {
    await this.validate();
    registros.push(this);
    return this;
  }

}

jest.spyOn(BancoTeste, 'find').mockImplementation(() => ({
  exec: async () => registros,
}) as ReturnType<typeof BancoTeste.find>);

describe('API de transacoes', () => {
  let app: INestApplication;
  const receita = { descricao: 'Salário', valor: 3000, tipo: 'receita', categoria: 'Trabalho', consumoConsciente: true };
  const despesa = { descricao: 'Aluguel', valor: 1000, tipo: 'despesa', categoria: 'Moradia', consumoConsciente: true };

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      controllers: [TransacoesController],
      providers: [TransacoesService, { provide: getModelToken('Transacao'), useValue: BancoTeste }],
    }).compile();
    app = modulo.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });
  beforeEach(() => { registros = []; });
  afterAll(async () => { await app.close(); });

  it('retorna zeros quando nao ha transacoes', async () => {
    const resposta = await request(app.getHttpServer()).get('/transacoes').expect(200);
    expect(resposta.body).toEqual({ historico: [], metricas: { saldoTotal: 0, totalDespesas: 0, totalGastoImpulso: 0 } });
  });

  it('cadastra e calcula receitas, despesas e impulso', async () => {
    for (const dados of [receita, despesa, { ...despesa, descricao: 'Compra por impulso', valor: 150, consumoConsciente: false }]) {
      const resposta = await request(app.getHttpServer()).post('/transacoes').send(dados).expect(201);
      expect(resposta.body.id).toMatch(/^[a-f0-9]{24}$/);
    }
    const resposta = await request(app.getHttpServer()).get('/transacoes').expect(200);
    expect(resposta.body.historico).toHaveLength(3);
    expect(resposta.body.metricas).toEqual({ saldoTotal: 1850, totalDespesas: 1150, totalGastoImpulso: 150 });
  });

  it('nao inclui receita marcada como false nos gastos por impulso', async () => {
    await request(app.getHttpServer()).post('/transacoes').send({ ...receita, consumoConsciente: false }).expect(201);
    const resposta = await request(app.getHttpServer()).get('/transacoes');
    expect(resposta.body.metricas.totalGastoImpulso).toBe(0);
  });

  it('calcula centavos e saldo negativo', async () => {
    for (const valor of [0.1, 0.2]) {
      await request(app.getHttpServer()).post('/transacoes').send({ ...despesa, valor, consumoConsciente: false }).expect(201);
    }
    const resposta = await request(app.getHttpServer()).get('/transacoes');
    expect(resposta.body.metricas).toEqual({ saldoTotal: -0.3, totalDespesas: 0.3, totalGastoImpulso: 0.3 });
  });

  it.each([
    { tipo: 'outro' }, { valor: -1 }, { valor: 0 }, { valor: '10' },
    { valor: 1.234 }, { consumoConsciente: 'false' }, { consumoConsciente: null },
    { descricao: '   ' }, { categoria: '' }, { extra: 'indevido' },
  ])('rejeita dados invalidos: %j', async (alteracao) => {
    await request(app.getHttpServer()).post('/transacoes').send({ ...receita, ...alteracao }).expect(400);
    expect(registros).toHaveLength(0);
  });

  it('exige todos os campos', async () => {
    await request(app.getHttpServer()).post('/transacoes').send({}).expect(400);
  });
});
