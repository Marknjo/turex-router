import 'reflect-metadata';
import { AppMetaKeys } from '../../types';
import { RouterMergeParamsWithHandler } from '../types';

export const MergeParamsWith = function (
  constructor: any,
  handler: string,
  _desc: RouterMergeParamsWithHandler
) {
  // Reflect.defineMetadata(
  //   AppMetaKeys.ROUTER_MERGE_PARAMS_WITH,
  //   true,
  //   constructor,
  //   handler
  // );
};
