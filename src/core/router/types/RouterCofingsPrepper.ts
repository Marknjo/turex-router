import { RouterPrepMergeParamsWithResponse } from './RouterPrepMergeParamsWithResponse';

export interface RouterCofingsPrepper {
  mergeParamsWithOptions: RouterPrepMergeParamsWithResponse[] | boolean;
  mergeParamsOption: boolean;
}
