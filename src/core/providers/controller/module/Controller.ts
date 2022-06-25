import { AppUtils } from '../../../library/helpers/Utils';
import { ManageId } from '../../../stores/idManager';

import { Meta } from '../../../stores/meta';
import {
  GenericConstructor,
  ProvidersTypes,
  AppMetaKeys,
} from '../../../types';
import { useCtrStore } from '../store';
import { HttpMethods } from '../types';

export const Controller = function () {
  return function (constructor: GenericConstructor) {
    /// Update constructor meta (TargetConstructor and constructorName)
    Meta.define<string>({
      metaKey: AppMetaKeys.BASE_CONSTRUCTOR,
      metaType: ProvidersTypes.CONTROLLER,
      targetConstructor: constructor,
      constructorName: constructor.name,
    });

    // console.log(
    //   `Controller base class decorator :(${constructor.name}): running...📍📍📍📍`
    // );

    // Generate Id if not declared
    const targetId = ManageId.findId(ProvidersTypes.CONTROLLER) as string;

    const handlers = AppUtils.getControllerHandlers(constructor);

    for (let handler of handlers) {
      const httpMethod: HttpMethods | boolean = Meta.getData<HttpMethods>({
        id: targetId,
        metaType: ProvidersTypes.CONTROLLER,
        metaKey: AppMetaKeys.METHOD,
        propertyKey: handler,
      }) as HttpMethods | boolean;

      const routerUrl: string | boolean = Meta.getData<string>({
        id: targetId,
        metaType: ProvidersTypes.CONTROLLER,
        metaKey: AppMetaKeys.ROUTE_URL,
        propertyKey: handler,
      }) as HttpMethods | boolean;

      if (routerUrl && httpMethod) {
        // console.log({ httpMethod, routerUrl });

        const foundHttpMethod = httpMethod as HttpMethods;
        const foundRouteUrl = routerUrl as string;

        useCtrStore.dispatch({
          controllerId: targetId,
          handlerFn: constructor.prototype[handler],
          httpMethod: foundHttpMethod,
          routeUrl: foundRouteUrl,
        });
      }
    }

    /// Regenerate Id
    ManageId.regenerateId({
      type: ProvidersTypes.CONTROLLER,
      prevId: targetId,
      name: constructor.name,
    });
  };
};
