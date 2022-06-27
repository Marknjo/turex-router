/// Imports
import { Meta } from '../../../stores/meta';
import { AppMetaKeys, ProvidersTypes } from '../../../types';
import { ParamsDecoratorsActions } from '../types';

/// Define middleware decorator
export const paramsBinder = function (feature: any, featureCheck: string) {
  return function (_: any, handler: string, position: number) {
    Meta.define<{ [key: string]: boolean | number }>({
      metaKey: feature,
      metaValue: { position, [featureCheck]: true },
      metaType: ProvidersTypes.CONTROLLER,
      propertyKey: handler,
    });
  };
};

export const Ctx = paramsBinder(
  AppMetaKeys.CONTEXT,
  ParamsDecoratorsActions.HAS_CTX
);

export const Req = paramsBinder(
  AppMetaKeys.REQ,
  ParamsDecoratorsActions.HAS_REQ
);

export const Res = paramsBinder(
  AppMetaKeys.RES,
  ParamsDecoratorsActions.HAS_RES
);

export const Next = paramsBinder(
  AppMetaKeys.NEXT,
  ParamsDecoratorsActions.HAS_NEXT
);

export const SetLocals = paramsBinder(
  AppMetaKeys.LOCALS,
  ParamsDecoratorsActions.HAS_LOCALS
);

export const SetRedirect = paramsBinder(
  AppMetaKeys.SET_REDIRECT,
  ParamsDecoratorsActions.HAS_REDIRECT
);

export const GetRequestBody = paramsBinder(
  AppMetaKeys.GET_BODY,
  ParamsDecoratorsActions.HAS_BODY
);

export const GetParams = paramsBinder(
  AppMetaKeys.GET_PARAMS,
  ParamsDecoratorsActions.HAS_PARAMS
);

export const GetQueryStrings = paramsBinder(
  AppMetaKeys.GET_QUERY_STRINGS,
  ParamsDecoratorsActions.HAS_QUERY_STRINGS
);

export const GetOriginalUrl = paramsBinder(
  AppMetaKeys.GET_ORIGINAL_URL,
  ParamsDecoratorsActions.HAS_ORIGINAL_URL
);

export const GetPath = paramsBinder(
  AppMetaKeys.GET_PATH,
  ParamsDecoratorsActions.HAS_PATH
);

export const GetBaseUrl = paramsBinder(
  AppMetaKeys.GET_BASE_URL,
  ParamsDecoratorsActions.HAS_BASE_URL
);

export const GetProtocol = paramsBinder(
  AppMetaKeys.GET_PROTOCOL,
  ParamsDecoratorsActions.HAS_PROTOCOL
);

export const GetHostname = paramsBinder(
  AppMetaKeys.GET_HOSTNAME,
  ParamsDecoratorsActions.HAS_HOSTNAME
);

/// IPS
export const GetIp = paramsBinder(
  AppMetaKeys.GET_IP,
  ParamsDecoratorsActions.HAS_IP
);

export const GetIps = paramsBinder(
  AppMetaKeys.GET_IPS,
  ParamsDecoratorsActions.HAS_IPS
);

export const GetSubdomains = paramsBinder(
  AppMetaKeys.GET_SUBDOMAINS,
  ParamsDecoratorsActions.HAS_SUBDOMAINS
);

/// CHECKS
export const IsSecure = paramsBinder(
  AppMetaKeys.IS_SECURE,
  ParamsDecoratorsActions.HAS_IS_SECURE
);

export const IsXhr = paramsBinder(
  AppMetaKeys.IS_XHR,
  ParamsDecoratorsActions.HAS_IS_XHR
);

export const IsStale = paramsBinder(
  AppMetaKeys.IS_STALE,
  ParamsDecoratorsActions.HAS_IS_STALE
);

export const IsFresh = paramsBinder(
  AppMetaKeys.IS_FRESH,
  ParamsDecoratorsActions.HAS_IS_FRESH
);

/// METHODS - REQUEST
export const GetReqGetter = paramsBinder(
  AppMetaKeys.GET_REQ_GETTER,
  ParamsDecoratorsActions.HAS_REQ_GETTER
);

/// COOKIES
export const SetCookie = paramsBinder(
  AppMetaKeys.SET_COOKIE,
  ParamsDecoratorsActions.HAS_SET_COOKIE
);

export const GetCookies = paramsBinder(
  AppMetaKeys.GET_COOKIES,
  ParamsDecoratorsActions.HAS_COOKIES
);

export const GetSignedCookie = paramsBinder(
  AppMetaKeys.GET_SIGNED_COOKIE,
  ParamsDecoratorsActions.HAS_SIGNED_COOKIE
);

export const ClearCookie = paramsBinder(
  AppMetaKeys.CLEAR_COOKIE,
  ParamsDecoratorsActions.HAS_CLEAR_COOKIE
);

///// THIRD PARTY SUPPORT

/// SUpport of cookie-session middleware
export const GetSession = paramsBinder(
  AppMetaKeys.GET_SESSION,
  ParamsDecoratorsActions.HAS_SESSION
);
