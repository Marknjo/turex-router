import { Request } from 'express';
import { Controller, Get, Req } from '../core';

@Controller()
export class clientController {
  @Get('/')
  homePage(@Req req: Request) {
    return '<h1>Test HomePage</h2>';
  }

  @Get('/about')
  aboutPage() {
    return '<h1>This is about page</h2>';
  }
}
