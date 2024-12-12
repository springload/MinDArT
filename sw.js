var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/serwist/dist/chunks/waitUntil.js
var messages = {
  "invalid-value": ({ paramName, validValueDescription, value }) => {
    if (!paramName || !validValueDescription) {
      throw new Error(`Unexpected input to 'invalid-value' error.`);
    }
    return `The '${paramName}' parameter was given a value with an unexpected value. ${validValueDescription} Received a value of ${JSON.stringify(value)}.`;
  },
  "not-an-array": ({ moduleName, className, funcName, paramName }) => {
    if (!moduleName || !className || !funcName || !paramName) {
      throw new Error(`Unexpected input to 'not-an-array' error.`);
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className}.${funcName}()' must be an array.`;
  },
  "incorrect-type": ({ expectedType, paramName, moduleName, className, funcName }) => {
    if (!expectedType || !paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-type' error.`);
    }
    const classNameStr = className ? `${className}.` : "";
    return `The parameter '${paramName}' passed into '${moduleName}.${classNameStr}${funcName}()' must be of type ${expectedType}.`;
  },
  "incorrect-class": ({ expectedClassName, paramName, moduleName, className, funcName, isReturnValueProblem }) => {
    if (!expectedClassName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-class' error.`);
    }
    const classNameStr = className ? `${className}.` : "";
    if (isReturnValueProblem) {
      return `The return value from '${moduleName}.${classNameStr}${funcName}()' must be an instance of class ${expectedClassName}.`;
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${classNameStr}${funcName}()' must be an instance of class ${expectedClassName}.`;
  },
  "missing-a-method": ({ expectedMethod, paramName, moduleName, className, funcName }) => {
    if (!expectedMethod || !paramName || !moduleName || !className || !funcName) {
      throw new Error(`Unexpected input to 'missing-a-method' error.`);
    }
    return `${moduleName}.${className}.${funcName}() expected the '${paramName}' parameter to expose a '${expectedMethod}' method.`;
  },
  "add-to-cache-list-unexpected-type": ({ entry }) => {
    return `An unexpected entry was passed to 'serwist.Serwist.addToPrecacheList()' The entry '${JSON.stringify(entry)}' isn't supported. You must supply an array of strings with one or more characters, objects with a url property or Request objects.`;
  },
  "add-to-cache-list-conflicting-entries": ({ firstEntry, secondEntry }) => {
    if (!firstEntry || !secondEntry) {
      throw new Error(`Unexpected input to 'add-to-cache-list-duplicate-entries' error.`);
    }
    return `Two of the entries passed to 'serwist.Serwist.addToPrecacheList()' had the URL ${firstEntry} but different revision details. Serwist is unable to cache and version the asset correctly. Please remove one of the entries.`;
  },
  "plugin-error-request-will-fetch": ({ thrownErrorMessage }) => {
    if (!thrownErrorMessage) {
      throw new Error(`Unexpected input to 'plugin-error-request-will-fetch', error.`);
    }
    return `An error was thrown by a plugin's 'requestWillFetch()' method. The thrown error message was: '${thrownErrorMessage}'.`;
  },
  "invalid-cache-name": ({ cacheNameId, value }) => {
    if (!cacheNameId) {
      throw new Error(`Expected a 'cacheNameId' for error 'invalid-cache-name'`);
    }
    return `You must provide a name containing at least one character for setCacheDetails({${cacheNameId}: '...'}). Received a value of '${JSON.stringify(value)}'`;
  },
  "unregister-route-but-not-found-with-method": ({ method }) => {
    if (!method) {
      throw new Error(`Unexpected input to 'unregister-route-but-not-found-with-method' error.`);
    }
    return `The route you're trying to unregister was not  previously registered for the method type '${method}'.`;
  },
  "unregister-route-route-not-registered": () => {
    return `The route you're trying to unregister was not previously registered.`;
  },
  "queue-replay-failed": ({ name }) => {
    return `Replaying the background sync queue '${name}' failed.`;
  },
  "duplicate-queue-name": ({ name }) => {
    return `The queue name '${name}' is already being used. All instances of 'serwist.BackgroundSyncQueue' must be given unique names.`;
  },
  "expired-test-without-max-age": ({ methodName, paramName }) => {
    return `The '${methodName}()' method can only be used when the '${paramName}' is used in the constructor.`;
  },
  "unsupported-route-type": ({ moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter was an unsupported type. Please check the docs for ${moduleName}.${className}.${funcName} for valid input types.`;
  },
  "not-array-of-class": ({ value, expectedClass, moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter must be an array of '${expectedClass}' objects. Received '${JSON.stringify(value)},'. Please check the call to ${moduleName}.${className}.${funcName}() to fix the issue.`;
  },
  "max-entries-or-age-required": ({ moduleName, className, funcName }) => {
    return `You must define either 'config.maxEntries' or 'config.maxAgeSeconds' in '${moduleName}.${className}.${funcName}'`;
  },
  "statuses-or-headers-required": ({ moduleName, className, funcName }) => {
    return `You must define either 'config.statuses' or 'config.headers' in '${moduleName}.${className}.${funcName}'`;
  },
  "invalid-string": ({ moduleName, funcName, paramName }) => {
    if (!paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'invalid-string' error.`);
    }
    return `When using strings, the '${paramName}' parameter must start with 'http' (for cross-origin matches) or '/' (for same-origin matches). Please see the docs for ${moduleName}.${funcName}() for more info.`;
  },
  "channel-name-required": () => {
    return "You must provide a channelName to construct a BroadcastCacheUpdate instance.";
  },
  "invalid-responses-are-same-args": () => {
    return "The arguments passed into responsesAreSame() appear to be invalid. Please ensure valid Responses are used.";
  },
  "expire-custom-caches-only": () => {
    return `You must provide a 'cacheName' property when using the expiration plugin with a runtime caching strategy.`;
  },
  "unit-must-be-bytes": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'unit-must-be-bytes' error.`);
    }
    return `The 'unit' portion of the Range header must be set to 'bytes'. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "single-range-only": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'single-range-only' error.`);
    }
    return `Multiple ranges are not supported. Please use a  single start value, and optional end value. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "invalid-range-values": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'invalid-range-values' error.`);
    }
    return `The Range header is missing both start and end values. At least one of those values is needed. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "no-range-header": () => {
    return "No Range header was found in the Request provided.";
  },
  "range-not-satisfiable": ({ size, start, end }) => {
    return `The start (${start}) and end (${end}) values in the Range are not satisfiable by the cached response, which is ${size} bytes.`;
  },
  "attempt-to-cache-non-get-request": ({ url, method }) => {
    return `Unable to cache '${url}' because it is a '${method}' request and only 'GET' requests can be cached.`;
  },
  "cache-put-with-no-response": ({ url }) => {
    return `There was an attempt to cache '${url}' but the response was not defined.`;
  },
  "no-response": ({ url, error }) => {
    let message = `The strategy could not generate a response for '${url}'.`;
    if (error) {
      message += ` The underlying error is ${error}.`;
    }
    return message;
  },
  "bad-precaching-response": ({ url, status }) => {
    return `The precaching request for '${url}' failed${status ? ` with an HTTP status of ${status}.` : "."}`;
  },
  "non-precached-url": ({ url }) => {
    return `'createHandlerBoundToURL("${url}")' was called, but that URL is not precached. Please pass in a URL that is precached instead.`;
  },
  "add-to-cache-list-conflicting-integrities": ({ url }) => {
    return `Two of the entries passed to 'serwist.Serwist.addToPrecacheList()' had the URL ${url} with different integrity values. Please remove one of them.`;
  },
  "missing-precache-entry": ({ cacheName, url }) => {
    return `Unable to find a precached response in ${cacheName} for ${url}.`;
  },
  "cross-origin-copy-response": ({ origin }) => {
    return `'@serwist/core.copyResponse()' can only be used with same-origin responses. It was passed a response with origin ${origin}.`;
  },
  "opaque-streams-source": ({ type }) => {
    const message = `One of the '@serwist/streams' sources resulted in an '${type}' response.`;
    if (type === "opaqueredirect") {
      return `${message} Please do not use a navigation request that results in a redirect as a source.`;
    }
    return `${message} Please ensure your sources are CORS-enabled.`;
  }
};
var generatorFunction = (code, details = {}) => {
  const message = messages[code];
  if (!message) {
    throw new Error(`Unable to find message for code '${code}'.`);
  }
  return message(details);
};
var messageGenerator = false ? fallback : generatorFunction;
var SerwistError = class extends Error {
  constructor(errorCode, details) {
    const message = messageGenerator(errorCode, details);
    super(message);
    __publicField(this, "details");
    this.name = errorCode;
    this.details = details;
  }
};
var isArray = (value, details) => {
  if (!Array.isArray(value)) {
    throw new SerwistError("not-an-array", details);
  }
};
var hasMethod = (object, expectedMethod, details) => {
  const type = typeof object[expectedMethod];
  if (type !== "function") {
    details.expectedMethod = expectedMethod;
    throw new SerwistError("missing-a-method", details);
  }
};
var isType = (object, expectedType, details) => {
  if (typeof object !== expectedType) {
    details.expectedType = expectedType;
    throw new SerwistError("incorrect-type", details);
  }
};
var isInstance = (object, expectedClass, details) => {
  if (!(object instanceof expectedClass)) {
    details.expectedClassName = expectedClass.name;
    throw new SerwistError("incorrect-class", details);
  }
};
var isOneOf = (value, validValues, details) => {
  if (!validValues.includes(value)) {
    details.validValueDescription = `Valid values are ${JSON.stringify(validValues)}.`;
    throw new SerwistError("invalid-value", details);
  }
};
var isArrayOfClass = (value, expectedClass, details) => {
  const error = new SerwistError("not-array-of-class", details);
  if (!Array.isArray(value)) {
    throw error;
  }
  for (const item of value) {
    if (!(item instanceof expectedClass)) {
      throw error;
    }
  }
};
var finalAssertExports = false ? null : {
  hasMethod,
  isArray,
  isInstance,
  isOneOf,
  isType,
  isArrayOfClass
};
var logger = false ? null : (() => {
  if (!("__WB_DISABLE_DEV_LOGS" in globalThis)) {
    self.__WB_DISABLE_DEV_LOGS = false;
  }
  let inGroup = false;
  const methodToColorMap = {
    debug: "#7f8c8d",
    log: "#2ecc71",
    warn: "#f39c12",
    error: "#c0392b",
    groupCollapsed: "#3498db",
    groupEnd: null
  };
  const print = (method, args) => {
    if (self.__WB_DISABLE_DEV_LOGS) {
      return;
    }
    if (method === "groupCollapsed") {
      if (typeof navigator !== "undefined" && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        console[method](...args);
        return;
      }
    }
    const styles = [
      `background: ${methodToColorMap[method]}`,
      "border-radius: 0.5em",
      "color: white",
      "font-weight: bold",
      "padding: 2px 0.5em"
    ];
    const logPrefix = inGroup ? [] : [
      "%cserwist",
      styles.join(";")
    ];
    console[method](...logPrefix, ...args);
    if (method === "groupCollapsed") {
      inGroup = true;
    }
    if (method === "groupEnd") {
      inGroup = false;
    }
  };
  const loggerMethods = Object.keys(methodToColorMap);
  return loggerMethods.reduce((api, method) => {
    api[method] = (...args) => {
      print(method, args);
    };
    return api;
  }, {});
})();
var getFriendlyURL = (url) => {
  const urlObj = new URL(String(url), location.href);
  return urlObj.href.replace(new RegExp(`^${location.origin}`), "");
};
var _cacheNameDetails = {
  googleAnalytics: "googleAnalytics",
  precache: "precache-v2",
  prefix: "serwist",
  runtime: "runtime",
  suffix: typeof registration !== "undefined" ? registration.scope : ""
};
var _createCacheName = (cacheName) => {
  return [
    _cacheNameDetails.prefix,
    cacheName,
    _cacheNameDetails.suffix
  ].filter((value) => value && value.length > 0).join("-");
};
var eachCacheNameDetail = (fn) => {
  for (const key of Object.keys(_cacheNameDetails)) {
    fn(key);
  }
};
var cacheNames = {
  updateDetails: (details) => {
    eachCacheNameDetail((key) => {
      const detail = details[key];
      if (typeof detail === "string") {
        _cacheNameDetails[key] = detail;
      }
    });
  },
  getGoogleAnalyticsName: (userCacheName) => {
    return userCacheName || _createCacheName(_cacheNameDetails.googleAnalytics);
  },
  getPrecacheName: (userCacheName) => {
    return userCacheName || _createCacheName(_cacheNameDetails.precache);
  },
  getPrefix: () => {
    return _cacheNameDetails.prefix;
  },
  getRuntimeName: (userCacheName) => {
    return userCacheName || _createCacheName(_cacheNameDetails.runtime);
  },
  getSuffix: () => {
    return _cacheNameDetails.suffix;
  }
};
var Deferred = class {
  constructor() {
    __publicField(this, "promise");
    __publicField(this, "resolve");
    __publicField(this, "reject");
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
};
function stripParams(fullURL, ignoreParams) {
  const strippedURL = new URL(fullURL);
  for (const param of ignoreParams) {
    strippedURL.searchParams.delete(param);
  }
  return strippedURL.href;
}
async function cacheMatchIgnoreParams(cache, request, ignoreParams, matchOptions) {
  const strippedRequestURL = stripParams(request.url, ignoreParams);
  if (request.url === strippedRequestURL) {
    return cache.match(request, matchOptions);
  }
  const keysOptions = {
    ...matchOptions,
    ignoreSearch: true
  };
  const cacheKeys = await cache.keys(request, keysOptions);
  for (const cacheKey of cacheKeys) {
    const strippedCacheKeyURL = stripParams(cacheKey.url, ignoreParams);
    if (strippedRequestURL === strippedCacheKeyURL) {
      return cache.match(cacheKey, matchOptions);
    }
  }
  return;
}
var quotaErrorCallbacks = /* @__PURE__ */ new Set();
var executeQuotaErrorCallbacks = async () => {
  if (true) {
    logger.log(`About to run ${quotaErrorCallbacks.size} callbacks to clean up caches.`);
  }
  for (const callback of quotaErrorCallbacks) {
    await callback();
    if (true) {
      logger.log(callback, "is complete.");
    }
  }
  if (true) {
    logger.log("Finished running callbacks.");
  }
};
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
var supportStatus;
function canConstructResponseFromBodyStream() {
  if (supportStatus === void 0) {
    const testResponse = new Response("");
    if ("body" in testResponse) {
      try {
        new Response(testResponse.body);
        supportStatus = true;
      } catch (error) {
        supportStatus = false;
      }
    }
    supportStatus = false;
  }
  return supportStatus;
}
var SUBSTRING_TO_FIND = "-precache-";
var deleteOutdatedCaches = async (currentPrecacheName, substringToFind = SUBSTRING_TO_FIND) => {
  const cacheNames2 = await self.caches.keys();
  const cacheNamesToDelete = cacheNames2.filter((cacheName) => {
    return cacheName.includes(substringToFind) && cacheName.includes(self.registration.scope) && cacheName !== currentPrecacheName;
  });
  await Promise.all(cacheNamesToDelete.map((cacheName) => self.caches.delete(cacheName)));
  return cacheNamesToDelete;
};
var cleanupOutdatedCaches = (cacheName) => {
  self.addEventListener("activate", (event) => {
    event.waitUntil(deleteOutdatedCaches(cacheNames.getPrecacheName(cacheName)).then((cachesDeleted) => {
      if (true) {
        if (cachesDeleted.length > 0) {
          logger.log("The following out-of-date precaches were cleaned up automatically:", cachesDeleted);
        }
      }
    }));
  });
};
var clientsClaim = () => {
  self.addEventListener("activate", () => self.clients.claim());
};
var waitUntil = (event, asyncFn) => {
  const returnPromise = asyncFn();
  event.waitUntil(returnPromise);
  return returnPromise;
};

// node_modules/idb/build/index.js
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
var transactionDoneMap = /* @__PURE__ */ new WeakMap();
var transformCache = /* @__PURE__ */ new WeakMap();
var reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  reverseTransformCache.set(promise, request);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
}
var idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(this.request);
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
}
function wrap(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
}
var unwrap = (value) => reverseTransformCache.get(value);
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name, version);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      event.oldVersion,
      event.newVersion,
      event
    ));
  }
  openPromise.then((db) => {
    if (terminated)
      db.addEventListener("close", () => terminated());
    if (blocking) {
      db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
}
var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
var writeMethods = ["put", "add", "delete", "clear"];
var cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
  ) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
}
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));
var advanceMethodProps = ["continue", "continuePrimaryKey", "advance"];
var methodMap = {};
var advanceResults = /* @__PURE__ */ new WeakMap();
var ittrProxiedCursorToOriginalProxy = /* @__PURE__ */ new WeakMap();
var cursorIteratorTraps = {
  get(target, prop) {
    if (!advanceMethodProps.includes(prop))
      return target[prop];
    let cachedFunc = methodMap[prop];
    if (!cachedFunc) {
      cachedFunc = methodMap[prop] = function(...args) {
        advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
      };
    }
    return cachedFunc;
  }
};
async function* iterate(...args) {
  let cursor = this;
  if (!(cursor instanceof IDBCursor)) {
    cursor = await cursor.openCursor(...args);
  }
  if (!cursor)
    return;
  cursor = cursor;
  const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
  ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
  reverseTransformCache.set(proxiedCursor, unwrap(cursor));
  while (cursor) {
    yield proxiedCursor;
    cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
    advanceResults.delete(proxiedCursor);
  }
}
function isIteratorProp(target, prop) {
  return prop === Symbol.asyncIterator && instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor]) || prop === "iterate" && instanceOfAny(target, [IDBIndex, IDBObjectStore]);
}
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get(target, prop, receiver) {
    if (isIteratorProp(target, prop))
      return iterate;
    return oldTraps.get(target, prop, receiver);
  },
  has(target, prop) {
    return isIteratorProp(target, prop) || oldTraps.has(target, prop);
  }
}));

// node_modules/serwist/dist/chunks/printInstallDetails.js
var defaultMethod = "GET";
var validMethods = [
  "DELETE",
  "GET",
  "HEAD",
  "PATCH",
  "POST",
  "PUT"
];
var normalizeHandler = (handler) => {
  if (handler && typeof handler === "object") {
    if (true) {
      finalAssertExports.hasMethod(handler, "handle", {
        moduleName: "serwist",
        className: "Route",
        funcName: "constructor",
        paramName: "handler"
      });
    }
    return handler;
  }
  if (true) {
    finalAssertExports.isType(handler, "function", {
      moduleName: "serwist",
      className: "Route",
      funcName: "constructor",
      paramName: "handler"
    });
  }
  return {
    handle: handler
  };
};
var Route = class {
  constructor(match, handler, method = defaultMethod) {
    __publicField(this, "handler");
    __publicField(this, "match");
    __publicField(this, "method");
    __publicField(this, "catchHandler");
    if (true) {
      finalAssertExports.isType(match, "function", {
        moduleName: "serwist",
        className: "Route",
        funcName: "constructor",
        paramName: "match"
      });
      if (method) {
        finalAssertExports.isOneOf(method, validMethods, {
          paramName: "method"
        });
      }
    }
    this.handler = normalizeHandler(handler);
    this.match = match;
    this.method = method;
  }
  setCatchHandler(handler) {
    this.catchHandler = normalizeHandler(handler);
  }
};
var NavigationRoute = class extends Route {
  constructor(handler, { allowlist = [
    /./
  ], denylist = [] } = {}) {
    if (true) {
      finalAssertExports.isArrayOfClass(allowlist, RegExp, {
        moduleName: "serwist",
        className: "NavigationRoute",
        funcName: "constructor",
        paramName: "options.allowlist"
      });
      finalAssertExports.isArrayOfClass(denylist, RegExp, {
        moduleName: "serwist",
        className: "NavigationRoute",
        funcName: "constructor",
        paramName: "options.denylist"
      });
    }
    super((options) => this._match(options), handler);
    __publicField(this, "_allowlist");
    __publicField(this, "_denylist");
    this._allowlist = allowlist;
    this._denylist = denylist;
  }
  _match({ url, request }) {
    if (request && request.mode !== "navigate") {
      return false;
    }
    const pathnameAndSearch = url.pathname + url.search;
    for (const regExp of this._denylist) {
      if (regExp.test(pathnameAndSearch)) {
        if (true) {
          logger.log(`The navigation route ${pathnameAndSearch} is not being used, since the URL matches this denylist pattern: ${regExp.toString()}`);
        }
        return false;
      }
    }
    if (this._allowlist.some((regExp) => regExp.test(pathnameAndSearch))) {
      if (true) {
        logger.debug(`The navigation route ${pathnameAndSearch} is being used.`);
      }
      return true;
    }
    if (true) {
      logger.log(`The navigation route ${pathnameAndSearch} is not being used, since the URL being navigated to doesn't match the allowlist.`);
    }
    return false;
  }
};
var removeIgnoredSearchParams = (urlObject, ignoreURLParametersMatching = []) => {
  for (const paramName of [
    ...urlObject.searchParams.keys()
  ]) {
    if (ignoreURLParametersMatching.some((regExp) => regExp.test(paramName))) {
      urlObject.searchParams.delete(paramName);
    }
  }
  return urlObject;
};
function* generateURLVariations(url, { directoryIndex = "index.html", ignoreURLParametersMatching = [
  /^utm_/,
  /^fbclid$/
], cleanURLs = true, urlManipulation } = {}) {
  const urlObject = new URL(url, location.href);
  urlObject.hash = "";
  yield urlObject.href;
  const urlWithoutIgnoredParams = removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching);
  yield urlWithoutIgnoredParams.href;
  if (directoryIndex && urlWithoutIgnoredParams.pathname.endsWith("/")) {
    const directoryURL = new URL(urlWithoutIgnoredParams.href);
    directoryURL.pathname += directoryIndex;
    yield directoryURL.href;
  }
  if (cleanURLs) {
    const cleanURL = new URL(urlWithoutIgnoredParams.href);
    cleanURL.pathname += ".html";
    yield cleanURL.href;
  }
  if (urlManipulation) {
    const additionalURLs = urlManipulation({
      url: urlObject
    });
    for (const urlToAttempt of additionalURLs) {
      yield urlToAttempt.href;
    }
  }
}
var RegExpRoute = class extends Route {
  constructor(regExp, handler, method) {
    if (true) {
      finalAssertExports.isInstance(regExp, RegExp, {
        moduleName: "serwist",
        className: "RegExpRoute",
        funcName: "constructor",
        paramName: "pattern"
      });
    }
    const match = ({ url }) => {
      const result = regExp.exec(url.href);
      if (!result) {
        return;
      }
      if (url.origin !== location.origin && result.index !== 0) {
        if (true) {
          logger.debug(`The regular expression '${regExp.toString()}' only partially matched against the cross-origin URL '${url.toString()}'. RegExpRoute's will only handle cross-origin requests if they match the entire URL.`);
        }
        return;
      }
      return result.slice(1);
    };
    super(match, handler, method);
  }
};
var parallel = async (limit, array, func) => {
  const work = array.map((item, index) => ({
    index,
    item
  }));
  const processor = async (res) => {
    const results2 = [];
    while (true) {
      const next = work.pop();
      if (!next) {
        return res(results2);
      }
      const result = await func(next.item);
      results2.push({
        result,
        index: next.index
      });
    }
  };
  const queues = Array.from({
    length: limit
  }, () => new Promise(processor));
  const results = (await Promise.all(queues)).flat().sort((a, b) => a.index < b.index ? -1 : 1).map((res) => res.result);
  return results;
};
var disableDevLogs = () => {
  self.__WB_DISABLE_DEV_LOGS = true;
};
function toRequest(input) {
  return typeof input === "string" ? new Request(input) : input;
}
var StrategyHandler = class {
  constructor(strategy, options) {
    __publicField(this, "event");
    __publicField(this, "request");
    __publicField(this, "url");
    __publicField(this, "params");
    __publicField(this, "_cacheKeys", {});
    __publicField(this, "_strategy");
    __publicField(this, "_handlerDeferred");
    __publicField(this, "_extendLifetimePromises");
    __publicField(this, "_plugins");
    __publicField(this, "_pluginStateMap");
    if (true) {
      finalAssertExports.isInstance(options.event, ExtendableEvent, {
        moduleName: "serwist",
        className: "StrategyHandler",
        funcName: "constructor",
        paramName: "options.event"
      });
      finalAssertExports.isInstance(options.request, Request, {
        moduleName: "serwist",
        className: "StrategyHandler",
        funcName: "constructor",
        paramName: "options.request"
      });
    }
    this.event = options.event;
    this.request = options.request;
    if (options.url) {
      this.url = options.url;
      this.params = options.params;
    }
    this._strategy = strategy;
    this._handlerDeferred = new Deferred();
    this._extendLifetimePromises = [];
    this._plugins = [
      ...strategy.plugins
    ];
    this._pluginStateMap = /* @__PURE__ */ new Map();
    for (const plugin of this._plugins) {
      this._pluginStateMap.set(plugin, {});
    }
    this.event.waitUntil(this._handlerDeferred.promise);
  }
  async fetch(input) {
    const { event } = this;
    let request = toRequest(input);
    const preloadResponse = await this.getPreloadResponse();
    if (preloadResponse) {
      return preloadResponse;
    }
    const originalRequest = this.hasCallback("fetchDidFail") ? request.clone() : null;
    try {
      for (const cb of this.iterateCallbacks("requestWillFetch")) {
        request = await cb({
          request: request.clone(),
          event
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new SerwistError("plugin-error-request-will-fetch", {
          thrownErrorMessage: err.message
        });
      }
    }
    const pluginFilteredRequest = request.clone();
    try {
      let fetchResponse;
      fetchResponse = await fetch(request, request.mode === "navigate" ? void 0 : this._strategy.fetchOptions);
      if (true) {
        logger.debug(`Network request for '${getFriendlyURL(request.url)}' returned a response with status '${fetchResponse.status}'.`);
      }
      for (const callback of this.iterateCallbacks("fetchDidSucceed")) {
        fetchResponse = await callback({
          event,
          request: pluginFilteredRequest,
          response: fetchResponse
        });
      }
      return fetchResponse;
    } catch (error) {
      if (true) {
        logger.log(`Network request for '${getFriendlyURL(request.url)}' threw an error.`, error);
      }
      if (originalRequest) {
        await this.runCallbacks("fetchDidFail", {
          error,
          event,
          originalRequest: originalRequest.clone(),
          request: pluginFilteredRequest.clone()
        });
      }
      throw error;
    }
  }
  async fetchAndCachePut(input) {
    const response = await this.fetch(input);
    const responseClone = response.clone();
    void this.waitUntil(this.cachePut(input, responseClone));
    return response;
  }
  async cacheMatch(key) {
    const request = toRequest(key);
    let cachedResponse;
    const { cacheName, matchOptions } = this._strategy;
    const effectiveRequest = await this.getCacheKey(request, "read");
    const multiMatchOptions = {
      ...matchOptions,
      ...{
        cacheName
      }
    };
    cachedResponse = await caches.match(effectiveRequest, multiMatchOptions);
    if (true) {
      if (cachedResponse) {
        logger.debug(`Found a cached response in '${cacheName}'.`);
      } else {
        logger.debug(`No cached response found in '${cacheName}'.`);
      }
    }
    for (const callback of this.iterateCallbacks("cachedResponseWillBeUsed")) {
      cachedResponse = await callback({
        cacheName,
        matchOptions,
        cachedResponse,
        request: effectiveRequest,
        event: this.event
      }) || void 0;
    }
    return cachedResponse;
  }
  async cachePut(key, response) {
    const request = toRequest(key);
    await timeout(0);
    const effectiveRequest = await this.getCacheKey(request, "write");
    if (true) {
      if (effectiveRequest.method && effectiveRequest.method !== "GET") {
        throw new SerwistError("attempt-to-cache-non-get-request", {
          url: getFriendlyURL(effectiveRequest.url),
          method: effectiveRequest.method
        });
      }
    }
    if (!response) {
      if (true) {
        logger.error(`Cannot cache non-existent response for '${getFriendlyURL(effectiveRequest.url)}'.`);
      }
      throw new SerwistError("cache-put-with-no-response", {
        url: getFriendlyURL(effectiveRequest.url)
      });
    }
    const responseToCache = await this._ensureResponseSafeToCache(response);
    if (!responseToCache) {
      if (true) {
        logger.debug(`Response '${getFriendlyURL(effectiveRequest.url)}' will not be cached.`, responseToCache);
      }
      return false;
    }
    const { cacheName, matchOptions } = this._strategy;
    const cache = await self.caches.open(cacheName);
    if (true) {
      const vary = response.headers.get("Vary");
      if (vary && (matchOptions == null ? void 0 : matchOptions.ignoreVary) !== true) {
        logger.debug(`The response for ${getFriendlyURL(effectiveRequest.url)} has a 'Vary: ${vary}' header. Consider setting the {ignoreVary: true} option on your strategy to ensure cache matching and deletion works as expected.`);
      }
    }
    const hasCacheUpdateCallback = this.hasCallback("cacheDidUpdate");
    const oldResponse = hasCacheUpdateCallback ? await cacheMatchIgnoreParams(cache, effectiveRequest.clone(), [
      "__WB_REVISION__"
    ], matchOptions) : null;
    if (true) {
      logger.debug(`Updating the '${cacheName}' cache with a new Response for ${getFriendlyURL(effectiveRequest.url)}.`);
    }
    try {
      await cache.put(effectiveRequest, hasCacheUpdateCallback ? responseToCache.clone() : responseToCache);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "QuotaExceededError") {
          await executeQuotaErrorCallbacks();
        }
        throw error;
      }
    }
    for (const callback of this.iterateCallbacks("cacheDidUpdate")) {
      await callback({
        cacheName,
        oldResponse,
        newResponse: responseToCache.clone(),
        request: effectiveRequest,
        event: this.event
      });
    }
    return true;
  }
  async getCacheKey(request, mode) {
    const key = `${request.url} | ${mode}`;
    if (!this._cacheKeys[key]) {
      let effectiveRequest = request;
      for (const callback of this.iterateCallbacks("cacheKeyWillBeUsed")) {
        effectiveRequest = toRequest(await callback({
          mode,
          request: effectiveRequest,
          event: this.event,
          params: this.params
        }));
      }
      this._cacheKeys[key] = effectiveRequest;
    }
    return this._cacheKeys[key];
  }
  hasCallback(name) {
    for (const plugin of this._strategy.plugins) {
      if (name in plugin) {
        return true;
      }
    }
    return false;
  }
  async runCallbacks(name, param) {
    for (const callback of this.iterateCallbacks(name)) {
      await callback(param);
    }
  }
  *iterateCallbacks(name) {
    for (const plugin of this._strategy.plugins) {
      if (typeof plugin[name] === "function") {
        const state = this._pluginStateMap.get(plugin);
        const statefulCallback = (param) => {
          const statefulParam = {
            ...param,
            state
          };
          return plugin[name](statefulParam);
        };
        yield statefulCallback;
      }
    }
  }
  waitUntil(promise) {
    this._extendLifetimePromises.push(promise);
    return promise;
  }
  async doneWaiting() {
    let promise = void 0;
    while (promise = this._extendLifetimePromises.shift()) {
      await promise;
    }
  }
  destroy() {
    this._handlerDeferred.resolve(null);
  }
  async getPreloadResponse() {
    if (this.event instanceof FetchEvent && this.event.request.mode === "navigate" && "preloadResponse" in this.event) {
      try {
        const possiblePreloadResponse = await this.event.preloadResponse;
        if (possiblePreloadResponse) {
          if (true) {
            logger.log(`Using a preloaded navigation response for '${getFriendlyURL(this.event.request.url)}'`);
          }
          return possiblePreloadResponse;
        }
      } catch (error) {
        if (true) {
          logger.error(error);
        }
        return void 0;
      }
    }
    return void 0;
  }
  async _ensureResponseSafeToCache(response) {
    let responseToCache = response;
    let pluginsUsed = false;
    for (const callback of this.iterateCallbacks("cacheWillUpdate")) {
      responseToCache = await callback({
        request: this.request,
        response: responseToCache,
        event: this.event
      }) || void 0;
      pluginsUsed = true;
      if (!responseToCache) {
        break;
      }
    }
    if (!pluginsUsed) {
      if (responseToCache && responseToCache.status !== 200) {
        if (true) {
          if (responseToCache.status === 0) {
            logger.warn(`The response for '${this.request.url}' is an opaque response. The caching strategy that you're using will not cache opaque responses by default.`);
          } else {
            logger.debug(`The response for '${this.request.url}' returned a status code of '${response.status}' and won't be cached as a result.`);
          }
        }
        responseToCache = void 0;
      }
    }
    return responseToCache;
  }
};
var Strategy = class {
  constructor(options = {}) {
    __publicField(this, "cacheName");
    __publicField(this, "plugins");
    __publicField(this, "fetchOptions");
    __publicField(this, "matchOptions");
    this.cacheName = cacheNames.getRuntimeName(options.cacheName);
    this.plugins = options.plugins || [];
    this.fetchOptions = options.fetchOptions;
    this.matchOptions = options.matchOptions;
  }
  handle(options) {
    const [responseDone] = this.handleAll(options);
    return responseDone;
  }
  handleAll(options) {
    if (options instanceof FetchEvent) {
      options = {
        event: options,
        request: options.request
      };
    }
    const event = options.event;
    const request = typeof options.request === "string" ? new Request(options.request) : options.request;
    const handler = new StrategyHandler(this, options.url ? {
      event,
      request,
      url: options.url,
      params: options.params
    } : {
      event,
      request
    });
    const responseDone = this._getResponse(handler, request, event);
    const handlerDone = this._awaitComplete(responseDone, handler, request, event);
    return [
      responseDone,
      handlerDone
    ];
  }
  async _getResponse(handler, request, event) {
    await handler.runCallbacks("handlerWillStart", {
      event,
      request
    });
    let response = void 0;
    try {
      response = await this._handle(request, handler);
      if (response === void 0 || response.type === "error") {
        throw new SerwistError("no-response", {
          url: request.url
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        for (const callback of handler.iterateCallbacks("handlerDidError")) {
          response = await callback({
            error,
            event,
            request
          });
          if (response !== void 0) {
            break;
          }
        }
      }
      if (!response) {
        throw error;
      }
      if (true) {
        throw logger.log(`While responding to '${getFriendlyURL(request.url)}', an ${error instanceof Error ? error.toString() : ""} error occurred. Using a fallback response provided by a handlerDidError plugin.`);
      }
    }
    for (const callback of handler.iterateCallbacks("handlerWillRespond")) {
      response = await callback({
        event,
        request,
        response
      });
    }
    return response;
  }
  async _awaitComplete(responseDone, handler, request, event) {
    let response = void 0;
    let error = void 0;
    try {
      response = await responseDone;
    } catch (error2) {
    }
    try {
      await handler.runCallbacks("handlerDidRespond", {
        event,
        request,
        response
      });
      await handler.doneWaiting();
    } catch (waitUntilError) {
      if (waitUntilError instanceof Error) {
        error = waitUntilError;
      }
    }
    await handler.runCallbacks("handlerDidComplete", {
      event,
      request,
      response,
      error
    });
    handler.destroy();
    if (error) {
      throw error;
    }
  }
};
var cacheOkAndOpaquePlugin = {
  cacheWillUpdate: async ({ response }) => {
    if (response.status === 200 || response.status === 0) {
      return response;
    }
    return null;
  }
};
var messages2 = {
  strategyStart: (strategyName, request) => `Using ${strategyName} to respond to '${getFriendlyURL(request.url)}'`,
  printFinalResponse: (response) => {
    if (response) {
      logger.groupCollapsed("View the final response here.");
      logger.log(response || "[No response returned]");
      logger.groupEnd();
    }
  }
};
var NetworkFirst = class extends Strategy {
  constructor(options = {}) {
    super(options);
    __publicField(this, "_networkTimeoutSeconds");
    if (!this.plugins.some((p) => "cacheWillUpdate" in p)) {
      this.plugins.unshift(cacheOkAndOpaquePlugin);
    }
    this._networkTimeoutSeconds = options.networkTimeoutSeconds || 0;
    if (true) {
      if (this._networkTimeoutSeconds) {
        finalAssertExports.isType(this._networkTimeoutSeconds, "number", {
          moduleName: "serwist",
          className: this.constructor.name,
          funcName: "constructor",
          paramName: "networkTimeoutSeconds"
        });
      }
    }
  }
  async _handle(request, handler) {
    const logs = [];
    if (true) {
      finalAssertExports.isInstance(request, Request, {
        moduleName: "serwist",
        className: this.constructor.name,
        funcName: "handle",
        paramName: "makeRequest"
      });
    }
    const promises = [];
    let timeoutId;
    if (this._networkTimeoutSeconds) {
      const { id, promise } = this._getTimeoutPromise({
        request,
        logs,
        handler
      });
      timeoutId = id;
      promises.push(promise);
    }
    const networkPromise = this._getNetworkPromise({
      timeoutId,
      request,
      logs,
      handler
    });
    promises.push(networkPromise);
    const response = await handler.waitUntil((async () => {
      return await handler.waitUntil(Promise.race(promises)) || await networkPromise;
    })());
    if (true) {
      logger.groupCollapsed(messages2.strategyStart(this.constructor.name, request));
      for (const log of logs) {
        logger.log(log);
      }
      messages2.printFinalResponse(response);
      logger.groupEnd();
    }
    if (!response) {
      throw new SerwistError("no-response", {
        url: request.url
      });
    }
    return response;
  }
  _getTimeoutPromise({ request, logs, handler }) {
    let timeoutId;
    const timeoutPromise = new Promise((resolve) => {
      const onNetworkTimeout = async () => {
        if (true) {
          logs.push(`Timing out the network response at ${this._networkTimeoutSeconds} seconds.`);
        }
        resolve(await handler.cacheMatch(request));
      };
      timeoutId = setTimeout(onNetworkTimeout, this._networkTimeoutSeconds * 1e3);
    });
    return {
      promise: timeoutPromise,
      id: timeoutId
    };
  }
  async _getNetworkPromise({ timeoutId, request, logs, handler }) {
    let error = void 0;
    let response = void 0;
    try {
      response = await handler.fetchAndCachePut(request);
    } catch (fetchError) {
      if (fetchError instanceof Error) {
        error = fetchError;
      }
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (true) {
      if (response) {
        logs.push("Got response from network.");
      } else {
        logs.push("Unable to get a response from the network. Will respond with a cached response.");
      }
    }
    if (error || !response) {
      response = await handler.cacheMatch(request);
      if (true) {
        if (response) {
          logs.push(`Found a cached response in the '${this.cacheName}' cache.`);
        } else {
          logs.push(`No response found in the '${this.cacheName}' cache.`);
        }
      }
    }
    return response;
  }
};
var NetworkOnly = class extends Strategy {
  constructor(options = {}) {
    super(options);
    __publicField(this, "_networkTimeoutSeconds");
    this._networkTimeoutSeconds = options.networkTimeoutSeconds || 0;
  }
  async _handle(request, handler) {
    if (true) {
      finalAssertExports.isInstance(request, Request, {
        moduleName: "serwist",
        className: this.constructor.name,
        funcName: "_handle",
        paramName: "request"
      });
    }
    let error = void 0;
    let response;
    try {
      const promises = [
        handler.fetch(request)
      ];
      if (this._networkTimeoutSeconds) {
        const timeoutPromise = timeout(this._networkTimeoutSeconds * 1e3);
        promises.push(timeoutPromise);
      }
      response = await Promise.race(promises);
      if (!response) {
        throw new Error(`Timed out the network response after ${this._networkTimeoutSeconds} seconds.`);
      }
    } catch (err) {
      if (err instanceof Error) {
        error = err;
      }
    }
    if (true) {
      logger.groupCollapsed(messages2.strategyStart(this.constructor.name, request));
      if (response) {
        logger.log("Got response from network.");
      } else {
        logger.log("Unable to get a response from the network.");
      }
      messages2.printFinalResponse(response);
      logger.groupEnd();
    }
    if (!response) {
      throw new SerwistError("no-response", {
        url: request.url,
        error
      });
    }
    return response;
  }
};
var BACKGROUND_SYNC_DB_VERSION = 3;
var BACKGROUND_SYNC_DB_NAME = "serwist-background-sync";
var REQUEST_OBJECT_STORE_NAME = "requests";
var QUEUE_NAME_INDEX = "queueName";
var BackgroundSyncQueueDb = class {
  constructor() {
    __publicField(this, "_db", null);
  }
  async addEntry(entry) {
    const db = await this.getDb();
    const tx = db.transaction(REQUEST_OBJECT_STORE_NAME, "readwrite", {
      durability: "relaxed"
    });
    await tx.store.add(entry);
    await tx.done;
  }
  async getFirstEntryId() {
    const db = await this.getDb();
    const cursor = await db.transaction(REQUEST_OBJECT_STORE_NAME).store.openCursor();
    return cursor == null ? void 0 : cursor.value.id;
  }
  async getAllEntriesByQueueName(queueName) {
    const db = await this.getDb();
    const results = await db.getAllFromIndex(REQUEST_OBJECT_STORE_NAME, QUEUE_NAME_INDEX, IDBKeyRange.only(queueName));
    return results ? results : new Array();
  }
  async getEntryCountByQueueName(queueName) {
    const db = await this.getDb();
    return db.countFromIndex(REQUEST_OBJECT_STORE_NAME, QUEUE_NAME_INDEX, IDBKeyRange.only(queueName));
  }
  async deleteEntry(id) {
    const db = await this.getDb();
    await db.delete(REQUEST_OBJECT_STORE_NAME, id);
  }
  async getFirstEntryByQueueName(queueName) {
    return await this.getEndEntryFromIndex(IDBKeyRange.only(queueName), "next");
  }
  async getLastEntryByQueueName(queueName) {
    return await this.getEndEntryFromIndex(IDBKeyRange.only(queueName), "prev");
  }
  async getEndEntryFromIndex(query, direction) {
    const db = await this.getDb();
    const cursor = await db.transaction(REQUEST_OBJECT_STORE_NAME).store.index(QUEUE_NAME_INDEX).openCursor(query, direction);
    return cursor == null ? void 0 : cursor.value;
  }
  async getDb() {
    if (!this._db) {
      this._db = await openDB(BACKGROUND_SYNC_DB_NAME, BACKGROUND_SYNC_DB_VERSION, {
        upgrade: this._upgradeDb
      });
    }
    return this._db;
  }
  _upgradeDb(db, oldVersion) {
    if (oldVersion > 0 && oldVersion < BACKGROUND_SYNC_DB_VERSION) {
      if (db.objectStoreNames.contains(REQUEST_OBJECT_STORE_NAME)) {
        db.deleteObjectStore(REQUEST_OBJECT_STORE_NAME);
      }
    }
    const objStore = db.createObjectStore(REQUEST_OBJECT_STORE_NAME, {
      autoIncrement: true,
      keyPath: "id"
    });
    objStore.createIndex(QUEUE_NAME_INDEX, QUEUE_NAME_INDEX, {
      unique: false
    });
  }
};
var BackgroundSyncQueueStore = class {
  constructor(queueName) {
    __publicField(this, "_queueName");
    __publicField(this, "_queueDb");
    this._queueName = queueName;
    this._queueDb = new BackgroundSyncQueueDb();
  }
  async pushEntry(entry) {
    if (true) {
      finalAssertExports.isType(entry, "object", {
        moduleName: "serwist",
        className: "BackgroundSyncQueueStore",
        funcName: "pushEntry",
        paramName: "entry"
      });
      finalAssertExports.isType(entry.requestData, "object", {
        moduleName: "serwist",
        className: "BackgroundSyncQueueStore",
        funcName: "pushEntry",
        paramName: "entry.requestData"
      });
    }
    delete entry.id;
    entry.queueName = this._queueName;
    await this._queueDb.addEntry(entry);
  }
  async unshiftEntry(entry) {
    if (true) {
      finalAssertExports.isType(entry, "object", {
        moduleName: "serwist",
        className: "BackgroundSyncQueueStore",
        funcName: "unshiftEntry",
        paramName: "entry"
      });
      finalAssertExports.isType(entry.requestData, "object", {
        moduleName: "serwist",
        className: "BackgroundSyncQueueStore",
        funcName: "unshiftEntry",
        paramName: "entry.requestData"
      });
    }
    const firstId = await this._queueDb.getFirstEntryId();
    if (firstId) {
      entry.id = firstId - 1;
    } else {
      delete entry.id;
    }
    entry.queueName = this._queueName;
    await this._queueDb.addEntry(entry);
  }
  async popEntry() {
    return this._removeEntry(await this._queueDb.getLastEntryByQueueName(this._queueName));
  }
  async shiftEntry() {
    return this._removeEntry(await this._queueDb.getFirstEntryByQueueName(this._queueName));
  }
  async getAll() {
    return await this._queueDb.getAllEntriesByQueueName(this._queueName);
  }
  async size() {
    return await this._queueDb.getEntryCountByQueueName(this._queueName);
  }
  async deleteEntry(id) {
    await this._queueDb.deleteEntry(id);
  }
  async _removeEntry(entry) {
    if (entry) {
      await this.deleteEntry(entry.id);
    }
    return entry;
  }
};
var serializableProperties = [
  "method",
  "referrer",
  "referrerPolicy",
  "mode",
  "credentials",
  "cache",
  "redirect",
  "integrity",
  "keepalive"
];
var StorableRequest = class _StorableRequest {
  constructor(requestData) {
    __publicField(this, "_requestData");
    if (true) {
      finalAssertExports.isType(requestData, "object", {
        moduleName: "serwist",
        className: "StorableRequest",
        funcName: "constructor",
        paramName: "requestData"
      });
      finalAssertExports.isType(requestData.url, "string", {
        moduleName: "serwist",
        className: "StorableRequest",
        funcName: "constructor",
        paramName: "requestData.url"
      });
    }
    if (requestData.mode === "navigate") {
      requestData.mode = "same-origin";
    }
    this._requestData = requestData;
  }
  static async fromRequest(request) {
    const requestData = {
      url: request.url,
      headers: {}
    };
    if (request.method !== "GET") {
      requestData.body = await request.clone().arrayBuffer();
    }
    request.headers.forEach((value, key) => {
      requestData.headers[key] = value;
    });
    for (const prop of serializableProperties) {
      if (request[prop] !== void 0) {
        requestData[prop] = request[prop];
      }
    }
    return new _StorableRequest(requestData);
  }
  toObject() {
    const requestData = Object.assign({}, this._requestData);
    requestData.headers = Object.assign({}, this._requestData.headers);
    if (requestData.body) {
      requestData.body = requestData.body.slice(0);
    }
    return requestData;
  }
  toRequest() {
    return new Request(this._requestData.url, this._requestData);
  }
  clone() {
    return new _StorableRequest(this.toObject());
  }
};
var TAG_PREFIX = "serwist-background-sync";
var MAX_RETENTION_TIME = 60 * 24 * 7;
var queueNames = /* @__PURE__ */ new Set();
var convertEntry = (queueStoreEntry) => {
  const queueEntry = {
    request: new StorableRequest(queueStoreEntry.requestData).toRequest(),
    timestamp: queueStoreEntry.timestamp
  };
  if (queueStoreEntry.metadata) {
    queueEntry.metadata = queueStoreEntry.metadata;
  }
  return queueEntry;
};
var BackgroundSyncQueue = class {
  constructor(name, { forceSyncFallback, onSync, maxRetentionTime } = {}) {
    __publicField(this, "_name");
    __publicField(this, "_onSync");
    __publicField(this, "_maxRetentionTime");
    __publicField(this, "_queueStore");
    __publicField(this, "_forceSyncFallback");
    __publicField(this, "_syncInProgress", false);
    __publicField(this, "_requestsAddedDuringSync", false);
    if (queueNames.has(name)) {
      throw new SerwistError("duplicate-queue-name", {
        name
      });
    }
    queueNames.add(name);
    this._name = name;
    this._onSync = onSync || this.replayRequests;
    this._maxRetentionTime = maxRetentionTime || MAX_RETENTION_TIME;
    this._forceSyncFallback = Boolean(forceSyncFallback);
    this._queueStore = new BackgroundSyncQueueStore(this._name);
    this._addSyncListener();
  }
  get name() {
    return this._name;
  }
  async pushRequest(entry) {
    if (true) {
      finalAssertExports.isType(entry, "object", {
        moduleName: "serwist",
        className: "BackgroundSyncQueue",
        funcName: "pushRequest",
        paramName: "entry"
      });
      finalAssertExports.isInstance(entry.request, Request, {
        moduleName: "serwist",
        className: "BackgroundSyncQueue",
        funcName: "pushRequest",
        paramName: "entry.request"
      });
    }
    await this._addRequest(entry, "push");
  }
  async unshiftRequest(entry) {
    if (true) {
      finalAssertExports.isType(entry, "object", {
        moduleName: "serwist",
        className: "BackgroundSyncQueue",
        funcName: "unshiftRequest",
        paramName: "entry"
      });
      finalAssertExports.isInstance(entry.request, Request, {
        moduleName: "serwist",
        className: "BackgroundSyncQueue",
        funcName: "unshiftRequest",
        paramName: "entry.request"
      });
    }
    await this._addRequest(entry, "unshift");
  }
  async popRequest() {
    return this._removeRequest("pop");
  }
  async shiftRequest() {
    return this._removeRequest("shift");
  }
  async getAll() {
    const allEntries = await this._queueStore.getAll();
    const now = Date.now();
    const unexpiredEntries = [];
    for (const entry of allEntries) {
      const maxRetentionTimeInMs = this._maxRetentionTime * 60 * 1e3;
      if (now - entry.timestamp > maxRetentionTimeInMs) {
        await this._queueStore.deleteEntry(entry.id);
      } else {
        unexpiredEntries.push(convertEntry(entry));
      }
    }
    return unexpiredEntries;
  }
  async size() {
    return await this._queueStore.size();
  }
  async _addRequest({ request, metadata, timestamp = Date.now() }, operation) {
    const storableRequest = await StorableRequest.fromRequest(request.clone());
    const entry = {
      requestData: storableRequest.toObject(),
      timestamp
    };
    if (metadata) {
      entry.metadata = metadata;
    }
    switch (operation) {
      case "push":
        await this._queueStore.pushEntry(entry);
        break;
      case "unshift":
        await this._queueStore.unshiftEntry(entry);
        break;
    }
    if (true) {
      logger.log(`Request for '${getFriendlyURL(request.url)}' has been added to background sync queue '${this._name}'.`);
    }
    if (this._syncInProgress) {
      this._requestsAddedDuringSync = true;
    } else {
      await this.registerSync();
    }
  }
  async _removeRequest(operation) {
    const now = Date.now();
    let entry;
    switch (operation) {
      case "pop":
        entry = await this._queueStore.popEntry();
        break;
      case "shift":
        entry = await this._queueStore.shiftEntry();
        break;
    }
    if (entry) {
      const maxRetentionTimeInMs = this._maxRetentionTime * 60 * 1e3;
      if (now - entry.timestamp > maxRetentionTimeInMs) {
        return this._removeRequest(operation);
      }
      return convertEntry(entry);
    }
    return void 0;
  }
  async replayRequests() {
    let entry = void 0;
    while (entry = await this.shiftRequest()) {
      try {
        await fetch(entry.request.clone());
        if (true) {
          logger.log(`Request for '${getFriendlyURL(entry.request.url)}' has been replayed in queue '${this._name}'`);
        }
      } catch (error) {
        await this.unshiftRequest(entry);
        if (true) {
          logger.log(`Request for '${getFriendlyURL(entry.request.url)}' failed to replay, putting it back in queue '${this._name}'`);
        }
        throw new SerwistError("queue-replay-failed", {
          name: this._name
        });
      }
    }
    if (true) {
      logger.log(`All requests in queue '${this.name}' have successfully replayed; the queue is now empty!`);
    }
  }
  async registerSync() {
    if ("sync" in self.registration && !this._forceSyncFallback) {
      try {
        await self.registration.sync.register(`${TAG_PREFIX}:${this._name}`);
      } catch (err) {
        if (true) {
          logger.warn(`Unable to register sync event for '${this._name}'.`, err);
        }
      }
    }
  }
  _addSyncListener() {
    if ("sync" in self.registration && !this._forceSyncFallback) {
      self.addEventListener("sync", (event) => {
        if (event.tag === `${TAG_PREFIX}:${this._name}`) {
          if (true) {
            logger.log(`Background sync for tag '${event.tag}' has been received`);
          }
          const syncComplete = async () => {
            this._syncInProgress = true;
            let syncError = void 0;
            try {
              await this._onSync({
                queue: this
              });
            } catch (error) {
              if (error instanceof Error) {
                syncError = error;
                throw syncError;
              }
            } finally {
              if (this._requestsAddedDuringSync && !(syncError && !event.lastChance)) {
                await this.registerSync();
              }
              this._syncInProgress = false;
              this._requestsAddedDuringSync = false;
            }
          };
          event.waitUntil(syncComplete());
        }
      });
    } else {
      if (true) {
        logger.log("Background sync replaying without background sync event");
      }
      void this._onSync({
        queue: this
      });
    }
  }
  static get _queueNames() {
    return queueNames;
  }
};
var BackgroundSyncPlugin = class {
  constructor(name, options) {
    __publicField(this, "_queue");
    this._queue = new BackgroundSyncQueue(name, options);
  }
  async fetchDidFail({ request }) {
    await this._queue.pushRequest({
      request
    });
  }
};
var copyResponse = async (response, modifier) => {
  let origin = null;
  if (response.url) {
    const responseURL = new URL(response.url);
    origin = responseURL.origin;
  }
  if (origin !== self.location.origin) {
    throw new SerwistError("cross-origin-copy-response", {
      origin
    });
  }
  const clonedResponse = response.clone();
  const responseInit = {
    headers: new Headers(clonedResponse.headers),
    status: clonedResponse.status,
    statusText: clonedResponse.statusText
  };
  const modifiedResponseInit = modifier ? modifier(responseInit) : responseInit;
  const body = canConstructResponseFromBodyStream() ? clonedResponse.body : await clonedResponse.blob();
  return new Response(body, modifiedResponseInit);
};
var _PrecacheStrategy = class _PrecacheStrategy extends Strategy {
  constructor(options = {}) {
    options.cacheName = cacheNames.getPrecacheName(options.cacheName);
    super(options);
    __publicField(this, "_fallbackToNetwork");
    this._fallbackToNetwork = options.fallbackToNetwork === false ? false : true;
    this.plugins.push(_PrecacheStrategy.copyRedirectedCacheableResponsesPlugin);
  }
  async _handle(request, handler) {
    const preloadResponse = await handler.getPreloadResponse();
    if (preloadResponse) {
      return preloadResponse;
    }
    const response = await handler.cacheMatch(request);
    if (response) {
      return response;
    }
    if (handler.event && handler.event.type === "install") {
      return await this._handleInstall(request, handler);
    }
    return await this._handleFetch(request, handler);
  }
  async _handleFetch(request, handler) {
    let response = void 0;
    const params = handler.params || {};
    if (this._fallbackToNetwork) {
      if (true) {
        logger.warn(`The precached response for ${getFriendlyURL(request.url)} in ${this.cacheName} was not found. Falling back to the network.`);
      }
      const integrityInManifest = params.integrity;
      const integrityInRequest = request.integrity;
      const noIntegrityConflict = !integrityInRequest || integrityInRequest === integrityInManifest;
      response = await handler.fetch(new Request(request, {
        integrity: request.mode !== "no-cors" ? integrityInRequest || integrityInManifest : void 0
      }));
      if (integrityInManifest && noIntegrityConflict && request.mode !== "no-cors") {
        this._useDefaultCacheabilityPluginIfNeeded();
        const wasCached = await handler.cachePut(request, response.clone());
        if (true) {
          if (wasCached) {
            logger.log(`A response for ${getFriendlyURL(request.url)} was used to "repair" the precache.`);
          }
        }
      }
    } else {
      throw new SerwistError("missing-precache-entry", {
        cacheName: this.cacheName,
        url: request.url
      });
    }
    if (true) {
      const cacheKey = params.cacheKey || await handler.getCacheKey(request, "read");
      logger.groupCollapsed(`Precaching is responding to: ${getFriendlyURL(request.url)}`);
      logger.log(`Serving the precached url: ${getFriendlyURL(cacheKey instanceof Request ? cacheKey.url : cacheKey)}`);
      logger.groupCollapsed("View request details here.");
      logger.log(request);
      logger.groupEnd();
      logger.groupCollapsed("View response details here.");
      logger.log(response);
      logger.groupEnd();
      logger.groupEnd();
    }
    return response;
  }
  async _handleInstall(request, handler) {
    this._useDefaultCacheabilityPluginIfNeeded();
    const response = await handler.fetch(request);
    const wasCached = await handler.cachePut(request, response.clone());
    if (!wasCached) {
      throw new SerwistError("bad-precaching-response", {
        url: request.url,
        status: response.status
      });
    }
    return response;
  }
  _useDefaultCacheabilityPluginIfNeeded() {
    let defaultPluginIndex = null;
    let cacheWillUpdatePluginCount = 0;
    for (const [index, plugin] of this.plugins.entries()) {
      if (plugin === _PrecacheStrategy.copyRedirectedCacheableResponsesPlugin) {
        continue;
      }
      if (plugin === _PrecacheStrategy.defaultPrecacheCacheabilityPlugin) {
        defaultPluginIndex = index;
      }
      if (plugin.cacheWillUpdate) {
        cacheWillUpdatePluginCount++;
      }
    }
    if (cacheWillUpdatePluginCount === 0) {
      this.plugins.push(_PrecacheStrategy.defaultPrecacheCacheabilityPlugin);
    } else if (cacheWillUpdatePluginCount > 1 && defaultPluginIndex !== null) {
      this.plugins.splice(defaultPluginIndex, 1);
    }
  }
};
__publicField(_PrecacheStrategy, "defaultPrecacheCacheabilityPlugin", {
  async cacheWillUpdate({ response }) {
    if (!response || response.status >= 400) {
      return null;
    }
    return response;
  }
});
__publicField(_PrecacheStrategy, "copyRedirectedCacheableResponsesPlugin", {
  async cacheWillUpdate({ response }) {
    return response.redirected ? await copyResponse(response) : response;
  }
});
var PrecacheStrategy = _PrecacheStrategy;
var isNavigationPreloadSupported = () => {
  var _a;
  return Boolean((_a = self.registration) == null ? void 0 : _a.navigationPreload);
};
var enableNavigationPreload = (headerValue) => {
  if (isNavigationPreloadSupported()) {
    self.addEventListener("activate", (event) => {
      event.waitUntil(self.registration.navigationPreload.enable().then(() => {
        if (headerValue) {
          void self.registration.navigationPreload.setHeaderValue(headerValue);
        }
        if (true) {
          logger.log("Navigation preloading is enabled.");
        }
      }));
    });
  } else {
    if (true) {
      logger.log("Navigation preloading is not supported in this browser.");
    }
  }
};
var setCacheNameDetails = (details) => {
  var _a, _b, _c;
  if (true) {
    for (const key of Object.keys(details)) {
      finalAssertExports.isType(details[key], "string", {
        moduleName: "@serwist/core",
        funcName: "setCacheNameDetails",
        paramName: `details.${key}`
      });
    }
    if (((_a = details.precache) == null ? void 0 : _a.length) === 0) {
      throw new SerwistError("invalid-cache-name", {
        cacheNameId: "precache",
        value: details.precache
      });
    }
    if (((_b = details.runtime) == null ? void 0 : _b.length) === 0) {
      throw new SerwistError("invalid-cache-name", {
        cacheNameId: "runtime",
        value: details.runtime
      });
    }
    if (((_c = details.googleAnalytics) == null ? void 0 : _c.length) === 0) {
      throw new SerwistError("invalid-cache-name", {
        cacheNameId: "googleAnalytics",
        value: details.googleAnalytics
      });
    }
  }
  cacheNames.updateDetails(details);
};
var PrecacheInstallReportPlugin = class {
  constructor() {
    __publicField(this, "updatedURLs", []);
    __publicField(this, "notUpdatedURLs", []);
    __publicField(this, "handlerWillStart", async ({ request, state }) => {
      if (state) {
        state.originalRequest = request;
      }
    });
    __publicField(this, "cachedResponseWillBeUsed", async ({ event, state, cachedResponse }) => {
      if (event.type === "install") {
        if ((state == null ? void 0 : state.originalRequest) && state.originalRequest instanceof Request) {
          const url = state.originalRequest.url;
          if (cachedResponse) {
            this.notUpdatedURLs.push(url);
          } else {
            this.updatedURLs.push(url);
          }
        }
      }
      return cachedResponse;
    });
  }
};
var REVISION_SEARCH_PARAM = "__WB_REVISION__";
var createCacheKey = (entry) => {
  if (!entry) {
    throw new SerwistError("add-to-cache-list-unexpected-type", {
      entry
    });
  }
  if (typeof entry === "string") {
    const urlObject = new URL(entry, location.href);
    return {
      cacheKey: urlObject.href,
      url: urlObject.href
    };
  }
  const { revision, url } = entry;
  if (!url) {
    throw new SerwistError("add-to-cache-list-unexpected-type", {
      entry
    });
  }
  if (!revision) {
    const urlObject = new URL(url, location.href);
    return {
      cacheKey: urlObject.href,
      url: urlObject.href
    };
  }
  const cacheKeyURL = new URL(url, location.href);
  const originalURL = new URL(url, location.href);
  cacheKeyURL.searchParams.set(REVISION_SEARCH_PARAM, revision);
  return {
    cacheKey: cacheKeyURL.href,
    url: originalURL.href
  };
};
var parseRoute = (capture, handler, method) => {
  if (typeof capture === "string") {
    const captureUrl = new URL(capture, location.href);
    if (true) {
      if (!(capture.startsWith("/") || capture.startsWith("http"))) {
        throw new SerwistError("invalid-string", {
          moduleName: "serwist",
          funcName: "parseRoute",
          paramName: "capture"
        });
      }
      const valueToCheck = capture.startsWith("http") ? captureUrl.pathname : capture;
      const wildcards = "[*:?+]";
      if (new RegExp(`${wildcards}`).exec(valueToCheck)) {
        logger.debug(`The '$capture' parameter contains an Express-style wildcard character (${wildcards}). Strings are now always interpreted as exact matches; use a RegExp for partial or wildcard matches.`);
      }
    }
    const matchCallback = ({ url }) => {
      if (true) {
        if (url.pathname === captureUrl.pathname && url.origin !== captureUrl.origin) {
          logger.debug(`${capture} only partially matches the cross-origin URL ${url.toString()}. This route will only handle cross-origin requests if they match the entire URL.`);
        }
      }
      return url.href === captureUrl.href;
    };
    return new Route(matchCallback, handler, method);
  }
  if (capture instanceof RegExp) {
    return new RegExpRoute(capture, handler, method);
  }
  if (typeof capture === "function") {
    return new Route(capture, handler, method);
  }
  if (capture instanceof Route) {
    return capture;
  }
  throw new SerwistError("unsupported-route-type", {
    moduleName: "serwist",
    funcName: "parseRoute",
    paramName: "capture"
  });
};
var logGroup = (groupTitle, deletedURLs) => {
  logger.groupCollapsed(groupTitle);
  for (const url of deletedURLs) {
    logger.log(url);
  }
  logger.groupEnd();
};
var printCleanupDetails = (deletedURLs) => {
  const deletionCount = deletedURLs.length;
  if (deletionCount > 0) {
    logger.groupCollapsed(`During precaching cleanup, ${deletionCount} cached request${deletionCount === 1 ? " was" : "s were"} deleted.`);
    logGroup("Deleted Cache Requests", deletedURLs);
    logger.groupEnd();
  }
};
function _nestedGroup(groupTitle, urls) {
  if (urls.length === 0) {
    return;
  }
  logger.groupCollapsed(groupTitle);
  for (const url of urls) {
    logger.log(url);
  }
  logger.groupEnd();
}
var printInstallDetails = (urlsToPrecache, urlsAlreadyPrecached) => {
  const precachedCount = urlsToPrecache.length;
  const alreadyPrecachedCount = urlsAlreadyPrecached.length;
  if (precachedCount || alreadyPrecachedCount) {
    let message = `Precaching ${precachedCount} file${precachedCount === 1 ? "" : "s"}.`;
    if (alreadyPrecachedCount > 0) {
      message += ` ${alreadyPrecachedCount} file${alreadyPrecachedCount === 1 ? " is" : "s are"} already cached.`;
    }
    logger.groupCollapsed(message);
    _nestedGroup("View newly precached URLs.", urlsToPrecache);
    _nestedGroup("View previously precached URLs.", urlsAlreadyPrecached);
    logger.groupEnd();
  }
};

// node_modules/serwist/dist/index.js
var PrecacheRoute = class extends Route {
  constructor(serwist, options) {
    const match = ({ request }) => {
      const urlsToCacheKeys = serwist.getUrlsToPrecacheKeys();
      for (const possibleURL of generateURLVariations(request.url, options)) {
        const cacheKey = urlsToCacheKeys.get(possibleURL);
        if (cacheKey) {
          const integrity = serwist.getIntegrityForPrecacheKey(cacheKey);
          return {
            cacheKey,
            integrity
          };
        }
      }
      if (true) {
        logger.debug(`Precaching did not find a match for ${getFriendlyURL(request.url)}.`);
      }
      return;
    };
    super(match, serwist.precacheStrategy);
  }
};
var QUEUE_NAME = "serwist-google-analytics";
var MAX_RETENTION_TIME2 = 60 * 48;
var GOOGLE_ANALYTICS_HOST = "www.google-analytics.com";
var GTM_HOST = "www.googletagmanager.com";
var ANALYTICS_JS_PATH = "/analytics.js";
var GTAG_JS_PATH = "/gtag/js";
var GTM_JS_PATH = "/gtm.js";
var COLLECT_PATHS_REGEX = /^\/(\w+\/)?collect/;
var createOnSyncCallback = (config) => {
  return async ({ queue }) => {
    let entry = void 0;
    while (entry = await queue.shiftRequest()) {
      const { request, timestamp } = entry;
      const url = new URL(request.url);
      try {
        const params = request.method === "POST" ? new URLSearchParams(await request.clone().text()) : url.searchParams;
        const originalHitTime = timestamp - (Number(params.get("qt")) || 0);
        const queueTime = Date.now() - originalHitTime;
        params.set("qt", String(queueTime));
        if (config.parameterOverrides) {
          for (const param of Object.keys(config.parameterOverrides)) {
            const value = config.parameterOverrides[param];
            params.set(param, value);
          }
        }
        if (typeof config.hitFilter === "function") {
          config.hitFilter.call(null, params);
        }
        await fetch(new Request(url.origin + url.pathname, {
          body: params.toString(),
          method: "POST",
          mode: "cors",
          credentials: "omit",
          headers: {
            "Content-Type": "text/plain"
          }
        }));
        if (true) {
          logger.log(`Request for '${getFriendlyURL(url.href)}' has been replayed`);
        }
      } catch (err) {
        await queue.unshiftRequest(entry);
        if (true) {
          logger.log(`Request for '${getFriendlyURL(url.href)}' failed to replay, putting it back in the queue.`);
        }
        throw err;
      }
    }
    if (true) {
      logger.log("All Google Analytics request successfully replayed; the queue is now empty!");
    }
  };
};
var createCollectRoutes = (bgSyncPlugin) => {
  const match = ({ url }) => url.hostname === GOOGLE_ANALYTICS_HOST && COLLECT_PATHS_REGEX.test(url.pathname);
  const handler = new NetworkOnly({
    plugins: [
      bgSyncPlugin
    ]
  });
  return [
    new Route(match, handler, "GET"),
    new Route(match, handler, "POST")
  ];
};
var createAnalyticsJsRoute = (cacheName) => {
  const match = ({ url }) => url.hostname === GOOGLE_ANALYTICS_HOST && url.pathname === ANALYTICS_JS_PATH;
  const handler = new NetworkFirst({
    cacheName
  });
  return new Route(match, handler, "GET");
};
var createGtagJsRoute = (cacheName) => {
  const match = ({ url }) => url.hostname === GTM_HOST && url.pathname === GTAG_JS_PATH;
  const handler = new NetworkFirst({
    cacheName
  });
  return new Route(match, handler, "GET");
};
var createGtmJsRoute = (cacheName) => {
  const match = ({ url }) => url.hostname === GTM_HOST && url.pathname === GTM_JS_PATH;
  const handler = new NetworkFirst({
    cacheName
  });
  return new Route(match, handler, "GET");
};
var initializeGoogleAnalytics = ({ serwist, cacheName, ...options }) => {
  const resolvedCacheName = cacheNames.getGoogleAnalyticsName(cacheName);
  const bgSyncPlugin = new BackgroundSyncPlugin(QUEUE_NAME, {
    maxRetentionTime: MAX_RETENTION_TIME2,
    onSync: createOnSyncCallback(options)
  });
  const routes = [
    createGtmJsRoute(resolvedCacheName),
    createAnalyticsJsRoute(resolvedCacheName),
    createGtagJsRoute(resolvedCacheName),
    ...createCollectRoutes(bgSyncPlugin)
  ];
  for (const route of routes) {
    serwist.registerRoute(route);
  }
};
var PrecacheFallbackPlugin = class {
  constructor({ fallbackUrls, serwist }) {
    __publicField(this, "_fallbackUrls");
    __publicField(this, "_serwist");
    this._fallbackUrls = fallbackUrls;
    this._serwist = serwist;
  }
  async handlerDidError(param) {
    for (const fallback of this._fallbackUrls) {
      if (typeof fallback === "string") {
        const fallbackResponse = await this._serwist.matchPrecache(fallback);
        if (fallbackResponse !== void 0) {
          return fallbackResponse;
        }
      } else if (fallback.matcher(param)) {
        const fallbackResponse = await this._serwist.matchPrecache(fallback.url);
        if (fallbackResponse !== void 0) {
          return fallbackResponse;
        }
      }
    }
    return void 0;
  }
};
var PrecacheCacheKeyPlugin = class {
  constructor({ precacheController }) {
    __publicField(this, "_precacheController");
    __publicField(this, "cacheKeyWillBeUsed", async ({ request, params }) => {
      const cacheKey = (params == null ? void 0 : params.cacheKey) || this._precacheController.getPrecacheKeyForUrl(request.url);
      return cacheKey ? new Request(cacheKey, {
        headers: request.headers
      }) : request;
    });
    this._precacheController = precacheController;
  }
};
var parsePrecacheOptions = (serwist, precacheOptions = {}) => {
  const { cacheName: precacheCacheName, plugins: precachePlugins = [], fetchOptions: precacheFetchOptions, matchOptions: precacheMatchOptions, fallbackToNetwork: precacheFallbackToNetwork, directoryIndex: precacheDirectoryIndex, ignoreURLParametersMatching: precacheIgnoreUrls, cleanURLs: precacheCleanUrls, urlManipulation: precacheUrlManipulation, cleanupOutdatedCaches: cleanupOutdatedCaches2, concurrency = 10, navigateFallback, navigateFallbackAllowlist, navigateFallbackDenylist } = precacheOptions != null ? precacheOptions : {};
  return {
    precacheStrategyOptions: {
      cacheName: cacheNames.getPrecacheName(precacheCacheName),
      plugins: [
        ...precachePlugins,
        new PrecacheCacheKeyPlugin({
          precacheController: serwist
        })
      ],
      fetchOptions: precacheFetchOptions,
      matchOptions: precacheMatchOptions,
      fallbackToNetwork: precacheFallbackToNetwork
    },
    precacheRouteOptions: {
      directoryIndex: precacheDirectoryIndex,
      ignoreURLParametersMatching: precacheIgnoreUrls,
      cleanURLs: precacheCleanUrls,
      urlManipulation: precacheUrlManipulation
    },
    precacheMiscOptions: {
      cleanupOutdatedCaches: cleanupOutdatedCaches2,
      concurrency,
      navigateFallback,
      navigateFallbackAllowlist,
      navigateFallbackDenylist
    }
  };
};
var Serwist = class {
  constructor({ precacheEntries, precacheOptions, skipWaiting = false, importScripts, navigationPreload = false, cacheId, clientsClaim: clientsClaim$1 = false, runtimeCaching, offlineAnalyticsConfig, disableDevLogs: disableDevLogs$1 = false, fallbacks } = {}) {
    __publicField(this, "_urlsToCacheKeys", /* @__PURE__ */ new Map());
    __publicField(this, "_urlsToCacheModes", /* @__PURE__ */ new Map());
    __publicField(this, "_cacheKeysToIntegrities", /* @__PURE__ */ new Map());
    __publicField(this, "_concurrentPrecaching");
    __publicField(this, "_precacheStrategy");
    __publicField(this, "_routes");
    __publicField(this, "_defaultHandlerMap");
    __publicField(this, "_catchHandler");
    const { precacheStrategyOptions, precacheRouteOptions, precacheMiscOptions } = parsePrecacheOptions(this, precacheOptions);
    this._concurrentPrecaching = precacheMiscOptions.concurrency;
    this._precacheStrategy = new PrecacheStrategy(precacheStrategyOptions);
    this._routes = /* @__PURE__ */ new Map();
    this._defaultHandlerMap = /* @__PURE__ */ new Map();
    this.handleInstall = this.handleInstall.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
    this.handleFetch = this.handleFetch.bind(this);
    this.handleCache = this.handleCache.bind(this);
    if (!!importScripts && importScripts.length > 0) self.importScripts(...importScripts);
    if (navigationPreload) enableNavigationPreload();
    if (cacheId !== void 0) {
      setCacheNameDetails({
        prefix: cacheId
      });
    }
    if (skipWaiting) {
      self.skipWaiting();
    } else {
      self.addEventListener("message", (event) => {
        if (event.data && event.data.type === "SKIP_WAITING") {
          self.skipWaiting();
        }
      });
    }
    if (clientsClaim$1) clientsClaim();
    if (!!precacheEntries && precacheEntries.length > 0) {
      this.addToPrecacheList(precacheEntries);
    }
    if (precacheMiscOptions.cleanupOutdatedCaches) {
      cleanupOutdatedCaches(precacheStrategyOptions.cacheName);
    }
    this.registerRoute(new PrecacheRoute(this, precacheRouteOptions));
    if (precacheMiscOptions.navigateFallback) {
      this.registerRoute(new NavigationRoute(this.createHandlerBoundToUrl(precacheMiscOptions.navigateFallback), {
        allowlist: precacheMiscOptions.navigateFallbackAllowlist,
        denylist: precacheMiscOptions.navigateFallbackDenylist
      }));
    }
    if (offlineAnalyticsConfig !== void 0) {
      if (typeof offlineAnalyticsConfig === "boolean") {
        offlineAnalyticsConfig && initializeGoogleAnalytics({
          serwist: this
        });
      } else {
        initializeGoogleAnalytics({
          ...offlineAnalyticsConfig,
          serwist: this
        });
      }
    }
    if (runtimeCaching !== void 0) {
      if (fallbacks !== void 0) {
        const fallbackPlugin = new PrecacheFallbackPlugin({
          fallbackUrls: fallbacks.entries,
          serwist: this
        });
        runtimeCaching.forEach((cacheEntry) => {
          if (cacheEntry.handler instanceof Strategy && !cacheEntry.handler.plugins.some((plugin) => "handlerDidError" in plugin)) {
            cacheEntry.handler.plugins.push(fallbackPlugin);
          }
        });
      }
      for (const entry of runtimeCaching) {
        this.registerCapture(entry.matcher, entry.handler, entry.method);
      }
    }
    if (disableDevLogs$1) disableDevLogs();
  }
  get precacheStrategy() {
    return this._precacheStrategy;
  }
  get routes() {
    return this._routes;
  }
  addEventListeners() {
    self.addEventListener("install", this.handleInstall);
    self.addEventListener("activate", this.handleActivate);
    self.addEventListener("fetch", this.handleFetch);
    self.addEventListener("message", this.handleCache);
  }
  addToPrecacheList(entries) {
    if (true) {
      finalAssertExports.isArray(entries, {
        moduleName: "serwist",
        className: "Serwist",
        funcName: "addToCacheList",
        paramName: "entries"
      });
    }
    const urlsToWarnAbout = [];
    for (const entry of entries) {
      if (typeof entry === "string") {
        urlsToWarnAbout.push(entry);
      } else if (entry && !entry.integrity && entry.revision === void 0) {
        urlsToWarnAbout.push(entry.url);
      }
      const { cacheKey, url } = createCacheKey(entry);
      const cacheMode = typeof entry !== "string" && entry.revision ? "reload" : "default";
      if (this._urlsToCacheKeys.has(url) && this._urlsToCacheKeys.get(url) !== cacheKey) {
        throw new SerwistError("add-to-cache-list-conflicting-entries", {
          firstEntry: this._urlsToCacheKeys.get(url),
          secondEntry: cacheKey
        });
      }
      if (typeof entry !== "string" && entry.integrity) {
        if (this._cacheKeysToIntegrities.has(cacheKey) && this._cacheKeysToIntegrities.get(cacheKey) !== entry.integrity) {
          throw new SerwistError("add-to-cache-list-conflicting-integrities", {
            url
          });
        }
        this._cacheKeysToIntegrities.set(cacheKey, entry.integrity);
      }
      this._urlsToCacheKeys.set(url, cacheKey);
      this._urlsToCacheModes.set(url, cacheMode);
      if (urlsToWarnAbout.length > 0) {
        const warningMessage = `Serwist is precaching URLs without revision info: ${urlsToWarnAbout.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
        if (false) {
          console.warn(warningMessage);
        } else {
          logger.warn(warningMessage);
        }
      }
    }
  }
  handleInstall(event) {
    return waitUntil(event, async () => {
      const installReportPlugin = new PrecacheInstallReportPlugin();
      this.precacheStrategy.plugins.push(installReportPlugin);
      await parallel(this._concurrentPrecaching, Array.from(this._urlsToCacheKeys.entries()), async ([url, cacheKey]) => {
        const integrity = this._cacheKeysToIntegrities.get(cacheKey);
        const cacheMode = this._urlsToCacheModes.get(url);
        const request = new Request(url, {
          integrity,
          cache: cacheMode,
          credentials: "same-origin"
        });
        await Promise.all(this.precacheStrategy.handleAll({
          event,
          request,
          url: new URL(request.url),
          params: {
            cacheKey
          }
        }));
      });
      const { updatedURLs, notUpdatedURLs } = installReportPlugin;
      if (true) {
        printInstallDetails(updatedURLs, notUpdatedURLs);
      }
      return {
        updatedURLs,
        notUpdatedURLs
      };
    });
  }
  handleActivate(event) {
    return waitUntil(event, async () => {
      const cache = await self.caches.open(this.precacheStrategy.cacheName);
      const currentlyCachedRequests = await cache.keys();
      const expectedCacheKeys = new Set(this._urlsToCacheKeys.values());
      const deletedCacheRequests = [];
      for (const request of currentlyCachedRequests) {
        if (!expectedCacheKeys.has(request.url)) {
          await cache.delete(request);
          deletedCacheRequests.push(request.url);
        }
      }
      if (true) {
        printCleanupDetails(deletedCacheRequests);
      }
      return {
        deletedCacheRequests
      };
    });
  }
  handleFetch(event) {
    const { request } = event;
    const responsePromise = this.handleRequest({
      request,
      event
    });
    if (responsePromise) {
      event.respondWith(responsePromise);
    }
  }
  handleCache(event) {
    var _a;
    if (event.data && event.data.type === "CACHE_URLS") {
      const { payload } = event.data;
      if (true) {
        logger.debug("Caching URLs from the window", payload.urlsToCache);
      }
      const requestPromises = Promise.all(payload.urlsToCache.map((entry) => {
        let request;
        if (typeof entry === "string") {
          request = new Request(entry);
        } else {
          request = new Request(...entry);
        }
        return this.handleRequest({
          request,
          event
        });
      }));
      event.waitUntil(requestPromises);
      if ((_a = event.ports) == null ? void 0 : _a[0]) {
        void requestPromises.then(() => event.ports[0].postMessage(true));
      }
    }
  }
  setDefaultHandler(handler, method = defaultMethod) {
    this._defaultHandlerMap.set(method, normalizeHandler(handler));
  }
  setCatchHandler(handler) {
    this._catchHandler = normalizeHandler(handler);
  }
  registerCapture(capture, handler, method) {
    const route = parseRoute(capture, handler, method);
    this.registerRoute(route);
    return route;
  }
  registerRoute(route) {
    if (true) {
      finalAssertExports.isType(route, "object", {
        moduleName: "serwist",
        className: "Serwist",
        funcName: "registerRoute",
        paramName: "route"
      });
      finalAssertExports.hasMethod(route, "match", {
        moduleName: "serwist",
        className: "Serwist",
        funcName: "registerRoute",
        paramName: "route"
      });
      finalAssertExports.isType(route.handler, "object", {
        moduleName: "serwist",
        className: "Serwist",
        funcName: "registerRoute",
        paramName: "route"
      });
      finalAssertExports.hasMethod(route.handler, "handle", {
        moduleName: "serwist",
        className: "Serwist",
        funcName: "registerRoute",
        paramName: "route.handler"
      });
      finalAssertExports.isType(route.method, "string", {
        moduleName: "serwist",
        className: "Serwist",
        funcName: "registerRoute",
        paramName: "route.method"
      });
    }
    if (!this._routes.has(route.method)) {
      this._routes.set(route.method, []);
    }
    this._routes.get(route.method).push(route);
  }
  unregisterRoute(route) {
    if (!this._routes.has(route.method)) {
      throw new SerwistError("unregister-route-but-not-found-with-method", {
        method: route.method
      });
    }
    const routeIndex = this._routes.get(route.method).indexOf(route);
    if (routeIndex > -1) {
      this._routes.get(route.method).splice(routeIndex, 1);
    } else {
      throw new SerwistError("unregister-route-route-not-registered");
    }
  }
  getUrlsToPrecacheKeys() {
    return this._urlsToCacheKeys;
  }
  getPrecachedUrls() {
    return [
      ...this._urlsToCacheKeys.keys()
    ];
  }
  getPrecacheKeyForUrl(url) {
    const urlObject = new URL(url, location.href);
    return this._urlsToCacheKeys.get(urlObject.href);
  }
  getIntegrityForPrecacheKey(cacheKey) {
    return this._cacheKeysToIntegrities.get(cacheKey);
  }
  async matchPrecache(request) {
    const url = request instanceof Request ? request.url : request;
    const cacheKey = this.getPrecacheKeyForUrl(url);
    if (cacheKey) {
      const cache = await self.caches.open(this.precacheStrategy.cacheName);
      return cache.match(cacheKey);
    }
    return void 0;
  }
  createHandlerBoundToUrl(url) {
    const cacheKey = this.getPrecacheKeyForUrl(url);
    if (!cacheKey) {
      throw new SerwistError("non-precached-url", {
        url
      });
    }
    return (options) => {
      options.request = new Request(url);
      options.params = {
        cacheKey,
        ...options.params
      };
      return this.precacheStrategy.handle(options);
    };
  }
  handleRequest({ request, event }) {
    if (true) {
      finalAssertExports.isInstance(request, Request, {
        moduleName: "serwist",
        className: "Serwist",
        funcName: "handleRequest",
        paramName: "options.request"
      });
    }
    const url = new URL(request.url, location.href);
    if (!url.protocol.startsWith("http")) {
      if (true) {
        logger.debug("Router only supports URLs that start with 'http'.");
      }
      return;
    }
    const sameOrigin = url.origin === location.origin;
    const { params, route } = this.findMatchingRoute({
      event,
      request,
      sameOrigin,
      url
    });
    let handler = route == null ? void 0 : route.handler;
    const debugMessages = [];
    if (true) {
      if (handler) {
        debugMessages.push([
          "Found a route to handle this request:",
          route
        ]);
        if (params) {
          debugMessages.push([
            `Passing the following params to the route's handler:`,
            params
          ]);
        }
      }
    }
    const method = request.method;
    if (!handler && this._defaultHandlerMap.has(method)) {
      if (true) {
        debugMessages.push(`Failed to find a matching route. Falling back to the default handler for ${method}.`);
      }
      handler = this._defaultHandlerMap.get(method);
    }
    if (!handler) {
      if (true) {
        logger.debug(`No route found for: ${getFriendlyURL(url)}`);
      }
      return;
    }
    if (true) {
      logger.groupCollapsed(`Router is responding to: ${getFriendlyURL(url)}`);
      for (const msg of debugMessages) {
        if (Array.isArray(msg)) {
          logger.log(...msg);
        } else {
          logger.log(msg);
        }
      }
      logger.groupEnd();
    }
    let responsePromise;
    try {
      responsePromise = handler.handle({
        url,
        request,
        event,
        params
      });
    } catch (err) {
      responsePromise = Promise.reject(err);
    }
    const catchHandler = route == null ? void 0 : route.catchHandler;
    if (responsePromise instanceof Promise && (this._catchHandler || catchHandler)) {
      responsePromise = responsePromise.catch(async (err) => {
        if (catchHandler) {
          if (true) {
            logger.groupCollapsed(`Error thrown when responding to:  ${getFriendlyURL(url)}. Falling back to route's Catch Handler.`);
            logger.error("Error thrown by:", route);
            logger.error(err);
            logger.groupEnd();
          }
          try {
            return await catchHandler.handle({
              url,
              request,
              event,
              params
            });
          } catch (catchErr) {
            if (catchErr instanceof Error) {
              err = catchErr;
            }
          }
        }
        if (this._catchHandler) {
          if (true) {
            logger.groupCollapsed(`Error thrown when responding to:  ${getFriendlyURL(url)}. Falling back to global Catch Handler.`);
            logger.error("Error thrown by:", route);
            logger.error(err);
            logger.groupEnd();
          }
          return this._catchHandler.handle({
            url,
            request,
            event
          });
        }
        throw err;
      });
    }
    return responsePromise;
  }
  findMatchingRoute({ url, sameOrigin, request, event }) {
    const routes = this._routes.get(request.method) || [];
    for (const route of routes) {
      let params;
      const matchResult = route.match({
        url,
        sameOrigin,
        request,
        event
      });
      if (matchResult) {
        if (true) {
          if (matchResult instanceof Promise) {
            logger.warn(`While routing ${getFriendlyURL(url)}, an async matchCallback function was used. Please convert the following route to use a synchronous matchCallback function:`, route);
          }
        }
        params = matchResult;
        if (Array.isArray(params) && params.length === 0) {
          params = void 0;
        } else if (matchResult.constructor === Object && Object.keys(matchResult).length === 0) {
          params = void 0;
        } else if (typeof matchResult === "boolean") {
          params = void 0;
        }
        return {
          route,
          params
        };
      }
    }
    return {};
  }
};
var isSafari = typeof navigator !== "undefined" && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// sw.js
var sw = new Serwist({
  precacheEntries: [{"url":"index.html","revision":"3f1d32702db71f55c2239edd2b17167c"},{"url":"MinDArT-8-Symmetryscape/index.html","revision":"1459532a2be4b94bf846cb9c576035f1"},{"url":"MinDArT-7-Rotationscape/index.html","revision":"5dfe6aa3d0a0a5a4e3e3aa06dc1dbdca"},{"url":"MinDArT-6-Linkscape/index.html","revision":"c77126f2bbfe76c701938c2405432df1"},{"url":"MinDArT-5-Dotscape/index.html","revision":"46fb0ab07669a93a8f0f5b991ab2c2ab"},{"url":"MinDArT-4-Colourscape/index.html","revision":"e5d0c6cd25151d31943fac6807f976d3"},{"url":"MinDArT-3-Circlescape/index.html","revision":"7050ba9ae2d3b465d80bf523fda1a253"},{"url":"MinDArT-2-Linescape/index.html","revision":"0f274d8b56bdb80b1c84f35697613b9e"},{"url":"MinDArT-1-Touchscape/index.html","revision":"ab4683d49e5a3cfe1b48552c1d317045"},{"url":"functions.js","revision":"211e58ba212ecfce807ad07dadd1f2d6"},{"url":"MinDArT-8-Symmetryscape/symmetryscape.js","revision":"cf8d62dc990d9b4db26ed1424676a8fc"},{"url":"MinDArT-7-Rotationscape/rotationscape.js","revision":"d8772bf09a63f7a3ded120d18d63e66e"},{"url":"MinDArT-6-Linkscape/linkscape.js","revision":"32e730946561cdaa0e92cfaaa9593122"},{"url":"MinDArT-5-Dotscape/dotscape.js","revision":"fd6b06b21dca75e17e96be39fb72f0c2"},{"url":"MinDArT-4-Colourscape/colourscape.js","revision":"c54683d3e71c1938d607eb44d721b7da"},{"url":"MinDArT-4-Colourscape/brushes.js","revision":"3e20ed39e3c169bb2acb34f6134fe89e"},{"url":"MinDArT-3-Circlescape/circlescape.js","revision":"9ded8fd1c38aae3bb97bfa8dbce00fcb"},{"url":"MinDArT-2-Linescape/linescape.js","revision":"5f134d543994be394db46321203ff808"},{"url":"MinDArT-2-Linescape/interface-line.js","revision":"2fdf232a679b4579196abb6568a21af7"},{"url":"MinDArT-1-Touchscape/touchscape.js","revision":"a6bc5c2a412c99fa8fe82b53b278a334"},{"url":"shared/resize.js","revision":"45799fab74042db61860a65dcb3df5a2"},{"url":"shared/audio.js","revision":"b8c73d07b21c3eb1fa4b371c6bf74e72"},{"url":"libraries/p5.min.js","revision":"cfea55f7292c3f3fadb945d065780f13"},{"url":"css/variables.css","revision":"ebad19bc49791f17198640908d9d25c9"},{"url":"css/utilities.css","revision":"d60f9ffc5b39b308eaa89db0e7f33f86"},{"url":"css/styles.css","revision":"748fe86c1e1e6c42362c5d30cc52402a"},{"url":"css/reset.css","revision":"d66d71accca062e7d2363daed3ce9169"},{"url":"css/page.css","revision":"ce8f3d4b4ba076f16400cae7e6fcf1e7"},{"url":"css/loading-screen.css","revision":"aaf6778f41c92df22891e45e267ef2a9"},{"url":"css/btn.css","revision":"4b64ce84d557017f4a9b3baa55e4dfdd"},{"url":"css/fonts/fonts.css","revision":"5996e498400d5f25056ab9a3797c8ad1"},{"url":"assets/touchscape-icon.png","revision":"ce9df15b0200e92aaa5b3a0d53bf72d3"},{"url":"assets/touchscape-icon-white.png","revision":"9750999a2f0a96dd2567d234c6222d7b"},{"url":"assets/symmetryscape-icon.png","revision":"49d46dc55d0af1a63c8ada6b8ecc55fa"},{"url":"assets/symmetryscape-icon-white.png","revision":"799bb289c8659c8c06f02752cd5a9885"},{"url":"assets/rotationscape-icon.png","revision":"1fe28d50ddf396c4739e055798ff0391"},{"url":"assets/rotationscape-icon-white.png","revision":"86db5261d4bcd01d53f7e5b3844a2858"},{"url":"assets/mindart.png","revision":"3ab84b9a3a0d19740d2eecb1d2e810cb"},{"url":"assets/mindArt_Logo_96.png","revision":"50d30df737e07b3a9fd2f9e57f9d1525"},{"url":"assets/mindArt_Logo_384.png","revision":"6ebfc1966c102ca9bd67cf3de3583382"},{"url":"assets/mindArt_Logo_152.png","revision":"a40e6298aecd06d85dc955d1195b106f"},{"url":"assets/mindArt_Logo.png","revision":"b287685fb315c1a2b116ac9210a756e6"},{"url":"assets/linkscape-icon.png","revision":"16976ff40f21fda53651145c8c2510ca"},{"url":"assets/linkscape-icon-white.png","revision":"21f21a8feb5b0fd033e23929c39d3971"},{"url":"assets/linescape-icon.png","revision":"14268225c423ce4db185138c787f4b8b"},{"url":"assets/linescape-icon-white.png","revision":"57057b4fad85cc9c51770098b0262474"},{"url":"assets/exitFS.png","revision":"816a0fbee1a02f11203eb0691668bacb"},{"url":"assets/enterFS.png","revision":"25291b487e58da405137c819a2cf3678"},{"url":"assets/dotscape-icon.png","revision":"c6989d75aead0b08941a2d5b49dc5573"},{"url":"assets/dotscape-icon-white.png","revision":"f054ec75aa7ea938990c7c32679d5d71"},{"url":"assets/colourscape-icon.png","revision":"c62d8209850c4c3949bcbb0e1a603e37"},{"url":"assets/colourscape-icon-white.png","revision":"f2b076105e9c4e7ab690e54cb6e1d4d2"},{"url":"assets/circlescape-icon.png","revision":"f3415cba73386c18bfb7ea65ead026a7"},{"url":"assets/circlescape-icon-white.png","revision":"4c6ba06c780f30258ada0d40c95cb7bb"},{"url":"MinDArT-8-Symmetryscape/assets/paper.jpg","revision":"6c32aca71ea204d9c61214f7a3137338"},{"url":"MinDArT-7-Rotationscape/assets/paper.jpg","revision":"20f73e0d25cfcff806cbec608c77a95e"},{"url":"MinDArT-6-Linkscape/assets/texture.png","revision":"367bfb9caa0761b55bc417344cef0f7b"},{"url":"MinDArT-6-Linkscape/assets/pin.png","revision":"c442ea73a514b65cc2115748c6f30a81"},{"url":"MinDArT-5-Dotscape/assets/paper.jpg","revision":"b4bc289ee79da4f103e4d2050bad84e4"},{"url":"MinDArT-4-Colourscape/assets/paper.jpg","revision":"516a641ffb4775870bbc58a5f0019a1f"},{"url":"MinDArT-4-Colourscape/assets/Cloud9.png","revision":"31d67caa390ff56deeb9a3c45e2a906d"},{"url":"MinDArT-4-Colourscape/assets/Cloud8.png","revision":"1df1d6a5e867b3ba42e8c47ef2f078fa"},{"url":"MinDArT-4-Colourscape/assets/Cloud7.png","revision":"dc3864dbcb0b8c6cdc031b90cb5af605"},{"url":"MinDArT-4-Colourscape/assets/Cloud6.png","revision":"3ffca957b0a52f7f96a1e4f2dfdf57e5"},{"url":"MinDArT-4-Colourscape/assets/Cloud5.png","revision":"33a9ddd8726c8e1a0226fe20b48ee6b4"},{"url":"MinDArT-4-Colourscape/assets/Cloud4.png","revision":"fc0ed069062f2c0eb99465e5fcfedf70"},{"url":"MinDArT-4-Colourscape/assets/Cloud3.png","revision":"146ba136e841ed51f90a6ae90b6036c1"},{"url":"MinDArT-4-Colourscape/assets/Cloud2.png","revision":"cedbaccebe5e4026d96f5c58d1ffd66d"},{"url":"MinDArT-4-Colourscape/assets/Cloud16.png","revision":"0552822e41f7f11786184d26a393a140"},{"url":"MinDArT-4-Colourscape/assets/Cloud15.png","revision":"684a1485673960a310ba5971949f617e"},{"url":"MinDArT-4-Colourscape/assets/Cloud14.png","revision":"fac86c9678afd4f3c1a467f3642b41f4"},{"url":"MinDArT-4-Colourscape/assets/Cloud13.png","revision":"b38d64ad98872997e438bd51dd268610"},{"url":"MinDArT-4-Colourscape/assets/Cloud12.png","revision":"9565d0f948d5bd4c3efec54d290c95c9"},{"url":"MinDArT-4-Colourscape/assets/Cloud11.png","revision":"658982b3a6f2c64c4e59ee807dd8de03"},{"url":"MinDArT-4-Colourscape/assets/Cloud10.png","revision":"ea2ee5acb86085c121f12bfd4704afdb"},{"url":"MinDArT-4-Colourscape/assets/Cloud1.png","revision":"eb75f8ad2b382614e8aa71c04a219d79"},{"url":"MinDArT-4-Colourscape/assets/Cloud0.png","revision":"24a6a3715a99d4e717ceec5b5ce82905"},{"url":"MinDArT-1-Touchscape/assets/wpebble8.png","revision":"81b4e76899a72d03098a4746beedf84f"},{"url":"MinDArT-1-Touchscape/assets/wpebble7.png","revision":"57904be4fa34cb3c896927359eccdba4"},{"url":"MinDArT-1-Touchscape/assets/wpebble6.png","revision":"d853c5326ac7466d97789032edd41d2b"},{"url":"MinDArT-1-Touchscape/assets/wpebble5.png","revision":"86e58a6d58ed0b9a504eabb333c6543e"},{"url":"MinDArT-1-Touchscape/assets/wpebble4.png","revision":"9c1a6b530fb4526e6bf72bf3315b4e23"},{"url":"MinDArT-1-Touchscape/assets/wpebble3.png","revision":"e8a57e108a028577b54ef1124aabd65f"},{"url":"MinDArT-1-Touchscape/assets/wpebble2.png","revision":"77ba911557562a0017e765f2135a6bf8"},{"url":"MinDArT-1-Touchscape/assets/wpebble1.png","revision":"0970c116fb0f4dfa4bfa2403f4be1825"},{"url":"MinDArT-1-Touchscape/assets/sand_01.jpg","revision":"c076202165d82658cc6a8d42702cbc7d"},{"url":"css/fonts/AvenirNextLTPro-Regular.woff2","revision":"d38c3e7ddd7a4ca7f72c14ae5086665f"},{"url":"sound/click.mp3","revision":"a99ad0ce4c840adca5e791dc153bfaed"},{"url":"sound/Scene8_Symmetry.mp3","revision":"d73aa0cf2c69164633bb2fd30b38d6ea"},{"url":"sound/Scene7_Rotation.mp3","revision":"371ae84443ce6ba0f78be670ce0b0008"},{"url":"sound/Scene6_Link.mp3","revision":"5178b4099b8aaabd2aa0f3def09b73a0"},{"url":"sound/Scene5_Dot.mp3","revision":"2344d233e26915dcfe5a24a64c0c534c"},{"url":"sound/Scene4_Colour.mp3","revision":"f9f1e8a5d95853e346eac1cde6ef0692"},{"url":"sound/Scene3_Circle.mp3","revision":"bfb2433515478419c68077e4cbf1d591"},{"url":"sound/Scene2_Line.mp3","revision":"9b164be4ac9db35ae088cc3be24bb8ef"},{"url":"sound/Scene1_Touch.mp3","revision":"766b20c05a6936006a00abee40844fa2"}],
  skipWaiting: true,
  clientsClaim: true,
  precacheOptions: {
    cleanupOutdatedCaches: true
  },
  runtimeCaching: [
    {
      // Match any request that ends with these file extensions
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|mp3|js|css|woff2)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "mindart-assets",
        expiration: {
          maxAgeSeconds: 30 * 24 * 60 * 60,
          // 30 days
          maxEntries: 500,
          purgeOnQuotaError: true
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    // Add a route for HTML navigation requests
    {
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "mindart-pages",
        expiration: {
          maxAgeSeconds: 30 * 24 * 60 * 60
          // 30 days
        }
      }
    }
  ]
});
sw.addEventListeners();
