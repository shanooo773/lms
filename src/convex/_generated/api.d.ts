/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as client from "../client.js";
import type * as functions_createCourse from "../functions/createCourse.js";
import type * as functions_createUser from "../functions/createUser.js";
import type * as functions_sendContactMessage from "../functions/sendContactMessage.js";
import type * as functions_updateProgress from "../functions/updateProgress.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  client: typeof client;
  "functions/createCourse": typeof functions_createCourse;
  "functions/createUser": typeof functions_createUser;
  "functions/sendContactMessage": typeof functions_sendContactMessage;
  "functions/updateProgress": typeof functions_updateProgress;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
