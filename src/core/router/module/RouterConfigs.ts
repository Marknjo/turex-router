import { AppMetaKeys, GenericConstructor, ProvidersTypes } from '../../types';
import CofingsPrepper from '../submodules/CofingsPrepper';
import ParamsMerger from '../submodules/ParamsMerger';
import PostRoutes from '../submodules/PostRoutes';
import { RouterConfigsOptions } from '../types';
import { usePreRoutesStore } from '../store/PreRoutesStore';
import { Meta } from '../../stores/meta';
import { ManageId } from '../../stores/idManager';
import { useCtrStore } from '../../providers/controller';

export const RouterConfigs = function (configs: RouterConfigsOptions) {
  return function (constructor: GenericConstructor) {
    console.log(
      `Router config :(${constructor.name}): running...📍📍📍📍. Controller: `,
      constructor
    );

    console.log(useCtrStore.findAll());

    // Initialize router configs values
    Meta.define({
      metaType: ProvidersTypes.ROUTER,
      metaKey: AppMetaKeys.BASE_CONSTRUCTOR,
      constructorName: constructor.name,
      targetConstructor: constructor,
    });

    // /// Get Target ID
    const targetId = ManageId.findId(ProvidersTypes.ROUTER)! as string;
    console.log(ManageId.findCurrentId(ProvidersTypes.CONTROLLER), targetId);

    // /// Prep Merge Params configs
    // const mergeParamsConfigs = new CofingsPrepper(
    //   targetId,
    //   constructor,
    //   configs
    // );
    // const { mergeParamsOption, mergeParamsWithOptions } =
    //   mergeParamsConfigs.getMergeParamsConfigs();

    // /// Init app router
    // const appRoute = new PostRoutes(configs, targetId, mergeParamsOption);

    // /// Initialize route
    // const router = appRoute.init();

    // /// MERGE PARAMS if an option
    // /// Dispatch PreRouter Data
    // usePreRoutesStore.dispatch({
    //   routeId: targetId,
    //   router,
    //   routeName: constructor.name,
    //   hasMergeParamsWith: mergeParamsWithOptions ? true : false,
    // });

    // /// Merge params
    // new ParamsMerger(router, mergeParamsWithOptions);

    // // Use middleware to merge defined route

    // /// Run route Pre-Middleware

    // // Match routes by controller handler and merge endPoint/handlerMiddleware
    // appRoute.matchRouteWithHandler(router);

    // /// Dispatch router to store
    // appRoute.dispatchRoute(router);

    // /// Reset Target ID
    ManageId.regenerateId({
      type: ProvidersTypes.ROUTER,
      prevId: targetId,
      name: constructor.name,
    });
  };
};
