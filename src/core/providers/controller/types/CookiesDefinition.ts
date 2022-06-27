import { CookieOptions } from 'express';

export interface CookieConstruct {
  key: string;
  value: symbol | string | number | boolean | any[] | { [key: string]: any };
  options?: CookieOptions;
}

export interface ClearCookieConstruct {
  key: string;
  options?: CookieOptions;
}

export type CookieFunction = (settings: CookieConstruct) => any;

export type ClearCookieFunction = (settings: ClearCookieConstruct) => any;
