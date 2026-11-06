import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  inicio() {
    return 'Olá Mundo! API de controle financeiro em funcionamento.';
  }
}
