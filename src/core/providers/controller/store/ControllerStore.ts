import { BaseStore, Listener } from '../../..';
import { ControllerModel } from './models/ControllerModel';

class ControllerStore extends BaseStore<
  ControllerModel,
  Listener<ControllerModel>
> {
  private static initilizer: ControllerStore;

  /**
   * Store initilizer
   */
  static get init() {
    if (!ControllerStore.initilizer) {
      ControllerStore.initilizer = new ControllerStore();
      return ControllerStore.initilizer;
    }

    return ControllerStore.initilizer;
  }

  constructor() {
    super();
  }

  /**
   *  Update Store
   * @param configs Each handler config
   */
  protected updateStore(configs: ControllerModel): void {
    /// Get new Routes data
    const { controllerId, httpMethod, routeUrl, handlerFn } =
      new ControllerModel(
        configs.controllerId,
        configs.httpMethod,
        configs.routeUrl,
        configs.handlerFn
      );
    this.store.push({ controllerId, httpMethod, routeUrl, handlerFn });
  }
}

const useCtrStore = ControllerStore.init;

export { useCtrStore };
