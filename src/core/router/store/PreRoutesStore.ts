import { BaseStore, Listener } from '../../library/store';
import { PreRoutesModel } from './models/PreRoutesModel';

class PreRoutesStore extends BaseStore<
  PreRoutesModel,
  Listener<PreRoutesModel>
> {
  private static initializer: PreRoutesStore;

  /**
   * Store initializer
   */
  static get init() {
    if (!PreRoutesStore.initializer) {
      PreRoutesStore.initializer = new PreRoutesStore();
      return PreRoutesStore.initializer;
    }

    return PreRoutesStore.initializer;
  }

  private constructor() {
    super();
  }

  /// Define methods

  /**
   * Update Store
   */
  protected updateStore(configs: PreRoutesModel) {
    /// Get new Routes data
    const { routeId, router, routeName, hasMergeParamsWith } =
      new PreRoutesModel(
        configs.routeId,
        configs.router,
        configs.routeName,
        configs.hasMergeParamsWith
      );
    this.store.push({ routeId, router, routeName, hasMergeParamsWith });
  }

  findRouteById(routeId: string) {
    const results = this.findById('routeId', routeId) as
      | boolean
      | PreRoutesModel;

    if (!results) {
      return false;
    }

    // There is results
    const foundRoute = results as PreRoutesModel;

    return foundRoute.router;
  }

  findRouteByName(routeName: string) {
    const results = this.findById('routeName', routeName) as
      | boolean
      | PreRoutesModel;

    if (!results) {
      return false;
    }

    // There is results
    const foundRoute = results as PreRoutesModel;

    return foundRoute.router;
  }
}

const usePreRoutesStore = PreRoutesStore.init;
export { usePreRoutesStore };
