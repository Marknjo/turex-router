import 'reflect-metadata';
import { SiteWideKeys } from '../../types';
import { RouterMergeParamsWithHandler } from '../types';

export const MergeParamsWith = function (
  constructor: any,
  handler: string,
  _desc: RouterMergeParamsWithHandler
) {
  Reflect.defineMetadata(
    SiteWideKeys.ROUTER_MERGE_PARAMS_WITH,
    true,
    constructor,
    handler
  );
};
