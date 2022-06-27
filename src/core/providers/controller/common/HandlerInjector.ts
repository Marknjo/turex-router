import { NextFunction, Request, Response } from 'express';
import { ManageId } from '../../../stores/idManager';
import { Meta } from '../../../stores/meta';
import { AppMetaKeys, ProvidersTypes } from '../../../types';
import { ClearCookieConstruct, CookieConstruct } from '../../controller';

/**
 * All Express Request Methods and Some Response methods are handled here
 * Injects to the controller/Middleware handler:
 *
 * - Params Decorators
 */
export class HandlerInjector {
  /**
   * Gets the current cycle key
   */
  private targetId: string;

  /**
   * Store previous provider type
   */
  private prevTargetId?: string;

  /**
   * Stores collection of all Params assigned to a handler
   */
  private handlerArgs: any[] = [];

  /**
   * Gets all metadata keys of the _construct
   */
  private metaDataKeys: string[] = [];

  /// Param keys
  /**
   * @Locals holds assigned locals position and action
   */
  private getLocalsMeta: { position: number; hasLocals: boolean } | undefined;

  /**
   * @RequestBody Get's request body key
   */
  private getRequestBodyMeta:
    | { position: number; hasBody: boolean }
    | undefined;

  /**
   * @Req Get's express request  key
   */
  private getReqMeta: { position: number; hasRequest: boolean } | undefined;

  /**
   * @Res Get's express request  key
   */
  private getResMeta: { position: number; hasResponse: boolean } | undefined;

  /**
   * @Next Get's express Next function key
   */
  private getNextMeta:
    | { position: number; hasNextFunction: boolean }
    | undefined;

  /**
   * @GetParams Get's request params key
   */
  private getParamsMeta: { position: number; hasParams: boolean } | undefined;

  /**
   * @QueryStrings Get's request query strings  key
   */
  private getQueryStringsMeta:
    | { position: number; hasQueryStrings: boolean }
    | undefined;

  /**
   * @OriginalUrl Get's original url key
   */
  private getOriginalUrlMeta:
    | { position: number; hasOriginalUrl: boolean }
    | undefined;

  /**
   * @GetPath Get's url path key (without query strings)
   */
  private getPathMeta: { position: number; hasPath: boolean } | undefined;

  /**
   * @GetBaseUrl Get's base url key
   */
  private getBaseUrlMeta: { position: number; hasBaseUrl: boolean } | undefined;

  /**
   * @GetProtocol Get's protocol key
   */
  private getProtocolMeta:
    | { position: number; hasProtocol: boolean }
    | undefined;

  /**
   * @GetHostname Get's hostname key
   */
  private getHostnameMeta:
    | { position: number; hasHostname: boolean }
    | undefined;

  /**
   * @GetReqGetter Get's Request getter key / get Method
   */
  private getReqGetterMeta:
    | { position: number; hasReqGetter: boolean }
    | undefined;

  /**
   * @GetIp Get's IP key
   */
  private getIpMeta: { position: number; hasIp: boolean } | undefined;

  /**
   * @GetIps Get's IP key
   */
  private getIpsMeta: { position: number; hasIps: boolean } | undefined;

  /**
   * @GetSubdomains Get's subdomains key
   */
  private getSubdomainsMeta:
    | { position: number; hasSubdomains: boolean }
    | undefined;

  /**
   * @IsSecure Get's is Secure key
   */
  private getIsSecureCheckerMeta:
    | { position: number; hasIsSecure: boolean }
    | undefined;

  /**
   * @IsStale Get's is Stale key
   */
  private getIsStaleCheckerMeta:
    | { position: number; hasIsStale: boolean }
    | undefined;

  /**
   * @IsFresh Get's is Stale key
   */
  private getIsFreshCheckerMeta:
    | { position: number; hasIsFresh: boolean }
    | undefined;

  /**
   * @IsXhr Get's is Stale key
   */
  private getIsXhrCheckerMeta:
    | { position: number; hasIsXhr: boolean }
    | undefined;

  /**
   * @GetCookies Get's all app's cookies key
   */
  private getCookiesMeta: { position: number; hasCookies: boolean } | undefined;

  /**
   * @GetSignedCookie Get's signed cookie key
   */
  private getSignedCookieMeta:
    | { position: number; hasSignedCookie: boolean }
    | undefined;

  /**
   * @GetSession Get's cookie-session middleware session key
   */
  private getSessionMeta: { position: number; hasSession: boolean } | undefined;

  /**
   * @ClearCookie Get's clear cookie  key
   */
  private getClearCookieMeta:
    | { position: number; hasClearCookie: boolean }
    | undefined;

  /// Setters
  /**
   * @Redirect Get's redirect setter key
   */
  private getRedirectSetterMeta:
    | { position: number; hasRedirect: boolean }
    | undefined;

  /**
   * @SetCookie Get's cookie setter key
   */
  private getCookieSetterMeta:
    | { position: number; hasSetCookie: boolean }
    | undefined;

  /**
   * @SetCookie Get's Context - Req or Res as object
   */
  private getCtxMeta: { position: number; hasCtx: boolean } | undefined;

  /**
   * Ensure Service injector os only called once on the lifecycle of the new app request
   */

  // private constructor() {}
  constructor(
    providerType: ProvidersTypes,
    private req: Request,
    private res: Response,
    private next: NextFunction
  ) {
    /// Assign key
    this.targetId = ManageId.findCurrentId(providerType) as string;

    /// Get all the meta data keys on the object
    this.optimizeMetadataKeysAssignment(providerType);

    /// config all Param meta data
    this.configParams();

    /// optimize id setting
    this.optimizeTargetIdAssignment();
  }

  /**
   * Initialize injector
   */

  /**
   * configs handler with the Params
   * @returns configs handler
   */
  injectParams(): any[] | Error {
    try {
      return this.handlerArgs;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sets a new target id only when the previous id is not the same as current id
   * And the the previous id is undefined
   *
   * This ensures the the target id is not set more than once for the same target constructor.
   */
  private optimizeTargetIdAssignment() {
    if (!this.prevTargetId || this.prevTargetId !== this.targetId) {
      this.prevTargetId = this.targetId;
    }
  }

  /**
   * Ensures the next call cycle does not call getPropertiesKeys of the provider
   * type has not changed and the id is still the same
   *
   *  don't get the metadatakeys of the provider type and the id has not changed
   *
   * @param providerType
   */
  private optimizeMetadataKeysAssignment(providerType: ProvidersTypes) {
    if (
      (this.metaDataKeys.length === 0 && !this.prevTargetId) ||
      (this.metaDataKeys.length > 0 && this.prevTargetId !== this.targetId)
    ) {
      this.metaDataKeys = Meta.getPropertiesKeys(
        this.targetId,
        providerType
      ) as string[] | [];
    }
  }

  /**
   * Factory for assigning Params/get Param actions and position
   */
  private assignMetadata() {
    /// A case where there are no handlers if the current target class
    if (this.metaDataKeys.length === 0) {
      return;
    }

    this.metaDataKeys.forEach(metadataMeta => {
      switch (metadataMeta) {
        // Assign Context object
        case AppMetaKeys.SET_REDIRECT:
          this.getCtxMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.CONTEXT,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasCtx: boolean } | undefined;
          break;

        /// Assign locals Param
        case AppMetaKeys.LOCALS:
          this.getLocalsMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.LOCALS,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasLocals: boolean } | undefined;
          break;

        /// Assign RequestBody Param
        case AppMetaKeys.GET_BODY:
          this.getRequestBodyMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.GET_BODY,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasBody: boolean } | undefined;
          break;

        /// Assign Req object key
        case AppMetaKeys.REQ:
          this.getReqMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.REQ,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasRequest: boolean } | undefined;
          break;

        /// Assign Res object key
        case AppMetaKeys.RES:
          this.getResMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.RES,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasResponse: boolean } | undefined;
          break;

        /// Assign Next function key
        case AppMetaKeys.NEXT:
          this.getNextMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.NEXT,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasNextFunction: boolean } | undefined;
          break;

        /// Assign Params key
        case AppMetaKeys.GET_PARAMS:
          this.getParamsMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.GET_PARAMS,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasParams: boolean } | undefined;
          break;

        /// Assign Params key
        case AppMetaKeys.GET_QUERY_STRINGS:
          this.getQueryStringsMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.GET_QUERY_STRINGS,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasQueryStrings: boolean } | undefined;
          break;

        /// Assign originalUrl key
        case AppMetaKeys.GET_ORIGINAL_URL:
          this.getOriginalUrlMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.GET_ORIGINAL_URL,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasOriginalUrl: boolean } | undefined;
          break;

        // Assign cookies key
        case AppMetaKeys.GET_COOKIES:
          this.getCookiesMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.GET_COOKIES,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasCookies: boolean } | undefined;
          break;

        // Assign signed cookies key
        case AppMetaKeys.GET_SIGNED_COOKIE:
          this.getSignedCookieMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.GET_SIGNED_COOKIE,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasSignedCookie: boolean } | undefined;
          break;

        // Assign session key
        case AppMetaKeys.GET_SESSION:
          this.getSessionMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.GET_SESSION,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasSession: boolean } | undefined;
          break;

        // Assign clear cookie key
        case AppMetaKeys.CLEAR_COOKIE:
          this.getClearCookieMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.CLEAR_COOKIE,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasClearCookie: boolean } | undefined;
          break;

        // Assign path key
        case AppMetaKeys.GET_PATH:
          this.getPathMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.GET_PATH,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasPath: boolean } | undefined;
          break;

        // Assign base url key
        case AppMetaKeys.GET_BASE_URL:
          this.getBaseUrlMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.GET_BASE_URL,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasBaseUrl: boolean } | undefined;
          break;

        // Assign hostname key
        case AppMetaKeys.GET_HOSTNAME:
          this.getHostnameMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.GET_HOSTNAME,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasHostname: boolean } | undefined;
          break;

        // Assign protocol key
        case AppMetaKeys.GET_PROTOCOL:
          this.getProtocolMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.GET_PROTOCOL,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasProtocol: boolean } | undefined;
          break;

        // Assign Request Getter key
        case AppMetaKeys.GET_REQ_GETTER:
          this.getReqGetterMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.GET_REQ_GETTER,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasReqGetter: boolean } | undefined;
          break;

        // Assign IP key
        case AppMetaKeys.GET_IP:
          this.getIpMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.GET_IP,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasIp: boolean } | undefined;
          break;

        // Assign IPs key
        case AppMetaKeys.GET_IPS:
          this.getIpsMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.GET_IPS,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasIps: boolean } | undefined;
          break;

        // Assign Subdomains key
        case AppMetaKeys.GET_SUBDOMAINS:
          this.getSubdomainsMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.GET_SUBDOMAINS,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasSubdomains: boolean } | undefined;
          break;

        /// CHECKERS
        // Assign isSecure key
        case AppMetaKeys.IS_SECURE:
          this.getIsSecureCheckerMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.IS_SECURE,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasIsSecure: boolean } | undefined;
          break;

        // Assign isStale key
        case AppMetaKeys.IS_STALE:
          this.getIsStaleCheckerMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.IS_STALE,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasIsStale: boolean } | undefined;
          break;

        // Assign isFresh key
        case AppMetaKeys.IS_FRESH:
          this.getIsFreshCheckerMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.IS_FRESH,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasIsFresh: boolean } | undefined;
          break;

        // Assign isFresh key
        case AppMetaKeys.IS_XHR:
          this.getIsXhrCheckerMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.IS_XHR,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasIsXhr: boolean } | undefined;
          break;

        /// SETTERS
        // Assign cookie setter key
        case AppMetaKeys.SET_COOKIE:
          this.getCookieSetterMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.SET_COOKIE,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasSetCookie: boolean } | undefined;
          break;

        // Assign redirect setter key
        case AppMetaKeys.SET_REDIRECT:
          this.getRedirectSetterMeta = Meta.getData({
            id: this.targetId,
            metaKey: AppMetaKeys.SET_REDIRECT,
            metaType: ProvidersTypes.CONTROLLER,
            propertyKey: metadataMeta,
          }) as { position: number; hasRedirect: boolean } | undefined;
          break;
      }
    });
  }

  /// HELPERS

  /**
   * This is where all the various body manipulation/modification happens
   *
   */
  private configParams() {
    /// Assign metadatakey to properties
    this.assignMetadata();

    /// Add Params to the handler argument object
    this.configCtxParam();

    this.configRedirectParam();

    this.configLocalsParam();

    this.configReqParam();

    this.configResParam();

    this.configNextFunctionParam();

    this.configRequestBodyParam();

    /// Req Methods
    this.configReqGetterParam();

    /// URL Configurations
    this.configParamsParam();
    this.configQueryStringParam();
    this.configOriginalUrlParam();
    this.configPathParam();
    this.configBaseUrlParam();
    this.configProtocolParam();
    this.configHostnameParam();

    /// IPS
    this.configIpParam();
    this.configIpsParam();
    this.configSubdomainsParam();

    /// CHECKS
    this.configIsSecureParam();
    this.configIsStaleParam();
    this.configIsFreshParam();
    this.configIsXhrParam();

    /// Cookies Configurations
    this.configSetCookieParam();
    this.configCookiesParam();
    this.configSignedCookiesParam();
    this.configSessionParam();
    this.configClearCookieParam();
  }

  /**
   * Handles Clearing cookies
   * @returns
   */
  private clearCookieHelper() {
    return (clearCookieOptions: ClearCookieConstruct) => {
      const { key, options } = clearCookieOptions;
      const setOptions = options ? options : {};

      const clear = this.res.clearCookie(key, setOptions);

      return clear;
    };
  }

  /**
   * Handles setting cookie options
   */
  private setCookieHelper() {
    return (cookieSettings: CookieConstruct) => {
      const { key, value, options } = cookieSettings;
      const setOptions = options ? options : {};

      return this.res.cookie(key, value, setOptions);
    };
  }

  /**
   * Handles Redirect
   */
  private setRedirectHelper() {
    return (url: string, statusCode?: number) => {
      if (statusCode) return this.res.redirect(statusCode, url);

      return this.res.redirect(url);
    };
  }

  /// Factory

  /**
   * Adds @Locals Param to the handler
   */
  private configLocalsParam() {
    if (this.getLocalsMeta && this.getLocalsMeta.hasLocals) {
      this.handlerArgs[this.getLocalsMeta.position] = this.res.locals;
    }
  }

  /**
   * Adds @Context Param to the handler
   */
  private configCtxParam() {
    if (this.getCtxMeta && this.getCtxMeta.hasCtx) {
      this.handlerArgs[this.getCtxMeta.position] = {
        req: this.req,
        res: this.res,
      };
    }
  }

  /**
   * Adds @Req Param to the handler
   */
  private configReqParam() {
    if (this.getReqMeta && this.getReqMeta.hasRequest) {
      this.handlerArgs[this.getReqMeta.position] = this.req;
    }
  }

  /**
   * Adds @Res Param to the handler
   */
  private configResParam() {
    if (this.getResMeta && this.getResMeta.hasResponse) {
      this.handlerArgs[this.getResMeta.position] = this.res;
    }
  }

  /**
   * Adds @Next Param to the handler
   */
  private configNextFunctionParam() {
    if (this.getNextMeta && this.getNextMeta.hasNextFunction) {
      this.handlerArgs[this.getNextMeta.position] = this.next;
    }
  }

  /**
   * Adds @RequestBody Param to the handler
   */
  private configRequestBodyParam() {
    if (this.getRequestBodyMeta && this.getRequestBodyMeta.hasBody) {
      this.handlerArgs[this.getRequestBodyMeta.position] = this.req.body;
    }
  }

  /**
   * Adds @GetParams Param to the handler
   */
  private configParamsParam() {
    if (this.getParamsMeta && this.getParamsMeta.hasParams) {
      this.handlerArgs[this.getParamsMeta.position] = this.req.params;
    }
  }

  /**
   * Adds @QueryStrings Param to the handler
   */
  private configQueryStringParam() {
    if (this.getQueryStringsMeta && this.getQueryStringsMeta.hasQueryStrings) {
      this.handlerArgs[this.getQueryStringsMeta.position] = this.req.query;
    }
  }

  /**
   * Adds @GetOriginalUrl Param to the handler
   */
  private configOriginalUrlParam() {
    if (this.getOriginalUrlMeta && this.getOriginalUrlMeta.hasOriginalUrl) {
      this.handlerArgs[this.getOriginalUrlMeta.position] = this.req.originalUrl;
    }
  }

  /**
   * Adds @GetPath Param to the handler
   */
  private configPathParam() {
    if (this.getPathMeta && this.getPathMeta.hasPath) {
      this.handlerArgs[this.getPathMeta.position] = this.req.path;
    }
  }

  /**
   * Adds @GetBaseUrl Param to the handler
   */
  private configBaseUrlParam() {
    if (this.getBaseUrlMeta && this.getBaseUrlMeta.hasBaseUrl) {
      this.handlerArgs[this.getBaseUrlMeta.position] = this.req.path;
    }
  }

  /**
   * Adds @GetProtocol Param to the handler
   */
  private configProtocolParam() {
    if (this.getProtocolMeta && this.getProtocolMeta.hasProtocol) {
      this.handlerArgs[this.getProtocolMeta.position] = this.req.protocol;
    }
  }

  /**
   * Adds @GetHostname Param to the handler
   */
  private configHostnameParam() {
    if (this.getHostnameMeta && this.getHostnameMeta.hasHostname) {
      this.handlerArgs[this.getHostnameMeta.position] = this.req.hostname;
    }
  }

  /**
   * Adds @GetIp Param to the handler
   */
  private configIpParam() {
    if (this.getIpMeta && this.getIpMeta.hasIp) {
      this.handlerArgs[this.getIpMeta.position] = this.req.ip;
    }
  }

  /**
   * Adds @GetIps Param to the handler
   */
  private configIpsParam() {
    if (this.getIpsMeta && this.getIpsMeta.hasIps) {
      this.handlerArgs[this.getIpsMeta.position] = this.req.ips;
    }
  }

  /**
   * Adds @GetSubdomains Param to the handler
   */
  private configSubdomainsParam() {
    if (this.getSubdomainsMeta && this.getSubdomainsMeta.hasSubdomains) {
      this.handlerArgs[this.getSubdomainsMeta.position] = this.req.subdomains;
    }
  }

  /**
   * Adds @IsSecure Param to the handler
   */
  private configIsSecureParam() {
    if (
      this.getIsSecureCheckerMeta &&
      this.getIsSecureCheckerMeta.hasIsSecure
    ) {
      this.handlerArgs[this.getIsSecureCheckerMeta.position] = this.req.secure;
    }
  }

  /**
   * Adds @IsStale Param to the handler
   */
  private configIsStaleParam() {
    if (this.getIsStaleCheckerMeta && this.getIsStaleCheckerMeta.hasIsStale) {
      this.handlerArgs[this.getIsStaleCheckerMeta.position] = this.req.stale;
    }
  }

  /**
   * Adds @IsSFresh Param to the handler
   */
  private configIsFreshParam() {
    if (this.getIsFreshCheckerMeta && this.getIsFreshCheckerMeta.hasIsFresh) {
      this.handlerArgs[this.getIsFreshCheckerMeta.position] = this.req.fresh;
    }
  }

  /**
   * Adds @IsSXhr Param to the handler
   */
  private configIsXhrParam() {
    if (this.getIsXhrCheckerMeta && this.getIsXhrCheckerMeta.hasIsXhr) {
      this.handlerArgs[this.getIsXhrCheckerMeta.position] = this.req.xhr;
    }
  }

  /// COOKIES AND SESSIONS

  /**
   * Adds @GetCookies Param to the handler
   */
  private configCookiesParam() {
    if (this.getCookiesMeta && this.getCookiesMeta.hasCookies) {
      this.handlerArgs[this.getCookiesMeta.position] = this.req.cookies;
    }
  }

  /**
   * Adds @GetSignedCookie Param to the handler
   */
  private configSignedCookiesParam() {
    if (this.getSignedCookieMeta && this.getSignedCookieMeta.hasSignedCookie) {
      this.handlerArgs[this.getSignedCookieMeta.position] =
        this.req.signedCookies;
    }
  }

  /**
   * Adds @ClearCookie Param to the handler
   */
  private configClearCookieParam() {
    if (this.getClearCookieMeta && this.getClearCookieMeta.hasClearCookie) {
      this.handlerArgs[this.getClearCookieMeta.position] =
        this.clearCookieHelper();
    }
  }

  /**
   * Adds @GetSession Param to the handler
   */
  private configSessionParam() {
    if (
      this.req.session &&
      this.getSessionMeta &&
      this.getSessionMeta.hasSession
    ) {
      this.handlerArgs[this.getSessionMeta.position] = this.req.session;
    }
  }

  //// REQ METHODS
  /**
   * Adds @GetReqGetter Param to the handler
   */
  private configReqGetterParam() {
    if (this.getReqGetterMeta && this.getReqGetterMeta.hasReqGetter) {
      this.handlerArgs[this.getReqGetterMeta.position] = (value: string) => {
        return this.req.get(value);
      };
    }
  }

  //// SETTERS CONFIGURATIONS
  /**
   * Adds @SetCookie Param to the handler
   */
  private configSetCookieParam() {
    if (this.getCookieSetterMeta && this.getCookieSetterMeta.hasSetCookie) {
      this.handlerArgs[this.getCookieSetterMeta.position] =
        this.setCookieHelper();
    }
  }

  /**
   * Adds @GetRedirect Param to the handler
   */
  private configRedirectParam() {
    if (this.getRedirectSetterMeta && this.getRedirectSetterMeta.hasRedirect) {
      this.handlerArgs[this.getRedirectSetterMeta.position] =
        this.setRedirectHelper();
    }
  }
}
