import { ControllerHandler, HttpMethods } from '../../types';

export class ControllerModel {
  constructor(
    public controllerId: string,
    public httpMethod: HttpMethods,
    public routeUrl: string,
    public handlerFn: ControllerHandler
  ) {}
}
