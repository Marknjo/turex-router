// import 'reflect-metadata';
import { Meta } from '../../stores/meta';
import { AppMetaKeys, ProvidersTypes } from '../../types';
import { RouterMergeParamsHandler } from '../types';

export const MergeParams = function (
  _: any,
  handler: string,
  _desc: RouterMergeParamsHandler
) {
  // Reflect.defineMetadata(
  //   AppMetaKeys.ROUTER_MERGE_PARAMS,
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
