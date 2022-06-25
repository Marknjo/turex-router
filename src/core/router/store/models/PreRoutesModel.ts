import { Router } from 'express';

export class PreRoutesModel {
  constructor(
    public routeId: string,
    public router: Router,
    public routeName: string,
    public hasMergeParamsWith: boolean
  ) {}
}
