import { Router } from 'express';

export class PostRoutesModel {
  constructor(
    public routeId: string,
    public baseUrl: string,
    public router: Router
  ) {}
}
