export interface ControllerHandler {
  (...args: any):
    | string
    | {
        [key: string]: string | any[] | { [key: string]: any };
      }
    | Promise<any>;
}
