// import 'reflect-metadata';
import { Meta } from '../../stores/meta';
import { AppMetaKeys, ProvidersTypes } from '../../types';
import { RouterMergeParamsWithHandler } from '../types';

export const MergeParamsWith = function (
  _: any,
  handler: string,
  _desc: RouterMergeParamsWithHandler
) {
  // Reflect.defineMetadata(
  //   AppMetaKeys.ROUTER_MERGE_PARAMS_WITH,
  //   true,
  //   constructor,
  //   handler
  // );

  Meta.define<boolean>({
    metaKey: AppMetaKeys.ROUTER_MERGE_PARAMS,
    metaType: ProvidersTypes.ROUTER,
    metaValue: true,
    propertyKey: handler,
  });
};
