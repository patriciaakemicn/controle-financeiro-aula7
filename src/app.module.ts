import 'dotenv/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { TransacoesModule } from './transacoes/transacoes.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.MONGODB_URI;
        if (!uri || uri.includes('SEU_CLUSTER')) {
          throw new Error('Preencha MONGODB_URI no arquivo .env com a conexao do Atlas.');
        }
        return { uri, serverSelectionTimeoutMS: 10000 };
      },
    }),
    TransacoesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
