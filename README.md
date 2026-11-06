# Controle financeiro pessoal

Atividade da Aula 7 de Web Mobile. API em NestJS e MongoDB para registrar receitas e despesas e acompanhar gastos por impulso. Segue a organização do exemplo da aula: model, service, controller e module.

## Executar no VSCode

1. Instale o Node.js 22 LTS ou superior e abra esta pasta no VSCode.
2. No terminal, execute `npm ci`.
3. Copie `.env.example` para `.env`. No prompt do Windows: `copy .env.example .env`.
4. Configure a conexão do Atlas conforme abaixo.
5. Execute `npm start`. Abra http://localhost:3000 para conferir a mensagem inicial.
6. Importe `postman.json` no Postman Desktop.

Não é necessário executar `nest new`: este projeto já está montado.

## MongoDB Atlas

Crie um projeto e um cluster disponível na sua conta Atlas. Em Database Access, crie um usuário de banco com permissão de leitura e escrita. Em Network Access, autorize o IP do computador que executará a API. Na opção de conexão por driver, copie a URI e coloque em MONGODB_URI no `.env`, substituindo usuário, senha e cluster. Informe `controle_financeiro` como banco antes do `?`.

Se a senha tiver caracteres especiais, eles precisam estar codificados para URL. Não envie a senha no chat. O arquivo `.env` não deve ser publicado no GitHub nem incluído na entrega. A conexão precisa estar ativa para a aplicação iniciar; não há banco simulado na execução normal.

## Rotas e exemplo

- GET /: mensagem de funcionamento.
- POST /transacoes: cadastra uma transação e retorna seus dados com id (201).
- GET /transacoes: retorna historico e metricas (200).

Exemplo de corpo JSON para POST /transacoes:

```json
{
  "descricao": "Conta de luz",
  "valor": 150.50,
  "tipo": "despesa",
  "categoria": "Moradia",
  "consumoConsciente": true
}
```

Use ponto nos decimais. Valor deve ser positivo, numérico e ter até duas casas decimais. Todos os cinco campos são obrigatórios. `consumoConsciente` precisa ser booleano, sem aspas. Aqui, true representa uma despesa planejada/essencial; false representa compra por impulso. Nas receitas, esse campo não entra no cálculo de impulso.

Envie as três requisições POST da coleção uma vez, em um banco vazio. Depois execute o GET. O resultado esperado em metricas é:

```json
{ "saldoTotal": 1850, "totalDespesas": 1150, "totalGastoImpulso": 150 }
```

Cada POST grava um novo registro. Repetir as requisições altera os totais.

## Entender o código

- transacao.model.ts define os campos e o schema do MongoDB.
- criar-transacao.dto.ts valida o corpo das requisições.
- transacoes.controller.ts recebe as requisições e chama o service.
- transacoes.service.ts grava e consulta o banco. No GET, soma as receitas e despesas em centavos, subtrai para encontrar o saldo e soma apenas despesas com consumoConsciente false para encontrar o gasto por impulso.
- transacoes.module.ts reúne controller, service e model.
- app.module.ts configura a conexão e importa o módulo.
- main.ts inicia a aplicação, habilita CORS e ativa a validação.

## Testar e compilar

`npm test` executa testes das rotas, validação e cálculos usando o schema real e persistência substituída em memória apenas nos testes. Esses testes não verificam uma conexão real com o Atlas. `npm run build` compila o TypeScript.

## Publicar e entregar

1. Crie no GitHub um repositório público, por exemplo controle-financeiro-aula7.
2. Publique os arquivos desta pasta, incluindo os arquivos de configuração. Não publique node_modules, dist ou .env. O .gitignore já exclui esses itens.
3. Abra o repositório sem login para conferir que está público.
4. Substitua o conteúdo de github.txt pelo endereço real do seu repositório.
5. Se tiver Python instalado, execute `python gerar_entrega.py` para criar o ZIP após preencher github.txt. Alternativamente, selecione src, test, package.json, package-lock.json, tsconfig.json, nest-cli.json, .env.example e github.txt. Não compacte node_modules nem o arquivo .env.

O arquivo github.txt fornecido ainda está pendente. Não entregue sem preenchê-lo. O link público é obrigatório para o crédito extensionista.

## Relação com a comunidade

A API pode apoiar oficinas de educação financeira: o participante registra receitas e despesas, consulta quanto sobrou e identifica o peso de compras por impulso. A proposta se relaciona ao ODS 1 e ao ODS 12. Este projeto não inclui interface gráfica, login ou separação de usuários; use apenas dados fictícios na demonstração. Uma aplicação para uso real de várias pessoas precisaria de autenticação e isolamento dos registros.

## Referências

https://docs.nestjs.com/techniques/mongodb
https://docs.nestjs.com/techniques/validation
https://www.mongodb.com/docs/atlas/
