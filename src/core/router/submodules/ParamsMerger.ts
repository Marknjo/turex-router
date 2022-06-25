import { Router } from 'express';

import { usePreRoutesStore } from '../store/PreRoutesStore';
import { RouterPrepMergeParamsWithResponse } from '../types';

export default class ParamsMerger {
  constructor(
    private router: Router,
    private mergeParamsWithOptions:
      | boolean
      | RouterPrepMergeParamsWithResponse[]
  ) {
    this.mergeParamsMiddleware();
  }

  /**
   * Register a middleware with merge options
   *
   * Takes an array of defined merge with params to register a middleware router
   *
   */
  private mergeParamsMiddleware() {
    if (this.mergeParamsWithOptions) {
      const mergeParamsWithOptions = this
        .mergeParamsWithOptions as RouterPrepMergeParamsWithResponse[];

      mergeParamsWithOptions.forEach(options => {
        const routerMatch = usePreRoutesStore.findRouteByName(
          options.routeName
        );

        if (routerMatch) {
          this.router.use(options.mergePath, routerMatch);
        }
      });
    }
  }
}
