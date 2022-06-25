import 'reflect-metadata';
import { AppMetaKeys } from '../../types';
import { RouterMergeParamsHandler } from '../types';

export const MergeParams = function (
  constructor: any,
  handler: string,
  _desc: RouterMergeParamsHandler
) {
  // Reflect.defineMetadata(
  //   AppMetaKeys.ROUTER_MERGE_PARAMS,
  //   true,
  //   constructor,
  //   handler
  // );
};
