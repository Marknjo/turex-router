import { RouterMergeParamsWithOptions } from './RouterMergeParamsWithOptions';

export interface RouterMergeParamsWithHandler extends PropertyDescriptor {
  value?: () => RouterMergeParamsWithOptions[];
}
