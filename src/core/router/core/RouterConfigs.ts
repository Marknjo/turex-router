import { randomUUID } from 'crypto';
import { GenericConstructor } from '../../types';
import CofingsPrepper from '../submodules/CofingsPrepper';
import ParamsMerger from '../submodules/ParamsMerger';
import PostRoutes from '../submodules/PostRoutes';
import { RouterConfigsOptions } from '../types';
import { usePreRoutesStore } from '../store/PreRoutesStore';

export const RouterConfigs = function (configs: RouterConfigsOptions) {
  return function (constructor: GenericConstructor) {
    // console.log(
    //   `Router config :(${constructor.name}): running...📍📍📍📍. Controller: `,
    //   constructor
    // );

    /// Generate the a router Id
    const routeId = randomUUID();

    /// Prep Merge Params configs
    const mergeParamsConfigs = new CofingsPrepper(constructor, configs);
    const { mergeParamsOption, mergeParamsWithOptions } =
      mergeParamsConfigs.getMergeParamsConfigs();

    /// Init app router
    const appRoute = new PostRoutes(configs, routeId, mergeParamsOption);

    /// Initialize route
    const router = appRoute.init();

    /// MERGE PARAMS if an option
    /// Dispatch PreRouter Data
    usePreRoutesStore.dispatch({
      routeId,
      router,
      routeName: constructor.name,
      hasMergeParamsWith: mergeParamsWithOptions ? true : false,
    });

    /// Merge params
    new ParamsMerger(router, mergeParamsWithOptions);

    // Use middleware to merge defined route

    /// Run route Pre-Middleware

    // Match routes by controller handler and merge endPoint/handlerMiddleware
    appRoute.matchRouteWithHandler(router);

    /// Dispatch router to store
    appRoute.dispatchRoute(router);
  };
};
