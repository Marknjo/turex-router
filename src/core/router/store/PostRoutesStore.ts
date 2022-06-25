import { RequestHandler, Router } from 'express';
import { BaseStore, Listener } from '../../library/store';

import { PostRoutesModel } from './models/PostRoutesModel';

class PostRoutesStore extends BaseStore<
  PostRoutesModel,
  Listener<PostRoutesModel>
> {
  private static initilizer: PostRoutesStore;

  /**
   * Store initilizer
   */
  static get init() {
    if (!PostRoutesStore.initilizer) {
      PostRoutesStore.initilizer = new PostRoutesStore();
      return PostRoutesStore.initilizer;
    }

    return PostRoutesStore.initilizer;
  }

  private constructor() {
    super();
  }

  /// Define methods

  /**
   * Update Store
   */
  protected updateStore(configs: PostRoutesModel) {
    /// Get new Routes data
    const { routeId, router, baseUrl } = new PostRoutesModel(
      configs.routeId,
      configs.baseUrl,
      configs.router
    );
    this.store.push({
      routeId,
      router,
      baseUrl,
    });
  }

  /**
   * Get Router name
   */
  findRoute(routeId: string): Router | RequestHandler | boolean {
    const foundResults = this.findById('routeId', routeId);

    if (!foundResults) {
      return false;
    }

    const foundRouter = foundResults as PostRoutesModel;

    return foundRouter.router;
  }
}

const usePostRoutesStore = PostRoutesStore.init;
export { usePostRoutesStore };
