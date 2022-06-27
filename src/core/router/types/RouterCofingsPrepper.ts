import { RouterPrepMergeParamsWithResponse } from './RouterPrepMergeParamsWithResponse';

export interface RouterConfigsPrepper {
  mergeParamsWithOptions: RouterPrepMergeParamsWithResponse[] | boolean;
  mergeParamsOption: boolean;
}
