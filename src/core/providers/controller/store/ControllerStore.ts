import { BaseStore, Listener } from '../../..';
import { ControllerModel } from './models/ControllerModel';

class ControllerStore extends BaseStore<
  ControllerModel,
  Listener<ControllerModel>
> {
  private static initializer: ControllerStore;

  /**
   * Store initializer
   */
  static get init() {
    if (!ControllerStore.initializer) {
      ControllerStore.initializer = new ControllerStore();
      return ControllerStore.initializer;
    }

    return ControllerStore.initializer;
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
