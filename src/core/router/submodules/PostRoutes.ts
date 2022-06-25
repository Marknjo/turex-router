import express, { Request, Response, Router } from 'express';
import { ControllerModel, useCtrStore } from '../../providers/controller';
import { ManageId } from '../../stores/idManager';
import { ProvidersTypes } from '../../types';
import { usePostRoutesStore } from '../store/PostRoutesStore';
// import { AppMetaKeys } from '../../types';
// import { RouterConfigs } from '../core/RouterConfigs';
import { RouterConfigsOptions } from '../types';

export default class PostRoutes {
  /**
   * Store the current controller ID
   */
  private controllerId: string;

  /**
   * Stores alll the controller handlers
   */
  private routerStore: ControllerModel[] = [];

  constructor(
    private configs: RouterConfigsOptions,
    private routeId: string,
    private mergeParams: boolean
  ) {
    /// Get controller Id
    this.controllerId = '';

    // Reflect.getMetadata(
    //   AppMetaKeys.CONTROLLER_ID,
    //   RouterConfigs
    // );
    this.controllerId = ManageId.findCurrentId(
      ProvidersTypes.CONTROLLER
    ) as string;

    /// Assign controller store to controller handlers
    this.routerStore = useCtrStore.findAll();

    // console.log({ controllers: this.routerStore, ctrId: this.controllerId });
  }

  /**
   * Initialize router
   */
  init() {
    const router = express.Router({
      mergeParams: this.mergeParams,
      caseSensitive: !!this.configs.caseSensitive,
      strict: !!this.configs.strict,
    });

    return router;
  }

  /**
   *  Associate router with its controller
   *  Handler router matching
   */
  matchRouteWithHandler(route: Router) {
    this.routerStore.forEach(handler => {
      /// We do all the magic of associations
      const { controllerId, handlerFn, httpMethod, routeUrl } = handler;

      //// Handle different routes
      if (controllerId === this.controllerId) {
        route[httpMethod](routeUrl, (req: Request, res: Response) => {
          const handler = handlerFn as any;

          res.send(handler());
        });
      }
    });
  }

  /**
   * Dispatch configured route
   */
  dispatchRoute(routeConfigs: Router) {
    usePostRoutesStore.dispatch({
      routeId: this.routeId,
      baseUrl: this.configs.baseUrl,
      router: routeConfigs,
    });
  }
}
