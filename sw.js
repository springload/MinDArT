(() => {
  // node_modules/workbox-core/_version.js
  try {
    self["workbox:core:7.0.0"] && _();
  } catch (e) {
  }

  // node_modules/workbox-core/models/messages/messages.js
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
      return `An unexpected entry was passed to 'workbox-precaching.PrecacheController.addToCacheList()' The entry '${JSON.stringify(entry)}' isn't supported. You must supply an array of strings with one or more characters, objects with a url property or Request objects.`;
    },
    "add-to-cache-list-conflicting-entries": ({ firstEntry, secondEntry }) => {
      if (!firstEntry || !secondEntry) {
        throw new Error(`Unexpected input to 'add-to-cache-list-duplicate-entries' error.`);
      }
      return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${firstEntry} but different revision details. Workbox is unable to cache and version the asset correctly. Please remove one of the entries.`;
    },
    "plugin-error-request-will-fetch": ({ thrownErrorMessage }) => {
      if (!thrownErrorMessage) {
        throw new Error(`Unexpected input to 'plugin-error-request-will-fetch', error.`);
      }
      return `An error was thrown by a plugins 'requestWillFetch()' method. The thrown error message was: '${thrownErrorMessage}'.`;
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
      return `The Queue name '${name}' is already being used. All instances of backgroundSync.Queue must be given unique names.`;
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
      return `You must define either config.maxEntries or config.maxAgeSecondsin ${moduleName}.${className}.${funcName}`;
    },
    "statuses-or-headers-required": ({ moduleName, className, funcName }) => {
      return `You must define either config.statuses or config.headersin ${moduleName}.${className}.${funcName}`;
    },
    "invalid-string": ({ moduleName, funcName, paramName }) => {
      if (!paramName || !moduleName || !funcName) {
        throw new Error(`Unexpected input to 'invalid-string' error.`);
      }
      return `When using strings, the '${paramName}' parameter must start with 'http' (for cross-origin matches) or '/' (for same-origin matches). Please see the docs for ${moduleName}.${funcName}() for more info.`;
    },
    "channel-name-required": () => {
      return `You must provide a channelName to construct a BroadcastCacheUpdate instance.`;
    },
    "invalid-responses-are-same-args": () => {
      return `The arguments passed into responsesAreSame() appear to be invalid. Please ensure valid Responses are used.`;
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
      return `No Range header was found in the Request provided.`;
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
      return `The precaching request for '${url}' failed` + (status ? ` with an HTTP status of ${status}.` : `.`);
    },
    "non-precached-url": ({ url }) => {
      return `createHandlerBoundToURL('${url}') was called, but that URL is not precached. Please pass in a URL that is precached instead.`;
    },
    "add-to-cache-list-conflicting-integrities": ({ url }) => {
      return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${url} with different integrity values. Please remove one of them.`;
    },
    "missing-precache-entry": ({ cacheName, url }) => {
      return `Unable to find a precached response in ${cacheName} for ${url}.`;
    },
    "cross-origin-copy-response": ({ origin }) => {
      return `workbox-core.copyResponse() can only be used with same-origin responses. It was passed a response with origin ${origin}.`;
    },
    "opaque-streams-source": ({ type }) => {
      const message = `One of the workbox-streams sources resulted in an '${type}' response.`;
      if (type === "opaqueredirect") {
        return `${message} Please do not use a navigation request that results in a redirect as a source.`;
      }
      return `${message} Please ensure your sources are CORS-enabled.`;
    }
  };

  // node_modules/workbox-core/models/messages/messageGenerator.js
  var generatorFunction = (code, details = {}) => {
    const message = messages[code];
    if (!message) {
      throw new Error(`Unable to find message for code '${code}'.`);
    }
    return message(details);
  };
  var messageGenerator = false ? fallback : generatorFunction;

  // node_modules/workbox-core/_private/WorkboxError.js
  var WorkboxError = class extends Error {
    /**
     *
     * @param {string} errorCode The error code that
     * identifies this particular error.
     * @param {Object=} details Any relevant arguments
     * that will help developers identify issues should
     * be added as a key on the context object.
     */
    constructor(errorCode, details) {
      const message = messageGenerator(errorCode, details);
      super(message);
      this.name = errorCode;
      this.details = details;
    }
  };

  // node_modules/workbox-core/_private/assert.js
  var isArray = (value, details) => {
    if (!Array.isArray(value)) {
      throw new WorkboxError("not-an-array", details);
    }
  };
  var hasMethod = (object, expectedMethod, details) => {
    const type = typeof object[expectedMethod];
    if (type !== "function") {
      details["expectedMethod"] = expectedMethod;
      throw new WorkboxError("missing-a-method", details);
    }
  };
  var isType = (object, expectedType, details) => {
    if (typeof object !== expectedType) {
      details["expectedType"] = expectedType;
      throw new WorkboxError("incorrect-type", details);
    }
  };
  var isInstance = (object, expectedClass, details) => {
    if (!(object instanceof expectedClass)) {
      details["expectedClassName"] = expectedClass.name;
      throw new WorkboxError("incorrect-class", details);
    }
  };
  var isOneOf = (value, validValues, details) => {
    if (!validValues.includes(value)) {
      details["validValueDescription"] = `Valid values are ${JSON.stringify(validValues)}.`;
      throw new WorkboxError("invalid-value", details);
    }
  };
  var isArrayOfClass = (value, expectedClass, details) => {
    const error = new WorkboxError("not-array-of-class", details);
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

  // node_modules/workbox-core/_private/cacheNames.js
  var _cacheNameDetails = {
    googleAnalytics: "googleAnalytics",
    precache: "precache-v2",
    prefix: "workbox",
    runtime: "runtime",
    suffix: typeof registration !== "undefined" ? registration.scope : ""
  };
  var _createCacheName = (cacheName) => {
    return [_cacheNameDetails.prefix, cacheName, _cacheNameDetails.suffix].filter((value) => value && value.length > 0).join("-");
  };
  var eachCacheNameDetail = (fn) => {
    for (const key of Object.keys(_cacheNameDetails)) {
      fn(key);
    }
  };
  var cacheNames = {
    updateDetails: (details) => {
      eachCacheNameDetail((key) => {
        if (typeof details[key] === "string") {
          _cacheNameDetails[key] = details[key];
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

  // node_modules/workbox-core/_private/logger.js
  var logger = false ? null : (() => {
    if (!("__WB_DISABLE_DEV_LOGS" in globalThis)) {
      self.__WB_DISABLE_DEV_LOGS = false;
    }
    let inGroup = false;
    const methodToColorMap = {
      debug: `#7f8c8d`,
      log: `#2ecc71`,
      warn: `#f39c12`,
      error: `#c0392b`,
      groupCollapsed: `#3498db`,
      groupEnd: null
      // No colored prefix on groupEnd
    };
    const print = function(method, args) {
      if (self.__WB_DISABLE_DEV_LOGS) {
        return;
      }
      if (method === "groupCollapsed") {
        if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
          console[method](...args);
          return;
        }
      }
      const styles = [
        `background: ${methodToColorMap[method]}`,
        `border-radius: 0.5em`,
        `color: white`,
        `font-weight: bold`,
        `padding: 2px 0.5em`
      ];
      const logPrefix = inGroup ? [] : ["%cworkbox", styles.join(";")];
      console[method](...logPrefix, ...args);
      if (method === "groupCollapsed") {
        inGroup = true;
      }
      if (method === "groupEnd") {
        inGroup = false;
      }
    };
    const api = {};
    const loggerMethods = Object.keys(methodToColorMap);
    for (const key of loggerMethods) {
      const method = key;
      api[method] = (...args) => {
        print(method, args);
      };
    }
    return api;
  })();

  // node_modules/workbox-core/_private/waitUntil.js
  function waitUntil(event, asyncFn) {
    const returnPromise = asyncFn();
    event.waitUntil(returnPromise);
    return returnPromise;
  }

  // node_modules/workbox-precaching/_version.js
  try {
    self["workbox:precaching:7.0.0"] && _();
  } catch (e) {
  }

  // node_modules/workbox-precaching/utils/createCacheKey.js
  var REVISION_SEARCH_PARAM = "__WB_REVISION__";
  function createCacheKey(entry) {
    if (!entry) {
      throw new WorkboxError("add-to-cache-list-unexpected-type", { entry });
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
      throw new WorkboxError("add-to-cache-list-unexpected-type", { entry });
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
  }

  // node_modules/workbox-precaching/utils/PrecacheInstallReportPlugin.js
  var PrecacheInstallReportPlugin = class {
    constructor() {
      this.updatedURLs = [];
      this.notUpdatedURLs = [];
      this.handlerWillStart = async ({ request, state }) => {
        if (state) {
          state.originalRequest = request;
        }
      };
      this.cachedResponseWillBeUsed = async ({ event, state, cachedResponse }) => {
        if (event.type === "install") {
          if (state && state.originalRequest && state.originalRequest instanceof Request) {
            const url = state.originalRequest.url;
            if (cachedResponse) {
              this.notUpdatedURLs.push(url);
            } else {
              this.updatedURLs.push(url);
            }
          }
        }
        return cachedResponse;
      };
    }
  };

  // node_modules/workbox-precaching/utils/PrecacheCacheKeyPlugin.js
  var PrecacheCacheKeyPlugin = class {
    constructor({ precacheController: precacheController2 }) {
      this.cacheKeyWillBeUsed = async ({ request, params }) => {
        const cacheKey = (params === null || params === void 0 ? void 0 : params.cacheKey) || this._precacheController.getCacheKeyForURL(request.url);
        return cacheKey ? new Request(cacheKey, { headers: request.headers }) : request;
      };
      this._precacheController = precacheController2;
    }
  };

  // node_modules/workbox-precaching/utils/printCleanupDetails.js
  var logGroup = (groupTitle, deletedURLs) => {
    logger.groupCollapsed(groupTitle);
    for (const url of deletedURLs) {
      logger.log(url);
    }
    logger.groupEnd();
  };
  function printCleanupDetails(deletedURLs) {
    const deletionCount = deletedURLs.length;
    if (deletionCount > 0) {
      logger.groupCollapsed(`During precaching cleanup, ${deletionCount} cached request${deletionCount === 1 ? " was" : "s were"} deleted.`);
      logGroup("Deleted Cache Requests", deletedURLs);
      logger.groupEnd();
    }
  }

  // node_modules/workbox-precaching/utils/printInstallDetails.js
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
  function printInstallDetails(urlsToPrecache, urlsAlreadyPrecached) {
    const precachedCount = urlsToPrecache.length;
    const alreadyPrecachedCount = urlsAlreadyPrecached.length;
    if (precachedCount || alreadyPrecachedCount) {
      let message = `Precaching ${precachedCount} file${precachedCount === 1 ? "" : "s"}.`;
      if (alreadyPrecachedCount > 0) {
        message += ` ${alreadyPrecachedCount} file${alreadyPrecachedCount === 1 ? " is" : "s are"} already cached.`;
      }
      logger.groupCollapsed(message);
      _nestedGroup(`View newly precached URLs.`, urlsToPrecache);
      _nestedGroup(`View previously precached URLs.`, urlsAlreadyPrecached);
      logger.groupEnd();
    }
  }

  // node_modules/workbox-core/_private/canConstructResponseFromBodyStream.js
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

  // node_modules/workbox-core/copyResponse.js
  async function copyResponse(response, modifier) {
    let origin = null;
    if (response.url) {
      const responseURL = new URL(response.url);
      origin = responseURL.origin;
    }
    if (origin !== self.location.origin) {
      throw new WorkboxError("cross-origin-copy-response", { origin });
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
  }

  // node_modules/workbox-core/_private/getFriendlyURL.js
  var getFriendlyURL = (url) => {
    const urlObj = new URL(String(url), location.href);
    return urlObj.href.replace(new RegExp(`^${location.origin}`), "");
  };

  // node_modules/workbox-core/_private/cacheMatchIgnoreParams.js
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
    const keysOptions = Object.assign(Object.assign({}, matchOptions), { ignoreSearch: true });
    const cacheKeys = await cache.keys(request, keysOptions);
    for (const cacheKey of cacheKeys) {
      const strippedCacheKeyURL = stripParams(cacheKey.url, ignoreParams);
      if (strippedRequestURL === strippedCacheKeyURL) {
        return cache.match(cacheKey, matchOptions);
      }
    }
    return;
  }

  // node_modules/workbox-core/_private/Deferred.js
  var Deferred = class {
    /**
     * Creates a promise and exposes its resolve and reject functions as methods.
     */
    constructor() {
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    }
  };

  // node_modules/workbox-core/models/quotaErrorCallbacks.js
  var quotaErrorCallbacks = /* @__PURE__ */ new Set();

  // node_modules/workbox-core/_private/executeQuotaErrorCallbacks.js
  async function executeQuotaErrorCallbacks() {
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
  }

  // node_modules/workbox-core/_private/timeout.js
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // node_modules/workbox-strategies/_version.js
  try {
    self["workbox:strategies:7.0.0"] && _();
  } catch (e) {
  }

  // node_modules/workbox-strategies/StrategyHandler.js
  function toRequest(input) {
    return typeof input === "string" ? new Request(input) : input;
  }
  var StrategyHandler = class {
    /**
     * Creates a new instance associated with the passed strategy and event
     * that's handling the request.
     *
     * The constructor also initializes the state that will be passed to each of
     * the plugins handling this request.
     *
     * @param {workbox-strategies.Strategy} strategy
     * @param {Object} options
     * @param {Request|string} options.request A request to run this strategy for.
     * @param {ExtendableEvent} options.event The event associated with the
     *     request.
     * @param {URL} [options.url]
     * @param {*} [options.params] The return value from the
     *     {@link workbox-routing~matchCallback} (if applicable).
     */
    constructor(strategy, options) {
      this._cacheKeys = {};
      if (true) {
        finalAssertExports.isInstance(options.event, ExtendableEvent, {
          moduleName: "workbox-strategies",
          className: "StrategyHandler",
          funcName: "constructor",
          paramName: "options.event"
        });
      }
      Object.assign(this, options);
      this.event = options.event;
      this._strategy = strategy;
      this._handlerDeferred = new Deferred();
      this._extendLifetimePromises = [];
      this._plugins = [...strategy.plugins];
      this._pluginStateMap = /* @__PURE__ */ new Map();
      for (const plugin of this._plugins) {
        this._pluginStateMap.set(plugin, {});
      }
      this.event.waitUntil(this._handlerDeferred.promise);
    }
    /**
     * Fetches a given request (and invokes any applicable plugin callback
     * methods) using the `fetchOptions` (for non-navigation requests) and
     * `plugins` defined on the `Strategy` object.
     *
     * The following plugin lifecycle methods are invoked when using this method:
     * - `requestWillFetch()`
     * - `fetchDidSucceed()`
     * - `fetchDidFail()`
     *
     * @param {Request|string} input The URL or request to fetch.
     * @return {Promise<Response>}
     */
    async fetch(input) {
      const { event } = this;
      let request = toRequest(input);
      if (request.mode === "navigate" && event instanceof FetchEvent && event.preloadResponse) {
        const possiblePreloadResponse = await event.preloadResponse;
        if (possiblePreloadResponse) {
          if (true) {
            logger.log(`Using a preloaded navigation response for '${getFriendlyURL(request.url)}'`);
          }
          return possiblePreloadResponse;
        }
      }
      const originalRequest = this.hasCallback("fetchDidFail") ? request.clone() : null;
      try {
        for (const cb of this.iterateCallbacks("requestWillFetch")) {
          request = await cb({ request: request.clone(), event });
        }
      } catch (err) {
        if (err instanceof Error) {
          throw new WorkboxError("plugin-error-request-will-fetch", {
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
    /**
     * Calls `this.fetch()` and (in the background) runs `this.cachePut()` on
     * the response generated by `this.fetch()`.
     *
     * The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
     * so you do not have to manually call `waitUntil()` on the event.
     *
     * @param {Request|string} input The request or URL to fetch and cache.
     * @return {Promise<Response>}
     */
    async fetchAndCachePut(input) {
      const response = await this.fetch(input);
      const responseClone = response.clone();
      void this.waitUntil(this.cachePut(input, responseClone));
      return response;
    }
    /**
     * Matches a request from the cache (and invokes any applicable plugin
     * callback methods) using the `cacheName`, `matchOptions`, and `plugins`
     * defined on the strategy object.
     *
     * The following plugin lifecycle methods are invoked when using this method:
     * - cacheKeyWillByUsed()
     * - cachedResponseWillByUsed()
     *
     * @param {Request|string} key The Request or URL to use as the cache key.
     * @return {Promise<Response|undefined>} A matching response, if found.
     */
    async cacheMatch(key) {
      const request = toRequest(key);
      let cachedResponse;
      const { cacheName, matchOptions } = this._strategy;
      const effectiveRequest = await this.getCacheKey(request, "read");
      const multiMatchOptions = Object.assign(Object.assign({}, matchOptions), { cacheName });
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
    /**
     * Puts a request/response pair in the cache (and invokes any applicable
     * plugin callback methods) using the `cacheName` and `plugins` defined on
     * the strategy object.
     *
     * The following plugin lifecycle methods are invoked when using this method:
     * - cacheKeyWillByUsed()
     * - cacheWillUpdate()
     * - cacheDidUpdate()
     *
     * @param {Request|string} key The request or URL to use as the cache key.
     * @param {Response} response The response to cache.
     * @return {Promise<boolean>} `false` if a cacheWillUpdate caused the response
     * not be cached, and `true` otherwise.
     */
    async cachePut(key, response) {
      const request = toRequest(key);
      await timeout(0);
      const effectiveRequest = await this.getCacheKey(request, "write");
      if (true) {
        if (effectiveRequest.method && effectiveRequest.method !== "GET") {
          throw new WorkboxError("attempt-to-cache-non-get-request", {
            url: getFriendlyURL(effectiveRequest.url),
            method: effectiveRequest.method
          });
        }
        const vary = response.headers.get("Vary");
        if (vary) {
          logger.debug(`The response for ${getFriendlyURL(effectiveRequest.url)} has a 'Vary: ${vary}' header. Consider setting the {ignoreVary: true} option on your strategy to ensure cache matching and deletion works as expected.`);
        }
      }
      if (!response) {
        if (true) {
          logger.error(`Cannot cache non-existent response for '${getFriendlyURL(effectiveRequest.url)}'.`);
        }
        throw new WorkboxError("cache-put-with-no-response", {
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
      const hasCacheUpdateCallback = this.hasCallback("cacheDidUpdate");
      const oldResponse = hasCacheUpdateCallback ? await cacheMatchIgnoreParams(
        // TODO(philipwalton): the `__WB_REVISION__` param is a precaching
        // feature. Consider into ways to only add this behavior if using
        // precaching.
        cache,
        effectiveRequest.clone(),
        ["__WB_REVISION__"],
        matchOptions
      ) : null;
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
    /**
     * Checks the list of plugins for the `cacheKeyWillBeUsed` callback, and
     * executes any of those callbacks found in sequence. The final `Request`
     * object returned by the last plugin is treated as the cache key for cache
     * reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
     * been registered, the passed request is returned unmodified
     *
     * @param {Request} request
     * @param {string} mode
     * @return {Promise<Request>}
     */
    async getCacheKey(request, mode) {
      const key = `${request.url} | ${mode}`;
      if (!this._cacheKeys[key]) {
        let effectiveRequest = request;
        for (const callback of this.iterateCallbacks("cacheKeyWillBeUsed")) {
          effectiveRequest = toRequest(await callback({
            mode,
            request: effectiveRequest,
            event: this.event,
            // params has a type any can't change right now.
            params: this.params
            // eslint-disable-line
          }));
        }
        this._cacheKeys[key] = effectiveRequest;
      }
      return this._cacheKeys[key];
    }
    /**
     * Returns true if the strategy has at least one plugin with the given
     * callback.
     *
     * @param {string} name The name of the callback to check for.
     * @return {boolean}
     */
    hasCallback(name) {
      for (const plugin of this._strategy.plugins) {
        if (name in plugin) {
          return true;
        }
      }
      return false;
    }
    /**
     * Runs all plugin callbacks matching the given name, in order, passing the
     * given param object (merged ith the current plugin state) as the only
     * argument.
     *
     * Note: since this method runs all plugins, it's not suitable for cases
     * where the return value of a callback needs to be applied prior to calling
     * the next callback. See
     * {@link workbox-strategies.StrategyHandler#iterateCallbacks}
     * below for how to handle that case.
     *
     * @param {string} name The name of the callback to run within each plugin.
     * @param {Object} param The object to pass as the first (and only) param
     *     when executing each callback. This object will be merged with the
     *     current plugin state prior to callback execution.
     */
    async runCallbacks(name, param) {
      for (const callback of this.iterateCallbacks(name)) {
        await callback(param);
      }
    }
    /**
     * Accepts a callback and returns an iterable of matching plugin callbacks,
     * where each callback is wrapped with the current handler state (i.e. when
     * you call each callback, whatever object parameter you pass it will
     * be merged with the plugin's current state).
     *
     * @param {string} name The name fo the callback to run
     * @return {Array<Function>}
     */
    *iterateCallbacks(name) {
      for (const plugin of this._strategy.plugins) {
        if (typeof plugin[name] === "function") {
          const state = this._pluginStateMap.get(plugin);
          const statefulCallback = (param) => {
            const statefulParam = Object.assign(Object.assign({}, param), { state });
            return plugin[name](statefulParam);
          };
          yield statefulCallback;
        }
      }
    }
    /**
     * Adds a promise to the
     * [extend lifetime promises]{@link https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises}
     * of the event event associated with the request being handled (usually a
     * `FetchEvent`).
     *
     * Note: you can await
     * {@link workbox-strategies.StrategyHandler~doneWaiting}
     * to know when all added promises have settled.
     *
     * @param {Promise} promise A promise to add to the extend lifetime promises
     *     of the event that triggered the request.
     */
    waitUntil(promise) {
      this._extendLifetimePromises.push(promise);
      return promise;
    }
    /**
     * Returns a promise that resolves once all promises passed to
     * {@link workbox-strategies.StrategyHandler~waitUntil}
     * have settled.
     *
     * Note: any work done after `doneWaiting()` settles should be manually
     * passed to an event's `waitUntil()` method (not this handler's
     * `waitUntil()` method), otherwise the service worker thread my be killed
     * prior to your work completing.
     */
    async doneWaiting() {
      let promise;
      while (promise = this._extendLifetimePromises.shift()) {
        await promise;
      }
    }
    /**
     * Stops running the strategy and immediately resolves any pending
     * `waitUntil()` promises.
     */
    destroy() {
      this._handlerDeferred.resolve(null);
    }
    /**
     * This method will call cacheWillUpdate on the available plugins (or use
     * status === 200) to determine if the Response is safe and valid to cache.
     *
     * @param {Request} options.request
     * @param {Response} options.response
     * @return {Promise<Response|undefined>}
     *
     * @private
     */
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
          responseToCache = void 0;
        }
        if (true) {
          if (responseToCache) {
            if (responseToCache.status !== 200) {
              if (responseToCache.status === 0) {
                logger.warn(`The response for '${this.request.url}' is an opaque response. The caching strategy that you're using will not cache opaque responses by default.`);
              } else {
                logger.debug(`The response for '${this.request.url}' returned a status code of '${response.status}' and won't be cached as a result.`);
              }
            }
          }
        }
      }
      return responseToCache;
    }
  };

  // node_modules/workbox-strategies/Strategy.js
  var Strategy = class {
    /**
     * Creates a new instance of the strategy and sets all documented option
     * properties as public instance properties.
     *
     * Note: if a custom strategy class extends the base Strategy class and does
     * not need more than these properties, it does not need to define its own
     * constructor.
     *
     * @param {Object} [options]
     * @param {string} [options.cacheName] Cache name to store and retrieve
     * requests. Defaults to the cache names provided by
     * {@link workbox-core.cacheNames}.
     * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
     * to use in conjunction with this caching strategy.
     * @param {Object} [options.fetchOptions] Values passed along to the
     * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
     * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
     * `fetch()` requests made by this strategy.
     * @param {Object} [options.matchOptions] The
     * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
     * for any `cache.match()` or `cache.put()` calls made by this strategy.
     */
    constructor(options = {}) {
      this.cacheName = cacheNames.getRuntimeName(options.cacheName);
      this.plugins = options.plugins || [];
      this.fetchOptions = options.fetchOptions;
      this.matchOptions = options.matchOptions;
    }
    /**
     * Perform a request strategy and returns a `Promise` that will resolve with
     * a `Response`, invoking all relevant plugin callbacks.
     *
     * When a strategy instance is registered with a Workbox
     * {@link workbox-routing.Route}, this method is automatically
     * called when the route matches.
     *
     * Alternatively, this method can be used in a standalone `FetchEvent`
     * listener by passing it to `event.respondWith()`.
     *
     * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
     *     properties listed below.
     * @param {Request|string} options.request A request to run this strategy for.
     * @param {ExtendableEvent} options.event The event associated with the
     *     request.
     * @param {URL} [options.url]
     * @param {*} [options.params]
     */
    handle(options) {
      const [responseDone] = this.handleAll(options);
      return responseDone;
    }
    /**
     * Similar to {@link workbox-strategies.Strategy~handle}, but
     * instead of just returning a `Promise` that resolves to a `Response` it
     * it will return an tuple of `[response, done]` promises, where the former
     * (`response`) is equivalent to what `handle()` returns, and the latter is a
     * Promise that will resolve once any promises that were added to
     * `event.waitUntil()` as part of performing the strategy have completed.
     *
     * You can await the `done` promise to ensure any extra work performed by
     * the strategy (usually caching responses) completes successfully.
     *
     * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
     *     properties listed below.
     * @param {Request|string} options.request A request to run this strategy for.
     * @param {ExtendableEvent} options.event The event associated with the
     *     request.
     * @param {URL} [options.url]
     * @param {*} [options.params]
     * @return {Array<Promise>} A tuple of [response, done]
     *     promises that can be used to determine when the response resolves as
     *     well as when the handler has completed all its work.
     */
    handleAll(options) {
      if (options instanceof FetchEvent) {
        options = {
          event: options,
          request: options.request
        };
      }
      const event = options.event;
      const request = typeof options.request === "string" ? new Request(options.request) : options.request;
      const params = "params" in options ? options.params : void 0;
      const handler = new StrategyHandler(this, { event, request, params });
      const responseDone = this._getResponse(handler, request, event);
      const handlerDone = this._awaitComplete(responseDone, handler, request, event);
      return [responseDone, handlerDone];
    }
    async _getResponse(handler, request, event) {
      await handler.runCallbacks("handlerWillStart", { event, request });
      let response = void 0;
      try {
        response = await this._handle(request, handler);
        if (!response || response.type === "error") {
          throw new WorkboxError("no-response", { url: request.url });
        }
      } catch (error) {
        if (error instanceof Error) {
          for (const callback of handler.iterateCallbacks("handlerDidError")) {
            response = await callback({ error, event, request });
            if (response) {
              break;
            }
          }
        }
        if (!response) {
          throw error;
        } else if (true) {
          logger.log(`While responding to '${getFriendlyURL(request.url)}', an ${error instanceof Error ? error.toString() : ""} error occurred. Using a fallback response provided by a handlerDidError plugin.`);
        }
      }
      for (const callback of handler.iterateCallbacks("handlerWillRespond")) {
        response = await callback({ event, request, response });
      }
      return response;
    }
    async _awaitComplete(responseDone, handler, request, event) {
      let response;
      let error;
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

  // node_modules/workbox-precaching/PrecacheStrategy.js
  var PrecacheStrategy = class _PrecacheStrategy extends Strategy {
    /**
     *
     * @param {Object} [options]
     * @param {string} [options.cacheName] Cache name to store and retrieve
     * requests. Defaults to the cache names provided by
     * {@link workbox-core.cacheNames}.
     * @param {Array<Object>} [options.plugins] {@link https://developers.google.com/web/tools/workbox/guides/using-plugins|Plugins}
     * to use in conjunction with this caching strategy.
     * @param {Object} [options.fetchOptions] Values passed along to the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
     * of all fetch() requests made by this strategy.
     * @param {Object} [options.matchOptions] The
     * {@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions|CacheQueryOptions}
     * for any `cache.match()` or `cache.put()` calls made by this strategy.
     * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
     * get the response from the network if there's a precache miss.
     */
    constructor(options = {}) {
      options.cacheName = cacheNames.getPrecacheName(options.cacheName);
      super(options);
      this._fallbackToNetwork = options.fallbackToNetwork === false ? false : true;
      this.plugins.push(_PrecacheStrategy.copyRedirectedCacheableResponsesPlugin);
    }
    /**
     * @private
     * @param {Request|string} request A request to run this strategy for.
     * @param {workbox-strategies.StrategyHandler} handler The event that
     *     triggered the request.
     * @return {Promise<Response>}
     */
    async _handle(request, handler) {
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
      let response;
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
        throw new WorkboxError("missing-precache-entry", {
          cacheName: this.cacheName,
          url: request.url
        });
      }
      if (true) {
        const cacheKey = params.cacheKey || await handler.getCacheKey(request, "read");
        logger.groupCollapsed(`Precaching is responding to: ` + getFriendlyURL(request.url));
        logger.log(`Serving the precached url: ${getFriendlyURL(cacheKey instanceof Request ? cacheKey.url : cacheKey)}`);
        logger.groupCollapsed(`View request details here.`);
        logger.log(request);
        logger.groupEnd();
        logger.groupCollapsed(`View response details here.`);
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
        throw new WorkboxError("bad-precaching-response", {
          url: request.url,
          status: response.status
        });
      }
      return response;
    }
    /**
     * This method is complex, as there a number of things to account for:
     *
     * The `plugins` array can be set at construction, and/or it might be added to
     * to at any time before the strategy is used.
     *
     * At the time the strategy is used (i.e. during an `install` event), there
     * needs to be at least one plugin that implements `cacheWillUpdate` in the
     * array, other than `copyRedirectedCacheableResponsesPlugin`.
     *
     * - If this method is called and there are no suitable `cacheWillUpdate`
     * plugins, we need to add `defaultPrecacheCacheabilityPlugin`.
     *
     * - If this method is called and there is exactly one `cacheWillUpdate`, then
     * we don't have to do anything (this might be a previously added
     * `defaultPrecacheCacheabilityPlugin`, or it might be a custom plugin).
     *
     * - If this method is called and there is more than one `cacheWillUpdate`,
     * then we need to check if one is `defaultPrecacheCacheabilityPlugin`. If so,
     * we need to remove it. (This situation is unlikely, but it could happen if
     * the strategy is used multiple times, the first without a `cacheWillUpdate`,
     * and then later on after manually adding a custom `cacheWillUpdate`.)
     *
     * See https://github.com/GoogleChrome/workbox/issues/2737 for more context.
     *
     * @private
     */
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
  PrecacheStrategy.defaultPrecacheCacheabilityPlugin = {
    async cacheWillUpdate({ response }) {
      if (!response || response.status >= 400) {
        return null;
      }
      return response;
    }
  };
  PrecacheStrategy.copyRedirectedCacheableResponsesPlugin = {
    async cacheWillUpdate({ response }) {
      return response.redirected ? await copyResponse(response) : response;
    }
  };

  // node_modules/workbox-precaching/PrecacheController.js
  var PrecacheController = class {
    /**
     * Create a new PrecacheController.
     *
     * @param {Object} [options]
     * @param {string} [options.cacheName] The cache to use for precaching.
     * @param {string} [options.plugins] Plugins to use when precaching as well
     * as responding to fetch events for precached assets.
     * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
     * get the response from the network if there's a precache miss.
     */
    constructor({ cacheName, plugins = [], fallbackToNetwork = true } = {}) {
      this._urlsToCacheKeys = /* @__PURE__ */ new Map();
      this._urlsToCacheModes = /* @__PURE__ */ new Map();
      this._cacheKeysToIntegrities = /* @__PURE__ */ new Map();
      this._strategy = new PrecacheStrategy({
        cacheName: cacheNames.getPrecacheName(cacheName),
        plugins: [
          ...plugins,
          new PrecacheCacheKeyPlugin({ precacheController: this })
        ],
        fallbackToNetwork
      });
      this.install = this.install.bind(this);
      this.activate = this.activate.bind(this);
    }
    /**
     * @type {workbox-precaching.PrecacheStrategy} The strategy created by this controller and
     * used to cache assets and respond to fetch events.
     */
    get strategy() {
      return this._strategy;
    }
    /**
     * Adds items to the precache list, removing any duplicates and
     * stores the files in the
     * {@link workbox-core.cacheNames|"precache cache"} when the service
     * worker installs.
     *
     * This method can be called multiple times.
     *
     * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
     */
    precache(entries) {
      this.addToCacheList(entries);
      if (!this._installAndActiveListenersAdded) {
        self.addEventListener("install", this.install);
        self.addEventListener("activate", this.activate);
        this._installAndActiveListenersAdded = true;
      }
    }
    /**
     * This method will add items to the precache list, removing duplicates
     * and ensuring the information is valid.
     *
     * @param {Array<workbox-precaching.PrecacheController.PrecacheEntry|string>} entries
     *     Array of entries to precache.
     */
    addToCacheList(entries) {
      if (true) {
        finalAssertExports.isArray(entries, {
          moduleName: "workbox-precaching",
          className: "PrecacheController",
          funcName: "addToCacheList",
          paramName: "entries"
        });
      }
      const urlsToWarnAbout = [];
      for (const entry of entries) {
        if (typeof entry === "string") {
          urlsToWarnAbout.push(entry);
        } else if (entry && entry.revision === void 0) {
          urlsToWarnAbout.push(entry.url);
        }
        const { cacheKey, url } = createCacheKey(entry);
        const cacheMode = typeof entry !== "string" && entry.revision ? "reload" : "default";
        if (this._urlsToCacheKeys.has(url) && this._urlsToCacheKeys.get(url) !== cacheKey) {
          throw new WorkboxError("add-to-cache-list-conflicting-entries", {
            firstEntry: this._urlsToCacheKeys.get(url),
            secondEntry: cacheKey
          });
        }
        if (typeof entry !== "string" && entry.integrity) {
          if (this._cacheKeysToIntegrities.has(cacheKey) && this._cacheKeysToIntegrities.get(cacheKey) !== entry.integrity) {
            throw new WorkboxError("add-to-cache-list-conflicting-integrities", {
              url
            });
          }
          this._cacheKeysToIntegrities.set(cacheKey, entry.integrity);
        }
        this._urlsToCacheKeys.set(url, cacheKey);
        this._urlsToCacheModes.set(url, cacheMode);
        if (urlsToWarnAbout.length > 0) {
          const warningMessage = `Workbox is precaching URLs without revision info: ${urlsToWarnAbout.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
          if (false) {
            console.warn(warningMessage);
          } else {
            logger.warn(warningMessage);
          }
        }
      }
    }
    /**
     * Precaches new and updated assets. Call this method from the service worker
     * install event.
     *
     * Note: this method calls `event.waitUntil()` for you, so you do not need
     * to call it yourself in your event handlers.
     *
     * @param {ExtendableEvent} event
     * @return {Promise<workbox-precaching.InstallResult>}
     */
    install(event) {
      return waitUntil(event, async () => {
        const installReportPlugin = new PrecacheInstallReportPlugin();
        this.strategy.plugins.push(installReportPlugin);
        for (const [url, cacheKey] of this._urlsToCacheKeys) {
          const integrity = this._cacheKeysToIntegrities.get(cacheKey);
          const cacheMode = this._urlsToCacheModes.get(url);
          const request = new Request(url, {
            integrity,
            cache: cacheMode,
            credentials: "same-origin"
          });
          await Promise.all(this.strategy.handleAll({
            params: { cacheKey },
            request,
            event
          }));
        }
        const { updatedURLs, notUpdatedURLs } = installReportPlugin;
        if (true) {
          printInstallDetails(updatedURLs, notUpdatedURLs);
        }
        return { updatedURLs, notUpdatedURLs };
      });
    }
    /**
     * Deletes assets that are no longer present in the current precache manifest.
     * Call this method from the service worker activate event.
     *
     * Note: this method calls `event.waitUntil()` for you, so you do not need
     * to call it yourself in your event handlers.
     *
     * @param {ExtendableEvent} event
     * @return {Promise<workbox-precaching.CleanupResult>}
     */
    activate(event) {
      return waitUntil(event, async () => {
        const cache = await self.caches.open(this.strategy.cacheName);
        const currentlyCachedRequests = await cache.keys();
        const expectedCacheKeys = new Set(this._urlsToCacheKeys.values());
        const deletedURLs = [];
        for (const request of currentlyCachedRequests) {
          if (!expectedCacheKeys.has(request.url)) {
            await cache.delete(request);
            deletedURLs.push(request.url);
          }
        }
        if (true) {
          printCleanupDetails(deletedURLs);
        }
        return { deletedURLs };
      });
    }
    /**
     * Returns a mapping of a precached URL to the corresponding cache key, taking
     * into account the revision information for the URL.
     *
     * @return {Map<string, string>} A URL to cache key mapping.
     */
    getURLsToCacheKeys() {
      return this._urlsToCacheKeys;
    }
    /**
     * Returns a list of all the URLs that have been precached by the current
     * service worker.
     *
     * @return {Array<string>} The precached URLs.
     */
    getCachedURLs() {
      return [...this._urlsToCacheKeys.keys()];
    }
    /**
     * Returns the cache key used for storing a given URL. If that URL is
     * unversioned, like `/index.html', then the cache key will be the original
     * URL with a search parameter appended to it.
     *
     * @param {string} url A URL whose cache key you want to look up.
     * @return {string} The versioned URL that corresponds to a cache key
     * for the original URL, or undefined if that URL isn't precached.
     */
    getCacheKeyForURL(url) {
      const urlObject = new URL(url, location.href);
      return this._urlsToCacheKeys.get(urlObject.href);
    }
    /**
     * @param {string} url A cache key whose SRI you want to look up.
     * @return {string} The subresource integrity associated with the cache key,
     * or undefined if it's not set.
     */
    getIntegrityForCacheKey(cacheKey) {
      return this._cacheKeysToIntegrities.get(cacheKey);
    }
    /**
     * This acts as a drop-in replacement for
     * [`cache.match()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
     * with the following differences:
     *
     * - It knows what the name of the precache is, and only checks in that cache.
     * - It allows you to pass in an "original" URL without versioning parameters,
     * and it will automatically look up the correct cache key for the currently
     * active revision of that URL.
     *
     * E.g., `matchPrecache('index.html')` will find the correct precached
     * response for the currently active service worker, even if the actual cache
     * key is `'/index.html?__WB_REVISION__=1234abcd'`.
     *
     * @param {string|Request} request The key (without revisioning parameters)
     * to look up in the precache.
     * @return {Promise<Response|undefined>}
     */
    async matchPrecache(request) {
      const url = request instanceof Request ? request.url : request;
      const cacheKey = this.getCacheKeyForURL(url);
      if (cacheKey) {
        const cache = await self.caches.open(this.strategy.cacheName);
        return cache.match(cacheKey);
      }
      return void 0;
    }
    /**
     * Returns a function that looks up `url` in the precache (taking into
     * account revision information), and returns the corresponding `Response`.
     *
     * @param {string} url The precached URL which will be used to lookup the
     * `Response`.
     * @return {workbox-routing~handlerCallback}
     */
    createHandlerBoundToURL(url) {
      const cacheKey = this.getCacheKeyForURL(url);
      if (!cacheKey) {
        throw new WorkboxError("non-precached-url", { url });
      }
      return (options) => {
        options.request = new Request(url);
        options.params = Object.assign({ cacheKey }, options.params);
        return this.strategy.handle(options);
      };
    }
  };

  // node_modules/workbox-precaching/utils/getOrCreatePrecacheController.js
  var precacheController;
  var getOrCreatePrecacheController = () => {
    if (!precacheController) {
      precacheController = new PrecacheController();
    }
    return precacheController;
  };

  // node_modules/workbox-routing/_version.js
  try {
    self["workbox:routing:7.0.0"] && _();
  } catch (e) {
  }

  // node_modules/workbox-routing/utils/constants.js
  var defaultMethod = "GET";
  var validMethods = [
    "DELETE",
    "GET",
    "HEAD",
    "PATCH",
    "POST",
    "PUT"
  ];

  // node_modules/workbox-routing/utils/normalizeHandler.js
  var normalizeHandler = (handler) => {
    if (handler && typeof handler === "object") {
      if (true) {
        finalAssertExports.hasMethod(handler, "handle", {
          moduleName: "workbox-routing",
          className: "Route",
          funcName: "constructor",
          paramName: "handler"
        });
      }
      return handler;
    } else {
      if (true) {
        finalAssertExports.isType(handler, "function", {
          moduleName: "workbox-routing",
          className: "Route",
          funcName: "constructor",
          paramName: "handler"
        });
      }
      return { handle: handler };
    }
  };

  // node_modules/workbox-routing/Route.js
  var Route = class {
    /**
     * Constructor for Route class.
     *
     * @param {workbox-routing~matchCallback} match
     * A callback function that determines whether the route matches a given
     * `fetch` event by returning a non-falsy value.
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resolving to a Response.
     * @param {string} [method='GET'] The HTTP method to match the Route
     * against.
     */
    constructor(match, handler, method = defaultMethod) {
      if (true) {
        finalAssertExports.isType(match, "function", {
          moduleName: "workbox-routing",
          className: "Route",
          funcName: "constructor",
          paramName: "match"
        });
        if (method) {
          finalAssertExports.isOneOf(method, validMethods, { paramName: "method" });
        }
      }
      this.handler = normalizeHandler(handler);
      this.match = match;
      this.method = method;
    }
    /**
     *
     * @param {workbox-routing-handlerCallback} handler A callback
     * function that returns a Promise resolving to a Response
     */
    setCatchHandler(handler) {
      this.catchHandler = normalizeHandler(handler);
    }
  };

  // node_modules/workbox-routing/RegExpRoute.js
  var RegExpRoute = class extends Route {
    /**
     * If the regular expression contains
     * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
     * the captured values will be passed to the
     * {@link workbox-routing~handlerCallback} `params`
     * argument.
     *
     * @param {RegExp} regExp The regular expression to match against URLs.
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     * @param {string} [method='GET'] The HTTP method to match the Route
     * against.
     */
    constructor(regExp, handler, method) {
      if (true) {
        finalAssertExports.isInstance(regExp, RegExp, {
          moduleName: "workbox-routing",
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

  // node_modules/workbox-routing/Router.js
  var Router = class {
    /**
     * Initializes a new Router.
     */
    constructor() {
      this._routes = /* @__PURE__ */ new Map();
      this._defaultHandlerMap = /* @__PURE__ */ new Map();
    }
    /**
     * @return {Map<string, Array<workbox-routing.Route>>} routes A `Map` of HTTP
     * method name ('GET', etc.) to an array of all the corresponding `Route`
     * instances that are registered.
     */
    get routes() {
      return this._routes;
    }
    /**
     * Adds a fetch event listener to respond to events when a route matches
     * the event's request.
     */
    addFetchListener() {
      self.addEventListener("fetch", (event) => {
        const { request } = event;
        const responsePromise = this.handleRequest({ request, event });
        if (responsePromise) {
          event.respondWith(responsePromise);
        }
      });
    }
    /**
     * Adds a message event listener for URLs to cache from the window.
     * This is useful to cache resources loaded on the page prior to when the
     * service worker started controlling it.
     *
     * The format of the message data sent from the window should be as follows.
     * Where the `urlsToCache` array may consist of URL strings or an array of
     * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
     *
     * ```
     * {
     *   type: 'CACHE_URLS',
     *   payload: {
     *     urlsToCache: [
     *       './script1.js',
     *       './script2.js',
     *       ['./script3.js', {mode: 'no-cors'}],
     *     ],
     *   },
     * }
     * ```
     */
    addCacheListener() {
      self.addEventListener("message", (event) => {
        if (event.data && event.data.type === "CACHE_URLS") {
          const { payload } = event.data;
          if (true) {
            logger.debug(`Caching URLs from the window`, payload.urlsToCache);
          }
          const requestPromises = Promise.all(payload.urlsToCache.map((entry) => {
            if (typeof entry === "string") {
              entry = [entry];
            }
            const request = new Request(...entry);
            return this.handleRequest({ request, event });
          }));
          event.waitUntil(requestPromises);
          if (event.ports && event.ports[0]) {
            void requestPromises.then(() => event.ports[0].postMessage(true));
          }
        }
      });
    }
    /**
     * Apply the routing rules to a FetchEvent object to get a Response from an
     * appropriate Route's handler.
     *
     * @param {Object} options
     * @param {Request} options.request The request to handle.
     * @param {ExtendableEvent} options.event The event that triggered the
     *     request.
     * @return {Promise<Response>|undefined} A promise is returned if a
     *     registered route can handle the request. If there is no matching
     *     route and there's no `defaultHandler`, `undefined` is returned.
     */
    handleRequest({ request, event }) {
      if (true) {
        finalAssertExports.isInstance(request, Request, {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "handleRequest",
          paramName: "options.request"
        });
      }
      const url = new URL(request.url, location.href);
      if (!url.protocol.startsWith("http")) {
        if (true) {
          logger.debug(`Workbox Router only supports URLs that start with 'http'.`);
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
      let handler = route && route.handler;
      const debugMessages = [];
      if (true) {
        if (handler) {
          debugMessages.push([`Found a route to handle this request:`, route]);
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
        debugMessages.forEach((msg) => {
          if (Array.isArray(msg)) {
            logger.log(...msg);
          } else {
            logger.log(msg);
          }
        });
        logger.groupEnd();
      }
      let responsePromise;
      try {
        responsePromise = handler.handle({ url, request, event, params });
      } catch (err) {
        responsePromise = Promise.reject(err);
      }
      const catchHandler = route && route.catchHandler;
      if (responsePromise instanceof Promise && (this._catchHandler || catchHandler)) {
        responsePromise = responsePromise.catch(async (err) => {
          if (catchHandler) {
            if (true) {
              logger.groupCollapsed(`Error thrown when responding to:  ${getFriendlyURL(url)}. Falling back to route's Catch Handler.`);
              logger.error(`Error thrown by:`, route);
              logger.error(err);
              logger.groupEnd();
            }
            try {
              return await catchHandler.handle({ url, request, event, params });
            } catch (catchErr) {
              if (catchErr instanceof Error) {
                err = catchErr;
              }
            }
          }
          if (this._catchHandler) {
            if (true) {
              logger.groupCollapsed(`Error thrown when responding to:  ${getFriendlyURL(url)}. Falling back to global Catch Handler.`);
              logger.error(`Error thrown by:`, route);
              logger.error(err);
              logger.groupEnd();
            }
            return this._catchHandler.handle({ url, request, event });
          }
          throw err;
        });
      }
      return responsePromise;
    }
    /**
     * Checks a request and URL (and optionally an event) against the list of
     * registered routes, and if there's a match, returns the corresponding
     * route along with any params generated by the match.
     *
     * @param {Object} options
     * @param {URL} options.url
     * @param {boolean} options.sameOrigin The result of comparing `url.origin`
     *     against the current origin.
     * @param {Request} options.request The request to match.
     * @param {Event} options.event The corresponding event.
     * @return {Object} An object with `route` and `params` properties.
     *     They are populated if a matching route was found or `undefined`
     *     otherwise.
     */
    findMatchingRoute({ url, sameOrigin, request, event }) {
      const routes = this._routes.get(request.method) || [];
      for (const route of routes) {
        let params;
        const matchResult = route.match({ url, sameOrigin, request, event });
        if (matchResult) {
          if (true) {
            if (matchResult instanceof Promise) {
              logger.warn(`While routing ${getFriendlyURL(url)}, an async matchCallback function was used. Please convert the following route to use a synchronous matchCallback function:`, route);
            }
          }
          params = matchResult;
          if (Array.isArray(params) && params.length === 0) {
            params = void 0;
          } else if (matchResult.constructor === Object && // eslint-disable-line
          Object.keys(matchResult).length === 0) {
            params = void 0;
          } else if (typeof matchResult === "boolean") {
            params = void 0;
          }
          return { route, params };
        }
      }
      return {};
    }
    /**
     * Define a default `handler` that's called when no routes explicitly
     * match the incoming request.
     *
     * Each HTTP method ('GET', 'POST', etc.) gets its own default handler.
     *
     * Without a default handler, unmatched requests will go against the
     * network as if there were no service worker present.
     *
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     * @param {string} [method='GET'] The HTTP method to associate with this
     * default handler. Each method has its own default.
     */
    setDefaultHandler(handler, method = defaultMethod) {
      this._defaultHandlerMap.set(method, normalizeHandler(handler));
    }
    /**
     * If a Route throws an error while handling a request, this `handler`
     * will be called and given a chance to provide a response.
     *
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     */
    setCatchHandler(handler) {
      this._catchHandler = normalizeHandler(handler);
    }
    /**
     * Registers a route with the router.
     *
     * @param {workbox-routing.Route} route The route to register.
     */
    registerRoute(route) {
      if (true) {
        finalAssertExports.isType(route, "object", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route"
        });
        finalAssertExports.hasMethod(route, "match", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route"
        });
        finalAssertExports.isType(route.handler, "object", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route"
        });
        finalAssertExports.hasMethod(route.handler, "handle", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route.handler"
        });
        finalAssertExports.isType(route.method, "string", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route.method"
        });
      }
      if (!this._routes.has(route.method)) {
        this._routes.set(route.method, []);
      }
      this._routes.get(route.method).push(route);
    }
    /**
     * Unregisters a route with the router.
     *
     * @param {workbox-routing.Route} route The route to unregister.
     */
    unregisterRoute(route) {
      if (!this._routes.has(route.method)) {
        throw new WorkboxError("unregister-route-but-not-found-with-method", {
          method: route.method
        });
      }
      const routeIndex = this._routes.get(route.method).indexOf(route);
      if (routeIndex > -1) {
        this._routes.get(route.method).splice(routeIndex, 1);
      } else {
        throw new WorkboxError("unregister-route-route-not-registered");
      }
    }
  };

  // node_modules/workbox-routing/utils/getOrCreateDefaultRouter.js
  var defaultRouter;
  var getOrCreateDefaultRouter = () => {
    if (!defaultRouter) {
      defaultRouter = new Router();
      defaultRouter.addFetchListener();
      defaultRouter.addCacheListener();
    }
    return defaultRouter;
  };

  // node_modules/workbox-routing/registerRoute.js
  function registerRoute(capture, handler, method) {
    let route;
    if (typeof capture === "string") {
      const captureUrl = new URL(capture, location.href);
      if (true) {
        if (!(capture.startsWith("/") || capture.startsWith("http"))) {
          throw new WorkboxError("invalid-string", {
            moduleName: "workbox-routing",
            funcName: "registerRoute",
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
      route = new Route(matchCallback, handler, method);
    } else if (capture instanceof RegExp) {
      route = new RegExpRoute(capture, handler, method);
    } else if (typeof capture === "function") {
      route = new Route(capture, handler, method);
    } else if (capture instanceof Route) {
      route = capture;
    } else {
      throw new WorkboxError("unsupported-route-type", {
        moduleName: "workbox-routing",
        funcName: "registerRoute",
        paramName: "capture"
      });
    }
    const defaultRouter2 = getOrCreateDefaultRouter();
    defaultRouter2.registerRoute(route);
    return route;
  }

  // node_modules/workbox-precaching/utils/removeIgnoredSearchParams.js
  function removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching = []) {
    for (const paramName of [...urlObject.searchParams.keys()]) {
      if (ignoreURLParametersMatching.some((regExp) => regExp.test(paramName))) {
        urlObject.searchParams.delete(paramName);
      }
    }
    return urlObject;
  }

  // node_modules/workbox-precaching/utils/generateURLVariations.js
  function* generateURLVariations(url, { ignoreURLParametersMatching = [/^utm_/, /^fbclid$/], directoryIndex = "index.html", cleanURLs = true, urlManipulation } = {}) {
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
      const additionalURLs = urlManipulation({ url: urlObject });
      for (const urlToAttempt of additionalURLs) {
        yield urlToAttempt.href;
      }
    }
  }

  // node_modules/workbox-precaching/PrecacheRoute.js
  var PrecacheRoute = class extends Route {
    /**
     * @param {PrecacheController} precacheController A `PrecacheController`
     * instance used to both match requests and respond to fetch events.
     * @param {Object} [options] Options to control how requests are matched
     * against the list of precached URLs.
     * @param {string} [options.directoryIndex=index.html] The `directoryIndex` will
     * check cache entries for a URLs ending with '/' to see if there is a hit when
     * appending the `directoryIndex` value.
     * @param {Array<RegExp>} [options.ignoreURLParametersMatching=[/^utm_/, /^fbclid$/]] An
     * array of regex's to remove search params when looking for a cache match.
     * @param {boolean} [options.cleanURLs=true] The `cleanURLs` option will
     * check the cache for the URL with a `.html` added to the end of the end.
     * @param {workbox-precaching~urlManipulation} [options.urlManipulation]
     * This is a function that should take a URL and return an array of
     * alternative URLs that should be checked for precache matches.
     */
    constructor(precacheController2, options) {
      const match = ({ request }) => {
        const urlsToCacheKeys = precacheController2.getURLsToCacheKeys();
        for (const possibleURL of generateURLVariations(request.url, options)) {
          const cacheKey = urlsToCacheKeys.get(possibleURL);
          if (cacheKey) {
            const integrity = precacheController2.getIntegrityForCacheKey(cacheKey);
            return { cacheKey, integrity };
          }
        }
        if (true) {
          logger.debug(`Precaching did not find a match for ` + getFriendlyURL(request.url));
        }
        return;
      };
      super(match, precacheController2.strategy);
    }
  };

  // node_modules/workbox-precaching/addRoute.js
  function addRoute(options) {
    const precacheController2 = getOrCreatePrecacheController();
    const precacheRoute = new PrecacheRoute(precacheController2, options);
    registerRoute(precacheRoute);
  }

  // node_modules/workbox-precaching/precache.js
  function precache(entries) {
    const precacheController2 = getOrCreatePrecacheController();
    precacheController2.precache(entries);
  }

  // node_modules/workbox-precaching/precacheAndRoute.js
  function precacheAndRoute(entries, options) {
    precache(entries);
    addRoute(options);
  }

  // sw.ts
  precacheAndRoute([{"revision":"4c6ba06c780f30258ada0d40c95cb7bb","url":"assets/circle scape icon white.png"},{"revision":"f3415cba73386c18bfb7ea65ead026a7","url":"assets/circle scape icon.png"},{"revision":"f2b076105e9c4e7ab690e54cb6e1d4d2","url":"assets/colour scape icon white.png"},{"revision":"c62d8209850c4c3949bcbb0e1a603e37","url":"assets/colour scape icon.png"},{"revision":"f054ec75aa7ea938990c7c32679d5d71","url":"assets/dot scape icon white.png"},{"revision":"c6989d75aead0b08941a2d5b49dc5573","url":"assets/dot scape icon.png"},{"revision":"25291b487e58da405137c819a2cf3678","url":"assets/enterFS.png"},{"revision":"816a0fbee1a02f11203eb0691668bacb","url":"assets/exitFS.png"},{"revision":"57057b4fad85cc9c51770098b0262474","url":"assets/line scape icon white.png"},{"revision":"14268225c423ce4db185138c787f4b8b","url":"assets/line scape icon.png"},{"revision":"21f21a8feb5b0fd033e23929c39d3971","url":"assets/link scape icon white.png"},{"revision":"16976ff40f21fda53651145c8c2510ca","url":"assets/link scape icon.png"},{"revision":"3ab84b9a3a0d19740d2eecb1d2e810cb","url":"assets/mindart.png"},{"revision":"86db5261d4bcd01d53f7e5b3844a2858","url":"assets/rotation scape icon white.png"},{"revision":"1fe28d50ddf396c4739e055798ff0391","url":"assets/rotation scape icon.png"},{"revision":"799bb289c8659c8c06f02752cd5a9885","url":"assets/symmetry scape icon white.png"},{"revision":"49d46dc55d0af1a63c8ada6b8ecc55fa","url":"assets/symmetry scape icon.png"},{"revision":"9750999a2f0a96dd2567d234c6222d7b","url":"assets/touch scape icon white.png"},{"revision":"ce9df15b0200e92aaa5b3a0d53bf72d3","url":"assets/touch scape icon.png"},{"revision":"c082bb6fc662ddafb185aa6c5bffcb6e","url":"BrushLibrary_bitmap/assets/audio_01.mp3"},{"revision":"5ca5a55d0fb0258d6cfc4e5c653e437c","url":"BrushLibrary_bitmap/assets/audio.mp3"},{"revision":"b5ed933057eaf1919dd79d81248cdbce","url":"BrushLibrary_bitmap/assets/AvenirNextLTPro-Regular.otf"},{"revision":"5fbde3b1431c4d47b40bdd92828c2329","url":"BrushLibrary_bitmap/assets/brushes/brush-1.png"},{"revision":"3105e3df5f4dfabc38722cd7884ddeec","url":"BrushLibrary_bitmap/assets/brushes/brush-10.png"},{"revision":"d5839f30392562b29805411da5e0deaa","url":"BrushLibrary_bitmap/assets/brushes/brush-11.png"},{"revision":"464c3df2c179584cc700e3ebb8849d0d","url":"BrushLibrary_bitmap/assets/brushes/brush-12.png"},{"revision":"537f8c45b364d611086f8cc92abf6e20","url":"BrushLibrary_bitmap/assets/brushes/brush-13.png"},{"revision":"5b338f9159492fbd30f62da19837dd0b","url":"BrushLibrary_bitmap/assets/brushes/brush-14.png"},{"revision":"1464657f7747b4232d1ceed22127a8c8","url":"BrushLibrary_bitmap/assets/brushes/brush-15.png"},{"revision":"85698816de94ba4f6cc58d57dd47ade0","url":"BrushLibrary_bitmap/assets/brushes/brush-16.png"},{"revision":"7dfe81b7d105063f4da5290af48bca58","url":"BrushLibrary_bitmap/assets/brushes/brush-17.png"},{"revision":"76f1371fc13885d4c7f9134b2c38ab9a","url":"BrushLibrary_bitmap/assets/brushes/brush-18.png"},{"revision":"a62181b082ef84e23e90912181d813d0","url":"BrushLibrary_bitmap/assets/brushes/brush-19.png"},{"revision":"87a4bbdbd6e690d17d0255805ad2c2bc","url":"BrushLibrary_bitmap/assets/brushes/brush-2.png"},{"revision":"a58a34feceeed5ea5b2fda3348c48ceb","url":"BrushLibrary_bitmap/assets/brushes/brush-20.png"},{"revision":"5287439ddaac2b2b0e951b5cc867063a","url":"BrushLibrary_bitmap/assets/brushes/brush-21.png"},{"revision":"386b2c6febefccfcfaccd230f492e200","url":"BrushLibrary_bitmap/assets/brushes/brush-22.png"},{"revision":"8652cc9f625d958a3fe038b6ea38b507","url":"BrushLibrary_bitmap/assets/brushes/brush-23.png"},{"revision":"5a528481f8201f42f882afd98303ad2c","url":"BrushLibrary_bitmap/assets/brushes/brush-24.png"},{"revision":"062b6de888b5adb862c19c6c4ea7f3fc","url":"BrushLibrary_bitmap/assets/brushes/brush-25.png"},{"revision":"3d6e6acb14315b3cfba2d66e36378636","url":"BrushLibrary_bitmap/assets/brushes/brush-26.png"},{"revision":"4581c991c96628de5f545633125dc569","url":"BrushLibrary_bitmap/assets/brushes/brush-27.png"},{"revision":"3f8f5eb1ea1ef8479c4aa37add1166d8","url":"BrushLibrary_bitmap/assets/brushes/brush-28.png"},{"revision":"58690c1dbaf5559d8580ec8661defb37","url":"BrushLibrary_bitmap/assets/brushes/brush-29.png"},{"revision":"4ada72f100cba18ad57166c771e9f60a","url":"BrushLibrary_bitmap/assets/brushes/brush-3.png"},{"revision":"f5af84fd329f497bc94f6a349c7352cd","url":"BrushLibrary_bitmap/assets/brushes/brush-30.png"},{"revision":"9922278e9bf8345e894806526cacfb73","url":"BrushLibrary_bitmap/assets/brushes/brush-31.png"},{"revision":"a6e66c9efecae0482ceed849e5d3df61","url":"BrushLibrary_bitmap/assets/brushes/brush-32.png"},{"revision":"38af4d958b102b6164c6c4d01850b746","url":"BrushLibrary_bitmap/assets/brushes/brush-33.png"},{"revision":"1ce5cf96eefc23b63a38604ea7259e9a","url":"BrushLibrary_bitmap/assets/brushes/brush-34.png"},{"revision":"df5de3946c1c3c73130a85fd29d4125c","url":"BrushLibrary_bitmap/assets/brushes/brush-35.png"},{"revision":"6d574579daddbebc4cacdf15bd329845","url":"BrushLibrary_bitmap/assets/brushes/brush-36.png"},{"revision":"05cc6f6b92e642bdeff06c10af099f61","url":"BrushLibrary_bitmap/assets/brushes/brush-37.png"},{"revision":"9e60f53e7427eea1239f8fad087764f9","url":"BrushLibrary_bitmap/assets/brushes/brush-38.png"},{"revision":"4cd8c23e6898c2492ecf041d2fd8f8a0","url":"BrushLibrary_bitmap/assets/brushes/brush-39.png"},{"revision":"bb94550a026778c900f0b12b795e5621","url":"BrushLibrary_bitmap/assets/brushes/brush-4.png"},{"revision":"7259e03a65dd20f9c48c383d0e5455ad","url":"BrushLibrary_bitmap/assets/brushes/brush-40.png"},{"revision":"e2ba7d279cf61bb9eeef98c7de732a7d","url":"BrushLibrary_bitmap/assets/brushes/brush-41.png"},{"revision":"7d244ca29266ae20671a8e4ae2827c6b","url":"BrushLibrary_bitmap/assets/brushes/brush-42.png"},{"revision":"e7d6caca271a978cbbaf84b076b3f66f","url":"BrushLibrary_bitmap/assets/brushes/brush-43.png"},{"revision":"7dd87dd0fd418da3419f61628df58c85","url":"BrushLibrary_bitmap/assets/brushes/brush-44.png"},{"revision":"6b70f7ab534b1bb30640ad882143e71f","url":"BrushLibrary_bitmap/assets/brushes/brush-45.png"},{"revision":"e955f113d072f898e43a6ff91e8bb2e4","url":"BrushLibrary_bitmap/assets/brushes/brush-46.png"},{"revision":"16d39649d226753fb2700465193a8329","url":"BrushLibrary_bitmap/assets/brushes/brush-47.png"},{"revision":"6696a70b3954c5e1d321d14149aaf5ae","url":"BrushLibrary_bitmap/assets/brushes/brush-48.png"},{"revision":"f930fc942f78a7526f74efc3bc37ee7a","url":"BrushLibrary_bitmap/assets/brushes/brush-49.png"},{"revision":"071f323484527a32e8318f1cdcbbe216","url":"BrushLibrary_bitmap/assets/brushes/brush-5.png"},{"revision":"7a24a6ab9a1ad83dc1edfa0f095d4c32","url":"BrushLibrary_bitmap/assets/brushes/brush-50.png"},{"revision":"8999c4e8be508a66f9c23ce09005048b","url":"BrushLibrary_bitmap/assets/brushes/brush-51.png"},{"revision":"7cea3c55e4e959789fcf7c1bc0302700","url":"BrushLibrary_bitmap/assets/brushes/brush-52.png"},{"revision":"4026a449492d0811c59fbf1595e56e7f","url":"BrushLibrary_bitmap/assets/brushes/brush-53.png"},{"revision":"1e5ab093270b938f64193e2c6def1b03","url":"BrushLibrary_bitmap/assets/brushes/brush-6.png"},{"revision":"a563a35353aa498ba8b0ba9596548cc7","url":"BrushLibrary_bitmap/assets/brushes/brush-7.png"},{"revision":"1cf61f6436087193f3e9a16f485815b6","url":"BrushLibrary_bitmap/assets/brushes/brush-8.png"},{"revision":"f8add31d0216dd31ff1df6a10c85d0da","url":"BrushLibrary_bitmap/assets/brushes/brush-9.png"},{"revision":"a99ad0ce4c840adca5e791dc153bfaed","url":"BrushLibrary_bitmap/assets/click.mp3"},{"revision":"629f40d356dab87da2e6a0b2033832a3","url":"BrushLibrary_bitmap/assets/enterFS.png"},{"revision":"816a0fbee1a02f11203eb0691668bacb","url":"BrushLibrary_bitmap/assets/exitFS.png"},{"revision":"62cb61cf3a99d34e966864985e39011e","url":"BrushLibrary_bitmap/assets/gui1.png"},{"revision":"35d591d4606974dec27f48f5996e03c9","url":"BrushLibrary_bitmap/assets/gui2.png"},{"revision":"6cf8be77d27e43685cc1bb8006d9c75e","url":"BrushLibrary_bitmap/assets/gui3.png"},{"revision":"0e98098c9c65aea7ad6821cdded6305d","url":"BrushLibrary_bitmap/assets/gui4.png"},{"revision":"6c1d08a8b4148c89f4d9a1a5a551bdd4","url":"BrushLibrary_bitmap/assets/gui5.png"},{"revision":"034dea6cb78a4e92a5ed9c48f20ecd9d","url":"BrushLibrary_bitmap/assets/icon1.png"},{"revision":"c545d057d52a6040fc00ad70067f75c8","url":"BrushLibrary_bitmap/assets/icon2.png"},{"revision":"0ec2d81d8bd8b753e3805d46cb908f18","url":"BrushLibrary_bitmap/assets/icon3.png"},{"revision":"4b154c0b96400c2b2db6079839ce5404","url":"BrushLibrary_bitmap/assets/icon4.png"},{"revision":"f220586ae7a4934c8789721343729165","url":"BrushLibrary_bitmap/assets/icons.png"},{"revision":"479ceab5c3bd92d838c09ba062ff0e92","url":"BrushLibrary_bitmap/assets/logo.jpg"},{"revision":"d6b717ead673676f82dc7d94e970a0a1","url":"BrushLibrary_bitmap/assets/p5.dom.js"},{"revision":"b4653a5fac810b436dd985c5569116fa","url":"BrushLibrary_bitmap/assets/p5.min.js"},{"revision":"4f359439e3e395abb3dce902ac99d31b","url":"BrushLibrary_bitmap/assets/p5.sound.min.js"},{"revision":"05aa686f87c499a07767e41bd1244cab","url":"BrushLibrary_bitmap/assets/rake2b.png"},{"revision":"c076202165d82658cc6a8d42702cbc7d","url":"BrushLibrary_bitmap/assets/sand_01.jpg"},{"revision":"c257acc9b5b5983206bab1218d1e5092","url":"BrushLibrary_bitmap/assets/selector.png"},{"revision":"367bfb9caa0761b55bc417344cef0f7b","url":"BrushLibrary_bitmap/assets/texture.png"},{"revision":"0970c116fb0f4dfa4bfa2403f4be1825","url":"BrushLibrary_bitmap/assets/wpebble1.png"},{"revision":"77ba911557562a0017e765f2135a6bf8","url":"BrushLibrary_bitmap/assets/wpebble2.png"},{"revision":"e8a57e108a028577b54ef1124aabd65f","url":"BrushLibrary_bitmap/assets/wpebble3.png"},{"revision":"9c1a6b530fb4526e6bf72bf3315b4e23","url":"BrushLibrary_bitmap/assets/wpebble4.png"},{"revision":"86e58a6d58ed0b9a504eabb333c6543e","url":"BrushLibrary_bitmap/assets/wpebble5.png"},{"revision":"d853c5326ac7466d97789032edd41d2b","url":"BrushLibrary_bitmap/assets/wpebble6.png"},{"revision":"57904be4fa34cb3c896927359eccdba4","url":"BrushLibrary_bitmap/assets/wpebble7.png"},{"revision":"81b4e76899a72d03098a4746beedf84f","url":"BrushLibrary_bitmap/assets/wpebble8.png"},{"revision":"b5ed933057eaf1919dd79d81248cdbce","url":"BrushLibrary_bitmap/AvenirNextLTPro-Regular.otf"},{"revision":"f56e475eee75f675198aedbd6ee00233","url":"BrushLibrary_bitmap/generativeBrushes.js"},{"revision":"402c13e99ba210589c21b606da0be066","url":"BrushLibrary_bitmap/index.html"},{"revision":"220afd743d9e9643852e31a135a9f3ae","url":"BrushLibrary_bitmap/jquery-3.4.1.min.js"},{"revision":"c082bb6fc662ddafb185aa6c5bffcb6e","url":"BrushLibrary/assets/audio_01.mp3"},{"revision":"5ca5a55d0fb0258d6cfc4e5c653e437c","url":"BrushLibrary/assets/audio.mp3"},{"revision":"b5ed933057eaf1919dd79d81248cdbce","url":"BrushLibrary/assets/AvenirNextLTPro-Regular.otf"},{"revision":"a99ad0ce4c840adca5e791dc153bfaed","url":"BrushLibrary/assets/click.mp3"},{"revision":"629f40d356dab87da2e6a0b2033832a3","url":"BrushLibrary/assets/enterFS.png"},{"revision":"816a0fbee1a02f11203eb0691668bacb","url":"BrushLibrary/assets/exitFS.png"},{"revision":"62cb61cf3a99d34e966864985e39011e","url":"BrushLibrary/assets/gui1.png"},{"revision":"35d591d4606974dec27f48f5996e03c9","url":"BrushLibrary/assets/gui2.png"},{"revision":"6cf8be77d27e43685cc1bb8006d9c75e","url":"BrushLibrary/assets/gui3.png"},{"revision":"0e98098c9c65aea7ad6821cdded6305d","url":"BrushLibrary/assets/gui4.png"},{"revision":"6c1d08a8b4148c89f4d9a1a5a551bdd4","url":"BrushLibrary/assets/gui5.png"},{"revision":"034dea6cb78a4e92a5ed9c48f20ecd9d","url":"BrushLibrary/assets/icon1.png"},{"revision":"c545d057d52a6040fc00ad70067f75c8","url":"BrushLibrary/assets/icon2.png"},{"revision":"0ec2d81d8bd8b753e3805d46cb908f18","url":"BrushLibrary/assets/icon3.png"},{"revision":"4b154c0b96400c2b2db6079839ce5404","url":"BrushLibrary/assets/icon4.png"},{"revision":"f220586ae7a4934c8789721343729165","url":"BrushLibrary/assets/icons.png"},{"revision":"479ceab5c3bd92d838c09ba062ff0e92","url":"BrushLibrary/assets/logo.jpg"},{"revision":"d6b717ead673676f82dc7d94e970a0a1","url":"BrushLibrary/assets/p5.dom.js"},{"revision":"b4653a5fac810b436dd985c5569116fa","url":"BrushLibrary/assets/p5.min.js"},{"revision":"4f359439e3e395abb3dce902ac99d31b","url":"BrushLibrary/assets/p5.sound.min.js"},{"revision":"05aa686f87c499a07767e41bd1244cab","url":"BrushLibrary/assets/rake2b.png"},{"revision":"c076202165d82658cc6a8d42702cbc7d","url":"BrushLibrary/assets/sand_01.jpg"},{"revision":"c257acc9b5b5983206bab1218d1e5092","url":"BrushLibrary/assets/selector.png"},{"revision":"367bfb9caa0761b55bc417344cef0f7b","url":"BrushLibrary/assets/texture.png"},{"revision":"0970c116fb0f4dfa4bfa2403f4be1825","url":"BrushLibrary/assets/wpebble1.png"},{"revision":"77ba911557562a0017e765f2135a6bf8","url":"BrushLibrary/assets/wpebble2.png"},{"revision":"e8a57e108a028577b54ef1124aabd65f","url":"BrushLibrary/assets/wpebble3.png"},{"revision":"9c1a6b530fb4526e6bf72bf3315b4e23","url":"BrushLibrary/assets/wpebble4.png"},{"revision":"86e58a6d58ed0b9a504eabb333c6543e","url":"BrushLibrary/assets/wpebble5.png"},{"revision":"d853c5326ac7466d97789032edd41d2b","url":"BrushLibrary/assets/wpebble6.png"},{"revision":"57904be4fa34cb3c896927359eccdba4","url":"BrushLibrary/assets/wpebble7.png"},{"revision":"81b4e76899a72d03098a4746beedf84f","url":"BrushLibrary/assets/wpebble8.png"},{"revision":"b5ed933057eaf1919dd79d81248cdbce","url":"BrushLibrary/AvenirNextLTPro-Regular.otf"},{"revision":"f0a3fb64e8b510ba9f361c10aea8a631","url":"BrushLibrary/generativeBrushes.js"},{"revision":"402c13e99ba210589c21b606da0be066","url":"BrushLibrary/index.html"},{"revision":"220afd743d9e9643852e31a135a9f3ae","url":"BrushLibrary/jquery-3.4.1.min.js"},{"revision":"b5ed933057eaf1919dd79d81248cdbce","url":"css/Fonts/AvenirNextLTPro-Regular.otf"},{"revision":"c495654869785bc3df60216616814ad1","url":"css/Fonts/font-awesome/css/font-awesome.css"},{"revision":"269550530cc127b6aa5a35925a7de6ce","url":"css/Fonts/font-awesome/css/font-awesome.min.css"},{"revision":"674f50d287a8c48dc19ba404d20fe713","url":"css/Fonts/font-awesome/fonts/fontawesome-webfont.eot"},{"revision":"912ec66d7572ff821749319396470bde","url":"css/Fonts/font-awesome/fonts/fontawesome-webfont.svg"},{"revision":"b06871f281fee6b241d60582ae9369b9","url":"css/Fonts/font-awesome/fonts/fontawesome-webfont.ttf"},{"revision":"fee66e712a8a08eef5805a46892932ad","url":"css/Fonts/font-awesome/fonts/fontawesome-webfont.woff"},{"revision":"af7ae505a9eed503f8b8e6982036873e","url":"css/Fonts/font-awesome/fonts/fontawesome-webfont.woff2"},{"revision":"0d2717cd5d853e5c765ca032dfd41a4d","url":"css/Fonts/font-awesome/fonts/FontAwesome.otf"},{"revision":"7700306c465140ec7be92c45bc91ed99","url":"css/styles.css"},{"revision":"c088bda4c81ad7e8d4405b8934e05fca","url":"docs/help1.jpg"},{"revision":"1816abe666e35511201bf0ac0557ae92","url":"docs/help2.jpg"},{"revision":"4c4d1087545ba1b5e4e38748f9ce5ffb","url":"functions.js"},{"revision":"186952a1a10fafe3b56d74bc3c2a8b35","url":"index.html"},{"revision":"220afd743d9e9643852e31a135a9f3ae","url":"libraries/jquery-3.4.1.min.js"},{"revision":"d6b717ead673676f82dc7d94e970a0a1","url":"libraries/p5.dom.js"},{"revision":"a5ca0a9914bfd119f888e8783b17dd8a","url":"libraries/p5.js"},{"revision":"cfea55f7292c3f3fadb945d065780f13","url":"libraries/p5.min.js"},{"revision":"3ae93031f104b76692680ae149e38325","url":"libraries/p5.sound.js"},{"revision":"4f359439e3e395abb3dce902ac99d31b","url":"libraries/p5.sound.min.js"},{"revision":"cfea55f7292c3f3fadb945d065780f13","url":"libraries/p50.min.js"},{"revision":"8ecfb76844ad782fcd2af8e19a2c992d","url":"libraries/p50.sound.min.js"},{"revision":"9c9f2d18196bdd40bd4e6017cf13ee21","url":"manifest.json"},{"revision":"3ae911537784324f873d4acb20ef7e78","url":"mindArt_Logo.png"},{"revision":"c076202165d82658cc6a8d42702cbc7d","url":"MinDArT-1-Touchscape/assets/sand_01.jpg"},{"revision":"8877a7262049bea5b3370cc2cdd9421d","url":"MinDArT-1-Touchscape/assets/touchbrush1.2.png"},{"revision":"49b11c25344acc3ae52ad1743d716f3a","url":"MinDArT-1-Touchscape/assets/touchbrush1.png"},{"revision":"3420776247ce895d4bac81f47b6a869a","url":"MinDArT-1-Touchscape/assets/touchbrush2.2.png"},{"revision":"6e3d364d3c892aab81c65435c06fc62a","url":"MinDArT-1-Touchscape/assets/touchbrush2.png"},{"revision":"6c7d51be54a407e8be7cf8f5987bd88e","url":"MinDArT-1-Touchscape/assets/touchbrush3.2.png"},{"revision":"ea5e63eecab7b8d14376c68cfce2301b","url":"MinDArT-1-Touchscape/assets/touchbrush3.png"},{"revision":"0970c116fb0f4dfa4bfa2403f4be1825","url":"MinDArT-1-Touchscape/assets/wpebble1.png"},{"revision":"77ba911557562a0017e765f2135a6bf8","url":"MinDArT-1-Touchscape/assets/wpebble2.png"},{"revision":"e8a57e108a028577b54ef1124aabd65f","url":"MinDArT-1-Touchscape/assets/wpebble3.png"},{"revision":"9c1a6b530fb4526e6bf72bf3315b4e23","url":"MinDArT-1-Touchscape/assets/wpebble4.png"},{"revision":"86e58a6d58ed0b9a504eabb333c6543e","url":"MinDArT-1-Touchscape/assets/wpebble5.png"},{"revision":"d853c5326ac7466d97789032edd41d2b","url":"MinDArT-1-Touchscape/assets/wpebble6.png"},{"revision":"57904be4fa34cb3c896927359eccdba4","url":"MinDArT-1-Touchscape/assets/wpebble7.png"},{"revision":"81b4e76899a72d03098a4746beedf84f","url":"MinDArT-1-Touchscape/assets/wpebble8.png"},{"revision":"39a6bb7711cdf6901c4969cf82eedc49","url":"MinDArT-1-Touchscape/index.html"},{"revision":"be05af56926f0945b4625bd26794ec59","url":"MinDArT-1-Touchscape/interface-touch.js"},{"revision":"e8fb5027e5f9bf8310d0098b8fcfa893","url":"MinDArT-1-Touchscape/stylesheet.css"},{"revision":"6dc180092d94bb0387276ee04e4757e5","url":"MinDArT-1-Touchscape/touchscape.js"},{"revision":"0547172b9196037c3edbb61f6645f641","url":"MinDArT-2-Linescape/index.html"},{"revision":"63877166b18b31deb24754892a4fbe81","url":"MinDArT-2-Linescape/interface-line.js"},{"revision":"d22948eb77ab01ad22891e61696e2ec7","url":"MinDArT-2-Linescape/sketch.properties"},{"revision":"b292737031a4c5e5717fcc33301ce91b","url":"MinDArT-2-Linescape/stylesheet.css"},{"revision":"0684c9fb2630e7ec6b78c72d3ba262cc","url":"MinDArT-2-Linescape/verticalLines.js"},{"revision":"921edeaa6ac65d3edb01b94cf142e5a0","url":"MinDArT-3-Circlescape/circlescape.js"},{"revision":"10b7e978af6f83c795c0881a5c09e773","url":"MinDArT-3-Circlescape/index.html"},{"revision":"86916c1b122a7205447252ce1ce67bef","url":"MinDArT-3-Circlescape/interface-v2.js"},{"revision":"accb873300a48456911e150c5239766b","url":"MinDArT-3-Circlescape/interface.js"},{"revision":"d22948eb77ab01ad22891e61696e2ec7","url":"MinDArT-3-Circlescape/sketch.properties"},{"revision":"76a1459821bc8c96ec0f50e89941e47b","url":"MinDArT-3-Circlescape/stylesheet.css"},{"revision":"2a3318383b6bc25d01213daf06c1fc0a","url":"MinDArT-4-Colourscape/assets/br-1.png"},{"revision":"c9b56fd79f505e81c16d9f684176eeb9","url":"MinDArT-4-Colourscape/assets/br-10.png"},{"revision":"5e761c9766e4e0afe91530c85aabce6f","url":"MinDArT-4-Colourscape/assets/br-11.png"},{"revision":"3eea811ba93ed5f359b349a02ac0d86a","url":"MinDArT-4-Colourscape/assets/br-12.png"},{"revision":"b997cdd7ff1ac674912ed2fabeef0f2e","url":"MinDArT-4-Colourscape/assets/br-13.png"},{"revision":"37148d357675622900cdcd775c6a9fb2","url":"MinDArT-4-Colourscape/assets/br-14.png"},{"revision":"c3d2c16b108aba17b0032c4335643530","url":"MinDArT-4-Colourscape/assets/br-15.png"},{"revision":"35bfef52a07bc307592edb502fc82df7","url":"MinDArT-4-Colourscape/assets/br-16.png"},{"revision":"256fe0a97ff5cc51409e5c81c78bcf9b","url":"MinDArT-4-Colourscape/assets/br-17.png"},{"revision":"0ed8a9ed7f954ad756b99d4475c21166","url":"MinDArT-4-Colourscape/assets/br-18.png"},{"revision":"63793d8a1830e07f2d0baba80892217b","url":"MinDArT-4-Colourscape/assets/br-19.png"},{"revision":"22944b7753075240c0bf9ce6dadfe5a3","url":"MinDArT-4-Colourscape/assets/br-2.png"},{"revision":"f77287b4ee3f7f5673ee460caa8dc47a","url":"MinDArT-4-Colourscape/assets/br-20.png"},{"revision":"c8622e37649a2df5c79482bff8951bdf","url":"MinDArT-4-Colourscape/assets/br-21.png"},{"revision":"fda05a6aa6e0381d0e55bd17fb626bee","url":"MinDArT-4-Colourscape/assets/br-22.png"},{"revision":"1d4be59ac48387b77b25812089ce5b47","url":"MinDArT-4-Colourscape/assets/br-23.png"},{"revision":"0993aafe1be95ad78780f6d57063c9e4","url":"MinDArT-4-Colourscape/assets/br-24.png"},{"revision":"55ac171060a5d2199ef9f7f42ce7d651","url":"MinDArT-4-Colourscape/assets/br-25.png"},{"revision":"3b4638ae905838dbfe0d638ab34f9fe3","url":"MinDArT-4-Colourscape/assets/br-3.png"},{"revision":"db64be08777b14d7f3cc9721c4242612","url":"MinDArT-4-Colourscape/assets/br-4.png"},{"revision":"a21dba9e7c52e494928cba091ceb791e","url":"MinDArT-4-Colourscape/assets/br-5.png"},{"revision":"18cc274ed67787484e4636b68a1fd4fc","url":"MinDArT-4-Colourscape/assets/br-6.png"},{"revision":"30f97af0f2f73a835d4e1f70dd45cb68","url":"MinDArT-4-Colourscape/assets/br-7.png"},{"revision":"2e82a4f4cdacbc2ea3669bf5dd002273","url":"MinDArT-4-Colourscape/assets/br-8.png"},{"revision":"6a6d7fdb4ccc4bdd7a59df48cecf86ad","url":"MinDArT-4-Colourscape/assets/br-9.png"},{"revision":"114c7723f59bc6e05896d6c002950ede","url":"MinDArT-4-Colourscape/assets/brush2.png"},{"revision":"24a6a3715a99d4e717ceec5b5ce82905","url":"MinDArT-4-Colourscape/assets/Cloud0.png"},{"revision":"eb75f8ad2b382614e8aa71c04a219d79","url":"MinDArT-4-Colourscape/assets/Cloud1.png"},{"revision":"ea2ee5acb86085c121f12bfd4704afdb","url":"MinDArT-4-Colourscape/assets/Cloud10.png"},{"revision":"658982b3a6f2c64c4e59ee807dd8de03","url":"MinDArT-4-Colourscape/assets/Cloud11.png"},{"revision":"9565d0f948d5bd4c3efec54d290c95c9","url":"MinDArT-4-Colourscape/assets/Cloud12.png"},{"revision":"b38d64ad98872997e438bd51dd268610","url":"MinDArT-4-Colourscape/assets/Cloud13.png"},{"revision":"fac86c9678afd4f3c1a467f3642b41f4","url":"MinDArT-4-Colourscape/assets/Cloud14.png"},{"revision":"684a1485673960a310ba5971949f617e","url":"MinDArT-4-Colourscape/assets/Cloud15.png"},{"revision":"0552822e41f7f11786184d26a393a140","url":"MinDArT-4-Colourscape/assets/Cloud16.png"},{"revision":"cedbaccebe5e4026d96f5c58d1ffd66d","url":"MinDArT-4-Colourscape/assets/Cloud2.png"},{"revision":"146ba136e841ed51f90a6ae90b6036c1","url":"MinDArT-4-Colourscape/assets/Cloud3.png"},{"revision":"fc0ed069062f2c0eb99465e5fcfedf70","url":"MinDArT-4-Colourscape/assets/Cloud4.png"},{"revision":"33a9ddd8726c8e1a0226fe20b48ee6b4","url":"MinDArT-4-Colourscape/assets/Cloud5.png"},{"revision":"3ffca957b0a52f7f96a1e4f2dfdf57e5","url":"MinDArT-4-Colourscape/assets/Cloud6.png"},{"revision":"dc3864dbcb0b8c6cdc031b90cb5af605","url":"MinDArT-4-Colourscape/assets/Cloud7.png"},{"revision":"1df1d6a5e867b3ba42e8c47ef2f078fa","url":"MinDArT-4-Colourscape/assets/Cloud8.png"},{"revision":"31d67caa390ff56deeb9a3c45e2a906d","url":"MinDArT-4-Colourscape/assets/Cloud9.png"},{"revision":"c277672a2668e347fabcd5cf63b28c05","url":"MinDArT-4-Colourscape/assets/fr/icon1.0.png"},{"revision":"b759861579d7ccb4ea716098d8888a2e","url":"MinDArT-4-Colourscape/assets/fr/icon1.1.png"},{"revision":"8d0f28f1be9c6222b946a34fcc8212f5","url":"MinDArT-4-Colourscape/assets/fr/icon1.2.png"},{"revision":"dd5f20f666090307c5c9817e873dddd7","url":"MinDArT-4-Colourscape/assets/fr/icon2.0.png"},{"revision":"5b2655a06e2e2f911f5904436d96db1f","url":"MinDArT-4-Colourscape/assets/fr/icon2.1.png"},{"revision":"bf539067139db9af15e5b26629d6734b","url":"MinDArT-4-Colourscape/assets/fr/icon3.0.png"},{"revision":"d686d138bbf42cd0b2e9045668facf63","url":"MinDArT-4-Colourscape/assets/fr/icon3.1.png"},{"revision":"5076f7ffa2bf24e75ea472fbcc49f6e6","url":"MinDArT-4-Colourscape/assets/fr/icon3.2.png"},{"revision":"0e98098c9c65aea7ad6821cdded6305d","url":"MinDArT-4-Colourscape/assets/gui1.png"},{"revision":"6c1d08a8b4148c89f4d9a1a5a551bdd4","url":"MinDArT-4-Colourscape/assets/gui2.png"},{"revision":"214bf054f01cb669f4205c4f25c7754b","url":"MinDArT-4-Colourscape/assets/icon_unsplit.psd"},{"revision":"d03f2fa09d7cc7e8845170ab4e14c14c","url":"MinDArT-4-Colourscape/assets/icon1.0.png"},{"revision":"24900ffb249887f9af38ca1d6faf479f","url":"MinDArT-4-Colourscape/assets/icon1.1.png"},{"revision":"ccecc601ec074d45ff7e2a9da9556f37","url":"MinDArT-4-Colourscape/assets/icon1.2.png"},{"revision":"e3ed145553ce9140d6aee3546db4a944","url":"MinDArT-4-Colourscape/assets/icon2.0.png"},{"revision":"3b5b2b905e9179bcf7390d69de015843","url":"MinDArT-4-Colourscape/assets/icon2.1.png"},{"revision":"7bcd209ddaed7a5c658b8456b901505b","url":"MinDArT-4-Colourscape/assets/icon3.0.png"},{"revision":"f531f1a2793beb9f488a36e05919d7d1","url":"MinDArT-4-Colourscape/assets/icon3.1.png"},{"revision":"858719cb2b2bab142b863189c64545fa","url":"MinDArT-4-Colourscape/assets/icon3.2.png"},{"revision":"4d13d29d6610a87be534154c232bf1d0","url":"MinDArT-4-Colourscape/assets/logo.jpg"},{"revision":"516a641ffb4775870bbc58a5f0019a1f","url":"MinDArT-4-Colourscape/assets/paper.jpg"},{"revision":"85b73f5a2bddd15540469d52fd5a0c98","url":"MinDArT-4-Colourscape/assets/water-color-textures-25.png"},{"revision":"52e4354574a077fa4f38946c828884c6","url":"MinDArT-4-Colourscape/colourscape.js"},{"revision":"bed74b3254b0bf1a5d6a50ce5d01fbd1","url":"MinDArT-4-Colourscape/eraseBrush.js"},{"revision":"865b7c02fc180c73a8943270ff0537ad","url":"MinDArT-4-Colourscape/index.html"},{"revision":"047d5f78575230b50ad5d07688431200","url":"MinDArT-4-Colourscape/interface-v2.js"},{"revision":"c1f639bbfc03cb775aed20642b3c4aa2","url":"MinDArT-4-Colourscape/stylesheet.css"},{"revision":"556f0dc55019cc7f99fd18ff69a823c5","url":"MinDArT-5-Dotscape/assets/logo.jpg"},{"revision":"b4bc289ee79da4f103e4d2050bad84e4","url":"MinDArT-5-Dotscape/assets/paper.jpg"},{"revision":"485e767c84acbbaab8ce01c1823aee66","url":"MinDArT-5-Dotscape/dotscape.js"},{"revision":"c7ef6fe043b15b063b2f180549a632ea","url":"MinDArT-5-Dotscape/index.html"},{"revision":"06ed7ceee455abcc2b71e70895c41935","url":"MinDArT-5-Dotscape/interface-v2.js"},{"revision":"361b39e05b7b0d11689fe4d9d5a262fd","url":"MinDArT-5-Dotscape/stylesheet.css"},{"revision":"150e951729eb8d72dfde90631794d76b","url":"MinDArT-6-Linkscape/assets/icon1.0.png"},{"revision":"9a82aa40ec74294c5103f8502b69ccdb","url":"MinDArT-6-Linkscape/assets/icon1.1.png"},{"revision":"35da9c9f47a0cfb8e3d94f5b40cf2cc8","url":"MinDArT-6-Linkscape/assets/icon2.0.png"},{"revision":"bad792d34ca4b24057039080dd28adcd","url":"MinDArT-6-Linkscape/assets/icon2.1.png"},{"revision":"6ac99f586cc0c18ca0cef2a84753f3a6","url":"MinDArT-6-Linkscape/assets/logo.jpg"},{"revision":"c442ea73a514b65cc2115748c6f30a81","url":"MinDArT-6-Linkscape/assets/pin.png"},{"revision":"367bfb9caa0761b55bc417344cef0f7b","url":"MinDArT-6-Linkscape/assets/texture.png"},{"revision":"7dc41032287d3f36942be01c42c53685","url":"MinDArT-6-Linkscape/assets/Untitled-1.png"},{"revision":"22655f0d3e749fd448b64174f21dee21","url":"MinDArT-6-Linkscape/index.html"},{"revision":"a0a186da69286da14389e96039cc4c29","url":"MinDArT-6-Linkscape/interface-v2.js"},{"revision":"e6a5723d36ab4ed34e279d918aeefb1d","url":"MinDArT-6-Linkscape/linkscape.js"},{"revision":"c588c080dc77a2d33ed8b642fd874bc7","url":"MinDArT-6-Linkscape/slideshow.js"},{"revision":"6cb4b4bcb08e38f5a4282c42bd7b6455","url":"MinDArT-6-Linkscape/stylesheet.css"},{"revision":"274f51e612d94faaa58dcaa962cc0fc3","url":"MinDArT-7-Rotationscape/assets/colSelected.png"},{"revision":"24ad164a5ce8ed8628835a02db70766a","url":"MinDArT-7-Rotationscape/assets/eraseAlpha1.png"},{"revision":"f28de026cb8ac9fe13ecb6c4b8771913","url":"MinDArT-7-Rotationscape/assets/eraseAlpha2.png"},{"revision":"c1670643a9dcd2f50e529e8dd30a8588","url":"MinDArT-7-Rotationscape/assets/eraseAlpha3.png"},{"revision":"580a0287e4946a0662deaa32963ba390","url":"MinDArT-7-Rotationscape/assets/eraseOff.png"},{"revision":"87d1b7d8426f6aaf7b2b5c5fcd96f94f","url":"MinDArT-7-Rotationscape/assets/eraseOn.png"},{"revision":"c24708a232a67a8d1616a8c9c65f38ab","url":"MinDArT-7-Rotationscape/assets/gui1.jpg"},{"revision":"73822f92d77e93be75cbd7f06f686c1d","url":"MinDArT-7-Rotationscape/assets/gui2.jpg"},{"revision":"c756be9967e295cb4e65ae5159d7ed85","url":"MinDArT-7-Rotationscape/assets/gui3.jpg"},{"revision":"76da64d590dfe15da0703978b64a0930","url":"MinDArT-7-Rotationscape/assets/gui4.jpg"},{"revision":"1bd14c5ebffd45762b68af39842b3b1e","url":"MinDArT-7-Rotationscape/assets/gui5.jpg"},{"revision":"4171ccb58c7a28e32f817f96e0f17658","url":"MinDArT-7-Rotationscape/assets/gui6.jpg"},{"revision":"19b879fa3e6cc994625412d26ca9a084","url":"MinDArT-7-Rotationscape/assets/icon 1.2.png"},{"revision":"b147a34c1c82203f754d5e0cc2e11faa","url":"MinDArT-7-Rotationscape/assets/icon 1.3.png"},{"revision":"1bafd438a8649e8e1b07a05573ef8cb5","url":"MinDArT-7-Rotationscape/assets/logo.jpg"},{"revision":"20f73e0d25cfcff806cbec608c77a95e","url":"MinDArT-7-Rotationscape/assets/paper.jpg"},{"revision":"77975629aad4c3b8d1ebdf8e4a87ddbb","url":"MinDArT-7-Rotationscape/index.html"},{"revision":"496f6868d0414c17968b7eaf881433b7","url":"MinDArT-7-Rotationscape/rotation-interface.js"},{"revision":"9abaf2adcbb1038ecdcfd4f9b48531d6","url":"MinDArT-7-Rotationscape/rotationscape.js"},{"revision":"d54e0de1c96b75092a1d51820f450dc7","url":"MinDArT-7-Rotationscape/stylesheet.css"},{"revision":"274f51e612d94faaa58dcaa962cc0fc3","url":"MinDArT-8-Symmetryscape/assets/colSelected.png"},{"revision":"24ad164a5ce8ed8628835a02db70766a","url":"MinDArT-8-Symmetryscape/assets/eraseAlpha1.png"},{"revision":"f28de026cb8ac9fe13ecb6c4b8771913","url":"MinDArT-8-Symmetryscape/assets/eraseAlpha2.png"},{"revision":"c1670643a9dcd2f50e529e8dd30a8588","url":"MinDArT-8-Symmetryscape/assets/eraseAlpha3.png"},{"revision":"ae0435d1d363aa0297b5a16a2b07b2cc","url":"MinDArT-8-Symmetryscape/assets/eraseOff.png"},{"revision":"f6484ef4e7a7fc51af4bfd7ac672a77c","url":"MinDArT-8-Symmetryscape/assets/eraseOn.png"},{"revision":"c24708a232a67a8d1616a8c9c65f38ab","url":"MinDArT-8-Symmetryscape/assets/gui1.jpg"},{"revision":"73822f92d77e93be75cbd7f06f686c1d","url":"MinDArT-8-Symmetryscape/assets/gui2.jpg"},{"revision":"c756be9967e295cb4e65ae5159d7ed85","url":"MinDArT-8-Symmetryscape/assets/gui3.jpg"},{"revision":"76da64d590dfe15da0703978b64a0930","url":"MinDArT-8-Symmetryscape/assets/gui4.jpg"},{"revision":"1bd14c5ebffd45762b68af39842b3b1e","url":"MinDArT-8-Symmetryscape/assets/gui5.jpg"},{"revision":"4171ccb58c7a28e32f817f96e0f17658","url":"MinDArT-8-Symmetryscape/assets/gui6.jpg"},{"revision":"19b879fa3e6cc994625412d26ca9a084","url":"MinDArT-8-Symmetryscape/assets/icon 1.2.png"},{"revision":"b147a34c1c82203f754d5e0cc2e11faa","url":"MinDArT-8-Symmetryscape/assets/icon 1.3.png"},{"revision":"7481ffd8df8242c64a63e4427e40b1a8","url":"MinDArT-8-Symmetryscape/assets/logo.jpg"},{"revision":"6c32aca71ea204d9c61214f7a3137338","url":"MinDArT-8-Symmetryscape/assets/paper.jpg"},{"revision":"3cc6479536e716e93ee355b27c8cbbf1","url":"MinDArT-8-Symmetryscape/index.html"},{"revision":"ec2b06913ab41c7bff1334b87ba97e90","url":"MinDArT-8-Symmetryscape/interface-symmetry.js"},{"revision":"84fe11fe06cc5d7617229a470b932706","url":"MinDArT-8-Symmetryscape/stylesheet.css"},{"revision":"282a614407ae558e3d6f925283bed51a","url":"MinDArT-8-Symmetryscape/symmetryscape.js"},{"revision":"17637cb087e99d740f0f40a846c57502","url":"package-lock.json"},{"revision":"1935ae8cca38997caa46acaa7674116e","url":"package.json"},{"revision":"419eb715790cb2e33fdb8825d1ccad02","url":"README.md"},{"revision":"a99ad0ce4c840adca5e791dc153bfaed","url":"sound/click.mp3"},{"revision":"766b20c05a6936006a00abee40844fa2","url":"sound/Scene1_Touch.mp3"},{"revision":"9b164be4ac9db35ae088cc3be24bb8ef","url":"sound/Scene2_Line.mp3"},{"revision":"bfb2433515478419c68077e4cbf1d591","url":"sound/Scene3_Circle.mp3"},{"revision":"f9f1e8a5d95853e346eac1cde6ef0692","url":"sound/Scene4_Colour.mp3"},{"revision":"2344d233e26915dcfe5a24a64c0c534c","url":"sound/Scene5_Dot.mp3"},{"revision":"5178b4099b8aaabd2aa0f3def09b73a0","url":"sound/Scene6_Link.mp3"},{"revision":"371ae84443ce6ba0f78be670ce0b0008","url":"sound/Scene7_Rotation.mp3"},{"revision":"d73aa0cf2c69164633bb2fd30b38d6ea","url":"sound/Scene8_Symmetry .mp3"},{"revision":"0c2979d20dcf88d7691ace0fe1165323","url":"sw.ts"},{"revision":"738bb12d3d2ad43a3b2d37603071d163","url":"workbox-config.js"}]);
})();
