import { AppUtils } from '../../library/helpers/Utils';
import { Meta } from '../../stores/meta';
import { AppMetaKeys, GenericConstructor, ProvidersTypes } from '../../types';
import {
  RouterCofingsPrepper,
  RouterConfigsOptions,
  RouterMergeParamsWithOptions,
  RouterPrepMergeParamsWithResponse,
} from '../types';

/**
 * Prepares merge params configurations.
 *
 * The configurations can be set in both the RouterConfigs section or via methods
 *
 * For MergeWith, the common convection is to use methods with mergeParamsRouterName i.e. mergeParamsWithPostRoute.
 * It is not a must though. Simply name your method and mark it with @MergeParams
 * - NB: Do not use more than one method in your class to mark MergeParam.
 * However, the router won't complain. The last method in your list will be the one used as a final value
 *
 * For MergeParams with, You return an Array of mergePaths and routeName i.e. [mergePath: '/posts/:postId/comments', routeName:CommentsRoute]
 * - your Route config can only accept one mergeParamsWith
 * - However, using class methods you can add several with @MergeParamsWith
 * the router will handle merging behind the scenes for you;
 *
 */
export default class CofingsPrepper {
  /**
   * Stores the merge params option when declared via a route handler
   */
  private handlerMergeParamsOption: boolean = false;

  /**
   * Stores Merge params with options when declared via a route handler
   */
  private handlerMergeParamsWithOptions: RouterMergeParamsWithOptions[] = [];

  constructor(
    private targetId: string,
    private routerConstructor: GenericConstructor,
    private configs: RouterConfigsOptions
  ) {
    this.getRouterConfigsViaHandlers();
  }

  /**
   *
   * @returns
   */
  getMergeParamsConfigs(): RouterCofingsPrepper {
    return {
      mergeParamsWithOptions: this.mergeParamsWithBasedOnSource(),
      mergeParamsOption: this.mergeParamsBasedOnSource(),
    };
  }

  /**
   * Filters the merge options dublicates
   * and transforms the mergeWithOptions route from Function to string,
   * the actual name of the Route merging params with
   *
   * It does accept {}, "", [], but the output will be {route: "", mergePath: ""}
   *  - Ensures the method fail silently
   *
   * @param mergeParamsWithOptions
   * @returns
   */
  private filterDublicatesAndTransform(
    mergeParamsWithOptions: RouterMergeParamsWithOptions[]
  ): { mergePath: string; routeName: string }[] {
    /// Type gurads
    if (
      mergeParamsWithOptions.length === 0 ||
      typeof mergeParamsWithOptions !== 'object' ||
      !Object.hasOwn(mergeParamsWithOptions, 'length')
    ) {
      return [{ mergePath: '', routeName: '' }];
    }

    /// filterDefaults
    const filterDefaults = { mergePath: '', routeName: '' };

    /// Filter dublicates
    const transFormDublicate = mergeParamsWithOptions.reduce(
      (prevOp, currOp) => {
        const prevOpIndex = prevOp.length - 1;

        if (
          prevOp[prevOpIndex].mergePath !== currOp.mergePath &&
          prevOp[prevOpIndex].routeName !== currOp.routeName.name
        ) {
          const currentOptions = {
            mergePath: currOp.mergePath,
            routeName: currOp.routeName.name,
          };
          prevOp =
            prevOp[prevOpIndex].mergePath === ''
              ? [currentOptions]
              : [...prevOp, currentOptions];
        }

        return prevOp;
      },
      [filterDefaults]
    );

    return transFormDublicate;
  }

  /**
   * Gets router configurations defined in the router class {mergeParams and useParams}
   *
   * @returns A router configurations defined via a handler
   */
  private getRouterConfigsViaHandlers() {
    const handlers = AppUtils.getControllerHandlers(this.routerConstructor);

    if (handlers.length === 0) {
      return;
    }

    for (let handler of handlers) {
      /// MergeParams
      // const getMergeParamsOption = Reflect.getMetadata(
      //   AppMetaKeys.ROUTER_MERGE_PARAMS,
      //   this.routerConstructor.prototype,
      //   handler
      // );

      // const getMergeParamsOption = Reflect.getMetadata(
      //   AppMetaKeys.ROUTER_MERGE_PARAMS,
      //   this.routerConstructor.prototype,
      //   handler
      // );

      // get merge params
      const getMergeParamsOption = Meta.getData<boolean>({
        metaKey: AppMetaKeys.ROUTER_MERGE_PARAMS,
        id: this.targetId,
        propertyKey: handler,
        metaType: ProvidersTypes.ROUTER,
      });

      /// Handle merge config
      if (getMergeParamsOption) {
        this.handlerMergeParamsOption = this.routerConstructor.prototype[
          handler
        ]() as boolean;
      }

      /// Handle use merge configs
      // const getMergeParamsWithOptions = Reflect.getMetadata(
      //   AppMetaKeys.ROUTER_MERGE_PARAMS_WITH,
      //   this.routerConstructor.prototype,
      //   handler
      // );

      /// Get Merge Params
      const getMergeParamsWithOptions = Meta.getData<boolean>({
        metaKey: AppMetaKeys.ROUTER_MERGE_PARAMS_WITH,
        id: this.targetId,
        propertyKey: handler,
        metaType: ProvidersTypes.ROUTER,
      });

      if (getMergeParamsWithOptions) {
        const paramsMergeWithOptions =
          this.routerConstructor.prototype[handler]();

        this.handlerMergeParamsWithOptions = [
          ...this.handlerMergeParamsWithOptions,
          ...paramsMergeWithOptions,
        ];
      }
    }
  }

  /**
   * Handlers merging params based on the source of entry
   * i.e. via RouterConfigs MergeParams or via Router method with a decorator @MergeParamsWith
   */
  private mergeParamsWithBasedOnSource():
    | boolean
    | RouterPrepMergeParamsWithResponse[] {
    /// Use middleware where params merging via handler
    if (this.handlerMergeParamsWithOptions.length > 0) {
      return this.filterDublicatesAndTransform(
        this.handlerMergeParamsWithOptions
      );
    }

    /// Use middleware where params merging via configs
    if (
      this.configs.mergeParamsWith &&
      this.configs.mergeParamsWith.length > 0
    ) {
      return this.filterDublicatesAndTransform(this.configs.mergeParamsWith);
    }

    return false;
  }

  /**
   * Evaluates whether a mergeParams Parameter is provided based on the source of entry
   *  i.e. via RouterConfigs MergeParams or via Router method with a decorator @MergeParamsWith
   * @returns Does not return
   */
  private mergeParamsBasedOnSource(): boolean {
    if (this.handlerMergeParamsOption) {
      return this.handlerMergeParamsOption;
    }

    if (this.configs.mergeParams) {
      return this.configs.mergeParams;
    }

    return false;
  }
}
