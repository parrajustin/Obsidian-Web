"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
      if (decorator = decorators[i4])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result) __defProp(target, key, result);
    return result;
  };

  // node_modules/.pnpm/@firebase+util@1.9.6/node_modules/@firebase/util/dist/index.esm2017.js
  var stringToByteArray$1 = function(str) {
    const out = [];
    let p3 = 0;
    for (let i4 = 0; i4 < str.length; i4++) {
      let c4 = str.charCodeAt(i4);
      if (c4 < 128) {
        out[p3++] = c4;
      } else if (c4 < 2048) {
        out[p3++] = c4 >> 6 | 192;
        out[p3++] = c4 & 63 | 128;
      } else if ((c4 & 64512) === 55296 && i4 + 1 < str.length && (str.charCodeAt(i4 + 1) & 64512) === 56320) {
        c4 = 65536 + ((c4 & 1023) << 10) + (str.charCodeAt(++i4) & 1023);
        out[p3++] = c4 >> 18 | 240;
        out[p3++] = c4 >> 12 & 63 | 128;
        out[p3++] = c4 >> 6 & 63 | 128;
        out[p3++] = c4 & 63 | 128;
      } else {
        out[p3++] = c4 >> 12 | 224;
        out[p3++] = c4 >> 6 & 63 | 128;
        out[p3++] = c4 & 63 | 128;
      }
    }
    return out;
  };
  var byteArrayToString = function(bytes) {
    const out = [];
    let pos = 0, c4 = 0;
    while (pos < bytes.length) {
      const c1 = bytes[pos++];
      if (c1 < 128) {
        out[c4++] = String.fromCharCode(c1);
      } else if (c1 > 191 && c1 < 224) {
        const c22 = bytes[pos++];
        out[c4++] = String.fromCharCode((c1 & 31) << 6 | c22 & 63);
      } else if (c1 > 239 && c1 < 365) {
        const c22 = bytes[pos++];
        const c32 = bytes[pos++];
        const c42 = bytes[pos++];
        const u3 = ((c1 & 7) << 18 | (c22 & 63) << 12 | (c32 & 63) << 6 | c42 & 63) - 65536;
        out[c4++] = String.fromCharCode(55296 + (u3 >> 10));
        out[c4++] = String.fromCharCode(56320 + (u3 & 1023));
      } else {
        const c22 = bytes[pos++];
        const c32 = bytes[pos++];
        out[c4++] = String.fromCharCode((c1 & 15) << 12 | (c22 & 63) << 6 | c32 & 63);
      }
    }
    return out.join("");
  };
  var base64 = {
    /**
     * Maps bytes to characters.
     */
    byteToCharMap_: null,
    /**
     * Maps characters to bytes.
     */
    charToByteMap_: null,
    /**
     * Maps bytes to websafe characters.
     * @private
     */
    byteToCharMapWebSafe_: null,
    /**
     * Maps websafe characters to bytes.
     * @private
     */
    charToByteMapWebSafe_: null,
    /**
     * Our default alphabet, shared between
     * ENCODED_VALS and ENCODED_VALS_WEBSAFE
     */
    ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    /**
     * Our default alphabet. Value 64 (=) is special; it means "nothing."
     */
    get ENCODED_VALS() {
      return this.ENCODED_VALS_BASE + "+/=";
    },
    /**
     * Our websafe alphabet.
     */
    get ENCODED_VALS_WEBSAFE() {
      return this.ENCODED_VALS_BASE + "-_.";
    },
    /**
     * Whether this browser supports the atob and btoa functions. This extension
     * started at Mozilla but is now implemented by many browsers. We use the
     * ASSUME_* variables to avoid pulling in the full useragent detection library
     * but still allowing the standard per-browser compilations.
     *
     */
    HAS_NATIVE_SUPPORT: typeof atob === "function",
    /**
     * Base64-encode an array of bytes.
     *
     * @param input An array of bytes (numbers with
     *     value in [0, 255]) to encode.
     * @param webSafe Boolean indicating we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
    encodeByteArray(input, webSafe) {
      if (!Array.isArray(input)) {
        throw Error("encodeByteArray takes an array as a parameter");
      }
      this.init_();
      const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
      const output = [];
      for (let i4 = 0; i4 < input.length; i4 += 3) {
        const byte1 = input[i4];
        const haveByte2 = i4 + 1 < input.length;
        const byte2 = haveByte2 ? input[i4 + 1] : 0;
        const haveByte3 = i4 + 2 < input.length;
        const byte3 = haveByte3 ? input[i4 + 2] : 0;
        const outByte1 = byte1 >> 2;
        const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
        let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
        let outByte4 = byte3 & 63;
        if (!haveByte3) {
          outByte4 = 64;
          if (!haveByte2) {
            outByte3 = 64;
          }
        }
        output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
      }
      return output.join("");
    },
    /**
     * Base64-encode a string.
     *
     * @param input A string to encode.
     * @param webSafe If true, we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
    encodeString(input, webSafe) {
      if (this.HAS_NATIVE_SUPPORT && !webSafe) {
        return btoa(input);
      }
      return this.encodeByteArray(stringToByteArray$1(input), webSafe);
    },
    /**
     * Base64-decode a string.
     *
     * @param input to decode.
     * @param webSafe True if we should use the
     *     alternative alphabet.
     * @return string representing the decoded value.
     */
    decodeString(input, webSafe) {
      if (this.HAS_NATIVE_SUPPORT && !webSafe) {
        return atob(input);
      }
      return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
    },
    /**
     * Base64-decode a string.
     *
     * In base-64 decoding, groups of four characters are converted into three
     * bytes.  If the encoder did not apply padding, the input length may not
     * be a multiple of 4.
     *
     * In this case, the last group will have fewer than 4 characters, and
     * padding will be inferred.  If the group has one or two characters, it decodes
     * to one byte.  If the group has three characters, it decodes to two bytes.
     *
     * @param input Input to decode.
     * @param webSafe True if we should use the web-safe alphabet.
     * @return bytes representing the decoded value.
     */
    decodeStringToByteArray(input, webSafe) {
      this.init_();
      const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
      const output = [];
      for (let i4 = 0; i4 < input.length; ) {
        const byte1 = charToByteMap[input.charAt(i4++)];
        const haveByte2 = i4 < input.length;
        const byte2 = haveByte2 ? charToByteMap[input.charAt(i4)] : 0;
        ++i4;
        const haveByte3 = i4 < input.length;
        const byte3 = haveByte3 ? charToByteMap[input.charAt(i4)] : 64;
        ++i4;
        const haveByte4 = i4 < input.length;
        const byte4 = haveByte4 ? charToByteMap[input.charAt(i4)] : 64;
        ++i4;
        if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
          throw new DecodeBase64StringError();
        }
        const outByte1 = byte1 << 2 | byte2 >> 4;
        output.push(outByte1);
        if (byte3 !== 64) {
          const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
          output.push(outByte2);
          if (byte4 !== 64) {
            const outByte3 = byte3 << 6 & 192 | byte4;
            output.push(outByte3);
          }
        }
      }
      return output;
    },
    /**
     * Lazy static initialization function. Called before
     * accessing any of the static map variables.
     * @private
     */
    init_() {
      if (!this.byteToCharMap_) {
        this.byteToCharMap_ = {};
        this.charToByteMap_ = {};
        this.byteToCharMapWebSafe_ = {};
        this.charToByteMapWebSafe_ = {};
        for (let i4 = 0; i4 < this.ENCODED_VALS.length; i4++) {
          this.byteToCharMap_[i4] = this.ENCODED_VALS.charAt(i4);
          this.charToByteMap_[this.byteToCharMap_[i4]] = i4;
          this.byteToCharMapWebSafe_[i4] = this.ENCODED_VALS_WEBSAFE.charAt(i4);
          this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i4]] = i4;
          if (i4 >= this.ENCODED_VALS_BASE.length) {
            this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i4)] = i4;
            this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i4)] = i4;
          }
        }
      }
    }
  };
  var DecodeBase64StringError = class extends Error {
    constructor() {
      super(...arguments);
      this.name = "DecodeBase64StringError";
    }
  };
  var base64Encode = function(str) {
    const utf8Bytes = stringToByteArray$1(str);
    return base64.encodeByteArray(utf8Bytes, true);
  };
  var base64urlEncodeWithoutPadding = function(str) {
    return base64Encode(str).replace(/\./g, "");
  };
  var base64Decode = function(str) {
    try {
      return base64.decodeString(str, true);
    } catch (e5) {
      console.error("base64Decode failed: ", e5);
    }
    return null;
  };
  function getGlobal() {
    if (typeof self !== "undefined") {
      return self;
    }
    if (typeof window !== "undefined") {
      return window;
    }
    if (typeof global !== "undefined") {
      return global;
    }
    throw new Error("Unable to locate global object.");
  }
  var getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
  var getDefaultsFromEnvVariable = () => {
    if (typeof process === "undefined" || typeof process.env === "undefined") {
      return;
    }
    const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
    if (defaultsJsonString) {
      return JSON.parse(defaultsJsonString);
    }
  };
  var getDefaultsFromCookie = () => {
    if (typeof document === "undefined") {
      return;
    }
    let match;
    try {
      match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
    } catch (e5) {
      return;
    }
    const decoded = match && base64Decode(match[1]);
    return decoded && JSON.parse(decoded);
  };
  var getDefaults = () => {
    try {
      return getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
    } catch (e5) {
      console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e5}`);
      return;
    }
  };
  var getDefaultAppConfig = () => {
    var _a;
    return (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.config;
  };
  var Deferred = class {
    constructor() {
      this.reject = () => {
      };
      this.resolve = () => {
      };
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    }
    /**
     * Our API internals are not promiseified and cannot because our callback APIs have subtle expectations around
     * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
     * and returns a node-style callback which will resolve or reject the Deferred's promise.
     */
    wrapCallback(callback) {
      return (error, value) => {
        if (error) {
          this.reject(error);
        } else {
          this.resolve(value);
        }
        if (typeof callback === "function") {
          this.promise.catch(() => {
          });
          if (callback.length === 1) {
            callback(error);
          } else {
            callback(error, value);
          }
        }
      };
    }
  };
  function getUA() {
    if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") {
      return navigator["userAgent"];
    } else {
      return "";
    }
  }
  function isNode() {
    var _a;
    const forceEnvironment = (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.forceEnvironment;
    if (forceEnvironment === "node") {
      return true;
    } else if (forceEnvironment === "browser") {
      return false;
    }
    try {
      return Object.prototype.toString.call(global.process) === "[object process]";
    } catch (e5) {
      return false;
    }
  }
  function isSafari() {
    return !isNode() && !!navigator.userAgent && navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
  }
  function isIndexedDBAvailable() {
    try {
      return typeof indexedDB === "object";
    } catch (e5) {
      return false;
    }
  }
  function validateIndexedDBOpenable() {
    return new Promise((resolve, reject) => {
      try {
        let preExist = true;
        const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
        const request = self.indexedDB.open(DB_CHECK_NAME);
        request.onsuccess = () => {
          request.result.close();
          if (!preExist) {
            self.indexedDB.deleteDatabase(DB_CHECK_NAME);
          }
          resolve(true);
        };
        request.onupgradeneeded = () => {
          preExist = false;
        };
        request.onerror = () => {
          var _a;
          reject(((_a = request.error) === null || _a === void 0 ? void 0 : _a.message) || "");
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  var ERROR_NAME = "FirebaseError";
  var FirebaseError = class _FirebaseError extends Error {
    constructor(code, message, customData) {
      super(message);
      this.code = code;
      this.customData = customData;
      this.name = ERROR_NAME;
      Object.setPrototypeOf(this, _FirebaseError.prototype);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ErrorFactory.prototype.create);
      }
    }
  };
  var ErrorFactory = class {
    constructor(service, serviceName, errors) {
      this.service = service;
      this.serviceName = serviceName;
      this.errors = errors;
    }
    create(code, ...data) {
      const customData = data[0] || {};
      const fullCode = `${this.service}/${code}`;
      const template = this.errors[code];
      const message = template ? replaceTemplate(template, customData) : "Error";
      const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
      const error = new FirebaseError(fullCode, fullMessage, customData);
      return error;
    }
  };
  function replaceTemplate(template, data) {
    return template.replace(PATTERN, (_2, key) => {
      const value = data[key];
      return value != null ? String(value) : `<${key}?>`;
    });
  }
  var PATTERN = /\{\$([^}]+)}/g;
  function deepEqual(a3, b4) {
    if (a3 === b4) {
      return true;
    }
    const aKeys = Object.keys(a3);
    const bKeys = Object.keys(b4);
    for (const k3 of aKeys) {
      if (!bKeys.includes(k3)) {
        return false;
      }
      const aProp = a3[k3];
      const bProp = b4[k3];
      if (isObject(aProp) && isObject(bProp)) {
        if (!deepEqual(aProp, bProp)) {
          return false;
        }
      } else if (aProp !== bProp) {
        return false;
      }
    }
    for (const k3 of bKeys) {
      if (!aKeys.includes(k3)) {
        return false;
      }
    }
    return true;
  }
  function isObject(thing) {
    return thing !== null && typeof thing === "object";
  }
  var MAX_VALUE_MILLIS = 4 * 60 * 60 * 1e3;

  // node_modules/.pnpm/@firebase+component@0.6.7/node_modules/@firebase/component/dist/esm/index.esm2017.js
  var Component = class {
    /**
     *
     * @param name The public service name, e.g. app, auth, firestore, database
     * @param instanceFactory Service factory responsible for creating the public interface
     * @param type whether the service provided by the component is public or private
     */
    constructor(name3, instanceFactory, type) {
      this.name = name3;
      this.instanceFactory = instanceFactory;
      this.type = type;
      this.multipleInstances = false;
      this.serviceProps = {};
      this.instantiationMode = "LAZY";
      this.onInstanceCreated = null;
    }
    setInstantiationMode(mode) {
      this.instantiationMode = mode;
      return this;
    }
    setMultipleInstances(multipleInstances) {
      this.multipleInstances = multipleInstances;
      return this;
    }
    setServiceProps(props) {
      this.serviceProps = props;
      return this;
    }
    setInstanceCreatedCallback(callback) {
      this.onInstanceCreated = callback;
      return this;
    }
  };
  var DEFAULT_ENTRY_NAME = "[DEFAULT]";
  var Provider = class {
    constructor(name3, container) {
      this.name = name3;
      this.container = container;
      this.component = null;
      this.instances = /* @__PURE__ */ new Map();
      this.instancesDeferred = /* @__PURE__ */ new Map();
      this.instancesOptions = /* @__PURE__ */ new Map();
      this.onInitCallbacks = /* @__PURE__ */ new Map();
    }
    /**
     * @param identifier A provider can provide mulitple instances of a service
     * if this.component.multipleInstances is true.
     */
    get(identifier) {
      const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
      if (!this.instancesDeferred.has(normalizedIdentifier)) {
        const deferred = new Deferred();
        this.instancesDeferred.set(normalizedIdentifier, deferred);
        if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
          try {
            const instance = this.getOrInitializeService({
              instanceIdentifier: normalizedIdentifier
            });
            if (instance) {
              deferred.resolve(instance);
            }
          } catch (e5) {
          }
        }
      }
      return this.instancesDeferred.get(normalizedIdentifier).promise;
    }
    getImmediate(options) {
      var _a;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === void 0 ? void 0 : options.identifier);
      const optional = (_a = options === null || options === void 0 ? void 0 : options.optional) !== null && _a !== void 0 ? _a : false;
      if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
        try {
          return this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
        } catch (e5) {
          if (optional) {
            return null;
          } else {
            throw e5;
          }
        }
      } else {
        if (optional) {
          return null;
        } else {
          throw Error(`Service ${this.name} is not available`);
        }
      }
    }
    getComponent() {
      return this.component;
    }
    setComponent(component) {
      if (component.name !== this.name) {
        throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
      }
      if (this.component) {
        throw Error(`Component for ${this.name} has already been provided`);
      }
      this.component = component;
      if (!this.shouldAutoInitialize()) {
        return;
      }
      if (isComponentEager(component)) {
        try {
          this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
        } catch (e5) {
        }
      }
      for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
        const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
        try {
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
          instanceDeferred.resolve(instance);
        } catch (e5) {
        }
      }
    }
    clearInstance(identifier = DEFAULT_ENTRY_NAME) {
      this.instancesDeferred.delete(identifier);
      this.instancesOptions.delete(identifier);
      this.instances.delete(identifier);
    }
    // app.delete() will call this method on every provider to delete the services
    // TODO: should we mark the provider as deleted?
    async delete() {
      const services = Array.from(this.instances.values());
      await Promise.all([
        ...services.filter((service) => "INTERNAL" in service).map((service) => service.INTERNAL.delete()),
        ...services.filter((service) => "_delete" in service).map((service) => service._delete())
      ]);
    }
    isComponentSet() {
      return this.component != null;
    }
    isInitialized(identifier = DEFAULT_ENTRY_NAME) {
      return this.instances.has(identifier);
    }
    getOptions(identifier = DEFAULT_ENTRY_NAME) {
      return this.instancesOptions.get(identifier) || {};
    }
    initialize(opts = {}) {
      const { options = {} } = opts;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
      if (this.isInitialized(normalizedIdentifier)) {
        throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
      }
      if (!this.isComponentSet()) {
        throw Error(`Component ${this.name} has not been registered yet`);
      }
      const instance = this.getOrInitializeService({
        instanceIdentifier: normalizedIdentifier,
        options
      });
      for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
        const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
        if (normalizedIdentifier === normalizedDeferredIdentifier) {
          instanceDeferred.resolve(instance);
        }
      }
      return instance;
    }
    /**
     *
     * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
     * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
     *
     * @param identifier An optional instance identifier
     * @returns a function to unregister the callback
     */
    onInit(callback, identifier) {
      var _a;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
      const existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new Set();
      existingCallbacks.add(callback);
      this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
      const existingInstance = this.instances.get(normalizedIdentifier);
      if (existingInstance) {
        callback(existingInstance, normalizedIdentifier);
      }
      return () => {
        existingCallbacks.delete(callback);
      };
    }
    /**
     * Invoke onInit callbacks synchronously
     * @param instance the service instance`
     */
    invokeOnInitCallbacks(instance, identifier) {
      const callbacks = this.onInitCallbacks.get(identifier);
      if (!callbacks) {
        return;
      }
      for (const callback of callbacks) {
        try {
          callback(instance, identifier);
        } catch (_a) {
        }
      }
    }
    getOrInitializeService({ instanceIdentifier, options = {} }) {
      let instance = this.instances.get(instanceIdentifier);
      if (!instance && this.component) {
        instance = this.component.instanceFactory(this.container, {
          instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
          options
        });
        this.instances.set(instanceIdentifier, instance);
        this.instancesOptions.set(instanceIdentifier, options);
        this.invokeOnInitCallbacks(instance, instanceIdentifier);
        if (this.component.onInstanceCreated) {
          try {
            this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
          } catch (_a) {
          }
        }
      }
      return instance || null;
    }
    normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
      if (this.component) {
        return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
      } else {
        return identifier;
      }
    }
    shouldAutoInitialize() {
      return !!this.component && this.component.instantiationMode !== "EXPLICIT";
    }
  };
  function normalizeIdentifierForFactory(identifier) {
    return identifier === DEFAULT_ENTRY_NAME ? void 0 : identifier;
  }
  function isComponentEager(component) {
    return component.instantiationMode === "EAGER";
  }
  var ComponentContainer = class {
    constructor(name3) {
      this.name = name3;
      this.providers = /* @__PURE__ */ new Map();
    }
    /**
     *
     * @param component Component being added
     * @param overwrite When a component with the same name has already been registered,
     * if overwrite is true: overwrite the existing component with the new component and create a new
     * provider with the new component. It can be useful in tests where you want to use different mocks
     * for different tests.
     * if overwrite is false: throw an exception
     */
    addComponent(component) {
      const provider = this.getProvider(component.name);
      if (provider.isComponentSet()) {
        throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
      }
      provider.setComponent(component);
    }
    addOrOverwriteComponent(component) {
      const provider = this.getProvider(component.name);
      if (provider.isComponentSet()) {
        this.providers.delete(component.name);
      }
      this.addComponent(component);
    }
    /**
     * getProvider provides a type safe interface where it can only be called with a field name
     * present in NameServiceMapping interface.
     *
     * Firebase SDKs providing services should extend NameServiceMapping interface to register
     * themselves.
     */
    getProvider(name3) {
      if (this.providers.has(name3)) {
        return this.providers.get(name3);
      }
      const provider = new Provider(name3, this);
      this.providers.set(name3, provider);
      return provider;
    }
    getProviders() {
      return Array.from(this.providers.values());
    }
  };

  // node_modules/.pnpm/@firebase+logger@0.4.2/node_modules/@firebase/logger/dist/esm/index.esm2017.js
  var instances = [];
  var LogLevel;
  (function(LogLevel2) {
    LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
    LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
    LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
    LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
    LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
    LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
  })(LogLevel || (LogLevel = {}));
  var levelStringToEnum = {
    "debug": LogLevel.DEBUG,
    "verbose": LogLevel.VERBOSE,
    "info": LogLevel.INFO,
    "warn": LogLevel.WARN,
    "error": LogLevel.ERROR,
    "silent": LogLevel.SILENT
  };
  var defaultLogLevel = LogLevel.INFO;
  var ConsoleMethod = {
    [LogLevel.DEBUG]: "log",
    [LogLevel.VERBOSE]: "log",
    [LogLevel.INFO]: "info",
    [LogLevel.WARN]: "warn",
    [LogLevel.ERROR]: "error"
  };
  var defaultLogHandler = (instance, logType, ...args) => {
    if (logType < instance.logLevel) {
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const method = ConsoleMethod[logType];
    if (method) {
      console[method](`[${now}]  ${instance.name}:`, ...args);
    } else {
      throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
    }
  };
  var Logger = class {
    /**
     * Gives you an instance of a Logger to capture messages according to
     * Firebase's logging scheme.
     *
     * @param name The name that the logs will be associated with
     */
    constructor(name3) {
      this.name = name3;
      this._logLevel = defaultLogLevel;
      this._logHandler = defaultLogHandler;
      this._userLogHandler = null;
      instances.push(this);
    }
    get logLevel() {
      return this._logLevel;
    }
    set logLevel(val) {
      if (!(val in LogLevel)) {
        throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
      }
      this._logLevel = val;
    }
    // Workaround for setter/getter having to be the same type.
    setLogLevel(val) {
      this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
    }
    get logHandler() {
      return this._logHandler;
    }
    set logHandler(val) {
      if (typeof val !== "function") {
        throw new TypeError("Value assigned to `logHandler` must be a function");
      }
      this._logHandler = val;
    }
    get userLogHandler() {
      return this._userLogHandler;
    }
    set userLogHandler(val) {
      this._userLogHandler = val;
    }
    /**
     * The functions below are all based on the `console` interface
     */
    debug(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
      this._logHandler(this, LogLevel.DEBUG, ...args);
    }
    log(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
      this._logHandler(this, LogLevel.VERBOSE, ...args);
    }
    info(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
      this._logHandler(this, LogLevel.INFO, ...args);
    }
    warn(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
      this._logHandler(this, LogLevel.WARN, ...args);
    }
    error(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
      this._logHandler(this, LogLevel.ERROR, ...args);
    }
  };

  // node_modules/.pnpm/idb@7.1.1/node_modules/idb/build/wrap-idb-value.js
  var instanceOfAny = (object, constructors) => constructors.some((c4) => object instanceof c4);
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
  var cursorRequestMap = /* @__PURE__ */ new WeakMap();
  var transactionDoneMap = /* @__PURE__ */ new WeakMap();
  var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
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
    promise.then((value) => {
      if (value instanceof IDBCursor) {
        cursorRequestMap.set(value, request);
      }
    }).catch(() => {
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
        if (prop === "objectStoreNames") {
          return target.objectStoreNames || transactionStoreNamesMap.get(target);
        }
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
    if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
      return function(storeNames, ...args) {
        const tx = func.call(unwrap(this), storeNames, ...args);
        transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
        return wrap(tx);
      };
    }
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap(this), args);
        return wrap(cursorRequestMap.get(this));
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

  // node_modules/.pnpm/idb@7.1.1/node_modules/idb/build/index.js
  function openDB(name3, version3, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name3, version3);
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

  // node_modules/.pnpm/@firebase+app@0.10.5/node_modules/@firebase/app/dist/esm/index.esm2017.js
  var PlatformLoggerServiceImpl = class {
    constructor(container) {
      this.container = container;
    }
    // In initial implementation, this will be called by installations on
    // auth token refresh, and installations will send this string.
    getPlatformInfoString() {
      const providers = this.container.getProviders();
      return providers.map((provider) => {
        if (isVersionServiceProvider(provider)) {
          const service = provider.getImmediate();
          return `${service.library}/${service.version}`;
        } else {
          return null;
        }
      }).filter((logString) => logString).join(" ");
    }
  };
  function isVersionServiceProvider(provider) {
    const component = provider.getComponent();
    return (component === null || component === void 0 ? void 0 : component.type) === "VERSION";
  }
  var name$p = "@firebase/app";
  var version$1 = "0.10.5";
  var logger = new Logger("@firebase/app");
  var name$o = "@firebase/app-compat";
  var name$n = "@firebase/analytics-compat";
  var name$m = "@firebase/analytics";
  var name$l = "@firebase/app-check-compat";
  var name$k = "@firebase/app-check";
  var name$j = "@firebase/auth";
  var name$i = "@firebase/auth-compat";
  var name$h = "@firebase/database";
  var name$g = "@firebase/database-compat";
  var name$f = "@firebase/functions";
  var name$e = "@firebase/functions-compat";
  var name$d = "@firebase/installations";
  var name$c = "@firebase/installations-compat";
  var name$b = "@firebase/messaging";
  var name$a = "@firebase/messaging-compat";
  var name$9 = "@firebase/performance";
  var name$8 = "@firebase/performance-compat";
  var name$7 = "@firebase/remote-config";
  var name$6 = "@firebase/remote-config-compat";
  var name$5 = "@firebase/storage";
  var name$4 = "@firebase/storage-compat";
  var name$3 = "@firebase/firestore";
  var name$2 = "@firebase/vertexai-preview";
  var name$1 = "@firebase/firestore-compat";
  var name = "firebase";
  var version = "10.12.2";
  var DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
  var PLATFORM_LOG_STRING = {
    [name$p]: "fire-core",
    [name$o]: "fire-core-compat",
    [name$m]: "fire-analytics",
    [name$n]: "fire-analytics-compat",
    [name$k]: "fire-app-check",
    [name$l]: "fire-app-check-compat",
    [name$j]: "fire-auth",
    [name$i]: "fire-auth-compat",
    [name$h]: "fire-rtdb",
    [name$g]: "fire-rtdb-compat",
    [name$f]: "fire-fn",
    [name$e]: "fire-fn-compat",
    [name$d]: "fire-iid",
    [name$c]: "fire-iid-compat",
    [name$b]: "fire-fcm",
    [name$a]: "fire-fcm-compat",
    [name$9]: "fire-perf",
    [name$8]: "fire-perf-compat",
    [name$7]: "fire-rc",
    [name$6]: "fire-rc-compat",
    [name$5]: "fire-gcs",
    [name$4]: "fire-gcs-compat",
    [name$3]: "fire-fst",
    [name$1]: "fire-fst-compat",
    [name$2]: "fire-vertex",
    "fire-js": "fire-js",
    [name]: "fire-js-all"
  };
  var _apps = /* @__PURE__ */ new Map();
  var _serverApps = /* @__PURE__ */ new Map();
  var _components = /* @__PURE__ */ new Map();
  function _addComponent(app, component) {
    try {
      app.container.addComponent(component);
    } catch (e5) {
      logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app.name}`, e5);
    }
  }
  function _registerComponent(component) {
    const componentName = component.name;
    if (_components.has(componentName)) {
      logger.debug(`There were multiple attempts to register component ${componentName}.`);
      return false;
    }
    _components.set(componentName, component);
    for (const app of _apps.values()) {
      _addComponent(app, component);
    }
    for (const serverApp of _serverApps.values()) {
      _addComponent(serverApp, component);
    }
    return true;
  }
  function _getProvider(app, name3) {
    const heartbeatController = app.container.getProvider("heartbeat").getImmediate({ optional: true });
    if (heartbeatController) {
      void heartbeatController.triggerHeartbeat();
    }
    return app.container.getProvider(name3);
  }
  var ERRORS = {
    [
      "no-app"
      /* AppError.NO_APP */
    ]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
    [
      "bad-app-name"
      /* AppError.BAD_APP_NAME */
    ]: "Illegal App name: '{$appName}'",
    [
      "duplicate-app"
      /* AppError.DUPLICATE_APP */
    ]: "Firebase App named '{$appName}' already exists with different options or config",
    [
      "app-deleted"
      /* AppError.APP_DELETED */
    ]: "Firebase App named '{$appName}' already deleted",
    [
      "server-app-deleted"
      /* AppError.SERVER_APP_DELETED */
    ]: "Firebase Server App has been deleted",
    [
      "no-options"
      /* AppError.NO_OPTIONS */
    ]: "Need to provide options, when not being deployed to hosting via source.",
    [
      "invalid-app-argument"
      /* AppError.INVALID_APP_ARGUMENT */
    ]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
    [
      "invalid-log-argument"
      /* AppError.INVALID_LOG_ARGUMENT */
    ]: "First argument to `onLog` must be null or a function.",
    [
      "idb-open"
      /* AppError.IDB_OPEN */
    ]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "idb-get"
      /* AppError.IDB_GET */
    ]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "idb-set"
      /* AppError.IDB_WRITE */
    ]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "idb-delete"
      /* AppError.IDB_DELETE */
    ]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "finalization-registry-not-supported"
      /* AppError.FINALIZATION_REGISTRY_NOT_SUPPORTED */
    ]: "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
    [
      "invalid-server-app-environment"
      /* AppError.INVALID_SERVER_APP_ENVIRONMENT */
    ]: "FirebaseServerApp is not for use in browser environments."
  };
  var ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);
  var FirebaseAppImpl = class {
    constructor(options, config, container) {
      this._isDeleted = false;
      this._options = Object.assign({}, options);
      this._config = Object.assign({}, config);
      this._name = config.name;
      this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
      this._container = container;
      this.container.addComponent(new Component(
        "app",
        () => this,
        "PUBLIC"
        /* ComponentType.PUBLIC */
      ));
    }
    get automaticDataCollectionEnabled() {
      this.checkDestroyed();
      return this._automaticDataCollectionEnabled;
    }
    set automaticDataCollectionEnabled(val) {
      this.checkDestroyed();
      this._automaticDataCollectionEnabled = val;
    }
    get name() {
      this.checkDestroyed();
      return this._name;
    }
    get options() {
      this.checkDestroyed();
      return this._options;
    }
    get config() {
      this.checkDestroyed();
      return this._config;
    }
    get container() {
      return this._container;
    }
    get isDeleted() {
      return this._isDeleted;
    }
    set isDeleted(val) {
      this._isDeleted = val;
    }
    /**
     * This function will throw an Error if the App has already been deleted -
     * use before performing API actions on the App.
     */
    checkDestroyed() {
      if (this.isDeleted) {
        throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
      }
    }
  };
  var SDK_VERSION = version;
  function initializeApp(_options, rawConfig = {}) {
    let options = _options;
    if (typeof rawConfig !== "object") {
      const name4 = rawConfig;
      rawConfig = { name: name4 };
    }
    const config = Object.assign({ name: DEFAULT_ENTRY_NAME2, automaticDataCollectionEnabled: false }, rawConfig);
    const name3 = config.name;
    if (typeof name3 !== "string" || !name3) {
      throw ERROR_FACTORY.create("bad-app-name", {
        appName: String(name3)
      });
    }
    options || (options = getDefaultAppConfig());
    if (!options) {
      throw ERROR_FACTORY.create(
        "no-options"
        /* AppError.NO_OPTIONS */
      );
    }
    const existingApp = _apps.get(name3);
    if (existingApp) {
      if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
        return existingApp;
      } else {
        throw ERROR_FACTORY.create("duplicate-app", { appName: name3 });
      }
    }
    const container = new ComponentContainer(name3);
    for (const component of _components.values()) {
      container.addComponent(component);
    }
    const newApp = new FirebaseAppImpl(options, config, container);
    _apps.set(name3, newApp);
    return newApp;
  }
  function registerVersion(libraryKeyOrName, version3, variant) {
    var _a;
    let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;
    if (variant) {
      library += `-${variant}`;
    }
    const libraryMismatch = library.match(/\s|\//);
    const versionMismatch = version3.match(/\s|\//);
    if (libraryMismatch || versionMismatch) {
      const warning = [
        `Unable to register library "${library}" with version "${version3}":`
      ];
      if (libraryMismatch) {
        warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
      }
      if (libraryMismatch && versionMismatch) {
        warning.push("and");
      }
      if (versionMismatch) {
        warning.push(`version name "${version3}" contains illegal characters (whitespace or "/")`);
      }
      logger.warn(warning.join(" "));
      return;
    }
    _registerComponent(new Component(
      `${library}-version`,
      () => ({ library, version: version3 }),
      "VERSION"
      /* ComponentType.VERSION */
    ));
  }
  var DB_NAME = "firebase-heartbeat-database";
  var DB_VERSION = 1;
  var STORE_NAME = "firebase-heartbeat-store";
  var dbPromise = null;
  function getDbPromise() {
    if (!dbPromise) {
      dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade: (db, oldVersion) => {
          switch (oldVersion) {
            case 0:
              try {
                db.createObjectStore(STORE_NAME);
              } catch (e5) {
                console.warn(e5);
              }
          }
        }
      }).catch((e5) => {
        throw ERROR_FACTORY.create("idb-open", {
          originalErrorMessage: e5.message
        });
      });
    }
    return dbPromise;
  }
  async function readHeartbeatsFromIndexedDB(app) {
    try {
      const db = await getDbPromise();
      const tx = db.transaction(STORE_NAME);
      const result = await tx.objectStore(STORE_NAME).get(computeKey(app));
      await tx.done;
      return result;
    } catch (e5) {
      if (e5 instanceof FirebaseError) {
        logger.warn(e5.message);
      } else {
        const idbGetError = ERROR_FACTORY.create("idb-get", {
          originalErrorMessage: e5 === null || e5 === void 0 ? void 0 : e5.message
        });
        logger.warn(idbGetError.message);
      }
    }
  }
  async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
    try {
      const db = await getDbPromise();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const objectStore = tx.objectStore(STORE_NAME);
      await objectStore.put(heartbeatObject, computeKey(app));
      await tx.done;
    } catch (e5) {
      if (e5 instanceof FirebaseError) {
        logger.warn(e5.message);
      } else {
        const idbGetError = ERROR_FACTORY.create("idb-set", {
          originalErrorMessage: e5 === null || e5 === void 0 ? void 0 : e5.message
        });
        logger.warn(idbGetError.message);
      }
    }
  }
  function computeKey(app) {
    return `${app.name}!${app.options.appId}`;
  }
  var MAX_HEADER_BYTES = 1024;
  var STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1e3;
  var HeartbeatServiceImpl = class {
    constructor(container) {
      this.container = container;
      this._heartbeatsCache = null;
      const app = this.container.getProvider("app").getImmediate();
      this._storage = new HeartbeatStorageImpl(app);
      this._heartbeatsCachePromise = this._storage.read().then((result) => {
        this._heartbeatsCache = result;
        return result;
      });
    }
    /**
     * Called to report a heartbeat. The function will generate
     * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
     * to IndexedDB.
     * Note that we only store one heartbeat per day. So if a heartbeat for today is
     * already logged, subsequent calls to this function in the same day will be ignored.
     */
    async triggerHeartbeat() {
      var _a, _b;
      const platformLogger = this.container.getProvider("platform-logger").getImmediate();
      const agent = platformLogger.getPlatformInfoString();
      const date = getUTCDateString();
      if (((_a = this._heartbeatsCache) === null || _a === void 0 ? void 0 : _a.heartbeats) == null) {
        this._heartbeatsCache = await this._heartbeatsCachePromise;
        if (((_b = this._heartbeatsCache) === null || _b === void 0 ? void 0 : _b.heartbeats) == null) {
          return;
        }
      }
      if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
        return;
      } else {
        this._heartbeatsCache.heartbeats.push({ date, agent });
      }
      this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter((singleDateHeartbeat) => {
        const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
        const now = Date.now();
        return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
      });
      return this._storage.overwrite(this._heartbeatsCache);
    }
    /**
     * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
     * It also clears all heartbeats from memory as well as in IndexedDB.
     *
     * NOTE: Consuming product SDKs should not send the header if this method
     * returns an empty string.
     */
    async getHeartbeatsHeader() {
      var _a;
      if (this._heartbeatsCache === null) {
        await this._heartbeatsCachePromise;
      }
      if (((_a = this._heartbeatsCache) === null || _a === void 0 ? void 0 : _a.heartbeats) == null || this._heartbeatsCache.heartbeats.length === 0) {
        return "";
      }
      const date = getUTCDateString();
      const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
      const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
      this._heartbeatsCache.lastSentHeartbeatDate = date;
      if (unsentEntries.length > 0) {
        this._heartbeatsCache.heartbeats = unsentEntries;
        await this._storage.overwrite(this._heartbeatsCache);
      } else {
        this._heartbeatsCache.heartbeats = [];
        void this._storage.overwrite(this._heartbeatsCache);
      }
      return headerString;
    }
  };
  function getUTCDateString() {
    const today = /* @__PURE__ */ new Date();
    return today.toISOString().substring(0, 10);
  }
  function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
    const heartbeatsToSend = [];
    let unsentEntries = heartbeatsCache.slice();
    for (const singleDateHeartbeat of heartbeatsCache) {
      const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
      if (!heartbeatEntry) {
        heartbeatsToSend.push({
          agent: singleDateHeartbeat.agent,
          dates: [singleDateHeartbeat.date]
        });
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatsToSend.pop();
          break;
        }
      } else {
        heartbeatEntry.dates.push(singleDateHeartbeat.date);
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatEntry.dates.pop();
          break;
        }
      }
      unsentEntries = unsentEntries.slice(1);
    }
    return {
      heartbeatsToSend,
      unsentEntries
    };
  }
  var HeartbeatStorageImpl = class {
    constructor(app) {
      this.app = app;
      this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
    }
    async runIndexedDBEnvironmentCheck() {
      if (!isIndexedDBAvailable()) {
        return false;
      } else {
        return validateIndexedDBOpenable().then(() => true).catch(() => false);
      }
    }
    /**
     * Read all heartbeats.
     */
    async read() {
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return { heartbeats: [] };
      } else {
        const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
        if (idbHeartbeatObject === null || idbHeartbeatObject === void 0 ? void 0 : idbHeartbeatObject.heartbeats) {
          return idbHeartbeatObject;
        } else {
          return { heartbeats: [] };
        }
      }
    }
    // overwrite the storage with the provided heartbeats
    async overwrite(heartbeatsObject) {
      var _a;
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return;
      } else {
        const existingHeartbeatsObject = await this.read();
        return writeHeartbeatsToIndexedDB(this.app, {
          lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
          heartbeats: heartbeatsObject.heartbeats
        });
      }
    }
    // add heartbeats
    async add(heartbeatsObject) {
      var _a;
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return;
      } else {
        const existingHeartbeatsObject = await this.read();
        return writeHeartbeatsToIndexedDB(this.app, {
          lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
          heartbeats: [
            ...existingHeartbeatsObject.heartbeats,
            ...heartbeatsObject.heartbeats
          ]
        });
      }
    }
  };
  function countBytes(heartbeatsCache) {
    return base64urlEncodeWithoutPadding(
      // heartbeatsCache wrapper properties
      JSON.stringify({ version: 2, heartbeats: heartbeatsCache })
    ).length;
  }
  function registerCoreComponents(variant) {
    _registerComponent(new Component(
      "platform-logger",
      (container) => new PlatformLoggerServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    _registerComponent(new Component(
      "heartbeat",
      (container) => new HeartbeatServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    registerVersion(name$p, version$1, variant);
    registerVersion(name$p, version$1, "esm2017");
    registerVersion("fire-js", "");
  }
  registerCoreComponents("");

  // node_modules/.pnpm/firebase@10.12.2/node_modules/firebase/app/dist/esm/index.esm.js
  var name2 = "firebase";
  var version2 = "10.12.2";
  registerVersion(name2, version2, "app");

  // node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/css-tag.js
  var t = globalThis;
  var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  var s = Symbol();
  var o = /* @__PURE__ */ new WeakMap();
  var n = class {
    constructor(t4, e5, o4) {
      if (this._$cssResult$ = true, o4 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t4, this.t = e5;
    }
    get styleSheet() {
      let t4 = this.o;
      const s4 = this.t;
      if (e && void 0 === t4) {
        const e5 = void 0 !== s4 && 1 === s4.length;
        e5 && (t4 = o.get(s4)), void 0 === t4 && ((this.o = t4 = new CSSStyleSheet()).replaceSync(this.cssText), e5 && o.set(s4, t4));
      }
      return t4;
    }
    toString() {
      return this.cssText;
    }
  };
  var r = (t4) => new n("string" == typeof t4 ? t4 : t4 + "", void 0, s);
  var i = (t4, ...e5) => {
    const o4 = 1 === t4.length ? t4[0] : e5.reduce((e6, s4, o5) => e6 + ((t5) => {
      if (true === t5._$cssResult$) return t5.cssText;
      if ("number" == typeof t5) return t5;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t5 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s4) + t4[o5 + 1], t4[0]);
    return new n(o4, t4, s);
  };
  var S = (s4, o4) => {
    if (e) s4.adoptedStyleSheets = o4.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet);
    else for (const e5 of o4) {
      const o5 = document.createElement("style"), n5 = t.litNonce;
      void 0 !== n5 && o5.setAttribute("nonce", n5), o5.textContent = e5.cssText, s4.appendChild(o5);
    }
  };
  var c = e ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
    let e5 = "";
    for (const s4 of t5.cssRules) e5 += s4.cssText;
    return r(e5);
  })(t4) : t4;

  // node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/reactive-element.js
  var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: r2, getOwnPropertyNames: h, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
  var a = globalThis;
  var c2 = a.trustedTypes;
  var l = c2 ? c2.emptyScript : "";
  var p = a.reactiveElementPolyfillSupport;
  var d = (t4, s4) => t4;
  var u = { toAttribute(t4, s4) {
    switch (s4) {
      case Boolean:
        t4 = t4 ? l : null;
        break;
      case Object:
      case Array:
        t4 = null == t4 ? t4 : JSON.stringify(t4);
    }
    return t4;
  }, fromAttribute(t4, s4) {
    let i4 = t4;
    switch (s4) {
      case Boolean:
        i4 = null !== t4;
        break;
      case Number:
        i4 = null === t4 ? null : Number(t4);
        break;
      case Object:
      case Array:
        try {
          i4 = JSON.parse(t4);
        } catch (t5) {
          i4 = null;
        }
    }
    return i4;
  } };
  var f = (t4, s4) => !i2(t4, s4);
  var y = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
  Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
  var b = class extends HTMLElement {
    static addInitializer(t4) {
      this._$Ei(), (this.l ??= []).push(t4);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t4, s4 = y) {
      if (s4.state && (s4.attribute = false), this._$Ei(), this.elementProperties.set(t4, s4), !s4.noAccessor) {
        const i4 = Symbol(), r5 = this.getPropertyDescriptor(t4, i4, s4);
        void 0 !== r5 && e2(this.prototype, t4, r5);
      }
    }
    static getPropertyDescriptor(t4, s4, i4) {
      const { get: e5, set: h3 } = r2(this.prototype, t4) ?? { get() {
        return this[s4];
      }, set(t5) {
        this[s4] = t5;
      } };
      return { get() {
        return e5?.call(this);
      }, set(s5) {
        const r5 = e5?.call(this);
        h3.call(this, s5), this.requestUpdate(t4, r5, i4);
      }, configurable: true, enumerable: true };
    }
    static getPropertyOptions(t4) {
      return this.elementProperties.get(t4) ?? y;
    }
    static _$Ei() {
      if (this.hasOwnProperty(d("elementProperties"))) return;
      const t4 = n2(this);
      t4.finalize(), void 0 !== t4.l && (this.l = [...t4.l]), this.elementProperties = new Map(t4.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(d("finalized"))) return;
      if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
        const t5 = this.properties, s4 = [...h(t5), ...o2(t5)];
        for (const i4 of s4) this.createProperty(i4, t5[i4]);
      }
      const t4 = this[Symbol.metadata];
      if (null !== t4) {
        const s4 = litPropertyMetadata.get(t4);
        if (void 0 !== s4) for (const [t5, i4] of s4) this.elementProperties.set(t5, i4);
      }
      this._$Eh = /* @__PURE__ */ new Map();
      for (const [t5, s4] of this.elementProperties) {
        const i4 = this._$Eu(t5, s4);
        void 0 !== i4 && this._$Eh.set(i4, t5);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s4) {
      const i4 = [];
      if (Array.isArray(s4)) {
        const e5 = new Set(s4.flat(1 / 0).reverse());
        for (const s5 of e5) i4.unshift(c(s5));
      } else void 0 !== s4 && i4.push(c(s4));
      return i4;
    }
    static _$Eu(t4, s4) {
      const i4 = s4.attribute;
      return false === i4 ? void 0 : "string" == typeof i4 ? i4 : "string" == typeof t4 ? t4.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      this._$ES = new Promise((t4) => this.enableUpdating = t4), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t4) => t4(this));
    }
    addController(t4) {
      (this._$EO ??= /* @__PURE__ */ new Set()).add(t4), void 0 !== this.renderRoot && this.isConnected && t4.hostConnected?.();
    }
    removeController(t4) {
      this._$EO?.delete(t4);
    }
    _$E_() {
      const t4 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
      for (const i4 of s4.keys()) this.hasOwnProperty(i4) && (t4.set(i4, this[i4]), delete this[i4]);
      t4.size > 0 && (this._$Ep = t4);
    }
    createRenderRoot() {
      const t4 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return S(t4, this.constructor.elementStyles), t4;
    }
    connectedCallback() {
      this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t4) => t4.hostConnected?.());
    }
    enableUpdating(t4) {
    }
    disconnectedCallback() {
      this._$EO?.forEach((t4) => t4.hostDisconnected?.());
    }
    attributeChangedCallback(t4, s4, i4) {
      this._$AK(t4, i4);
    }
    _$EC(t4, s4) {
      const i4 = this.constructor.elementProperties.get(t4), e5 = this.constructor._$Eu(t4, i4);
      if (void 0 !== e5 && true === i4.reflect) {
        const r5 = (void 0 !== i4.converter?.toAttribute ? i4.converter : u).toAttribute(s4, i4.type);
        this._$Em = t4, null == r5 ? this.removeAttribute(e5) : this.setAttribute(e5, r5), this._$Em = null;
      }
    }
    _$AK(t4, s4) {
      const i4 = this.constructor, e5 = i4._$Eh.get(t4);
      if (void 0 !== e5 && this._$Em !== e5) {
        const t5 = i4.getPropertyOptions(e5), r5 = "function" == typeof t5.converter ? { fromAttribute: t5.converter } : void 0 !== t5.converter?.fromAttribute ? t5.converter : u;
        this._$Em = e5, this[e5] = r5.fromAttribute(s4, t5.type), this._$Em = null;
      }
    }
    requestUpdate(t4, s4, i4) {
      if (void 0 !== t4) {
        if (i4 ??= this.constructor.getPropertyOptions(t4), !(i4.hasChanged ?? f)(this[t4], s4)) return;
        this.P(t4, s4, i4);
      }
      false === this.isUpdatePending && (this._$ES = this._$ET());
    }
    P(t4, s4, i4) {
      this._$AL.has(t4) || this._$AL.set(t4, s4), true === i4.reflect && this._$Em !== t4 && (this._$Ej ??= /* @__PURE__ */ new Set()).add(t4);
    }
    async _$ET() {
      this.isUpdatePending = true;
      try {
        await this._$ES;
      } catch (t5) {
        Promise.reject(t5);
      }
      const t4 = this.scheduleUpdate();
      return null != t4 && await t4, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
          for (const [t6, s5] of this._$Ep) this[t6] = s5;
          this._$Ep = void 0;
        }
        const t5 = this.constructor.elementProperties;
        if (t5.size > 0) for (const [s5, i4] of t5) true !== i4.wrapped || this._$AL.has(s5) || void 0 === this[s5] || this.P(s5, this[s5], i4);
      }
      let t4 = false;
      const s4 = this._$AL;
      try {
        t4 = this.shouldUpdate(s4), t4 ? (this.willUpdate(s4), this._$EO?.forEach((t5) => t5.hostUpdate?.()), this.update(s4)) : this._$EU();
      } catch (s5) {
        throw t4 = false, this._$EU(), s5;
      }
      t4 && this._$AE(s4);
    }
    willUpdate(t4) {
    }
    _$AE(t4) {
      this._$EO?.forEach((t5) => t5.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
    }
    _$EU() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$ES;
    }
    shouldUpdate(t4) {
      return true;
    }
    update(t4) {
      this._$Ej &&= this._$Ej.forEach((t5) => this._$EC(t5, this[t5])), this._$EU();
    }
    updated(t4) {
    }
    firstUpdated(t4) {
    }
  };
  b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[d("elementProperties")] = /* @__PURE__ */ new Map(), b[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: b }), (a.reactiveElementVersions ??= []).push("2.0.4");

  // node_modules/.pnpm/lit-html@3.1.4/node_modules/lit-html/lit-html.js
  var t2 = globalThis;
  var i3 = t2.trustedTypes;
  var s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
  var e3 = "$lit$";
  var h2 = `lit$${Math.random().toFixed(9).slice(2)}$`;
  var o3 = "?" + h2;
  var n3 = `<${o3}>`;
  var r3 = document;
  var l2 = () => r3.createComment("");
  var c3 = (t4) => null === t4 || "object" != typeof t4 && "function" != typeof t4;
  var a2 = Array.isArray;
  var u2 = (t4) => a2(t4) || "function" == typeof t4?.[Symbol.iterator];
  var d2 = "[ 	\n\f\r]";
  var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var v = /-->/g;
  var _ = />/g;
  var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var p2 = /'/g;
  var g = /"/g;
  var $ = /^(?:script|style|textarea|title)$/i;
  var y2 = (t4) => (i4, ...s4) => ({ _$litType$: t4, strings: i4, values: s4 });
  var x = y2(1);
  var b2 = y2(2);
  var w = Symbol.for("lit-noChange");
  var T = Symbol.for("lit-nothing");
  var A = /* @__PURE__ */ new WeakMap();
  var E = r3.createTreeWalker(r3, 129);
  function C(t4, i4) {
    if (!Array.isArray(t4) || !t4.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== s2 ? s2.createHTML(i4) : i4;
  }
  var P = (t4, i4) => {
    const s4 = t4.length - 1, o4 = [];
    let r5, l3 = 2 === i4 ? "<svg>" : "", c4 = f2;
    for (let i5 = 0; i5 < s4; i5++) {
      const s5 = t4[i5];
      let a3, u3, d3 = -1, y3 = 0;
      for (; y3 < s5.length && (c4.lastIndex = y3, u3 = c4.exec(s5), null !== u3); ) y3 = c4.lastIndex, c4 === f2 ? "!--" === u3[1] ? c4 = v : void 0 !== u3[1] ? c4 = _ : void 0 !== u3[2] ? ($.test(u3[2]) && (r5 = RegExp("</" + u3[2], "g")), c4 = m) : void 0 !== u3[3] && (c4 = m) : c4 === m ? ">" === u3[0] ? (c4 = r5 ?? f2, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? m : '"' === u3[3] ? g : p2) : c4 === g || c4 === p2 ? c4 = m : c4 === v || c4 === _ ? c4 = f2 : (c4 = m, r5 = void 0);
      const x3 = c4 === m && t4[i5 + 1].startsWith("/>") ? " " : "";
      l3 += c4 === f2 ? s5 + n3 : d3 >= 0 ? (o4.push(a3), s5.slice(0, d3) + e3 + s5.slice(d3) + h2 + x3) : s5 + h2 + (-2 === d3 ? i5 : x3);
    }
    return [C(t4, l3 + (t4[s4] || "<?>") + (2 === i4 ? "</svg>" : "")), o4];
  };
  var V = class _V {
    constructor({ strings: t4, _$litType$: s4 }, n5) {
      let r5;
      this.parts = [];
      let c4 = 0, a3 = 0;
      const u3 = t4.length - 1, d3 = this.parts, [f3, v3] = P(t4, s4);
      if (this.el = _V.createElement(f3, n5), E.currentNode = this.el.content, 2 === s4) {
        const t5 = this.el.content.firstChild;
        t5.replaceWith(...t5.childNodes);
      }
      for (; null !== (r5 = E.nextNode()) && d3.length < u3; ) {
        if (1 === r5.nodeType) {
          if (r5.hasAttributes()) for (const t5 of r5.getAttributeNames()) if (t5.endsWith(e3)) {
            const i4 = v3[a3++], s5 = r5.getAttribute(t5).split(h2), e5 = /([.?@])?(.*)/.exec(i4);
            d3.push({ type: 1, index: c4, name: e5[2], strings: s5, ctor: "." === e5[1] ? k : "?" === e5[1] ? H : "@" === e5[1] ? I : R }), r5.removeAttribute(t5);
          } else t5.startsWith(h2) && (d3.push({ type: 6, index: c4 }), r5.removeAttribute(t5));
          if ($.test(r5.tagName)) {
            const t5 = r5.textContent.split(h2), s5 = t5.length - 1;
            if (s5 > 0) {
              r5.textContent = i3 ? i3.emptyScript : "";
              for (let i4 = 0; i4 < s5; i4++) r5.append(t5[i4], l2()), E.nextNode(), d3.push({ type: 2, index: ++c4 });
              r5.append(t5[s5], l2());
            }
          }
        } else if (8 === r5.nodeType) if (r5.data === o3) d3.push({ type: 2, index: c4 });
        else {
          let t5 = -1;
          for (; -1 !== (t5 = r5.data.indexOf(h2, t5 + 1)); ) d3.push({ type: 7, index: c4 }), t5 += h2.length - 1;
        }
        c4++;
      }
    }
    static createElement(t4, i4) {
      const s4 = r3.createElement("template");
      return s4.innerHTML = t4, s4;
    }
  };
  function N(t4, i4, s4 = t4, e5) {
    if (i4 === w) return i4;
    let h3 = void 0 !== e5 ? s4._$Co?.[e5] : s4._$Cl;
    const o4 = c3(i4) ? void 0 : i4._$litDirective$;
    return h3?.constructor !== o4 && (h3?._$AO?.(false), void 0 === o4 ? h3 = void 0 : (h3 = new o4(t4), h3._$AT(t4, s4, e5)), void 0 !== e5 ? (s4._$Co ??= [])[e5] = h3 : s4._$Cl = h3), void 0 !== h3 && (i4 = N(t4, h3._$AS(t4, i4.values), h3, e5)), i4;
  }
  var S2 = class {
    constructor(t4, i4) {
      this._$AV = [], this._$AN = void 0, this._$AD = t4, this._$AM = i4;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t4) {
      const { el: { content: i4 }, parts: s4 } = this._$AD, e5 = (t4?.creationScope ?? r3).importNode(i4, true);
      E.currentNode = e5;
      let h3 = E.nextNode(), o4 = 0, n5 = 0, l3 = s4[0];
      for (; void 0 !== l3; ) {
        if (o4 === l3.index) {
          let i5;
          2 === l3.type ? i5 = new M(h3, h3.nextSibling, this, t4) : 1 === l3.type ? i5 = new l3.ctor(h3, l3.name, l3.strings, this, t4) : 6 === l3.type && (i5 = new L(h3, this, t4)), this._$AV.push(i5), l3 = s4[++n5];
        }
        o4 !== l3?.index && (h3 = E.nextNode(), o4++);
      }
      return E.currentNode = r3, e5;
    }
    p(t4) {
      let i4 = 0;
      for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t4, s4, i4), i4 += s4.strings.length - 2) : s4._$AI(t4[i4])), i4++;
    }
  };
  var M = class _M {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t4, i4, s4, e5) {
      this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = t4, this._$AB = i4, this._$AM = s4, this.options = e5, this._$Cv = e5?.isConnected ?? true;
    }
    get parentNode() {
      let t4 = this._$AA.parentNode;
      const i4 = this._$AM;
      return void 0 !== i4 && 11 === t4?.nodeType && (t4 = i4.parentNode), t4;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t4, i4 = this) {
      t4 = N(this, t4, i4), c3(t4) ? t4 === T || null == t4 || "" === t4 ? (this._$AH !== T && this._$AR(), this._$AH = T) : t4 !== this._$AH && t4 !== w && this._(t4) : void 0 !== t4._$litType$ ? this.$(t4) : void 0 !== t4.nodeType ? this.T(t4) : u2(t4) ? this.k(t4) : this._(t4);
    }
    S(t4) {
      return this._$AA.parentNode.insertBefore(t4, this._$AB);
    }
    T(t4) {
      this._$AH !== t4 && (this._$AR(), this._$AH = this.S(t4));
    }
    _(t4) {
      this._$AH !== T && c3(this._$AH) ? this._$AA.nextSibling.data = t4 : this.T(r3.createTextNode(t4)), this._$AH = t4;
    }
    $(t4) {
      const { values: i4, _$litType$: s4 } = t4, e5 = "number" == typeof s4 ? this._$AC(t4) : (void 0 === s4.el && (s4.el = V.createElement(C(s4.h, s4.h[0]), this.options)), s4);
      if (this._$AH?._$AD === e5) this._$AH.p(i4);
      else {
        const t5 = new S2(e5, this), s5 = t5.u(this.options);
        t5.p(i4), this.T(s5), this._$AH = t5;
      }
    }
    _$AC(t4) {
      let i4 = A.get(t4.strings);
      return void 0 === i4 && A.set(t4.strings, i4 = new V(t4)), i4;
    }
    k(t4) {
      a2(this._$AH) || (this._$AH = [], this._$AR());
      const i4 = this._$AH;
      let s4, e5 = 0;
      for (const h3 of t4) e5 === i4.length ? i4.push(s4 = new _M(this.S(l2()), this.S(l2()), this, this.options)) : s4 = i4[e5], s4._$AI(h3), e5++;
      e5 < i4.length && (this._$AR(s4 && s4._$AB.nextSibling, e5), i4.length = e5);
    }
    _$AR(t4 = this._$AA.nextSibling, i4) {
      for (this._$AP?.(false, true, i4); t4 && t4 !== this._$AB; ) {
        const i5 = t4.nextSibling;
        t4.remove(), t4 = i5;
      }
    }
    setConnected(t4) {
      void 0 === this._$AM && (this._$Cv = t4, this._$AP?.(t4));
    }
  };
  var R = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t4, i4, s4, e5, h3) {
      this.type = 1, this._$AH = T, this._$AN = void 0, this.element = t4, this.name = i4, this._$AM = e5, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = T;
    }
    _$AI(t4, i4 = this, s4, e5) {
      const h3 = this.strings;
      let o4 = false;
      if (void 0 === h3) t4 = N(this, t4, i4, 0), o4 = !c3(t4) || t4 !== this._$AH && t4 !== w, o4 && (this._$AH = t4);
      else {
        const e6 = t4;
        let n5, r5;
        for (t4 = h3[0], n5 = 0; n5 < h3.length - 1; n5++) r5 = N(this, e6[s4 + n5], i4, n5), r5 === w && (r5 = this._$AH[n5]), o4 ||= !c3(r5) || r5 !== this._$AH[n5], r5 === T ? t4 = T : t4 !== T && (t4 += (r5 ?? "") + h3[n5 + 1]), this._$AH[n5] = r5;
      }
      o4 && !e5 && this.j(t4);
    }
    j(t4) {
      t4 === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 ?? "");
    }
  };
  var k = class extends R {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t4) {
      this.element[this.name] = t4 === T ? void 0 : t4;
    }
  };
  var H = class extends R {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t4) {
      this.element.toggleAttribute(this.name, !!t4 && t4 !== T);
    }
  };
  var I = class extends R {
    constructor(t4, i4, s4, e5, h3) {
      super(t4, i4, s4, e5, h3), this.type = 5;
    }
    _$AI(t4, i4 = this) {
      if ((t4 = N(this, t4, i4, 0) ?? T) === w) return;
      const s4 = this._$AH, e5 = t4 === T && s4 !== T || t4.capture !== s4.capture || t4.once !== s4.once || t4.passive !== s4.passive, h3 = t4 !== T && (s4 === T || e5);
      e5 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
    }
    handleEvent(t4) {
      "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t4) : this._$AH.handleEvent(t4);
    }
  };
  var L = class {
    constructor(t4, i4, s4) {
      this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i4, this.options = s4;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t4) {
      N(this, t4);
    }
  };
  var Z = t2.litHtmlPolyfillSupport;
  Z?.(V, M), (t2.litHtmlVersions ??= []).push("3.1.4");
  var j = (t4, i4, s4) => {
    const e5 = s4?.renderBefore ?? i4;
    let h3 = e5._$litPart$;
    if (void 0 === h3) {
      const t5 = s4?.renderBefore ?? null;
      e5._$litPart$ = h3 = new M(i4.insertBefore(l2(), t5), t5, void 0, s4 ?? {});
    }
    return h3._$AI(t4), h3;
  };

  // node_modules/.pnpm/lit-element@4.0.6/node_modules/lit-element/lit-element.js
  var s3 = class extends b {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      const t4 = super.createRenderRoot();
      return this.renderOptions.renderBefore ??= t4.firstChild, t4;
    }
    update(t4) {
      const i4 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t4), this._$Do = j(i4, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(true);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(false);
    }
    render() {
      return w;
    }
  };
  s3._$litElement$ = true, s3["finalized", "finalized"] = true, globalThis.litElementHydrateSupport?.({ LitElement: s3 });
  var r4 = globalThis.litElementPolyfillSupport;
  r4?.({ LitElement: s3 });
  (globalThis.litElementVersions ??= []).push("4.0.6");

  // node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/custom-element.js
  var t3 = (t4) => (e5, o4) => {
    void 0 !== o4 ? o4.addInitializer(() => {
      customElements.define(t4, e5);
    }) : customElements.define(t4, e5);
  };

  // client/components/obsidian.ts
  var ObsidianElement = class extends s3 {
    render() {
      return x`
      <div id="main-container">
        <web-left-ribbon class="left-ribbon"></web-left-ribbon>
        <web-left-leaf class="left-leaf"></web-left-leaf>
        <main-body></main-body>
        <web-right-leaf></web-right-leaf>
      </div>
    `;
    }
  };
  ObsidianElement.styles = i`
    #main-container {
      width: 100%;
      height: 100%;
      display: flex;
      overflow: hidden;
      flex: 1 0 0;
    }

    .left-ribbon {
      width: 44px;
    }

    .left-leaf {
      margin-left: 1px;
    }
  `;
  ObsidianElement = __decorateClass([
    t3("obsidian-element")
  ], ObsidianElement);

  // node_modules/.pnpm/lucide@0.416.0/node_modules/lucide/dist/esm/createElement.js
  var createElement = (tag, attrs, children = []) => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs).forEach((name3) => {
      element.setAttribute(name3, String(attrs[name3]));
    });
    if (children.length) {
      children.forEach((child) => {
        const childElement = createElement(...child);
        element.appendChild(childElement);
      });
    }
    return element;
  };
  var createElement$1 = ([tag, attrs, children]) => createElement(tag, attrs, children);

  // node_modules/.pnpm/lucide@0.416.0/node_modules/lucide/dist/esm/defaultAttributes.js
  var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  };

  // node_modules/.pnpm/lucide@0.416.0/node_modules/lucide/dist/esm/icons/panel-left-close.js
  var PanelLeftClose = [
    "svg",
    defaultAttributes,
    [
      ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
      ["path", { d: "M9 3v18" }],
      ["path", { d: "m16 15-3-3 3-3" }]
    ]
  ];

  // node_modules/.pnpm/lucide@0.416.0/node_modules/lucide/dist/esm/icons/terminal.js
  var Terminal = [
    "svg",
    defaultAttributes,
    [
      ["polyline", { points: "4 17 10 11 4 5" }],
      ["line", { x1: "12", x2: "20", y1: "19", y2: "19" }]
    ]
  ];

  // client/components/web_ribbon.ts
  var WebLeftRibbon = class extends s3 {
    render() {
      return x`
      <div class="vertical-container">
        <div class="header">${createElement$1(PanelLeftClose)}</div>
        <div class="side-doc-actions">
          <div class="action">${createElement$1(Terminal)}</div>
        </div>
      </div>
    `;
    }
  };
  WebLeftRibbon.styles = i`
    .vertical-container {
      width: 100%;
      height: 100%;
      display: flex;
      overflow: hidden;
      flex: 1 0 0;
      flex-direction: column;
      align-items: center;
      background-color: #262626;
      border-right: 1rem solid #36364d;
    }
    .vertical-container::before {
      content: "";
      top: 0px;
      left: 0px;
      position: absolute;
      background-color: #36364d;
      width: 44px;
      height: 44px;
      z-index: 0;
    }
    .header {
      padding: 8px 0 8px 0;
      color: white;
      z-index: 1;
    }
    .side-doc-actions {
      margin-top: 8px;
    }
    .action {
      color: white;
      padding-bottom: 4px;
    }
  `;
  WebLeftRibbon = __decorateClass([
    t3("web-left-ribbon")
  ], WebLeftRibbon);

  // client/components/web_left_leaf.ts
  var WebLeftLeaf = class extends s3 {
    render() {
      return x`<div class="vertical-container">left</div>`;
    }
  };
  WebLeftLeaf.styles = i`
    .vertical-container {
      min-width: 200px;
      height: 100%;
      display: flex;
      overflow: hidden;
      flex: 1 0 0;
      flex-direction: row;
      justify-content: center;
      background-color: #262626;
    }
  `;
  WebLeftLeaf = __decorateClass([
    t3("web-left-leaf")
  ], WebLeftLeaf);

  // client/components/web_right_leaf.ts
  var WebRightLeaf = class extends s3 {
    render() {
      return x`<div>right</div>`;
    }
  };
  WebRightLeaf.styles = i``;
  WebRightLeaf = __decorateClass([
    t3("web-right-leaf")
  ], WebRightLeaf);

  // client/components/main_body.ts
  var MainBody = class extends s3 {
    render() {
      return x`<div>main</div>`;
    }
  };
  MainBody.styles = i``;
  MainBody = __decorateClass([
    t3("main-body")
  ], MainBody);

  // node_modules/.pnpm/@firebase+webchannel-wrapper@1.0.0/node_modules/@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var bloom_blob_es2018 = {};
  var Integer;
  var Md5;
  (function() {
    var h3;
    function k3(f3, a3) {
      function c4() {
      }
      c4.prototype = a3.prototype;
      f3.D = a3.prototype;
      f3.prototype = new c4();
      f3.prototype.constructor = f3;
      f3.C = function(d3, e5, g2) {
        for (var b4 = Array(arguments.length - 2), r5 = 2; r5 < arguments.length; r5++) b4[r5 - 2] = arguments[r5];
        return a3.prototype[e5].apply(d3, b4);
      };
    }
    function l3() {
      this.blockSize = -1;
    }
    function m2() {
      this.blockSize = -1;
      this.blockSize = 64;
      this.g = Array(4);
      this.B = Array(this.blockSize);
      this.o = this.h = 0;
      this.s();
    }
    k3(m2, l3);
    m2.prototype.s = function() {
      this.g[0] = 1732584193;
      this.g[1] = 4023233417;
      this.g[2] = 2562383102;
      this.g[3] = 271733878;
      this.o = this.h = 0;
    };
    function n5(f3, a3, c4) {
      c4 || (c4 = 0);
      var d3 = Array(16);
      if ("string" === typeof a3) for (var e5 = 0; 16 > e5; ++e5) d3[e5] = a3.charCodeAt(c4++) | a3.charCodeAt(c4++) << 8 | a3.charCodeAt(c4++) << 16 | a3.charCodeAt(c4++) << 24;
      else for (e5 = 0; 16 > e5; ++e5) d3[e5] = a3[c4++] | a3[c4++] << 8 | a3[c4++] << 16 | a3[c4++] << 24;
      a3 = f3.g[0];
      c4 = f3.g[1];
      e5 = f3.g[2];
      var g2 = f3.g[3];
      var b4 = a3 + (g2 ^ c4 & (e5 ^ g2)) + d3[0] + 3614090360 & 4294967295;
      a3 = c4 + (b4 << 7 & 4294967295 | b4 >>> 25);
      b4 = g2 + (e5 ^ a3 & (c4 ^ e5)) + d3[1] + 3905402710 & 4294967295;
      g2 = a3 + (b4 << 12 & 4294967295 | b4 >>> 20);
      b4 = e5 + (c4 ^ g2 & (a3 ^ c4)) + d3[2] + 606105819 & 4294967295;
      e5 = g2 + (b4 << 17 & 4294967295 | b4 >>> 15);
      b4 = c4 + (a3 ^ e5 & (g2 ^ a3)) + d3[3] + 3250441966 & 4294967295;
      c4 = e5 + (b4 << 22 & 4294967295 | b4 >>> 10);
      b4 = a3 + (g2 ^ c4 & (e5 ^ g2)) + d3[4] + 4118548399 & 4294967295;
      a3 = c4 + (b4 << 7 & 4294967295 | b4 >>> 25);
      b4 = g2 + (e5 ^ a3 & (c4 ^ e5)) + d3[5] + 1200080426 & 4294967295;
      g2 = a3 + (b4 << 12 & 4294967295 | b4 >>> 20);
      b4 = e5 + (c4 ^ g2 & (a3 ^ c4)) + d3[6] + 2821735955 & 4294967295;
      e5 = g2 + (b4 << 17 & 4294967295 | b4 >>> 15);
      b4 = c4 + (a3 ^ e5 & (g2 ^ a3)) + d3[7] + 4249261313 & 4294967295;
      c4 = e5 + (b4 << 22 & 4294967295 | b4 >>> 10);
      b4 = a3 + (g2 ^ c4 & (e5 ^ g2)) + d3[8] + 1770035416 & 4294967295;
      a3 = c4 + (b4 << 7 & 4294967295 | b4 >>> 25);
      b4 = g2 + (e5 ^ a3 & (c4 ^ e5)) + d3[9] + 2336552879 & 4294967295;
      g2 = a3 + (b4 << 12 & 4294967295 | b4 >>> 20);
      b4 = e5 + (c4 ^ g2 & (a3 ^ c4)) + d3[10] + 4294925233 & 4294967295;
      e5 = g2 + (b4 << 17 & 4294967295 | b4 >>> 15);
      b4 = c4 + (a3 ^ e5 & (g2 ^ a3)) + d3[11] + 2304563134 & 4294967295;
      c4 = e5 + (b4 << 22 & 4294967295 | b4 >>> 10);
      b4 = a3 + (g2 ^ c4 & (e5 ^ g2)) + d3[12] + 1804603682 & 4294967295;
      a3 = c4 + (b4 << 7 & 4294967295 | b4 >>> 25);
      b4 = g2 + (e5 ^ a3 & (c4 ^ e5)) + d3[13] + 4254626195 & 4294967295;
      g2 = a3 + (b4 << 12 & 4294967295 | b4 >>> 20);
      b4 = e5 + (c4 ^ g2 & (a3 ^ c4)) + d3[14] + 2792965006 & 4294967295;
      e5 = g2 + (b4 << 17 & 4294967295 | b4 >>> 15);
      b4 = c4 + (a3 ^ e5 & (g2 ^ a3)) + d3[15] + 1236535329 & 4294967295;
      c4 = e5 + (b4 << 22 & 4294967295 | b4 >>> 10);
      b4 = a3 + (e5 ^ g2 & (c4 ^ e5)) + d3[1] + 4129170786 & 4294967295;
      a3 = c4 + (b4 << 5 & 4294967295 | b4 >>> 27);
      b4 = g2 + (c4 ^ e5 & (a3 ^ c4)) + d3[6] + 3225465664 & 4294967295;
      g2 = a3 + (b4 << 9 & 4294967295 | b4 >>> 23);
      b4 = e5 + (a3 ^ c4 & (g2 ^ a3)) + d3[11] + 643717713 & 4294967295;
      e5 = g2 + (b4 << 14 & 4294967295 | b4 >>> 18);
      b4 = c4 + (g2 ^ a3 & (e5 ^ g2)) + d3[0] + 3921069994 & 4294967295;
      c4 = e5 + (b4 << 20 & 4294967295 | b4 >>> 12);
      b4 = a3 + (e5 ^ g2 & (c4 ^ e5)) + d3[5] + 3593408605 & 4294967295;
      a3 = c4 + (b4 << 5 & 4294967295 | b4 >>> 27);
      b4 = g2 + (c4 ^ e5 & (a3 ^ c4)) + d3[10] + 38016083 & 4294967295;
      g2 = a3 + (b4 << 9 & 4294967295 | b4 >>> 23);
      b4 = e5 + (a3 ^ c4 & (g2 ^ a3)) + d3[15] + 3634488961 & 4294967295;
      e5 = g2 + (b4 << 14 & 4294967295 | b4 >>> 18);
      b4 = c4 + (g2 ^ a3 & (e5 ^ g2)) + d3[4] + 3889429448 & 4294967295;
      c4 = e5 + (b4 << 20 & 4294967295 | b4 >>> 12);
      b4 = a3 + (e5 ^ g2 & (c4 ^ e5)) + d3[9] + 568446438 & 4294967295;
      a3 = c4 + (b4 << 5 & 4294967295 | b4 >>> 27);
      b4 = g2 + (c4 ^ e5 & (a3 ^ c4)) + d3[14] + 3275163606 & 4294967295;
      g2 = a3 + (b4 << 9 & 4294967295 | b4 >>> 23);
      b4 = e5 + (a3 ^ c4 & (g2 ^ a3)) + d3[3] + 4107603335 & 4294967295;
      e5 = g2 + (b4 << 14 & 4294967295 | b4 >>> 18);
      b4 = c4 + (g2 ^ a3 & (e5 ^ g2)) + d3[8] + 1163531501 & 4294967295;
      c4 = e5 + (b4 << 20 & 4294967295 | b4 >>> 12);
      b4 = a3 + (e5 ^ g2 & (c4 ^ e5)) + d3[13] + 2850285829 & 4294967295;
      a3 = c4 + (b4 << 5 & 4294967295 | b4 >>> 27);
      b4 = g2 + (c4 ^ e5 & (a3 ^ c4)) + d3[2] + 4243563512 & 4294967295;
      g2 = a3 + (b4 << 9 & 4294967295 | b4 >>> 23);
      b4 = e5 + (a3 ^ c4 & (g2 ^ a3)) + d3[7] + 1735328473 & 4294967295;
      e5 = g2 + (b4 << 14 & 4294967295 | b4 >>> 18);
      b4 = c4 + (g2 ^ a3 & (e5 ^ g2)) + d3[12] + 2368359562 & 4294967295;
      c4 = e5 + (b4 << 20 & 4294967295 | b4 >>> 12);
      b4 = a3 + (c4 ^ e5 ^ g2) + d3[5] + 4294588738 & 4294967295;
      a3 = c4 + (b4 << 4 & 4294967295 | b4 >>> 28);
      b4 = g2 + (a3 ^ c4 ^ e5) + d3[8] + 2272392833 & 4294967295;
      g2 = a3 + (b4 << 11 & 4294967295 | b4 >>> 21);
      b4 = e5 + (g2 ^ a3 ^ c4) + d3[11] + 1839030562 & 4294967295;
      e5 = g2 + (b4 << 16 & 4294967295 | b4 >>> 16);
      b4 = c4 + (e5 ^ g2 ^ a3) + d3[14] + 4259657740 & 4294967295;
      c4 = e5 + (b4 << 23 & 4294967295 | b4 >>> 9);
      b4 = a3 + (c4 ^ e5 ^ g2) + d3[1] + 2763975236 & 4294967295;
      a3 = c4 + (b4 << 4 & 4294967295 | b4 >>> 28);
      b4 = g2 + (a3 ^ c4 ^ e5) + d3[4] + 1272893353 & 4294967295;
      g2 = a3 + (b4 << 11 & 4294967295 | b4 >>> 21);
      b4 = e5 + (g2 ^ a3 ^ c4) + d3[7] + 4139469664 & 4294967295;
      e5 = g2 + (b4 << 16 & 4294967295 | b4 >>> 16);
      b4 = c4 + (e5 ^ g2 ^ a3) + d3[10] + 3200236656 & 4294967295;
      c4 = e5 + (b4 << 23 & 4294967295 | b4 >>> 9);
      b4 = a3 + (c4 ^ e5 ^ g2) + d3[13] + 681279174 & 4294967295;
      a3 = c4 + (b4 << 4 & 4294967295 | b4 >>> 28);
      b4 = g2 + (a3 ^ c4 ^ e5) + d3[0] + 3936430074 & 4294967295;
      g2 = a3 + (b4 << 11 & 4294967295 | b4 >>> 21);
      b4 = e5 + (g2 ^ a3 ^ c4) + d3[3] + 3572445317 & 4294967295;
      e5 = g2 + (b4 << 16 & 4294967295 | b4 >>> 16);
      b4 = c4 + (e5 ^ g2 ^ a3) + d3[6] + 76029189 & 4294967295;
      c4 = e5 + (b4 << 23 & 4294967295 | b4 >>> 9);
      b4 = a3 + (c4 ^ e5 ^ g2) + d3[9] + 3654602809 & 4294967295;
      a3 = c4 + (b4 << 4 & 4294967295 | b4 >>> 28);
      b4 = g2 + (a3 ^ c4 ^ e5) + d3[12] + 3873151461 & 4294967295;
      g2 = a3 + (b4 << 11 & 4294967295 | b4 >>> 21);
      b4 = e5 + (g2 ^ a3 ^ c4) + d3[15] + 530742520 & 4294967295;
      e5 = g2 + (b4 << 16 & 4294967295 | b4 >>> 16);
      b4 = c4 + (e5 ^ g2 ^ a3) + d3[2] + 3299628645 & 4294967295;
      c4 = e5 + (b4 << 23 & 4294967295 | b4 >>> 9);
      b4 = a3 + (e5 ^ (c4 | ~g2)) + d3[0] + 4096336452 & 4294967295;
      a3 = c4 + (b4 << 6 & 4294967295 | b4 >>> 26);
      b4 = g2 + (c4 ^ (a3 | ~e5)) + d3[7] + 1126891415 & 4294967295;
      g2 = a3 + (b4 << 10 & 4294967295 | b4 >>> 22);
      b4 = e5 + (a3 ^ (g2 | ~c4)) + d3[14] + 2878612391 & 4294967295;
      e5 = g2 + (b4 << 15 & 4294967295 | b4 >>> 17);
      b4 = c4 + (g2 ^ (e5 | ~a3)) + d3[5] + 4237533241 & 4294967295;
      c4 = e5 + (b4 << 21 & 4294967295 | b4 >>> 11);
      b4 = a3 + (e5 ^ (c4 | ~g2)) + d3[12] + 1700485571 & 4294967295;
      a3 = c4 + (b4 << 6 & 4294967295 | b4 >>> 26);
      b4 = g2 + (c4 ^ (a3 | ~e5)) + d3[3] + 2399980690 & 4294967295;
      g2 = a3 + (b4 << 10 & 4294967295 | b4 >>> 22);
      b4 = e5 + (a3 ^ (g2 | ~c4)) + d3[10] + 4293915773 & 4294967295;
      e5 = g2 + (b4 << 15 & 4294967295 | b4 >>> 17);
      b4 = c4 + (g2 ^ (e5 | ~a3)) + d3[1] + 2240044497 & 4294967295;
      c4 = e5 + (b4 << 21 & 4294967295 | b4 >>> 11);
      b4 = a3 + (e5 ^ (c4 | ~g2)) + d3[8] + 1873313359 & 4294967295;
      a3 = c4 + (b4 << 6 & 4294967295 | b4 >>> 26);
      b4 = g2 + (c4 ^ (a3 | ~e5)) + d3[15] + 4264355552 & 4294967295;
      g2 = a3 + (b4 << 10 & 4294967295 | b4 >>> 22);
      b4 = e5 + (a3 ^ (g2 | ~c4)) + d3[6] + 2734768916 & 4294967295;
      e5 = g2 + (b4 << 15 & 4294967295 | b4 >>> 17);
      b4 = c4 + (g2 ^ (e5 | ~a3)) + d3[13] + 1309151649 & 4294967295;
      c4 = e5 + (b4 << 21 & 4294967295 | b4 >>> 11);
      b4 = a3 + (e5 ^ (c4 | ~g2)) + d3[4] + 4149444226 & 4294967295;
      a3 = c4 + (b4 << 6 & 4294967295 | b4 >>> 26);
      b4 = g2 + (c4 ^ (a3 | ~e5)) + d3[11] + 3174756917 & 4294967295;
      g2 = a3 + (b4 << 10 & 4294967295 | b4 >>> 22);
      b4 = e5 + (a3 ^ (g2 | ~c4)) + d3[2] + 718787259 & 4294967295;
      e5 = g2 + (b4 << 15 & 4294967295 | b4 >>> 17);
      b4 = c4 + (g2 ^ (e5 | ~a3)) + d3[9] + 3951481745 & 4294967295;
      f3.g[0] = f3.g[0] + a3 & 4294967295;
      f3.g[1] = f3.g[1] + (e5 + (b4 << 21 & 4294967295 | b4 >>> 11)) & 4294967295;
      f3.g[2] = f3.g[2] + e5 & 4294967295;
      f3.g[3] = f3.g[3] + g2 & 4294967295;
    }
    m2.prototype.u = function(f3, a3) {
      void 0 === a3 && (a3 = f3.length);
      for (var c4 = a3 - this.blockSize, d3 = this.B, e5 = this.h, g2 = 0; g2 < a3; ) {
        if (0 == e5) for (; g2 <= c4; ) n5(this, f3, g2), g2 += this.blockSize;
        if ("string" === typeof f3) for (; g2 < a3; ) {
          if (d3[e5++] = f3.charCodeAt(g2++), e5 == this.blockSize) {
            n5(this, d3);
            e5 = 0;
            break;
          }
        }
        else for (; g2 < a3; ) if (d3[e5++] = f3[g2++], e5 == this.blockSize) {
          n5(this, d3);
          e5 = 0;
          break;
        }
      }
      this.h = e5;
      this.o += a3;
    };
    m2.prototype.v = function() {
      var f3 = Array((56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h);
      f3[0] = 128;
      for (var a3 = 1; a3 < f3.length - 8; ++a3) f3[a3] = 0;
      var c4 = 8 * this.o;
      for (a3 = f3.length - 8; a3 < f3.length; ++a3) f3[a3] = c4 & 255, c4 /= 256;
      this.u(f3);
      f3 = Array(16);
      for (a3 = c4 = 0; 4 > a3; ++a3) for (var d3 = 0; 32 > d3; d3 += 8) f3[c4++] = this.g[a3] >>> d3 & 255;
      return f3;
    };
    function p3(f3, a3) {
      var c4 = q2;
      return Object.prototype.hasOwnProperty.call(c4, f3) ? c4[f3] : c4[f3] = a3(f3);
    }
    function t4(f3, a3) {
      this.h = a3;
      for (var c4 = [], d3 = true, e5 = f3.length - 1; 0 <= e5; e5--) {
        var g2 = f3[e5] | 0;
        d3 && g2 == a3 || (c4[e5] = g2, d3 = false);
      }
      this.g = c4;
    }
    var q2 = {};
    function u3(f3) {
      return -128 <= f3 && 128 > f3 ? p3(f3, function(a3) {
        return new t4([a3 | 0], 0 > a3 ? -1 : 0);
      }) : new t4([f3 | 0], 0 > f3 ? -1 : 0);
    }
    function v3(f3) {
      if (isNaN(f3) || !isFinite(f3)) return w2;
      if (0 > f3) return x3(v3(-f3));
      for (var a3 = [], c4 = 1, d3 = 0; f3 >= c4; d3++) a3[d3] = f3 / c4 | 0, c4 *= 4294967296;
      return new t4(a3, 0);
    }
    function y3(f3, a3) {
      if (0 == f3.length) throw Error("number format error: empty string");
      a3 = a3 || 10;
      if (2 > a3 || 36 < a3) throw Error("radix out of range: " + a3);
      if ("-" == f3.charAt(0)) return x3(y3(f3.substring(1), a3));
      if (0 <= f3.indexOf("-")) throw Error('number format error: interior "-" character');
      for (var c4 = v3(Math.pow(a3, 8)), d3 = w2, e5 = 0; e5 < f3.length; e5 += 8) {
        var g2 = Math.min(8, f3.length - e5), b4 = parseInt(f3.substring(e5, e5 + g2), a3);
        8 > g2 ? (g2 = v3(Math.pow(a3, g2)), d3 = d3.j(g2).add(v3(b4))) : (d3 = d3.j(c4), d3 = d3.add(v3(b4)));
      }
      return d3;
    }
    var w2 = u3(0), z2 = u3(1), A2 = u3(16777216);
    h3 = t4.prototype;
    h3.m = function() {
      if (B2(this)) return -x3(this).m();
      for (var f3 = 0, a3 = 1, c4 = 0; c4 < this.g.length; c4++) {
        var d3 = this.i(c4);
        f3 += (0 <= d3 ? d3 : 4294967296 + d3) * a3;
        a3 *= 4294967296;
      }
      return f3;
    };
    h3.toString = function(f3) {
      f3 = f3 || 10;
      if (2 > f3 || 36 < f3) throw Error("radix out of range: " + f3);
      if (C3(this)) return "0";
      if (B2(this)) return "-" + x3(this).toString(f3);
      for (var a3 = v3(Math.pow(f3, 6)), c4 = this, d3 = ""; ; ) {
        var e5 = D2(c4, a3).g;
        c4 = F2(c4, e5.j(a3));
        var g2 = ((0 < c4.g.length ? c4.g[0] : c4.h) >>> 0).toString(f3);
        c4 = e5;
        if (C3(c4)) return g2 + d3;
        for (; 6 > g2.length; ) g2 = "0" + g2;
        d3 = g2 + d3;
      }
    };
    h3.i = function(f3) {
      return 0 > f3 ? 0 : f3 < this.g.length ? this.g[f3] : this.h;
    };
    function C3(f3) {
      if (0 != f3.h) return false;
      for (var a3 = 0; a3 < f3.g.length; a3++) if (0 != f3.g[a3]) return false;
      return true;
    }
    function B2(f3) {
      return -1 == f3.h;
    }
    h3.l = function(f3) {
      f3 = F2(this, f3);
      return B2(f3) ? -1 : C3(f3) ? 0 : 1;
    };
    function x3(f3) {
      for (var a3 = f3.g.length, c4 = [], d3 = 0; d3 < a3; d3++) c4[d3] = ~f3.g[d3];
      return new t4(c4, ~f3.h).add(z2);
    }
    h3.abs = function() {
      return B2(this) ? x3(this) : this;
    };
    h3.add = function(f3) {
      for (var a3 = Math.max(this.g.length, f3.g.length), c4 = [], d3 = 0, e5 = 0; e5 <= a3; e5++) {
        var g2 = d3 + (this.i(e5) & 65535) + (f3.i(e5) & 65535), b4 = (g2 >>> 16) + (this.i(e5) >>> 16) + (f3.i(e5) >>> 16);
        d3 = b4 >>> 16;
        g2 &= 65535;
        b4 &= 65535;
        c4[e5] = b4 << 16 | g2;
      }
      return new t4(c4, c4[c4.length - 1] & -2147483648 ? -1 : 0);
    };
    function F2(f3, a3) {
      return f3.add(x3(a3));
    }
    h3.j = function(f3) {
      if (C3(this) || C3(f3)) return w2;
      if (B2(this)) return B2(f3) ? x3(this).j(x3(f3)) : x3(x3(this).j(f3));
      if (B2(f3)) return x3(this.j(x3(f3)));
      if (0 > this.l(A2) && 0 > f3.l(A2)) return v3(this.m() * f3.m());
      for (var a3 = this.g.length + f3.g.length, c4 = [], d3 = 0; d3 < 2 * a3; d3++) c4[d3] = 0;
      for (d3 = 0; d3 < this.g.length; d3++) for (var e5 = 0; e5 < f3.g.length; e5++) {
        var g2 = this.i(d3) >>> 16, b4 = this.i(d3) & 65535, r5 = f3.i(e5) >>> 16, E2 = f3.i(e5) & 65535;
        c4[2 * d3 + 2 * e5] += b4 * E2;
        G2(c4, 2 * d3 + 2 * e5);
        c4[2 * d3 + 2 * e5 + 1] += g2 * E2;
        G2(c4, 2 * d3 + 2 * e5 + 1);
        c4[2 * d3 + 2 * e5 + 1] += b4 * r5;
        G2(c4, 2 * d3 + 2 * e5 + 1);
        c4[2 * d3 + 2 * e5 + 2] += g2 * r5;
        G2(c4, 2 * d3 + 2 * e5 + 2);
      }
      for (d3 = 0; d3 < a3; d3++) c4[d3] = c4[2 * d3 + 1] << 16 | c4[2 * d3];
      for (d3 = a3; d3 < 2 * a3; d3++) c4[d3] = 0;
      return new t4(c4, 0);
    };
    function G2(f3, a3) {
      for (; (f3[a3] & 65535) != f3[a3]; ) f3[a3 + 1] += f3[a3] >>> 16, f3[a3] &= 65535, a3++;
    }
    function H3(f3, a3) {
      this.g = f3;
      this.h = a3;
    }
    function D2(f3, a3) {
      if (C3(a3)) throw Error("division by zero");
      if (C3(f3)) return new H3(w2, w2);
      if (B2(f3)) return a3 = D2(x3(f3), a3), new H3(x3(a3.g), x3(a3.h));
      if (B2(a3)) return a3 = D2(f3, x3(a3)), new H3(x3(a3.g), a3.h);
      if (30 < f3.g.length) {
        if (B2(f3) || B2(a3)) throw Error("slowDivide_ only works with positive integers.");
        for (var c4 = z2, d3 = a3; 0 >= d3.l(f3); ) c4 = I2(c4), d3 = I2(d3);
        var e5 = J2(c4, 1), g2 = J2(d3, 1);
        d3 = J2(d3, 2);
        for (c4 = J2(c4, 2); !C3(d3); ) {
          var b4 = g2.add(d3);
          0 >= b4.l(f3) && (e5 = e5.add(c4), g2 = b4);
          d3 = J2(d3, 1);
          c4 = J2(c4, 1);
        }
        a3 = F2(f3, e5.j(a3));
        return new H3(e5, a3);
      }
      for (e5 = w2; 0 <= f3.l(a3); ) {
        c4 = Math.max(1, Math.floor(f3.m() / a3.m()));
        d3 = Math.ceil(Math.log(c4) / Math.LN2);
        d3 = 48 >= d3 ? 1 : Math.pow(2, d3 - 48);
        g2 = v3(c4);
        for (b4 = g2.j(a3); B2(b4) || 0 < b4.l(f3); ) c4 -= d3, g2 = v3(c4), b4 = g2.j(a3);
        C3(g2) && (g2 = z2);
        e5 = e5.add(g2);
        f3 = F2(f3, b4);
      }
      return new H3(e5, f3);
    }
    h3.A = function(f3) {
      return D2(this, f3).h;
    };
    h3.and = function(f3) {
      for (var a3 = Math.max(this.g.length, f3.g.length), c4 = [], d3 = 0; d3 < a3; d3++) c4[d3] = this.i(d3) & f3.i(d3);
      return new t4(c4, this.h & f3.h);
    };
    h3.or = function(f3) {
      for (var a3 = Math.max(this.g.length, f3.g.length), c4 = [], d3 = 0; d3 < a3; d3++) c4[d3] = this.i(d3) | f3.i(d3);
      return new t4(c4, this.h | f3.h);
    };
    h3.xor = function(f3) {
      for (var a3 = Math.max(this.g.length, f3.g.length), c4 = [], d3 = 0; d3 < a3; d3++) c4[d3] = this.i(d3) ^ f3.i(d3);
      return new t4(c4, this.h ^ f3.h);
    };
    function I2(f3) {
      for (var a3 = f3.g.length + 1, c4 = [], d3 = 0; d3 < a3; d3++) c4[d3] = f3.i(d3) << 1 | f3.i(d3 - 1) >>> 31;
      return new t4(c4, f3.h);
    }
    function J2(f3, a3) {
      var c4 = a3 >> 5;
      a3 %= 32;
      for (var d3 = f3.g.length - c4, e5 = [], g2 = 0; g2 < d3; g2++) e5[g2] = 0 < a3 ? f3.i(g2 + c4) >>> a3 | f3.i(g2 + c4 + 1) << 32 - a3 : f3.i(g2 + c4);
      return new t4(e5, f3.h);
    }
    m2.prototype.digest = m2.prototype.v;
    m2.prototype.reset = m2.prototype.s;
    m2.prototype.update = m2.prototype.u;
    Md5 = bloom_blob_es2018.Md5 = m2;
    t4.prototype.add = t4.prototype.add;
    t4.prototype.multiply = t4.prototype.j;
    t4.prototype.modulo = t4.prototype.A;
    t4.prototype.compare = t4.prototype.l;
    t4.prototype.toNumber = t4.prototype.m;
    t4.prototype.toString = t4.prototype.toString;
    t4.prototype.getBits = t4.prototype.i;
    t4.fromNumber = v3;
    t4.fromString = y3;
    Integer = bloom_blob_es2018.Integer = t4;
  }).apply(typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  // node_modules/.pnpm/@firebase+webchannel-wrapper@1.0.0/node_modules/@firebase/webchannel-wrapper/dist/webchannel-blob/esm/webchannel_blob_es2018.js
  var commonjsGlobal2 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var webchannel_blob_es2018 = {};
  var XhrIo;
  var FetchXmlHttpFactory;
  var WebChannel;
  var EventType;
  var ErrorCode;
  var Stat;
  var Event;
  var getStatEventTarget;
  var createWebChannelTransport;
  (function() {
    var h3, aa = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a3, b4, c4) {
      if (a3 == Array.prototype || a3 == Object.prototype) return a3;
      a3[b4] = c4.value;
      return a3;
    };
    function ba(a3) {
      a3 = ["object" == typeof globalThis && globalThis, a3, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof commonjsGlobal2 && commonjsGlobal2];
      for (var b4 = 0; b4 < a3.length; ++b4) {
        var c4 = a3[b4];
        if (c4 && c4.Math == Math) return c4;
      }
      throw Error("Cannot find global object");
    }
    var ca = ba(this);
    function da(a3, b4) {
      if (b4) a: {
        var c4 = ca;
        a3 = a3.split(".");
        for (var d3 = 0; d3 < a3.length - 1; d3++) {
          var e5 = a3[d3];
          if (!(e5 in c4)) break a;
          c4 = c4[e5];
        }
        a3 = a3[a3.length - 1];
        d3 = c4[a3];
        b4 = b4(d3);
        b4 != d3 && null != b4 && aa(c4, a3, { configurable: true, writable: true, value: b4 });
      }
    }
    function ea(a3, b4) {
      a3 instanceof String && (a3 += "");
      var c4 = 0, d3 = false, e5 = { next: function() {
        if (!d3 && c4 < a3.length) {
          var f3 = c4++;
          return { value: b4(f3, a3[f3]), done: false };
        }
        d3 = true;
        return { done: true, value: void 0 };
      } };
      e5[Symbol.iterator] = function() {
        return e5;
      };
      return e5;
    }
    da("Array.prototype.values", function(a3) {
      return a3 ? a3 : function() {
        return ea(this, function(b4, c4) {
          return c4;
        });
      };
    });
    var fa = fa || {}, k3 = this || self;
    function ha(a3) {
      var b4 = typeof a3;
      b4 = "object" != b4 ? b4 : a3 ? Array.isArray(a3) ? "array" : b4 : "null";
      return "array" == b4 || "object" == b4 && "number" == typeof a3.length;
    }
    function n5(a3) {
      var b4 = typeof a3;
      return "object" == b4 && null != a3 || "function" == b4;
    }
    function ia(a3, b4, c4) {
      return a3.call.apply(a3.bind, arguments);
    }
    function ja(a3, b4, c4) {
      if (!a3) throw Error();
      if (2 < arguments.length) {
        var d3 = Array.prototype.slice.call(arguments, 2);
        return function() {
          var e5 = Array.prototype.slice.call(arguments);
          Array.prototype.unshift.apply(e5, d3);
          return a3.apply(b4, e5);
        };
      }
      return function() {
        return a3.apply(b4, arguments);
      };
    }
    function p3(a3, b4, c4) {
      p3 = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ia : ja;
      return p3.apply(null, arguments);
    }
    function ka(a3, b4) {
      var c4 = Array.prototype.slice.call(arguments, 1);
      return function() {
        var d3 = c4.slice();
        d3.push.apply(d3, arguments);
        return a3.apply(this, d3);
      };
    }
    function r5(a3, b4) {
      function c4() {
      }
      c4.prototype = b4.prototype;
      a3.aa = b4.prototype;
      a3.prototype = new c4();
      a3.prototype.constructor = a3;
      a3.Qb = function(d3, e5, f3) {
        for (var g2 = Array(arguments.length - 2), m2 = 2; m2 < arguments.length; m2++) g2[m2 - 2] = arguments[m2];
        return b4.prototype[e5].apply(d3, g2);
      };
    }
    function la(a3) {
      const b4 = a3.length;
      if (0 < b4) {
        const c4 = Array(b4);
        for (let d3 = 0; d3 < b4; d3++) c4[d3] = a3[d3];
        return c4;
      }
      return [];
    }
    function ma(a3, b4) {
      for (let c4 = 1; c4 < arguments.length; c4++) {
        const d3 = arguments[c4];
        if (ha(d3)) {
          const e5 = a3.length || 0, f3 = d3.length || 0;
          a3.length = e5 + f3;
          for (let g2 = 0; g2 < f3; g2++) a3[e5 + g2] = d3[g2];
        } else a3.push(d3);
      }
    }
    class na {
      constructor(a3, b4) {
        this.i = a3;
        this.j = b4;
        this.h = 0;
        this.g = null;
      }
      get() {
        let a3;
        0 < this.h ? (this.h--, a3 = this.g, this.g = a3.next, a3.next = null) : a3 = this.i();
        return a3;
      }
    }
    function t4(a3) {
      return /^[\s\xa0]*$/.test(a3);
    }
    function u3() {
      var a3 = k3.navigator;
      return a3 && (a3 = a3.userAgent) ? a3 : "";
    }
    function oa(a3) {
      oa[" "](a3);
      return a3;
    }
    oa[" "] = function() {
    };
    var pa = -1 != u3().indexOf("Gecko") && !(-1 != u3().toLowerCase().indexOf("webkit") && -1 == u3().indexOf("Edge")) && !(-1 != u3().indexOf("Trident") || -1 != u3().indexOf("MSIE")) && -1 == u3().indexOf("Edge");
    function qa(a3, b4, c4) {
      for (const d3 in a3) b4.call(c4, a3[d3], d3, a3);
    }
    function ra(a3, b4) {
      for (const c4 in a3) b4.call(void 0, a3[c4], c4, a3);
    }
    function sa(a3) {
      const b4 = {};
      for (const c4 in a3) b4[c4] = a3[c4];
      return b4;
    }
    const ta = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
    function ua(a3, b4) {
      let c4, d3;
      for (let e5 = 1; e5 < arguments.length; e5++) {
        d3 = arguments[e5];
        for (c4 in d3) a3[c4] = d3[c4];
        for (let f3 = 0; f3 < ta.length; f3++) c4 = ta[f3], Object.prototype.hasOwnProperty.call(d3, c4) && (a3[c4] = d3[c4]);
      }
    }
    function va(a3) {
      var b4 = 1;
      a3 = a3.split(":");
      const c4 = [];
      for (; 0 < b4 && a3.length; ) c4.push(a3.shift()), b4--;
      a3.length && c4.push(a3.join(":"));
      return c4;
    }
    function wa(a3) {
      k3.setTimeout(() => {
        throw a3;
      }, 0);
    }
    function xa() {
      var a3 = za;
      let b4 = null;
      a3.g && (b4 = a3.g, a3.g = a3.g.next, a3.g || (a3.h = null), b4.next = null);
      return b4;
    }
    class Aa {
      constructor() {
        this.h = this.g = null;
      }
      add(a3, b4) {
        const c4 = Ba.get();
        c4.set(a3, b4);
        this.h ? this.h.next = c4 : this.g = c4;
        this.h = c4;
      }
    }
    var Ba = new na(() => new Ca(), (a3) => a3.reset());
    class Ca {
      constructor() {
        this.next = this.g = this.h = null;
      }
      set(a3, b4) {
        this.h = a3;
        this.g = b4;
        this.next = null;
      }
      reset() {
        this.next = this.g = this.h = null;
      }
    }
    let x3, y3 = false, za = new Aa(), Ea = () => {
      const a3 = k3.Promise.resolve(void 0);
      x3 = () => {
        a3.then(Da);
      };
    };
    var Da = () => {
      for (var a3; a3 = xa(); ) {
        try {
          a3.h.call(a3.g);
        } catch (c4) {
          wa(c4);
        }
        var b4 = Ba;
        b4.j(a3);
        100 > b4.h && (b4.h++, a3.next = b4.g, b4.g = a3);
      }
      y3 = false;
    };
    function z2() {
      this.s = this.s;
      this.C = this.C;
    }
    z2.prototype.s = false;
    z2.prototype.ma = function() {
      this.s || (this.s = true, this.N());
    };
    z2.prototype.N = function() {
      if (this.C) for (; this.C.length; ) this.C.shift()();
    };
    function A2(a3, b4) {
      this.type = a3;
      this.g = this.target = b4;
      this.defaultPrevented = false;
    }
    A2.prototype.h = function() {
      this.defaultPrevented = true;
    };
    var Fa = function() {
      if (!k3.addEventListener || !Object.defineProperty) return false;
      var a3 = false, b4 = Object.defineProperty({}, "passive", { get: function() {
        a3 = true;
      } });
      try {
        const c4 = () => {
        };
        k3.addEventListener("test", c4, b4);
        k3.removeEventListener("test", c4, b4);
      } catch (c4) {
      }
      return a3;
    }();
    function C3(a3, b4) {
      A2.call(this, a3 ? a3.type : "");
      this.relatedTarget = this.g = this.target = null;
      this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
      this.key = "";
      this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = false;
      this.state = null;
      this.pointerId = 0;
      this.pointerType = "";
      this.i = null;
      if (a3) {
        var c4 = this.type = a3.type, d3 = a3.changedTouches && a3.changedTouches.length ? a3.changedTouches[0] : null;
        this.target = a3.target || a3.srcElement;
        this.g = b4;
        if (b4 = a3.relatedTarget) {
          if (pa) {
            a: {
              try {
                oa(b4.nodeName);
                var e5 = true;
                break a;
              } catch (f3) {
              }
              e5 = false;
            }
            e5 || (b4 = null);
          }
        } else "mouseover" == c4 ? b4 = a3.fromElement : "mouseout" == c4 && (b4 = a3.toElement);
        this.relatedTarget = b4;
        d3 ? (this.clientX = void 0 !== d3.clientX ? d3.clientX : d3.pageX, this.clientY = void 0 !== d3.clientY ? d3.clientY : d3.pageY, this.screenX = d3.screenX || 0, this.screenY = d3.screenY || 0) : (this.clientX = void 0 !== a3.clientX ? a3.clientX : a3.pageX, this.clientY = void 0 !== a3.clientY ? a3.clientY : a3.pageY, this.screenX = a3.screenX || 0, this.screenY = a3.screenY || 0);
        this.button = a3.button;
        this.key = a3.key || "";
        this.ctrlKey = a3.ctrlKey;
        this.altKey = a3.altKey;
        this.shiftKey = a3.shiftKey;
        this.metaKey = a3.metaKey;
        this.pointerId = a3.pointerId || 0;
        this.pointerType = "string" === typeof a3.pointerType ? a3.pointerType : Ga[a3.pointerType] || "";
        this.state = a3.state;
        this.i = a3;
        a3.defaultPrevented && C3.aa.h.call(this);
      }
    }
    r5(C3, A2);
    var Ga = { 2: "touch", 3: "pen", 4: "mouse" };
    C3.prototype.h = function() {
      C3.aa.h.call(this);
      var a3 = this.i;
      a3.preventDefault ? a3.preventDefault() : a3.returnValue = false;
    };
    var D2 = "closure_listenable_" + (1e6 * Math.random() | 0);
    var Ha = 0;
    function Ia(a3, b4, c4, d3, e5) {
      this.listener = a3;
      this.proxy = null;
      this.src = b4;
      this.type = c4;
      this.capture = !!d3;
      this.ha = e5;
      this.key = ++Ha;
      this.da = this.fa = false;
    }
    function Ja(a3) {
      a3.da = true;
      a3.listener = null;
      a3.proxy = null;
      a3.src = null;
      a3.ha = null;
    }
    function Ka(a3) {
      this.src = a3;
      this.g = {};
      this.h = 0;
    }
    Ka.prototype.add = function(a3, b4, c4, d3, e5) {
      var f3 = a3.toString();
      a3 = this.g[f3];
      a3 || (a3 = this.g[f3] = [], this.h++);
      var g2 = La(a3, b4, d3, e5);
      -1 < g2 ? (b4 = a3[g2], c4 || (b4.fa = false)) : (b4 = new Ia(b4, this.src, f3, !!d3, e5), b4.fa = c4, a3.push(b4));
      return b4;
    };
    function Ma(a3, b4) {
      var c4 = b4.type;
      if (c4 in a3.g) {
        var d3 = a3.g[c4], e5 = Array.prototype.indexOf.call(d3, b4, void 0), f3;
        (f3 = 0 <= e5) && Array.prototype.splice.call(d3, e5, 1);
        f3 && (Ja(b4), 0 == a3.g[c4].length && (delete a3.g[c4], a3.h--));
      }
    }
    function La(a3, b4, c4, d3) {
      for (var e5 = 0; e5 < a3.length; ++e5) {
        var f3 = a3[e5];
        if (!f3.da && f3.listener == b4 && f3.capture == !!c4 && f3.ha == d3) return e5;
      }
      return -1;
    }
    var Na = "closure_lm_" + (1e6 * Math.random() | 0), Oa = {};
    function Qa(a3, b4, c4, d3, e5) {
      if (d3 && d3.once) return Ra(a3, b4, c4, d3, e5);
      if (Array.isArray(b4)) {
        for (var f3 = 0; f3 < b4.length; f3++) Qa(a3, b4[f3], c4, d3, e5);
        return null;
      }
      c4 = Sa(c4);
      return a3 && a3[D2] ? a3.K(b4, c4, n5(d3) ? !!d3.capture : !!d3, e5) : Ta(a3, b4, c4, false, d3, e5);
    }
    function Ta(a3, b4, c4, d3, e5, f3) {
      if (!b4) throw Error("Invalid event type");
      var g2 = n5(e5) ? !!e5.capture : !!e5, m2 = Ua(a3);
      m2 || (a3[Na] = m2 = new Ka(a3));
      c4 = m2.add(b4, c4, d3, g2, f3);
      if (c4.proxy) return c4;
      d3 = Va();
      c4.proxy = d3;
      d3.src = a3;
      d3.listener = c4;
      if (a3.addEventListener) Fa || (e5 = g2), void 0 === e5 && (e5 = false), a3.addEventListener(b4.toString(), d3, e5);
      else if (a3.attachEvent) a3.attachEvent(Wa(b4.toString()), d3);
      else if (a3.addListener && a3.removeListener) a3.addListener(d3);
      else throw Error("addEventListener and attachEvent are unavailable.");
      return c4;
    }
    function Va() {
      function a3(c4) {
        return b4.call(a3.src, a3.listener, c4);
      }
      const b4 = Xa;
      return a3;
    }
    function Ra(a3, b4, c4, d3, e5) {
      if (Array.isArray(b4)) {
        for (var f3 = 0; f3 < b4.length; f3++) Ra(a3, b4[f3], c4, d3, e5);
        return null;
      }
      c4 = Sa(c4);
      return a3 && a3[D2] ? a3.L(b4, c4, n5(d3) ? !!d3.capture : !!d3, e5) : Ta(a3, b4, c4, true, d3, e5);
    }
    function Ya(a3, b4, c4, d3, e5) {
      if (Array.isArray(b4)) for (var f3 = 0; f3 < b4.length; f3++) Ya(a3, b4[f3], c4, d3, e5);
      else (d3 = n5(d3) ? !!d3.capture : !!d3, c4 = Sa(c4), a3 && a3[D2]) ? (a3 = a3.i, b4 = String(b4).toString(), b4 in a3.g && (f3 = a3.g[b4], c4 = La(f3, c4, d3, e5), -1 < c4 && (Ja(f3[c4]), Array.prototype.splice.call(f3, c4, 1), 0 == f3.length && (delete a3.g[b4], a3.h--)))) : a3 && (a3 = Ua(a3)) && (b4 = a3.g[b4.toString()], a3 = -1, b4 && (a3 = La(b4, c4, d3, e5)), (c4 = -1 < a3 ? b4[a3] : null) && Za(c4));
    }
    function Za(a3) {
      if ("number" !== typeof a3 && a3 && !a3.da) {
        var b4 = a3.src;
        if (b4 && b4[D2]) Ma(b4.i, a3);
        else {
          var c4 = a3.type, d3 = a3.proxy;
          b4.removeEventListener ? b4.removeEventListener(c4, d3, a3.capture) : b4.detachEvent ? b4.detachEvent(Wa(c4), d3) : b4.addListener && b4.removeListener && b4.removeListener(d3);
          (c4 = Ua(b4)) ? (Ma(c4, a3), 0 == c4.h && (c4.src = null, b4[Na] = null)) : Ja(a3);
        }
      }
    }
    function Wa(a3) {
      return a3 in Oa ? Oa[a3] : Oa[a3] = "on" + a3;
    }
    function Xa(a3, b4) {
      if (a3.da) a3 = true;
      else {
        b4 = new C3(b4, this);
        var c4 = a3.listener, d3 = a3.ha || a3.src;
        a3.fa && Za(a3);
        a3 = c4.call(d3, b4);
      }
      return a3;
    }
    function Ua(a3) {
      a3 = a3[Na];
      return a3 instanceof Ka ? a3 : null;
    }
    var $a = "__closure_events_fn_" + (1e9 * Math.random() >>> 0);
    function Sa(a3) {
      if ("function" === typeof a3) return a3;
      a3[$a] || (a3[$a] = function(b4) {
        return a3.handleEvent(b4);
      });
      return a3[$a];
    }
    function E2() {
      z2.call(this);
      this.i = new Ka(this);
      this.M = this;
      this.F = null;
    }
    r5(E2, z2);
    E2.prototype[D2] = true;
    E2.prototype.removeEventListener = function(a3, b4, c4, d3) {
      Ya(this, a3, b4, c4, d3);
    };
    function F2(a3, b4) {
      var c4, d3 = a3.F;
      if (d3) for (c4 = []; d3; d3 = d3.F) c4.push(d3);
      a3 = a3.M;
      d3 = b4.type || b4;
      if ("string" === typeof b4) b4 = new A2(b4, a3);
      else if (b4 instanceof A2) b4.target = b4.target || a3;
      else {
        var e5 = b4;
        b4 = new A2(d3, a3);
        ua(b4, e5);
      }
      e5 = true;
      if (c4) for (var f3 = c4.length - 1; 0 <= f3; f3--) {
        var g2 = b4.g = c4[f3];
        e5 = ab(g2, d3, true, b4) && e5;
      }
      g2 = b4.g = a3;
      e5 = ab(g2, d3, true, b4) && e5;
      e5 = ab(g2, d3, false, b4) && e5;
      if (c4) for (f3 = 0; f3 < c4.length; f3++) g2 = b4.g = c4[f3], e5 = ab(g2, d3, false, b4) && e5;
    }
    E2.prototype.N = function() {
      E2.aa.N.call(this);
      if (this.i) {
        var a3 = this.i, c4;
        for (c4 in a3.g) {
          for (var d3 = a3.g[c4], e5 = 0; e5 < d3.length; e5++) Ja(d3[e5]);
          delete a3.g[c4];
          a3.h--;
        }
      }
      this.F = null;
    };
    E2.prototype.K = function(a3, b4, c4, d3) {
      return this.i.add(String(a3), b4, false, c4, d3);
    };
    E2.prototype.L = function(a3, b4, c4, d3) {
      return this.i.add(String(a3), b4, true, c4, d3);
    };
    function ab(a3, b4, c4, d3) {
      b4 = a3.i.g[String(b4)];
      if (!b4) return true;
      b4 = b4.concat();
      for (var e5 = true, f3 = 0; f3 < b4.length; ++f3) {
        var g2 = b4[f3];
        if (g2 && !g2.da && g2.capture == c4) {
          var m2 = g2.listener, q2 = g2.ha || g2.src;
          g2.fa && Ma(a3.i, g2);
          e5 = false !== m2.call(q2, d3) && e5;
        }
      }
      return e5 && !d3.defaultPrevented;
    }
    function bb(a3, b4, c4) {
      if ("function" === typeof a3) c4 && (a3 = p3(a3, c4));
      else if (a3 && "function" == typeof a3.handleEvent) a3 = p3(a3.handleEvent, a3);
      else throw Error("Invalid listener argument");
      return 2147483647 < Number(b4) ? -1 : k3.setTimeout(a3, b4 || 0);
    }
    function cb(a3) {
      a3.g = bb(() => {
        a3.g = null;
        a3.i && (a3.i = false, cb(a3));
      }, a3.l);
      const b4 = a3.h;
      a3.h = null;
      a3.m.apply(null, b4);
    }
    class eb extends z2 {
      constructor(a3, b4) {
        super();
        this.m = a3;
        this.l = b4;
        this.h = null;
        this.i = false;
        this.g = null;
      }
      j(a3) {
        this.h = arguments;
        this.g ? this.i = true : cb(this);
      }
      N() {
        super.N();
        this.g && (k3.clearTimeout(this.g), this.g = null, this.i = false, this.h = null);
      }
    }
    function G2(a3) {
      z2.call(this);
      this.h = a3;
      this.g = {};
    }
    r5(G2, z2);
    var fb = [];
    function gb(a3) {
      qa(a3.g, function(b4, c4) {
        this.g.hasOwnProperty(c4) && Za(b4);
      }, a3);
      a3.g = {};
    }
    G2.prototype.N = function() {
      G2.aa.N.call(this);
      gb(this);
    };
    G2.prototype.handleEvent = function() {
      throw Error("EventHandler.handleEvent not implemented");
    };
    var hb = k3.JSON.stringify;
    var ib = k3.JSON.parse;
    var jb = class {
      stringify(a3) {
        return k3.JSON.stringify(a3, void 0);
      }
      parse(a3) {
        return k3.JSON.parse(a3, void 0);
      }
    };
    function kb() {
    }
    kb.prototype.h = null;
    function lb(a3) {
      return a3.h || (a3.h = a3.i());
    }
    function mb() {
    }
    var H3 = { OPEN: "a", kb: "b", Ja: "c", wb: "d" };
    function nb() {
      A2.call(this, "d");
    }
    r5(nb, A2);
    function ob() {
      A2.call(this, "c");
    }
    r5(ob, A2);
    var I2 = {}, pb = null;
    function qb() {
      return pb = pb || new E2();
    }
    I2.La = "serverreachability";
    function rb(a3) {
      A2.call(this, I2.La, a3);
    }
    r5(rb, A2);
    function J2(a3) {
      const b4 = qb();
      F2(b4, new rb(b4));
    }
    I2.STAT_EVENT = "statevent";
    function sb(a3, b4) {
      A2.call(this, I2.STAT_EVENT, a3);
      this.stat = b4;
    }
    r5(sb, A2);
    function K2(a3) {
      const b4 = qb();
      F2(b4, new sb(b4, a3));
    }
    I2.Ma = "timingevent";
    function tb(a3, b4) {
      A2.call(this, I2.Ma, a3);
      this.size = b4;
    }
    r5(tb, A2);
    function ub(a3, b4) {
      if ("function" !== typeof a3) throw Error("Fn must not be null and must be a function");
      return k3.setTimeout(function() {
        a3();
      }, b4);
    }
    function vb() {
      this.g = true;
    }
    vb.prototype.xa = function() {
      this.g = false;
    };
    function wb(a3, b4, c4, d3, e5, f3) {
      a3.info(function() {
        if (a3.g) if (f3) {
          var g2 = "";
          for (var m2 = f3.split("&"), q2 = 0; q2 < m2.length; q2++) {
            var l3 = m2[q2].split("=");
            if (1 < l3.length) {
              var v3 = l3[0];
              l3 = l3[1];
              var w2 = v3.split("_");
              g2 = 2 <= w2.length && "type" == w2[1] ? g2 + (v3 + "=" + l3 + "&") : g2 + (v3 + "=redacted&");
            }
          }
        } else g2 = null;
        else g2 = f3;
        return "XMLHTTP REQ (" + d3 + ") [attempt " + e5 + "]: " + b4 + "\n" + c4 + "\n" + g2;
      });
    }
    function xb(a3, b4, c4, d3, e5, f3, g2) {
      a3.info(function() {
        return "XMLHTTP RESP (" + d3 + ") [ attempt " + e5 + "]: " + b4 + "\n" + c4 + "\n" + f3 + " " + g2;
      });
    }
    function L3(a3, b4, c4, d3) {
      a3.info(function() {
        return "XMLHTTP TEXT (" + b4 + "): " + yb(a3, c4) + (d3 ? " " + d3 : "");
      });
    }
    function zb(a3, b4) {
      a3.info(function() {
        return "TIMEOUT: " + b4;
      });
    }
    vb.prototype.info = function() {
    };
    function yb(a3, b4) {
      if (!a3.g) return b4;
      if (!b4) return null;
      try {
        var c4 = JSON.parse(b4);
        if (c4) {
          for (a3 = 0; a3 < c4.length; a3++) if (Array.isArray(c4[a3])) {
            var d3 = c4[a3];
            if (!(2 > d3.length)) {
              var e5 = d3[1];
              if (Array.isArray(e5) && !(1 > e5.length)) {
                var f3 = e5[0];
                if ("noop" != f3 && "stop" != f3 && "close" != f3) for (var g2 = 1; g2 < e5.length; g2++) e5[g2] = "";
              }
            }
          }
        }
        return hb(c4);
      } catch (m2) {
        return b4;
      }
    }
    var Ab = { NO_ERROR: 0, gb: 1, tb: 2, sb: 3, nb: 4, rb: 5, ub: 6, Ia: 7, TIMEOUT: 8, xb: 9 };
    var Bb = { lb: "complete", Hb: "success", Ja: "error", Ia: "abort", zb: "ready", Ab: "readystatechange", TIMEOUT: "timeout", vb: "incrementaldata", yb: "progress", ob: "downloadprogress", Pb: "uploadprogress" };
    var Cb;
    function Db() {
    }
    r5(Db, kb);
    Db.prototype.g = function() {
      return new XMLHttpRequest();
    };
    Db.prototype.i = function() {
      return {};
    };
    Cb = new Db();
    function M3(a3, b4, c4, d3) {
      this.j = a3;
      this.i = b4;
      this.l = c4;
      this.R = d3 || 1;
      this.U = new G2(this);
      this.I = 45e3;
      this.H = null;
      this.o = false;
      this.m = this.A = this.v = this.L = this.F = this.S = this.B = null;
      this.D = [];
      this.g = null;
      this.C = 0;
      this.s = this.u = null;
      this.X = -1;
      this.J = false;
      this.O = 0;
      this.M = null;
      this.W = this.K = this.T = this.P = false;
      this.h = new Eb();
    }
    function Eb() {
      this.i = null;
      this.g = "";
      this.h = false;
    }
    var Fb = {}, Gb = {};
    function Hb(a3, b4, c4) {
      a3.L = 1;
      a3.v = Ib(N3(b4));
      a3.m = c4;
      a3.P = true;
      Jb(a3, null);
    }
    function Jb(a3, b4) {
      a3.F = Date.now();
      Kb(a3);
      a3.A = N3(a3.v);
      var c4 = a3.A, d3 = a3.R;
      Array.isArray(d3) || (d3 = [String(d3)]);
      Lb(c4.i, "t", d3);
      a3.C = 0;
      c4 = a3.j.J;
      a3.h = new Eb();
      a3.g = Mb(a3.j, c4 ? b4 : null, !a3.m);
      0 < a3.O && (a3.M = new eb(p3(a3.Y, a3, a3.g), a3.O));
      b4 = a3.U;
      c4 = a3.g;
      d3 = a3.ca;
      var e5 = "readystatechange";
      Array.isArray(e5) || (e5 && (fb[0] = e5.toString()), e5 = fb);
      for (var f3 = 0; f3 < e5.length; f3++) {
        var g2 = Qa(c4, e5[f3], d3 || b4.handleEvent, false, b4.h || b4);
        if (!g2) break;
        b4.g[g2.key] = g2;
      }
      b4 = a3.H ? sa(a3.H) : {};
      a3.m ? (a3.u || (a3.u = "POST"), b4["Content-Type"] = "application/x-www-form-urlencoded", a3.g.ea(
        a3.A,
        a3.u,
        a3.m,
        b4
      )) : (a3.u = "GET", a3.g.ea(a3.A, a3.u, null, b4));
      J2();
      wb(a3.i, a3.u, a3.A, a3.l, a3.R, a3.m);
    }
    M3.prototype.ca = function(a3) {
      a3 = a3.target;
      const b4 = this.M;
      b4 && 3 == P2(a3) ? b4.j() : this.Y(a3);
    };
    M3.prototype.Y = function(a3) {
      try {
        if (a3 == this.g) a: {
          const w2 = P2(this.g);
          var b4 = this.g.Ba();
          const O2 = this.g.Z();
          if (!(3 > w2) && (3 != w2 || this.g && (this.h.h || this.g.oa() || Nb(this.g)))) {
            this.J || 4 != w2 || 7 == b4 || (8 == b4 || 0 >= O2 ? J2(3) : J2(2));
            Ob(this);
            var c4 = this.g.Z();
            this.X = c4;
            b: if (Pb(this)) {
              var d3 = Nb(this.g);
              a3 = "";
              var e5 = d3.length, f3 = 4 == P2(this.g);
              if (!this.h.i) {
                if ("undefined" === typeof TextDecoder) {
                  Q2(this);
                  Qb(this);
                  var g2 = "";
                  break b;
                }
                this.h.i = new k3.TextDecoder();
              }
              for (b4 = 0; b4 < e5; b4++) this.h.h = true, a3 += this.h.i.decode(d3[b4], { stream: !(f3 && b4 == e5 - 1) });
              d3.length = 0;
              this.h.g += a3;
              this.C = 0;
              g2 = this.h.g;
            } else g2 = this.g.oa();
            this.o = 200 == c4;
            xb(this.i, this.u, this.A, this.l, this.R, w2, c4);
            if (this.o) {
              if (this.T && !this.K) {
                b: {
                  if (this.g) {
                    var m2, q2 = this.g;
                    if ((m2 = q2.g ? q2.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !t4(m2)) {
                      var l3 = m2;
                      break b;
                    }
                  }
                  l3 = null;
                }
                if (c4 = l3) L3(this.i, this.l, c4, "Initial handshake response via X-HTTP-Initial-Response"), this.K = true, Rb(this, c4);
                else {
                  this.o = false;
                  this.s = 3;
                  K2(12);
                  Q2(this);
                  Qb(this);
                  break a;
                }
              }
              if (this.P) {
                c4 = true;
                let B2;
                for (; !this.J && this.C < g2.length; ) if (B2 = Sb(this, g2), B2 == Gb) {
                  4 == w2 && (this.s = 4, K2(14), c4 = false);
                  L3(this.i, this.l, null, "[Incomplete Response]");
                  break;
                } else if (B2 == Fb) {
                  this.s = 4;
                  K2(15);
                  L3(this.i, this.l, g2, "[Invalid Chunk]");
                  c4 = false;
                  break;
                } else L3(this.i, this.l, B2, null), Rb(this, B2);
                Pb(this) && 0 != this.C && (this.h.g = this.h.g.slice(this.C), this.C = 0);
                4 != w2 || 0 != g2.length || this.h.h || (this.s = 1, K2(16), c4 = false);
                this.o = this.o && c4;
                if (!c4) L3(this.i, this.l, g2, "[Invalid Chunked Response]"), Q2(this), Qb(this);
                else if (0 < g2.length && !this.W) {
                  this.W = true;
                  var v3 = this.j;
                  v3.g == this && v3.ba && !v3.M && (v3.j.info("Great, no buffering proxy detected. Bytes received: " + g2.length), Tb(v3), v3.M = true, K2(11));
                }
              } else L3(this.i, this.l, g2, null), Rb(this, g2);
              4 == w2 && Q2(this);
              this.o && !this.J && (4 == w2 ? Ub(this.j, this) : (this.o = false, Kb(this)));
            } else Vb(this.g), 400 == c4 && 0 < g2.indexOf("Unknown SID") ? (this.s = 3, K2(12)) : (this.s = 0, K2(13)), Q2(this), Qb(this);
          }
        }
      } catch (w2) {
      } finally {
      }
    };
    function Pb(a3) {
      return a3.g ? "GET" == a3.u && 2 != a3.L && a3.j.Ca : false;
    }
    function Sb(a3, b4) {
      var c4 = a3.C, d3 = b4.indexOf("\n", c4);
      if (-1 == d3) return Gb;
      c4 = Number(b4.substring(c4, d3));
      if (isNaN(c4)) return Fb;
      d3 += 1;
      if (d3 + c4 > b4.length) return Gb;
      b4 = b4.slice(d3, d3 + c4);
      a3.C = d3 + c4;
      return b4;
    }
    M3.prototype.cancel = function() {
      this.J = true;
      Q2(this);
    };
    function Kb(a3) {
      a3.S = Date.now() + a3.I;
      Wb(a3, a3.I);
    }
    function Wb(a3, b4) {
      if (null != a3.B) throw Error("WatchDog timer not null");
      a3.B = ub(p3(a3.ba, a3), b4);
    }
    function Ob(a3) {
      a3.B && (k3.clearTimeout(a3.B), a3.B = null);
    }
    M3.prototype.ba = function() {
      this.B = null;
      const a3 = Date.now();
      0 <= a3 - this.S ? (zb(this.i, this.A), 2 != this.L && (J2(), K2(17)), Q2(this), this.s = 2, Qb(this)) : Wb(this, this.S - a3);
    };
    function Qb(a3) {
      0 == a3.j.G || a3.J || Ub(a3.j, a3);
    }
    function Q2(a3) {
      Ob(a3);
      var b4 = a3.M;
      b4 && "function" == typeof b4.ma && b4.ma();
      a3.M = null;
      gb(a3.U);
      a3.g && (b4 = a3.g, a3.g = null, b4.abort(), b4.ma());
    }
    function Rb(a3, b4) {
      try {
        var c4 = a3.j;
        if (0 != c4.G && (c4.g == a3 || Xb(c4.h, a3))) {
          if (!a3.K && Xb(c4.h, a3) && 3 == c4.G) {
            try {
              var d3 = c4.Da.g.parse(b4);
            } catch (l3) {
              d3 = null;
            }
            if (Array.isArray(d3) && 3 == d3.length) {
              var e5 = d3;
              if (0 == e5[0]) a: {
                if (!c4.u) {
                  if (c4.g) if (c4.g.F + 3e3 < a3.F) Yb(c4), Zb(c4);
                  else break a;
                  $b(c4);
                  K2(18);
                }
              }
              else c4.za = e5[1], 0 < c4.za - c4.T && 37500 > e5[2] && c4.F && 0 == c4.v && !c4.C && (c4.C = ub(p3(c4.Za, c4), 6e3));
              if (1 >= ac(c4.h) && c4.ca) {
                try {
                  c4.ca();
                } catch (l3) {
                }
                c4.ca = void 0;
              }
            } else R2(c4, 11);
          } else if ((a3.K || c4.g == a3) && Yb(c4), !t4(b4)) for (e5 = c4.Da.g.parse(b4), b4 = 0; b4 < e5.length; b4++) {
            let l3 = e5[b4];
            c4.T = l3[0];
            l3 = l3[1];
            if (2 == c4.G) if ("c" == l3[0]) {
              c4.K = l3[1];
              c4.ia = l3[2];
              const v3 = l3[3];
              null != v3 && (c4.la = v3, c4.j.info("VER=" + c4.la));
              const w2 = l3[4];
              null != w2 && (c4.Aa = w2, c4.j.info("SVER=" + c4.Aa));
              const O2 = l3[5];
              null != O2 && "number" === typeof O2 && 0 < O2 && (d3 = 1.5 * O2, c4.L = d3, c4.j.info("backChannelRequestTimeoutMs_=" + d3));
              d3 = c4;
              const B2 = a3.g;
              if (B2) {
                const ya = B2.g ? B2.g.getResponseHeader("X-Client-Wire-Protocol") : null;
                if (ya) {
                  var f3 = d3.h;
                  f3.g || -1 == ya.indexOf("spdy") && -1 == ya.indexOf("quic") && -1 == ya.indexOf("h2") || (f3.j = f3.l, f3.g = /* @__PURE__ */ new Set(), f3.h && (bc(f3, f3.h), f3.h = null));
                }
                if (d3.D) {
                  const db = B2.g ? B2.g.getResponseHeader("X-HTTP-Session-Id") : null;
                  db && (d3.ya = db, S4(d3.I, d3.D, db));
                }
              }
              c4.G = 3;
              c4.l && c4.l.ua();
              c4.ba && (c4.R = Date.now() - a3.F, c4.j.info("Handshake RTT: " + c4.R + "ms"));
              d3 = c4;
              var g2 = a3;
              d3.qa = cc(d3, d3.J ? d3.ia : null, d3.W);
              if (g2.K) {
                dc(d3.h, g2);
                var m2 = g2, q2 = d3.L;
                q2 && (m2.I = q2);
                m2.B && (Ob(m2), Kb(m2));
                d3.g = g2;
              } else ec(d3);
              0 < c4.i.length && fc(c4);
            } else "stop" != l3[0] && "close" != l3[0] || R2(c4, 7);
            else 3 == c4.G && ("stop" == l3[0] || "close" == l3[0] ? "stop" == l3[0] ? R2(c4, 7) : gc(c4) : "noop" != l3[0] && c4.l && c4.l.ta(l3), c4.v = 0);
          }
        }
        J2(4);
      } catch (l3) {
      }
    }
    var hc = class {
      constructor(a3, b4) {
        this.g = a3;
        this.map = b4;
      }
    };
    function ic(a3) {
      this.l = a3 || 10;
      k3.PerformanceNavigationTiming ? (a3 = k3.performance.getEntriesByType("navigation"), a3 = 0 < a3.length && ("hq" == a3[0].nextHopProtocol || "h2" == a3[0].nextHopProtocol)) : a3 = !!(k3.chrome && k3.chrome.loadTimes && k3.chrome.loadTimes() && k3.chrome.loadTimes().wasFetchedViaSpdy);
      this.j = a3 ? this.l : 1;
      this.g = null;
      1 < this.j && (this.g = /* @__PURE__ */ new Set());
      this.h = null;
      this.i = [];
    }
    function jc(a3) {
      return a3.h ? true : a3.g ? a3.g.size >= a3.j : false;
    }
    function ac(a3) {
      return a3.h ? 1 : a3.g ? a3.g.size : 0;
    }
    function Xb(a3, b4) {
      return a3.h ? a3.h == b4 : a3.g ? a3.g.has(b4) : false;
    }
    function bc(a3, b4) {
      a3.g ? a3.g.add(b4) : a3.h = b4;
    }
    function dc(a3, b4) {
      a3.h && a3.h == b4 ? a3.h = null : a3.g && a3.g.has(b4) && a3.g.delete(b4);
    }
    ic.prototype.cancel = function() {
      this.i = kc(this);
      if (this.h) this.h.cancel(), this.h = null;
      else if (this.g && 0 !== this.g.size) {
        for (const a3 of this.g.values()) a3.cancel();
        this.g.clear();
      }
    };
    function kc(a3) {
      if (null != a3.h) return a3.i.concat(a3.h.D);
      if (null != a3.g && 0 !== a3.g.size) {
        let b4 = a3.i;
        for (const c4 of a3.g.values()) b4 = b4.concat(c4.D);
        return b4;
      }
      return la(a3.i);
    }
    function lc(a3) {
      if (a3.V && "function" == typeof a3.V) return a3.V();
      if ("undefined" !== typeof Map && a3 instanceof Map || "undefined" !== typeof Set && a3 instanceof Set) return Array.from(a3.values());
      if ("string" === typeof a3) return a3.split("");
      if (ha(a3)) {
        for (var b4 = [], c4 = a3.length, d3 = 0; d3 < c4; d3++) b4.push(a3[d3]);
        return b4;
      }
      b4 = [];
      c4 = 0;
      for (d3 in a3) b4[c4++] = a3[d3];
      return b4;
    }
    function mc(a3) {
      if (a3.na && "function" == typeof a3.na) return a3.na();
      if (!a3.V || "function" != typeof a3.V) {
        if ("undefined" !== typeof Map && a3 instanceof Map) return Array.from(a3.keys());
        if (!("undefined" !== typeof Set && a3 instanceof Set)) {
          if (ha(a3) || "string" === typeof a3) {
            var b4 = [];
            a3 = a3.length;
            for (var c4 = 0; c4 < a3; c4++) b4.push(c4);
            return b4;
          }
          b4 = [];
          c4 = 0;
          for (const d3 in a3) b4[c4++] = d3;
          return b4;
        }
      }
    }
    function nc(a3, b4) {
      if (a3.forEach && "function" == typeof a3.forEach) a3.forEach(b4, void 0);
      else if (ha(a3) || "string" === typeof a3) Array.prototype.forEach.call(a3, b4, void 0);
      else for (var c4 = mc(a3), d3 = lc(a3), e5 = d3.length, f3 = 0; f3 < e5; f3++) b4.call(void 0, d3[f3], c4 && c4[f3], a3);
    }
    var oc = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
    function pc(a3, b4) {
      if (a3) {
        a3 = a3.split("&");
        for (var c4 = 0; c4 < a3.length; c4++) {
          var d3 = a3[c4].indexOf("="), e5 = null;
          if (0 <= d3) {
            var f3 = a3[c4].substring(0, d3);
            e5 = a3[c4].substring(d3 + 1);
          } else f3 = a3[c4];
          b4(f3, e5 ? decodeURIComponent(e5.replace(/\+/g, " ")) : "");
        }
      }
    }
    function T2(a3) {
      this.g = this.o = this.j = "";
      this.s = null;
      this.m = this.l = "";
      this.h = false;
      if (a3 instanceof T2) {
        this.h = a3.h;
        qc(this, a3.j);
        this.o = a3.o;
        this.g = a3.g;
        rc(this, a3.s);
        this.l = a3.l;
        var b4 = a3.i;
        var c4 = new sc();
        c4.i = b4.i;
        b4.g && (c4.g = new Map(b4.g), c4.h = b4.h);
        tc(this, c4);
        this.m = a3.m;
      } else a3 && (b4 = String(a3).match(oc)) ? (this.h = false, qc(this, b4[1] || "", true), this.o = uc(b4[2] || ""), this.g = uc(b4[3] || "", true), rc(this, b4[4]), this.l = uc(b4[5] || "", true), tc(this, b4[6] || "", true), this.m = uc(b4[7] || "")) : (this.h = false, this.i = new sc(null, this.h));
    }
    T2.prototype.toString = function() {
      var a3 = [], b4 = this.j;
      b4 && a3.push(vc(b4, wc, true), ":");
      var c4 = this.g;
      if (c4 || "file" == b4) a3.push("//"), (b4 = this.o) && a3.push(vc(b4, wc, true), "@"), a3.push(encodeURIComponent(String(c4)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c4 = this.s, null != c4 && a3.push(":", String(c4));
      if (c4 = this.l) this.g && "/" != c4.charAt(0) && a3.push("/"), a3.push(vc(c4, "/" == c4.charAt(0) ? xc : yc, true));
      (c4 = this.i.toString()) && a3.push("?", c4);
      (c4 = this.m) && a3.push("#", vc(c4, zc));
      return a3.join("");
    };
    function N3(a3) {
      return new T2(a3);
    }
    function qc(a3, b4, c4) {
      a3.j = c4 ? uc(b4, true) : b4;
      a3.j && (a3.j = a3.j.replace(/:$/, ""));
    }
    function rc(a3, b4) {
      if (b4) {
        b4 = Number(b4);
        if (isNaN(b4) || 0 > b4) throw Error("Bad port number " + b4);
        a3.s = b4;
      } else a3.s = null;
    }
    function tc(a3, b4, c4) {
      b4 instanceof sc ? (a3.i = b4, Ac(a3.i, a3.h)) : (c4 || (b4 = vc(b4, Bc)), a3.i = new sc(b4, a3.h));
    }
    function S4(a3, b4, c4) {
      a3.i.set(b4, c4);
    }
    function Ib(a3) {
      S4(a3, "zx", Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ Date.now()).toString(36));
      return a3;
    }
    function uc(a3, b4) {
      return a3 ? b4 ? decodeURI(a3.replace(/%25/g, "%2525")) : decodeURIComponent(a3) : "";
    }
    function vc(a3, b4, c4) {
      return "string" === typeof a3 ? (a3 = encodeURI(a3).replace(b4, Cc), c4 && (a3 = a3.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a3) : null;
    }
    function Cc(a3) {
      a3 = a3.charCodeAt(0);
      return "%" + (a3 >> 4 & 15).toString(16) + (a3 & 15).toString(16);
    }
    var wc = /[#\/\?@]/g, yc = /[#\?:]/g, xc = /[#\?]/g, Bc = /[#\?@]/g, zc = /#/g;
    function sc(a3, b4) {
      this.h = this.g = null;
      this.i = a3 || null;
      this.j = !!b4;
    }
    function U2(a3) {
      a3.g || (a3.g = /* @__PURE__ */ new Map(), a3.h = 0, a3.i && pc(a3.i, function(b4, c4) {
        a3.add(decodeURIComponent(b4.replace(/\+/g, " ")), c4);
      }));
    }
    h3 = sc.prototype;
    h3.add = function(a3, b4) {
      U2(this);
      this.i = null;
      a3 = V2(this, a3);
      var c4 = this.g.get(a3);
      c4 || this.g.set(a3, c4 = []);
      c4.push(b4);
      this.h += 1;
      return this;
    };
    function Dc(a3, b4) {
      U2(a3);
      b4 = V2(a3, b4);
      a3.g.has(b4) && (a3.i = null, a3.h -= a3.g.get(b4).length, a3.g.delete(b4));
    }
    function Ec(a3, b4) {
      U2(a3);
      b4 = V2(a3, b4);
      return a3.g.has(b4);
    }
    h3.forEach = function(a3, b4) {
      U2(this);
      this.g.forEach(function(c4, d3) {
        c4.forEach(function(e5) {
          a3.call(b4, e5, d3, this);
        }, this);
      }, this);
    };
    h3.na = function() {
      U2(this);
      const a3 = Array.from(this.g.values()), b4 = Array.from(this.g.keys()), c4 = [];
      for (let d3 = 0; d3 < b4.length; d3++) {
        const e5 = a3[d3];
        for (let f3 = 0; f3 < e5.length; f3++) c4.push(b4[d3]);
      }
      return c4;
    };
    h3.V = function(a3) {
      U2(this);
      let b4 = [];
      if ("string" === typeof a3) Ec(this, a3) && (b4 = b4.concat(this.g.get(V2(this, a3))));
      else {
        a3 = Array.from(this.g.values());
        for (let c4 = 0; c4 < a3.length; c4++) b4 = b4.concat(a3[c4]);
      }
      return b4;
    };
    h3.set = function(a3, b4) {
      U2(this);
      this.i = null;
      a3 = V2(this, a3);
      Ec(this, a3) && (this.h -= this.g.get(a3).length);
      this.g.set(a3, [b4]);
      this.h += 1;
      return this;
    };
    h3.get = function(a3, b4) {
      if (!a3) return b4;
      a3 = this.V(a3);
      return 0 < a3.length ? String(a3[0]) : b4;
    };
    function Lb(a3, b4, c4) {
      Dc(a3, b4);
      0 < c4.length && (a3.i = null, a3.g.set(V2(a3, b4), la(c4)), a3.h += c4.length);
    }
    h3.toString = function() {
      if (this.i) return this.i;
      if (!this.g) return "";
      const a3 = [], b4 = Array.from(this.g.keys());
      for (var c4 = 0; c4 < b4.length; c4++) {
        var d3 = b4[c4];
        const f3 = encodeURIComponent(String(d3)), g2 = this.V(d3);
        for (d3 = 0; d3 < g2.length; d3++) {
          var e5 = f3;
          "" !== g2[d3] && (e5 += "=" + encodeURIComponent(String(g2[d3])));
          a3.push(e5);
        }
      }
      return this.i = a3.join("&");
    };
    function V2(a3, b4) {
      b4 = String(b4);
      a3.j && (b4 = b4.toLowerCase());
      return b4;
    }
    function Ac(a3, b4) {
      b4 && !a3.j && (U2(a3), a3.i = null, a3.g.forEach(function(c4, d3) {
        var e5 = d3.toLowerCase();
        d3 != e5 && (Dc(this, d3), Lb(this, e5, c4));
      }, a3));
      a3.j = b4;
    }
    function Fc(a3, b4) {
      const c4 = new vb();
      if (k3.Image) {
        const d3 = new Image();
        d3.onload = ka(W2, c4, "TestLoadImage: loaded", true, b4, d3);
        d3.onerror = ka(W2, c4, "TestLoadImage: error", false, b4, d3);
        d3.onabort = ka(W2, c4, "TestLoadImage: abort", false, b4, d3);
        d3.ontimeout = ka(W2, c4, "TestLoadImage: timeout", false, b4, d3);
        k3.setTimeout(function() {
          if (d3.ontimeout) d3.ontimeout();
        }, 1e4);
        d3.src = a3;
      } else b4(false);
    }
    function Gc(a3, b4) {
      const c4 = new vb(), d3 = new AbortController(), e5 = setTimeout(() => {
        d3.abort();
        W2(c4, "TestPingServer: timeout", false, b4);
      }, 1e4);
      fetch(a3, { signal: d3.signal }).then((f3) => {
        clearTimeout(e5);
        f3.ok ? W2(c4, "TestPingServer: ok", true, b4) : W2(c4, "TestPingServer: server error", false, b4);
      }).catch(() => {
        clearTimeout(e5);
        W2(c4, "TestPingServer: error", false, b4);
      });
    }
    function W2(a3, b4, c4, d3, e5) {
      try {
        e5 && (e5.onload = null, e5.onerror = null, e5.onabort = null, e5.ontimeout = null), d3(c4);
      } catch (f3) {
      }
    }
    function Hc() {
      this.g = new jb();
    }
    function Ic(a3, b4, c4) {
      const d3 = c4 || "";
      try {
        nc(a3, function(e5, f3) {
          let g2 = e5;
          n5(e5) && (g2 = hb(e5));
          b4.push(d3 + f3 + "=" + encodeURIComponent(g2));
        });
      } catch (e5) {
        throw b4.push(d3 + "type=" + encodeURIComponent("_badmap")), e5;
      }
    }
    function Jc(a3) {
      this.l = a3.Ub || null;
      this.j = a3.eb || false;
    }
    r5(Jc, kb);
    Jc.prototype.g = function() {
      return new Kc(this.l, this.j);
    };
    Jc.prototype.i = /* @__PURE__ */ function(a3) {
      return function() {
        return a3;
      };
    }({});
    function Kc(a3, b4) {
      E2.call(this);
      this.D = a3;
      this.o = b4;
      this.m = void 0;
      this.status = this.readyState = 0;
      this.responseType = this.responseText = this.response = this.statusText = "";
      this.onreadystatechange = null;
      this.u = new Headers();
      this.h = null;
      this.B = "GET";
      this.A = "";
      this.g = false;
      this.v = this.j = this.l = null;
    }
    r5(Kc, E2);
    h3 = Kc.prototype;
    h3.open = function(a3, b4) {
      if (0 != this.readyState) throw this.abort(), Error("Error reopening a connection");
      this.B = a3;
      this.A = b4;
      this.readyState = 1;
      Lc(this);
    };
    h3.send = function(a3) {
      if (1 != this.readyState) throw this.abort(), Error("need to call open() first. ");
      this.g = true;
      const b4 = { headers: this.u, method: this.B, credentials: this.m, cache: void 0 };
      a3 && (b4.body = a3);
      (this.D || k3).fetch(new Request(this.A, b4)).then(this.Sa.bind(this), this.ga.bind(this));
    };
    h3.abort = function() {
      this.response = this.responseText = "";
      this.u = new Headers();
      this.status = 0;
      this.j && this.j.cancel("Request was aborted.").catch(() => {
      });
      1 <= this.readyState && this.g && 4 != this.readyState && (this.g = false, Mc(this));
      this.readyState = 0;
    };
    h3.Sa = function(a3) {
      if (this.g && (this.l = a3, this.h || (this.status = this.l.status, this.statusText = this.l.statusText, this.h = a3.headers, this.readyState = 2, Lc(this)), this.g && (this.readyState = 3, Lc(this), this.g))) if ("arraybuffer" === this.responseType) a3.arrayBuffer().then(this.Qa.bind(this), this.ga.bind(this));
      else if ("undefined" !== typeof k3.ReadableStream && "body" in a3) {
        this.j = a3.body.getReader();
        if (this.o) {
          if (this.responseType) throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
          this.response = [];
        } else this.response = this.responseText = "", this.v = new TextDecoder();
        Nc(this);
      } else a3.text().then(this.Ra.bind(this), this.ga.bind(this));
    };
    function Nc(a3) {
      a3.j.read().then(a3.Pa.bind(a3)).catch(a3.ga.bind(a3));
    }
    h3.Pa = function(a3) {
      if (this.g) {
        if (this.o && a3.value) this.response.push(a3.value);
        else if (!this.o) {
          var b4 = a3.value ? a3.value : new Uint8Array(0);
          if (b4 = this.v.decode(b4, { stream: !a3.done })) this.response = this.responseText += b4;
        }
        a3.done ? Mc(this) : Lc(this);
        3 == this.readyState && Nc(this);
      }
    };
    h3.Ra = function(a3) {
      this.g && (this.response = this.responseText = a3, Mc(this));
    };
    h3.Qa = function(a3) {
      this.g && (this.response = a3, Mc(this));
    };
    h3.ga = function() {
      this.g && Mc(this);
    };
    function Mc(a3) {
      a3.readyState = 4;
      a3.l = null;
      a3.j = null;
      a3.v = null;
      Lc(a3);
    }
    h3.setRequestHeader = function(a3, b4) {
      this.u.append(a3, b4);
    };
    h3.getResponseHeader = function(a3) {
      return this.h ? this.h.get(a3.toLowerCase()) || "" : "";
    };
    h3.getAllResponseHeaders = function() {
      if (!this.h) return "";
      const a3 = [], b4 = this.h.entries();
      for (var c4 = b4.next(); !c4.done; ) c4 = c4.value, a3.push(c4[0] + ": " + c4[1]), c4 = b4.next();
      return a3.join("\r\n");
    };
    function Lc(a3) {
      a3.onreadystatechange && a3.onreadystatechange.call(a3);
    }
    Object.defineProperty(Kc.prototype, "withCredentials", { get: function() {
      return "include" === this.m;
    }, set: function(a3) {
      this.m = a3 ? "include" : "same-origin";
    } });
    function Oc(a3) {
      let b4 = "";
      qa(a3, function(c4, d3) {
        b4 += d3;
        b4 += ":";
        b4 += c4;
        b4 += "\r\n";
      });
      return b4;
    }
    function Pc(a3, b4, c4) {
      a: {
        for (d3 in c4) {
          var d3 = false;
          break a;
        }
        d3 = true;
      }
      d3 || (c4 = Oc(c4), "string" === typeof a3 ? null != c4 && encodeURIComponent(String(c4)) : S4(a3, b4, c4));
    }
    function X2(a3) {
      E2.call(this);
      this.headers = /* @__PURE__ */ new Map();
      this.o = a3 || null;
      this.h = false;
      this.v = this.g = null;
      this.D = "";
      this.m = 0;
      this.l = "";
      this.j = this.B = this.u = this.A = false;
      this.I = null;
      this.H = "";
      this.J = false;
    }
    r5(X2, E2);
    var Qc = /^https?$/i, Rc = ["POST", "PUT"];
    h3 = X2.prototype;
    h3.Ha = function(a3) {
      this.J = a3;
    };
    h3.ea = function(a3, b4, c4, d3) {
      if (this.g) throw Error("[goog.net.XhrIo] Object is active with another request=" + this.D + "; newUri=" + a3);
      b4 = b4 ? b4.toUpperCase() : "GET";
      this.D = a3;
      this.l = "";
      this.m = 0;
      this.A = false;
      this.h = true;
      this.g = this.o ? this.o.g() : Cb.g();
      this.v = this.o ? lb(this.o) : lb(Cb);
      this.g.onreadystatechange = p3(this.Ea, this);
      try {
        this.B = true, this.g.open(b4, String(a3), true), this.B = false;
      } catch (f3) {
        Sc(this, f3);
        return;
      }
      a3 = c4 || "";
      c4 = new Map(this.headers);
      if (d3) if (Object.getPrototypeOf(d3) === Object.prototype) for (var e5 in d3) c4.set(e5, d3[e5]);
      else if ("function" === typeof d3.keys && "function" === typeof d3.get) for (const f3 of d3.keys()) c4.set(f3, d3.get(f3));
      else throw Error("Unknown input type for opt_headers: " + String(d3));
      d3 = Array.from(c4.keys()).find((f3) => "content-type" == f3.toLowerCase());
      e5 = k3.FormData && a3 instanceof k3.FormData;
      !(0 <= Array.prototype.indexOf.call(Rc, b4, void 0)) || d3 || e5 || c4.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
      for (const [f3, g2] of c4) this.g.setRequestHeader(f3, g2);
      this.H && (this.g.responseType = this.H);
      "withCredentials" in this.g && this.g.withCredentials !== this.J && (this.g.withCredentials = this.J);
      try {
        Tc(this), this.u = true, this.g.send(a3), this.u = false;
      } catch (f3) {
        Sc(this, f3);
      }
    };
    function Sc(a3, b4) {
      a3.h = false;
      a3.g && (a3.j = true, a3.g.abort(), a3.j = false);
      a3.l = b4;
      a3.m = 5;
      Uc(a3);
      Vc(a3);
    }
    function Uc(a3) {
      a3.A || (a3.A = true, F2(a3, "complete"), F2(a3, "error"));
    }
    h3.abort = function(a3) {
      this.g && this.h && (this.h = false, this.j = true, this.g.abort(), this.j = false, this.m = a3 || 7, F2(this, "complete"), F2(this, "abort"), Vc(this));
    };
    h3.N = function() {
      this.g && (this.h && (this.h = false, this.j = true, this.g.abort(), this.j = false), Vc(this, true));
      X2.aa.N.call(this);
    };
    h3.Ea = function() {
      this.s || (this.B || this.u || this.j ? Wc(this) : this.bb());
    };
    h3.bb = function() {
      Wc(this);
    };
    function Wc(a3) {
      if (a3.h && "undefined" != typeof fa && (!a3.v[1] || 4 != P2(a3) || 2 != a3.Z())) {
        if (a3.u && 4 == P2(a3)) bb(a3.Ea, 0, a3);
        else if (F2(a3, "readystatechange"), 4 == P2(a3)) {
          a3.h = false;
          try {
            const g2 = a3.Z();
            a: switch (g2) {
              case 200:
              case 201:
              case 202:
              case 204:
              case 206:
              case 304:
              case 1223:
                var b4 = true;
                break a;
              default:
                b4 = false;
            }
            var c4;
            if (!(c4 = b4)) {
              var d3;
              if (d3 = 0 === g2) {
                var e5 = String(a3.D).match(oc)[1] || null;
                !e5 && k3.self && k3.self.location && (e5 = k3.self.location.protocol.slice(0, -1));
                d3 = !Qc.test(e5 ? e5.toLowerCase() : "");
              }
              c4 = d3;
            }
            if (c4) F2(a3, "complete"), F2(a3, "success");
            else {
              a3.m = 6;
              try {
                var f3 = 2 < P2(a3) ? a3.g.statusText : "";
              } catch (m2) {
                f3 = "";
              }
              a3.l = f3 + " [" + a3.Z() + "]";
              Uc(a3);
            }
          } finally {
            Vc(a3);
          }
        }
      }
    }
    function Vc(a3, b4) {
      if (a3.g) {
        Tc(a3);
        const c4 = a3.g, d3 = a3.v[0] ? () => {
        } : null;
        a3.g = null;
        a3.v = null;
        b4 || F2(a3, "ready");
        try {
          c4.onreadystatechange = d3;
        } catch (e5) {
        }
      }
    }
    function Tc(a3) {
      a3.I && (k3.clearTimeout(a3.I), a3.I = null);
    }
    h3.isActive = function() {
      return !!this.g;
    };
    function P2(a3) {
      return a3.g ? a3.g.readyState : 0;
    }
    h3.Z = function() {
      try {
        return 2 < P2(this) ? this.g.status : -1;
      } catch (a3) {
        return -1;
      }
    };
    h3.oa = function() {
      try {
        return this.g ? this.g.responseText : "";
      } catch (a3) {
        return "";
      }
    };
    h3.Oa = function(a3) {
      if (this.g) {
        var b4 = this.g.responseText;
        a3 && 0 == b4.indexOf(a3) && (b4 = b4.substring(a3.length));
        return ib(b4);
      }
    };
    function Nb(a3) {
      try {
        if (!a3.g) return null;
        if ("response" in a3.g) return a3.g.response;
        switch (a3.H) {
          case "":
          case "text":
            return a3.g.responseText;
          case "arraybuffer":
            if ("mozResponseArrayBuffer" in a3.g) return a3.g.mozResponseArrayBuffer;
        }
        return null;
      } catch (b4) {
        return null;
      }
    }
    function Vb(a3) {
      const b4 = {};
      a3 = (a3.g && 2 <= P2(a3) ? a3.g.getAllResponseHeaders() || "" : "").split("\r\n");
      for (let d3 = 0; d3 < a3.length; d3++) {
        if (t4(a3[d3])) continue;
        var c4 = va(a3[d3]);
        const e5 = c4[0];
        c4 = c4[1];
        if ("string" !== typeof c4) continue;
        c4 = c4.trim();
        const f3 = b4[e5] || [];
        b4[e5] = f3;
        f3.push(c4);
      }
      ra(b4, function(d3) {
        return d3.join(", ");
      });
    }
    h3.Ba = function() {
      return this.m;
    };
    h3.Ka = function() {
      return "string" === typeof this.l ? this.l : String(this.l);
    };
    function Xc(a3, b4, c4) {
      return c4 && c4.internalChannelParams ? c4.internalChannelParams[a3] || b4 : b4;
    }
    function Yc(a3) {
      this.Aa = 0;
      this.i = [];
      this.j = new vb();
      this.ia = this.qa = this.I = this.W = this.g = this.ya = this.D = this.H = this.m = this.S = this.o = null;
      this.Ya = this.U = 0;
      this.Va = Xc("failFast", false, a3);
      this.F = this.C = this.u = this.s = this.l = null;
      this.X = true;
      this.za = this.T = -1;
      this.Y = this.v = this.B = 0;
      this.Ta = Xc("baseRetryDelayMs", 5e3, a3);
      this.cb = Xc("retryDelaySeedMs", 1e4, a3);
      this.Wa = Xc("forwardChannelMaxRetries", 2, a3);
      this.wa = Xc("forwardChannelRequestTimeoutMs", 2e4, a3);
      this.pa = a3 && a3.xmlHttpFactory || void 0;
      this.Xa = a3 && a3.Tb || void 0;
      this.Ca = a3 && a3.useFetchStreams || false;
      this.L = void 0;
      this.J = a3 && a3.supportsCrossDomainXhr || false;
      this.K = "";
      this.h = new ic(a3 && a3.concurrentRequestLimit);
      this.Da = new Hc();
      this.P = a3 && a3.fastHandshake || false;
      this.O = a3 && a3.encodeInitMessageHeaders || false;
      this.P && this.O && (this.O = false);
      this.Ua = a3 && a3.Rb || false;
      a3 && a3.xa && this.j.xa();
      a3 && a3.forceLongPolling && (this.X = false);
      this.ba = !this.P && this.X && a3 && a3.detectBufferingProxy || false;
      this.ja = void 0;
      a3 && a3.longPollingTimeout && 0 < a3.longPollingTimeout && (this.ja = a3.longPollingTimeout);
      this.ca = void 0;
      this.R = 0;
      this.M = false;
      this.ka = this.A = null;
    }
    h3 = Yc.prototype;
    h3.la = 8;
    h3.G = 1;
    h3.connect = function(a3, b4, c4, d3) {
      K2(0);
      this.W = a3;
      this.H = b4 || {};
      c4 && void 0 !== d3 && (this.H.OSID = c4, this.H.OAID = d3);
      this.F = this.X;
      this.I = cc(this, null, this.W);
      fc(this);
    };
    function gc(a3) {
      Zc(a3);
      if (3 == a3.G) {
        var b4 = a3.U++, c4 = N3(a3.I);
        S4(c4, "SID", a3.K);
        S4(c4, "RID", b4);
        S4(c4, "TYPE", "terminate");
        $c(a3, c4);
        b4 = new M3(a3, a3.j, b4);
        b4.L = 2;
        b4.v = Ib(N3(c4));
        c4 = false;
        if (k3.navigator && k3.navigator.sendBeacon) try {
          c4 = k3.navigator.sendBeacon(b4.v.toString(), "");
        } catch (d3) {
        }
        !c4 && k3.Image && (new Image().src = b4.v, c4 = true);
        c4 || (b4.g = Mb(b4.j, null), b4.g.ea(b4.v));
        b4.F = Date.now();
        Kb(b4);
      }
      ad(a3);
    }
    function Zb(a3) {
      a3.g && (Tb(a3), a3.g.cancel(), a3.g = null);
    }
    function Zc(a3) {
      Zb(a3);
      a3.u && (k3.clearTimeout(a3.u), a3.u = null);
      Yb(a3);
      a3.h.cancel();
      a3.s && ("number" === typeof a3.s && k3.clearTimeout(a3.s), a3.s = null);
    }
    function fc(a3) {
      if (!jc(a3.h) && !a3.s) {
        a3.s = true;
        var b4 = a3.Ga;
        x3 || Ea();
        y3 || (x3(), y3 = true);
        za.add(b4, a3);
        a3.B = 0;
      }
    }
    function bd(a3, b4) {
      if (ac(a3.h) >= a3.h.j - (a3.s ? 1 : 0)) return false;
      if (a3.s) return a3.i = b4.D.concat(a3.i), true;
      if (1 == a3.G || 2 == a3.G || a3.B >= (a3.Va ? 0 : a3.Wa)) return false;
      a3.s = ub(p3(a3.Ga, a3, b4), cd(a3, a3.B));
      a3.B++;
      return true;
    }
    h3.Ga = function(a3) {
      if (this.s) if (this.s = null, 1 == this.G) {
        if (!a3) {
          this.U = Math.floor(1e5 * Math.random());
          a3 = this.U++;
          const e5 = new M3(this, this.j, a3);
          let f3 = this.o;
          this.S && (f3 ? (f3 = sa(f3), ua(f3, this.S)) : f3 = this.S);
          null !== this.m || this.O || (e5.H = f3, f3 = null);
          if (this.P) a: {
            var b4 = 0;
            for (var c4 = 0; c4 < this.i.length; c4++) {
              b: {
                var d3 = this.i[c4];
                if ("__data__" in d3.map && (d3 = d3.map.__data__, "string" === typeof d3)) {
                  d3 = d3.length;
                  break b;
                }
                d3 = void 0;
              }
              if (void 0 === d3) break;
              b4 += d3;
              if (4096 < b4) {
                b4 = c4;
                break a;
              }
              if (4096 === b4 || c4 === this.i.length - 1) {
                b4 = c4 + 1;
                break a;
              }
            }
            b4 = 1e3;
          }
          else b4 = 1e3;
          b4 = dd(this, e5, b4);
          c4 = N3(this.I);
          S4(c4, "RID", a3);
          S4(c4, "CVER", 22);
          this.D && S4(c4, "X-HTTP-Session-Id", this.D);
          $c(this, c4);
          f3 && (this.O ? b4 = "headers=" + encodeURIComponent(String(Oc(f3))) + "&" + b4 : this.m && Pc(c4, this.m, f3));
          bc(this.h, e5);
          this.Ua && S4(c4, "TYPE", "init");
          this.P ? (S4(c4, "$req", b4), S4(c4, "SID", "null"), e5.T = true, Hb(e5, c4, null)) : Hb(e5, c4, b4);
          this.G = 2;
        }
      } else 3 == this.G && (a3 ? ed(this, a3) : 0 == this.i.length || jc(this.h) || ed(this));
    };
    function ed(a3, b4) {
      var c4;
      b4 ? c4 = b4.l : c4 = a3.U++;
      const d3 = N3(a3.I);
      S4(d3, "SID", a3.K);
      S4(d3, "RID", c4);
      S4(d3, "AID", a3.T);
      $c(a3, d3);
      a3.m && a3.o && Pc(d3, a3.m, a3.o);
      c4 = new M3(a3, a3.j, c4, a3.B + 1);
      null === a3.m && (c4.H = a3.o);
      b4 && (a3.i = b4.D.concat(a3.i));
      b4 = dd(a3, c4, 1e3);
      c4.I = Math.round(0.5 * a3.wa) + Math.round(0.5 * a3.wa * Math.random());
      bc(a3.h, c4);
      Hb(c4, d3, b4);
    }
    function $c(a3, b4) {
      a3.H && qa(a3.H, function(c4, d3) {
        S4(b4, d3, c4);
      });
      a3.l && nc({}, function(c4, d3) {
        S4(b4, d3, c4);
      });
    }
    function dd(a3, b4, c4) {
      c4 = Math.min(a3.i.length, c4);
      var d3 = a3.l ? p3(a3.l.Na, a3.l, a3) : null;
      a: {
        var e5 = a3.i;
        let f3 = -1;
        for (; ; ) {
          const g2 = ["count=" + c4];
          -1 == f3 ? 0 < c4 ? (f3 = e5[0].g, g2.push("ofs=" + f3)) : f3 = 0 : g2.push("ofs=" + f3);
          let m2 = true;
          for (let q2 = 0; q2 < c4; q2++) {
            let l3 = e5[q2].g;
            const v3 = e5[q2].map;
            l3 -= f3;
            if (0 > l3) f3 = Math.max(0, e5[q2].g - 100), m2 = false;
            else try {
              Ic(v3, g2, "req" + l3 + "_");
            } catch (w2) {
              d3 && d3(v3);
            }
          }
          if (m2) {
            d3 = g2.join("&");
            break a;
          }
        }
      }
      a3 = a3.i.splice(0, c4);
      b4.D = a3;
      return d3;
    }
    function ec(a3) {
      if (!a3.g && !a3.u) {
        a3.Y = 1;
        var b4 = a3.Fa;
        x3 || Ea();
        y3 || (x3(), y3 = true);
        za.add(b4, a3);
        a3.v = 0;
      }
    }
    function $b(a3) {
      if (a3.g || a3.u || 3 <= a3.v) return false;
      a3.Y++;
      a3.u = ub(p3(a3.Fa, a3), cd(a3, a3.v));
      a3.v++;
      return true;
    }
    h3.Fa = function() {
      this.u = null;
      fd(this);
      if (this.ba && !(this.M || null == this.g || 0 >= this.R)) {
        var a3 = 2 * this.R;
        this.j.info("BP detection timer enabled: " + a3);
        this.A = ub(p3(this.ab, this), a3);
      }
    };
    h3.ab = function() {
      this.A && (this.A = null, this.j.info("BP detection timeout reached."), this.j.info("Buffering proxy detected and switch to long-polling!"), this.F = false, this.M = true, K2(10), Zb(this), fd(this));
    };
    function Tb(a3) {
      null != a3.A && (k3.clearTimeout(a3.A), a3.A = null);
    }
    function fd(a3) {
      a3.g = new M3(a3, a3.j, "rpc", a3.Y);
      null === a3.m && (a3.g.H = a3.o);
      a3.g.O = 0;
      var b4 = N3(a3.qa);
      S4(b4, "RID", "rpc");
      S4(b4, "SID", a3.K);
      S4(b4, "AID", a3.T);
      S4(b4, "CI", a3.F ? "0" : "1");
      !a3.F && a3.ja && S4(b4, "TO", a3.ja);
      S4(b4, "TYPE", "xmlhttp");
      $c(a3, b4);
      a3.m && a3.o && Pc(b4, a3.m, a3.o);
      a3.L && (a3.g.I = a3.L);
      var c4 = a3.g;
      a3 = a3.ia;
      c4.L = 1;
      c4.v = Ib(N3(b4));
      c4.m = null;
      c4.P = true;
      Jb(c4, a3);
    }
    h3.Za = function() {
      null != this.C && (this.C = null, Zb(this), $b(this), K2(19));
    };
    function Yb(a3) {
      null != a3.C && (k3.clearTimeout(a3.C), a3.C = null);
    }
    function Ub(a3, b4) {
      var c4 = null;
      if (a3.g == b4) {
        Yb(a3);
        Tb(a3);
        a3.g = null;
        var d3 = 2;
      } else if (Xb(a3.h, b4)) c4 = b4.D, dc(a3.h, b4), d3 = 1;
      else return;
      if (0 != a3.G) {
        if (b4.o) if (1 == d3) {
          c4 = b4.m ? b4.m.length : 0;
          b4 = Date.now() - b4.F;
          var e5 = a3.B;
          d3 = qb();
          F2(d3, new tb(d3, c4));
          fc(a3);
        } else ec(a3);
        else if (e5 = b4.s, 3 == e5 || 0 == e5 && 0 < b4.X || !(1 == d3 && bd(a3, b4) || 2 == d3 && $b(a3))) switch (c4 && 0 < c4.length && (b4 = a3.h, b4.i = b4.i.concat(c4)), e5) {
          case 1:
            R2(a3, 5);
            break;
          case 4:
            R2(a3, 10);
            break;
          case 3:
            R2(a3, 6);
            break;
          default:
            R2(a3, 2);
        }
      }
    }
    function cd(a3, b4) {
      let c4 = a3.Ta + Math.floor(Math.random() * a3.cb);
      a3.isActive() || (c4 *= 2);
      return c4 * b4;
    }
    function R2(a3, b4) {
      a3.j.info("Error code " + b4);
      if (2 == b4) {
        var c4 = p3(a3.fb, a3), d3 = a3.Xa;
        const e5 = !d3;
        d3 = new T2(d3 || "//www.google.com/images/cleardot.gif");
        k3.location && "http" == k3.location.protocol || qc(d3, "https");
        Ib(d3);
        e5 ? Fc(d3.toString(), c4) : Gc(d3.toString(), c4);
      } else K2(2);
      a3.G = 0;
      a3.l && a3.l.sa(b4);
      ad(a3);
      Zc(a3);
    }
    h3.fb = function(a3) {
      a3 ? (this.j.info("Successfully pinged google.com"), K2(2)) : (this.j.info("Failed to ping google.com"), K2(1));
    };
    function ad(a3) {
      a3.G = 0;
      a3.ka = [];
      if (a3.l) {
        const b4 = kc(a3.h);
        if (0 != b4.length || 0 != a3.i.length) ma(a3.ka, b4), ma(a3.ka, a3.i), a3.h.i.length = 0, la(a3.i), a3.i.length = 0;
        a3.l.ra();
      }
    }
    function cc(a3, b4, c4) {
      var d3 = c4 instanceof T2 ? N3(c4) : new T2(c4);
      if ("" != d3.g) b4 && (d3.g = b4 + "." + d3.g), rc(d3, d3.s);
      else {
        var e5 = k3.location;
        d3 = e5.protocol;
        b4 = b4 ? b4 + "." + e5.hostname : e5.hostname;
        e5 = +e5.port;
        var f3 = new T2(null);
        d3 && qc(f3, d3);
        b4 && (f3.g = b4);
        e5 && rc(f3, e5);
        c4 && (f3.l = c4);
        d3 = f3;
      }
      c4 = a3.D;
      b4 = a3.ya;
      c4 && b4 && S4(d3, c4, b4);
      S4(d3, "VER", a3.la);
      $c(a3, d3);
      return d3;
    }
    function Mb(a3, b4, c4) {
      if (b4 && !a3.J) throw Error("Can't create secondary domain capable XhrIo object.");
      b4 = a3.Ca && !a3.pa ? new X2(new Jc({ eb: c4 })) : new X2(a3.pa);
      b4.Ha(a3.J);
      return b4;
    }
    h3.isActive = function() {
      return !!this.l && this.l.isActive(this);
    };
    function gd() {
    }
    h3 = gd.prototype;
    h3.ua = function() {
    };
    h3.ta = function() {
    };
    h3.sa = function() {
    };
    h3.ra = function() {
    };
    h3.isActive = function() {
      return true;
    };
    h3.Na = function() {
    };
    function hd() {
    }
    hd.prototype.g = function(a3, b4) {
      return new Y2(a3, b4);
    };
    function Y2(a3, b4) {
      E2.call(this);
      this.g = new Yc(b4);
      this.l = a3;
      this.h = b4 && b4.messageUrlParams || null;
      a3 = b4 && b4.messageHeaders || null;
      b4 && b4.clientProtocolHeaderRequired && (a3 ? a3["X-Client-Protocol"] = "webchannel" : a3 = { "X-Client-Protocol": "webchannel" });
      this.g.o = a3;
      a3 = b4 && b4.initMessageHeaders || null;
      b4 && b4.messageContentType && (a3 ? a3["X-WebChannel-Content-Type"] = b4.messageContentType : a3 = { "X-WebChannel-Content-Type": b4.messageContentType });
      b4 && b4.va && (a3 ? a3["X-WebChannel-Client-Profile"] = b4.va : a3 = { "X-WebChannel-Client-Profile": b4.va });
      this.g.S = a3;
      (a3 = b4 && b4.Sb) && !t4(a3) && (this.g.m = a3);
      this.v = b4 && b4.supportsCrossDomainXhr || false;
      this.u = b4 && b4.sendRawJson || false;
      (b4 = b4 && b4.httpSessionIdParam) && !t4(b4) && (this.g.D = b4, a3 = this.h, null !== a3 && b4 in a3 && (a3 = this.h, b4 in a3 && delete a3[b4]));
      this.j = new Z3(this);
    }
    r5(Y2, E2);
    Y2.prototype.m = function() {
      this.g.l = this.j;
      this.v && (this.g.J = true);
      this.g.connect(this.l, this.h || void 0);
    };
    Y2.prototype.close = function() {
      gc(this.g);
    };
    Y2.prototype.o = function(a3) {
      var b4 = this.g;
      if ("string" === typeof a3) {
        var c4 = {};
        c4.__data__ = a3;
        a3 = c4;
      } else this.u && (c4 = {}, c4.__data__ = hb(a3), a3 = c4);
      b4.i.push(new hc(b4.Ya++, a3));
      3 == b4.G && fc(b4);
    };
    Y2.prototype.N = function() {
      this.g.l = null;
      delete this.j;
      gc(this.g);
      delete this.g;
      Y2.aa.N.call(this);
    };
    function id(a3) {
      nb.call(this);
      a3.__headers__ && (this.headers = a3.__headers__, this.statusCode = a3.__status__, delete a3.__headers__, delete a3.__status__);
      var b4 = a3.__sm__;
      if (b4) {
        a: {
          for (const c4 in b4) {
            a3 = c4;
            break a;
          }
          a3 = void 0;
        }
        if (this.i = a3) a3 = this.i, b4 = null !== b4 && a3 in b4 ? b4[a3] : void 0;
        this.data = b4;
      } else this.data = a3;
    }
    r5(id, nb);
    function jd() {
      ob.call(this);
      this.status = 1;
    }
    r5(jd, ob);
    function Z3(a3) {
      this.g = a3;
    }
    r5(Z3, gd);
    Z3.prototype.ua = function() {
      F2(this.g, "a");
    };
    Z3.prototype.ta = function(a3) {
      F2(this.g, new id(a3));
    };
    Z3.prototype.sa = function(a3) {
      F2(this.g, new jd());
    };
    Z3.prototype.ra = function() {
      F2(this.g, "b");
    };
    hd.prototype.createWebChannel = hd.prototype.g;
    Y2.prototype.send = Y2.prototype.o;
    Y2.prototype.open = Y2.prototype.m;
    Y2.prototype.close = Y2.prototype.close;
    createWebChannelTransport = webchannel_blob_es2018.createWebChannelTransport = function() {
      return new hd();
    };
    getStatEventTarget = webchannel_blob_es2018.getStatEventTarget = function() {
      return qb();
    };
    Event = webchannel_blob_es2018.Event = I2;
    Stat = webchannel_blob_es2018.Stat = { mb: 0, pb: 1, qb: 2, Jb: 3, Ob: 4, Lb: 5, Mb: 6, Kb: 7, Ib: 8, Nb: 9, PROXY: 10, NOPROXY: 11, Gb: 12, Cb: 13, Db: 14, Bb: 15, Eb: 16, Fb: 17, ib: 18, hb: 19, jb: 20 };
    Ab.NO_ERROR = 0;
    Ab.TIMEOUT = 8;
    Ab.HTTP_ERROR = 6;
    ErrorCode = webchannel_blob_es2018.ErrorCode = Ab;
    Bb.COMPLETE = "complete";
    EventType = webchannel_blob_es2018.EventType = Bb;
    mb.EventType = H3;
    H3.OPEN = "a";
    H3.CLOSE = "b";
    H3.ERROR = "c";
    H3.MESSAGE = "d";
    E2.prototype.listen = E2.prototype.K;
    WebChannel = webchannel_blob_es2018.WebChannel = mb;
    FetchXmlHttpFactory = webchannel_blob_es2018.FetchXmlHttpFactory = Jc;
    X2.prototype.listenOnce = X2.prototype.L;
    X2.prototype.getLastError = X2.prototype.Ka;
    X2.prototype.getLastErrorCode = X2.prototype.Ba;
    X2.prototype.getStatus = X2.prototype.Z;
    X2.prototype.getResponseJson = X2.prototype.Oa;
    X2.prototype.getResponseText = X2.prototype.oa;
    X2.prototype.send = X2.prototype.ea;
    X2.prototype.setWithCredentials = X2.prototype.Ha;
    XhrIo = webchannel_blob_es2018.XhrIo = X2;
  }).apply(typeof commonjsGlobal2 !== "undefined" ? commonjsGlobal2 : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  // node_modules/.pnpm/@firebase+firestore@4.6.3_@firebase+app@0.10.5/node_modules/@firebase/firestore/dist/index.esm2017.js
  var S3 = "@firebase/firestore";
  var User = class {
    constructor(e5) {
      this.uid = e5;
    }
    isAuthenticated() {
      return null != this.uid;
    }
    /**
     * Returns a key representing this user, suitable for inclusion in a
     * dictionary.
     */
    toKey() {
      return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
    }
    isEqual(e5) {
      return e5.uid === this.uid;
    }
  };
  User.UNAUTHENTICATED = new User(null), // TODO(mikelehen): Look into getting a proper uid-equivalent for
  // non-FirebaseAuth providers.
  User.GOOGLE_CREDENTIALS = new User("google-credentials-uid"), User.FIRST_PARTY = new User("first-party-uid"), User.MOCK_USER = new User("mock-user");
  var b3 = "10.12.1";
  var D = new Logger("@firebase/firestore");
  function __PRIVATE_getLogLevel() {
    return D.logLevel;
  }
  function __PRIVATE_logDebug(e5, ...t4) {
    if (D.logLevel <= LogLevel.DEBUG) {
      const n5 = t4.map(__PRIVATE_argToString);
      D.debug(`Firestore (${b3}): ${e5}`, ...n5);
    }
  }
  function __PRIVATE_logError(e5, ...t4) {
    if (D.logLevel <= LogLevel.ERROR) {
      const n5 = t4.map(__PRIVATE_argToString);
      D.error(`Firestore (${b3}): ${e5}`, ...n5);
    }
  }
  function __PRIVATE_logWarn(e5, ...t4) {
    if (D.logLevel <= LogLevel.WARN) {
      const n5 = t4.map(__PRIVATE_argToString);
      D.warn(`Firestore (${b3}): ${e5}`, ...n5);
    }
  }
  function __PRIVATE_argToString(e5) {
    if ("string" == typeof e5) return e5;
    try {
      return function __PRIVATE_formatJSON(e6) {
        return JSON.stringify(e6);
      }(e5);
    } catch (t4) {
      return e5;
    }
  }
  function fail(e5 = "Unexpected state") {
    const t4 = `FIRESTORE (${b3}) INTERNAL ASSERTION FAILED: ` + e5;
    throw __PRIVATE_logError(t4), new Error(t4);
  }
  function __PRIVATE_hardAssert(e5, t4) {
    e5 || fail();
  }
  function __PRIVATE_debugCast(e5, t4) {
    return e5;
  }
  var C2 = {
    // Causes are copied from:
    // https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
    /** Not an error; returned on success. */
    OK: "ok",
    /** The operation was cancelled (typically by the caller). */
    CANCELLED: "cancelled",
    /** Unknown error or an error from a different error domain. */
    UNKNOWN: "unknown",
    /**
     * Client specified an invalid argument. Note that this differs from
     * FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are
     * problematic regardless of the state of the system (e.g., a malformed file
     * name).
     */
    INVALID_ARGUMENT: "invalid-argument",
    /**
     * Deadline expired before operation could complete. For operations that
     * change the state of the system, this error may be returned even if the
     * operation has completed successfully. For example, a successful response
     * from a server could have been delayed long enough for the deadline to
     * expire.
     */
    DEADLINE_EXCEEDED: "deadline-exceeded",
    /** Some requested entity (e.g., file or directory) was not found. */
    NOT_FOUND: "not-found",
    /**
     * Some entity that we attempted to create (e.g., file or directory) already
     * exists.
     */
    ALREADY_EXISTS: "already-exists",
    /**
     * The caller does not have permission to execute the specified operation.
     * PERMISSION_DENIED must not be used for rejections caused by exhausting
     * some resource (use RESOURCE_EXHAUSTED instead for those errors).
     * PERMISSION_DENIED must not be used if the caller can not be identified
     * (use UNAUTHENTICATED instead for those errors).
     */
    PERMISSION_DENIED: "permission-denied",
    /**
     * The request does not have valid authentication credentials for the
     * operation.
     */
    UNAUTHENTICATED: "unauthenticated",
    /**
     * Some resource has been exhausted, perhaps a per-user quota, or perhaps the
     * entire file system is out of space.
     */
    RESOURCE_EXHAUSTED: "resource-exhausted",
    /**
     * Operation was rejected because the system is not in a state required for
     * the operation's execution. For example, directory to be deleted may be
     * non-empty, an rmdir operation is applied to a non-directory, etc.
     *
     * A litmus test that may help a service implementor in deciding
     * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
     *  (a) Use UNAVAILABLE if the client can retry just the failing call.
     *  (b) Use ABORTED if the client should retry at a higher-level
     *      (e.g., restarting a read-modify-write sequence).
     *  (c) Use FAILED_PRECONDITION if the client should not retry until
     *      the system state has been explicitly fixed. E.g., if an "rmdir"
     *      fails because the directory is non-empty, FAILED_PRECONDITION
     *      should be returned since the client should not retry unless
     *      they have first fixed up the directory by deleting files from it.
     *  (d) Use FAILED_PRECONDITION if the client performs conditional
     *      REST Get/Update/Delete on a resource and the resource on the
     *      server does not match the condition. E.g., conflicting
     *      read-modify-write on the same resource.
     */
    FAILED_PRECONDITION: "failed-precondition",
    /**
     * The operation was aborted, typically due to a concurrency issue like
     * sequencer check failures, transaction aborts, etc.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
     * and UNAVAILABLE.
     */
    ABORTED: "aborted",
    /**
     * Operation was attempted past the valid range. E.g., seeking or reading
     * past end of file.
     *
     * Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed
     * if the system state changes. For example, a 32-bit file system will
     * generate INVALID_ARGUMENT if asked to read at an offset that is not in the
     * range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from
     * an offset past the current file size.
     *
     * There is a fair bit of overlap between FAILED_PRECONDITION and
     * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error)
     * when it applies so that callers who are iterating through a space can
     * easily look for an OUT_OF_RANGE error to detect when they are done.
     */
    OUT_OF_RANGE: "out-of-range",
    /** Operation is not implemented or not supported/enabled in this service. */
    UNIMPLEMENTED: "unimplemented",
    /**
     * Internal errors. Means some invariants expected by underlying System has
     * been broken. If you see one of these errors, Something is very broken.
     */
    INTERNAL: "internal",
    /**
     * The service is currently unavailable. This is a most likely a transient
     * condition and may be corrected by retrying with a backoff.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
     * and UNAVAILABLE.
     */
    UNAVAILABLE: "unavailable",
    /** Unrecoverable data loss or corruption. */
    DATA_LOSS: "data-loss"
  };
  var FirestoreError = class extends FirebaseError {
    /** @hideconstructor */
    constructor(e5, t4) {
      super(e5, t4), this.code = e5, this.message = t4, // HACK: We write a toString property directly because Error is not a real
      // class and so inheritance does not work correctly. We could alternatively
      // do the same "back-door inheritance" trick that FirebaseError does.
      this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
    }
  };
  var __PRIVATE_Deferred = class {
    constructor() {
      this.promise = new Promise((e5, t4) => {
        this.resolve = e5, this.reject = t4;
      });
    }
  };
  var __PRIVATE_OAuthToken = class {
    constructor(e5, t4) {
      this.user = t4, this.type = "OAuth", this.headers = /* @__PURE__ */ new Map(), this.headers.set("Authorization", `Bearer ${e5}`);
    }
  };
  var __PRIVATE_EmptyAuthCredentialsProvider = class {
    getToken() {
      return Promise.resolve(null);
    }
    invalidateToken() {
    }
    start(e5, t4) {
      e5.enqueueRetryable(() => t4(User.UNAUTHENTICATED));
    }
    shutdown() {
    }
  };
  var __PRIVATE_FirebaseAuthCredentialsProvider = class {
    constructor(e5) {
      this.t = e5, /** Tracks the current User. */
      this.currentUser = User.UNAUTHENTICATED, /**
       * Counter used to detect if the token changed while a getToken request was
       * outstanding.
       */
      this.i = 0, this.forceRefresh = false, this.auth = null;
    }
    start(e5, t4) {
      let n5 = this.i;
      const __PRIVATE_guardedChangeListener = (e6) => this.i !== n5 ? (n5 = this.i, t4(e6)) : Promise.resolve();
      let r5 = new __PRIVATE_Deferred();
      this.o = () => {
        this.i++, this.currentUser = this.u(), r5.resolve(), r5 = new __PRIVATE_Deferred(), e5.enqueueRetryable(() => __PRIVATE_guardedChangeListener(this.currentUser));
      };
      const __PRIVATE_awaitNextToken = () => {
        const t5 = r5;
        e5.enqueueRetryable(async () => {
          await t5.promise, await __PRIVATE_guardedChangeListener(this.currentUser);
        });
      }, __PRIVATE_registerAuth = (e6) => {
        __PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = e6, this.auth.addAuthTokenListener(this.o), __PRIVATE_awaitNextToken();
      };
      this.t.onInit((e6) => __PRIVATE_registerAuth(e6)), // Our users can initialize Auth right after Firestore, so we give it
      // a chance to register itself with the component framework before we
      // determine whether to start up in unauthenticated mode.
      setTimeout(() => {
        if (!this.auth) {
          const e6 = this.t.getImmediate({
            optional: true
          });
          e6 ? __PRIVATE_registerAuth(e6) : (
            // If auth is still not available, proceed with `null` user
            (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth not yet detected"), r5.resolve(), r5 = new __PRIVATE_Deferred())
          );
        }
      }, 0), __PRIVATE_awaitNextToken();
    }
    getToken() {
      const e5 = this.i, t4 = this.forceRefresh;
      return this.forceRefresh = false, this.auth ? this.auth.getToken(t4).then((t5) => (
        // Cancel the request since the token changed while the request was
        // outstanding so the response is potentially for a previous user (which
        // user, we can't be sure).
        this.i !== e5 ? (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : t5 ? (__PRIVATE_hardAssert("string" == typeof t5.accessToken), new __PRIVATE_OAuthToken(t5.accessToken, this.currentUser)) : null
      )) : Promise.resolve(null);
    }
    invalidateToken() {
      this.forceRefresh = true;
    }
    shutdown() {
      this.auth && this.auth.removeAuthTokenListener(this.o);
    }
    // Auth.getUid() can return null even with a user logged in. It is because
    // getUid() is synchronous, but the auth code populating Uid is asynchronous.
    // This method should only be called in the AuthTokenListener callback
    // to guarantee to get the actual user.
    u() {
      const e5 = this.auth && this.auth.getUid();
      return __PRIVATE_hardAssert(null === e5 || "string" == typeof e5), new User(e5);
    }
  };
  var __PRIVATE_FirstPartyToken = class {
    constructor(e5, t4, n5) {
      this.l = e5, this.h = t4, this.P = n5, this.type = "FirstParty", this.user = User.FIRST_PARTY, this.I = /* @__PURE__ */ new Map();
    }
    /**
     * Gets an authorization token, using a provided factory function, or return
     * null.
     */
    T() {
      return this.P ? this.P() : null;
    }
    get headers() {
      this.I.set("X-Goog-AuthUser", this.l);
      const e5 = this.T();
      return e5 && this.I.set("Authorization", e5), this.h && this.I.set("X-Goog-Iam-Authorization-Token", this.h), this.I;
    }
  };
  var __PRIVATE_FirstPartyAuthCredentialsProvider = class {
    constructor(e5, t4, n5) {
      this.l = e5, this.h = t4, this.P = n5;
    }
    getToken() {
      return Promise.resolve(new __PRIVATE_FirstPartyToken(this.l, this.h, this.P));
    }
    start(e5, t4) {
      e5.enqueueRetryable(() => t4(User.FIRST_PARTY));
    }
    shutdown() {
    }
    invalidateToken() {
    }
  };
  var AppCheckToken = class {
    constructor(e5) {
      this.value = e5, this.type = "AppCheck", this.headers = /* @__PURE__ */ new Map(), e5 && e5.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
    }
  };
  var __PRIVATE_FirebaseAppCheckTokenProvider = class {
    constructor(e5) {
      this.A = e5, this.forceRefresh = false, this.appCheck = null, this.R = null;
    }
    start(e5, t4) {
      const onTokenChanged = (e6) => {
        null != e6.error && __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${e6.error.message}`);
        const n5 = e6.token !== this.R;
        return this.R = e6.token, __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Received ${n5 ? "new" : "existing"} token.`), n5 ? t4(e6.token) : Promise.resolve();
      };
      this.o = (t5) => {
        e5.enqueueRetryable(() => onTokenChanged(t5));
      };
      const __PRIVATE_registerAppCheck = (e6) => {
        __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = e6, this.appCheck.addTokenListener(this.o);
      };
      this.A.onInit((e6) => __PRIVATE_registerAppCheck(e6)), // Our users can initialize AppCheck after Firestore, so we give it
      // a chance to register itself with the component framework.
      setTimeout(() => {
        if (!this.appCheck) {
          const e6 = this.A.getImmediate({
            optional: true
          });
          e6 ? __PRIVATE_registerAppCheck(e6) : (
            // If AppCheck is still not available, proceed without it.
            __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck not yet detected")
          );
        }
      }, 0);
    }
    getToken() {
      const e5 = this.forceRefresh;
      return this.forceRefresh = false, this.appCheck ? this.appCheck.getToken(e5).then((e6) => e6 ? (__PRIVATE_hardAssert("string" == typeof e6.token), this.R = e6.token, new AppCheckToken(e6.token)) : null) : Promise.resolve(null);
    }
    invalidateToken() {
      this.forceRefresh = true;
    }
    shutdown() {
      this.appCheck && this.appCheck.removeTokenListener(this.o);
    }
  };
  function __PRIVATE_randomBytes(e5) {
    const t4 = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "undefined" != typeof self && (self.crypto || self.msCrypto)
    ), n5 = new Uint8Array(e5);
    if (t4 && "function" == typeof t4.getRandomValues) t4.getRandomValues(n5);
    else
      for (let t5 = 0; t5 < e5; t5++) n5[t5] = Math.floor(256 * Math.random());
    return n5;
  }
  var __PRIVATE_AutoId = class {
    static newId() {
      const e5 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t4 = Math.floor(256 / e5.length) * e5.length;
      let n5 = "";
      for (; n5.length < 20; ) {
        const r5 = __PRIVATE_randomBytes(40);
        for (let i4 = 0; i4 < r5.length; ++i4)
          n5.length < 20 && r5[i4] < t4 && (n5 += e5.charAt(r5[i4] % e5.length));
      }
      return n5;
    }
  };
  function __PRIVATE_primitiveComparator(e5, t4) {
    return e5 < t4 ? -1 : e5 > t4 ? 1 : 0;
  }
  function __PRIVATE_arrayEquals(e5, t4, n5) {
    return e5.length === t4.length && e5.every((e6, r5) => n5(e6, t4[r5]));
  }
  function __PRIVATE_immediateSuccessor(e5) {
    return e5 + "\0";
  }
  var Timestamp = class _Timestamp {
    /**
     * Creates a new timestamp.
     *
     * @param seconds - The number of seconds of UTC time since Unix epoch
     *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
     *     9999-12-31T23:59:59Z inclusive.
     * @param nanoseconds - The non-negative fractions of a second at nanosecond
     *     resolution. Negative second values with fractions must still have
     *     non-negative nanoseconds values that count forward in time. Must be
     *     from 0 to 999,999,999 inclusive.
     */
    constructor(e5, t4) {
      if (this.seconds = e5, this.nanoseconds = t4, t4 < 0) throw new FirestoreError(C2.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t4);
      if (t4 >= 1e9) throw new FirestoreError(C2.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t4);
      if (e5 < -62135596800) throw new FirestoreError(C2.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e5);
      if (e5 >= 253402300800) throw new FirestoreError(C2.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e5);
    }
    /**
     * Creates a new timestamp with the current date, with millisecond precision.
     *
     * @returns a new timestamp representing the current date.
     */
    static now() {
      return _Timestamp.fromMillis(Date.now());
    }
    /**
     * Creates a new timestamp from the given date.
     *
     * @param date - The date to initialize the `Timestamp` from.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     date.
     */
    static fromDate(e5) {
      return _Timestamp.fromMillis(e5.getTime());
    }
    /**
     * Creates a new timestamp from the given number of milliseconds.
     *
     * @param milliseconds - Number of milliseconds since Unix epoch
     *     1970-01-01T00:00:00Z.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     number of milliseconds.
     */
    static fromMillis(e5) {
      const t4 = Math.floor(e5 / 1e3), n5 = Math.floor(1e6 * (e5 - 1e3 * t4));
      return new _Timestamp(t4, n5);
    }
    /**
     * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
     * causes a loss of precision since `Date` objects only support millisecond
     * precision.
     *
     * @returns JavaScript `Date` object representing the same point in time as
     *     this `Timestamp`, with millisecond precision.
     */
    toDate() {
      return new Date(this.toMillis());
    }
    /**
     * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
     * epoch). This operation causes a loss of precision.
     *
     * @returns The point in time corresponding to this timestamp, represented as
     *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
     */
    toMillis() {
      return 1e3 * this.seconds + this.nanoseconds / 1e6;
    }
    _compareTo(e5) {
      return this.seconds === e5.seconds ? __PRIVATE_primitiveComparator(this.nanoseconds, e5.nanoseconds) : __PRIVATE_primitiveComparator(this.seconds, e5.seconds);
    }
    /**
     * Returns true if this `Timestamp` is equal to the provided one.
     *
     * @param other - The `Timestamp` to compare against.
     * @returns true if this `Timestamp` is equal to the provided one.
     */
    isEqual(e5) {
      return e5.seconds === this.seconds && e5.nanoseconds === this.nanoseconds;
    }
    /** Returns a textual representation of this `Timestamp`. */
    toString() {
      return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
    }
    /** Returns a JSON-serializable representation of this `Timestamp`. */
    toJSON() {
      return {
        seconds: this.seconds,
        nanoseconds: this.nanoseconds
      };
    }
    /**
     * Converts this object to a primitive string, which allows `Timestamp` objects
     * to be compared using the `>`, `<=`, `>=` and `>` operators.
     */
    valueOf() {
      const e5 = this.seconds - -62135596800;
      return String(e5).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
    }
  };
  var SnapshotVersion = class _SnapshotVersion {
    constructor(e5) {
      this.timestamp = e5;
    }
    static fromTimestamp(e5) {
      return new _SnapshotVersion(e5);
    }
    static min() {
      return new _SnapshotVersion(new Timestamp(0, 0));
    }
    static max() {
      return new _SnapshotVersion(new Timestamp(253402300799, 999999999));
    }
    compareTo(e5) {
      return this.timestamp._compareTo(e5.timestamp);
    }
    isEqual(e5) {
      return this.timestamp.isEqual(e5.timestamp);
    }
    /** Returns a number representation of the version for use in spec tests. */
    toMicroseconds() {
      return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
    }
    toString() {
      return "SnapshotVersion(" + this.timestamp.toString() + ")";
    }
    toTimestamp() {
      return this.timestamp;
    }
  };
  var BasePath = class _BasePath {
    constructor(e5, t4, n5) {
      void 0 === t4 ? t4 = 0 : t4 > e5.length && fail(), void 0 === n5 ? n5 = e5.length - t4 : n5 > e5.length - t4 && fail(), this.segments = e5, this.offset = t4, this.len = n5;
    }
    get length() {
      return this.len;
    }
    isEqual(e5) {
      return 0 === _BasePath.comparator(this, e5);
    }
    child(e5) {
      const t4 = this.segments.slice(this.offset, this.limit());
      return e5 instanceof _BasePath ? e5.forEach((e6) => {
        t4.push(e6);
      }) : t4.push(e5), this.construct(t4);
    }
    /** The index of one past the last segment of the path. */
    limit() {
      return this.offset + this.length;
    }
    popFirst(e5) {
      return e5 = void 0 === e5 ? 1 : e5, this.construct(this.segments, this.offset + e5, this.length - e5);
    }
    popLast() {
      return this.construct(this.segments, this.offset, this.length - 1);
    }
    firstSegment() {
      return this.segments[this.offset];
    }
    lastSegment() {
      return this.get(this.length - 1);
    }
    get(e5) {
      return this.segments[this.offset + e5];
    }
    isEmpty() {
      return 0 === this.length;
    }
    isPrefixOf(e5) {
      if (e5.length < this.length) return false;
      for (let t4 = 0; t4 < this.length; t4++) if (this.get(t4) !== e5.get(t4)) return false;
      return true;
    }
    isImmediateParentOf(e5) {
      if (this.length + 1 !== e5.length) return false;
      for (let t4 = 0; t4 < this.length; t4++) if (this.get(t4) !== e5.get(t4)) return false;
      return true;
    }
    forEach(e5) {
      for (let t4 = this.offset, n5 = this.limit(); t4 < n5; t4++) e5(this.segments[t4]);
    }
    toArray() {
      return this.segments.slice(this.offset, this.limit());
    }
    static comparator(e5, t4) {
      const n5 = Math.min(e5.length, t4.length);
      for (let r5 = 0; r5 < n5; r5++) {
        const n6 = e5.get(r5), i4 = t4.get(r5);
        if (n6 < i4) return -1;
        if (n6 > i4) return 1;
      }
      return e5.length < t4.length ? -1 : e5.length > t4.length ? 1 : 0;
    }
  };
  var ResourcePath = class _ResourcePath extends BasePath {
    construct(e5, t4, n5) {
      return new _ResourcePath(e5, t4, n5);
    }
    canonicalString() {
      return this.toArray().join("/");
    }
    toString() {
      return this.canonicalString();
    }
    /**
     * Returns a string representation of this path
     * where each path segment has been encoded with
     * `encodeURIComponent`.
     */
    toUriEncodedString() {
      return this.toArray().map(encodeURIComponent).join("/");
    }
    /**
     * Creates a resource path from the given slash-delimited string. If multiple
     * arguments are provided, all components are combined. Leading and trailing
     * slashes from all components are ignored.
     */
    static fromString(...e5) {
      const t4 = [];
      for (const n5 of e5) {
        if (n5.indexOf("//") >= 0) throw new FirestoreError(C2.INVALID_ARGUMENT, `Invalid segment (${n5}). Paths must not contain // in them.`);
        t4.push(...n5.split("/").filter((e6) => e6.length > 0));
      }
      return new _ResourcePath(t4);
    }
    static emptyPath() {
      return new _ResourcePath([]);
    }
  };
  var v2 = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
  var FieldPath$1 = class _FieldPath$1 extends BasePath {
    construct(e5, t4, n5) {
      return new _FieldPath$1(e5, t4, n5);
    }
    /**
     * Returns true if the string could be used as a segment in a field path
     * without escaping.
     */
    static isValidIdentifier(e5) {
      return v2.test(e5);
    }
    canonicalString() {
      return this.toArray().map((e5) => (e5 = e5.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), _FieldPath$1.isValidIdentifier(e5) || (e5 = "`" + e5 + "`"), e5)).join(".");
    }
    toString() {
      return this.canonicalString();
    }
    /**
     * Returns true if this field references the key of a document.
     */
    isKeyField() {
      return 1 === this.length && "__name__" === this.get(0);
    }
    /**
     * The field designating the key of a document.
     */
    static keyField() {
      return new _FieldPath$1(["__name__"]);
    }
    /**
     * Parses a field string from the given server-formatted string.
     *
     * - Splitting the empty string is not allowed (for now at least).
     * - Empty segments within the string (e.g. if there are two consecutive
     *   separators) are not allowed.
     *
     * TODO(b/37244157): we should make this more strict. Right now, it allows
     * non-identifier path components, even if they aren't escaped.
     */
    static fromServerFormat(e5) {
      const t4 = [];
      let n5 = "", r5 = 0;
      const __PRIVATE_addCurrentSegment = () => {
        if (0 === n5.length) throw new FirestoreError(C2.INVALID_ARGUMENT, `Invalid field path (${e5}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
        t4.push(n5), n5 = "";
      };
      let i4 = false;
      for (; r5 < e5.length; ) {
        const t5 = e5[r5];
        if ("\\" === t5) {
          if (r5 + 1 === e5.length) throw new FirestoreError(C2.INVALID_ARGUMENT, "Path has trailing escape character: " + e5);
          const t6 = e5[r5 + 1];
          if ("\\" !== t6 && "." !== t6 && "`" !== t6) throw new FirestoreError(C2.INVALID_ARGUMENT, "Path has invalid escape sequence: " + e5);
          n5 += t6, r5 += 2;
        } else "`" === t5 ? (i4 = !i4, r5++) : "." !== t5 || i4 ? (n5 += t5, r5++) : (__PRIVATE_addCurrentSegment(), r5++);
      }
      if (__PRIVATE_addCurrentSegment(), i4) throw new FirestoreError(C2.INVALID_ARGUMENT, "Unterminated ` in path: " + e5);
      return new _FieldPath$1(t4);
    }
    static emptyPath() {
      return new _FieldPath$1([]);
    }
  };
  var DocumentKey = class _DocumentKey {
    constructor(e5) {
      this.path = e5;
    }
    static fromPath(e5) {
      return new _DocumentKey(ResourcePath.fromString(e5));
    }
    static fromName(e5) {
      return new _DocumentKey(ResourcePath.fromString(e5).popFirst(5));
    }
    static empty() {
      return new _DocumentKey(ResourcePath.emptyPath());
    }
    get collectionGroup() {
      return this.path.popLast().lastSegment();
    }
    /** Returns true if the document is in the specified collectionId. */
    hasCollectionId(e5) {
      return this.path.length >= 2 && this.path.get(this.path.length - 2) === e5;
    }
    /** Returns the collection group (i.e. the name of the parent collection) for this key. */
    getCollectionGroup() {
      return this.path.get(this.path.length - 2);
    }
    /** Returns the fully qualified path to the parent collection. */
    getCollectionPath() {
      return this.path.popLast();
    }
    isEqual(e5) {
      return null !== e5 && 0 === ResourcePath.comparator(this.path, e5.path);
    }
    toString() {
      return this.path.toString();
    }
    static comparator(e5, t4) {
      return ResourcePath.comparator(e5.path, t4.path);
    }
    static isDocumentKey(e5) {
      return e5.length % 2 == 0;
    }
    /**
     * Creates and returns a new document key with the given segments.
     *
     * @param segments - The segments of the path to the document
     * @returns A new instance of DocumentKey
     */
    static fromSegments(e5) {
      return new _DocumentKey(new ResourcePath(e5.slice()));
    }
  };
  var FieldIndex = class {
    constructor(e5, t4, n5, r5) {
      this.indexId = e5, this.collectionGroup = t4, this.fields = n5, this.indexState = r5;
    }
  };
  function __PRIVATE_fieldIndexGetArraySegment(e5) {
    return e5.fields.find((e6) => 2 === e6.kind);
  }
  function __PRIVATE_fieldIndexGetDirectionalSegments(e5) {
    return e5.fields.filter((e6) => 2 !== e6.kind);
  }
  FieldIndex.UNKNOWN_ID = -1;
  var IndexSegment = class {
    constructor(e5, t4) {
      this.fieldPath = e5, this.kind = t4;
    }
  };
  var IndexState = class _IndexState {
    constructor(e5, t4) {
      this.sequenceNumber = e5, this.offset = t4;
    }
    /** The state of an index that has not yet been backfilled. */
    static empty() {
      return new _IndexState(0, IndexOffset.min());
    }
  };
  function __PRIVATE_newIndexOffsetSuccessorFromReadTime(e5, t4) {
    const n5 = e5.toTimestamp().seconds, r5 = e5.toTimestamp().nanoseconds + 1, i4 = SnapshotVersion.fromTimestamp(1e9 === r5 ? new Timestamp(n5 + 1, 0) : new Timestamp(n5, r5));
    return new IndexOffset(i4, DocumentKey.empty(), t4);
  }
  function __PRIVATE_newIndexOffsetFromDocument(e5) {
    return new IndexOffset(e5.readTime, e5.key, -1);
  }
  var IndexOffset = class _IndexOffset {
    constructor(e5, t4, n5) {
      this.readTime = e5, this.documentKey = t4, this.largestBatchId = n5;
    }
    /** Returns an offset that sorts before all regular offsets. */
    static min() {
      return new _IndexOffset(SnapshotVersion.min(), DocumentKey.empty(), -1);
    }
    /** Returns an offset that sorts after all regular offsets. */
    static max() {
      return new _IndexOffset(SnapshotVersion.max(), DocumentKey.empty(), -1);
    }
  };
  function __PRIVATE_indexOffsetComparator(e5, t4) {
    let n5 = e5.readTime.compareTo(t4.readTime);
    return 0 !== n5 ? n5 : (n5 = DocumentKey.comparator(e5.documentKey, t4.documentKey), 0 !== n5 ? n5 : __PRIVATE_primitiveComparator(e5.largestBatchId, t4.largestBatchId));
  }
  var F = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
  var PersistenceTransaction = class {
    constructor() {
      this.onCommittedListeners = [];
    }
    addOnCommittedListener(e5) {
      this.onCommittedListeners.push(e5);
    }
    raiseOnCommittedEvent() {
      this.onCommittedListeners.forEach((e5) => e5());
    }
  };
  async function __PRIVATE_ignoreIfPrimaryLeaseLoss(e5) {
    if (e5.code !== C2.FAILED_PRECONDITION || e5.message !== F) throw e5;
    __PRIVATE_logDebug("LocalStore", "Unexpectedly lost primary lease");
  }
  var PersistencePromise = class _PersistencePromise {
    constructor(e5) {
      this.nextCallback = null, this.catchCallback = null, // When the operation resolves, we'll set result or error and mark isDone.
      this.result = void 0, this.error = void 0, this.isDone = false, // Set to true when .then() or .catch() are called and prevents additional
      // chaining.
      this.callbackAttached = false, e5((e6) => {
        this.isDone = true, this.result = e6, this.nextCallback && // value should be defined unless T is Void, but we can't express
        // that in the type system.
        this.nextCallback(e6);
      }, (e6) => {
        this.isDone = true, this.error = e6, this.catchCallback && this.catchCallback(e6);
      });
    }
    catch(e5) {
      return this.next(void 0, e5);
    }
    next(e5, t4) {
      return this.callbackAttached && fail(), this.callbackAttached = true, this.isDone ? this.error ? this.wrapFailure(t4, this.error) : this.wrapSuccess(e5, this.result) : new _PersistencePromise((n5, r5) => {
        this.nextCallback = (t5) => {
          this.wrapSuccess(e5, t5).next(n5, r5);
        }, this.catchCallback = (e6) => {
          this.wrapFailure(t4, e6).next(n5, r5);
        };
      });
    }
    toPromise() {
      return new Promise((e5, t4) => {
        this.next(e5, t4);
      });
    }
    wrapUserFunction(e5) {
      try {
        const t4 = e5();
        return t4 instanceof _PersistencePromise ? t4 : _PersistencePromise.resolve(t4);
      } catch (e6) {
        return _PersistencePromise.reject(e6);
      }
    }
    wrapSuccess(e5, t4) {
      return e5 ? this.wrapUserFunction(() => e5(t4)) : _PersistencePromise.resolve(t4);
    }
    wrapFailure(e5, t4) {
      return e5 ? this.wrapUserFunction(() => e5(t4)) : _PersistencePromise.reject(t4);
    }
    static resolve(e5) {
      return new _PersistencePromise((t4, n5) => {
        t4(e5);
      });
    }
    static reject(e5) {
      return new _PersistencePromise((t4, n5) => {
        n5(e5);
      });
    }
    static waitFor(e5) {
      return new _PersistencePromise((t4, n5) => {
        let r5 = 0, i4 = 0, s4 = false;
        e5.forEach((e6) => {
          ++r5, e6.next(() => {
            ++i4, s4 && i4 === r5 && t4();
          }, (e7) => n5(e7));
        }), s4 = true, i4 === r5 && t4();
      });
    }
    /**
     * Given an array of predicate functions that asynchronously evaluate to a
     * boolean, implements a short-circuiting `or` between the results. Predicates
     * will be evaluated until one of them returns `true`, then stop. The final
     * result will be whether any of them returned `true`.
     */
    static or(e5) {
      let t4 = _PersistencePromise.resolve(false);
      for (const n5 of e5) t4 = t4.next((e6) => e6 ? _PersistencePromise.resolve(e6) : n5());
      return t4;
    }
    static forEach(e5, t4) {
      const n5 = [];
      return e5.forEach((e6, r5) => {
        n5.push(t4.call(this, e6, r5));
      }), this.waitFor(n5);
    }
    /**
     * Concurrently map all array elements through asynchronous function.
     */
    static mapArray(e5, t4) {
      return new _PersistencePromise((n5, r5) => {
        const i4 = e5.length, s4 = new Array(i4);
        let o4 = 0;
        for (let _2 = 0; _2 < i4; _2++) {
          const a3 = _2;
          t4(e5[a3]).next((e6) => {
            s4[a3] = e6, ++o4, o4 === i4 && n5(s4);
          }, (e6) => r5(e6));
        }
      });
    }
    /**
     * An alternative to recursive PersistencePromise calls, that avoids
     * potential memory problems from unbounded chains of promises.
     *
     * The `action` will be called repeatedly while `condition` is true.
     */
    static doWhile(e5, t4) {
      return new _PersistencePromise((n5, r5) => {
        const process2 = () => {
          true === e5() ? t4().next(() => {
            process2();
          }, r5) : n5();
        };
        process2();
      });
    }
  };
  var __PRIVATE_SimpleDbTransaction = class ___PRIVATE_SimpleDbTransaction {
    constructor(e5, t4) {
      this.action = e5, this.transaction = t4, this.aborted = false, /**
       * A `Promise` that resolves with the result of the IndexedDb transaction.
       */
      this.V = new __PRIVATE_Deferred(), this.transaction.oncomplete = () => {
        this.V.resolve();
      }, this.transaction.onabort = () => {
        t4.error ? this.V.reject(new __PRIVATE_IndexedDbTransactionError(e5, t4.error)) : this.V.resolve();
      }, this.transaction.onerror = (t5) => {
        const n5 = __PRIVATE_checkForAndReportiOSError(t5.target.error);
        this.V.reject(new __PRIVATE_IndexedDbTransactionError(e5, n5));
      };
    }
    static open(e5, t4, n5, r5) {
      try {
        return new ___PRIVATE_SimpleDbTransaction(t4, e5.transaction(r5, n5));
      } catch (e6) {
        throw new __PRIVATE_IndexedDbTransactionError(t4, e6);
      }
    }
    get m() {
      return this.V.promise;
    }
    abort(e5) {
      e5 && this.V.reject(e5), this.aborted || (__PRIVATE_logDebug("SimpleDb", "Aborting transaction:", e5 ? e5.message : "Client-initiated abort"), this.aborted = true, this.transaction.abort());
    }
    g() {
      const e5 = this.transaction;
      this.aborted || "function" != typeof e5.commit || e5.commit();
    }
    /**
     * Returns a SimpleDbStore<KeyType, ValueType> for the specified store. All
     * operations performed on the SimpleDbStore happen within the context of this
     * transaction and it cannot be used anymore once the transaction is
     * completed.
     *
     * Note that we can't actually enforce that the KeyType and ValueType are
     * correct, but they allow type safety through the rest of the consuming code.
     */
    store(e5) {
      const t4 = this.transaction.objectStore(e5);
      return new __PRIVATE_SimpleDbStore(t4);
    }
  };
  var __PRIVATE_SimpleDb = class ___PRIVATE_SimpleDb {
    /*
     * Creates a new SimpleDb wrapper for IndexedDb database `name`.
     *
     * Note that `version` must not be a downgrade. IndexedDB does not support
     * downgrading the schema version. We currently do not support any way to do
     * versioning outside of IndexedDB's versioning mechanism, as only
     * version-upgrade transactions are allowed to do things like create
     * objectstores.
     */
    constructor(e5, t4, n5) {
      this.name = e5, this.version = t4, this.p = n5;
      12.2 === ___PRIVATE_SimpleDb.S(getUA()) && __PRIVATE_logError("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");
    }
    /** Deletes the specified database. */
    static delete(e5) {
      return __PRIVATE_logDebug("SimpleDb", "Removing database:", e5), __PRIVATE_wrapRequest(window.indexedDB.deleteDatabase(e5)).toPromise();
    }
    /** Returns true if IndexedDB is available in the current environment. */
    static D() {
      if (!isIndexedDBAvailable()) return false;
      if (___PRIVATE_SimpleDb.C()) return true;
      const e5 = getUA(), t4 = ___PRIVATE_SimpleDb.S(e5), n5 = 0 < t4 && t4 < 10, r5 = __PRIVATE_getAndroidVersion(e5), i4 = 0 < r5 && r5 < 4.5;
      return !(e5.indexOf("MSIE ") > 0 || e5.indexOf("Trident/") > 0 || e5.indexOf("Edge/") > 0 || n5 || i4);
    }
    /**
     * Returns true if the backing IndexedDB store is the Node IndexedDBShim
     * (see https://github.com/axemclion/IndexedDBShim).
     */
    static C() {
      var e5;
      return "undefined" != typeof process && "YES" === (null === (e5 = process.__PRIVATE_env) || void 0 === e5 ? void 0 : e5.v);
    }
    /** Helper to get a typed SimpleDbStore from a transaction. */
    static F(e5, t4) {
      return e5.store(t4);
    }
    // visible for testing
    /** Parse User Agent to determine iOS version. Returns -1 if not found. */
    static S(e5) {
      const t4 = e5.match(/i(?:phone|pad|pod) os ([\d_]+)/i), n5 = t4 ? t4[1].split("_").slice(0, 2).join(".") : "-1";
      return Number(n5);
    }
    /**
     * Opens the specified database, creating or upgrading it if necessary.
     */
    async M(e5) {
      return this.db || (__PRIVATE_logDebug("SimpleDb", "Opening database:", this.name), this.db = await new Promise((t4, n5) => {
        const r5 = indexedDB.open(this.name, this.version);
        r5.onsuccess = (e6) => {
          const n6 = e6.target.result;
          t4(n6);
        }, r5.onblocked = () => {
          n5(new __PRIVATE_IndexedDbTransactionError(e5, "Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));
        }, r5.onerror = (t5) => {
          const r6 = t5.target.error;
          "VersionError" === r6.name ? n5(new FirestoreError(C2.FAILED_PRECONDITION, "A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")) : "InvalidStateError" === r6.name ? n5(new FirestoreError(C2.FAILED_PRECONDITION, "Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: " + r6)) : n5(new __PRIVATE_IndexedDbTransactionError(e5, r6));
        }, r5.onupgradeneeded = (e6) => {
          __PRIVATE_logDebug("SimpleDb", 'Database "' + this.name + '" requires upgrade from version:', e6.oldVersion);
          const t5 = e6.target.result;
          this.p.O(t5, r5.transaction, e6.oldVersion, this.version).next(() => {
            __PRIVATE_logDebug("SimpleDb", "Database upgrade to version " + this.version + " complete");
          });
        };
      })), this.N && (this.db.onversionchange = (e6) => this.N(e6)), this.db;
    }
    L(e5) {
      this.N = e5, this.db && (this.db.onversionchange = (t4) => e5(t4));
    }
    async runTransaction(e5, t4, n5, r5) {
      const i4 = "readonly" === t4;
      let s4 = 0;
      for (; ; ) {
        ++s4;
        try {
          this.db = await this.M(e5);
          const t5 = __PRIVATE_SimpleDbTransaction.open(this.db, e5, i4 ? "readonly" : "readwrite", n5), s5 = r5(t5).next((e6) => (t5.g(), e6)).catch((e6) => (
            // Abort the transaction if there was an error.
            (t5.abort(e6), PersistencePromise.reject(e6))
          )).toPromise();
          return s5.catch(() => {
          }), // Wait for the transaction to complete (i.e. IndexedDb's onsuccess event to
          // fire), but still return the original transactionFnResult back to the
          // caller.
          await t5.m, s5;
        } catch (e6) {
          const t5 = e6, n6 = "FirebaseError" !== t5.name && s4 < 3;
          if (__PRIVATE_logDebug("SimpleDb", "Transaction failed with error:", t5.message, "Retrying:", n6), this.close(), !n6) return Promise.reject(t5);
        }
      }
    }
    close() {
      this.db && this.db.close(), this.db = void 0;
    }
  };
  function __PRIVATE_getAndroidVersion(e5) {
    const t4 = e5.match(/Android ([\d.]+)/i), n5 = t4 ? t4[1].split(".").slice(0, 2).join(".") : "-1";
    return Number(n5);
  }
  var __PRIVATE_IterationController = class {
    constructor(e5) {
      this.B = e5, this.k = false, this.q = null;
    }
    get isDone() {
      return this.k;
    }
    get K() {
      return this.q;
    }
    set cursor(e5) {
      this.B = e5;
    }
    /**
     * This function can be called to stop iteration at any point.
     */
    done() {
      this.k = true;
    }
    /**
     * This function can be called to skip to that next key, which could be
     * an index or a primary key.
     */
    $(e5) {
      this.q = e5;
    }
    /**
     * Delete the current cursor value from the object store.
     *
     * NOTE: You CANNOT do this with a keysOnly query.
     */
    delete() {
      return __PRIVATE_wrapRequest(this.B.delete());
    }
  };
  var __PRIVATE_IndexedDbTransactionError = class extends FirestoreError {
    constructor(e5, t4) {
      super(C2.UNAVAILABLE, `IndexedDB transaction '${e5}' failed: ${t4}`), this.name = "IndexedDbTransactionError";
    }
  };
  function __PRIVATE_isIndexedDbTransactionError(e5) {
    return "IndexedDbTransactionError" === e5.name;
  }
  var __PRIVATE_SimpleDbStore = class {
    constructor(e5) {
      this.store = e5;
    }
    put(e5, t4) {
      let n5;
      return void 0 !== t4 ? (__PRIVATE_logDebug("SimpleDb", "PUT", this.store.name, e5, t4), n5 = this.store.put(t4, e5)) : (__PRIVATE_logDebug("SimpleDb", "PUT", this.store.name, "<auto-key>", e5), n5 = this.store.put(e5)), __PRIVATE_wrapRequest(n5);
    }
    /**
     * Adds a new value into an Object Store and returns the new key. Similar to
     * IndexedDb's `add()`, this method will fail on primary key collisions.
     *
     * @param value - The object to write.
     * @returns The key of the value to add.
     */
    add(e5) {
      __PRIVATE_logDebug("SimpleDb", "ADD", this.store.name, e5, e5);
      return __PRIVATE_wrapRequest(this.store.add(e5));
    }
    /**
     * Gets the object with the specified key from the specified store, or null
     * if no object exists with the specified key.
     *
     * @key The key of the object to get.
     * @returns The object with the specified key or null if no object exists.
     */
    get(e5) {
      return __PRIVATE_wrapRequest(this.store.get(e5)).next((t4) => (
        // Normalize nonexistence to null.
        (void 0 === t4 && (t4 = null), __PRIVATE_logDebug("SimpleDb", "GET", this.store.name, e5, t4), t4)
      ));
    }
    delete(e5) {
      __PRIVATE_logDebug("SimpleDb", "DELETE", this.store.name, e5);
      return __PRIVATE_wrapRequest(this.store.delete(e5));
    }
    /**
     * If we ever need more of the count variants, we can add overloads. For now,
     * all we need is to count everything in a store.
     *
     * Returns the number of rows in the store.
     */
    count() {
      __PRIVATE_logDebug("SimpleDb", "COUNT", this.store.name);
      return __PRIVATE_wrapRequest(this.store.count());
    }
    U(e5, t4) {
      const n5 = this.options(e5, t4), r5 = n5.index ? this.store.index(n5.index) : this.store;
      if ("function" == typeof r5.getAll) {
        const e6 = r5.getAll(n5.range);
        return new PersistencePromise((t5, n6) => {
          e6.onerror = (e7) => {
            n6(e7.target.error);
          }, e6.onsuccess = (e7) => {
            t5(e7.target.result);
          };
        });
      }
      {
        const e6 = this.cursor(n5), t5 = [];
        return this.W(e6, (e7, n6) => {
          t5.push(n6);
        }).next(() => t5);
      }
    }
    /**
     * Loads the first `count` elements from the provided index range. Loads all
     * elements if no limit is provided.
     */
    G(e5, t4) {
      const n5 = this.store.getAll(e5, null === t4 ? void 0 : t4);
      return new PersistencePromise((e6, t5) => {
        n5.onerror = (e7) => {
          t5(e7.target.error);
        }, n5.onsuccess = (t6) => {
          e6(t6.target.result);
        };
      });
    }
    j(e5, t4) {
      __PRIVATE_logDebug("SimpleDb", "DELETE ALL", this.store.name);
      const n5 = this.options(e5, t4);
      n5.H = false;
      const r5 = this.cursor(n5);
      return this.W(r5, (e6, t5, n6) => n6.delete());
    }
    J(e5, t4) {
      let n5;
      t4 ? n5 = e5 : (n5 = {}, t4 = e5);
      const r5 = this.cursor(n5);
      return this.W(r5, t4);
    }
    /**
     * Iterates over a store, but waits for the given callback to complete for
     * each entry before iterating the next entry. This allows the callback to do
     * asynchronous work to determine if this iteration should continue.
     *
     * The provided callback should return `true` to continue iteration, and
     * `false` otherwise.
     */
    Y(e5) {
      const t4 = this.cursor({});
      return new PersistencePromise((n5, r5) => {
        t4.onerror = (e6) => {
          const t5 = __PRIVATE_checkForAndReportiOSError(e6.target.error);
          r5(t5);
        }, t4.onsuccess = (t5) => {
          const r6 = t5.target.result;
          r6 ? e5(r6.primaryKey, r6.value).next((e6) => {
            e6 ? r6.continue() : n5();
          }) : n5();
        };
      });
    }
    W(e5, t4) {
      const n5 = [];
      return new PersistencePromise((r5, i4) => {
        e5.onerror = (e6) => {
          i4(e6.target.error);
        }, e5.onsuccess = (e6) => {
          const i5 = e6.target.result;
          if (!i5) return void r5();
          const s4 = new __PRIVATE_IterationController(i5), o4 = t4(i5.primaryKey, i5.value, s4);
          if (o4 instanceof PersistencePromise) {
            const e7 = o4.catch((e8) => (s4.done(), PersistencePromise.reject(e8)));
            n5.push(e7);
          }
          s4.isDone ? r5() : null === s4.K ? i5.continue() : i5.continue(s4.K);
        };
      }).next(() => PersistencePromise.waitFor(n5));
    }
    options(e5, t4) {
      let n5;
      return void 0 !== e5 && ("string" == typeof e5 ? n5 = e5 : t4 = e5), {
        index: n5,
        range: t4
      };
    }
    cursor(e5) {
      let t4 = "next";
      if (e5.reverse && (t4 = "prev"), e5.index) {
        const n5 = this.store.index(e5.index);
        return e5.H ? n5.openKeyCursor(e5.range, t4) : n5.openCursor(e5.range, t4);
      }
      return this.store.openCursor(e5.range, t4);
    }
  };
  function __PRIVATE_wrapRequest(e5) {
    return new PersistencePromise((t4, n5) => {
      e5.onsuccess = (e6) => {
        const n6 = e6.target.result;
        t4(n6);
      }, e5.onerror = (e6) => {
        const t5 = __PRIVATE_checkForAndReportiOSError(e6.target.error);
        n5(t5);
      };
    });
  }
  var M2 = false;
  function __PRIVATE_checkForAndReportiOSError(e5) {
    const t4 = __PRIVATE_SimpleDb.S(getUA());
    if (t4 >= 12.2 && t4 < 13) {
      const t5 = "An internal error was encountered in the Indexed Database server";
      if (e5.message.indexOf(t5) >= 0) {
        const e6 = new FirestoreError("internal", `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t5}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);
        return M2 || (M2 = true, // Throw a global exception outside of this promise chain, for the user to
        // potentially catch.
        setTimeout(() => {
          throw e6;
        }, 0)), e6;
      }
    }
    return e5;
  }
  var __PRIVATE_IndexBackfillerScheduler = class {
    constructor(e5, t4) {
      this.asyncQueue = e5, this.Z = t4, this.task = null;
    }
    start() {
      this.X(15e3);
    }
    stop() {
      this.task && (this.task.cancel(), this.task = null);
    }
    get started() {
      return null !== this.task;
    }
    X(e5) {
      __PRIVATE_logDebug("IndexBackfiller", `Scheduled in ${e5}ms`), this.task = this.asyncQueue.enqueueAfterDelay("index_backfill", e5, async () => {
        this.task = null;
        try {
          __PRIVATE_logDebug("IndexBackfiller", `Documents written: ${await this.Z.ee()}`);
        } catch (e6) {
          __PRIVATE_isIndexedDbTransactionError(e6) ? __PRIVATE_logDebug("IndexBackfiller", "Ignoring IndexedDB error during index backfill: ", e6) : await __PRIVATE_ignoreIfPrimaryLeaseLoss(e6);
        }
        await this.X(6e4);
      });
    }
  };
  var __PRIVATE_IndexBackfiller = class {
    constructor(e5, t4) {
      this.localStore = e5, this.persistence = t4;
    }
    async ee(e5 = 50) {
      return this.persistence.runTransaction("Backfill Indexes", "readwrite-primary", (t4) => this.te(t4, e5));
    }
    /** Writes index entries until the cap is reached. Returns the number of documents processed. */
    te(e5, t4) {
      const n5 = /* @__PURE__ */ new Set();
      let r5 = t4, i4 = true;
      return PersistencePromise.doWhile(() => true === i4 && r5 > 0, () => this.localStore.indexManager.getNextCollectionGroupToUpdate(e5).next((t5) => {
        if (null !== t5 && !n5.has(t5)) return __PRIVATE_logDebug("IndexBackfiller", `Processing collection: ${t5}`), this.ne(e5, t5, r5).next((e6) => {
          r5 -= e6, n5.add(t5);
        });
        i4 = false;
      })).next(() => t4 - r5);
    }
    /**
     * Writes entries for the provided collection group. Returns the number of documents processed.
     */
    ne(e5, t4, n5) {
      return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e5, t4).next((r5) => this.localStore.localDocuments.getNextDocuments(e5, t4, r5, n5).next((n6) => {
        const i4 = n6.changes;
        return this.localStore.indexManager.updateIndexEntries(e5, i4).next(() => this.re(r5, n6)).next((n7) => (__PRIVATE_logDebug("IndexBackfiller", `Updating offset: ${n7}`), this.localStore.indexManager.updateCollectionGroup(e5, t4, n7))).next(() => i4.size);
      }));
    }
    /** Returns the next offset based on the provided documents. */
    re(e5, t4) {
      let n5 = e5;
      return t4.changes.forEach((e6, t5) => {
        const r5 = __PRIVATE_newIndexOffsetFromDocument(t5);
        __PRIVATE_indexOffsetComparator(r5, n5) > 0 && (n5 = r5);
      }), new IndexOffset(n5.readTime, n5.documentKey, Math.max(t4.batchId, e5.largestBatchId));
    }
  };
  var __PRIVATE_ListenSequence = class {
    constructor(e5, t4) {
      this.previousValue = e5, t4 && (t4.sequenceNumberHandler = (e6) => this.ie(e6), this.se = (e6) => t4.writeSequenceNumber(e6));
    }
    ie(e5) {
      return this.previousValue = Math.max(e5, this.previousValue), this.previousValue;
    }
    next() {
      const e5 = ++this.previousValue;
      return this.se && this.se(e5), e5;
    }
  };
  __PRIVATE_ListenSequence.oe = -1;
  function __PRIVATE_isNullOrUndefined(e5) {
    return null == e5;
  }
  function __PRIVATE_isNegativeZero(e5) {
    return 0 === e5 && 1 / e5 == -1 / 0;
  }
  function __PRIVATE_encodeResourcePath(e5) {
    let t4 = "";
    for (let n5 = 0; n5 < e5.length; n5++) t4.length > 0 && (t4 = __PRIVATE_encodeSeparator(t4)), t4 = __PRIVATE_encodeSegment(e5.get(n5), t4);
    return __PRIVATE_encodeSeparator(t4);
  }
  function __PRIVATE_encodeSegment(e5, t4) {
    let n5 = t4;
    const r5 = e5.length;
    for (let t5 = 0; t5 < r5; t5++) {
      const r6 = e5.charAt(t5);
      switch (r6) {
        case "\0":
          n5 += "";
          break;
        case "":
          n5 += "";
          break;
        default:
          n5 += r6;
      }
    }
    return n5;
  }
  function __PRIVATE_encodeSeparator(e5) {
    return e5 + "";
  }
  function __PRIVATE_decodeResourcePath(e5) {
    const t4 = e5.length;
    if (__PRIVATE_hardAssert(t4 >= 2), 2 === t4) return __PRIVATE_hardAssert("" === e5.charAt(0) && "" === e5.charAt(1)), ResourcePath.emptyPath();
    const __PRIVATE_lastReasonableEscapeIndex = t4 - 2, n5 = [];
    let r5 = "";
    for (let i4 = 0; i4 < t4; ) {
      const t5 = e5.indexOf("", i4);
      (t5 < 0 || t5 > __PRIVATE_lastReasonableEscapeIndex) && fail();
      switch (e5.charAt(t5 + 1)) {
        case "":
          const s4 = e5.substring(i4, t5);
          let o4;
          0 === r5.length ? (
            // Avoid copying for the common case of a segment that excludes \0
            // and \001
            o4 = s4
          ) : (r5 += s4, o4 = r5, r5 = ""), n5.push(o4);
          break;
        case "":
          r5 += e5.substring(i4, t5), r5 += "\0";
          break;
        case "":
          r5 += e5.substring(i4, t5 + 1);
          break;
        default:
          fail();
      }
      i4 = t5 + 2;
    }
    return new ResourcePath(n5);
  }
  var x2 = ["userId", "batchId"];
  function __PRIVATE_newDbDocumentMutationPrefixForPath(e5, t4) {
    return [e5, __PRIVATE_encodeResourcePath(t4)];
  }
  function __PRIVATE_newDbDocumentMutationKey(e5, t4, n5) {
    return [e5, __PRIVATE_encodeResourcePath(t4), n5];
  }
  var O = {};
  var N2 = ["prefixPath", "collectionGroup", "readTime", "documentId"];
  var L2 = ["prefixPath", "collectionGroup", "documentId"];
  var B = ["collectionGroup", "readTime", "prefixPath", "documentId"];
  var k2 = ["canonicalId", "targetId"];
  var q = ["targetId", "path"];
  var Q = ["path", "targetId"];
  var K = ["collectionId", "parent"];
  var $2 = ["indexId", "uid"];
  var U = ["uid", "sequenceNumber"];
  var W = ["indexId", "uid", "arrayValue", "directionalValue", "orderedDocumentKey", "documentKey"];
  var G = ["indexId", "uid", "orderedDocumentKey"];
  var z = ["userId", "collectionPath", "documentId"];
  var j2 = ["userId", "collectionPath", "largestBatchId"];
  var H2 = ["userId", "collectionGroup", "largestBatchId"];
  var J = [...[...[...[...["mutationQueues", "mutations", "documentMutations", "remoteDocuments", "targets", "owner", "targetGlobal", "targetDocuments"], "clientMetadata"], "remoteDocumentGlobal"], "collectionParents"], "bundles", "namedQueries"];
  var Y = [...J, "documentOverlays"];
  var Z2 = ["mutationQueues", "mutations", "documentMutations", "remoteDocumentsV14", "targets", "owner", "targetGlobal", "targetDocuments", "clientMetadata", "remoteDocumentGlobal", "collectionParents", "bundles", "namedQueries", "documentOverlays"];
  var X = Z2;
  var ee = [...X, "indexConfiguration", "indexState", "indexEntries"];
  var te = ee;
  var __PRIVATE_IndexedDbTransaction = class extends PersistenceTransaction {
    constructor(e5, t4) {
      super(), this._e = e5, this.currentSequenceNumber = t4;
    }
  };
  function __PRIVATE_getStore(e5, t4) {
    const n5 = __PRIVATE_debugCast(e5);
    return __PRIVATE_SimpleDb.F(n5._e, t4);
  }
  function __PRIVATE_objectSize(e5) {
    let t4 = 0;
    for (const n5 in e5) Object.prototype.hasOwnProperty.call(e5, n5) && t4++;
    return t4;
  }
  function forEach(e5, t4) {
    for (const n5 in e5) Object.prototype.hasOwnProperty.call(e5, n5) && t4(n5, e5[n5]);
  }
  function isEmpty(e5) {
    for (const t4 in e5) if (Object.prototype.hasOwnProperty.call(e5, t4)) return false;
    return true;
  }
  var SortedMap = class _SortedMap {
    constructor(e5, t4) {
      this.comparator = e5, this.root = t4 || LLRBNode.EMPTY;
    }
    // Returns a copy of the map, with the specified key/value added or replaced.
    insert(e5, t4) {
      return new _SortedMap(this.comparator, this.root.insert(e5, t4, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
    }
    // Returns a copy of the map, with the specified key removed.
    remove(e5) {
      return new _SortedMap(this.comparator, this.root.remove(e5, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
    }
    // Returns the value of the node with the given key, or null.
    get(e5) {
      let t4 = this.root;
      for (; !t4.isEmpty(); ) {
        const n5 = this.comparator(e5, t4.key);
        if (0 === n5) return t4.value;
        n5 < 0 ? t4 = t4.left : n5 > 0 && (t4 = t4.right);
      }
      return null;
    }
    // Returns the index of the element in this sorted map, or -1 if it doesn't
    // exist.
    indexOf(e5) {
      let t4 = 0, n5 = this.root;
      for (; !n5.isEmpty(); ) {
        const r5 = this.comparator(e5, n5.key);
        if (0 === r5) return t4 + n5.left.size;
        r5 < 0 ? n5 = n5.left : (
          // Count all nodes left of the node plus the node itself
          (t4 += n5.left.size + 1, n5 = n5.right)
        );
      }
      return -1;
    }
    isEmpty() {
      return this.root.isEmpty();
    }
    // Returns the total number of nodes in the map.
    get size() {
      return this.root.size;
    }
    // Returns the minimum key in the map.
    minKey() {
      return this.root.minKey();
    }
    // Returns the maximum key in the map.
    maxKey() {
      return this.root.maxKey();
    }
    // Traverses the map in key order and calls the specified action function
    // for each key/value pair. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    inorderTraversal(e5) {
      return this.root.inorderTraversal(e5);
    }
    forEach(e5) {
      this.inorderTraversal((t4, n5) => (e5(t4, n5), false));
    }
    toString() {
      const e5 = [];
      return this.inorderTraversal((t4, n5) => (e5.push(`${t4}:${n5}`), false)), `{${e5.join(", ")}}`;
    }
    // Traverses the map in reverse key order and calls the specified action
    // function for each key/value pair. If action returns true, traversal is
    // aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    reverseTraversal(e5) {
      return this.root.reverseTraversal(e5);
    }
    // Returns an iterator over the SortedMap.
    getIterator() {
      return new SortedMapIterator(this.root, null, this.comparator, false);
    }
    getIteratorFrom(e5) {
      return new SortedMapIterator(this.root, e5, this.comparator, false);
    }
    getReverseIterator() {
      return new SortedMapIterator(this.root, null, this.comparator, true);
    }
    getReverseIteratorFrom(e5) {
      return new SortedMapIterator(this.root, e5, this.comparator, true);
    }
  };
  var SortedMapIterator = class {
    constructor(e5, t4, n5, r5) {
      this.isReverse = r5, this.nodeStack = [];
      let i4 = 1;
      for (; !e5.isEmpty(); ) if (i4 = t4 ? n5(e5.key, t4) : 1, // flip the comparison if we're going in reverse
      t4 && r5 && (i4 *= -1), i4 < 0)
        e5 = this.isReverse ? e5.left : e5.right;
      else {
        if (0 === i4) {
          this.nodeStack.push(e5);
          break;
        }
        this.nodeStack.push(e5), e5 = this.isReverse ? e5.right : e5.left;
      }
    }
    getNext() {
      let e5 = this.nodeStack.pop();
      const t4 = {
        key: e5.key,
        value: e5.value
      };
      if (this.isReverse) for (e5 = e5.left; !e5.isEmpty(); ) this.nodeStack.push(e5), e5 = e5.right;
      else for (e5 = e5.right; !e5.isEmpty(); ) this.nodeStack.push(e5), e5 = e5.left;
      return t4;
    }
    hasNext() {
      return this.nodeStack.length > 0;
    }
    peek() {
      if (0 === this.nodeStack.length) return null;
      const e5 = this.nodeStack[this.nodeStack.length - 1];
      return {
        key: e5.key,
        value: e5.value
      };
    }
  };
  var LLRBNode = class _LLRBNode {
    constructor(e5, t4, n5, r5, i4) {
      this.key = e5, this.value = t4, this.color = null != n5 ? n5 : _LLRBNode.RED, this.left = null != r5 ? r5 : _LLRBNode.EMPTY, this.right = null != i4 ? i4 : _LLRBNode.EMPTY, this.size = this.left.size + 1 + this.right.size;
    }
    // Returns a copy of the current node, optionally replacing pieces of it.
    copy(e5, t4, n5, r5, i4) {
      return new _LLRBNode(null != e5 ? e5 : this.key, null != t4 ? t4 : this.value, null != n5 ? n5 : this.color, null != r5 ? r5 : this.left, null != i4 ? i4 : this.right);
    }
    isEmpty() {
      return false;
    }
    // Traverses the tree in key order and calls the specified action function
    // for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    inorderTraversal(e5) {
      return this.left.inorderTraversal(e5) || e5(this.key, this.value) || this.right.inorderTraversal(e5);
    }
    // Traverses the tree in reverse key order and calls the specified action
    // function for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    reverseTraversal(e5) {
      return this.right.reverseTraversal(e5) || e5(this.key, this.value) || this.left.reverseTraversal(e5);
    }
    // Returns the minimum node in the tree.
    min() {
      return this.left.isEmpty() ? this : this.left.min();
    }
    // Returns the maximum key in the tree.
    minKey() {
      return this.min().key;
    }
    // Returns the maximum key in the tree.
    maxKey() {
      return this.right.isEmpty() ? this.key : this.right.maxKey();
    }
    // Returns new tree, with the key/value added.
    insert(e5, t4, n5) {
      let r5 = this;
      const i4 = n5(e5, r5.key);
      return r5 = i4 < 0 ? r5.copy(null, null, null, r5.left.insert(e5, t4, n5), null) : 0 === i4 ? r5.copy(null, t4, null, null, null) : r5.copy(null, null, null, null, r5.right.insert(e5, t4, n5)), r5.fixUp();
    }
    removeMin() {
      if (this.left.isEmpty()) return _LLRBNode.EMPTY;
      let e5 = this;
      return e5.left.isRed() || e5.left.left.isRed() || (e5 = e5.moveRedLeft()), e5 = e5.copy(null, null, null, e5.left.removeMin(), null), e5.fixUp();
    }
    // Returns new tree, with the specified item removed.
    remove(e5, t4) {
      let n5, r5 = this;
      if (t4(e5, r5.key) < 0) r5.left.isEmpty() || r5.left.isRed() || r5.left.left.isRed() || (r5 = r5.moveRedLeft()), r5 = r5.copy(null, null, null, r5.left.remove(e5, t4), null);
      else {
        if (r5.left.isRed() && (r5 = r5.rotateRight()), r5.right.isEmpty() || r5.right.isRed() || r5.right.left.isRed() || (r5 = r5.moveRedRight()), 0 === t4(e5, r5.key)) {
          if (r5.right.isEmpty()) return _LLRBNode.EMPTY;
          n5 = r5.right.min(), r5 = r5.copy(n5.key, n5.value, null, null, r5.right.removeMin());
        }
        r5 = r5.copy(null, null, null, null, r5.right.remove(e5, t4));
      }
      return r5.fixUp();
    }
    isRed() {
      return this.color;
    }
    // Returns new tree after performing any needed rotations.
    fixUp() {
      let e5 = this;
      return e5.right.isRed() && !e5.left.isRed() && (e5 = e5.rotateLeft()), e5.left.isRed() && e5.left.left.isRed() && (e5 = e5.rotateRight()), e5.left.isRed() && e5.right.isRed() && (e5 = e5.colorFlip()), e5;
    }
    moveRedLeft() {
      let e5 = this.colorFlip();
      return e5.right.left.isRed() && (e5 = e5.copy(null, null, null, null, e5.right.rotateRight()), e5 = e5.rotateLeft(), e5 = e5.colorFlip()), e5;
    }
    moveRedRight() {
      let e5 = this.colorFlip();
      return e5.left.left.isRed() && (e5 = e5.rotateRight(), e5 = e5.colorFlip()), e5;
    }
    rotateLeft() {
      const e5 = this.copy(null, null, _LLRBNode.RED, null, this.right.left);
      return this.right.copy(null, null, this.color, e5, null);
    }
    rotateRight() {
      const e5 = this.copy(null, null, _LLRBNode.RED, this.left.right, null);
      return this.left.copy(null, null, this.color, null, e5);
    }
    colorFlip() {
      const e5 = this.left.copy(null, null, !this.left.color, null, null), t4 = this.right.copy(null, null, !this.right.color, null, null);
      return this.copy(null, null, !this.color, e5, t4);
    }
    // For testing.
    checkMaxDepth() {
      const e5 = this.check();
      return Math.pow(2, e5) <= this.size + 1;
    }
    // In a balanced RB tree, the black-depth (number of black nodes) from root to
    // leaves is equal on both sides.  This function verifies that or asserts.
    check() {
      if (this.isRed() && this.left.isRed()) throw fail();
      if (this.right.isRed()) throw fail();
      const e5 = this.left.check();
      if (e5 !== this.right.check()) throw fail();
      return e5 + (this.isRed() ? 0 : 1);
    }
  };
  LLRBNode.EMPTY = null, LLRBNode.RED = true, LLRBNode.BLACK = false;
  LLRBNode.EMPTY = new // Represents an empty node (a leaf node in the Red-Black Tree).
  class LLRBEmptyNode {
    constructor() {
      this.size = 0;
    }
    get key() {
      throw fail();
    }
    get value() {
      throw fail();
    }
    get color() {
      throw fail();
    }
    get left() {
      throw fail();
    }
    get right() {
      throw fail();
    }
    // Returns a copy of the current node.
    copy(e5, t4, n5, r5, i4) {
      return this;
    }
    // Returns a copy of the tree, with the specified key/value added.
    insert(e5, t4, n5) {
      return new LLRBNode(e5, t4);
    }
    // Returns a copy of the tree, with the specified key removed.
    remove(e5, t4) {
      return this;
    }
    isEmpty() {
      return true;
    }
    inorderTraversal(e5) {
      return false;
    }
    reverseTraversal(e5) {
      return false;
    }
    minKey() {
      return null;
    }
    maxKey() {
      return null;
    }
    isRed() {
      return false;
    }
    // For testing.
    checkMaxDepth() {
      return true;
    }
    check() {
      return 0;
    }
  }();
  var SortedSet = class _SortedSet {
    constructor(e5) {
      this.comparator = e5, this.data = new SortedMap(this.comparator);
    }
    has(e5) {
      return null !== this.data.get(e5);
    }
    first() {
      return this.data.minKey();
    }
    last() {
      return this.data.maxKey();
    }
    get size() {
      return this.data.size;
    }
    indexOf(e5) {
      return this.data.indexOf(e5);
    }
    /** Iterates elements in order defined by "comparator" */
    forEach(e5) {
      this.data.inorderTraversal((t4, n5) => (e5(t4), false));
    }
    /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */
    forEachInRange(e5, t4) {
      const n5 = this.data.getIteratorFrom(e5[0]);
      for (; n5.hasNext(); ) {
        const r5 = n5.getNext();
        if (this.comparator(r5.key, e5[1]) >= 0) return;
        t4(r5.key);
      }
    }
    /**
     * Iterates over `elem`s such that: start &lt;= elem until false is returned.
     */
    forEachWhile(e5, t4) {
      let n5;
      for (n5 = void 0 !== t4 ? this.data.getIteratorFrom(t4) : this.data.getIterator(); n5.hasNext(); ) {
        if (!e5(n5.getNext().key)) return;
      }
    }
    /** Finds the least element greater than or equal to `elem`. */
    firstAfterOrEqual(e5) {
      const t4 = this.data.getIteratorFrom(e5);
      return t4.hasNext() ? t4.getNext().key : null;
    }
    getIterator() {
      return new SortedSetIterator(this.data.getIterator());
    }
    getIteratorFrom(e5) {
      return new SortedSetIterator(this.data.getIteratorFrom(e5));
    }
    /** Inserts or updates an element */
    add(e5) {
      return this.copy(this.data.remove(e5).insert(e5, true));
    }
    /** Deletes an element */
    delete(e5) {
      return this.has(e5) ? this.copy(this.data.remove(e5)) : this;
    }
    isEmpty() {
      return this.data.isEmpty();
    }
    unionWith(e5) {
      let t4 = this;
      return t4.size < e5.size && (t4 = e5, e5 = this), e5.forEach((e6) => {
        t4 = t4.add(e6);
      }), t4;
    }
    isEqual(e5) {
      if (!(e5 instanceof _SortedSet)) return false;
      if (this.size !== e5.size) return false;
      const t4 = this.data.getIterator(), n5 = e5.data.getIterator();
      for (; t4.hasNext(); ) {
        const e6 = t4.getNext().key, r5 = n5.getNext().key;
        if (0 !== this.comparator(e6, r5)) return false;
      }
      return true;
    }
    toArray() {
      const e5 = [];
      return this.forEach((t4) => {
        e5.push(t4);
      }), e5;
    }
    toString() {
      const e5 = [];
      return this.forEach((t4) => e5.push(t4)), "SortedSet(" + e5.toString() + ")";
    }
    copy(e5) {
      const t4 = new _SortedSet(this.comparator);
      return t4.data = e5, t4;
    }
  };
  var SortedSetIterator = class {
    constructor(e5) {
      this.iter = e5;
    }
    getNext() {
      return this.iter.getNext().key;
    }
    hasNext() {
      return this.iter.hasNext();
    }
  };
  function __PRIVATE_advanceIterator(e5) {
    return e5.hasNext() ? e5.getNext() : void 0;
  }
  var FieldMask = class _FieldMask {
    constructor(e5) {
      this.fields = e5, // TODO(dimond): validation of FieldMask
      // Sort the field mask to support `FieldMask.isEqual()` and assert below.
      e5.sort(FieldPath$1.comparator);
    }
    static empty() {
      return new _FieldMask([]);
    }
    /**
     * Returns a new FieldMask object that is the result of adding all the given
     * fields paths to this field mask.
     */
    unionWith(e5) {
      let t4 = new SortedSet(FieldPath$1.comparator);
      for (const e6 of this.fields) t4 = t4.add(e6);
      for (const n5 of e5) t4 = t4.add(n5);
      return new _FieldMask(t4.toArray());
    }
    /**
     * Verifies that `fieldPath` is included by at least one field in this field
     * mask.
     *
     * This is an O(n) operation, where `n` is the size of the field mask.
     */
    covers(e5) {
      for (const t4 of this.fields) if (t4.isPrefixOf(e5)) return true;
      return false;
    }
    isEqual(e5) {
      return __PRIVATE_arrayEquals(this.fields, e5.fields, (e6, t4) => e6.isEqual(t4));
    }
  };
  var __PRIVATE_Base64DecodeError = class extends Error {
    constructor() {
      super(...arguments), this.name = "Base64DecodeError";
    }
  };
  var ByteString = class _ByteString {
    constructor(e5) {
      this.binaryString = e5;
    }
    static fromBase64String(e5) {
      const t4 = function __PRIVATE_decodeBase64(e6) {
        try {
          return atob(e6);
        } catch (e7) {
          throw "undefined" != typeof DOMException && e7 instanceof DOMException ? new __PRIVATE_Base64DecodeError("Invalid base64 string: " + e7) : e7;
        }
      }(e5);
      return new _ByteString(t4);
    }
    static fromUint8Array(e5) {
      const t4 = (
        /**
        * Helper function to convert an Uint8array to a binary string.
        */
        function __PRIVATE_binaryStringFromUint8Array(e6) {
          let t5 = "";
          for (let n5 = 0; n5 < e6.length; ++n5) t5 += String.fromCharCode(e6[n5]);
          return t5;
        }(e5)
      );
      return new _ByteString(t4);
    }
    [Symbol.iterator]() {
      let e5 = 0;
      return {
        next: () => e5 < this.binaryString.length ? {
          value: this.binaryString.charCodeAt(e5++),
          done: false
        } : {
          value: void 0,
          done: true
        }
      };
    }
    toBase64() {
      return function __PRIVATE_encodeBase64(e5) {
        return btoa(e5);
      }(this.binaryString);
    }
    toUint8Array() {
      return function __PRIVATE_uint8ArrayFromBinaryString(e5) {
        const t4 = new Uint8Array(e5.length);
        for (let n5 = 0; n5 < e5.length; n5++) t4[n5] = e5.charCodeAt(n5);
        return t4;
      }(this.binaryString);
    }
    approximateByteSize() {
      return 2 * this.binaryString.length;
    }
    compareTo(e5) {
      return __PRIVATE_primitiveComparator(this.binaryString, e5.binaryString);
    }
    isEqual(e5) {
      return this.binaryString === e5.binaryString;
    }
  };
  ByteString.EMPTY_BYTE_STRING = new ByteString("");
  var ne = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
  function __PRIVATE_normalizeTimestamp(e5) {
    if (__PRIVATE_hardAssert(!!e5), "string" == typeof e5) {
      let t4 = 0;
      const n5 = ne.exec(e5);
      if (__PRIVATE_hardAssert(!!n5), n5[1]) {
        let e6 = n5[1];
        e6 = (e6 + "000000000").substr(0, 9), t4 = Number(e6);
      }
      const r5 = new Date(e5);
      return {
        seconds: Math.floor(r5.getTime() / 1e3),
        nanos: t4
      };
    }
    return {
      seconds: __PRIVATE_normalizeNumber(e5.seconds),
      nanos: __PRIVATE_normalizeNumber(e5.nanos)
    };
  }
  function __PRIVATE_normalizeNumber(e5) {
    return "number" == typeof e5 ? e5 : "string" == typeof e5 ? Number(e5) : 0;
  }
  function __PRIVATE_normalizeByteString(e5) {
    return "string" == typeof e5 ? ByteString.fromBase64String(e5) : ByteString.fromUint8Array(e5);
  }
  function __PRIVATE_isServerTimestamp(e5) {
    var t4, n5;
    return "server_timestamp" === (null === (n5 = ((null === (t4 = null == e5 ? void 0 : e5.mapValue) || void 0 === t4 ? void 0 : t4.fields) || {}).__type__) || void 0 === n5 ? void 0 : n5.stringValue);
  }
  function __PRIVATE_getPreviousValue(e5) {
    const t4 = e5.mapValue.fields.__previous_value__;
    return __PRIVATE_isServerTimestamp(t4) ? __PRIVATE_getPreviousValue(t4) : t4;
  }
  function __PRIVATE_getLocalWriteTime(e5) {
    const t4 = __PRIVATE_normalizeTimestamp(e5.mapValue.fields.__local_write_time__.timestampValue);
    return new Timestamp(t4.seconds, t4.nanos);
  }
  var DatabaseInfo = class {
    /**
     * Constructs a DatabaseInfo using the provided host, databaseId and
     * persistenceKey.
     *
     * @param databaseId - The database to use.
     * @param appId - The Firebase App Id.
     * @param persistenceKey - A unique identifier for this Firestore's local
     * storage (used in conjunction with the databaseId).
     * @param host - The Firestore backend host to connect to.
     * @param ssl - Whether to use SSL when connecting.
     * @param forceLongPolling - Whether to use the forceLongPolling option
     * when using WebChannel as the network transport.
     * @param autoDetectLongPolling - Whether to use the detectBufferingProxy
     * option when using WebChannel as the network transport.
     * @param longPollingOptions Options that configure long-polling.
     * @param useFetchStreams Whether to use the Fetch API instead of
     * XMLHTTPRequest
     */
    constructor(e5, t4, n5, r5, i4, s4, o4, _2, a3) {
      this.databaseId = e5, this.appId = t4, this.persistenceKey = n5, this.host = r5, this.ssl = i4, this.forceLongPolling = s4, this.autoDetectLongPolling = o4, this.longPollingOptions = _2, this.useFetchStreams = a3;
    }
  };
  var DatabaseId = class _DatabaseId {
    constructor(e5, t4) {
      this.projectId = e5, this.database = t4 || "(default)";
    }
    static empty() {
      return new _DatabaseId("", "");
    }
    get isDefaultDatabase() {
      return "(default)" === this.database;
    }
    isEqual(e5) {
      return e5 instanceof _DatabaseId && e5.projectId === this.projectId && e5.database === this.database;
    }
  };
  var re = {
    mapValue: {
      fields: {
        __type__: {
          stringValue: "__max__"
        }
      }
    }
  };
  var ie = {
    nullValue: "NULL_VALUE"
  };
  function __PRIVATE_typeOrder(e5) {
    return "nullValue" in e5 ? 0 : "booleanValue" in e5 ? 1 : "integerValue" in e5 || "doubleValue" in e5 ? 2 : "timestampValue" in e5 ? 3 : "stringValue" in e5 ? 5 : "bytesValue" in e5 ? 6 : "referenceValue" in e5 ? 7 : "geoPointValue" in e5 ? 8 : "arrayValue" in e5 ? 9 : "mapValue" in e5 ? __PRIVATE_isServerTimestamp(e5) ? 4 : __PRIVATE_isMaxValue(e5) ? 9007199254740991 : 10 : fail();
  }
  function __PRIVATE_valueEquals(e5, t4) {
    if (e5 === t4) return true;
    const n5 = __PRIVATE_typeOrder(e5);
    if (n5 !== __PRIVATE_typeOrder(t4)) return false;
    switch (n5) {
      case 0:
      case 9007199254740991:
        return true;
      case 1:
        return e5.booleanValue === t4.booleanValue;
      case 4:
        return __PRIVATE_getLocalWriteTime(e5).isEqual(__PRIVATE_getLocalWriteTime(t4));
      case 3:
        return function __PRIVATE_timestampEquals(e6, t5) {
          if ("string" == typeof e6.timestampValue && "string" == typeof t5.timestampValue && e6.timestampValue.length === t5.timestampValue.length)
            return e6.timestampValue === t5.timestampValue;
          const n6 = __PRIVATE_normalizeTimestamp(e6.timestampValue), r5 = __PRIVATE_normalizeTimestamp(t5.timestampValue);
          return n6.seconds === r5.seconds && n6.nanos === r5.nanos;
        }(e5, t4);
      case 5:
        return e5.stringValue === t4.stringValue;
      case 6:
        return function __PRIVATE_blobEquals(e6, t5) {
          return __PRIVATE_normalizeByteString(e6.bytesValue).isEqual(__PRIVATE_normalizeByteString(t5.bytesValue));
        }(e5, t4);
      case 7:
        return e5.referenceValue === t4.referenceValue;
      case 8:
        return function __PRIVATE_geoPointEquals(e6, t5) {
          return __PRIVATE_normalizeNumber(e6.geoPointValue.latitude) === __PRIVATE_normalizeNumber(t5.geoPointValue.latitude) && __PRIVATE_normalizeNumber(e6.geoPointValue.longitude) === __PRIVATE_normalizeNumber(t5.geoPointValue.longitude);
        }(e5, t4);
      case 2:
        return function __PRIVATE_numberEquals(e6, t5) {
          if ("integerValue" in e6 && "integerValue" in t5) return __PRIVATE_normalizeNumber(e6.integerValue) === __PRIVATE_normalizeNumber(t5.integerValue);
          if ("doubleValue" in e6 && "doubleValue" in t5) {
            const n6 = __PRIVATE_normalizeNumber(e6.doubleValue), r5 = __PRIVATE_normalizeNumber(t5.doubleValue);
            return n6 === r5 ? __PRIVATE_isNegativeZero(n6) === __PRIVATE_isNegativeZero(r5) : isNaN(n6) && isNaN(r5);
          }
          return false;
        }(e5, t4);
      case 9:
        return __PRIVATE_arrayEquals(e5.arrayValue.values || [], t4.arrayValue.values || [], __PRIVATE_valueEquals);
      case 10:
        return function __PRIVATE_objectEquals(e6, t5) {
          const n6 = e6.mapValue.fields || {}, r5 = t5.mapValue.fields || {};
          if (__PRIVATE_objectSize(n6) !== __PRIVATE_objectSize(r5)) return false;
          for (const e7 in n6) if (n6.hasOwnProperty(e7) && (void 0 === r5[e7] || !__PRIVATE_valueEquals(n6[e7], r5[e7]))) return false;
          return true;
        }(e5, t4);
      default:
        return fail();
    }
  }
  function __PRIVATE_arrayValueContains(e5, t4) {
    return void 0 !== (e5.values || []).find((e6) => __PRIVATE_valueEquals(e6, t4));
  }
  function __PRIVATE_valueCompare(e5, t4) {
    if (e5 === t4) return 0;
    const n5 = __PRIVATE_typeOrder(e5), r5 = __PRIVATE_typeOrder(t4);
    if (n5 !== r5) return __PRIVATE_primitiveComparator(n5, r5);
    switch (n5) {
      case 0:
      case 9007199254740991:
        return 0;
      case 1:
        return __PRIVATE_primitiveComparator(e5.booleanValue, t4.booleanValue);
      case 2:
        return function __PRIVATE_compareNumbers(e6, t5) {
          const n6 = __PRIVATE_normalizeNumber(e6.integerValue || e6.doubleValue), r6 = __PRIVATE_normalizeNumber(t5.integerValue || t5.doubleValue);
          return n6 < r6 ? -1 : n6 > r6 ? 1 : n6 === r6 ? 0 : (
            // one or both are NaN.
            isNaN(n6) ? isNaN(r6) ? 0 : -1 : 1
          );
        }(e5, t4);
      case 3:
        return __PRIVATE_compareTimestamps(e5.timestampValue, t4.timestampValue);
      case 4:
        return __PRIVATE_compareTimestamps(__PRIVATE_getLocalWriteTime(e5), __PRIVATE_getLocalWriteTime(t4));
      case 5:
        return __PRIVATE_primitiveComparator(e5.stringValue, t4.stringValue);
      case 6:
        return function __PRIVATE_compareBlobs(e6, t5) {
          const n6 = __PRIVATE_normalizeByteString(e6), r6 = __PRIVATE_normalizeByteString(t5);
          return n6.compareTo(r6);
        }(e5.bytesValue, t4.bytesValue);
      case 7:
        return function __PRIVATE_compareReferences(e6, t5) {
          const n6 = e6.split("/"), r6 = t5.split("/");
          for (let e7 = 0; e7 < n6.length && e7 < r6.length; e7++) {
            const t6 = __PRIVATE_primitiveComparator(n6[e7], r6[e7]);
            if (0 !== t6) return t6;
          }
          return __PRIVATE_primitiveComparator(n6.length, r6.length);
        }(e5.referenceValue, t4.referenceValue);
      case 8:
        return function __PRIVATE_compareGeoPoints(e6, t5) {
          const n6 = __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e6.latitude), __PRIVATE_normalizeNumber(t5.latitude));
          if (0 !== n6) return n6;
          return __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e6.longitude), __PRIVATE_normalizeNumber(t5.longitude));
        }(e5.geoPointValue, t4.geoPointValue);
      case 9:
        return function __PRIVATE_compareArrays(e6, t5) {
          const n6 = e6.values || [], r6 = t5.values || [];
          for (let e7 = 0; e7 < n6.length && e7 < r6.length; ++e7) {
            const t6 = __PRIVATE_valueCompare(n6[e7], r6[e7]);
            if (t6) return t6;
          }
          return __PRIVATE_primitiveComparator(n6.length, r6.length);
        }(e5.arrayValue, t4.arrayValue);
      case 10:
        return function __PRIVATE_compareMaps(e6, t5) {
          if (e6 === re.mapValue && t5 === re.mapValue) return 0;
          if (e6 === re.mapValue) return 1;
          if (t5 === re.mapValue) return -1;
          const n6 = e6.fields || {}, r6 = Object.keys(n6), i4 = t5.fields || {}, s4 = Object.keys(i4);
          r6.sort(), s4.sort();
          for (let e7 = 0; e7 < r6.length && e7 < s4.length; ++e7) {
            const t6 = __PRIVATE_primitiveComparator(r6[e7], s4[e7]);
            if (0 !== t6) return t6;
            const o4 = __PRIVATE_valueCompare(n6[r6[e7]], i4[s4[e7]]);
            if (0 !== o4) return o4;
          }
          return __PRIVATE_primitiveComparator(r6.length, s4.length);
        }(e5.mapValue, t4.mapValue);
      default:
        throw fail();
    }
  }
  function __PRIVATE_compareTimestamps(e5, t4) {
    if ("string" == typeof e5 && "string" == typeof t4 && e5.length === t4.length) return __PRIVATE_primitiveComparator(e5, t4);
    const n5 = __PRIVATE_normalizeTimestamp(e5), r5 = __PRIVATE_normalizeTimestamp(t4), i4 = __PRIVATE_primitiveComparator(n5.seconds, r5.seconds);
    return 0 !== i4 ? i4 : __PRIVATE_primitiveComparator(n5.nanos, r5.nanos);
  }
  function canonicalId(e5) {
    return __PRIVATE_canonifyValue(e5);
  }
  function __PRIVATE_canonifyValue(e5) {
    return "nullValue" in e5 ? "null" : "booleanValue" in e5 ? "" + e5.booleanValue : "integerValue" in e5 ? "" + e5.integerValue : "doubleValue" in e5 ? "" + e5.doubleValue : "timestampValue" in e5 ? function __PRIVATE_canonifyTimestamp(e6) {
      const t4 = __PRIVATE_normalizeTimestamp(e6);
      return `time(${t4.seconds},${t4.nanos})`;
    }(e5.timestampValue) : "stringValue" in e5 ? e5.stringValue : "bytesValue" in e5 ? function __PRIVATE_canonifyByteString(e6) {
      return __PRIVATE_normalizeByteString(e6).toBase64();
    }(e5.bytesValue) : "referenceValue" in e5 ? function __PRIVATE_canonifyReference(e6) {
      return DocumentKey.fromName(e6).toString();
    }(e5.referenceValue) : "geoPointValue" in e5 ? function __PRIVATE_canonifyGeoPoint(e6) {
      return `geo(${e6.latitude},${e6.longitude})`;
    }(e5.geoPointValue) : "arrayValue" in e5 ? function __PRIVATE_canonifyArray(e6) {
      let t4 = "[", n5 = true;
      for (const r5 of e6.values || []) n5 ? n5 = false : t4 += ",", t4 += __PRIVATE_canonifyValue(r5);
      return t4 + "]";
    }(e5.arrayValue) : "mapValue" in e5 ? function __PRIVATE_canonifyMap(e6) {
      const t4 = Object.keys(e6.fields || {}).sort();
      let n5 = "{", r5 = true;
      for (const i4 of t4) r5 ? r5 = false : n5 += ",", n5 += `${i4}:${__PRIVATE_canonifyValue(e6.fields[i4])}`;
      return n5 + "}";
    }(e5.mapValue) : fail();
  }
  function __PRIVATE_refValue(e5, t4) {
    return {
      referenceValue: `projects/${e5.projectId}/databases/${e5.database}/documents/${t4.path.canonicalString()}`
    };
  }
  function isInteger(e5) {
    return !!e5 && "integerValue" in e5;
  }
  function isArray(e5) {
    return !!e5 && "arrayValue" in e5;
  }
  function __PRIVATE_isNullValue(e5) {
    return !!e5 && "nullValue" in e5;
  }
  function __PRIVATE_isNanValue(e5) {
    return !!e5 && "doubleValue" in e5 && isNaN(Number(e5.doubleValue));
  }
  function __PRIVATE_isMapValue(e5) {
    return !!e5 && "mapValue" in e5;
  }
  function __PRIVATE_deepClone(e5) {
    if (e5.geoPointValue) return {
      geoPointValue: Object.assign({}, e5.geoPointValue)
    };
    if (e5.timestampValue && "object" == typeof e5.timestampValue) return {
      timestampValue: Object.assign({}, e5.timestampValue)
    };
    if (e5.mapValue) {
      const t4 = {
        mapValue: {
          fields: {}
        }
      };
      return forEach(e5.mapValue.fields, (e6, n5) => t4.mapValue.fields[e6] = __PRIVATE_deepClone(n5)), t4;
    }
    if (e5.arrayValue) {
      const t4 = {
        arrayValue: {
          values: []
        }
      };
      for (let n5 = 0; n5 < (e5.arrayValue.values || []).length; ++n5) t4.arrayValue.values[n5] = __PRIVATE_deepClone(e5.arrayValue.values[n5]);
      return t4;
    }
    return Object.assign({}, e5);
  }
  function __PRIVATE_isMaxValue(e5) {
    return "__max__" === (((e5.mapValue || {}).fields || {}).__type__ || {}).stringValue;
  }
  function __PRIVATE_valuesGetLowerBound(e5) {
    return "nullValue" in e5 ? ie : "booleanValue" in e5 ? {
      booleanValue: false
    } : "integerValue" in e5 || "doubleValue" in e5 ? {
      doubleValue: NaN
    } : "timestampValue" in e5 ? {
      timestampValue: {
        seconds: Number.MIN_SAFE_INTEGER
      }
    } : "stringValue" in e5 ? {
      stringValue: ""
    } : "bytesValue" in e5 ? {
      bytesValue: ""
    } : "referenceValue" in e5 ? __PRIVATE_refValue(DatabaseId.empty(), DocumentKey.empty()) : "geoPointValue" in e5 ? {
      geoPointValue: {
        latitude: -90,
        longitude: -180
      }
    } : "arrayValue" in e5 ? {
      arrayValue: {}
    } : "mapValue" in e5 ? {
      mapValue: {}
    } : fail();
  }
  function __PRIVATE_valuesGetUpperBound(e5) {
    return "nullValue" in e5 ? {
      booleanValue: false
    } : "booleanValue" in e5 ? {
      doubleValue: NaN
    } : "integerValue" in e5 || "doubleValue" in e5 ? {
      timestampValue: {
        seconds: Number.MIN_SAFE_INTEGER
      }
    } : "timestampValue" in e5 ? {
      stringValue: ""
    } : "stringValue" in e5 ? {
      bytesValue: ""
    } : "bytesValue" in e5 ? __PRIVATE_refValue(DatabaseId.empty(), DocumentKey.empty()) : "referenceValue" in e5 ? {
      geoPointValue: {
        latitude: -90,
        longitude: -180
      }
    } : "geoPointValue" in e5 ? {
      arrayValue: {}
    } : "arrayValue" in e5 ? {
      mapValue: {}
    } : "mapValue" in e5 ? re : fail();
  }
  function __PRIVATE_lowerBoundCompare(e5, t4) {
    const n5 = __PRIVATE_valueCompare(e5.value, t4.value);
    return 0 !== n5 ? n5 : e5.inclusive && !t4.inclusive ? -1 : !e5.inclusive && t4.inclusive ? 1 : 0;
  }
  function __PRIVATE_upperBoundCompare(e5, t4) {
    const n5 = __PRIVATE_valueCompare(e5.value, t4.value);
    return 0 !== n5 ? n5 : e5.inclusive && !t4.inclusive ? 1 : !e5.inclusive && t4.inclusive ? -1 : 0;
  }
  var ObjectValue = class _ObjectValue {
    constructor(e5) {
      this.value = e5;
    }
    static empty() {
      return new _ObjectValue({
        mapValue: {}
      });
    }
    /**
     * Returns the value at the given path or null.
     *
     * @param path - the path to search
     * @returns The value at the path or null if the path is not set.
     */
    field(e5) {
      if (e5.isEmpty()) return this.value;
      {
        let t4 = this.value;
        for (let n5 = 0; n5 < e5.length - 1; ++n5) if (t4 = (t4.mapValue.fields || {})[e5.get(n5)], !__PRIVATE_isMapValue(t4)) return null;
        return t4 = (t4.mapValue.fields || {})[e5.lastSegment()], t4 || null;
      }
    }
    /**
     * Sets the field to the provided value.
     *
     * @param path - The field path to set.
     * @param value - The value to set.
     */
    set(e5, t4) {
      this.getFieldsMap(e5.popLast())[e5.lastSegment()] = __PRIVATE_deepClone(t4);
    }
    /**
     * Sets the provided fields to the provided values.
     *
     * @param data - A map of fields to values (or null for deletes).
     */
    setAll(e5) {
      let t4 = FieldPath$1.emptyPath(), n5 = {}, r5 = [];
      e5.forEach((e6, i5) => {
        if (!t4.isImmediateParentOf(i5)) {
          const e7 = this.getFieldsMap(t4);
          this.applyChanges(e7, n5, r5), n5 = {}, r5 = [], t4 = i5.popLast();
        }
        e6 ? n5[i5.lastSegment()] = __PRIVATE_deepClone(e6) : r5.push(i5.lastSegment());
      });
      const i4 = this.getFieldsMap(t4);
      this.applyChanges(i4, n5, r5);
    }
    /**
     * Removes the field at the specified path. If there is no field at the
     * specified path, nothing is changed.
     *
     * @param path - The field path to remove.
     */
    delete(e5) {
      const t4 = this.field(e5.popLast());
      __PRIVATE_isMapValue(t4) && t4.mapValue.fields && delete t4.mapValue.fields[e5.lastSegment()];
    }
    isEqual(e5) {
      return __PRIVATE_valueEquals(this.value, e5.value);
    }
    /**
     * Returns the map that contains the leaf element of `path`. If the parent
     * entry does not yet exist, or if it is not a map, a new map will be created.
     */
    getFieldsMap(e5) {
      let t4 = this.value;
      t4.mapValue.fields || (t4.mapValue = {
        fields: {}
      });
      for (let n5 = 0; n5 < e5.length; ++n5) {
        let r5 = t4.mapValue.fields[e5.get(n5)];
        __PRIVATE_isMapValue(r5) && r5.mapValue.fields || (r5 = {
          mapValue: {
            fields: {}
          }
        }, t4.mapValue.fields[e5.get(n5)] = r5), t4 = r5;
      }
      return t4.mapValue.fields;
    }
    /**
     * Modifies `fieldsMap` by adding, replacing or deleting the specified
     * entries.
     */
    applyChanges(e5, t4, n5) {
      forEach(t4, (t5, n6) => e5[t5] = n6);
      for (const t5 of n5) delete e5[t5];
    }
    clone() {
      return new _ObjectValue(__PRIVATE_deepClone(this.value));
    }
  };
  var MutableDocument = class _MutableDocument {
    constructor(e5, t4, n5, r5, i4, s4, o4) {
      this.key = e5, this.documentType = t4, this.version = n5, this.readTime = r5, this.createTime = i4, this.data = s4, this.documentState = o4;
    }
    /**
     * Creates a document with no known version or data, but which can serve as
     * base document for mutations.
     */
    static newInvalidDocument(e5) {
      return new _MutableDocument(
        e5,
        0,
        /* version */
        SnapshotVersion.min(),
        /* readTime */
        SnapshotVersion.min(),
        /* createTime */
        SnapshotVersion.min(),
        ObjectValue.empty(),
        0
        /* DocumentState.SYNCED */
      );
    }
    /**
     * Creates a new document that is known to exist with the given data at the
     * given version.
     */
    static newFoundDocument(e5, t4, n5, r5) {
      return new _MutableDocument(
        e5,
        1,
        /* version */
        t4,
        /* readTime */
        SnapshotVersion.min(),
        /* createTime */
        n5,
        r5,
        0
        /* DocumentState.SYNCED */
      );
    }
    /** Creates a new document that is known to not exist at the given version. */
    static newNoDocument(e5, t4) {
      return new _MutableDocument(
        e5,
        2,
        /* version */
        t4,
        /* readTime */
        SnapshotVersion.min(),
        /* createTime */
        SnapshotVersion.min(),
        ObjectValue.empty(),
        0
        /* DocumentState.SYNCED */
      );
    }
    /**
     * Creates a new document that is known to exist at the given version but
     * whose data is not known (e.g. a document that was updated without a known
     * base document).
     */
    static newUnknownDocument(e5, t4) {
      return new _MutableDocument(
        e5,
        3,
        /* version */
        t4,
        /* readTime */
        SnapshotVersion.min(),
        /* createTime */
        SnapshotVersion.min(),
        ObjectValue.empty(),
        2
        /* DocumentState.HAS_COMMITTED_MUTATIONS */
      );
    }
    /**
     * Changes the document type to indicate that it exists and that its version
     * and data are known.
     */
    convertToFoundDocument(e5, t4) {
      return !this.createTime.isEqual(SnapshotVersion.min()) || 2 !== this.documentType && 0 !== this.documentType || (this.createTime = e5), this.version = e5, this.documentType = 1, this.data = t4, this.documentState = 0, this;
    }
    /**
     * Changes the document type to indicate that it doesn't exist at the given
     * version.
     */
    convertToNoDocument(e5) {
      return this.version = e5, this.documentType = 2, this.data = ObjectValue.empty(), this.documentState = 0, this;
    }
    /**
     * Changes the document type to indicate that it exists at a given version but
     * that its data is not known (e.g. a document that was updated without a known
     * base document).
     */
    convertToUnknownDocument(e5) {
      return this.version = e5, this.documentType = 3, this.data = ObjectValue.empty(), this.documentState = 2, this;
    }
    setHasCommittedMutations() {
      return this.documentState = 2, this;
    }
    setHasLocalMutations() {
      return this.documentState = 1, this.version = SnapshotVersion.min(), this;
    }
    setReadTime(e5) {
      return this.readTime = e5, this;
    }
    get hasLocalMutations() {
      return 1 === this.documentState;
    }
    get hasCommittedMutations() {
      return 2 === this.documentState;
    }
    get hasPendingWrites() {
      return this.hasLocalMutations || this.hasCommittedMutations;
    }
    isValidDocument() {
      return 0 !== this.documentType;
    }
    isFoundDocument() {
      return 1 === this.documentType;
    }
    isNoDocument() {
      return 2 === this.documentType;
    }
    isUnknownDocument() {
      return 3 === this.documentType;
    }
    isEqual(e5) {
      return e5 instanceof _MutableDocument && this.key.isEqual(e5.key) && this.version.isEqual(e5.version) && this.documentType === e5.documentType && this.documentState === e5.documentState && this.data.isEqual(e5.data);
    }
    mutableCopy() {
      return new _MutableDocument(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
    }
    toString() {
      return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
    }
  };
  var Bound = class {
    constructor(e5, t4) {
      this.position = e5, this.inclusive = t4;
    }
  };
  function __PRIVATE_boundCompareToDocument(e5, t4, n5) {
    let r5 = 0;
    for (let i4 = 0; i4 < e5.position.length; i4++) {
      const s4 = t4[i4], o4 = e5.position[i4];
      if (s4.field.isKeyField()) r5 = DocumentKey.comparator(DocumentKey.fromName(o4.referenceValue), n5.key);
      else {
        r5 = __PRIVATE_valueCompare(o4, n5.data.field(s4.field));
      }
      if ("desc" === s4.dir && (r5 *= -1), 0 !== r5) break;
    }
    return r5;
  }
  function __PRIVATE_boundEquals(e5, t4) {
    if (null === e5) return null === t4;
    if (null === t4) return false;
    if (e5.inclusive !== t4.inclusive || e5.position.length !== t4.position.length) return false;
    for (let n5 = 0; n5 < e5.position.length; n5++) {
      if (!__PRIVATE_valueEquals(e5.position[n5], t4.position[n5])) return false;
    }
    return true;
  }
  var OrderBy = class {
    constructor(e5, t4 = "asc") {
      this.field = e5, this.dir = t4;
    }
  };
  function __PRIVATE_orderByEquals(e5, t4) {
    return e5.dir === t4.dir && e5.field.isEqual(t4.field);
  }
  var Filter = class {
  };
  var FieldFilter = class _FieldFilter extends Filter {
    constructor(e5, t4, n5) {
      super(), this.field = e5, this.op = t4, this.value = n5;
    }
    /**
     * Creates a filter based on the provided arguments.
     */
    static create(e5, t4, n5) {
      return e5.isKeyField() ? "in" === t4 || "not-in" === t4 ? this.createKeyFieldInFilter(e5, t4, n5) : new __PRIVATE_KeyFieldFilter(e5, t4, n5) : "array-contains" === t4 ? new __PRIVATE_ArrayContainsFilter(e5, n5) : "in" === t4 ? new __PRIVATE_InFilter(e5, n5) : "not-in" === t4 ? new __PRIVATE_NotInFilter(e5, n5) : "array-contains-any" === t4 ? new __PRIVATE_ArrayContainsAnyFilter(e5, n5) : new _FieldFilter(e5, t4, n5);
    }
    static createKeyFieldInFilter(e5, t4, n5) {
      return "in" === t4 ? new __PRIVATE_KeyFieldInFilter(e5, n5) : new __PRIVATE_KeyFieldNotInFilter(e5, n5);
    }
    matches(e5) {
      const t4 = e5.data.field(this.field);
      return "!=" === this.op ? null !== t4 && this.matchesComparison(__PRIVATE_valueCompare(t4, this.value)) : null !== t4 && __PRIVATE_typeOrder(this.value) === __PRIVATE_typeOrder(t4) && this.matchesComparison(__PRIVATE_valueCompare(t4, this.value));
    }
    matchesComparison(e5) {
      switch (this.op) {
        case "<":
          return e5 < 0;
        case "<=":
          return e5 <= 0;
        case "==":
          return 0 === e5;
        case "!=":
          return 0 !== e5;
        case ">":
          return e5 > 0;
        case ">=":
          return e5 >= 0;
        default:
          return fail();
      }
    }
    isInequality() {
      return [
        "<",
        "<=",
        ">",
        ">=",
        "!=",
        "not-in"
        /* Operator.NOT_IN */
      ].indexOf(this.op) >= 0;
    }
    getFlattenedFilters() {
      return [this];
    }
    getFilters() {
      return [this];
    }
  };
  var CompositeFilter = class _CompositeFilter extends Filter {
    constructor(e5, t4) {
      super(), this.filters = e5, this.op = t4, this.ae = null;
    }
    /**
     * Creates a filter based on the provided arguments.
     */
    static create(e5, t4) {
      return new _CompositeFilter(e5, t4);
    }
    matches(e5) {
      return __PRIVATE_compositeFilterIsConjunction(this) ? void 0 === this.filters.find((t4) => !t4.matches(e5)) : void 0 !== this.filters.find((t4) => t4.matches(e5));
    }
    getFlattenedFilters() {
      return null !== this.ae || (this.ae = this.filters.reduce((e5, t4) => e5.concat(t4.getFlattenedFilters()), [])), this.ae;
    }
    // Returns a mutable copy of `this.filters`
    getFilters() {
      return Object.assign([], this.filters);
    }
  };
  function __PRIVATE_compositeFilterIsConjunction(e5) {
    return "and" === e5.op;
  }
  function __PRIVATE_compositeFilterIsDisjunction(e5) {
    return "or" === e5.op;
  }
  function __PRIVATE_compositeFilterIsFlatConjunction(e5) {
    return __PRIVATE_compositeFilterIsFlat(e5) && __PRIVATE_compositeFilterIsConjunction(e5);
  }
  function __PRIVATE_compositeFilterIsFlat(e5) {
    for (const t4 of e5.filters) if (t4 instanceof CompositeFilter) return false;
    return true;
  }
  function __PRIVATE_canonifyFilter(e5) {
    if (e5 instanceof FieldFilter)
      return e5.field.canonicalString() + e5.op.toString() + canonicalId(e5.value);
    if (__PRIVATE_compositeFilterIsFlatConjunction(e5))
      return e5.filters.map((e6) => __PRIVATE_canonifyFilter(e6)).join(",");
    {
      const t4 = e5.filters.map((e6) => __PRIVATE_canonifyFilter(e6)).join(",");
      return `${e5.op}(${t4})`;
    }
  }
  function __PRIVATE_filterEquals(e5, t4) {
    return e5 instanceof FieldFilter ? function __PRIVATE_fieldFilterEquals(e6, t5) {
      return t5 instanceof FieldFilter && e6.op === t5.op && e6.field.isEqual(t5.field) && __PRIVATE_valueEquals(e6.value, t5.value);
    }(e5, t4) : e5 instanceof CompositeFilter ? function __PRIVATE_compositeFilterEquals(e6, t5) {
      if (t5 instanceof CompositeFilter && e6.op === t5.op && e6.filters.length === t5.filters.length) {
        return e6.filters.reduce((e7, n5, r5) => e7 && __PRIVATE_filterEquals(n5, t5.filters[r5]), true);
      }
      return false;
    }(e5, t4) : void fail();
  }
  function __PRIVATE_compositeFilterWithAddedFilters(e5, t4) {
    const n5 = e5.filters.concat(t4);
    return CompositeFilter.create(n5, e5.op);
  }
  function __PRIVATE_stringifyFilter(e5) {
    return e5 instanceof FieldFilter ? function __PRIVATE_stringifyFieldFilter(e6) {
      return `${e6.field.canonicalString()} ${e6.op} ${canonicalId(e6.value)}`;
    }(e5) : e5 instanceof CompositeFilter ? function __PRIVATE_stringifyCompositeFilter(e6) {
      return e6.op.toString() + " {" + e6.getFilters().map(__PRIVATE_stringifyFilter).join(" ,") + "}";
    }(e5) : "Filter";
  }
  var __PRIVATE_KeyFieldFilter = class extends FieldFilter {
    constructor(e5, t4, n5) {
      super(e5, t4, n5), this.key = DocumentKey.fromName(n5.referenceValue);
    }
    matches(e5) {
      const t4 = DocumentKey.comparator(e5.key, this.key);
      return this.matchesComparison(t4);
    }
  };
  var __PRIVATE_KeyFieldInFilter = class extends FieldFilter {
    constructor(e5, t4) {
      super(e5, "in", t4), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("in", t4);
    }
    matches(e5) {
      return this.keys.some((t4) => t4.isEqual(e5.key));
    }
  };
  var __PRIVATE_KeyFieldNotInFilter = class extends FieldFilter {
    constructor(e5, t4) {
      super(e5, "not-in", t4), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("not-in", t4);
    }
    matches(e5) {
      return !this.keys.some((t4) => t4.isEqual(e5.key));
    }
  };
  function __PRIVATE_extractDocumentKeysFromArrayValue(e5, t4) {
    var n5;
    return ((null === (n5 = t4.arrayValue) || void 0 === n5 ? void 0 : n5.values) || []).map((e6) => DocumentKey.fromName(e6.referenceValue));
  }
  var __PRIVATE_ArrayContainsFilter = class extends FieldFilter {
    constructor(e5, t4) {
      super(e5, "array-contains", t4);
    }
    matches(e5) {
      const t4 = e5.data.field(this.field);
      return isArray(t4) && __PRIVATE_arrayValueContains(t4.arrayValue, this.value);
    }
  };
  var __PRIVATE_InFilter = class extends FieldFilter {
    constructor(e5, t4) {
      super(e5, "in", t4);
    }
    matches(e5) {
      const t4 = e5.data.field(this.field);
      return null !== t4 && __PRIVATE_arrayValueContains(this.value.arrayValue, t4);
    }
  };
  var __PRIVATE_NotInFilter = class extends FieldFilter {
    constructor(e5, t4) {
      super(e5, "not-in", t4);
    }
    matches(e5) {
      if (__PRIVATE_arrayValueContains(this.value.arrayValue, {
        nullValue: "NULL_VALUE"
      })) return false;
      const t4 = e5.data.field(this.field);
      return null !== t4 && !__PRIVATE_arrayValueContains(this.value.arrayValue, t4);
    }
  };
  var __PRIVATE_ArrayContainsAnyFilter = class extends FieldFilter {
    constructor(e5, t4) {
      super(e5, "array-contains-any", t4);
    }
    matches(e5) {
      const t4 = e5.data.field(this.field);
      return !(!isArray(t4) || !t4.arrayValue.values) && t4.arrayValue.values.some((e6) => __PRIVATE_arrayValueContains(this.value.arrayValue, e6));
    }
  };
  var __PRIVATE_TargetImpl = class {
    constructor(e5, t4 = null, n5 = [], r5 = [], i4 = null, s4 = null, o4 = null) {
      this.path = e5, this.collectionGroup = t4, this.orderBy = n5, this.filters = r5, this.limit = i4, this.startAt = s4, this.endAt = o4, this.ue = null;
    }
  };
  function __PRIVATE_newTarget(e5, t4 = null, n5 = [], r5 = [], i4 = null, s4 = null, o4 = null) {
    return new __PRIVATE_TargetImpl(e5, t4, n5, r5, i4, s4, o4);
  }
  function __PRIVATE_canonifyTarget(e5) {
    const t4 = __PRIVATE_debugCast(e5);
    if (null === t4.ue) {
      let e6 = t4.path.canonicalString();
      null !== t4.collectionGroup && (e6 += "|cg:" + t4.collectionGroup), e6 += "|f:", e6 += t4.filters.map((e7) => __PRIVATE_canonifyFilter(e7)).join(","), e6 += "|ob:", e6 += t4.orderBy.map((e7) => function __PRIVATE_canonifyOrderBy(e8) {
        return e8.field.canonicalString() + e8.dir;
      }(e7)).join(","), __PRIVATE_isNullOrUndefined(t4.limit) || (e6 += "|l:", e6 += t4.limit), t4.startAt && (e6 += "|lb:", e6 += t4.startAt.inclusive ? "b:" : "a:", e6 += t4.startAt.position.map((e7) => canonicalId(e7)).join(",")), t4.endAt && (e6 += "|ub:", e6 += t4.endAt.inclusive ? "a:" : "b:", e6 += t4.endAt.position.map((e7) => canonicalId(e7)).join(",")), t4.ue = e6;
    }
    return t4.ue;
  }
  function __PRIVATE_targetEquals(e5, t4) {
    if (e5.limit !== t4.limit) return false;
    if (e5.orderBy.length !== t4.orderBy.length) return false;
    for (let n5 = 0; n5 < e5.orderBy.length; n5++) if (!__PRIVATE_orderByEquals(e5.orderBy[n5], t4.orderBy[n5])) return false;
    if (e5.filters.length !== t4.filters.length) return false;
    for (let n5 = 0; n5 < e5.filters.length; n5++) if (!__PRIVATE_filterEquals(e5.filters[n5], t4.filters[n5])) return false;
    return e5.collectionGroup === t4.collectionGroup && (!!e5.path.isEqual(t4.path) && (!!__PRIVATE_boundEquals(e5.startAt, t4.startAt) && __PRIVATE_boundEquals(e5.endAt, t4.endAt)));
  }
  function __PRIVATE_targetIsDocumentTarget(e5) {
    return DocumentKey.isDocumentKey(e5.path) && null === e5.collectionGroup && 0 === e5.filters.length;
  }
  function __PRIVATE_targetGetFieldFiltersForPath(e5, t4) {
    return e5.filters.filter((e6) => e6 instanceof FieldFilter && e6.field.isEqual(t4));
  }
  function __PRIVATE_targetGetAscendingBound(e5, t4, n5) {
    let r5 = ie, i4 = true;
    for (const n6 of __PRIVATE_targetGetFieldFiltersForPath(e5, t4)) {
      let e6 = ie, t5 = true;
      switch (n6.op) {
        case "<":
        case "<=":
          e6 = __PRIVATE_valuesGetLowerBound(n6.value);
          break;
        case "==":
        case "in":
        case ">=":
          e6 = n6.value;
          break;
        case ">":
          e6 = n6.value, t5 = false;
          break;
        case "!=":
        case "not-in":
          e6 = ie;
      }
      __PRIVATE_lowerBoundCompare({
        value: r5,
        inclusive: i4
      }, {
        value: e6,
        inclusive: t5
      }) < 0 && (r5 = e6, i4 = t5);
    }
    if (null !== n5) for (let s4 = 0; s4 < e5.orderBy.length; ++s4) {
      if (e5.orderBy[s4].field.isEqual(t4)) {
        const e6 = n5.position[s4];
        __PRIVATE_lowerBoundCompare({
          value: r5,
          inclusive: i4
        }, {
          value: e6,
          inclusive: n5.inclusive
        }) < 0 && (r5 = e6, i4 = n5.inclusive);
        break;
      }
    }
    return {
      value: r5,
      inclusive: i4
    };
  }
  function __PRIVATE_targetGetDescendingBound(e5, t4, n5) {
    let r5 = re, i4 = true;
    for (const n6 of __PRIVATE_targetGetFieldFiltersForPath(e5, t4)) {
      let e6 = re, t5 = true;
      switch (n6.op) {
        case ">=":
        case ">":
          e6 = __PRIVATE_valuesGetUpperBound(n6.value), t5 = false;
          break;
        case "==":
        case "in":
        case "<=":
          e6 = n6.value;
          break;
        case "<":
          e6 = n6.value, t5 = false;
          break;
        case "!=":
        case "not-in":
          e6 = re;
      }
      __PRIVATE_upperBoundCompare({
        value: r5,
        inclusive: i4
      }, {
        value: e6,
        inclusive: t5
      }) > 0 && (r5 = e6, i4 = t5);
    }
    if (null !== n5) for (let s4 = 0; s4 < e5.orderBy.length; ++s4) {
      if (e5.orderBy[s4].field.isEqual(t4)) {
        const e6 = n5.position[s4];
        __PRIVATE_upperBoundCompare({
          value: r5,
          inclusive: i4
        }, {
          value: e6,
          inclusive: n5.inclusive
        }) > 0 && (r5 = e6, i4 = n5.inclusive);
        break;
      }
    }
    return {
      value: r5,
      inclusive: i4
    };
  }
  var __PRIVATE_QueryImpl = class {
    /**
     * Initializes a Query with a path and optional additional query constraints.
     * Path must currently be empty if this is a collection group query.
     */
    constructor(e5, t4 = null, n5 = [], r5 = [], i4 = null, s4 = "F", o4 = null, _2 = null) {
      this.path = e5, this.collectionGroup = t4, this.explicitOrderBy = n5, this.filters = r5, this.limit = i4, this.limitType = s4, this.startAt = o4, this.endAt = _2, this.ce = null, // The corresponding `Target` of this `Query` instance, for use with
      // non-aggregate queries.
      this.le = null, // The corresponding `Target` of this `Query` instance, for use with
      // aggregate queries. Unlike targets for non-aggregate queries,
      // aggregate query targets do not contain normalized order-bys, they only
      // contain explicit order-bys.
      this.he = null, this.startAt, this.endAt;
    }
  };
  function __PRIVATE_newQuery(e5, t4, n5, r5, i4, s4, o4, _2) {
    return new __PRIVATE_QueryImpl(e5, t4, n5, r5, i4, s4, o4, _2);
  }
  function __PRIVATE_newQueryForPath(e5) {
    return new __PRIVATE_QueryImpl(e5);
  }
  function __PRIVATE_queryMatchesAllDocuments(e5) {
    return 0 === e5.filters.length && null === e5.limit && null == e5.startAt && null == e5.endAt && (0 === e5.explicitOrderBy.length || 1 === e5.explicitOrderBy.length && e5.explicitOrderBy[0].field.isKeyField());
  }
  function __PRIVATE_isCollectionGroupQuery(e5) {
    return null !== e5.collectionGroup;
  }
  function __PRIVATE_queryNormalizedOrderBy(e5) {
    const t4 = __PRIVATE_debugCast(e5);
    if (null === t4.ce) {
      t4.ce = [];
      const e6 = /* @__PURE__ */ new Set();
      for (const n6 of t4.explicitOrderBy) t4.ce.push(n6), e6.add(n6.field.canonicalString());
      const n5 = t4.explicitOrderBy.length > 0 ? t4.explicitOrderBy[t4.explicitOrderBy.length - 1].dir : "asc", r5 = function __PRIVATE_getInequalityFilterFields(e7) {
        let t5 = new SortedSet(FieldPath$1.comparator);
        return e7.filters.forEach((e8) => {
          e8.getFlattenedFilters().forEach((e9) => {
            e9.isInequality() && (t5 = t5.add(e9.field));
          });
        }), t5;
      }(t4);
      r5.forEach((r6) => {
        e6.has(r6.canonicalString()) || r6.isKeyField() || t4.ce.push(new OrderBy(r6, n5));
      }), // Add the document key field to the last if it is not explicitly ordered.
      e6.has(FieldPath$1.keyField().canonicalString()) || t4.ce.push(new OrderBy(FieldPath$1.keyField(), n5));
    }
    return t4.ce;
  }
  function __PRIVATE_queryToTarget(e5) {
    const t4 = __PRIVATE_debugCast(e5);
    return t4.le || (t4.le = __PRIVATE__queryToTarget(t4, __PRIVATE_queryNormalizedOrderBy(e5))), t4.le;
  }
  function __PRIVATE__queryToTarget(e5, t4) {
    if ("F" === e5.limitType) return __PRIVATE_newTarget(e5.path, e5.collectionGroup, t4, e5.filters, e5.limit, e5.startAt, e5.endAt);
    {
      t4 = t4.map((e6) => {
        const t5 = "desc" === e6.dir ? "asc" : "desc";
        return new OrderBy(e6.field, t5);
      });
      const n5 = e5.endAt ? new Bound(e5.endAt.position, e5.endAt.inclusive) : null, r5 = e5.startAt ? new Bound(e5.startAt.position, e5.startAt.inclusive) : null;
      return __PRIVATE_newTarget(e5.path, e5.collectionGroup, t4, e5.filters, e5.limit, n5, r5);
    }
  }
  function __PRIVATE_queryWithLimit(e5, t4, n5) {
    return new __PRIVATE_QueryImpl(e5.path, e5.collectionGroup, e5.explicitOrderBy.slice(), e5.filters.slice(), t4, n5, e5.startAt, e5.endAt);
  }
  function __PRIVATE_queryEquals(e5, t4) {
    return __PRIVATE_targetEquals(__PRIVATE_queryToTarget(e5), __PRIVATE_queryToTarget(t4)) && e5.limitType === t4.limitType;
  }
  function __PRIVATE_canonifyQuery(e5) {
    return `${__PRIVATE_canonifyTarget(__PRIVATE_queryToTarget(e5))}|lt:${e5.limitType}`;
  }
  function __PRIVATE_stringifyQuery(e5) {
    return `Query(target=${function __PRIVATE_stringifyTarget(e6) {
      let t4 = e6.path.canonicalString();
      return null !== e6.collectionGroup && (t4 += " collectionGroup=" + e6.collectionGroup), e6.filters.length > 0 && (t4 += `, filters: [${e6.filters.map((e7) => __PRIVATE_stringifyFilter(e7)).join(", ")}]`), __PRIVATE_isNullOrUndefined(e6.limit) || (t4 += ", limit: " + e6.limit), e6.orderBy.length > 0 && (t4 += `, orderBy: [${e6.orderBy.map((e7) => function __PRIVATE_stringifyOrderBy(e8) {
        return `${e8.field.canonicalString()} (${e8.dir})`;
      }(e7)).join(", ")}]`), e6.startAt && (t4 += ", startAt: ", t4 += e6.startAt.inclusive ? "b:" : "a:", t4 += e6.startAt.position.map((e7) => canonicalId(e7)).join(",")), e6.endAt && (t4 += ", endAt: ", t4 += e6.endAt.inclusive ? "a:" : "b:", t4 += e6.endAt.position.map((e7) => canonicalId(e7)).join(",")), `Target(${t4})`;
    }(__PRIVATE_queryToTarget(e5))}; limitType=${e5.limitType})`;
  }
  function __PRIVATE_queryMatches(e5, t4) {
    return t4.isFoundDocument() && function __PRIVATE_queryMatchesPathAndCollectionGroup(e6, t5) {
      const n5 = t5.key.path;
      return null !== e6.collectionGroup ? t5.key.hasCollectionId(e6.collectionGroup) && e6.path.isPrefixOf(n5) : DocumentKey.isDocumentKey(e6.path) ? e6.path.isEqual(n5) : e6.path.isImmediateParentOf(n5);
    }(e5, t4) && function __PRIVATE_queryMatchesOrderBy(e6, t5) {
      for (const n5 of __PRIVATE_queryNormalizedOrderBy(e6))
        if (!n5.field.isKeyField() && null === t5.data.field(n5.field)) return false;
      return true;
    }(e5, t4) && function __PRIVATE_queryMatchesFilters(e6, t5) {
      for (const n5 of e6.filters) if (!n5.matches(t5)) return false;
      return true;
    }(e5, t4) && function __PRIVATE_queryMatchesBounds(e6, t5) {
      if (e6.startAt && !/**
      * Returns true if a document sorts before a bound using the provided sort
      * order.
      */
      function __PRIVATE_boundSortsBeforeDocument(e7, t6, n5) {
        const r5 = __PRIVATE_boundCompareToDocument(e7, t6, n5);
        return e7.inclusive ? r5 <= 0 : r5 < 0;
      }(e6.startAt, __PRIVATE_queryNormalizedOrderBy(e6), t5)) return false;
      if (e6.endAt && !function __PRIVATE_boundSortsAfterDocument(e7, t6, n5) {
        const r5 = __PRIVATE_boundCompareToDocument(e7, t6, n5);
        return e7.inclusive ? r5 >= 0 : r5 > 0;
      }(e6.endAt, __PRIVATE_queryNormalizedOrderBy(e6), t5)) return false;
      return true;
    }(e5, t4);
  }
  function __PRIVATE_newQueryComparator(e5) {
    return (t4, n5) => {
      let r5 = false;
      for (const i4 of __PRIVATE_queryNormalizedOrderBy(e5)) {
        const e6 = __PRIVATE_compareDocs(i4, t4, n5);
        if (0 !== e6) return e6;
        r5 = r5 || i4.field.isKeyField();
      }
      return 0;
    };
  }
  function __PRIVATE_compareDocs(e5, t4, n5) {
    const r5 = e5.field.isKeyField() ? DocumentKey.comparator(t4.key, n5.key) : function __PRIVATE_compareDocumentsByField(e6, t5, n6) {
      const r6 = t5.data.field(e6), i4 = n6.data.field(e6);
      return null !== r6 && null !== i4 ? __PRIVATE_valueCompare(r6, i4) : fail();
    }(e5.field, t4, n5);
    switch (e5.dir) {
      case "asc":
        return r5;
      case "desc":
        return -1 * r5;
      default:
        return fail();
    }
  }
  var ObjectMap = class {
    constructor(e5, t4) {
      this.mapKeyFn = e5, this.equalsFn = t4, /**
       * The inner map for a key/value pair. Due to the possibility of collisions we
       * keep a list of entries that we do a linear search through to find an actual
       * match. Note that collisions should be rare, so we still expect near
       * constant time lookups in practice.
       */
      this.inner = {}, /** The number of entries stored in the map */
      this.innerSize = 0;
    }
    /** Get a value for this key, or undefined if it does not exist. */
    get(e5) {
      const t4 = this.mapKeyFn(e5), n5 = this.inner[t4];
      if (void 0 !== n5) {
        for (const [t5, r5] of n5) if (this.equalsFn(t5, e5)) return r5;
      }
    }
    has(e5) {
      return void 0 !== this.get(e5);
    }
    /** Put this key and value in the map. */
    set(e5, t4) {
      const n5 = this.mapKeyFn(e5), r5 = this.inner[n5];
      if (void 0 === r5) return this.inner[n5] = [[e5, t4]], void this.innerSize++;
      for (let n6 = 0; n6 < r5.length; n6++) if (this.equalsFn(r5[n6][0], e5))
        return void (r5[n6] = [e5, t4]);
      r5.push([e5, t4]), this.innerSize++;
    }
    /**
     * Remove this key from the map. Returns a boolean if anything was deleted.
     */
    delete(e5) {
      const t4 = this.mapKeyFn(e5), n5 = this.inner[t4];
      if (void 0 === n5) return false;
      for (let r5 = 0; r5 < n5.length; r5++) if (this.equalsFn(n5[r5][0], e5)) return 1 === n5.length ? delete this.inner[t4] : n5.splice(r5, 1), this.innerSize--, true;
      return false;
    }
    forEach(e5) {
      forEach(this.inner, (t4, n5) => {
        for (const [t5, r5] of n5) e5(t5, r5);
      });
    }
    isEmpty() {
      return isEmpty(this.inner);
    }
    size() {
      return this.innerSize;
    }
  };
  var se = new SortedMap(DocumentKey.comparator);
  function __PRIVATE_mutableDocumentMap() {
    return se;
  }
  var oe = new SortedMap(DocumentKey.comparator);
  function documentMap(...e5) {
    let t4 = oe;
    for (const n5 of e5) t4 = t4.insert(n5.key, n5);
    return t4;
  }
  function __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e5) {
    let t4 = oe;
    return e5.forEach((e6, n5) => t4 = t4.insert(e6, n5.overlayedDocument)), t4;
  }
  function __PRIVATE_newOverlayMap() {
    return __PRIVATE_newDocumentKeyMap();
  }
  function __PRIVATE_newMutationMap() {
    return __PRIVATE_newDocumentKeyMap();
  }
  function __PRIVATE_newDocumentKeyMap() {
    return new ObjectMap((e5) => e5.toString(), (e5, t4) => e5.isEqual(t4));
  }
  var _e = new SortedMap(DocumentKey.comparator);
  var ae = new SortedSet(DocumentKey.comparator);
  function __PRIVATE_documentKeySet(...e5) {
    let t4 = ae;
    for (const n5 of e5) t4 = t4.add(n5);
    return t4;
  }
  var ue = new SortedSet(__PRIVATE_primitiveComparator);
  function __PRIVATE_targetIdSet() {
    return ue;
  }
  function __PRIVATE_toDouble(e5, t4) {
    if (e5.useProto3Json) {
      if (isNaN(t4)) return {
        doubleValue: "NaN"
      };
      if (t4 === 1 / 0) return {
        doubleValue: "Infinity"
      };
      if (t4 === -1 / 0) return {
        doubleValue: "-Infinity"
      };
    }
    return {
      doubleValue: __PRIVATE_isNegativeZero(t4) ? "-0" : t4
    };
  }
  function __PRIVATE_toInteger(e5) {
    return {
      integerValue: "" + e5
    };
  }
  var TransformOperation = class {
    constructor() {
      this._ = void 0;
    }
  };
  function __PRIVATE_applyTransformOperationToLocalView(e5, t4, n5) {
    return e5 instanceof __PRIVATE_ServerTimestampTransform ? function serverTimestamp$1(e6, t5) {
      const n6 = {
        fields: {
          __type__: {
            stringValue: "server_timestamp"
          },
          __local_write_time__: {
            timestampValue: {
              seconds: e6.seconds,
              nanos: e6.nanoseconds
            }
          }
        }
      };
      return t5 && __PRIVATE_isServerTimestamp(t5) && (t5 = __PRIVATE_getPreviousValue(t5)), t5 && (n6.fields.__previous_value__ = t5), {
        mapValue: n6
      };
    }(n5, t4) : e5 instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e5, t4) : e5 instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e5, t4) : function __PRIVATE_applyNumericIncrementTransformOperationToLocalView(e6, t5) {
      const n6 = __PRIVATE_computeTransformOperationBaseValue(e6, t5), r5 = asNumber(n6) + asNumber(e6.Pe);
      return isInteger(n6) && isInteger(e6.Pe) ? __PRIVATE_toInteger(r5) : __PRIVATE_toDouble(e6.serializer, r5);
    }(e5, t4);
  }
  function __PRIVATE_applyTransformOperationToRemoteDocument(e5, t4, n5) {
    return e5 instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e5, t4) : e5 instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e5, t4) : n5;
  }
  function __PRIVATE_computeTransformOperationBaseValue(e5, t4) {
    return e5 instanceof __PRIVATE_NumericIncrementTransformOperation ? (
      /** Returns true if `value` is either an IntegerValue or a DoubleValue. */
      function __PRIVATE_isNumber(e6) {
        return isInteger(e6) || function __PRIVATE_isDouble(e7) {
          return !!e7 && "doubleValue" in e7;
        }(e6);
      }(t4) ? t4 : {
        integerValue: 0
      }
    ) : null;
  }
  var __PRIVATE_ServerTimestampTransform = class extends TransformOperation {
  };
  var __PRIVATE_ArrayUnionTransformOperation = class extends TransformOperation {
    constructor(e5) {
      super(), this.elements = e5;
    }
  };
  function __PRIVATE_applyArrayUnionTransformOperation(e5, t4) {
    const n5 = __PRIVATE_coercedFieldValuesArray(t4);
    for (const t5 of e5.elements) n5.some((e6) => __PRIVATE_valueEquals(e6, t5)) || n5.push(t5);
    return {
      arrayValue: {
        values: n5
      }
    };
  }
  var __PRIVATE_ArrayRemoveTransformOperation = class extends TransformOperation {
    constructor(e5) {
      super(), this.elements = e5;
    }
  };
  function __PRIVATE_applyArrayRemoveTransformOperation(e5, t4) {
    let n5 = __PRIVATE_coercedFieldValuesArray(t4);
    for (const t5 of e5.elements) n5 = n5.filter((e6) => !__PRIVATE_valueEquals(e6, t5));
    return {
      arrayValue: {
        values: n5
      }
    };
  }
  var __PRIVATE_NumericIncrementTransformOperation = class extends TransformOperation {
    constructor(e5, t4) {
      super(), this.serializer = e5, this.Pe = t4;
    }
  };
  function asNumber(e5) {
    return __PRIVATE_normalizeNumber(e5.integerValue || e5.doubleValue);
  }
  function __PRIVATE_coercedFieldValuesArray(e5) {
    return isArray(e5) && e5.arrayValue.values ? e5.arrayValue.values.slice() : [];
  }
  var FieldTransform = class {
    constructor(e5, t4) {
      this.field = e5, this.transform = t4;
    }
  };
  function __PRIVATE_fieldTransformEquals(e5, t4) {
    return e5.field.isEqual(t4.field) && function __PRIVATE_transformOperationEquals(e6, t5) {
      return e6 instanceof __PRIVATE_ArrayUnionTransformOperation && t5 instanceof __PRIVATE_ArrayUnionTransformOperation || e6 instanceof __PRIVATE_ArrayRemoveTransformOperation && t5 instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_arrayEquals(e6.elements, t5.elements, __PRIVATE_valueEquals) : e6 instanceof __PRIVATE_NumericIncrementTransformOperation && t5 instanceof __PRIVATE_NumericIncrementTransformOperation ? __PRIVATE_valueEquals(e6.Pe, t5.Pe) : e6 instanceof __PRIVATE_ServerTimestampTransform && t5 instanceof __PRIVATE_ServerTimestampTransform;
    }(e5.transform, t4.transform);
  }
  var MutationResult = class {
    constructor(e5, t4) {
      this.version = e5, this.transformResults = t4;
    }
  };
  var Precondition = class _Precondition {
    constructor(e5, t4) {
      this.updateTime = e5, this.exists = t4;
    }
    /** Creates a new empty Precondition. */
    static none() {
      return new _Precondition();
    }
    /** Creates a new Precondition with an exists flag. */
    static exists(e5) {
      return new _Precondition(void 0, e5);
    }
    /** Creates a new Precondition based on a version a document exists at. */
    static updateTime(e5) {
      return new _Precondition(e5);
    }
    /** Returns whether this Precondition is empty. */
    get isNone() {
      return void 0 === this.updateTime && void 0 === this.exists;
    }
    isEqual(e5) {
      return this.exists === e5.exists && (this.updateTime ? !!e5.updateTime && this.updateTime.isEqual(e5.updateTime) : !e5.updateTime);
    }
  };
  function __PRIVATE_preconditionIsValidForDocument(e5, t4) {
    return void 0 !== e5.updateTime ? t4.isFoundDocument() && t4.version.isEqual(e5.updateTime) : void 0 === e5.exists || e5.exists === t4.isFoundDocument();
  }
  var Mutation = class {
  };
  function __PRIVATE_calculateOverlayMutation(e5, t4) {
    if (!e5.hasLocalMutations || t4 && 0 === t4.fields.length) return null;
    if (null === t4) return e5.isNoDocument() ? new __PRIVATE_DeleteMutation(e5.key, Precondition.none()) : new __PRIVATE_SetMutation(e5.key, e5.data, Precondition.none());
    {
      const n5 = e5.data, r5 = ObjectValue.empty();
      let i4 = new SortedSet(FieldPath$1.comparator);
      for (let e6 of t4.fields) if (!i4.has(e6)) {
        let t5 = n5.field(e6);
        null === t5 && e6.length > 1 && (e6 = e6.popLast(), t5 = n5.field(e6)), null === t5 ? r5.delete(e6) : r5.set(e6, t5), i4 = i4.add(e6);
      }
      return new __PRIVATE_PatchMutation(e5.key, r5, new FieldMask(i4.toArray()), Precondition.none());
    }
  }
  function __PRIVATE_mutationApplyToRemoteDocument(e5, t4, n5) {
    e5 instanceof __PRIVATE_SetMutation ? function __PRIVATE_setMutationApplyToRemoteDocument(e6, t5, n6) {
      const r5 = e6.value.clone(), i4 = __PRIVATE_serverTransformResults(e6.fieldTransforms, t5, n6.transformResults);
      r5.setAll(i4), t5.convertToFoundDocument(n6.version, r5).setHasCommittedMutations();
    }(e5, t4, n5) : e5 instanceof __PRIVATE_PatchMutation ? function __PRIVATE_patchMutationApplyToRemoteDocument(e6, t5, n6) {
      if (!__PRIVATE_preconditionIsValidForDocument(e6.precondition, t5))
        return void t5.convertToUnknownDocument(n6.version);
      const r5 = __PRIVATE_serverTransformResults(e6.fieldTransforms, t5, n6.transformResults), i4 = t5.data;
      i4.setAll(__PRIVATE_getPatch(e6)), i4.setAll(r5), t5.convertToFoundDocument(n6.version, i4).setHasCommittedMutations();
    }(e5, t4, n5) : function __PRIVATE_deleteMutationApplyToRemoteDocument(e6, t5, n6) {
      t5.convertToNoDocument(n6.version).setHasCommittedMutations();
    }(0, t4, n5);
  }
  function __PRIVATE_mutationApplyToLocalView(e5, t4, n5, r5) {
    return e5 instanceof __PRIVATE_SetMutation ? function __PRIVATE_setMutationApplyToLocalView(e6, t5, n6, r6) {
      if (!__PRIVATE_preconditionIsValidForDocument(e6.precondition, t5))
        return n6;
      const i4 = e6.value.clone(), s4 = __PRIVATE_localTransformResults(e6.fieldTransforms, r6, t5);
      return i4.setAll(s4), t5.convertToFoundDocument(t5.version, i4).setHasLocalMutations(), null;
    }(e5, t4, n5, r5) : e5 instanceof __PRIVATE_PatchMutation ? function __PRIVATE_patchMutationApplyToLocalView(e6, t5, n6, r6) {
      if (!__PRIVATE_preconditionIsValidForDocument(e6.precondition, t5)) return n6;
      const i4 = __PRIVATE_localTransformResults(e6.fieldTransforms, r6, t5), s4 = t5.data;
      if (s4.setAll(__PRIVATE_getPatch(e6)), s4.setAll(i4), t5.convertToFoundDocument(t5.version, s4).setHasLocalMutations(), null === n6) return null;
      return n6.unionWith(e6.fieldMask.fields).unionWith(e6.fieldTransforms.map((e7) => e7.field));
    }(e5, t4, n5, r5) : function __PRIVATE_deleteMutationApplyToLocalView(e6, t5, n6) {
      if (__PRIVATE_preconditionIsValidForDocument(e6.precondition, t5)) return t5.convertToNoDocument(t5.version).setHasLocalMutations(), null;
      return n6;
    }(e5, t4, n5);
  }
  function __PRIVATE_mutationEquals(e5, t4) {
    return e5.type === t4.type && (!!e5.key.isEqual(t4.key) && (!!e5.precondition.isEqual(t4.precondition) && (!!function __PRIVATE_fieldTransformsAreEqual(e6, t5) {
      return void 0 === e6 && void 0 === t5 || !(!e6 || !t5) && __PRIVATE_arrayEquals(e6, t5, (e7, t6) => __PRIVATE_fieldTransformEquals(e7, t6));
    }(e5.fieldTransforms, t4.fieldTransforms) && (0 === e5.type ? e5.value.isEqual(t4.value) : 1 !== e5.type || e5.data.isEqual(t4.data) && e5.fieldMask.isEqual(t4.fieldMask)))));
  }
  var __PRIVATE_SetMutation = class extends Mutation {
    constructor(e5, t4, n5, r5 = []) {
      super(), this.key = e5, this.value = t4, this.precondition = n5, this.fieldTransforms = r5, this.type = 0;
    }
    getFieldMask() {
      return null;
    }
  };
  var __PRIVATE_PatchMutation = class extends Mutation {
    constructor(e5, t4, n5, r5, i4 = []) {
      super(), this.key = e5, this.data = t4, this.fieldMask = n5, this.precondition = r5, this.fieldTransforms = i4, this.type = 1;
    }
    getFieldMask() {
      return this.fieldMask;
    }
  };
  function __PRIVATE_getPatch(e5) {
    const t4 = /* @__PURE__ */ new Map();
    return e5.fieldMask.fields.forEach((n5) => {
      if (!n5.isEmpty()) {
        const r5 = e5.data.field(n5);
        t4.set(n5, r5);
      }
    }), t4;
  }
  function __PRIVATE_serverTransformResults(e5, t4, n5) {
    const r5 = /* @__PURE__ */ new Map();
    __PRIVATE_hardAssert(e5.length === n5.length);
    for (let i4 = 0; i4 < n5.length; i4++) {
      const s4 = e5[i4], o4 = s4.transform, _2 = t4.data.field(s4.field);
      r5.set(s4.field, __PRIVATE_applyTransformOperationToRemoteDocument(o4, _2, n5[i4]));
    }
    return r5;
  }
  function __PRIVATE_localTransformResults(e5, t4, n5) {
    const r5 = /* @__PURE__ */ new Map();
    for (const i4 of e5) {
      const e6 = i4.transform, s4 = n5.data.field(i4.field);
      r5.set(i4.field, __PRIVATE_applyTransformOperationToLocalView(e6, s4, t4));
    }
    return r5;
  }
  var __PRIVATE_DeleteMutation = class extends Mutation {
    constructor(e5, t4) {
      super(), this.key = e5, this.precondition = t4, this.type = 2, this.fieldTransforms = [];
    }
    getFieldMask() {
      return null;
    }
  };
  var __PRIVATE_VerifyMutation = class extends Mutation {
    constructor(e5, t4) {
      super(), this.key = e5, this.precondition = t4, this.type = 3, this.fieldTransforms = [];
    }
    getFieldMask() {
      return null;
    }
  };
  var MutationBatch = class {
    /**
     * @param batchId - The unique ID of this mutation batch.
     * @param localWriteTime - The original write time of this mutation.
     * @param baseMutations - Mutations that are used to populate the base
     * values when this mutation is applied locally. This can be used to locally
     * overwrite values that are persisted in the remote document cache. Base
     * mutations are never sent to the backend.
     * @param mutations - The user-provided mutations in this mutation batch.
     * User-provided mutations are applied both locally and remotely on the
     * backend.
     */
    constructor(e5, t4, n5, r5) {
      this.batchId = e5, this.localWriteTime = t4, this.baseMutations = n5, this.mutations = r5;
    }
    /**
     * Applies all the mutations in this MutationBatch to the specified document
     * to compute the state of the remote document
     *
     * @param document - The document to apply mutations to.
     * @param batchResult - The result of applying the MutationBatch to the
     * backend.
     */
    applyToRemoteDocument(e5, t4) {
      const n5 = t4.mutationResults;
      for (let t5 = 0; t5 < this.mutations.length; t5++) {
        const r5 = this.mutations[t5];
        if (r5.key.isEqual(e5.key)) {
          __PRIVATE_mutationApplyToRemoteDocument(r5, e5, n5[t5]);
        }
      }
    }
    /**
     * Computes the local view of a document given all the mutations in this
     * batch.
     *
     * @param document - The document to apply mutations to.
     * @param mutatedFields - Fields that have been updated before applying this mutation batch.
     * @returns A `FieldMask` representing all the fields that are mutated.
     */
    applyToLocalView(e5, t4) {
      for (const n5 of this.baseMutations) n5.key.isEqual(e5.key) && (t4 = __PRIVATE_mutationApplyToLocalView(n5, e5, t4, this.localWriteTime));
      for (const n5 of this.mutations) n5.key.isEqual(e5.key) && (t4 = __PRIVATE_mutationApplyToLocalView(n5, e5, t4, this.localWriteTime));
      return t4;
    }
    /**
     * Computes the local view for all provided documents given the mutations in
     * this batch. Returns a `DocumentKey` to `Mutation` map which can be used to
     * replace all the mutation applications.
     */
    applyToLocalDocumentSet(e5, t4) {
      const n5 = __PRIVATE_newMutationMap();
      return this.mutations.forEach((r5) => {
        const i4 = e5.get(r5.key), s4 = i4.overlayedDocument;
        let o4 = this.applyToLocalView(s4, i4.mutatedFields);
        o4 = t4.has(r5.key) ? null : o4;
        const _2 = __PRIVATE_calculateOverlayMutation(s4, o4);
        null !== _2 && n5.set(r5.key, _2), s4.isValidDocument() || s4.convertToNoDocument(SnapshotVersion.min());
      }), n5;
    }
    keys() {
      return this.mutations.reduce((e5, t4) => e5.add(t4.key), __PRIVATE_documentKeySet());
    }
    isEqual(e5) {
      return this.batchId === e5.batchId && __PRIVATE_arrayEquals(this.mutations, e5.mutations, (e6, t4) => __PRIVATE_mutationEquals(e6, t4)) && __PRIVATE_arrayEquals(this.baseMutations, e5.baseMutations, (e6, t4) => __PRIVATE_mutationEquals(e6, t4));
    }
  };
  var MutationBatchResult = class _MutationBatchResult {
    constructor(e5, t4, n5, r5) {
      this.batch = e5, this.commitVersion = t4, this.mutationResults = n5, this.docVersions = r5;
    }
    /**
     * Creates a new MutationBatchResult for the given batch and results. There
     * must be one result for each mutation in the batch. This static factory
     * caches a document=&gt;version mapping (docVersions).
     */
    static from(e5, t4, n5) {
      __PRIVATE_hardAssert(e5.mutations.length === n5.length);
      let r5 = /* @__PURE__ */ function __PRIVATE_documentVersionMap() {
        return _e;
      }();
      const i4 = e5.mutations;
      for (let e6 = 0; e6 < i4.length; e6++) r5 = r5.insert(i4[e6].key, n5[e6].version);
      return new _MutationBatchResult(e5, t4, n5, r5);
    }
  };
  var Overlay = class {
    constructor(e5, t4) {
      this.largestBatchId = e5, this.mutation = t4;
    }
    getKey() {
      return this.mutation.key;
    }
    isEqual(e5) {
      return null !== e5 && this.mutation === e5.mutation;
    }
    toString() {
      return `Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`;
    }
  };
  var ce;
  var le;
  function __PRIVATE_isPermanentError(e5) {
    switch (e5) {
      default:
        return fail();
      case C2.CANCELLED:
      case C2.UNKNOWN:
      case C2.DEADLINE_EXCEEDED:
      case C2.RESOURCE_EXHAUSTED:
      case C2.INTERNAL:
      case C2.UNAVAILABLE:
      case C2.UNAUTHENTICATED:
        return false;
      case C2.INVALID_ARGUMENT:
      case C2.NOT_FOUND:
      case C2.ALREADY_EXISTS:
      case C2.PERMISSION_DENIED:
      case C2.FAILED_PRECONDITION:
      case C2.ABORTED:
      case C2.OUT_OF_RANGE:
      case C2.UNIMPLEMENTED:
      case C2.DATA_LOSS:
        return true;
    }
  }
  function __PRIVATE_mapCodeFromRpcCode(e5) {
    if (void 0 === e5)
      return __PRIVATE_logError("GRPC error has no .code"), C2.UNKNOWN;
    switch (e5) {
      case ce.OK:
        return C2.OK;
      case ce.CANCELLED:
        return C2.CANCELLED;
      case ce.UNKNOWN:
        return C2.UNKNOWN;
      case ce.DEADLINE_EXCEEDED:
        return C2.DEADLINE_EXCEEDED;
      case ce.RESOURCE_EXHAUSTED:
        return C2.RESOURCE_EXHAUSTED;
      case ce.INTERNAL:
        return C2.INTERNAL;
      case ce.UNAVAILABLE:
        return C2.UNAVAILABLE;
      case ce.UNAUTHENTICATED:
        return C2.UNAUTHENTICATED;
      case ce.INVALID_ARGUMENT:
        return C2.INVALID_ARGUMENT;
      case ce.NOT_FOUND:
        return C2.NOT_FOUND;
      case ce.ALREADY_EXISTS:
        return C2.ALREADY_EXISTS;
      case ce.PERMISSION_DENIED:
        return C2.PERMISSION_DENIED;
      case ce.FAILED_PRECONDITION:
        return C2.FAILED_PRECONDITION;
      case ce.ABORTED:
        return C2.ABORTED;
      case ce.OUT_OF_RANGE:
        return C2.OUT_OF_RANGE;
      case ce.UNIMPLEMENTED:
        return C2.UNIMPLEMENTED;
      case ce.DATA_LOSS:
        return C2.DATA_LOSS;
      default:
        return fail();
    }
  }
  (le = ce || (ce = {}))[le.OK = 0] = "OK", le[le.CANCELLED = 1] = "CANCELLED", le[le.UNKNOWN = 2] = "UNKNOWN", le[le.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", le[le.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", le[le.NOT_FOUND = 5] = "NOT_FOUND", le[le.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", le[le.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", le[le.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", le[le.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", le[le.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", le[le.ABORTED = 10] = "ABORTED", le[le.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", le[le.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", le[le.INTERNAL = 13] = "INTERNAL", le[le.UNAVAILABLE = 14] = "UNAVAILABLE", le[le.DATA_LOSS = 15] = "DATA_LOSS";
  var Pe = new Integer([4294967295, 4294967295], 0);
  var Ie = /* @__PURE__ */ (() => {
    const e5 = {
      asc: "ASCENDING",
      desc: "DESCENDING"
    };
    return e5;
  })();
  var Te = /* @__PURE__ */ (() => {
    const e5 = {
      "<": "LESS_THAN",
      "<=": "LESS_THAN_OR_EQUAL",
      ">": "GREATER_THAN",
      ">=": "GREATER_THAN_OR_EQUAL",
      "==": "EQUAL",
      "!=": "NOT_EQUAL",
      "array-contains": "ARRAY_CONTAINS",
      in: "IN",
      "not-in": "NOT_IN",
      "array-contains-any": "ARRAY_CONTAINS_ANY"
    };
    return e5;
  })();
  var Ee = /* @__PURE__ */ (() => {
    const e5 = {
      and: "AND",
      or: "OR"
    };
    return e5;
  })();
  var JsonProtoSerializer = class {
    constructor(e5, t4) {
      this.databaseId = e5, this.useProto3Json = t4;
    }
  };
  function __PRIVATE_toInt32Proto(e5, t4) {
    return e5.useProto3Json || __PRIVATE_isNullOrUndefined(t4) ? t4 : {
      value: t4
    };
  }
  function toTimestamp(e5, t4) {
    if (e5.useProto3Json) {
      return `${new Date(1e3 * t4.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + t4.nanoseconds).slice(-9)}Z`;
    }
    return {
      seconds: "" + t4.seconds,
      nanos: t4.nanoseconds
    };
  }
  function __PRIVATE_toVersion(e5, t4) {
    return toTimestamp(e5, t4.toTimestamp());
  }
  function __PRIVATE_fromVersion(e5) {
    return __PRIVATE_hardAssert(!!e5), SnapshotVersion.fromTimestamp(function fromTimestamp(e6) {
      const t4 = __PRIVATE_normalizeTimestamp(e6);
      return new Timestamp(t4.seconds, t4.nanos);
    }(e5));
  }
  function __PRIVATE_toResourceName(e5, t4) {
    return __PRIVATE_toResourcePath(e5, t4).canonicalString();
  }
  function __PRIVATE_toResourcePath(e5, t4) {
    const n5 = function __PRIVATE_fullyQualifiedPrefixPath(e6) {
      return new ResourcePath(["projects", e6.projectId, "databases", e6.database]);
    }(e5).child("documents");
    return void 0 === t4 ? n5 : n5.child(t4);
  }
  function __PRIVATE_fromResourceName(e5) {
    const t4 = ResourcePath.fromString(e5);
    return __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(t4)), t4;
  }
  function __PRIVATE_toName(e5, t4) {
    return __PRIVATE_toResourceName(e5.databaseId, t4.path);
  }
  function fromName(e5, t4) {
    const n5 = __PRIVATE_fromResourceName(t4);
    if (n5.get(1) !== e5.databaseId.projectId) throw new FirestoreError(C2.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n5.get(1) + " vs " + e5.databaseId.projectId);
    if (n5.get(3) !== e5.databaseId.database) throw new FirestoreError(C2.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n5.get(3) + " vs " + e5.databaseId.database);
    return new DocumentKey(__PRIVATE_extractLocalPathFromResourceName(n5));
  }
  function __PRIVATE_toQueryPath(e5, t4) {
    return __PRIVATE_toResourceName(e5.databaseId, t4);
  }
  function __PRIVATE_fromQueryPath(e5) {
    const t4 = __PRIVATE_fromResourceName(e5);
    return 4 === t4.length ? ResourcePath.emptyPath() : __PRIVATE_extractLocalPathFromResourceName(t4);
  }
  function __PRIVATE_getEncodedDatabaseId(e5) {
    return new ResourcePath(["projects", e5.databaseId.projectId, "databases", e5.databaseId.database]).canonicalString();
  }
  function __PRIVATE_extractLocalPathFromResourceName(e5) {
    return __PRIVATE_hardAssert(e5.length > 4 && "documents" === e5.get(4)), e5.popFirst(5);
  }
  function __PRIVATE_toMutationDocument(e5, t4, n5) {
    return {
      name: __PRIVATE_toName(e5, t4),
      fields: n5.value.mapValue.fields
    };
  }
  function __PRIVATE_fromDocument(e5, t4, n5) {
    const r5 = fromName(e5, t4.name), i4 = __PRIVATE_fromVersion(t4.updateTime), s4 = t4.createTime ? __PRIVATE_fromVersion(t4.createTime) : SnapshotVersion.min(), o4 = new ObjectValue({
      mapValue: {
        fields: t4.fields
      }
    }), _2 = MutableDocument.newFoundDocument(r5, i4, s4, o4);
    return n5 && _2.setHasCommittedMutations(), n5 ? _2.setHasCommittedMutations() : _2;
  }
  function toMutation(e5, t4) {
    let n5;
    if (t4 instanceof __PRIVATE_SetMutation) n5 = {
      update: __PRIVATE_toMutationDocument(e5, t4.key, t4.value)
    };
    else if (t4 instanceof __PRIVATE_DeleteMutation) n5 = {
      delete: __PRIVATE_toName(e5, t4.key)
    };
    else if (t4 instanceof __PRIVATE_PatchMutation) n5 = {
      update: __PRIVATE_toMutationDocument(e5, t4.key, t4.data),
      updateMask: __PRIVATE_toDocumentMask(t4.fieldMask)
    };
    else {
      if (!(t4 instanceof __PRIVATE_VerifyMutation)) return fail();
      n5 = {
        verify: __PRIVATE_toName(e5, t4.key)
      };
    }
    return t4.fieldTransforms.length > 0 && (n5.updateTransforms = t4.fieldTransforms.map((e6) => function __PRIVATE_toFieldTransform(e7, t5) {
      const n6 = t5.transform;
      if (n6 instanceof __PRIVATE_ServerTimestampTransform) return {
        fieldPath: t5.field.canonicalString(),
        setToServerValue: "REQUEST_TIME"
      };
      if (n6 instanceof __PRIVATE_ArrayUnionTransformOperation) return {
        fieldPath: t5.field.canonicalString(),
        appendMissingElements: {
          values: n6.elements
        }
      };
      if (n6 instanceof __PRIVATE_ArrayRemoveTransformOperation) return {
        fieldPath: t5.field.canonicalString(),
        removeAllFromArray: {
          values: n6.elements
        }
      };
      if (n6 instanceof __PRIVATE_NumericIncrementTransformOperation) return {
        fieldPath: t5.field.canonicalString(),
        increment: n6.Pe
      };
      throw fail();
    }(0, e6))), t4.precondition.isNone || (n5.currentDocument = function __PRIVATE_toPrecondition(e6, t5) {
      return void 0 !== t5.updateTime ? {
        updateTime: __PRIVATE_toVersion(e6, t5.updateTime)
      } : void 0 !== t5.exists ? {
        exists: t5.exists
      } : fail();
    }(e5, t4.precondition)), n5;
  }
  function __PRIVATE_fromMutation(e5, t4) {
    const n5 = t4.currentDocument ? function __PRIVATE_fromPrecondition(e6) {
      return void 0 !== e6.updateTime ? Precondition.updateTime(__PRIVATE_fromVersion(e6.updateTime)) : void 0 !== e6.exists ? Precondition.exists(e6.exists) : Precondition.none();
    }(t4.currentDocument) : Precondition.none(), r5 = t4.updateTransforms ? t4.updateTransforms.map((t5) => function __PRIVATE_fromFieldTransform(e6, t6) {
      let n6 = null;
      if ("setToServerValue" in t6) __PRIVATE_hardAssert("REQUEST_TIME" === t6.setToServerValue), n6 = new __PRIVATE_ServerTimestampTransform();
      else if ("appendMissingElements" in t6) {
        const e7 = t6.appendMissingElements.values || [];
        n6 = new __PRIVATE_ArrayUnionTransformOperation(e7);
      } else if ("removeAllFromArray" in t6) {
        const e7 = t6.removeAllFromArray.values || [];
        n6 = new __PRIVATE_ArrayRemoveTransformOperation(e7);
      } else "increment" in t6 ? n6 = new __PRIVATE_NumericIncrementTransformOperation(e6, t6.increment) : fail();
      const r6 = FieldPath$1.fromServerFormat(t6.fieldPath);
      return new FieldTransform(r6, n6);
    }(e5, t5)) : [];
    if (t4.update) {
      t4.update.name;
      const i4 = fromName(e5, t4.update.name), s4 = new ObjectValue({
        mapValue: {
          fields: t4.update.fields
        }
      });
      if (t4.updateMask) {
        const e6 = function __PRIVATE_fromDocumentMask(e7) {
          const t5 = e7.fieldPaths || [];
          return new FieldMask(t5.map((e8) => FieldPath$1.fromServerFormat(e8)));
        }(t4.updateMask);
        return new __PRIVATE_PatchMutation(i4, s4, e6, n5, r5);
      }
      return new __PRIVATE_SetMutation(i4, s4, n5, r5);
    }
    if (t4.delete) {
      const r6 = fromName(e5, t4.delete);
      return new __PRIVATE_DeleteMutation(r6, n5);
    }
    if (t4.verify) {
      const r6 = fromName(e5, t4.verify);
      return new __PRIVATE_VerifyMutation(r6, n5);
    }
    return fail();
  }
  function __PRIVATE_fromWriteResults(e5, t4) {
    return e5 && e5.length > 0 ? (__PRIVATE_hardAssert(void 0 !== t4), e5.map((e6) => function __PRIVATE_fromWriteResult(e7, t5) {
      let n5 = e7.updateTime ? __PRIVATE_fromVersion(e7.updateTime) : __PRIVATE_fromVersion(t5);
      return n5.isEqual(SnapshotVersion.min()) && // The Firestore Emulator currently returns an update time of 0 for
      // deletes of non-existing documents (rather than null). This breaks the
      // test "get deleted doc while offline with source=cache" as NoDocuments
      // with version 0 are filtered by IndexedDb's RemoteDocumentCache.
      // TODO(#2149): Remove this when Emulator is fixed
      (n5 = __PRIVATE_fromVersion(t5)), new MutationResult(n5, e7.transformResults || []);
    }(e6, t4))) : [];
  }
  function __PRIVATE_toDocumentsTarget(e5, t4) {
    return {
      documents: [__PRIVATE_toQueryPath(e5, t4.path)]
    };
  }
  function __PRIVATE_toQueryTarget(e5, t4) {
    const n5 = {
      structuredQuery: {}
    }, r5 = t4.path;
    let i4;
    null !== t4.collectionGroup ? (i4 = r5, n5.structuredQuery.from = [{
      collectionId: t4.collectionGroup,
      allDescendants: true
    }]) : (i4 = r5.popLast(), n5.structuredQuery.from = [{
      collectionId: r5.lastSegment()
    }]), n5.parent = __PRIVATE_toQueryPath(e5, i4);
    const s4 = function __PRIVATE_toFilters(e6) {
      if (0 === e6.length) return;
      return __PRIVATE_toFilter(CompositeFilter.create(
        e6,
        "and"
        /* CompositeOperator.AND */
      ));
    }(t4.filters);
    s4 && (n5.structuredQuery.where = s4);
    const o4 = function __PRIVATE_toOrder(e6) {
      if (0 === e6.length) return;
      return e6.map((e7) => (
        // visible for testing
        function __PRIVATE_toPropertyOrder(e8) {
          return {
            field: __PRIVATE_toFieldPathReference(e8.field),
            direction: __PRIVATE_toDirection(e8.dir)
          };
        }(e7)
      ));
    }(t4.orderBy);
    o4 && (n5.structuredQuery.orderBy = o4);
    const _2 = __PRIVATE_toInt32Proto(e5, t4.limit);
    return null !== _2 && (n5.structuredQuery.limit = _2), t4.startAt && (n5.structuredQuery.startAt = function __PRIVATE_toStartAtCursor(e6) {
      return {
        before: e6.inclusive,
        values: e6.position
      };
    }(t4.startAt)), t4.endAt && (n5.structuredQuery.endAt = function __PRIVATE_toEndAtCursor(e6) {
      return {
        before: !e6.inclusive,
        values: e6.position
      };
    }(t4.endAt)), {
      _t: n5,
      parent: i4
    };
  }
  function __PRIVATE_convertQueryTargetToQuery(e5) {
    let t4 = __PRIVATE_fromQueryPath(e5.parent);
    const n5 = e5.structuredQuery, r5 = n5.from ? n5.from.length : 0;
    let i4 = null;
    if (r5 > 0) {
      __PRIVATE_hardAssert(1 === r5);
      const e6 = n5.from[0];
      e6.allDescendants ? i4 = e6.collectionId : t4 = t4.child(e6.collectionId);
    }
    let s4 = [];
    n5.where && (s4 = function __PRIVATE_fromFilters(e6) {
      const t5 = __PRIVATE_fromFilter(e6);
      if (t5 instanceof CompositeFilter && __PRIVATE_compositeFilterIsFlatConjunction(t5)) return t5.getFilters();
      return [t5];
    }(n5.where));
    let o4 = [];
    n5.orderBy && (o4 = function __PRIVATE_fromOrder(e6) {
      return e6.map((e7) => function __PRIVATE_fromPropertyOrder(e8) {
        return new OrderBy(
          __PRIVATE_fromFieldPathReference(e8.field),
          // visible for testing
          function __PRIVATE_fromDirection(e9) {
            switch (e9) {
              case "ASCENDING":
                return "asc";
              case "DESCENDING":
                return "desc";
              default:
                return;
            }
          }(e8.direction)
        );
      }(e7));
    }(n5.orderBy));
    let _2 = null;
    n5.limit && (_2 = function __PRIVATE_fromInt32Proto(e6) {
      let t5;
      return t5 = "object" == typeof e6 ? e6.value : e6, __PRIVATE_isNullOrUndefined(t5) ? null : t5;
    }(n5.limit));
    let a3 = null;
    n5.startAt && (a3 = function __PRIVATE_fromStartAtCursor(e6) {
      const t5 = !!e6.before, n6 = e6.values || [];
      return new Bound(n6, t5);
    }(n5.startAt));
    let u3 = null;
    return n5.endAt && (u3 = function __PRIVATE_fromEndAtCursor(e6) {
      const t5 = !e6.before, n6 = e6.values || [];
      return new Bound(n6, t5);
    }(n5.endAt)), __PRIVATE_newQuery(t4, i4, o4, s4, _2, "F", a3, u3);
  }
  function __PRIVATE_fromFilter(e5) {
    return void 0 !== e5.unaryFilter ? function __PRIVATE_fromUnaryFilter(e6) {
      switch (e6.unaryFilter.op) {
        case "IS_NAN":
          const t4 = __PRIVATE_fromFieldPathReference(e6.unaryFilter.field);
          return FieldFilter.create(t4, "==", {
            doubleValue: NaN
          });
        case "IS_NULL":
          const n5 = __PRIVATE_fromFieldPathReference(e6.unaryFilter.field);
          return FieldFilter.create(n5, "==", {
            nullValue: "NULL_VALUE"
          });
        case "IS_NOT_NAN":
          const r5 = __PRIVATE_fromFieldPathReference(e6.unaryFilter.field);
          return FieldFilter.create(r5, "!=", {
            doubleValue: NaN
          });
        case "IS_NOT_NULL":
          const i4 = __PRIVATE_fromFieldPathReference(e6.unaryFilter.field);
          return FieldFilter.create(i4, "!=", {
            nullValue: "NULL_VALUE"
          });
        default:
          return fail();
      }
    }(e5) : void 0 !== e5.fieldFilter ? function __PRIVATE_fromFieldFilter(e6) {
      return FieldFilter.create(__PRIVATE_fromFieldPathReference(e6.fieldFilter.field), function __PRIVATE_fromOperatorName(e7) {
        switch (e7) {
          case "EQUAL":
            return "==";
          case "NOT_EQUAL":
            return "!=";
          case "GREATER_THAN":
            return ">";
          case "GREATER_THAN_OR_EQUAL":
            return ">=";
          case "LESS_THAN":
            return "<";
          case "LESS_THAN_OR_EQUAL":
            return "<=";
          case "ARRAY_CONTAINS":
            return "array-contains";
          case "IN":
            return "in";
          case "NOT_IN":
            return "not-in";
          case "ARRAY_CONTAINS_ANY":
            return "array-contains-any";
          default:
            return fail();
        }
      }(e6.fieldFilter.op), e6.fieldFilter.value);
    }(e5) : void 0 !== e5.compositeFilter ? function __PRIVATE_fromCompositeFilter(e6) {
      return CompositeFilter.create(e6.compositeFilter.filters.map((e7) => __PRIVATE_fromFilter(e7)), function __PRIVATE_fromCompositeOperatorName(e7) {
        switch (e7) {
          case "AND":
            return "and";
          case "OR":
            return "or";
          default:
            return fail();
        }
      }(e6.compositeFilter.op));
    }(e5) : fail();
  }
  function __PRIVATE_toDirection(e5) {
    return Ie[e5];
  }
  function __PRIVATE_toOperatorName(e5) {
    return Te[e5];
  }
  function __PRIVATE_toCompositeOperatorName(e5) {
    return Ee[e5];
  }
  function __PRIVATE_toFieldPathReference(e5) {
    return {
      fieldPath: e5.canonicalString()
    };
  }
  function __PRIVATE_fromFieldPathReference(e5) {
    return FieldPath$1.fromServerFormat(e5.fieldPath);
  }
  function __PRIVATE_toFilter(e5) {
    return e5 instanceof FieldFilter ? function __PRIVATE_toUnaryOrFieldFilter(e6) {
      if ("==" === e6.op) {
        if (__PRIVATE_isNanValue(e6.value)) return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e6.field),
            op: "IS_NAN"
          }
        };
        if (__PRIVATE_isNullValue(e6.value)) return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e6.field),
            op: "IS_NULL"
          }
        };
      } else if ("!=" === e6.op) {
        if (__PRIVATE_isNanValue(e6.value)) return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e6.field),
            op: "IS_NOT_NAN"
          }
        };
        if (__PRIVATE_isNullValue(e6.value)) return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e6.field),
            op: "IS_NOT_NULL"
          }
        };
      }
      return {
        fieldFilter: {
          field: __PRIVATE_toFieldPathReference(e6.field),
          op: __PRIVATE_toOperatorName(e6.op),
          value: e6.value
        }
      };
    }(e5) : e5 instanceof CompositeFilter ? function __PRIVATE_toCompositeFilter(e6) {
      const t4 = e6.getFilters().map((e7) => __PRIVATE_toFilter(e7));
      if (1 === t4.length) return t4[0];
      return {
        compositeFilter: {
          op: __PRIVATE_toCompositeOperatorName(e6.op),
          filters: t4
        }
      };
    }(e5) : fail();
  }
  function __PRIVATE_toDocumentMask(e5) {
    const t4 = [];
    return e5.fields.forEach((e6) => t4.push(e6.canonicalString())), {
      fieldPaths: t4
    };
  }
  function __PRIVATE_isValidResourceName(e5) {
    return e5.length >= 4 && "projects" === e5.get(0) && "databases" === e5.get(2);
  }
  var TargetData = class _TargetData {
    constructor(e5, t4, n5, r5, i4 = SnapshotVersion.min(), s4 = SnapshotVersion.min(), o4 = ByteString.EMPTY_BYTE_STRING, _2 = null) {
      this.target = e5, this.targetId = t4, this.purpose = n5, this.sequenceNumber = r5, this.snapshotVersion = i4, this.lastLimboFreeSnapshotVersion = s4, this.resumeToken = o4, this.expectedCount = _2;
    }
    /** Creates a new target data instance with an updated sequence number. */
    withSequenceNumber(e5) {
      return new _TargetData(this.target, this.targetId, this.purpose, e5, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, this.expectedCount);
    }
    /**
     * Creates a new target data instance with an updated resume token and
     * snapshot version.
     */
    withResumeToken(e5, t4) {
      return new _TargetData(
        this.target,
        this.targetId,
        this.purpose,
        this.sequenceNumber,
        t4,
        this.lastLimboFreeSnapshotVersion,
        e5,
        /* expectedCount= */
        null
      );
    }
    /**
     * Creates a new target data instance with an updated expected count.
     */
    withExpectedCount(e5) {
      return new _TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, e5);
    }
    /**
     * Creates a new target data instance with an updated last limbo free
     * snapshot version number.
     */
    withLastLimboFreeSnapshotVersion(e5) {
      return new _TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, e5, this.resumeToken, this.expectedCount);
    }
  };
  var __PRIVATE_LocalSerializer = class {
    constructor(e5) {
      this.ct = e5;
    }
  };
  function __PRIVATE_fromDbRemoteDocument(e5, t4) {
    let n5;
    if (t4.document) n5 = __PRIVATE_fromDocument(e5.ct, t4.document, !!t4.hasCommittedMutations);
    else if (t4.noDocument) {
      const e6 = DocumentKey.fromSegments(t4.noDocument.path), r5 = __PRIVATE_fromDbTimestamp(t4.noDocument.readTime);
      n5 = MutableDocument.newNoDocument(e6, r5), t4.hasCommittedMutations && n5.setHasCommittedMutations();
    } else {
      if (!t4.unknownDocument) return fail();
      {
        const e6 = DocumentKey.fromSegments(t4.unknownDocument.path), r5 = __PRIVATE_fromDbTimestamp(t4.unknownDocument.version);
        n5 = MutableDocument.newUnknownDocument(e6, r5);
      }
    }
    return t4.readTime && n5.setReadTime(function __PRIVATE_fromDbTimestampKey(e6) {
      const t5 = new Timestamp(e6[0], e6[1]);
      return SnapshotVersion.fromTimestamp(t5);
    }(t4.readTime)), n5;
  }
  function __PRIVATE_toDbRemoteDocument(e5, t4) {
    const n5 = t4.key, r5 = {
      prefixPath: n5.getCollectionPath().popLast().toArray(),
      collectionGroup: n5.collectionGroup,
      documentId: n5.path.lastSegment(),
      readTime: __PRIVATE_toDbTimestampKey(t4.readTime),
      hasCommittedMutations: t4.hasCommittedMutations
    };
    if (t4.isFoundDocument()) r5.document = function __PRIVATE_toDocument(e6, t5) {
      return {
        name: __PRIVATE_toName(e6, t5.key),
        fields: t5.data.value.mapValue.fields,
        updateTime: toTimestamp(e6, t5.version.toTimestamp()),
        createTime: toTimestamp(e6, t5.createTime.toTimestamp())
      };
    }(e5.ct, t4);
    else if (t4.isNoDocument()) r5.noDocument = {
      path: n5.path.toArray(),
      readTime: __PRIVATE_toDbTimestamp(t4.version)
    };
    else {
      if (!t4.isUnknownDocument()) return fail();
      r5.unknownDocument = {
        path: n5.path.toArray(),
        version: __PRIVATE_toDbTimestamp(t4.version)
      };
    }
    return r5;
  }
  function __PRIVATE_toDbTimestampKey(e5) {
    const t4 = e5.toTimestamp();
    return [t4.seconds, t4.nanoseconds];
  }
  function __PRIVATE_toDbTimestamp(e5) {
    const t4 = e5.toTimestamp();
    return {
      seconds: t4.seconds,
      nanoseconds: t4.nanoseconds
    };
  }
  function __PRIVATE_fromDbTimestamp(e5) {
    const t4 = new Timestamp(e5.seconds, e5.nanoseconds);
    return SnapshotVersion.fromTimestamp(t4);
  }
  function __PRIVATE_fromDbMutationBatch(e5, t4) {
    const n5 = (t4.baseMutations || []).map((t5) => __PRIVATE_fromMutation(e5.ct, t5));
    for (let e6 = 0; e6 < t4.mutations.length - 1; ++e6) {
      const n6 = t4.mutations[e6];
      if (e6 + 1 < t4.mutations.length && void 0 !== t4.mutations[e6 + 1].transform) {
        const r6 = t4.mutations[e6 + 1];
        n6.updateTransforms = r6.transform.fieldTransforms, t4.mutations.splice(e6 + 1, 1), ++e6;
      }
    }
    const r5 = t4.mutations.map((t5) => __PRIVATE_fromMutation(e5.ct, t5)), i4 = Timestamp.fromMillis(t4.localWriteTimeMs);
    return new MutationBatch(t4.batchId, i4, n5, r5);
  }
  function __PRIVATE_fromDbTarget(e5) {
    const t4 = __PRIVATE_fromDbTimestamp(e5.readTime), n5 = void 0 !== e5.lastLimboFreeSnapshotVersion ? __PRIVATE_fromDbTimestamp(e5.lastLimboFreeSnapshotVersion) : SnapshotVersion.min();
    let r5;
    return r5 = /**
    * A helper function for figuring out what kind of query has been stored.
    */
    function __PRIVATE_isDocumentQuery(e6) {
      return void 0 !== e6.documents;
    }(e5.query) ? function __PRIVATE_fromDocumentsTarget(e6) {
      return __PRIVATE_hardAssert(1 === e6.documents.length), __PRIVATE_queryToTarget(__PRIVATE_newQueryForPath(__PRIVATE_fromQueryPath(e6.documents[0])));
    }(e5.query) : function __PRIVATE_fromQueryTarget(e6) {
      return __PRIVATE_queryToTarget(__PRIVATE_convertQueryTargetToQuery(e6));
    }(e5.query), new TargetData(r5, e5.targetId, "TargetPurposeListen", e5.lastListenSequenceNumber, t4, n5, ByteString.fromBase64String(e5.resumeToken));
  }
  function __PRIVATE_toDbTarget(e5, t4) {
    const n5 = __PRIVATE_toDbTimestamp(t4.snapshotVersion), r5 = __PRIVATE_toDbTimestamp(t4.lastLimboFreeSnapshotVersion);
    let i4;
    i4 = __PRIVATE_targetIsDocumentTarget(t4.target) ? __PRIVATE_toDocumentsTarget(e5.ct, t4.target) : __PRIVATE_toQueryTarget(e5.ct, t4.target)._t;
    const s4 = t4.resumeToken.toBase64();
    return {
      targetId: t4.targetId,
      canonicalId: __PRIVATE_canonifyTarget(t4.target),
      readTime: n5,
      resumeToken: s4,
      lastListenSequenceNumber: t4.sequenceNumber,
      lastLimboFreeSnapshotVersion: r5,
      query: i4
    };
  }
  function __PRIVATE_fromBundledQuery(e5) {
    const t4 = __PRIVATE_convertQueryTargetToQuery({
      parent: e5.parent,
      structuredQuery: e5.structuredQuery
    });
    return "LAST" === e5.limitType ? __PRIVATE_queryWithLimit(
      t4,
      t4.limit,
      "L"
      /* LimitType.Last */
    ) : t4;
  }
  function __PRIVATE_fromDbDocumentOverlay(e5, t4) {
    return new Overlay(t4.largestBatchId, __PRIVATE_fromMutation(e5.ct, t4.overlayMutation));
  }
  function __PRIVATE_toDbDocumentOverlayKey(e5, t4) {
    const n5 = t4.path.lastSegment();
    return [e5, __PRIVATE_encodeResourcePath(t4.path.popLast()), n5];
  }
  function __PRIVATE_toDbIndexState(e5, t4, n5, r5) {
    return {
      indexId: e5,
      uid: t4,
      sequenceNumber: n5,
      readTime: __PRIVATE_toDbTimestamp(r5.readTime),
      documentKey: __PRIVATE_encodeResourcePath(r5.documentKey.path),
      largestBatchId: r5.largestBatchId
    };
  }
  var __PRIVATE_IndexedDbBundleCache = class {
    getBundleMetadata(e5, t4) {
      return __PRIVATE_bundlesStore(e5).get(t4).next((e6) => {
        if (e6) return function __PRIVATE_fromDbBundle(e7) {
          return {
            id: e7.bundleId,
            createTime: __PRIVATE_fromDbTimestamp(e7.createTime),
            version: e7.version
          };
        }(e6);
      });
    }
    saveBundleMetadata(e5, t4) {
      return __PRIVATE_bundlesStore(e5).put(function __PRIVATE_toDbBundle(e6) {
        return {
          bundleId: e6.id,
          createTime: __PRIVATE_toDbTimestamp(__PRIVATE_fromVersion(e6.createTime)),
          version: e6.version
        };
      }(t4));
    }
    getNamedQuery(e5, t4) {
      return __PRIVATE_namedQueriesStore(e5).get(t4).next((e6) => {
        if (e6) return function __PRIVATE_fromDbNamedQuery(e7) {
          return {
            name: e7.name,
            query: __PRIVATE_fromBundledQuery(e7.bundledQuery),
            readTime: __PRIVATE_fromDbTimestamp(e7.readTime)
          };
        }(e6);
      });
    }
    saveNamedQuery(e5, t4) {
      return __PRIVATE_namedQueriesStore(e5).put(function __PRIVATE_toDbNamedQuery(e6) {
        return {
          name: e6.name,
          readTime: __PRIVATE_toDbTimestamp(__PRIVATE_fromVersion(e6.readTime)),
          bundledQuery: e6.bundledQuery
        };
      }(t4));
    }
  };
  function __PRIVATE_bundlesStore(e5) {
    return __PRIVATE_getStore(e5, "bundles");
  }
  function __PRIVATE_namedQueriesStore(e5) {
    return __PRIVATE_getStore(e5, "namedQueries");
  }
  var __PRIVATE_IndexedDbDocumentOverlayCache = class ___PRIVATE_IndexedDbDocumentOverlayCache {
    /**
     * @param serializer - The document serializer.
     * @param userId - The userId for which we are accessing overlays.
     */
    constructor(e5, t4) {
      this.serializer = e5, this.userId = t4;
    }
    static lt(e5, t4) {
      const n5 = t4.uid || "";
      return new ___PRIVATE_IndexedDbDocumentOverlayCache(e5, n5);
    }
    getOverlay(e5, t4) {
      return __PRIVATE_documentOverlayStore(e5).get(__PRIVATE_toDbDocumentOverlayKey(this.userId, t4)).next((e6) => e6 ? __PRIVATE_fromDbDocumentOverlay(this.serializer, e6) : null);
    }
    getOverlays(e5, t4) {
      const n5 = __PRIVATE_newOverlayMap();
      return PersistencePromise.forEach(t4, (t5) => this.getOverlay(e5, t5).next((e6) => {
        null !== e6 && n5.set(t5, e6);
      })).next(() => n5);
    }
    saveOverlays(e5, t4, n5) {
      const r5 = [];
      return n5.forEach((n6, i4) => {
        const s4 = new Overlay(t4, i4);
        r5.push(this.ht(e5, s4));
      }), PersistencePromise.waitFor(r5);
    }
    removeOverlaysForBatchId(e5, t4, n5) {
      const r5 = /* @__PURE__ */ new Set();
      t4.forEach((e6) => r5.add(__PRIVATE_encodeResourcePath(e6.getCollectionPath())));
      const i4 = [];
      return r5.forEach((t5) => {
        const r6 = IDBKeyRange.bound(
          [this.userId, t5, n5],
          [this.userId, t5, n5 + 1],
          /*lowerOpen=*/
          false,
          /*upperOpen=*/
          true
        );
        i4.push(__PRIVATE_documentOverlayStore(e5).j("collectionPathOverlayIndex", r6));
      }), PersistencePromise.waitFor(i4);
    }
    getOverlaysForCollection(e5, t4, n5) {
      const r5 = __PRIVATE_newOverlayMap(), i4 = __PRIVATE_encodeResourcePath(t4), s4 = IDBKeyRange.bound(
        [this.userId, i4, n5],
        [this.userId, i4, Number.POSITIVE_INFINITY],
        /*lowerOpen=*/
        true
      );
      return __PRIVATE_documentOverlayStore(e5).U("collectionPathOverlayIndex", s4).next((e6) => {
        for (const t5 of e6) {
          const e7 = __PRIVATE_fromDbDocumentOverlay(this.serializer, t5);
          r5.set(e7.getKey(), e7);
        }
        return r5;
      });
    }
    getOverlaysForCollectionGroup(e5, t4, n5, r5) {
      const i4 = __PRIVATE_newOverlayMap();
      let s4;
      const o4 = IDBKeyRange.bound(
        [this.userId, t4, n5],
        [this.userId, t4, Number.POSITIVE_INFINITY],
        /*lowerOpen=*/
        true
      );
      return __PRIVATE_documentOverlayStore(e5).J({
        index: "collectionGroupOverlayIndex",
        range: o4
      }, (e6, t5, n6) => {
        const o5 = __PRIVATE_fromDbDocumentOverlay(this.serializer, t5);
        i4.size() < r5 || o5.largestBatchId === s4 ? (i4.set(o5.getKey(), o5), s4 = o5.largestBatchId) : n6.done();
      }).next(() => i4);
    }
    ht(e5, t4) {
      return __PRIVATE_documentOverlayStore(e5).put(function __PRIVATE_toDbDocumentOverlay(e6, t5, n5) {
        const [r5, i4, s4] = __PRIVATE_toDbDocumentOverlayKey(t5, n5.mutation.key);
        return {
          userId: t5,
          collectionPath: i4,
          documentId: s4,
          collectionGroup: n5.mutation.key.getCollectionGroup(),
          largestBatchId: n5.largestBatchId,
          overlayMutation: toMutation(e6.ct, n5.mutation)
        };
      }(this.serializer, this.userId, t4));
    }
  };
  function __PRIVATE_documentOverlayStore(e5) {
    return __PRIVATE_getStore(e5, "documentOverlays");
  }
  var __PRIVATE_FirestoreIndexValueWriter = class {
    constructor() {
    }
    // The write methods below short-circuit writing terminators for values
    // containing a (terminating) truncated value.
    // As an example, consider the resulting encoding for:
    // ["bar", [2, "foo"]] -> (STRING, "bar", TERM, ARRAY, NUMBER, 2, STRING, "foo", TERM, TERM, TERM)
    // ["bar", [2, truncated("foo")]] -> (STRING, "bar", TERM, ARRAY, NUMBER, 2, STRING, "foo", TRUNC)
    // ["bar", truncated(["foo"])] -> (STRING, "bar", TERM, ARRAY. STRING, "foo", TERM, TRUNC)
    /** Writes an index value.  */
    Pt(e5, t4) {
      this.It(e5, t4), // Write separator to split index values
      // (see go/firestore-storage-format#encodings).
      t4.Tt();
    }
    It(e5, t4) {
      if ("nullValue" in e5) this.Et(t4, 5);
      else if ("booleanValue" in e5) this.Et(t4, 10), t4.dt(e5.booleanValue ? 1 : 0);
      else if ("integerValue" in e5) this.Et(t4, 15), t4.dt(__PRIVATE_normalizeNumber(e5.integerValue));
      else if ("doubleValue" in e5) {
        const n5 = __PRIVATE_normalizeNumber(e5.doubleValue);
        isNaN(n5) ? this.Et(t4, 13) : (this.Et(t4, 15), __PRIVATE_isNegativeZero(n5) ? (
          // -0.0, 0 and 0.0 are all considered the same
          t4.dt(0)
        ) : t4.dt(n5));
      } else if ("timestampValue" in e5) {
        let n5 = e5.timestampValue;
        this.Et(t4, 20), "string" == typeof n5 && (n5 = __PRIVATE_normalizeTimestamp(n5)), t4.At(`${n5.seconds || ""}`), t4.dt(n5.nanos || 0);
      } else if ("stringValue" in e5) this.Rt(e5.stringValue, t4), this.Vt(t4);
      else if ("bytesValue" in e5) this.Et(t4, 30), t4.ft(__PRIVATE_normalizeByteString(e5.bytesValue)), this.Vt(t4);
      else if ("referenceValue" in e5) this.gt(e5.referenceValue, t4);
      else if ("geoPointValue" in e5) {
        const n5 = e5.geoPointValue;
        this.Et(t4, 45), t4.dt(n5.latitude || 0), t4.dt(n5.longitude || 0);
      } else "mapValue" in e5 ? __PRIVATE_isMaxValue(e5) ? this.Et(t4, Number.MAX_SAFE_INTEGER) : (this.yt(e5.mapValue, t4), this.Vt(t4)) : "arrayValue" in e5 ? (this.wt(e5.arrayValue, t4), this.Vt(t4)) : fail();
    }
    Rt(e5, t4) {
      this.Et(t4, 25), this.St(e5, t4);
    }
    St(e5, t4) {
      t4.At(e5);
    }
    yt(e5, t4) {
      const n5 = e5.fields || {};
      this.Et(t4, 55);
      for (const e6 of Object.keys(n5)) this.Rt(e6, t4), this.It(n5[e6], t4);
    }
    wt(e5, t4) {
      const n5 = e5.values || [];
      this.Et(t4, 50);
      for (const e6 of n5) this.It(e6, t4);
    }
    gt(e5, t4) {
      this.Et(t4, 37);
      DocumentKey.fromName(e5).path.forEach((e6) => {
        this.Et(t4, 60), this.St(e6, t4);
      });
    }
    Et(e5, t4) {
      e5.dt(t4);
    }
    Vt(e5) {
      e5.dt(2);
    }
  };
  __PRIVATE_FirestoreIndexValueWriter.bt = new __PRIVATE_FirestoreIndexValueWriter();
  function __PRIVATE_numberOfLeadingZerosInByte(e5) {
    if (0 === e5) return 8;
    let t4 = 0;
    return e5 >> 4 == 0 && // Test if the first four bits are zero.
    (t4 += 4, e5 <<= 4), e5 >> 6 == 0 && // Test if the first two (or next two) bits are zero.
    (t4 += 2, e5 <<= 2), e5 >> 7 == 0 && // Test if the remaining bit is zero.
    (t4 += 1), t4;
  }
  function __PRIVATE_unsignedNumLength(e5) {
    const t4 = 64 - function __PRIVATE_numberOfLeadingZeros(e6) {
      let t5 = 0;
      for (let n5 = 0; n5 < 8; ++n5) {
        const r5 = __PRIVATE_numberOfLeadingZerosInByte(255 & e6[n5]);
        if (t5 += r5, 8 !== r5) break;
      }
      return t5;
    }(e5);
    return Math.ceil(t4 / 8);
  }
  var __PRIVATE_OrderedCodeWriter = class {
    constructor() {
      this.buffer = new Uint8Array(1024), this.position = 0;
    }
    Dt(e5) {
      const t4 = e5[Symbol.iterator]();
      let n5 = t4.next();
      for (; !n5.done; ) this.Ct(n5.value), n5 = t4.next();
      this.vt();
    }
    Ft(e5) {
      const t4 = e5[Symbol.iterator]();
      let n5 = t4.next();
      for (; !n5.done; ) this.Mt(n5.value), n5 = t4.next();
      this.xt();
    }
    /** Writes utf8 bytes into this byte sequence, ascending. */
    Ot(e5) {
      for (const t4 of e5) {
        const e6 = t4.charCodeAt(0);
        if (e6 < 128) this.Ct(e6);
        else if (e6 < 2048) this.Ct(960 | e6 >>> 6), this.Ct(128 | 63 & e6);
        else if (t4 < "\uD800" || "\uDBFF" < t4) this.Ct(480 | e6 >>> 12), this.Ct(128 | 63 & e6 >>> 6), this.Ct(128 | 63 & e6);
        else {
          const e7 = t4.codePointAt(0);
          this.Ct(240 | e7 >>> 18), this.Ct(128 | 63 & e7 >>> 12), this.Ct(128 | 63 & e7 >>> 6), this.Ct(128 | 63 & e7);
        }
      }
      this.vt();
    }
    /** Writes utf8 bytes into this byte sequence, descending */
    Nt(e5) {
      for (const t4 of e5) {
        const e6 = t4.charCodeAt(0);
        if (e6 < 128) this.Mt(e6);
        else if (e6 < 2048) this.Mt(960 | e6 >>> 6), this.Mt(128 | 63 & e6);
        else if (t4 < "\uD800" || "\uDBFF" < t4) this.Mt(480 | e6 >>> 12), this.Mt(128 | 63 & e6 >>> 6), this.Mt(128 | 63 & e6);
        else {
          const e7 = t4.codePointAt(0);
          this.Mt(240 | e7 >>> 18), this.Mt(128 | 63 & e7 >>> 12), this.Mt(128 | 63 & e7 >>> 6), this.Mt(128 | 63 & e7);
        }
      }
      this.xt();
    }
    Lt(e5) {
      const t4 = this.Bt(e5), n5 = __PRIVATE_unsignedNumLength(t4);
      this.kt(1 + n5), this.buffer[this.position++] = 255 & n5;
      for (let e6 = t4.length - n5; e6 < t4.length; ++e6) this.buffer[this.position++] = 255 & t4[e6];
    }
    qt(e5) {
      const t4 = this.Bt(e5), n5 = __PRIVATE_unsignedNumLength(t4);
      this.kt(1 + n5), this.buffer[this.position++] = ~(255 & n5);
      for (let e6 = t4.length - n5; e6 < t4.length; ++e6) this.buffer[this.position++] = ~(255 & t4[e6]);
    }
    /**
     * Writes the "infinity" byte sequence that sorts after all other byte
     * sequences written in ascending order.
     */
    Qt() {
      this.Kt(255), this.Kt(255);
    }
    /**
     * Writes the "infinity" byte sequence that sorts before all other byte
     * sequences written in descending order.
     */
    $t() {
      this.Ut(255), this.Ut(255);
    }
    /**
     * Resets the buffer such that it is the same as when it was newly
     * constructed.
     */
    reset() {
      this.position = 0;
    }
    seed(e5) {
      this.kt(e5.length), this.buffer.set(e5, this.position), this.position += e5.length;
    }
    /** Makes a copy of the encoded bytes in this buffer.  */
    Wt() {
      return this.buffer.slice(0, this.position);
    }
    /**
     * Encodes `val` into an encoding so that the order matches the IEEE 754
     * floating-point comparison results with the following exceptions:
     *   -0.0 < 0.0
     *   all non-NaN < NaN
     *   NaN = NaN
     */
    Bt(e5) {
      const t4 = (
        /** Converts a JavaScript number to a byte array (using big endian encoding). */
        function __PRIVATE_doubleToLongBits(e6) {
          const t5 = new DataView(new ArrayBuffer(8));
          return t5.setFloat64(
            0,
            e6,
            /* littleEndian= */
            false
          ), new Uint8Array(t5.buffer);
        }(e5)
      ), n5 = 0 != (128 & t4[0]);
      t4[0] ^= n5 ? 255 : 128;
      for (let e6 = 1; e6 < t4.length; ++e6) t4[e6] ^= n5 ? 255 : 0;
      return t4;
    }
    /** Writes a single byte ascending to the buffer. */
    Ct(e5) {
      const t4 = 255 & e5;
      0 === t4 ? (this.Kt(0), this.Kt(255)) : 255 === t4 ? (this.Kt(255), this.Kt(0)) : this.Kt(t4);
    }
    /** Writes a single byte descending to the buffer.  */
    Mt(e5) {
      const t4 = 255 & e5;
      0 === t4 ? (this.Ut(0), this.Ut(255)) : 255 === t4 ? (this.Ut(255), this.Ut(0)) : this.Ut(e5);
    }
    vt() {
      this.Kt(0), this.Kt(1);
    }
    xt() {
      this.Ut(0), this.Ut(1);
    }
    Kt(e5) {
      this.kt(1), this.buffer[this.position++] = e5;
    }
    Ut(e5) {
      this.kt(1), this.buffer[this.position++] = ~e5;
    }
    kt(e5) {
      const t4 = e5 + this.position;
      if (t4 <= this.buffer.length) return;
      let n5 = 2 * this.buffer.length;
      n5 < t4 && (n5 = t4);
      const r5 = new Uint8Array(n5);
      r5.set(this.buffer), // copy old data
      this.buffer = r5;
    }
  };
  var __PRIVATE_AscendingIndexByteEncoder = class {
    constructor(e5) {
      this.Gt = e5;
    }
    ft(e5) {
      this.Gt.Dt(e5);
    }
    At(e5) {
      this.Gt.Ot(e5);
    }
    dt(e5) {
      this.Gt.Lt(e5);
    }
    Tt() {
      this.Gt.Qt();
    }
  };
  var __PRIVATE_DescendingIndexByteEncoder = class {
    constructor(e5) {
      this.Gt = e5;
    }
    ft(e5) {
      this.Gt.Ft(e5);
    }
    At(e5) {
      this.Gt.Nt(e5);
    }
    dt(e5) {
      this.Gt.qt(e5);
    }
    Tt() {
      this.Gt.$t();
    }
  };
  var __PRIVATE_IndexByteEncoder = class {
    constructor() {
      this.Gt = new __PRIVATE_OrderedCodeWriter(), this.zt = new __PRIVATE_AscendingIndexByteEncoder(this.Gt), this.jt = new __PRIVATE_DescendingIndexByteEncoder(this.Gt);
    }
    seed(e5) {
      this.Gt.seed(e5);
    }
    Ht(e5) {
      return 0 === e5 ? this.zt : this.jt;
    }
    Wt() {
      return this.Gt.Wt();
    }
    reset() {
      this.Gt.reset();
    }
  };
  var __PRIVATE_IndexEntry = class ___PRIVATE_IndexEntry {
    constructor(e5, t4, n5, r5) {
      this.indexId = e5, this.documentKey = t4, this.arrayValue = n5, this.directionalValue = r5;
    }
    /**
     * Returns an IndexEntry entry that sorts immediately after the current
     * directional value.
     */
    Jt() {
      const e5 = this.directionalValue.length, t4 = 0 === e5 || 255 === this.directionalValue[e5 - 1] ? e5 + 1 : e5, n5 = new Uint8Array(t4);
      return n5.set(this.directionalValue, 0), t4 !== e5 ? n5.set([0], this.directionalValue.length) : ++n5[n5.length - 1], new ___PRIVATE_IndexEntry(this.indexId, this.documentKey, this.arrayValue, n5);
    }
  };
  function __PRIVATE_indexEntryComparator(e5, t4) {
    let n5 = e5.indexId - t4.indexId;
    return 0 !== n5 ? n5 : (n5 = __PRIVATE_compareByteArrays(e5.arrayValue, t4.arrayValue), 0 !== n5 ? n5 : (n5 = __PRIVATE_compareByteArrays(e5.directionalValue, t4.directionalValue), 0 !== n5 ? n5 : DocumentKey.comparator(e5.documentKey, t4.documentKey)));
  }
  function __PRIVATE_compareByteArrays(e5, t4) {
    for (let n5 = 0; n5 < e5.length && n5 < t4.length; ++n5) {
      const r5 = e5[n5] - t4[n5];
      if (0 !== r5) return r5;
    }
    return e5.length - t4.length;
  }
  var __PRIVATE_TargetIndexMatcher = class {
    constructor(e5) {
      this.Yt = new SortedSet((e6, t4) => FieldPath$1.comparator(e6.field, t4.field)), this.collectionId = null != e5.collectionGroup ? e5.collectionGroup : e5.path.lastSegment(), this.Zt = e5.orderBy, this.Xt = [];
      for (const t4 of e5.filters) {
        const e6 = t4;
        e6.isInequality() ? this.Yt = this.Yt.add(e6) : this.Xt.push(e6);
      }
    }
    get en() {
      return this.Yt.size > 1;
    }
    /**
     * Returns whether the index can be used to serve the TargetIndexMatcher's
     * target.
     *
     * An index is considered capable of serving the target when:
     * - The target uses all index segments for its filters and orderBy clauses.
     *   The target can have additional filter and orderBy clauses, but not
     *   fewer.
     * - If an ArrayContains/ArrayContainsAnyfilter is used, the index must also
     *   have a corresponding `CONTAINS` segment.
     * - All directional index segments can be mapped to the target as a series of
     *   equality filters, a single inequality filter and a series of orderBy
     *   clauses.
     * - The segments that represent the equality filters may appear out of order.
     * - The optional segment for the inequality filter must appear after all
     *   equality segments.
     * - The segments that represent that orderBy clause of the target must appear
     *   in order after all equality and inequality segments. Single orderBy
     *   clauses cannot be skipped, but a continuous orderBy suffix may be
     *   omitted.
     */
    tn(e5) {
      if (__PRIVATE_hardAssert(e5.collectionGroup === this.collectionId), this.en)
        return false;
      const t4 = __PRIVATE_fieldIndexGetArraySegment(e5);
      if (void 0 !== t4 && !this.nn(t4)) return false;
      const n5 = __PRIVATE_fieldIndexGetDirectionalSegments(e5);
      let r5 = /* @__PURE__ */ new Set(), i4 = 0, s4 = 0;
      for (; i4 < n5.length && this.nn(n5[i4]); ++i4) r5 = r5.add(n5[i4].fieldPath.canonicalString());
      if (i4 === n5.length) return true;
      if (this.Yt.size > 0) {
        const e6 = this.Yt.getIterator().getNext();
        if (!r5.has(e6.field.canonicalString())) {
          const t5 = n5[i4];
          if (!this.rn(e6, t5) || !this.sn(this.Zt[s4++], t5)) return false;
        }
        ++i4;
      }
      for (; i4 < n5.length; ++i4) {
        const e6 = n5[i4];
        if (s4 >= this.Zt.length || !this.sn(this.Zt[s4++], e6)) return false;
      }
      return true;
    }
    /**
     * Returns a full matched field index for this target. Currently multiple
     * inequality query is not supported so function returns null.
     */
    on() {
      if (this.en) return null;
      let e5 = new SortedSet(FieldPath$1.comparator);
      const t4 = [];
      for (const n5 of this.Xt) {
        if (n5.field.isKeyField()) continue;
        if ("array-contains" === n5.op || "array-contains-any" === n5.op) t4.push(new IndexSegment(
          n5.field,
          2
          /* IndexKind.CONTAINS */
        ));
        else {
          if (e5.has(n5.field)) continue;
          e5 = e5.add(n5.field), t4.push(new IndexSegment(
            n5.field,
            0
            /* IndexKind.ASCENDING */
          ));
        }
      }
      for (const n5 of this.Zt)
        n5.field.isKeyField() || e5.has(n5.field) || (e5 = e5.add(n5.field), t4.push(new IndexSegment(
          n5.field,
          "asc" === n5.dir ? 0 : 1
          /* IndexKind.DESCENDING */
        )));
      return new FieldIndex(FieldIndex.UNKNOWN_ID, this.collectionId, t4, IndexState.empty());
    }
    nn(e5) {
      for (const t4 of this.Xt) if (this.rn(t4, e5)) return true;
      return false;
    }
    rn(e5, t4) {
      if (void 0 === e5 || !e5.field.isEqual(t4.fieldPath)) return false;
      const n5 = "array-contains" === e5.op || "array-contains-any" === e5.op;
      return 2 === t4.kind === n5;
    }
    sn(e5, t4) {
      return !!e5.field.isEqual(t4.fieldPath) && (0 === t4.kind && "asc" === e5.dir || 1 === t4.kind && "desc" === e5.dir);
    }
  };
  function __PRIVATE_computeInExpansion(e5) {
    var t4, n5;
    if (__PRIVATE_hardAssert(e5 instanceof FieldFilter || e5 instanceof CompositeFilter), e5 instanceof FieldFilter) {
      if (e5 instanceof __PRIVATE_InFilter) {
        const r6 = (null === (n5 = null === (t4 = e5.value.arrayValue) || void 0 === t4 ? void 0 : t4.values) || void 0 === n5 ? void 0 : n5.map((t5) => FieldFilter.create(e5.field, "==", t5))) || [];
        return CompositeFilter.create(
          r6,
          "or"
          /* CompositeOperator.OR */
        );
      }
      return e5;
    }
    const r5 = e5.filters.map((e6) => __PRIVATE_computeInExpansion(e6));
    return CompositeFilter.create(r5, e5.op);
  }
  function __PRIVATE_getDnfTerms(e5) {
    if (0 === e5.getFilters().length) return [];
    const t4 = __PRIVATE_computeDistributedNormalForm(__PRIVATE_computeInExpansion(e5));
    return __PRIVATE_hardAssert(__PRIVATE_isDisjunctiveNormalForm(t4)), __PRIVATE_isSingleFieldFilter(t4) || __PRIVATE_isFlatConjunction(t4) ? [t4] : t4.getFilters();
  }
  function __PRIVATE_isSingleFieldFilter(e5) {
    return e5 instanceof FieldFilter;
  }
  function __PRIVATE_isFlatConjunction(e5) {
    return e5 instanceof CompositeFilter && __PRIVATE_compositeFilterIsFlatConjunction(e5);
  }
  function __PRIVATE_isDisjunctiveNormalForm(e5) {
    return __PRIVATE_isSingleFieldFilter(e5) || __PRIVATE_isFlatConjunction(e5) || /**
    * Returns true if the given filter is the disjunction of one or more "flat conjunctions" and
    * field filters. e.g. (a == 10) || (b==20 && c==30)
    */
    function __PRIVATE_isDisjunctionOfFieldFiltersAndFlatConjunctions(e6) {
      if (e6 instanceof CompositeFilter && __PRIVATE_compositeFilterIsDisjunction(e6)) {
        for (const t4 of e6.getFilters()) if (!__PRIVATE_isSingleFieldFilter(t4) && !__PRIVATE_isFlatConjunction(t4)) return false;
        return true;
      }
      return false;
    }(e5);
  }
  function __PRIVATE_computeDistributedNormalForm(e5) {
    if (__PRIVATE_hardAssert(e5 instanceof FieldFilter || e5 instanceof CompositeFilter), e5 instanceof FieldFilter) return e5;
    if (1 === e5.filters.length) return __PRIVATE_computeDistributedNormalForm(e5.filters[0]);
    const t4 = e5.filters.map((e6) => __PRIVATE_computeDistributedNormalForm(e6));
    let n5 = CompositeFilter.create(t4, e5.op);
    return n5 = __PRIVATE_applyAssociation(n5), __PRIVATE_isDisjunctiveNormalForm(n5) ? n5 : (__PRIVATE_hardAssert(n5 instanceof CompositeFilter), __PRIVATE_hardAssert(__PRIVATE_compositeFilterIsConjunction(n5)), __PRIVATE_hardAssert(n5.filters.length > 1), n5.filters.reduce((e6, t5) => __PRIVATE_applyDistribution(e6, t5)));
  }
  function __PRIVATE_applyDistribution(e5, t4) {
    let n5;
    return __PRIVATE_hardAssert(e5 instanceof FieldFilter || e5 instanceof CompositeFilter), __PRIVATE_hardAssert(t4 instanceof FieldFilter || t4 instanceof CompositeFilter), // FieldFilter FieldFilter
    n5 = e5 instanceof FieldFilter ? t4 instanceof FieldFilter ? function __PRIVATE_applyDistributionFieldFilters(e6, t5) {
      return CompositeFilter.create(
        [e6, t5],
        "and"
        /* CompositeOperator.AND */
      );
    }(e5, t4) : __PRIVATE_applyDistributionFieldAndCompositeFilters(e5, t4) : t4 instanceof FieldFilter ? __PRIVATE_applyDistributionFieldAndCompositeFilters(t4, e5) : function __PRIVATE_applyDistributionCompositeFilters(e6, t5) {
      if (__PRIVATE_hardAssert(e6.filters.length > 0 && t5.filters.length > 0), __PRIVATE_compositeFilterIsConjunction(e6) && __PRIVATE_compositeFilterIsConjunction(t5)) return __PRIVATE_compositeFilterWithAddedFilters(e6, t5.getFilters());
      const n6 = __PRIVATE_compositeFilterIsDisjunction(e6) ? e6 : t5, r5 = __PRIVATE_compositeFilterIsDisjunction(e6) ? t5 : e6, i4 = n6.filters.map((e7) => __PRIVATE_applyDistribution(e7, r5));
      return CompositeFilter.create(
        i4,
        "or"
        /* CompositeOperator.OR */
      );
    }(e5, t4), __PRIVATE_applyAssociation(n5);
  }
  function __PRIVATE_applyDistributionFieldAndCompositeFilters(e5, t4) {
    if (__PRIVATE_compositeFilterIsConjunction(t4))
      return __PRIVATE_compositeFilterWithAddedFilters(t4, e5.getFilters());
    {
      const n5 = t4.filters.map((t5) => __PRIVATE_applyDistribution(e5, t5));
      return CompositeFilter.create(
        n5,
        "or"
        /* CompositeOperator.OR */
      );
    }
  }
  function __PRIVATE_applyAssociation(e5) {
    if (__PRIVATE_hardAssert(e5 instanceof FieldFilter || e5 instanceof CompositeFilter), e5 instanceof FieldFilter) return e5;
    const t4 = e5.getFilters();
    if (1 === t4.length) return __PRIVATE_applyAssociation(t4[0]);
    if (__PRIVATE_compositeFilterIsFlat(e5)) return e5;
    const n5 = t4.map((e6) => __PRIVATE_applyAssociation(e6)), r5 = [];
    return n5.forEach((t5) => {
      t5 instanceof FieldFilter ? r5.push(t5) : t5 instanceof CompositeFilter && (t5.op === e5.op ? (
        // compositeFilter: (A | (B | C))
        // compositeSubfilter: (B | C)
        // Result: (A | B | C)
        r5.push(...t5.filters)
      ) : (
        // compositeFilter: (A | (B & C))
        // compositeSubfilter: (B & C)
        // Result: (A | (B & C))
        r5.push(t5)
      ));
    }), 1 === r5.length ? r5[0] : CompositeFilter.create(r5, e5.op);
  }
  var __PRIVATE_MemoryIndexManager = class {
    constructor() {
      this._n = new __PRIVATE_MemoryCollectionParentIndex();
    }
    addToCollectionParentIndex(e5, t4) {
      return this._n.add(t4), PersistencePromise.resolve();
    }
    getCollectionParents(e5, t4) {
      return PersistencePromise.resolve(this._n.getEntries(t4));
    }
    addFieldIndex(e5, t4) {
      return PersistencePromise.resolve();
    }
    deleteFieldIndex(e5, t4) {
      return PersistencePromise.resolve();
    }
    deleteAllFieldIndexes(e5) {
      return PersistencePromise.resolve();
    }
    createTargetIndexes(e5, t4) {
      return PersistencePromise.resolve();
    }
    getDocumentsMatchingTarget(e5, t4) {
      return PersistencePromise.resolve(null);
    }
    getIndexType(e5, t4) {
      return PersistencePromise.resolve(
        0
        /* IndexType.NONE */
      );
    }
    getFieldIndexes(e5, t4) {
      return PersistencePromise.resolve([]);
    }
    getNextCollectionGroupToUpdate(e5) {
      return PersistencePromise.resolve(null);
    }
    getMinOffset(e5, t4) {
      return PersistencePromise.resolve(IndexOffset.min());
    }
    getMinOffsetFromCollectionGroup(e5, t4) {
      return PersistencePromise.resolve(IndexOffset.min());
    }
    updateCollectionGroup(e5, t4, n5) {
      return PersistencePromise.resolve();
    }
    updateIndexEntries(e5, t4) {
      return PersistencePromise.resolve();
    }
  };
  var __PRIVATE_MemoryCollectionParentIndex = class {
    constructor() {
      this.index = {};
    }
    // Returns false if the entry already existed.
    add(e5) {
      const t4 = e5.lastSegment(), n5 = e5.popLast(), r5 = this.index[t4] || new SortedSet(ResourcePath.comparator), i4 = !r5.has(n5);
      return this.index[t4] = r5.add(n5), i4;
    }
    has(e5) {
      const t4 = e5.lastSegment(), n5 = e5.popLast(), r5 = this.index[t4];
      return r5 && r5.has(n5);
    }
    getEntries(e5) {
      return (this.index[e5] || new SortedSet(ResourcePath.comparator)).toArray();
    }
  };
  var de = new Uint8Array(0);
  var __PRIVATE_IndexedDbIndexManager = class {
    constructor(e5, t4) {
      this.databaseId = t4, /**
       * An in-memory copy of the index entries we've already written since the SDK
       * launched. Used to avoid re-writing the same entry repeatedly.
       *
       * This is *NOT* a complete cache of what's in persistence and so can never be
       * used to satisfy reads.
       */
      this.an = new __PRIVATE_MemoryCollectionParentIndex(), /**
       * Maps from a target to its equivalent list of sub-targets. Each sub-target
       * contains only one term from the target's disjunctive normal form (DNF).
       */
      this.un = new ObjectMap((e6) => __PRIVATE_canonifyTarget(e6), (e6, t5) => __PRIVATE_targetEquals(e6, t5)), this.uid = e5.uid || "";
    }
    /**
     * Adds a new entry to the collection parent index.
     *
     * Repeated calls for the same collectionPath should be avoided within a
     * transaction as IndexedDbIndexManager only caches writes once a transaction
     * has been committed.
     */
    addToCollectionParentIndex(e5, t4) {
      if (!this.an.has(t4)) {
        const n5 = t4.lastSegment(), r5 = t4.popLast();
        e5.addOnCommittedListener(() => {
          this.an.add(t4);
        });
        const i4 = {
          collectionId: n5,
          parent: __PRIVATE_encodeResourcePath(r5)
        };
        return __PRIVATE_collectionParentsStore(e5).put(i4);
      }
      return PersistencePromise.resolve();
    }
    getCollectionParents(e5, t4) {
      const n5 = [], r5 = IDBKeyRange.bound(
        [t4, ""],
        [__PRIVATE_immediateSuccessor(t4), ""],
        /*lowerOpen=*/
        false,
        /*upperOpen=*/
        true
      );
      return __PRIVATE_collectionParentsStore(e5).U(r5).next((e6) => {
        for (const r6 of e6) {
          if (r6.collectionId !== t4) break;
          n5.push(__PRIVATE_decodeResourcePath(r6.parent));
        }
        return n5;
      });
    }
    addFieldIndex(e5, t4) {
      const n5 = __PRIVATE_indexConfigurationStore(e5), r5 = function __PRIVATE_toDbIndexConfiguration(e6) {
        return {
          indexId: e6.indexId,
          collectionGroup: e6.collectionGroup,
          fields: e6.fields.map((e7) => [e7.fieldPath.canonicalString(), e7.kind])
        };
      }(t4);
      delete r5.indexId;
      const i4 = n5.add(r5);
      if (t4.indexState) {
        const n6 = __PRIVATE_indexStateStore(e5);
        return i4.next((e6) => {
          n6.put(__PRIVATE_toDbIndexState(e6, this.uid, t4.indexState.sequenceNumber, t4.indexState.offset));
        });
      }
      return i4.next();
    }
    deleteFieldIndex(e5, t4) {
      const n5 = __PRIVATE_indexConfigurationStore(e5), r5 = __PRIVATE_indexStateStore(e5), i4 = __PRIVATE_indexEntriesStore(e5);
      return n5.delete(t4.indexId).next(() => r5.delete(IDBKeyRange.bound(
        [t4.indexId],
        [t4.indexId + 1],
        /*lowerOpen=*/
        false,
        /*upperOpen=*/
        true
      ))).next(() => i4.delete(IDBKeyRange.bound(
        [t4.indexId],
        [t4.indexId + 1],
        /*lowerOpen=*/
        false,
        /*upperOpen=*/
        true
      )));
    }
    deleteAllFieldIndexes(e5) {
      const t4 = __PRIVATE_indexConfigurationStore(e5), n5 = __PRIVATE_indexEntriesStore(e5), r5 = __PRIVATE_indexStateStore(e5);
      return t4.j().next(() => n5.j()).next(() => r5.j());
    }
    createTargetIndexes(e5, t4) {
      return PersistencePromise.forEach(this.cn(t4), (t5) => this.getIndexType(e5, t5).next((n5) => {
        if (0 === n5 || 1 === n5) {
          const n6 = new __PRIVATE_TargetIndexMatcher(t5).on();
          if (null != n6) return this.addFieldIndex(e5, n6);
        }
      }));
    }
    getDocumentsMatchingTarget(e5, t4) {
      const n5 = __PRIVATE_indexEntriesStore(e5);
      let r5 = true;
      const i4 = /* @__PURE__ */ new Map();
      return PersistencePromise.forEach(this.cn(t4), (t5) => this.ln(e5, t5).next((e6) => {
        r5 && (r5 = !!e6), i4.set(t5, e6);
      })).next(() => {
        if (r5) {
          let e6 = __PRIVATE_documentKeySet();
          const r6 = [];
          return PersistencePromise.forEach(i4, (i5, s4) => {
            __PRIVATE_logDebug("IndexedDbIndexManager", `Using index ${function __PRIVATE_fieldIndexToString(e7) {
              return `id=${e7.indexId}|cg=${e7.collectionGroup}|f=${e7.fields.map((e8) => `${e8.fieldPath}:${e8.kind}`).join(",")}`;
            }(i5)} to execute ${__PRIVATE_canonifyTarget(t4)}`);
            const o4 = function __PRIVATE_targetGetArrayValues(e7, t5) {
              const n6 = __PRIVATE_fieldIndexGetArraySegment(t5);
              if (void 0 === n6) return null;
              for (const t6 of __PRIVATE_targetGetFieldFiltersForPath(e7, n6.fieldPath)) switch (t6.op) {
                case "array-contains-any":
                  return t6.value.arrayValue.values || [];
                case "array-contains":
                  return [t6.value];
              }
              return null;
            }(s4, i5), _2 = function __PRIVATE_targetGetNotInValues(e7, t5) {
              const n6 = /* @__PURE__ */ new Map();
              for (const r7 of __PRIVATE_fieldIndexGetDirectionalSegments(t5)) for (const t6 of __PRIVATE_targetGetFieldFiltersForPath(e7, r7.fieldPath)) switch (t6.op) {
                case "==":
                case "in":
                  n6.set(r7.fieldPath.canonicalString(), t6.value);
                  break;
                case "not-in":
                case "!=":
                  return n6.set(r7.fieldPath.canonicalString(), t6.value), Array.from(n6.values());
              }
              return null;
            }(s4, i5), a3 = function __PRIVATE_targetGetLowerBound(e7, t5) {
              const n6 = [];
              let r7 = true;
              for (const i6 of __PRIVATE_fieldIndexGetDirectionalSegments(t5)) {
                const t6 = 0 === i6.kind ? __PRIVATE_targetGetAscendingBound(e7, i6.fieldPath, e7.startAt) : __PRIVATE_targetGetDescendingBound(e7, i6.fieldPath, e7.startAt);
                n6.push(t6.value), r7 && (r7 = t6.inclusive);
              }
              return new Bound(n6, r7);
            }(s4, i5), u3 = function __PRIVATE_targetGetUpperBound(e7, t5) {
              const n6 = [];
              let r7 = true;
              for (const i6 of __PRIVATE_fieldIndexGetDirectionalSegments(t5)) {
                const t6 = 0 === i6.kind ? __PRIVATE_targetGetDescendingBound(e7, i6.fieldPath, e7.endAt) : __PRIVATE_targetGetAscendingBound(e7, i6.fieldPath, e7.endAt);
                n6.push(t6.value), r7 && (r7 = t6.inclusive);
              }
              return new Bound(n6, r7);
            }(s4, i5), c4 = this.hn(i5, s4, a3), l3 = this.hn(i5, s4, u3), h3 = this.Pn(i5, s4, _2), P2 = this.In(i5.indexId, o4, c4, a3.inclusive, l3, u3.inclusive, h3);
            return PersistencePromise.forEach(P2, (i6) => n5.G(i6, t4.limit).next((t5) => {
              t5.forEach((t6) => {
                const n6 = DocumentKey.fromSegments(t6.documentKey);
                e6.has(n6) || (e6 = e6.add(n6), r6.push(n6));
              });
            }));
          }).next(() => r6);
        }
        return PersistencePromise.resolve(null);
      });
    }
    cn(e5) {
      let t4 = this.un.get(e5);
      if (t4) return t4;
      if (0 === e5.filters.length) t4 = [e5];
      else {
        t4 = __PRIVATE_getDnfTerms(CompositeFilter.create(
          e5.filters,
          "and"
          /* CompositeOperator.AND */
        )).map((t5) => __PRIVATE_newTarget(e5.path, e5.collectionGroup, e5.orderBy, t5.getFilters(), e5.limit, e5.startAt, e5.endAt));
      }
      return this.un.set(e5, t4), t4;
    }
    /**
     * Constructs a key range query on `DbIndexEntryStore` that unions all
     * bounds.
     */
    In(e5, t4, n5, r5, i4, s4, o4) {
      const _2 = (null != t4 ? t4.length : 1) * Math.max(n5.length, i4.length), a3 = _2 / (null != t4 ? t4.length : 1), u3 = [];
      for (let c4 = 0; c4 < _2; ++c4) {
        const _3 = t4 ? this.Tn(t4[c4 / a3]) : de, l3 = this.En(e5, _3, n5[c4 % a3], r5), h3 = this.dn(e5, _3, i4[c4 % a3], s4), P2 = o4.map((t5) => this.En(
          e5,
          _3,
          t5,
          /* inclusive= */
          true
        ));
        u3.push(...this.createRange(l3, h3, P2));
      }
      return u3;
    }
    /** Generates the lower bound for `arrayValue` and `directionalValue`. */
    En(e5, t4, n5, r5) {
      const i4 = new __PRIVATE_IndexEntry(e5, DocumentKey.empty(), t4, n5);
      return r5 ? i4 : i4.Jt();
    }
    /** Generates the upper bound for `arrayValue` and `directionalValue`. */
    dn(e5, t4, n5, r5) {
      const i4 = new __PRIVATE_IndexEntry(e5, DocumentKey.empty(), t4, n5);
      return r5 ? i4.Jt() : i4;
    }
    ln(e5, t4) {
      const n5 = new __PRIVATE_TargetIndexMatcher(t4), r5 = null != t4.collectionGroup ? t4.collectionGroup : t4.path.lastSegment();
      return this.getFieldIndexes(e5, r5).next((e6) => {
        let t5 = null;
        for (const r6 of e6) {
          n5.tn(r6) && (!t5 || r6.fields.length > t5.fields.length) && (t5 = r6);
        }
        return t5;
      });
    }
    getIndexType(e5, t4) {
      let n5 = 2;
      const r5 = this.cn(t4);
      return PersistencePromise.forEach(r5, (t5) => this.ln(e5, t5).next((e6) => {
        e6 ? 0 !== n5 && e6.fields.length < function __PRIVATE_targetGetSegmentCount(e7) {
          let t6 = new SortedSet(FieldPath$1.comparator), n6 = false;
          for (const r6 of e7.filters) for (const e8 of r6.getFlattenedFilters())
            e8.field.isKeyField() || // ARRAY_CONTAINS or ARRAY_CONTAINS_ANY filters must be counted separately.
            // For instance, it is possible to have an index for "a ARRAY a ASC". Even
            // though these are on the same field, they should be counted as two
            // separate segments in an index.
            ("array-contains" === e8.op || "array-contains-any" === e8.op ? n6 = true : t6 = t6.add(e8.field));
          for (const n7 of e7.orderBy)
            n7.field.isKeyField() || (t6 = t6.add(n7.field));
          return t6.size + (n6 ? 1 : 0);
        }(t5) && (n5 = 1) : n5 = 0;
      })).next(() => (
        // OR queries have more than one sub-target (one sub-target per DNF term). We currently consider
        // OR queries that have a `limit` to have a partial index. For such queries we perform sorting
        // and apply the limit in memory as a post-processing step.
        function __PRIVATE_targetHasLimit(e6) {
          return null !== e6.limit;
        }(t4) && r5.length > 1 && 2 === n5 ? 1 : n5
      ));
    }
    /**
     * Returns the byte encoded form of the directional values in the field index.
     * Returns `null` if the document does not have all fields specified in the
     * index.
     */
    An(e5, t4) {
      const n5 = new __PRIVATE_IndexByteEncoder();
      for (const r5 of __PRIVATE_fieldIndexGetDirectionalSegments(e5)) {
        const e6 = t4.data.field(r5.fieldPath);
        if (null == e6) return null;
        const i4 = n5.Ht(r5.kind);
        __PRIVATE_FirestoreIndexValueWriter.bt.Pt(e6, i4);
      }
      return n5.Wt();
    }
    /** Encodes a single value to the ascending index format. */
    Tn(e5) {
      const t4 = new __PRIVATE_IndexByteEncoder();
      return __PRIVATE_FirestoreIndexValueWriter.bt.Pt(e5, t4.Ht(
        0
        /* IndexKind.ASCENDING */
      )), t4.Wt();
    }
    /**
     * Returns an encoded form of the document key that sorts based on the key
     * ordering of the field index.
     */
    Rn(e5, t4) {
      const n5 = new __PRIVATE_IndexByteEncoder();
      return __PRIVATE_FirestoreIndexValueWriter.bt.Pt(__PRIVATE_refValue(this.databaseId, t4), n5.Ht(function __PRIVATE_fieldIndexGetKeyOrder(e6) {
        const t5 = __PRIVATE_fieldIndexGetDirectionalSegments(e6);
        return 0 === t5.length ? 0 : t5[t5.length - 1].kind;
      }(e5))), n5.Wt();
    }
    /**
     * Encodes the given field values according to the specification in `target`.
     * For IN queries, a list of possible values is returned.
     */
    Pn(e5, t4, n5) {
      if (null === n5) return [];
      let r5 = [];
      r5.push(new __PRIVATE_IndexByteEncoder());
      let i4 = 0;
      for (const s4 of __PRIVATE_fieldIndexGetDirectionalSegments(e5)) {
        const e6 = n5[i4++];
        for (const n6 of r5) if (this.Vn(t4, s4.fieldPath) && isArray(e6)) r5 = this.mn(r5, s4, e6);
        else {
          const t5 = n6.Ht(s4.kind);
          __PRIVATE_FirestoreIndexValueWriter.bt.Pt(e6, t5);
        }
      }
      return this.fn(r5);
    }
    /**
     * Encodes the given bounds according to the specification in `target`. For IN
     * queries, a list of possible values is returned.
     */
    hn(e5, t4, n5) {
      return this.Pn(e5, t4, n5.position);
    }
    /** Returns the byte representation for the provided encoders. */
    fn(e5) {
      const t4 = [];
      for (let n5 = 0; n5 < e5.length; ++n5) t4[n5] = e5[n5].Wt();
      return t4;
    }
    /**
     * Creates a separate encoder for each element of an array.
     *
     * The method appends each value to all existing encoders (e.g. filter("a",
     * "==", "a1").filter("b", "in", ["b1", "b2"]) becomes ["a1,b1", "a1,b2"]). A
     * list of new encoders is returned.
     */
    mn(e5, t4, n5) {
      const r5 = [...e5], i4 = [];
      for (const e6 of n5.arrayValue.values || []) for (const n6 of r5) {
        const r6 = new __PRIVATE_IndexByteEncoder();
        r6.seed(n6.Wt()), __PRIVATE_FirestoreIndexValueWriter.bt.Pt(e6, r6.Ht(t4.kind)), i4.push(r6);
      }
      return i4;
    }
    Vn(e5, t4) {
      return !!e5.filters.find((e6) => e6 instanceof FieldFilter && e6.field.isEqual(t4) && ("in" === e6.op || "not-in" === e6.op));
    }
    getFieldIndexes(e5, t4) {
      const n5 = __PRIVATE_indexConfigurationStore(e5), r5 = __PRIVATE_indexStateStore(e5);
      return (t4 ? n5.U("collectionGroupIndex", IDBKeyRange.bound(t4, t4)) : n5.U()).next((e6) => {
        const t5 = [];
        return PersistencePromise.forEach(e6, (e7) => r5.get([e7.indexId, this.uid]).next((n6) => {
          t5.push(function __PRIVATE_fromDbIndexConfiguration(e8, t6) {
            const n7 = t6 ? new IndexState(t6.sequenceNumber, new IndexOffset(__PRIVATE_fromDbTimestamp(t6.readTime), new DocumentKey(__PRIVATE_decodeResourcePath(t6.documentKey)), t6.largestBatchId)) : IndexState.empty(), r6 = e8.fields.map(([e9, t7]) => new IndexSegment(FieldPath$1.fromServerFormat(e9), t7));
            return new FieldIndex(e8.indexId, e8.collectionGroup, r6, n7);
          }(e7, n6));
        })).next(() => t5);
      });
    }
    getNextCollectionGroupToUpdate(e5) {
      return this.getFieldIndexes(e5).next((e6) => 0 === e6.length ? null : (e6.sort((e7, t4) => {
        const n5 = e7.indexState.sequenceNumber - t4.indexState.sequenceNumber;
        return 0 !== n5 ? n5 : __PRIVATE_primitiveComparator(e7.collectionGroup, t4.collectionGroup);
      }), e6[0].collectionGroup));
    }
    updateCollectionGroup(e5, t4, n5) {
      const r5 = __PRIVATE_indexConfigurationStore(e5), i4 = __PRIVATE_indexStateStore(e5);
      return this.gn(e5).next((e6) => r5.U("collectionGroupIndex", IDBKeyRange.bound(t4, t4)).next((t5) => PersistencePromise.forEach(t5, (t6) => i4.put(__PRIVATE_toDbIndexState(t6.indexId, this.uid, e6, n5)))));
    }
    updateIndexEntries(e5, t4) {
      const n5 = /* @__PURE__ */ new Map();
      return PersistencePromise.forEach(t4, (t5, r5) => {
        const i4 = n5.get(t5.collectionGroup);
        return (i4 ? PersistencePromise.resolve(i4) : this.getFieldIndexes(e5, t5.collectionGroup)).next((i5) => (n5.set(t5.collectionGroup, i5), PersistencePromise.forEach(i5, (n6) => this.pn(e5, t5, n6).next((t6) => {
          const i6 = this.yn(r5, n6);
          return t6.isEqual(i6) ? PersistencePromise.resolve() : this.wn(e5, r5, n6, t6, i6);
        }))));
      });
    }
    Sn(e5, t4, n5, r5) {
      return __PRIVATE_indexEntriesStore(e5).put({
        indexId: r5.indexId,
        uid: this.uid,
        arrayValue: r5.arrayValue,
        directionalValue: r5.directionalValue,
        orderedDocumentKey: this.Rn(n5, t4.key),
        documentKey: t4.key.path.toArray()
      });
    }
    bn(e5, t4, n5, r5) {
      return __PRIVATE_indexEntriesStore(e5).delete([r5.indexId, this.uid, r5.arrayValue, r5.directionalValue, this.Rn(n5, t4.key), t4.key.path.toArray()]);
    }
    pn(e5, t4, n5) {
      const r5 = __PRIVATE_indexEntriesStore(e5);
      let i4 = new SortedSet(__PRIVATE_indexEntryComparator);
      return r5.J({
        index: "documentKeyIndex",
        range: IDBKeyRange.only([n5.indexId, this.uid, this.Rn(n5, t4)])
      }, (e6, r6) => {
        i4 = i4.add(new __PRIVATE_IndexEntry(n5.indexId, t4, r6.arrayValue, r6.directionalValue));
      }).next(() => i4);
    }
    /** Creates the index entries for the given document. */
    yn(e5, t4) {
      let n5 = new SortedSet(__PRIVATE_indexEntryComparator);
      const r5 = this.An(t4, e5);
      if (null == r5) return n5;
      const i4 = __PRIVATE_fieldIndexGetArraySegment(t4);
      if (null != i4) {
        const s4 = e5.data.field(i4.fieldPath);
        if (isArray(s4)) for (const i5 of s4.arrayValue.values || []) n5 = n5.add(new __PRIVATE_IndexEntry(t4.indexId, e5.key, this.Tn(i5), r5));
      } else n5 = n5.add(new __PRIVATE_IndexEntry(t4.indexId, e5.key, de, r5));
      return n5;
    }
    /**
     * Updates the index entries for the provided document by deleting entries
     * that are no longer referenced in `newEntries` and adding all newly added
     * entries.
     */
    wn(e5, t4, n5, r5, i4) {
      __PRIVATE_logDebug("IndexedDbIndexManager", "Updating index entries for document '%s'", t4.key);
      const s4 = [];
      return function __PRIVATE_diffSortedSets(e6, t5, n6, r6, i5) {
        const s5 = e6.getIterator(), o4 = t5.getIterator();
        let _2 = __PRIVATE_advanceIterator(s5), a3 = __PRIVATE_advanceIterator(o4);
        for (; _2 || a3; ) {
          let e7 = false, t6 = false;
          if (_2 && a3) {
            const r7 = n6(_2, a3);
            r7 < 0 ? (
              // The element was removed if the next element in our ordered
              // walkthrough is only in `before`.
              t6 = true
            ) : r7 > 0 && // The element was added if the next element in our ordered walkthrough
            // is only in `after`.
            (e7 = true);
          } else null != _2 ? t6 = true : e7 = true;
          e7 ? (r6(a3), a3 = __PRIVATE_advanceIterator(o4)) : t6 ? (i5(_2), _2 = __PRIVATE_advanceIterator(s5)) : (_2 = __PRIVATE_advanceIterator(s5), a3 = __PRIVATE_advanceIterator(o4));
        }
      }(
        r5,
        i4,
        __PRIVATE_indexEntryComparator,
        /* onAdd= */
        (r6) => {
          s4.push(this.Sn(e5, t4, n5, r6));
        },
        /* onRemove= */
        (r6) => {
          s4.push(this.bn(e5, t4, n5, r6));
        }
      ), PersistencePromise.waitFor(s4);
    }
    gn(e5) {
      let t4 = 1;
      return __PRIVATE_indexStateStore(e5).J({
        index: "sequenceNumberIndex",
        reverse: true,
        range: IDBKeyRange.upperBound([this.uid, Number.MAX_SAFE_INTEGER])
      }, (e6, n5, r5) => {
        r5.done(), t4 = n5.sequenceNumber + 1;
      }).next(() => t4);
    }
    /**
     * Returns a new set of IDB ranges that splits the existing range and excludes
     * any values that match the `notInValue` from these ranges. As an example,
     * '[foo > 2 && foo != 3]` becomes  `[foo > 2 && < 3, foo > 3]`.
     */
    createRange(e5, t4, n5) {
      n5 = n5.sort((e6, t5) => __PRIVATE_indexEntryComparator(e6, t5)).filter((e6, t5, n6) => !t5 || 0 !== __PRIVATE_indexEntryComparator(e6, n6[t5 - 1]));
      const r5 = [];
      r5.push(e5);
      for (const i5 of n5) {
        const n6 = __PRIVATE_indexEntryComparator(i5, e5), s4 = __PRIVATE_indexEntryComparator(i5, t4);
        if (0 === n6)
          r5[0] = e5.Jt();
        else if (n6 > 0 && s4 < 0)
          r5.push(i5), r5.push(i5.Jt());
        else if (s4 > 0)
          break;
      }
      r5.push(t4);
      const i4 = [];
      for (let e6 = 0; e6 < r5.length; e6 += 2) {
        if (this.Dn(r5[e6], r5[e6 + 1])) return [];
        const t5 = [r5[e6].indexId, this.uid, r5[e6].arrayValue, r5[e6].directionalValue, de, []], n6 = [r5[e6 + 1].indexId, this.uid, r5[e6 + 1].arrayValue, r5[e6 + 1].directionalValue, de, []];
        i4.push(IDBKeyRange.bound(t5, n6));
      }
      return i4;
    }
    Dn(e5, t4) {
      return __PRIVATE_indexEntryComparator(e5, t4) > 0;
    }
    getMinOffsetFromCollectionGroup(e5, t4) {
      return this.getFieldIndexes(e5, t4).next(__PRIVATE_getMinOffsetFromFieldIndexes);
    }
    getMinOffset(e5, t4) {
      return PersistencePromise.mapArray(this.cn(t4), (t5) => this.ln(e5, t5).next((e6) => e6 || fail())).next(__PRIVATE_getMinOffsetFromFieldIndexes);
    }
  };
  function __PRIVATE_collectionParentsStore(e5) {
    return __PRIVATE_getStore(e5, "collectionParents");
  }
  function __PRIVATE_indexEntriesStore(e5) {
    return __PRIVATE_getStore(e5, "indexEntries");
  }
  function __PRIVATE_indexConfigurationStore(e5) {
    return __PRIVATE_getStore(e5, "indexConfiguration");
  }
  function __PRIVATE_indexStateStore(e5) {
    return __PRIVATE_getStore(e5, "indexState");
  }
  function __PRIVATE_getMinOffsetFromFieldIndexes(e5) {
    __PRIVATE_hardAssert(0 !== e5.length);
    let t4 = e5[0].indexState.offset, n5 = t4.largestBatchId;
    for (let r5 = 1; r5 < e5.length; r5++) {
      const i4 = e5[r5].indexState.offset;
      __PRIVATE_indexOffsetComparator(i4, t4) < 0 && (t4 = i4), n5 < i4.largestBatchId && (n5 = i4.largestBatchId);
    }
    return new IndexOffset(t4.readTime, t4.documentKey, n5);
  }
  var Ae = {
    didRun: false,
    sequenceNumbersCollected: 0,
    targetsRemoved: 0,
    documentsRemoved: 0
  };
  var LruParams = class _LruParams {
    constructor(e5, t4, n5) {
      this.cacheSizeCollectionThreshold = e5, this.percentileToCollect = t4, this.maximumSequenceNumbersToCollect = n5;
    }
    static withCacheSize(e5) {
      return new _LruParams(e5, _LruParams.DEFAULT_COLLECTION_PERCENTILE, _LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
    }
  };
  function removeMutationBatch(e5, t4, n5) {
    const r5 = e5.store("mutations"), i4 = e5.store("documentMutations"), s4 = [], o4 = IDBKeyRange.only(n5.batchId);
    let _2 = 0;
    const a3 = r5.J({
      range: o4
    }, (e6, t5, n6) => (_2++, n6.delete()));
    s4.push(a3.next(() => {
      __PRIVATE_hardAssert(1 === _2);
    }));
    const u3 = [];
    for (const e6 of n5.mutations) {
      const r6 = __PRIVATE_newDbDocumentMutationKey(t4, e6.key.path, n5.batchId);
      s4.push(i4.delete(r6)), u3.push(e6.key);
    }
    return PersistencePromise.waitFor(s4).next(() => u3);
  }
  function __PRIVATE_dbDocumentSize(e5) {
    if (!e5) return 0;
    let t4;
    if (e5.document) t4 = e5.document;
    else if (e5.unknownDocument) t4 = e5.unknownDocument;
    else {
      if (!e5.noDocument) throw fail();
      t4 = e5.noDocument;
    }
    return JSON.stringify(t4).length;
  }
  LruParams.DEFAULT_COLLECTION_PERCENTILE = 10, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, LruParams.DEFAULT = new LruParams(41943040, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), LruParams.DISABLED = new LruParams(-1, 0, 0);
  var __PRIVATE_IndexedDbMutationQueue = class ___PRIVATE_IndexedDbMutationQueue {
    constructor(e5, t4, n5, r5) {
      this.userId = e5, this.serializer = t4, this.indexManager = n5, this.referenceDelegate = r5, /**
       * Caches the document keys for pending mutation batches. If the mutation
       * has been removed from IndexedDb, the cached value may continue to
       * be used to retrieve the batch's document keys. To remove a cached value
       * locally, `removeCachedMutationKeys()` should be invoked either directly
       * or through `removeMutationBatches()`.
       *
       * With multi-tab, when the primary client acknowledges or rejects a mutation,
       * this cache is used by secondary clients to invalidate the local
       * view of the documents that were previously affected by the mutation.
       */
      // PORTING NOTE: Multi-tab only.
      this.Cn = {};
    }
    /**
     * Creates a new mutation queue for the given user.
     * @param user - The user for which to create a mutation queue.
     * @param serializer - The serializer to use when persisting to IndexedDb.
     */
    static lt(e5, t4, n5, r5) {
      __PRIVATE_hardAssert("" !== e5.uid);
      const i4 = e5.isAuthenticated() ? e5.uid : "";
      return new ___PRIVATE_IndexedDbMutationQueue(i4, t4, n5, r5);
    }
    checkEmpty(e5) {
      let t4 = true;
      const n5 = IDBKeyRange.bound([this.userId, Number.NEGATIVE_INFINITY], [this.userId, Number.POSITIVE_INFINITY]);
      return __PRIVATE_mutationsStore(e5).J({
        index: "userMutationsIndex",
        range: n5
      }, (e6, n6, r5) => {
        t4 = false, r5.done();
      }).next(() => t4);
    }
    addMutationBatch(e5, t4, n5, r5) {
      const i4 = __PRIVATE_documentMutationsStore(e5), s4 = __PRIVATE_mutationsStore(e5);
      return s4.add({}).next((o4) => {
        __PRIVATE_hardAssert("number" == typeof o4);
        const _2 = new MutationBatch(o4, t4, n5, r5), a3 = function __PRIVATE_toDbMutationBatch(e6, t5, n6) {
          const r6 = n6.baseMutations.map((t6) => toMutation(e6.ct, t6)), i5 = n6.mutations.map((t6) => toMutation(e6.ct, t6));
          return {
            userId: t5,
            batchId: n6.batchId,
            localWriteTimeMs: n6.localWriteTime.toMillis(),
            baseMutations: r6,
            mutations: i5
          };
        }(this.serializer, this.userId, _2), u3 = [];
        let c4 = new SortedSet((e6, t5) => __PRIVATE_primitiveComparator(e6.canonicalString(), t5.canonicalString()));
        for (const e6 of r5) {
          const t5 = __PRIVATE_newDbDocumentMutationKey(this.userId, e6.key.path, o4);
          c4 = c4.add(e6.key.path.popLast()), u3.push(s4.put(a3)), u3.push(i4.put(t5, O));
        }
        return c4.forEach((t5) => {
          u3.push(this.indexManager.addToCollectionParentIndex(e5, t5));
        }), e5.addOnCommittedListener(() => {
          this.Cn[o4] = _2.keys();
        }), PersistencePromise.waitFor(u3).next(() => _2);
      });
    }
    lookupMutationBatch(e5, t4) {
      return __PRIVATE_mutationsStore(e5).get(t4).next((e6) => e6 ? (__PRIVATE_hardAssert(e6.userId === this.userId), __PRIVATE_fromDbMutationBatch(this.serializer, e6)) : null);
    }
    /**
     * Returns the document keys for the mutation batch with the given batchId.
     * For primary clients, this method returns `null` after
     * `removeMutationBatches()` has been called. Secondary clients return a
     * cached result until `removeCachedMutationKeys()` is invoked.
     */
    // PORTING NOTE: Multi-tab only.
    vn(e5, t4) {
      return this.Cn[t4] ? PersistencePromise.resolve(this.Cn[t4]) : this.lookupMutationBatch(e5, t4).next((e6) => {
        if (e6) {
          const n5 = e6.keys();
          return this.Cn[t4] = n5, n5;
        }
        return null;
      });
    }
    getNextMutationBatchAfterBatchId(e5, t4) {
      const n5 = t4 + 1, r5 = IDBKeyRange.lowerBound([this.userId, n5]);
      let i4 = null;
      return __PRIVATE_mutationsStore(e5).J({
        index: "userMutationsIndex",
        range: r5
      }, (e6, t5, r6) => {
        t5.userId === this.userId && (__PRIVATE_hardAssert(t5.batchId >= n5), i4 = __PRIVATE_fromDbMutationBatch(this.serializer, t5)), r6.done();
      }).next(() => i4);
    }
    getHighestUnacknowledgedBatchId(e5) {
      const t4 = IDBKeyRange.upperBound([this.userId, Number.POSITIVE_INFINITY]);
      let n5 = -1;
      return __PRIVATE_mutationsStore(e5).J({
        index: "userMutationsIndex",
        range: t4,
        reverse: true
      }, (e6, t5, r5) => {
        n5 = t5.batchId, r5.done();
      }).next(() => n5);
    }
    getAllMutationBatches(e5) {
      const t4 = IDBKeyRange.bound([this.userId, -1], [this.userId, Number.POSITIVE_INFINITY]);
      return __PRIVATE_mutationsStore(e5).U("userMutationsIndex", t4).next((e6) => e6.map((e7) => __PRIVATE_fromDbMutationBatch(this.serializer, e7)));
    }
    getAllMutationBatchesAffectingDocumentKey(e5, t4) {
      const n5 = __PRIVATE_newDbDocumentMutationPrefixForPath(this.userId, t4.path), r5 = IDBKeyRange.lowerBound(n5), i4 = [];
      return __PRIVATE_documentMutationsStore(e5).J({
        range: r5
      }, (n6, r6, s4) => {
        const [o4, _2, a3] = n6, u3 = __PRIVATE_decodeResourcePath(_2);
        if (o4 === this.userId && t4.path.isEqual(u3))
          return __PRIVATE_mutationsStore(e5).get(a3).next((e6) => {
            if (!e6) throw fail();
            __PRIVATE_hardAssert(e6.userId === this.userId), i4.push(__PRIVATE_fromDbMutationBatch(this.serializer, e6));
          });
        s4.done();
      }).next(() => i4);
    }
    getAllMutationBatchesAffectingDocumentKeys(e5, t4) {
      let n5 = new SortedSet(__PRIVATE_primitiveComparator);
      const r5 = [];
      return t4.forEach((t5) => {
        const i4 = __PRIVATE_newDbDocumentMutationPrefixForPath(this.userId, t5.path), s4 = IDBKeyRange.lowerBound(i4), o4 = __PRIVATE_documentMutationsStore(e5).J({
          range: s4
        }, (e6, r6, i5) => {
          const [s5, o5, _2] = e6, a3 = __PRIVATE_decodeResourcePath(o5);
          s5 === this.userId && t5.path.isEqual(a3) ? n5 = n5.add(_2) : i5.done();
        });
        r5.push(o4);
      }), PersistencePromise.waitFor(r5).next(() => this.Fn(e5, n5));
    }
    getAllMutationBatchesAffectingQuery(e5, t4) {
      const n5 = t4.path, r5 = n5.length + 1, i4 = __PRIVATE_newDbDocumentMutationPrefixForPath(this.userId, n5), s4 = IDBKeyRange.lowerBound(i4);
      let o4 = new SortedSet(__PRIVATE_primitiveComparator);
      return __PRIVATE_documentMutationsStore(e5).J({
        range: s4
      }, (e6, t5, i5) => {
        const [s5, _2, a3] = e6, u3 = __PRIVATE_decodeResourcePath(_2);
        s5 === this.userId && n5.isPrefixOf(u3) ? (
          // Rows with document keys more than one segment longer than the
          // query path can't be matches. For example, a query on 'rooms'
          // can't match the document /rooms/abc/messages/xyx.
          // TODO(mcg): we'll need a different scanner when we implement
          // ancestor queries.
          u3.length === r5 && (o4 = o4.add(a3))
        ) : i5.done();
      }).next(() => this.Fn(e5, o4));
    }
    Fn(e5, t4) {
      const n5 = [], r5 = [];
      return t4.forEach((t5) => {
        r5.push(__PRIVATE_mutationsStore(e5).get(t5).next((e6) => {
          if (null === e6) throw fail();
          __PRIVATE_hardAssert(e6.userId === this.userId), n5.push(__PRIVATE_fromDbMutationBatch(this.serializer, e6));
        }));
      }), PersistencePromise.waitFor(r5).next(() => n5);
    }
    removeMutationBatch(e5, t4) {
      return removeMutationBatch(e5._e, this.userId, t4).next((n5) => (e5.addOnCommittedListener(() => {
        this.Mn(t4.batchId);
      }), PersistencePromise.forEach(n5, (t5) => this.referenceDelegate.markPotentiallyOrphaned(e5, t5))));
    }
    /**
     * Clears the cached keys for a mutation batch. This method should be
     * called by secondary clients after they process mutation updates.
     *
     * Note that this method does not have to be called from primary clients as
     * the corresponding cache entries are cleared when an acknowledged or
     * rejected batch is removed from the mutation queue.
     */
    // PORTING NOTE: Multi-tab only
    Mn(e5) {
      delete this.Cn[e5];
    }
    performConsistencyCheck(e5) {
      return this.checkEmpty(e5).next((t4) => {
        if (!t4) return PersistencePromise.resolve();
        const n5 = IDBKeyRange.lowerBound(
          /**
          * Creates a [userId] key for use in the DbDocumentMutations index to iterate
          * over all of a user's document mutations.
          */
          /* @__PURE__ */ function __PRIVATE_newDbDocumentMutationPrefixForUser(e6) {
            return [e6];
          }(this.userId)
        ), r5 = [];
        return __PRIVATE_documentMutationsStore(e5).J({
          range: n5
        }, (e6, t5, n6) => {
          if (e6[0] === this.userId) {
            const t6 = __PRIVATE_decodeResourcePath(e6[1]);
            r5.push(t6);
          } else n6.done();
        }).next(() => {
          __PRIVATE_hardAssert(0 === r5.length);
        });
      });
    }
    containsKey(e5, t4) {
      return __PRIVATE_mutationQueueContainsKey(e5, this.userId, t4);
    }
    // PORTING NOTE: Multi-tab only (state is held in memory in other clients).
    /** Returns the mutation queue's metadata from IndexedDb. */
    xn(e5) {
      return __PRIVATE_mutationQueuesStore(e5).get(this.userId).next((e6) => e6 || {
        userId: this.userId,
        lastAcknowledgedBatchId: -1,
        lastStreamToken: ""
      });
    }
  };
  function __PRIVATE_mutationQueueContainsKey(e5, t4, n5) {
    const r5 = __PRIVATE_newDbDocumentMutationPrefixForPath(t4, n5.path), i4 = r5[1], s4 = IDBKeyRange.lowerBound(r5);
    let o4 = false;
    return __PRIVATE_documentMutationsStore(e5).J({
      range: s4,
      H: true
    }, (e6, n6, r6) => {
      const [
        s5,
        _2,
        /*batchID*/
        a3
      ] = e6;
      s5 === t4 && _2 === i4 && (o4 = true), r6.done();
    }).next(() => o4);
  }
  function __PRIVATE_mutationsStore(e5) {
    return __PRIVATE_getStore(e5, "mutations");
  }
  function __PRIVATE_documentMutationsStore(e5) {
    return __PRIVATE_getStore(e5, "documentMutations");
  }
  function __PRIVATE_mutationQueuesStore(e5) {
    return __PRIVATE_getStore(e5, "mutationQueues");
  }
  var __PRIVATE_TargetIdGenerator = class ___PRIVATE_TargetIdGenerator {
    constructor(e5) {
      this.On = e5;
    }
    next() {
      return this.On += 2, this.On;
    }
    static Nn() {
      return new ___PRIVATE_TargetIdGenerator(0);
    }
    static Ln() {
      return new ___PRIVATE_TargetIdGenerator(-1);
    }
  };
  var __PRIVATE_IndexedDbTargetCache = class {
    constructor(e5, t4) {
      this.referenceDelegate = e5, this.serializer = t4;
    }
    // PORTING NOTE: We don't cache global metadata for the target cache, since
    // some of it (in particular `highestTargetId`) can be modified by secondary
    // tabs. We could perhaps be more granular (and e.g. still cache
    // `lastRemoteSnapshotVersion` in memory) but for simplicity we currently go
    // to IndexedDb whenever we need to read metadata. We can revisit if it turns
    // out to have a meaningful performance impact.
    allocateTargetId(e5) {
      return this.Bn(e5).next((t4) => {
        const n5 = new __PRIVATE_TargetIdGenerator(t4.highestTargetId);
        return t4.highestTargetId = n5.next(), this.kn(e5, t4).next(() => t4.highestTargetId);
      });
    }
    getLastRemoteSnapshotVersion(e5) {
      return this.Bn(e5).next((e6) => SnapshotVersion.fromTimestamp(new Timestamp(e6.lastRemoteSnapshotVersion.seconds, e6.lastRemoteSnapshotVersion.nanoseconds)));
    }
    getHighestSequenceNumber(e5) {
      return this.Bn(e5).next((e6) => e6.highestListenSequenceNumber);
    }
    setTargetsMetadata(e5, t4, n5) {
      return this.Bn(e5).next((r5) => (r5.highestListenSequenceNumber = t4, n5 && (r5.lastRemoteSnapshotVersion = n5.toTimestamp()), t4 > r5.highestListenSequenceNumber && (r5.highestListenSequenceNumber = t4), this.kn(e5, r5)));
    }
    addTargetData(e5, t4) {
      return this.qn(e5, t4).next(() => this.Bn(e5).next((n5) => (n5.targetCount += 1, this.Qn(t4, n5), this.kn(e5, n5))));
    }
    updateTargetData(e5, t4) {
      return this.qn(e5, t4);
    }
    removeTargetData(e5, t4) {
      return this.removeMatchingKeysForTargetId(e5, t4.targetId).next(() => __PRIVATE_targetsStore(e5).delete(t4.targetId)).next(() => this.Bn(e5)).next((t5) => (__PRIVATE_hardAssert(t5.targetCount > 0), t5.targetCount -= 1, this.kn(e5, t5)));
    }
    /**
     * Drops any targets with sequence number less than or equal to the upper bound, excepting those
     * present in `activeTargetIds`. Document associations for the removed targets are also removed.
     * Returns the number of targets removed.
     */
    removeTargets(e5, t4, n5) {
      let r5 = 0;
      const i4 = [];
      return __PRIVATE_targetsStore(e5).J((s4, o4) => {
        const _2 = __PRIVATE_fromDbTarget(o4);
        _2.sequenceNumber <= t4 && null === n5.get(_2.targetId) && (r5++, i4.push(this.removeTargetData(e5, _2)));
      }).next(() => PersistencePromise.waitFor(i4)).next(() => r5);
    }
    /**
     * Call provided function with each `TargetData` that we have cached.
     */
    forEachTarget(e5, t4) {
      return __PRIVATE_targetsStore(e5).J((e6, n5) => {
        const r5 = __PRIVATE_fromDbTarget(n5);
        t4(r5);
      });
    }
    Bn(e5) {
      return __PRIVATE_globalTargetStore(e5).get("targetGlobalKey").next((e6) => (__PRIVATE_hardAssert(null !== e6), e6));
    }
    kn(e5, t4) {
      return __PRIVATE_globalTargetStore(e5).put("targetGlobalKey", t4);
    }
    qn(e5, t4) {
      return __PRIVATE_targetsStore(e5).put(__PRIVATE_toDbTarget(this.serializer, t4));
    }
    /**
     * In-place updates the provided metadata to account for values in the given
     * TargetData. Saving is done separately. Returns true if there were any
     * changes to the metadata.
     */
    Qn(e5, t4) {
      let n5 = false;
      return e5.targetId > t4.highestTargetId && (t4.highestTargetId = e5.targetId, n5 = true), e5.sequenceNumber > t4.highestListenSequenceNumber && (t4.highestListenSequenceNumber = e5.sequenceNumber, n5 = true), n5;
    }
    getTargetCount(e5) {
      return this.Bn(e5).next((e6) => e6.targetCount);
    }
    getTargetData(e5, t4) {
      const n5 = __PRIVATE_canonifyTarget(t4), r5 = IDBKeyRange.bound([n5, Number.NEGATIVE_INFINITY], [n5, Number.POSITIVE_INFINITY]);
      let i4 = null;
      return __PRIVATE_targetsStore(e5).J({
        range: r5,
        index: "queryTargetsIndex"
      }, (e6, n6, r6) => {
        const s4 = __PRIVATE_fromDbTarget(n6);
        __PRIVATE_targetEquals(t4, s4.target) && (i4 = s4, r6.done());
      }).next(() => i4);
    }
    addMatchingKeys(e5, t4, n5) {
      const r5 = [], i4 = __PRIVATE_documentTargetStore(e5);
      return t4.forEach((t5) => {
        const s4 = __PRIVATE_encodeResourcePath(t5.path);
        r5.push(i4.put({
          targetId: n5,
          path: s4
        })), r5.push(this.referenceDelegate.addReference(e5, n5, t5));
      }), PersistencePromise.waitFor(r5);
    }
    removeMatchingKeys(e5, t4, n5) {
      const r5 = __PRIVATE_documentTargetStore(e5);
      return PersistencePromise.forEach(t4, (t5) => {
        const i4 = __PRIVATE_encodeResourcePath(t5.path);
        return PersistencePromise.waitFor([r5.delete([n5, i4]), this.referenceDelegate.removeReference(e5, n5, t5)]);
      });
    }
    removeMatchingKeysForTargetId(e5, t4) {
      const n5 = __PRIVATE_documentTargetStore(e5), r5 = IDBKeyRange.bound(
        [t4],
        [t4 + 1],
        /*lowerOpen=*/
        false,
        /*upperOpen=*/
        true
      );
      return n5.delete(r5);
    }
    getMatchingKeysForTargetId(e5, t4) {
      const n5 = IDBKeyRange.bound(
        [t4],
        [t4 + 1],
        /*lowerOpen=*/
        false,
        /*upperOpen=*/
        true
      ), r5 = __PRIVATE_documentTargetStore(e5);
      let i4 = __PRIVATE_documentKeySet();
      return r5.J({
        range: n5,
        H: true
      }, (e6, t5, n6) => {
        const r6 = __PRIVATE_decodeResourcePath(e6[1]), s4 = new DocumentKey(r6);
        i4 = i4.add(s4);
      }).next(() => i4);
    }
    containsKey(e5, t4) {
      const n5 = __PRIVATE_encodeResourcePath(t4.path), r5 = IDBKeyRange.bound(
        [n5],
        [__PRIVATE_immediateSuccessor(n5)],
        /*lowerOpen=*/
        false,
        /*upperOpen=*/
        true
      );
      let i4 = 0;
      return __PRIVATE_documentTargetStore(e5).J({
        index: "documentTargetsIndex",
        H: true,
        range: r5
      }, ([e6, t5], n6, r6) => {
        0 !== e6 && (i4++, r6.done());
      }).next(() => i4 > 0);
    }
    /**
     * Looks up a TargetData entry by target ID.
     *
     * @param targetId - The target ID of the TargetData entry to look up.
     * @returns The cached TargetData entry, or null if the cache has no entry for
     * the target.
     */
    // PORTING NOTE: Multi-tab only.
    ot(e5, t4) {
      return __PRIVATE_targetsStore(e5).get(t4).next((e6) => e6 ? __PRIVATE_fromDbTarget(e6) : null);
    }
  };
  function __PRIVATE_targetsStore(e5) {
    return __PRIVATE_getStore(e5, "targets");
  }
  function __PRIVATE_globalTargetStore(e5) {
    return __PRIVATE_getStore(e5, "targetGlobal");
  }
  function __PRIVATE_documentTargetStore(e5) {
    return __PRIVATE_getStore(e5, "targetDocuments");
  }
  function __PRIVATE_bufferEntryComparator([e5, t4], [n5, r5]) {
    const i4 = __PRIVATE_primitiveComparator(e5, n5);
    return 0 === i4 ? __PRIVATE_primitiveComparator(t4, r5) : i4;
  }
  var __PRIVATE_RollingSequenceNumberBuffer = class {
    constructor(e5) {
      this.Kn = e5, this.buffer = new SortedSet(__PRIVATE_bufferEntryComparator), this.$n = 0;
    }
    Un() {
      return ++this.$n;
    }
    Wn(e5) {
      const t4 = [e5, this.Un()];
      if (this.buffer.size < this.Kn) this.buffer = this.buffer.add(t4);
      else {
        const e6 = this.buffer.last();
        __PRIVATE_bufferEntryComparator(t4, e6) < 0 && (this.buffer = this.buffer.delete(e6).add(t4));
      }
    }
    get maxValue() {
      return this.buffer.last()[0];
    }
  };
  var __PRIVATE_LruScheduler = class {
    constructor(e5, t4, n5) {
      this.garbageCollector = e5, this.asyncQueue = t4, this.localStore = n5, this.Gn = null;
    }
    start() {
      -1 !== this.garbageCollector.params.cacheSizeCollectionThreshold && this.zn(6e4);
    }
    stop() {
      this.Gn && (this.Gn.cancel(), this.Gn = null);
    }
    get started() {
      return null !== this.Gn;
    }
    zn(e5) {
      __PRIVATE_logDebug("LruGarbageCollector", `Garbage collection scheduled in ${e5}ms`), this.Gn = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection", e5, async () => {
        this.Gn = null;
        try {
          await this.localStore.collectGarbage(this.garbageCollector);
        } catch (e6) {
          __PRIVATE_isIndexedDbTransactionError(e6) ? __PRIVATE_logDebug("LruGarbageCollector", "Ignoring IndexedDB error during garbage collection: ", e6) : await __PRIVATE_ignoreIfPrimaryLeaseLoss(e6);
        }
        await this.zn(3e5);
      });
    }
  };
  var __PRIVATE_LruGarbageCollectorImpl = class {
    constructor(e5, t4) {
      this.jn = e5, this.params = t4;
    }
    calculateTargetCount(e5, t4) {
      return this.jn.Hn(e5).next((e6) => Math.floor(t4 / 100 * e6));
    }
    nthSequenceNumber(e5, t4) {
      if (0 === t4) return PersistencePromise.resolve(__PRIVATE_ListenSequence.oe);
      const n5 = new __PRIVATE_RollingSequenceNumberBuffer(t4);
      return this.jn.forEachTarget(e5, (e6) => n5.Wn(e6.sequenceNumber)).next(() => this.jn.Jn(e5, (e6) => n5.Wn(e6))).next(() => n5.maxValue);
    }
    removeTargets(e5, t4, n5) {
      return this.jn.removeTargets(e5, t4, n5);
    }
    removeOrphanedDocuments(e5, t4) {
      return this.jn.removeOrphanedDocuments(e5, t4);
    }
    collect(e5, t4) {
      return -1 === this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", "Garbage collection skipped; disabled"), PersistencePromise.resolve(Ae)) : this.getCacheSize(e5).next((n5) => n5 < this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", `Garbage collection skipped; Cache size ${n5} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), Ae) : this.Yn(e5, t4));
    }
    getCacheSize(e5) {
      return this.jn.getCacheSize(e5);
    }
    Yn(e5, t4) {
      let n5, r5, i4, s4, o4, a3, u3;
      const c4 = Date.now();
      return this.calculateTargetCount(e5, this.params.percentileToCollect).next((t5) => (
        // Cap at the configured max
        (t5 > this.params.maximumSequenceNumbersToCollect ? (__PRIVATE_logDebug("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t5}`), r5 = this.params.maximumSequenceNumbersToCollect) : r5 = t5, s4 = Date.now(), this.nthSequenceNumber(e5, r5))
      )).next((r6) => (n5 = r6, o4 = Date.now(), this.removeTargets(e5, n5, t4))).next((t5) => (i4 = t5, a3 = Date.now(), this.removeOrphanedDocuments(e5, n5))).next((e6) => {
        if (u3 = Date.now(), __PRIVATE_getLogLevel() <= LogLevel.DEBUG) {
          __PRIVATE_logDebug("LruGarbageCollector", `LRU Garbage Collection
	Counted targets in ${s4 - c4}ms
	Determined least recently used ${r5} in ` + (o4 - s4) + `ms
	Removed ${i4} targets in ` + (a3 - o4) + `ms
	Removed ${e6} documents in ` + (u3 - a3) + `ms
Total Duration: ${u3 - c4}ms`);
        }
        return PersistencePromise.resolve({
          didRun: true,
          sequenceNumbersCollected: r5,
          targetsRemoved: i4,
          documentsRemoved: e6
        });
      });
    }
  };
  function __PRIVATE_newLruGarbageCollector(e5, t4) {
    return new __PRIVATE_LruGarbageCollectorImpl(e5, t4);
  }
  var __PRIVATE_IndexedDbLruDelegateImpl = class {
    constructor(e5, t4) {
      this.db = e5, this.garbageCollector = __PRIVATE_newLruGarbageCollector(this, t4);
    }
    Hn(e5) {
      const t4 = this.Zn(e5);
      return this.db.getTargetCache().getTargetCount(e5).next((e6) => t4.next((t5) => e6 + t5));
    }
    Zn(e5) {
      let t4 = 0;
      return this.Jn(e5, (e6) => {
        t4++;
      }).next(() => t4);
    }
    forEachTarget(e5, t4) {
      return this.db.getTargetCache().forEachTarget(e5, t4);
    }
    Jn(e5, t4) {
      return this.Xn(e5, (e6, n5) => t4(n5));
    }
    addReference(e5, t4, n5) {
      return __PRIVATE_writeSentinelKey(e5, n5);
    }
    removeReference(e5, t4, n5) {
      return __PRIVATE_writeSentinelKey(e5, n5);
    }
    removeTargets(e5, t4, n5) {
      return this.db.getTargetCache().removeTargets(e5, t4, n5);
    }
    markPotentiallyOrphaned(e5, t4) {
      return __PRIVATE_writeSentinelKey(e5, t4);
    }
    /**
     * Returns true if anything would prevent this document from being garbage
     * collected, given that the document in question is not present in any
     * targets and has a sequence number less than or equal to the upper bound for
     * the collection run.
     */
    er(e5, t4) {
      return function __PRIVATE_mutationQueuesContainKey(e6, t5) {
        let n5 = false;
        return __PRIVATE_mutationQueuesStore(e6).Y((r5) => __PRIVATE_mutationQueueContainsKey(e6, r5, t5).next((e7) => (e7 && (n5 = true), PersistencePromise.resolve(!e7)))).next(() => n5);
      }(e5, t4);
    }
    removeOrphanedDocuments(e5, t4) {
      const n5 = this.db.getRemoteDocumentCache().newChangeBuffer(), r5 = [];
      let i4 = 0;
      return this.Xn(e5, (s4, o4) => {
        if (o4 <= t4) {
          const t5 = this.er(e5, s4).next((t6) => {
            if (!t6)
              return i4++, n5.getEntry(e5, s4).next(() => (n5.removeEntry(s4, SnapshotVersion.min()), __PRIVATE_documentTargetStore(e5).delete(function __PRIVATE_sentinelKey$1(e6) {
                return [0, __PRIVATE_encodeResourcePath(e6.path)];
              }(s4))));
          });
          r5.push(t5);
        }
      }).next(() => PersistencePromise.waitFor(r5)).next(() => n5.apply(e5)).next(() => i4);
    }
    removeTarget(e5, t4) {
      const n5 = t4.withSequenceNumber(e5.currentSequenceNumber);
      return this.db.getTargetCache().updateTargetData(e5, n5);
    }
    updateLimboDocument(e5, t4) {
      return __PRIVATE_writeSentinelKey(e5, t4);
    }
    /**
     * Call provided function for each document in the cache that is 'orphaned'. Orphaned
     * means not a part of any target, so the only entry in the target-document index for
     * that document will be the sentinel row (targetId 0), which will also have the sequence
     * number for the last time the document was accessed.
     */
    Xn(e5, t4) {
      const n5 = __PRIVATE_documentTargetStore(e5);
      let r5, i4 = __PRIVATE_ListenSequence.oe;
      return n5.J({
        index: "documentTargetsIndex"
      }, ([e6, n6], { path: s4, sequenceNumber: o4 }) => {
        0 === e6 ? (
          // if nextToReport is valid, report it, this is a new key so the
          // last one must not be a member of any targets.
          (i4 !== __PRIVATE_ListenSequence.oe && t4(new DocumentKey(__PRIVATE_decodeResourcePath(r5)), i4), // set nextToReport to be this sequence number. It's the next one we
          // might report, if we don't find any targets for this document.
          // Note that the sequence number must be defined when the targetId
          // is 0.
          i4 = o4, r5 = s4)
        ) : (
          // set nextToReport to be invalid, we know we don't need to report
          // this one since we found a target for it.
          i4 = __PRIVATE_ListenSequence.oe
        );
      }).next(() => {
        i4 !== __PRIVATE_ListenSequence.oe && t4(new DocumentKey(__PRIVATE_decodeResourcePath(r5)), i4);
      });
    }
    getCacheSize(e5) {
      return this.db.getRemoteDocumentCache().getSize(e5);
    }
  };
  function __PRIVATE_writeSentinelKey(e5, t4) {
    return __PRIVATE_documentTargetStore(e5).put(function __PRIVATE_sentinelRow(e6, t5) {
      return {
        targetId: 0,
        path: __PRIVATE_encodeResourcePath(e6.path),
        sequenceNumber: t5
      };
    }(t4, e5.currentSequenceNumber));
  }
  var RemoteDocumentChangeBuffer = class {
    constructor() {
      this.changes = new ObjectMap((e5) => e5.toString(), (e5, t4) => e5.isEqual(t4)), this.changesApplied = false;
    }
    /**
     * Buffers a `RemoteDocumentCache.addEntry()` call.
     *
     * You can only modify documents that have already been retrieved via
     * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
     */
    addEntry(e5) {
      this.assertNotApplied(), this.changes.set(e5.key, e5);
    }
    /**
     * Buffers a `RemoteDocumentCache.removeEntry()` call.
     *
     * You can only remove documents that have already been retrieved via
     * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
     */
    removeEntry(e5, t4) {
      this.assertNotApplied(), this.changes.set(e5, MutableDocument.newInvalidDocument(e5).setReadTime(t4));
    }
    /**
     * Looks up an entry in the cache. The buffered changes will first be checked,
     * and if no buffered change applies, this will forward to
     * `RemoteDocumentCache.getEntry()`.
     *
     * @param transaction - The transaction in which to perform any persistence
     *     operations.
     * @param documentKey - The key of the entry to look up.
     * @returns The cached document or an invalid document if we have nothing
     * cached.
     */
    getEntry(e5, t4) {
      this.assertNotApplied();
      const n5 = this.changes.get(t4);
      return void 0 !== n5 ? PersistencePromise.resolve(n5) : this.getFromCache(e5, t4);
    }
    /**
     * Looks up several entries in the cache, forwarding to
     * `RemoteDocumentCache.getEntry()`.
     *
     * @param transaction - The transaction in which to perform any persistence
     *     operations.
     * @param documentKeys - The keys of the entries to look up.
     * @returns A map of cached documents, indexed by key. If an entry cannot be
     *     found, the corresponding key will be mapped to an invalid document.
     */
    getEntries(e5, t4) {
      return this.getAllFromCache(e5, t4);
    }
    /**
     * Applies buffered changes to the underlying RemoteDocumentCache, using
     * the provided transaction.
     */
    apply(e5) {
      return this.assertNotApplied(), this.changesApplied = true, this.applyChanges(e5);
    }
    /** Helper to assert this.changes is not null  */
    assertNotApplied() {
    }
  };
  var __PRIVATE_IndexedDbRemoteDocumentCacheImpl = class {
    constructor(e5) {
      this.serializer = e5;
    }
    setIndexManager(e5) {
      this.indexManager = e5;
    }
    /**
     * Adds the supplied entries to the cache.
     *
     * All calls of `addEntry` are required to go through the RemoteDocumentChangeBuffer
     * returned by `newChangeBuffer()` to ensure proper accounting of metadata.
     */
    addEntry(e5, t4, n5) {
      return __PRIVATE_remoteDocumentsStore(e5).put(n5);
    }
    /**
     * Removes a document from the cache.
     *
     * All calls of `removeEntry`  are required to go through the RemoteDocumentChangeBuffer
     * returned by `newChangeBuffer()` to ensure proper accounting of metadata.
     */
    removeEntry(e5, t4, n5) {
      return __PRIVATE_remoteDocumentsStore(e5).delete(
        /**
        * Returns a key that can be used for document lookups via the primary key of
        * the DbRemoteDocument object store.
        */
        function __PRIVATE_dbReadTimeKey(e6, t5) {
          const n6 = e6.path.toArray();
          return [
            /* prefix path */
            n6.slice(0, n6.length - 2),
            /* collection id */
            n6[n6.length - 2],
            __PRIVATE_toDbTimestampKey(t5),
            /* document id */
            n6[n6.length - 1]
          ];
        }(t4, n5)
      );
    }
    /**
     * Updates the current cache size.
     *
     * Callers to `addEntry()` and `removeEntry()` *must* call this afterwards to update the
     * cache's metadata.
     */
    updateMetadata(e5, t4) {
      return this.getMetadata(e5).next((n5) => (n5.byteSize += t4, this.tr(e5, n5)));
    }
    getEntry(e5, t4) {
      let n5 = MutableDocument.newInvalidDocument(t4);
      return __PRIVATE_remoteDocumentsStore(e5).J({
        index: "documentKeyIndex",
        range: IDBKeyRange.only(__PRIVATE_dbKey(t4))
      }, (e6, r5) => {
        n5 = this.nr(t4, r5);
      }).next(() => n5);
    }
    /**
     * Looks up an entry in the cache.
     *
     * @param documentKey - The key of the entry to look up.
     * @returns The cached document entry and its size.
     */
    rr(e5, t4) {
      let n5 = {
        size: 0,
        document: MutableDocument.newInvalidDocument(t4)
      };
      return __PRIVATE_remoteDocumentsStore(e5).J({
        index: "documentKeyIndex",
        range: IDBKeyRange.only(__PRIVATE_dbKey(t4))
      }, (e6, r5) => {
        n5 = {
          document: this.nr(t4, r5),
          size: __PRIVATE_dbDocumentSize(r5)
        };
      }).next(() => n5);
    }
    getEntries(e5, t4) {
      let n5 = __PRIVATE_mutableDocumentMap();
      return this.ir(e5, t4, (e6, t5) => {
        const r5 = this.nr(e6, t5);
        n5 = n5.insert(e6, r5);
      }).next(() => n5);
    }
    /**
     * Looks up several entries in the cache.
     *
     * @param documentKeys - The set of keys entries to look up.
     * @returns A map of documents indexed by key and a map of sizes indexed by
     *     key (zero if the document does not exist).
     */
    sr(e5, t4) {
      let n5 = __PRIVATE_mutableDocumentMap(), r5 = new SortedMap(DocumentKey.comparator);
      return this.ir(e5, t4, (e6, t5) => {
        const i4 = this.nr(e6, t5);
        n5 = n5.insert(e6, i4), r5 = r5.insert(e6, __PRIVATE_dbDocumentSize(t5));
      }).next(() => ({
        documents: n5,
        _r: r5
      }));
    }
    ir(e5, t4, n5) {
      if (t4.isEmpty()) return PersistencePromise.resolve();
      let r5 = new SortedSet(__PRIVATE_dbKeyComparator);
      t4.forEach((e6) => r5 = r5.add(e6));
      const i4 = IDBKeyRange.bound(__PRIVATE_dbKey(r5.first()), __PRIVATE_dbKey(r5.last())), s4 = r5.getIterator();
      let o4 = s4.getNext();
      return __PRIVATE_remoteDocumentsStore(e5).J({
        index: "documentKeyIndex",
        range: i4
      }, (e6, t5, r6) => {
        const i5 = DocumentKey.fromSegments([...t5.prefixPath, t5.collectionGroup, t5.documentId]);
        for (; o4 && __PRIVATE_dbKeyComparator(o4, i5) < 0; ) n5(o4, null), o4 = s4.getNext();
        o4 && o4.isEqual(i5) && // Key found in cache.
        (n5(o4, t5), o4 = s4.hasNext() ? s4.getNext() : null), // Skip to the next key (if there is one).
        o4 ? r6.$(__PRIVATE_dbKey(o4)) : r6.done();
      }).next(() => {
        for (; o4; ) n5(o4, null), o4 = s4.hasNext() ? s4.getNext() : null;
      });
    }
    getDocumentsMatchingQuery(e5, t4, n5, r5, i4) {
      const s4 = t4.path, o4 = [s4.popLast().toArray(), s4.lastSegment(), __PRIVATE_toDbTimestampKey(n5.readTime), n5.documentKey.path.isEmpty() ? "" : n5.documentKey.path.lastSegment()], _2 = [s4.popLast().toArray(), s4.lastSegment(), [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], ""];
      return __PRIVATE_remoteDocumentsStore(e5).U(IDBKeyRange.bound(o4, _2, true)).next((e6) => {
        null == i4 || i4.incrementDocumentReadCount(e6.length);
        let n6 = __PRIVATE_mutableDocumentMap();
        for (const i5 of e6) {
          const e7 = this.nr(DocumentKey.fromSegments(i5.prefixPath.concat(i5.collectionGroup, i5.documentId)), i5);
          e7.isFoundDocument() && (__PRIVATE_queryMatches(t4, e7) || r5.has(e7.key)) && // Either the document matches the given query, or it is mutated.
          (n6 = n6.insert(e7.key, e7));
        }
        return n6;
      });
    }
    getAllFromCollectionGroup(e5, t4, n5, r5) {
      let i4 = __PRIVATE_mutableDocumentMap();
      const s4 = __PRIVATE_dbCollectionGroupKey(t4, n5), o4 = __PRIVATE_dbCollectionGroupKey(t4, IndexOffset.max());
      return __PRIVATE_remoteDocumentsStore(e5).J({
        index: "collectionGroupIndex",
        range: IDBKeyRange.bound(s4, o4, true)
      }, (e6, t5, n6) => {
        const s5 = this.nr(DocumentKey.fromSegments(t5.prefixPath.concat(t5.collectionGroup, t5.documentId)), t5);
        i4 = i4.insert(s5.key, s5), i4.size === r5 && n6.done();
      }).next(() => i4);
    }
    newChangeBuffer(e5) {
      return new __PRIVATE_IndexedDbRemoteDocumentChangeBuffer(this, !!e5 && e5.trackRemovals);
    }
    getSize(e5) {
      return this.getMetadata(e5).next((e6) => e6.byteSize);
    }
    getMetadata(e5) {
      return __PRIVATE_documentGlobalStore(e5).get("remoteDocumentGlobalKey").next((e6) => (__PRIVATE_hardAssert(!!e6), e6));
    }
    tr(e5, t4) {
      return __PRIVATE_documentGlobalStore(e5).put("remoteDocumentGlobalKey", t4);
    }
    /**
     * Decodes `dbRemoteDoc` and returns the document (or an invalid document if
     * the document corresponds to the format used for sentinel deletes).
     */
    nr(e5, t4) {
      if (t4) {
        const e6 = __PRIVATE_fromDbRemoteDocument(this.serializer, t4);
        if (!(e6.isNoDocument() && e6.version.isEqual(SnapshotVersion.min()))) return e6;
      }
      return MutableDocument.newInvalidDocument(e5);
    }
  };
  function __PRIVATE_newIndexedDbRemoteDocumentCache(e5) {
    return new __PRIVATE_IndexedDbRemoteDocumentCacheImpl(e5);
  }
  var __PRIVATE_IndexedDbRemoteDocumentChangeBuffer = class extends RemoteDocumentChangeBuffer {
    /**
     * @param documentCache - The IndexedDbRemoteDocumentCache to apply the changes to.
     * @param trackRemovals - Whether to create sentinel deletes that can be tracked by
     * `getNewDocumentChanges()`.
     */
    constructor(e5, t4) {
      super(), this.ar = e5, this.trackRemovals = t4, // A map of document sizes and read times prior to applying the changes in
      // this buffer.
      this.ur = new ObjectMap((e6) => e6.toString(), (e6, t5) => e6.isEqual(t5));
    }
    applyChanges(e5) {
      const t4 = [];
      let n5 = 0, r5 = new SortedSet((e6, t5) => __PRIVATE_primitiveComparator(e6.canonicalString(), t5.canonicalString()));
      return this.changes.forEach((i4, s4) => {
        const o4 = this.ur.get(i4);
        if (t4.push(this.ar.removeEntry(e5, i4, o4.readTime)), s4.isValidDocument()) {
          const _2 = __PRIVATE_toDbRemoteDocument(this.ar.serializer, s4);
          r5 = r5.add(i4.path.popLast());
          const a3 = __PRIVATE_dbDocumentSize(_2);
          n5 += a3 - o4.size, t4.push(this.ar.addEntry(e5, i4, _2));
        } else if (n5 -= o4.size, this.trackRemovals) {
          const n6 = __PRIVATE_toDbRemoteDocument(this.ar.serializer, s4.convertToNoDocument(SnapshotVersion.min()));
          t4.push(this.ar.addEntry(e5, i4, n6));
        }
      }), r5.forEach((n6) => {
        t4.push(this.ar.indexManager.addToCollectionParentIndex(e5, n6));
      }), t4.push(this.ar.updateMetadata(e5, n5)), PersistencePromise.waitFor(t4);
    }
    getFromCache(e5, t4) {
      return this.ar.rr(e5, t4).next((e6) => (this.ur.set(t4, {
        size: e6.size,
        readTime: e6.document.readTime
      }), e6.document));
    }
    getAllFromCache(e5, t4) {
      return this.ar.sr(e5, t4).next(({ documents: e6, _r: t5 }) => (
        // Note: `getAllFromCache` returns two maps instead of a single map from
        // keys to `DocumentSizeEntry`s. This is to allow returning the
        // `MutableDocumentMap` directly, without a conversion.
        (t5.forEach((t6, n5) => {
          this.ur.set(t6, {
            size: n5,
            readTime: e6.get(t6).readTime
          });
        }), e6)
      ));
    }
  };
  function __PRIVATE_documentGlobalStore(e5) {
    return __PRIVATE_getStore(e5, "remoteDocumentGlobal");
  }
  function __PRIVATE_remoteDocumentsStore(e5) {
    return __PRIVATE_getStore(e5, "remoteDocumentsV14");
  }
  function __PRIVATE_dbKey(e5) {
    const t4 = e5.path.toArray();
    return [
      /* prefix path */
      t4.slice(0, t4.length - 2),
      /* collection id */
      t4[t4.length - 2],
      /* document id */
      t4[t4.length - 1]
    ];
  }
  function __PRIVATE_dbCollectionGroupKey(e5, t4) {
    const n5 = t4.documentKey.path.toArray();
    return [
      /* collection id */
      e5,
      __PRIVATE_toDbTimestampKey(t4.readTime),
      /* prefix path */
      n5.slice(0, n5.length - 2),
      /* document id */
      n5.length > 0 ? n5[n5.length - 1] : ""
    ];
  }
  function __PRIVATE_dbKeyComparator(e5, t4) {
    const n5 = e5.path.toArray(), r5 = t4.path.toArray();
    let i4 = 0;
    for (let e6 = 0; e6 < n5.length - 2 && e6 < r5.length - 2; ++e6) if (i4 = __PRIVATE_primitiveComparator(n5[e6], r5[e6]), i4) return i4;
    return i4 = __PRIVATE_primitiveComparator(n5.length, r5.length), i4 || (i4 = __PRIVATE_primitiveComparator(n5[n5.length - 2], r5[r5.length - 2]), i4 || __PRIVATE_primitiveComparator(n5[n5.length - 1], r5[r5.length - 1]));
  }
  var OverlayedDocument = class {
    constructor(e5, t4) {
      this.overlayedDocument = e5, this.mutatedFields = t4;
    }
  };
  var LocalDocumentsView = class {
    constructor(e5, t4, n5, r5) {
      this.remoteDocumentCache = e5, this.mutationQueue = t4, this.documentOverlayCache = n5, this.indexManager = r5;
    }
    /**
     * Get the local view of the document identified by `key`.
     *
     * @returns Local view of the document or null if we don't have any cached
     * state for it.
     */
    getDocument(e5, t4) {
      let n5 = null;
      return this.documentOverlayCache.getOverlay(e5, t4).next((r5) => (n5 = r5, this.remoteDocumentCache.getEntry(e5, t4))).next((e6) => (null !== n5 && __PRIVATE_mutationApplyToLocalView(n5.mutation, e6, FieldMask.empty(), Timestamp.now()), e6));
    }
    /**
     * Gets the local view of the documents identified by `keys`.
     *
     * If we don't have cached state for a document in `keys`, a NoDocument will
     * be stored for that key in the resulting set.
     */
    getDocuments(e5, t4) {
      return this.remoteDocumentCache.getEntries(e5, t4).next((t5) => this.getLocalViewOfDocuments(e5, t5, __PRIVATE_documentKeySet()).next(() => t5));
    }
    /**
     * Similar to `getDocuments`, but creates the local view from the given
     * `baseDocs` without retrieving documents from the local store.
     *
     * @param transaction - The transaction this operation is scoped to.
     * @param docs - The documents to apply local mutations to get the local views.
     * @param existenceStateChanged - The set of document keys whose existence state
     *   is changed. This is useful to determine if some documents overlay needs
     *   to be recalculated.
     */
    getLocalViewOfDocuments(e5, t4, n5 = __PRIVATE_documentKeySet()) {
      const r5 = __PRIVATE_newOverlayMap();
      return this.populateOverlays(e5, r5, t4).next(() => this.computeViews(e5, t4, r5, n5).next((e6) => {
        let t5 = documentMap();
        return e6.forEach((e7, n6) => {
          t5 = t5.insert(e7, n6.overlayedDocument);
        }), t5;
      }));
    }
    /**
     * Gets the overlayed documents for the given document map, which will include
     * the local view of those documents and a `FieldMask` indicating which fields
     * are mutated locally, `null` if overlay is a Set or Delete mutation.
     */
    getOverlayedDocuments(e5, t4) {
      const n5 = __PRIVATE_newOverlayMap();
      return this.populateOverlays(e5, n5, t4).next(() => this.computeViews(e5, t4, n5, __PRIVATE_documentKeySet()));
    }
    /**
     * Fetches the overlays for {@code docs} and adds them to provided overlay map
     * if the map does not already contain an entry for the given document key.
     */
    populateOverlays(e5, t4, n5) {
      const r5 = [];
      return n5.forEach((e6) => {
        t4.has(e6) || r5.push(e6);
      }), this.documentOverlayCache.getOverlays(e5, r5).next((e6) => {
        e6.forEach((e7, n6) => {
          t4.set(e7, n6);
        });
      });
    }
    /**
     * Computes the local view for the given documents.
     *
     * @param docs - The documents to compute views for. It also has the base
     *   version of the documents.
     * @param overlays - The overlays that need to be applied to the given base
     *   version of the documents.
     * @param existenceStateChanged - A set of documents whose existence states
     *   might have changed. This is used to determine if we need to re-calculate
     *   overlays from mutation queues.
     * @return A map represents the local documents view.
     */
    computeViews(e5, t4, n5, r5) {
      let i4 = __PRIVATE_mutableDocumentMap();
      const s4 = __PRIVATE_newDocumentKeyMap(), o4 = function __PRIVATE_newOverlayedDocumentMap() {
        return __PRIVATE_newDocumentKeyMap();
      }();
      return t4.forEach((e6, t5) => {
        const o5 = n5.get(t5.key);
        r5.has(t5.key) && (void 0 === o5 || o5.mutation instanceof __PRIVATE_PatchMutation) ? i4 = i4.insert(t5.key, t5) : void 0 !== o5 ? (s4.set(t5.key, o5.mutation.getFieldMask()), __PRIVATE_mutationApplyToLocalView(o5.mutation, t5, o5.mutation.getFieldMask(), Timestamp.now())) : (
          // no overlay exists
          // Using EMPTY to indicate there is no overlay for the document.
          s4.set(t5.key, FieldMask.empty())
        );
      }), this.recalculateAndSaveOverlays(e5, i4).next((e6) => (e6.forEach((e7, t5) => s4.set(e7, t5)), t4.forEach((e7, t5) => {
        var n6;
        return o4.set(e7, new OverlayedDocument(t5, null !== (n6 = s4.get(e7)) && void 0 !== n6 ? n6 : null));
      }), o4));
    }
    recalculateAndSaveOverlays(e5, t4) {
      const n5 = __PRIVATE_newDocumentKeyMap();
      let r5 = new SortedMap((e6, t5) => e6 - t5), i4 = __PRIVATE_documentKeySet();
      return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e5, t4).next((e6) => {
        for (const i5 of e6) i5.keys().forEach((e7) => {
          const s4 = t4.get(e7);
          if (null === s4) return;
          let o4 = n5.get(e7) || FieldMask.empty();
          o4 = i5.applyToLocalView(s4, o4), n5.set(e7, o4);
          const _2 = (r5.get(i5.batchId) || __PRIVATE_documentKeySet()).add(e7);
          r5 = r5.insert(i5.batchId, _2);
        });
      }).next(() => {
        const s4 = [], o4 = r5.getReverseIterator();
        for (; o4.hasNext(); ) {
          const r6 = o4.getNext(), _2 = r6.key, a3 = r6.value, u3 = __PRIVATE_newMutationMap();
          a3.forEach((e6) => {
            if (!i4.has(e6)) {
              const r7 = __PRIVATE_calculateOverlayMutation(t4.get(e6), n5.get(e6));
              null !== r7 && u3.set(e6, r7), i4 = i4.add(e6);
            }
          }), s4.push(this.documentOverlayCache.saveOverlays(e5, _2, u3));
        }
        return PersistencePromise.waitFor(s4);
      }).next(() => n5);
    }
    /**
     * Recalculates overlays by reading the documents from remote document cache
     * first, and saves them after they are calculated.
     */
    recalculateAndSaveOverlaysForDocumentKeys(e5, t4) {
      return this.remoteDocumentCache.getEntries(e5, t4).next((t5) => this.recalculateAndSaveOverlays(e5, t5));
    }
    /**
     * Performs a query against the local view of all documents.
     *
     * @param transaction - The persistence transaction.
     * @param query - The query to match documents against.
     * @param offset - Read time and key to start scanning by (exclusive).
     * @param context - A optional tracker to keep a record of important details
     *   during database local query execution.
     */
    getDocumentsMatchingQuery(e5, t4, n5, r5) {
      return function __PRIVATE_isDocumentQuery$1(e6) {
        return DocumentKey.isDocumentKey(e6.path) && null === e6.collectionGroup && 0 === e6.filters.length;
      }(t4) ? this.getDocumentsMatchingDocumentQuery(e5, t4.path) : __PRIVATE_isCollectionGroupQuery(t4) ? this.getDocumentsMatchingCollectionGroupQuery(e5, t4, n5, r5) : this.getDocumentsMatchingCollectionQuery(e5, t4, n5, r5);
    }
    /**
     * Given a collection group, returns the next documents that follow the provided offset, along
     * with an updated batch ID.
     *
     * <p>The documents returned by this method are ordered by remote version from the provided
     * offset. If there are no more remote documents after the provided offset, documents with
     * mutations in order of batch id from the offset are returned. Since all documents in a batch are
     * returned together, the total number of documents returned can exceed {@code count}.
     *
     * @param transaction
     * @param collectionGroup The collection group for the documents.
     * @param offset The offset to index into.
     * @param count The number of documents to return
     * @return A LocalWriteResult with the documents that follow the provided offset and the last processed batch id.
     */
    getNextDocuments(e5, t4, n5, r5) {
      return this.remoteDocumentCache.getAllFromCollectionGroup(e5, t4, n5, r5).next((i4) => {
        const s4 = r5 - i4.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(e5, t4, n5.largestBatchId, r5 - i4.size) : PersistencePromise.resolve(__PRIVATE_newOverlayMap());
        let o4 = -1, _2 = i4;
        return s4.next((t5) => PersistencePromise.forEach(t5, (t6, n6) => (o4 < n6.largestBatchId && (o4 = n6.largestBatchId), i4.get(t6) ? PersistencePromise.resolve() : this.remoteDocumentCache.getEntry(e5, t6).next((e6) => {
          _2 = _2.insert(t6, e6);
        }))).next(() => this.populateOverlays(e5, t5, i4)).next(() => this.computeViews(e5, _2, t5, __PRIVATE_documentKeySet())).next((e6) => ({
          batchId: o4,
          changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e6)
        })));
      });
    }
    getDocumentsMatchingDocumentQuery(e5, t4) {
      return this.getDocument(e5, new DocumentKey(t4)).next((e6) => {
        let t5 = documentMap();
        return e6.isFoundDocument() && (t5 = t5.insert(e6.key, e6)), t5;
      });
    }
    getDocumentsMatchingCollectionGroupQuery(e5, t4, n5, r5) {
      const i4 = t4.collectionGroup;
      let s4 = documentMap();
      return this.indexManager.getCollectionParents(e5, i4).next((o4) => PersistencePromise.forEach(o4, (o5) => {
        const _2 = function __PRIVATE_asCollectionQueryAtPath(e6, t5) {
          return new __PRIVATE_QueryImpl(
            t5,
            /*collectionGroup=*/
            null,
            e6.explicitOrderBy.slice(),
            e6.filters.slice(),
            e6.limit,
            e6.limitType,
            e6.startAt,
            e6.endAt
          );
        }(t4, o5.child(i4));
        return this.getDocumentsMatchingCollectionQuery(e5, _2, n5, r5).next((e6) => {
          e6.forEach((e7, t5) => {
            s4 = s4.insert(e7, t5);
          });
        });
      }).next(() => s4));
    }
    getDocumentsMatchingCollectionQuery(e5, t4, n5, r5) {
      let i4;
      return this.documentOverlayCache.getOverlaysForCollection(e5, t4.path, n5.largestBatchId).next((s4) => (i4 = s4, this.remoteDocumentCache.getDocumentsMatchingQuery(e5, t4, n5, i4, r5))).next((e6) => {
        i4.forEach((t5, n7) => {
          const r6 = n7.getKey();
          null === e6.get(r6) && (e6 = e6.insert(r6, MutableDocument.newInvalidDocument(r6)));
        });
        let n6 = documentMap();
        return e6.forEach((e7, r6) => {
          const s4 = i4.get(e7);
          void 0 !== s4 && __PRIVATE_mutationApplyToLocalView(s4.mutation, r6, FieldMask.empty(), Timestamp.now()), // Finally, insert the documents that still match the query
          __PRIVATE_queryMatches(t4, r6) && (n6 = n6.insert(e7, r6));
        }), n6;
      });
    }
  };
  var __PRIVATE_MemoryBundleCache = class {
    constructor(e5) {
      this.serializer = e5, this.cr = /* @__PURE__ */ new Map(), this.lr = /* @__PURE__ */ new Map();
    }
    getBundleMetadata(e5, t4) {
      return PersistencePromise.resolve(this.cr.get(t4));
    }
    saveBundleMetadata(e5, t4) {
      return this.cr.set(
        t4.id,
        /** Decodes a BundleMetadata proto into a BundleMetadata object. */
        function __PRIVATE_fromBundleMetadata(e6) {
          return {
            id: e6.id,
            version: e6.version,
            createTime: __PRIVATE_fromVersion(e6.createTime)
          };
        }(t4)
      ), PersistencePromise.resolve();
    }
    getNamedQuery(e5, t4) {
      return PersistencePromise.resolve(this.lr.get(t4));
    }
    saveNamedQuery(e5, t4) {
      return this.lr.set(t4.name, function __PRIVATE_fromProtoNamedQuery(e6) {
        return {
          name: e6.name,
          query: __PRIVATE_fromBundledQuery(e6.bundledQuery),
          readTime: __PRIVATE_fromVersion(e6.readTime)
        };
      }(t4)), PersistencePromise.resolve();
    }
  };
  var __PRIVATE_MemoryDocumentOverlayCache = class {
    constructor() {
      this.overlays = new SortedMap(DocumentKey.comparator), this.hr = /* @__PURE__ */ new Map();
    }
    getOverlay(e5, t4) {
      return PersistencePromise.resolve(this.overlays.get(t4));
    }
    getOverlays(e5, t4) {
      const n5 = __PRIVATE_newOverlayMap();
      return PersistencePromise.forEach(t4, (t5) => this.getOverlay(e5, t5).next((e6) => {
        null !== e6 && n5.set(t5, e6);
      })).next(() => n5);
    }
    saveOverlays(e5, t4, n5) {
      return n5.forEach((n6, r5) => {
        this.ht(e5, t4, r5);
      }), PersistencePromise.resolve();
    }
    removeOverlaysForBatchId(e5, t4, n5) {
      const r5 = this.hr.get(n5);
      return void 0 !== r5 && (r5.forEach((e6) => this.overlays = this.overlays.remove(e6)), this.hr.delete(n5)), PersistencePromise.resolve();
    }
    getOverlaysForCollection(e5, t4, n5) {
      const r5 = __PRIVATE_newOverlayMap(), i4 = t4.length + 1, s4 = new DocumentKey(t4.child("")), o4 = this.overlays.getIteratorFrom(s4);
      for (; o4.hasNext(); ) {
        const e6 = o4.getNext().value, s5 = e6.getKey();
        if (!t4.isPrefixOf(s5.path)) break;
        s5.path.length === i4 && (e6.largestBatchId > n5 && r5.set(e6.getKey(), e6));
      }
      return PersistencePromise.resolve(r5);
    }
    getOverlaysForCollectionGroup(e5, t4, n5, r5) {
      let i4 = new SortedMap((e6, t5) => e6 - t5);
      const s4 = this.overlays.getIterator();
      for (; s4.hasNext(); ) {
        const e6 = s4.getNext().value;
        if (e6.getKey().getCollectionGroup() === t4 && e6.largestBatchId > n5) {
          let t5 = i4.get(e6.largestBatchId);
          null === t5 && (t5 = __PRIVATE_newOverlayMap(), i4 = i4.insert(e6.largestBatchId, t5)), t5.set(e6.getKey(), e6);
        }
      }
      const o4 = __PRIVATE_newOverlayMap(), _2 = i4.getIterator();
      for (; _2.hasNext(); ) {
        if (_2.getNext().value.forEach((e6, t5) => o4.set(e6, t5)), o4.size() >= r5) break;
      }
      return PersistencePromise.resolve(o4);
    }
    ht(e5, t4, n5) {
      const r5 = this.overlays.get(n5.key);
      if (null !== r5) {
        const e6 = this.hr.get(r5.largestBatchId).delete(n5.key);
        this.hr.set(r5.largestBatchId, e6);
      }
      this.overlays = this.overlays.insert(n5.key, new Overlay(t4, n5));
      let i4 = this.hr.get(t4);
      void 0 === i4 && (i4 = __PRIVATE_documentKeySet(), this.hr.set(t4, i4)), this.hr.set(t4, i4.add(n5.key));
    }
  };
  var __PRIVATE_ReferenceSet = class {
    constructor() {
      this.Pr = new SortedSet(__PRIVATE_DocReference.Ir), // A set of outstanding references to a document sorted by target id.
      this.Tr = new SortedSet(__PRIVATE_DocReference.Er);
    }
    /** Returns true if the reference set contains no references. */
    isEmpty() {
      return this.Pr.isEmpty();
    }
    /** Adds a reference to the given document key for the given ID. */
    addReference(e5, t4) {
      const n5 = new __PRIVATE_DocReference(e5, t4);
      this.Pr = this.Pr.add(n5), this.Tr = this.Tr.add(n5);
    }
    /** Add references to the given document keys for the given ID. */
    dr(e5, t4) {
      e5.forEach((e6) => this.addReference(e6, t4));
    }
    /**
     * Removes a reference to the given document key for the given
     * ID.
     */
    removeReference(e5, t4) {
      this.Ar(new __PRIVATE_DocReference(e5, t4));
    }
    Rr(e5, t4) {
      e5.forEach((e6) => this.removeReference(e6, t4));
    }
    /**
     * Clears all references with a given ID. Calls removeRef() for each key
     * removed.
     */
    Vr(e5) {
      const t4 = new DocumentKey(new ResourcePath([])), n5 = new __PRIVATE_DocReference(t4, e5), r5 = new __PRIVATE_DocReference(t4, e5 + 1), i4 = [];
      return this.Tr.forEachInRange([n5, r5], (e6) => {
        this.Ar(e6), i4.push(e6.key);
      }), i4;
    }
    mr() {
      this.Pr.forEach((e5) => this.Ar(e5));
    }
    Ar(e5) {
      this.Pr = this.Pr.delete(e5), this.Tr = this.Tr.delete(e5);
    }
    gr(e5) {
      const t4 = new DocumentKey(new ResourcePath([])), n5 = new __PRIVATE_DocReference(t4, e5), r5 = new __PRIVATE_DocReference(t4, e5 + 1);
      let i4 = __PRIVATE_documentKeySet();
      return this.Tr.forEachInRange([n5, r5], (e6) => {
        i4 = i4.add(e6.key);
      }), i4;
    }
    containsKey(e5) {
      const t4 = new __PRIVATE_DocReference(e5, 0), n5 = this.Pr.firstAfterOrEqual(t4);
      return null !== n5 && e5.isEqual(n5.key);
    }
  };
  var __PRIVATE_DocReference = class {
    constructor(e5, t4) {
      this.key = e5, this.pr = t4;
    }
    /** Compare by key then by ID */
    static Ir(e5, t4) {
      return DocumentKey.comparator(e5.key, t4.key) || __PRIVATE_primitiveComparator(e5.pr, t4.pr);
    }
    /** Compare by ID then by key */
    static Er(e5, t4) {
      return __PRIVATE_primitiveComparator(e5.pr, t4.pr) || DocumentKey.comparator(e5.key, t4.key);
    }
  };
  var __PRIVATE_MemoryMutationQueue = class {
    constructor(e5, t4) {
      this.indexManager = e5, this.referenceDelegate = t4, /**
       * The set of all mutations that have been sent but not yet been applied to
       * the backend.
       */
      this.mutationQueue = [], /** Next value to use when assigning sequential IDs to each mutation batch. */
      this.yr = 1, /** An ordered mapping between documents and the mutations batch IDs. */
      this.wr = new SortedSet(__PRIVATE_DocReference.Ir);
    }
    checkEmpty(e5) {
      return PersistencePromise.resolve(0 === this.mutationQueue.length);
    }
    addMutationBatch(e5, t4, n5, r5) {
      const i4 = this.yr;
      this.yr++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
      const s4 = new MutationBatch(i4, t4, n5, r5);
      this.mutationQueue.push(s4);
      for (const t5 of r5) this.wr = this.wr.add(new __PRIVATE_DocReference(t5.key, i4)), this.indexManager.addToCollectionParentIndex(e5, t5.key.path.popLast());
      return PersistencePromise.resolve(s4);
    }
    lookupMutationBatch(e5, t4) {
      return PersistencePromise.resolve(this.Sr(t4));
    }
    getNextMutationBatchAfterBatchId(e5, t4) {
      const n5 = t4 + 1, r5 = this.br(n5), i4 = r5 < 0 ? 0 : r5;
      return PersistencePromise.resolve(this.mutationQueue.length > i4 ? this.mutationQueue[i4] : null);
    }
    getHighestUnacknowledgedBatchId() {
      return PersistencePromise.resolve(0 === this.mutationQueue.length ? -1 : this.yr - 1);
    }
    getAllMutationBatches(e5) {
      return PersistencePromise.resolve(this.mutationQueue.slice());
    }
    getAllMutationBatchesAffectingDocumentKey(e5, t4) {
      const n5 = new __PRIVATE_DocReference(t4, 0), r5 = new __PRIVATE_DocReference(t4, Number.POSITIVE_INFINITY), i4 = [];
      return this.wr.forEachInRange([n5, r5], (e6) => {
        const t5 = this.Sr(e6.pr);
        i4.push(t5);
      }), PersistencePromise.resolve(i4);
    }
    getAllMutationBatchesAffectingDocumentKeys(e5, t4) {
      let n5 = new SortedSet(__PRIVATE_primitiveComparator);
      return t4.forEach((e6) => {
        const t5 = new __PRIVATE_DocReference(e6, 0), r5 = new __PRIVATE_DocReference(e6, Number.POSITIVE_INFINITY);
        this.wr.forEachInRange([t5, r5], (e7) => {
          n5 = n5.add(e7.pr);
        });
      }), PersistencePromise.resolve(this.Dr(n5));
    }
    getAllMutationBatchesAffectingQuery(e5, t4) {
      const n5 = t4.path, r5 = n5.length + 1;
      let i4 = n5;
      DocumentKey.isDocumentKey(i4) || (i4 = i4.child(""));
      const s4 = new __PRIVATE_DocReference(new DocumentKey(i4), 0);
      let o4 = new SortedSet(__PRIVATE_primitiveComparator);
      return this.wr.forEachWhile((e6) => {
        const t5 = e6.key.path;
        return !!n5.isPrefixOf(t5) && // Rows with document keys more than one segment longer than the query
        // path can't be matches. For example, a query on 'rooms' can't match
        // the document /rooms/abc/messages/xyx.
        // TODO(mcg): we'll need a different scanner when we implement
        // ancestor queries.
        (t5.length === r5 && (o4 = o4.add(e6.pr)), true);
      }, s4), PersistencePromise.resolve(this.Dr(o4));
    }
    Dr(e5) {
      const t4 = [];
      return e5.forEach((e6) => {
        const n5 = this.Sr(e6);
        null !== n5 && t4.push(n5);
      }), t4;
    }
    removeMutationBatch(e5, t4) {
      __PRIVATE_hardAssert(0 === this.Cr(t4.batchId, "removed")), this.mutationQueue.shift();
      let n5 = this.wr;
      return PersistencePromise.forEach(t4.mutations, (r5) => {
        const i4 = new __PRIVATE_DocReference(r5.key, t4.batchId);
        return n5 = n5.delete(i4), this.referenceDelegate.markPotentiallyOrphaned(e5, r5.key);
      }).next(() => {
        this.wr = n5;
      });
    }
    Mn(e5) {
    }
    containsKey(e5, t4) {
      const n5 = new __PRIVATE_DocReference(t4, 0), r5 = this.wr.firstAfterOrEqual(n5);
      return PersistencePromise.resolve(t4.isEqual(r5 && r5.key));
    }
    performConsistencyCheck(e5) {
      return this.mutationQueue.length, PersistencePromise.resolve();
    }
    /**
     * Finds the index of the given batchId in the mutation queue and asserts that
     * the resulting index is within the bounds of the queue.
     *
     * @param batchId - The batchId to search for
     * @param action - A description of what the caller is doing, phrased in passive
     * form (e.g. "acknowledged" in a routine that acknowledges batches).
     */
    Cr(e5, t4) {
      return this.br(e5);
    }
    /**
     * Finds the index of the given batchId in the mutation queue. This operation
     * is O(1).
     *
     * @returns The computed index of the batch with the given batchId, based on
     * the state of the queue. Note this index can be negative if the requested
     * batchId has already been remvoed from the queue or past the end of the
     * queue if the batchId is larger than the last added batch.
     */
    br(e5) {
      if (0 === this.mutationQueue.length)
        return 0;
      return e5 - this.mutationQueue[0].batchId;
    }
    /**
     * A version of lookupMutationBatch that doesn't return a promise, this makes
     * other functions that uses this code easier to read and more efficent.
     */
    Sr(e5) {
      const t4 = this.br(e5);
      if (t4 < 0 || t4 >= this.mutationQueue.length) return null;
      return this.mutationQueue[t4];
    }
  };
  var __PRIVATE_MemoryRemoteDocumentCacheImpl = class {
    /**
     * @param sizer - Used to assess the size of a document. For eager GC, this is
     * expected to just return 0 to avoid unnecessarily doing the work of
     * calculating the size.
     */
    constructor(e5) {
      this.vr = e5, /** Underlying cache of documents and their read times. */
      this.docs = function __PRIVATE_documentEntryMap() {
        return new SortedMap(DocumentKey.comparator);
      }(), /** Size of all cached documents. */
      this.size = 0;
    }
    setIndexManager(e5) {
      this.indexManager = e5;
    }
    /**
     * Adds the supplied entry to the cache and updates the cache size as appropriate.
     *
     * All calls of `addEntry`  are required to go through the RemoteDocumentChangeBuffer
     * returned by `newChangeBuffer()`.
     */
    addEntry(e5, t4) {
      const n5 = t4.key, r5 = this.docs.get(n5), i4 = r5 ? r5.size : 0, s4 = this.vr(t4);
      return this.docs = this.docs.insert(n5, {
        document: t4.mutableCopy(),
        size: s4
      }), this.size += s4 - i4, this.indexManager.addToCollectionParentIndex(e5, n5.path.popLast());
    }
    /**
     * Removes the specified entry from the cache and updates the cache size as appropriate.
     *
     * All calls of `removeEntry` are required to go through the RemoteDocumentChangeBuffer
     * returned by `newChangeBuffer()`.
     */
    removeEntry(e5) {
      const t4 = this.docs.get(e5);
      t4 && (this.docs = this.docs.remove(e5), this.size -= t4.size);
    }
    getEntry(e5, t4) {
      const n5 = this.docs.get(t4);
      return PersistencePromise.resolve(n5 ? n5.document.mutableCopy() : MutableDocument.newInvalidDocument(t4));
    }
    getEntries(e5, t4) {
      let n5 = __PRIVATE_mutableDocumentMap();
      return t4.forEach((e6) => {
        const t5 = this.docs.get(e6);
        n5 = n5.insert(e6, t5 ? t5.document.mutableCopy() : MutableDocument.newInvalidDocument(e6));
      }), PersistencePromise.resolve(n5);
    }
    getDocumentsMatchingQuery(e5, t4, n5, r5) {
      let i4 = __PRIVATE_mutableDocumentMap();
      const s4 = t4.path, o4 = new DocumentKey(s4.child("")), _2 = this.docs.getIteratorFrom(o4);
      for (; _2.hasNext(); ) {
        const { key: e6, value: { document: o5 } } = _2.getNext();
        if (!s4.isPrefixOf(e6.path)) break;
        e6.path.length > s4.length + 1 || (__PRIVATE_indexOffsetComparator(__PRIVATE_newIndexOffsetFromDocument(o5), n5) <= 0 || (r5.has(o5.key) || __PRIVATE_queryMatches(t4, o5)) && (i4 = i4.insert(o5.key, o5.mutableCopy())));
      }
      return PersistencePromise.resolve(i4);
    }
    getAllFromCollectionGroup(e5, t4, n5, r5) {
      fail();
    }
    Fr(e5, t4) {
      return PersistencePromise.forEach(this.docs, (e6) => t4(e6));
    }
    newChangeBuffer(e5) {
      return new __PRIVATE_MemoryRemoteDocumentChangeBuffer(this);
    }
    getSize(e5) {
      return PersistencePromise.resolve(this.size);
    }
  };
  var __PRIVATE_MemoryRemoteDocumentChangeBuffer = class extends RemoteDocumentChangeBuffer {
    constructor(e5) {
      super(), this.ar = e5;
    }
    applyChanges(e5) {
      const t4 = [];
      return this.changes.forEach((n5, r5) => {
        r5.isValidDocument() ? t4.push(this.ar.addEntry(e5, r5)) : this.ar.removeEntry(n5);
      }), PersistencePromise.waitFor(t4);
    }
    getFromCache(e5, t4) {
      return this.ar.getEntry(e5, t4);
    }
    getAllFromCache(e5, t4) {
      return this.ar.getEntries(e5, t4);
    }
  };
  var __PRIVATE_MemoryTargetCache = class {
    constructor(e5) {
      this.persistence = e5, /**
       * Maps a target to the data about that target
       */
      this.Mr = new ObjectMap((e6) => __PRIVATE_canonifyTarget(e6), __PRIVATE_targetEquals), /** The last received snapshot version. */
      this.lastRemoteSnapshotVersion = SnapshotVersion.min(), /** The highest numbered target ID encountered. */
      this.highestTargetId = 0, /** The highest sequence number encountered. */
      this.Or = 0, /**
       * A ordered bidirectional mapping between documents and the remote target
       * IDs.
       */
      this.Nr = new __PRIVATE_ReferenceSet(), this.targetCount = 0, this.Lr = __PRIVATE_TargetIdGenerator.Nn();
    }
    forEachTarget(e5, t4) {
      return this.Mr.forEach((e6, n5) => t4(n5)), PersistencePromise.resolve();
    }
    getLastRemoteSnapshotVersion(e5) {
      return PersistencePromise.resolve(this.lastRemoteSnapshotVersion);
    }
    getHighestSequenceNumber(e5) {
      return PersistencePromise.resolve(this.Or);
    }
    allocateTargetId(e5) {
      return this.highestTargetId = this.Lr.next(), PersistencePromise.resolve(this.highestTargetId);
    }
    setTargetsMetadata(e5, t4, n5) {
      return n5 && (this.lastRemoteSnapshotVersion = n5), t4 > this.Or && (this.Or = t4), PersistencePromise.resolve();
    }
    qn(e5) {
      this.Mr.set(e5.target, e5);
      const t4 = e5.targetId;
      t4 > this.highestTargetId && (this.Lr = new __PRIVATE_TargetIdGenerator(t4), this.highestTargetId = t4), e5.sequenceNumber > this.Or && (this.Or = e5.sequenceNumber);
    }
    addTargetData(e5, t4) {
      return this.qn(t4), this.targetCount += 1, PersistencePromise.resolve();
    }
    updateTargetData(e5, t4) {
      return this.qn(t4), PersistencePromise.resolve();
    }
    removeTargetData(e5, t4) {
      return this.Mr.delete(t4.target), this.Nr.Vr(t4.targetId), this.targetCount -= 1, PersistencePromise.resolve();
    }
    removeTargets(e5, t4, n5) {
      let r5 = 0;
      const i4 = [];
      return this.Mr.forEach((s4, o4) => {
        o4.sequenceNumber <= t4 && null === n5.get(o4.targetId) && (this.Mr.delete(s4), i4.push(this.removeMatchingKeysForTargetId(e5, o4.targetId)), r5++);
      }), PersistencePromise.waitFor(i4).next(() => r5);
    }
    getTargetCount(e5) {
      return PersistencePromise.resolve(this.targetCount);
    }
    getTargetData(e5, t4) {
      const n5 = this.Mr.get(t4) || null;
      return PersistencePromise.resolve(n5);
    }
    addMatchingKeys(e5, t4, n5) {
      return this.Nr.dr(t4, n5), PersistencePromise.resolve();
    }
    removeMatchingKeys(e5, t4, n5) {
      this.Nr.Rr(t4, n5);
      const r5 = this.persistence.referenceDelegate, i4 = [];
      return r5 && t4.forEach((t5) => {
        i4.push(r5.markPotentiallyOrphaned(e5, t5));
      }), PersistencePromise.waitFor(i4);
    }
    removeMatchingKeysForTargetId(e5, t4) {
      return this.Nr.Vr(t4), PersistencePromise.resolve();
    }
    getMatchingKeysForTargetId(e5, t4) {
      const n5 = this.Nr.gr(t4);
      return PersistencePromise.resolve(n5);
    }
    containsKey(e5, t4) {
      return PersistencePromise.resolve(this.Nr.containsKey(t4));
    }
  };
  var __PRIVATE_MemoryPersistence = class {
    /**
     * The constructor accepts a factory for creating a reference delegate. This
     * allows both the delegate and this instance to have strong references to
     * each other without having nullable fields that would then need to be
     * checked or asserted on every access.
     */
    constructor(e5, t4) {
      this.Br = {}, this.overlays = {}, this.kr = new __PRIVATE_ListenSequence(0), this.qr = false, this.qr = true, this.referenceDelegate = e5(this), this.Qr = new __PRIVATE_MemoryTargetCache(this);
      this.indexManager = new __PRIVATE_MemoryIndexManager(), this.remoteDocumentCache = function __PRIVATE_newMemoryRemoteDocumentCache(e6) {
        return new __PRIVATE_MemoryRemoteDocumentCacheImpl(e6);
      }((e6) => this.referenceDelegate.Kr(e6)), this.serializer = new __PRIVATE_LocalSerializer(t4), this.$r = new __PRIVATE_MemoryBundleCache(this.serializer);
    }
    start() {
      return Promise.resolve();
    }
    shutdown() {
      return this.qr = false, Promise.resolve();
    }
    get started() {
      return this.qr;
    }
    setDatabaseDeletedListener() {
    }
    setNetworkEnabled() {
    }
    getIndexManager(e5) {
      return this.indexManager;
    }
    getDocumentOverlayCache(e5) {
      let t4 = this.overlays[e5.toKey()];
      return t4 || (t4 = new __PRIVATE_MemoryDocumentOverlayCache(), this.overlays[e5.toKey()] = t4), t4;
    }
    getMutationQueue(e5, t4) {
      let n5 = this.Br[e5.toKey()];
      return n5 || (n5 = new __PRIVATE_MemoryMutationQueue(t4, this.referenceDelegate), this.Br[e5.toKey()] = n5), n5;
    }
    getTargetCache() {
      return this.Qr;
    }
    getRemoteDocumentCache() {
      return this.remoteDocumentCache;
    }
    getBundleCache() {
      return this.$r;
    }
    runTransaction(e5, t4, n5) {
      __PRIVATE_logDebug("MemoryPersistence", "Starting transaction:", e5);
      const r5 = new __PRIVATE_MemoryTransaction(this.kr.next());
      return this.referenceDelegate.Ur(), n5(r5).next((e6) => this.referenceDelegate.Wr(r5).next(() => e6)).toPromise().then((e6) => (r5.raiseOnCommittedEvent(), e6));
    }
    Gr(e5, t4) {
      return PersistencePromise.or(Object.values(this.Br).map((n5) => () => n5.containsKey(e5, t4)));
    }
  };
  var __PRIVATE_MemoryTransaction = class extends PersistenceTransaction {
    constructor(e5) {
      super(), this.currentSequenceNumber = e5;
    }
  };
  var __PRIVATE_MemoryEagerDelegate = class ___PRIVATE_MemoryEagerDelegate {
    constructor(e5) {
      this.persistence = e5, /** Tracks all documents that are active in Query views. */
      this.zr = new __PRIVATE_ReferenceSet(), /** The list of documents that are potentially GCed after each transaction. */
      this.jr = null;
    }
    static Hr(e5) {
      return new ___PRIVATE_MemoryEagerDelegate(e5);
    }
    get Jr() {
      if (this.jr) return this.jr;
      throw fail();
    }
    addReference(e5, t4, n5) {
      return this.zr.addReference(n5, t4), this.Jr.delete(n5.toString()), PersistencePromise.resolve();
    }
    removeReference(e5, t4, n5) {
      return this.zr.removeReference(n5, t4), this.Jr.add(n5.toString()), PersistencePromise.resolve();
    }
    markPotentiallyOrphaned(e5, t4) {
      return this.Jr.add(t4.toString()), PersistencePromise.resolve();
    }
    removeTarget(e5, t4) {
      this.zr.Vr(t4.targetId).forEach((e6) => this.Jr.add(e6.toString()));
      const n5 = this.persistence.getTargetCache();
      return n5.getMatchingKeysForTargetId(e5, t4.targetId).next((e6) => {
        e6.forEach((e7) => this.Jr.add(e7.toString()));
      }).next(() => n5.removeTargetData(e5, t4));
    }
    Ur() {
      this.jr = /* @__PURE__ */ new Set();
    }
    Wr(e5) {
      const t4 = this.persistence.getRemoteDocumentCache().newChangeBuffer();
      return PersistencePromise.forEach(this.Jr, (n5) => {
        const r5 = DocumentKey.fromPath(n5);
        return this.Yr(e5, r5).next((e6) => {
          e6 || t4.removeEntry(r5, SnapshotVersion.min());
        });
      }).next(() => (this.jr = null, t4.apply(e5)));
    }
    updateLimboDocument(e5, t4) {
      return this.Yr(e5, t4).next((e6) => {
        e6 ? this.Jr.delete(t4.toString()) : this.Jr.add(t4.toString());
      });
    }
    Kr(e5) {
      return 0;
    }
    Yr(e5, t4) {
      return PersistencePromise.or([() => PersistencePromise.resolve(this.zr.containsKey(t4)), () => this.persistence.getTargetCache().containsKey(e5, t4), () => this.persistence.Gr(e5, t4)]);
    }
  };
  var __PRIVATE_SchemaConverter = class {
    constructor(e5) {
      this.serializer = e5;
    }
    /**
     * Performs database creation and schema upgrades.
     *
     * Note that in production, this method is only ever used to upgrade the schema
     * to SCHEMA_VERSION. Different values of toVersion are only used for testing
     * and local feature development.
     */
    O(e5, t4, n5, r5) {
      const i4 = new __PRIVATE_SimpleDbTransaction("createOrUpgrade", t4);
      n5 < 1 && r5 >= 1 && (!function __PRIVATE_createPrimaryClientStore(e6) {
        e6.createObjectStore("owner");
      }(e5), function __PRIVATE_createMutationQueue(e6) {
        e6.createObjectStore("mutationQueues", {
          keyPath: "userId"
        });
        e6.createObjectStore("mutations", {
          keyPath: "batchId",
          autoIncrement: true
        }).createIndex("userMutationsIndex", x2, {
          unique: true
        }), e6.createObjectStore("documentMutations");
      }(e5), __PRIVATE_createQueryCache(e5), function __PRIVATE_createLegacyRemoteDocumentCache(e6) {
        e6.createObjectStore("remoteDocuments");
      }(e5));
      let s4 = PersistencePromise.resolve();
      return n5 < 3 && r5 >= 3 && // Brand new clients don't need to drop and recreate--only clients that
      // potentially have corrupt data.
      (0 !== n5 && (!function __PRIVATE_dropQueryCache(e6) {
        e6.deleteObjectStore("targetDocuments"), e6.deleteObjectStore("targets"), e6.deleteObjectStore("targetGlobal");
      }(e5), __PRIVATE_createQueryCache(e5)), s4 = s4.next(() => (
        /**
        * Creates the target global singleton row.
        *
        * @param txn - The version upgrade transaction for indexeddb
        */
        function __PRIVATE_writeEmptyTargetGlobalEntry(e6) {
          const t5 = e6.store("targetGlobal"), n6 = {
            highestTargetId: 0,
            highestListenSequenceNumber: 0,
            lastRemoteSnapshotVersion: SnapshotVersion.min().toTimestamp(),
            targetCount: 0
          };
          return t5.put("targetGlobalKey", n6);
        }(i4)
      ))), n5 < 4 && r5 >= 4 && (0 !== n5 && // Schema version 3 uses auto-generated keys to generate globally unique
      // mutation batch IDs (this was previously ensured internally by the
      // client). To migrate to the new schema, we have to read all mutations
      // and write them back out. We preserve the existing batch IDs to guarantee
      // consistency with other object stores. Any further mutation batch IDs will
      // be auto-generated.
      (s4 = s4.next(() => function __PRIVATE_upgradeMutationBatchSchemaAndMigrateData(e6, t5) {
        return t5.store("mutations").U().next((n6) => {
          e6.deleteObjectStore("mutations");
          e6.createObjectStore("mutations", {
            keyPath: "batchId",
            autoIncrement: true
          }).createIndex("userMutationsIndex", x2, {
            unique: true
          });
          const r6 = t5.store("mutations"), i5 = n6.map((e7) => r6.put(e7));
          return PersistencePromise.waitFor(i5);
        });
      }(e5, i4))), s4 = s4.next(() => {
        !function __PRIVATE_createClientMetadataStore(e6) {
          e6.createObjectStore("clientMetadata", {
            keyPath: "clientId"
          });
        }(e5);
      })), n5 < 5 && r5 >= 5 && (s4 = s4.next(() => this.Xr(i4))), n5 < 6 && r5 >= 6 && (s4 = s4.next(() => (function __PRIVATE_createDocumentGlobalStore(e6) {
        e6.createObjectStore("remoteDocumentGlobal");
      }(e5), this.ei(i4)))), n5 < 7 && r5 >= 7 && (s4 = s4.next(() => this.ti(i4))), n5 < 8 && r5 >= 8 && (s4 = s4.next(() => this.ni(e5, i4))), n5 < 9 && r5 >= 9 && (s4 = s4.next(() => {
        !function __PRIVATE_dropRemoteDocumentChangesStore(e6) {
          e6.objectStoreNames.contains("remoteDocumentChanges") && e6.deleteObjectStore("remoteDocumentChanges");
        }(e5);
      })), n5 < 10 && r5 >= 10 && (s4 = s4.next(() => this.ri(i4))), n5 < 11 && r5 >= 11 && (s4 = s4.next(() => {
        !function __PRIVATE_createBundlesStore(e6) {
          e6.createObjectStore("bundles", {
            keyPath: "bundleId"
          });
        }(e5), function __PRIVATE_createNamedQueriesStore(e6) {
          e6.createObjectStore("namedQueries", {
            keyPath: "name"
          });
        }(e5);
      })), n5 < 12 && r5 >= 12 && (s4 = s4.next(() => {
        !function __PRIVATE_createDocumentOverlayStore(e6) {
          const t5 = e6.createObjectStore("documentOverlays", {
            keyPath: z
          });
          t5.createIndex("collectionPathOverlayIndex", j2, {
            unique: false
          }), t5.createIndex("collectionGroupOverlayIndex", H2, {
            unique: false
          });
        }(e5);
      })), n5 < 13 && r5 >= 13 && (s4 = s4.next(() => function __PRIVATE_createRemoteDocumentCache(e6) {
        const t5 = e6.createObjectStore("remoteDocumentsV14", {
          keyPath: N2
        });
        t5.createIndex("documentKeyIndex", L2), t5.createIndex("collectionGroupIndex", B);
      }(e5)).next(() => this.ii(e5, i4)).next(() => e5.deleteObjectStore("remoteDocuments"))), n5 < 14 && r5 >= 14 && (s4 = s4.next(() => this.si(e5, i4))), n5 < 15 && r5 >= 15 && (s4 = s4.next(() => function __PRIVATE_createFieldIndex(e6) {
        e6.createObjectStore("indexConfiguration", {
          keyPath: "indexId",
          autoIncrement: true
        }).createIndex("collectionGroupIndex", "collectionGroup", {
          unique: false
        });
        e6.createObjectStore("indexState", {
          keyPath: $2
        }).createIndex("sequenceNumberIndex", U, {
          unique: false
        });
        e6.createObjectStore("indexEntries", {
          keyPath: W
        }).createIndex("documentKeyIndex", G, {
          unique: false
        });
      }(e5))), n5 < 16 && r5 >= 16 && // Clear the object stores to remove possibly corrupted index entries
      (s4 = s4.next(() => {
        t4.objectStore("indexState").clear();
      }).next(() => {
        t4.objectStore("indexEntries").clear();
      })), s4;
    }
    ei(e5) {
      let t4 = 0;
      return e5.store("remoteDocuments").J((e6, n5) => {
        t4 += __PRIVATE_dbDocumentSize(n5);
      }).next(() => {
        const n5 = {
          byteSize: t4
        };
        return e5.store("remoteDocumentGlobal").put("remoteDocumentGlobalKey", n5);
      });
    }
    Xr(e5) {
      const t4 = e5.store("mutationQueues"), n5 = e5.store("mutations");
      return t4.U().next((t5) => PersistencePromise.forEach(t5, (t6) => {
        const r5 = IDBKeyRange.bound([t6.userId, -1], [t6.userId, t6.lastAcknowledgedBatchId]);
        return n5.U("userMutationsIndex", r5).next((n6) => PersistencePromise.forEach(n6, (n7) => {
          __PRIVATE_hardAssert(n7.userId === t6.userId);
          const r6 = __PRIVATE_fromDbMutationBatch(this.serializer, n7);
          return removeMutationBatch(e5, t6.userId, r6).next(() => {
          });
        }));
      }));
    }
    /**
     * Ensures that every document in the remote document cache has a corresponding sentinel row
     * with a sequence number. Missing rows are given the most recently used sequence number.
     */
    ti(e5) {
      const t4 = e5.store("targetDocuments"), n5 = e5.store("remoteDocuments");
      return e5.store("targetGlobal").get("targetGlobalKey").next((e6) => {
        const r5 = [];
        return n5.J((n6, i4) => {
          const s4 = new ResourcePath(n6), o4 = function __PRIVATE_sentinelKey(e7) {
            return [0, __PRIVATE_encodeResourcePath(e7)];
          }(s4);
          r5.push(t4.get(o4).next((n7) => n7 ? PersistencePromise.resolve() : ((n8) => t4.put({
            targetId: 0,
            path: __PRIVATE_encodeResourcePath(n8),
            sequenceNumber: e6.highestListenSequenceNumber
          }))(s4)));
        }).next(() => PersistencePromise.waitFor(r5));
      });
    }
    ni(e5, t4) {
      e5.createObjectStore("collectionParents", {
        keyPath: K
      });
      const n5 = t4.store("collectionParents"), r5 = new __PRIVATE_MemoryCollectionParentIndex(), addEntry = (e6) => {
        if (r5.add(e6)) {
          const t5 = e6.lastSegment(), r6 = e6.popLast();
          return n5.put({
            collectionId: t5,
            parent: __PRIVATE_encodeResourcePath(r6)
          });
        }
      };
      return t4.store("remoteDocuments").J({
        H: true
      }, (e6, t5) => {
        const n6 = new ResourcePath(e6);
        return addEntry(n6.popLast());
      }).next(() => t4.store("documentMutations").J({
        H: true
      }, ([e6, t5, n6], r6) => {
        const i4 = __PRIVATE_decodeResourcePath(t5);
        return addEntry(i4.popLast());
      }));
    }
    ri(e5) {
      const t4 = e5.store("targets");
      return t4.J((e6, n5) => {
        const r5 = __PRIVATE_fromDbTarget(n5), i4 = __PRIVATE_toDbTarget(this.serializer, r5);
        return t4.put(i4);
      });
    }
    ii(e5, t4) {
      const n5 = t4.store("remoteDocuments"), r5 = [];
      return n5.J((e6, n6) => {
        const i4 = t4.store("remoteDocumentsV14"), s4 = function __PRIVATE_extractKey(e7) {
          return e7.document ? new DocumentKey(ResourcePath.fromString(e7.document.name).popFirst(5)) : e7.noDocument ? DocumentKey.fromSegments(e7.noDocument.path) : e7.unknownDocument ? DocumentKey.fromSegments(e7.unknownDocument.path) : fail();
        }(n6).path.toArray(), o4 = {
          prefixPath: s4.slice(0, s4.length - 2),
          collectionGroup: s4[s4.length - 2],
          documentId: s4[s4.length - 1],
          readTime: n6.readTime || [0, 0],
          unknownDocument: n6.unknownDocument,
          noDocument: n6.noDocument,
          document: n6.document,
          hasCommittedMutations: !!n6.hasCommittedMutations
        };
        r5.push(i4.put(o4));
      }).next(() => PersistencePromise.waitFor(r5));
    }
    si(e5, t4) {
      const n5 = t4.store("mutations"), r5 = __PRIVATE_newIndexedDbRemoteDocumentCache(this.serializer), i4 = new __PRIVATE_MemoryPersistence(__PRIVATE_MemoryEagerDelegate.Hr, this.serializer.ct);
      return n5.U().next((e6) => {
        const n6 = /* @__PURE__ */ new Map();
        return e6.forEach((e7) => {
          var t5;
          let r6 = null !== (t5 = n6.get(e7.userId)) && void 0 !== t5 ? t5 : __PRIVATE_documentKeySet();
          __PRIVATE_fromDbMutationBatch(this.serializer, e7).keys().forEach((e8) => r6 = r6.add(e8)), n6.set(e7.userId, r6);
        }), PersistencePromise.forEach(n6, (e7, n7) => {
          const s4 = new User(n7), o4 = __PRIVATE_IndexedDbDocumentOverlayCache.lt(this.serializer, s4), _2 = i4.getIndexManager(s4), a3 = __PRIVATE_IndexedDbMutationQueue.lt(s4, this.serializer, _2, i4.referenceDelegate);
          return new LocalDocumentsView(r5, a3, o4, _2).recalculateAndSaveOverlaysForDocumentKeys(new __PRIVATE_IndexedDbTransaction(t4, __PRIVATE_ListenSequence.oe), e7).next();
        });
      });
    }
  };
  function __PRIVATE_createQueryCache(e5) {
    e5.createObjectStore("targetDocuments", {
      keyPath: q
    }).createIndex("documentTargetsIndex", Q, {
      unique: true
    });
    e5.createObjectStore("targets", {
      keyPath: "targetId"
    }).createIndex("queryTargetsIndex", k2, {
      unique: true
    }), e5.createObjectStore("targetGlobal");
  }
  var Re = "Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";
  var __PRIVATE_IndexedDbPersistence = class ___PRIVATE_IndexedDbPersistence {
    constructor(e5, t4, n5, r5, i4, s4, o4, _2, a3, u3, c4 = 16) {
      if (this.allowTabSynchronization = e5, this.persistenceKey = t4, this.clientId = n5, this.oi = i4, this.window = s4, this.document = o4, this._i = a3, this.ai = u3, this.ui = c4, this.kr = null, this.qr = false, this.isPrimary = false, this.networkEnabled = true, /** Our window.unload handler, if registered. */
      this.ci = null, this.inForeground = false, /** Our 'visibilitychange' listener if registered. */
      this.li = null, /** The client metadata refresh task. */
      this.hi = null, /** The last time we garbage collected the client metadata object store. */
      this.Pi = Number.NEGATIVE_INFINITY, /** A listener to notify on primary state changes. */
      this.Ii = (e6) => Promise.resolve(), !___PRIVATE_IndexedDbPersistence.D()) throw new FirestoreError(C2.UNIMPLEMENTED, "This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");
      this.referenceDelegate = new __PRIVATE_IndexedDbLruDelegateImpl(this, r5), this.Ti = t4 + "main", this.serializer = new __PRIVATE_LocalSerializer(_2), this.Ei = new __PRIVATE_SimpleDb(this.Ti, this.ui, new __PRIVATE_SchemaConverter(this.serializer)), this.Qr = new __PRIVATE_IndexedDbTargetCache(this.referenceDelegate, this.serializer), this.remoteDocumentCache = __PRIVATE_newIndexedDbRemoteDocumentCache(this.serializer), this.$r = new __PRIVATE_IndexedDbBundleCache(), this.window && this.window.localStorage ? this.di = this.window.localStorage : (this.di = null, false === u3 && __PRIVATE_logError("IndexedDbPersistence", "LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."));
    }
    /**
     * Attempt to start IndexedDb persistence.
     *
     * @returns Whether persistence was enabled.
     */
    start() {
      return this.Ai().then(() => {
        if (!this.isPrimary && !this.allowTabSynchronization)
          throw new FirestoreError(C2.FAILED_PRECONDITION, Re);
        return this.Ri(), this.Vi(), this.mi(), this.runTransaction("getHighestListenSequenceNumber", "readonly", (e5) => this.Qr.getHighestSequenceNumber(e5));
      }).then((e5) => {
        this.kr = new __PRIVATE_ListenSequence(e5, this._i);
      }).then(() => {
        this.qr = true;
      }).catch((e5) => (this.Ei && this.Ei.close(), Promise.reject(e5)));
    }
    /**
     * Registers a listener that gets called when the primary state of the
     * instance changes. Upon registering, this listener is invoked immediately
     * with the current primary state.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */
    fi(e5) {
      return this.Ii = async (t4) => {
        if (this.started) return e5(t4);
      }, e5(this.isPrimary);
    }
    /**
     * Registers a listener that gets called when the database receives a
     * version change event indicating that it has deleted.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */
    setDatabaseDeletedListener(e5) {
      this.Ei.L(async (t4) => {
        null === t4.newVersion && await e5();
      });
    }
    /**
     * Adjusts the current network state in the client's metadata, potentially
     * affecting the primary lease.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */
    setNetworkEnabled(e5) {
      this.networkEnabled !== e5 && (this.networkEnabled = e5, // Schedule a primary lease refresh for immediate execution. The eventual
      // lease update will be propagated via `primaryStateListener`.
      this.oi.enqueueAndForget(async () => {
        this.started && await this.Ai();
      }));
    }
    /**
     * Updates the client metadata in IndexedDb and attempts to either obtain or
     * extend the primary lease for the local client. Asynchronously notifies the
     * primary state listener if the client either newly obtained or released its
     * primary lease.
     */
    Ai() {
      return this.runTransaction("updateClientMetadataAndTryBecomePrimary", "readwrite", (e5) => __PRIVATE_clientMetadataStore(e5).put({
        clientId: this.clientId,
        updateTimeMs: Date.now(),
        networkEnabled: this.networkEnabled,
        inForeground: this.inForeground
      }).next(() => {
        if (this.isPrimary) return this.gi(e5).next((e6) => {
          e6 || (this.isPrimary = false, this.oi.enqueueRetryable(() => this.Ii(false)));
        });
      }).next(() => this.pi(e5)).next((t4) => this.isPrimary && !t4 ? this.yi(e5).next(() => false) : !!t4 && this.wi(e5).next(() => true))).catch((e5) => {
        if (__PRIVATE_isIndexedDbTransactionError(e5))
          return __PRIVATE_logDebug("IndexedDbPersistence", "Failed to extend owner lease: ", e5), this.isPrimary;
        if (!this.allowTabSynchronization) throw e5;
        return __PRIVATE_logDebug("IndexedDbPersistence", "Releasing owner lease after error during lease refresh", e5), /* isPrimary= */
        false;
      }).then((e5) => {
        this.isPrimary !== e5 && this.oi.enqueueRetryable(() => this.Ii(e5)), this.isPrimary = e5;
      });
    }
    gi(e5) {
      return __PRIVATE_primaryClientStore(e5).get("owner").next((e6) => PersistencePromise.resolve(this.Si(e6)));
    }
    bi(e5) {
      return __PRIVATE_clientMetadataStore(e5).delete(this.clientId);
    }
    /**
     * If the garbage collection threshold has passed, prunes the
     * RemoteDocumentChanges and the ClientMetadata store based on the last update
     * time of all clients.
     */
    async Di() {
      if (this.isPrimary && !this.Ci(this.Pi, 18e5)) {
        this.Pi = Date.now();
        const e5 = await this.runTransaction("maybeGarbageCollectMultiClientState", "readwrite-primary", (e6) => {
          const t4 = __PRIVATE_getStore(e6, "clientMetadata");
          return t4.U().next((e7) => {
            const n5 = this.vi(e7, 18e5), r5 = e7.filter((e8) => -1 === n5.indexOf(e8));
            return PersistencePromise.forEach(r5, (e8) => t4.delete(e8.clientId)).next(() => r5);
          });
        }).catch(() => []);
        if (this.di) for (const t4 of e5) this.di.removeItem(this.Fi(t4.clientId));
      }
    }
    /**
     * Schedules a recurring timer to update the client metadata and to either
     * extend or acquire the primary lease if the client is eligible.
     */
    mi() {
      this.hi = this.oi.enqueueAfterDelay("client_metadata_refresh", 4e3, () => this.Ai().then(() => this.Di()).then(() => this.mi()));
    }
    /** Checks whether `client` is the local client. */
    Si(e5) {
      return !!e5 && e5.ownerId === this.clientId;
    }
    /**
     * Evaluate the state of all active clients and determine whether the local
     * client is or can act as the holder of the primary lease. Returns whether
     * the client is eligible for the lease, but does not actually acquire it.
     * May return 'false' even if there is no active leaseholder and another
     * (foreground) client should become leaseholder instead.
     */
    pi(e5) {
      if (this.ai) return PersistencePromise.resolve(true);
      return __PRIVATE_primaryClientStore(e5).get("owner").next((t4) => {
        if (null !== t4 && this.Ci(t4.leaseTimestampMs, 5e3) && !this.Mi(t4.ownerId)) {
          if (this.Si(t4) && this.networkEnabled) return true;
          if (!this.Si(t4)) {
            if (!t4.allowTabSynchronization)
              throw new FirestoreError(C2.FAILED_PRECONDITION, Re);
            return false;
          }
        }
        return !(!this.networkEnabled || !this.inForeground) || __PRIVATE_clientMetadataStore(e5).U().next((e6) => void 0 === this.vi(e6, 5e3).find((e7) => {
          if (this.clientId !== e7.clientId) {
            const t5 = !this.networkEnabled && e7.networkEnabled, n5 = !this.inForeground && e7.inForeground, r5 = this.networkEnabled === e7.networkEnabled;
            if (t5 || n5 && r5) return true;
          }
          return false;
        }));
      }).next((e6) => (this.isPrimary !== e6 && __PRIVATE_logDebug("IndexedDbPersistence", `Client ${e6 ? "is" : "is not"} eligible for a primary lease.`), e6));
    }
    async shutdown() {
      this.qr = false, this.xi(), this.hi && (this.hi.cancel(), this.hi = null), this.Oi(), this.Ni(), // Use `SimpleDb.runTransaction` directly to avoid failing if another tab
      // has obtained the primary lease.
      await this.Ei.runTransaction("shutdown", "readwrite", ["owner", "clientMetadata"], (e5) => {
        const t4 = new __PRIVATE_IndexedDbTransaction(e5, __PRIVATE_ListenSequence.oe);
        return this.yi(t4).next(() => this.bi(t4));
      }), this.Ei.close(), // Remove the entry marking the client as zombied from LocalStorage since
      // we successfully deleted its metadata from IndexedDb.
      this.Li();
    }
    /**
     * Returns clients that are not zombied and have an updateTime within the
     * provided threshold.
     */
    vi(e5, t4) {
      return e5.filter((e6) => this.Ci(e6.updateTimeMs, t4) && !this.Mi(e6.clientId));
    }
    /**
     * Returns the IDs of the clients that are currently active. If multi-tab
     * is not supported, returns an array that only contains the local client's
     * ID.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */
    Bi() {
      return this.runTransaction("getActiveClients", "readonly", (e5) => __PRIVATE_clientMetadataStore(e5).U().next((e6) => this.vi(e6, 18e5).map((e7) => e7.clientId)));
    }
    get started() {
      return this.qr;
    }
    getMutationQueue(e5, t4) {
      return __PRIVATE_IndexedDbMutationQueue.lt(e5, this.serializer, t4, this.referenceDelegate);
    }
    getTargetCache() {
      return this.Qr;
    }
    getRemoteDocumentCache() {
      return this.remoteDocumentCache;
    }
    getIndexManager(e5) {
      return new __PRIVATE_IndexedDbIndexManager(e5, this.serializer.ct.databaseId);
    }
    getDocumentOverlayCache(e5) {
      return __PRIVATE_IndexedDbDocumentOverlayCache.lt(this.serializer, e5);
    }
    getBundleCache() {
      return this.$r;
    }
    runTransaction(e5, t4, n5) {
      __PRIVATE_logDebug("IndexedDbPersistence", "Starting transaction:", e5);
      const r5 = "readonly" === t4 ? "readonly" : "readwrite", i4 = (
        /** Returns the object stores for the provided schema. */
        function __PRIVATE_getObjectStores(e6) {
          return 16 === e6 ? te : 15 === e6 ? ee : 14 === e6 ? X : 13 === e6 ? Z2 : 12 === e6 ? Y : 11 === e6 ? J : void fail();
        }(this.ui)
      );
      let s4;
      return this.Ei.runTransaction(e5, r5, i4, (r6) => (s4 = new __PRIVATE_IndexedDbTransaction(r6, this.kr ? this.kr.next() : __PRIVATE_ListenSequence.oe), "readwrite-primary" === t4 ? this.gi(s4).next((e6) => !!e6 || this.pi(s4)).next((t5) => {
        if (!t5) throw __PRIVATE_logError(`Failed to obtain primary lease for action '${e5}'.`), this.isPrimary = false, this.oi.enqueueRetryable(() => this.Ii(false)), new FirestoreError(C2.FAILED_PRECONDITION, F);
        return n5(s4);
      }).next((e6) => this.wi(s4).next(() => e6)) : this.ki(s4).next(() => n5(s4)))).then((e6) => (s4.raiseOnCommittedEvent(), e6));
    }
    /**
     * Verifies that the current tab is the primary leaseholder or alternatively
     * that the leaseholder has opted into multi-tab synchronization.
     */
    // TODO(b/114226234): Remove this check when `synchronizeTabs` can no longer
    // be turned off.
    ki(e5) {
      return __PRIVATE_primaryClientStore(e5).get("owner").next((e6) => {
        if (null !== e6 && this.Ci(e6.leaseTimestampMs, 5e3) && !this.Mi(e6.ownerId) && !this.Si(e6) && !(this.ai || this.allowTabSynchronization && e6.allowTabSynchronization)) throw new FirestoreError(C2.FAILED_PRECONDITION, Re);
      });
    }
    /**
     * Obtains or extends the new primary lease for the local client. This
     * method does not verify that the client is eligible for this lease.
     */
    wi(e5) {
      const t4 = {
        ownerId: this.clientId,
        allowTabSynchronization: this.allowTabSynchronization,
        leaseTimestampMs: Date.now()
      };
      return __PRIVATE_primaryClientStore(e5).put("owner", t4);
    }
    static D() {
      return __PRIVATE_SimpleDb.D();
    }
    /** Checks the primary lease and removes it if we are the current primary. */
    yi(e5) {
      const t4 = __PRIVATE_primaryClientStore(e5);
      return t4.get("owner").next((e6) => this.Si(e6) ? (__PRIVATE_logDebug("IndexedDbPersistence", "Releasing primary lease."), t4.delete("owner")) : PersistencePromise.resolve());
    }
    /** Verifies that `updateTimeMs` is within `maxAgeMs`. */
    Ci(e5, t4) {
      const n5 = Date.now();
      return !(e5 < n5 - t4) && (!(e5 > n5) || (__PRIVATE_logError(`Detected an update time that is in the future: ${e5} > ${n5}`), false));
    }
    Ri() {
      null !== this.document && "function" == typeof this.document.addEventListener && (this.li = () => {
        this.oi.enqueueAndForget(() => (this.inForeground = "visible" === this.document.visibilityState, this.Ai()));
      }, this.document.addEventListener("visibilitychange", this.li), this.inForeground = "visible" === this.document.visibilityState);
    }
    Oi() {
      this.li && (this.document.removeEventListener("visibilitychange", this.li), this.li = null);
    }
    /**
     * Attaches a window.unload handler that will synchronously write our
     * clientId to a "zombie client id" location in LocalStorage. This can be used
     * by tabs trying to acquire the primary lease to determine that the lease
     * is no longer valid even if the timestamp is recent. This is particularly
     * important for the refresh case (so the tab correctly re-acquires the
     * primary lease). LocalStorage is used for this rather than IndexedDb because
     * it is a synchronous API and so can be used reliably from  an unload
     * handler.
     */
    Vi() {
      var e5;
      "function" == typeof (null === (e5 = this.window) || void 0 === e5 ? void 0 : e5.addEventListener) && (this.ci = () => {
        this.xi();
        const e6 = /(?:Version|Mobile)\/1[456]/;
        isSafari() && (navigator.appVersion.match(e6) || navigator.userAgent.match(e6)) && // On Safari 14, 15, and 16, we do not run any cleanup actions as it might
        // trigger a bug that prevents Safari from re-opening IndexedDB during
        // the next page load.
        // See https://bugs.webkit.org/show_bug.cgi?id=226547
        this.oi.enterRestrictedMode(
          /* purgeExistingTasks= */
          true
        ), this.oi.enqueueAndForget(() => this.shutdown());
      }, this.window.addEventListener("pagehide", this.ci));
    }
    Ni() {
      this.ci && (this.window.removeEventListener("pagehide", this.ci), this.ci = null);
    }
    /**
     * Returns whether a client is "zombied" based on its LocalStorage entry.
     * Clients become zombied when their tab closes without running all of the
     * cleanup logic in `shutdown()`.
     */
    Mi(e5) {
      var t4;
      try {
        const n5 = null !== (null === (t4 = this.di) || void 0 === t4 ? void 0 : t4.getItem(this.Fi(e5)));
        return __PRIVATE_logDebug("IndexedDbPersistence", `Client '${e5}' ${n5 ? "is" : "is not"} zombied in LocalStorage`), n5;
      } catch (e6) {
        return __PRIVATE_logError("IndexedDbPersistence", "Failed to get zombied client id.", e6), false;
      }
    }
    /**
     * Record client as zombied (a client that had its tab closed). Zombied
     * clients are ignored during primary tab selection.
     */
    xi() {
      if (this.di) try {
        this.di.setItem(this.Fi(this.clientId), String(Date.now()));
      } catch (e5) {
        __PRIVATE_logError("Failed to set zombie client id.", e5);
      }
    }
    /** Removes the zombied client entry if it exists. */
    Li() {
      if (this.di) try {
        this.di.removeItem(this.Fi(this.clientId));
      } catch (e5) {
      }
    }
    Fi(e5) {
      return `firestore_zombie_${this.persistenceKey}_${e5}`;
    }
  };
  function __PRIVATE_primaryClientStore(e5) {
    return __PRIVATE_getStore(e5, "owner");
  }
  function __PRIVATE_clientMetadataStore(e5) {
    return __PRIVATE_getStore(e5, "clientMetadata");
  }
  function __PRIVATE_indexedDbStoragePrefix(e5, t4) {
    let n5 = e5.projectId;
    return e5.isDefaultDatabase || (n5 += "." + e5.database), "firestore/" + t4 + "/" + n5 + "/";
  }
  var __PRIVATE_LocalViewChanges = class ___PRIVATE_LocalViewChanges {
    constructor(e5, t4, n5, r5) {
      this.targetId = e5, this.fromCache = t4, this.qi = n5, this.Qi = r5;
    }
    static Ki(e5, t4) {
      let n5 = __PRIVATE_documentKeySet(), r5 = __PRIVATE_documentKeySet();
      for (const e6 of t4.docChanges) switch (e6.type) {
        case 0:
          n5 = n5.add(e6.doc.key);
          break;
        case 1:
          r5 = r5.add(e6.doc.key);
      }
      return new ___PRIVATE_LocalViewChanges(e5, t4.fromCache, n5, r5);
    }
  };
  var QueryContext = class {
    constructor() {
      this._documentReadCount = 0;
    }
    get documentReadCount() {
      return this._documentReadCount;
    }
    incrementDocumentReadCount(e5) {
      this._documentReadCount += e5;
    }
  };
  var __PRIVATE_QueryEngine = class {
    constructor() {
      this.$i = false, this.Ui = false, /**
       * SDK only decides whether it should create index when collection size is
       * larger than this.
       */
      this.Wi = 100, this.Gi = /**
      * This cost represents the evaluation result of
      * (([index, docKey] + [docKey, docContent]) per document in the result set)
      * / ([docKey, docContent] per documents in full collection scan) coming from
      * experiment [enter PR experiment URL here].
      */
      function __PRIVATE_getDefaultRelativeIndexReadCostPerDocument() {
        return isSafari() ? 8 : __PRIVATE_getAndroidVersion(getUA()) > 0 ? 6 : 4;
      }();
    }
    /** Sets the document view to query against. */
    initialize(e5, t4) {
      this.zi = e5, this.indexManager = t4, this.$i = true;
    }
    /** Returns all local documents matching the specified query. */
    getDocumentsMatchingQuery(e5, t4, n5, r5) {
      const i4 = {
        result: null
      };
      return this.ji(e5, t4).next((e6) => {
        i4.result = e6;
      }).next(() => {
        if (!i4.result) return this.Hi(e5, t4, r5, n5).next((e6) => {
          i4.result = e6;
        });
      }).next(() => {
        if (i4.result) return;
        const n6 = new QueryContext();
        return this.Ji(e5, t4, n6).next((r6) => {
          if (i4.result = r6, this.Ui) return this.Yi(e5, t4, n6, r6.size);
        });
      }).next(() => i4.result);
    }
    Yi(e5, t4, n5, r5) {
      return n5.documentReadCount < this.Wi ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "SDK will not create cache indexes for query:", __PRIVATE_stringifyQuery(t4), "since it only creates cache indexes for collection contains", "more than or equal to", this.Wi, "documents"), PersistencePromise.resolve()) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Query:", __PRIVATE_stringifyQuery(t4), "scans", n5.documentReadCount, "local documents and returns", r5, "documents as results."), n5.documentReadCount > this.Gi * r5 ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "The SDK decides to create cache indexes for query:", __PRIVATE_stringifyQuery(t4), "as using cache indexes may help improve performance."), this.indexManager.createTargetIndexes(e5, __PRIVATE_queryToTarget(t4))) : PersistencePromise.resolve());
    }
    /**
     * Performs an indexed query that evaluates the query based on a collection's
     * persisted index values. Returns `null` if an index is not available.
     */
    ji(e5, t4) {
      if (__PRIVATE_queryMatchesAllDocuments(t4))
        return PersistencePromise.resolve(null);
      let n5 = __PRIVATE_queryToTarget(t4);
      return this.indexManager.getIndexType(e5, n5).next((r5) => 0 === r5 ? null : (null !== t4.limit && 1 === r5 && // We cannot apply a limit for targets that are served using a partial
      // index. If a partial index will be used to serve the target, the
      // query may return a superset of documents that match the target
      // (e.g. if the index doesn't include all the target's filters), or
      // may return the correct set of documents in the wrong order (e.g. if
      // the index doesn't include a segment for one of the orderBys).
      // Therefore, a limit should not be applied in such cases.
      (t4 = __PRIVATE_queryWithLimit(
        t4,
        null,
        "F"
        /* LimitType.First */
      ), n5 = __PRIVATE_queryToTarget(t4)), this.indexManager.getDocumentsMatchingTarget(e5, n5).next((r6) => {
        const i4 = __PRIVATE_documentKeySet(...r6);
        return this.zi.getDocuments(e5, i4).next((r7) => this.indexManager.getMinOffset(e5, n5).next((n6) => {
          const s4 = this.Zi(t4, r7);
          return this.Xi(t4, s4, i4, n6.readTime) ? this.ji(e5, __PRIVATE_queryWithLimit(
            t4,
            null,
            "F"
            /* LimitType.First */
          )) : this.es(e5, s4, t4, n6);
        }));
      })));
    }
    /**
     * Performs a query based on the target's persisted query mapping. Returns
     * `null` if the mapping is not available or cannot be used.
     */
    Hi(e5, t4, n5, r5) {
      return __PRIVATE_queryMatchesAllDocuments(t4) || r5.isEqual(SnapshotVersion.min()) ? PersistencePromise.resolve(null) : this.zi.getDocuments(e5, n5).next((i4) => {
        const s4 = this.Zi(t4, i4);
        return this.Xi(t4, s4, n5, r5) ? PersistencePromise.resolve(null) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Re-using previous result from %s to execute query: %s", r5.toString(), __PRIVATE_stringifyQuery(t4)), this.es(e5, s4, t4, __PRIVATE_newIndexOffsetSuccessorFromReadTime(r5, -1)).next((e6) => e6));
      });
    }
    /** Applies the query filter and sorting to the provided documents.  */
    Zi(e5, t4) {
      let n5 = new SortedSet(__PRIVATE_newQueryComparator(e5));
      return t4.forEach((t5, r5) => {
        __PRIVATE_queryMatches(e5, r5) && (n5 = n5.add(r5));
      }), n5;
    }
    /**
     * Determines if a limit query needs to be refilled from cache, making it
     * ineligible for index-free execution.
     *
     * @param query - The query.
     * @param sortedPreviousResults - The documents that matched the query when it
     * was last synchronized, sorted by the query's comparator.
     * @param remoteKeys - The document keys that matched the query at the last
     * snapshot.
     * @param limboFreeSnapshotVersion - The version of the snapshot when the
     * query was last synchronized.
     */
    Xi(e5, t4, n5, r5) {
      if (null === e5.limit)
        return false;
      if (n5.size !== t4.size)
        return true;
      const i4 = "F" === e5.limitType ? t4.last() : t4.first();
      return !!i4 && (i4.hasPendingWrites || i4.version.compareTo(r5) > 0);
    }
    Ji(e5, t4, n5) {
      return __PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Using full collection scan to execute query:", __PRIVATE_stringifyQuery(t4)), this.zi.getDocumentsMatchingQuery(e5, t4, IndexOffset.min(), n5);
    }
    /**
     * Combines the results from an indexed execution with the remaining documents
     * that have not yet been indexed.
     */
    es(e5, t4, n5, r5) {
      return this.zi.getDocumentsMatchingQuery(e5, n5, r5).next((e6) => (
        // Merge with existing results
        (t4.forEach((t5) => {
          e6 = e6.insert(t5.key, t5);
        }), e6)
      ));
    }
  };
  var __PRIVATE_LocalStoreImpl = class {
    constructor(e5, t4, n5, r5) {
      this.persistence = e5, this.ts = t4, this.serializer = r5, /**
       * Maps a targetID to data about its target.
       *
       * PORTING NOTE: We are using an immutable data structure on Web to make re-runs
       * of `applyRemoteEvent()` idempotent.
       */
      this.ns = new SortedMap(__PRIVATE_primitiveComparator), /** Maps a target to its targetID. */
      // TODO(wuandy): Evaluate if TargetId can be part of Target.
      this.rs = new ObjectMap((e6) => __PRIVATE_canonifyTarget(e6), __PRIVATE_targetEquals), /**
       * A per collection group index of the last read time processed by
       * `getNewDocumentChanges()`.
       *
       * PORTING NOTE: This is only used for multi-tab synchronization.
       */
      this.ss = /* @__PURE__ */ new Map(), this.os = e5.getRemoteDocumentCache(), this.Qr = e5.getTargetCache(), this.$r = e5.getBundleCache(), this._s(n5);
    }
    _s(e5) {
      this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e5), this.indexManager = this.persistence.getIndexManager(e5), this.mutationQueue = this.persistence.getMutationQueue(e5, this.indexManager), this.localDocuments = new LocalDocumentsView(this.os, this.mutationQueue, this.documentOverlayCache, this.indexManager), this.os.setIndexManager(this.indexManager), this.ts.initialize(this.localDocuments, this.indexManager);
    }
    collectGarbage(e5) {
      return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (t4) => e5.collect(t4, this.ns));
    }
  };
  function __PRIVATE_newLocalStore(e5, t4, n5, r5) {
    return new __PRIVATE_LocalStoreImpl(e5, t4, n5, r5);
  }
  async function __PRIVATE_localStoreHandleUserChange(e5, t4) {
    const n5 = __PRIVATE_debugCast(e5);
    return await n5.persistence.runTransaction("Handle user change", "readonly", (e6) => {
      let r5;
      return n5.mutationQueue.getAllMutationBatches(e6).next((i4) => (r5 = i4, n5._s(t4), n5.mutationQueue.getAllMutationBatches(e6))).next((t5) => {
        const i4 = [], s4 = [];
        let o4 = __PRIVATE_documentKeySet();
        for (const e7 of r5) {
          i4.push(e7.batchId);
          for (const t6 of e7.mutations) o4 = o4.add(t6.key);
        }
        for (const e7 of t5) {
          s4.push(e7.batchId);
          for (const t6 of e7.mutations) o4 = o4.add(t6.key);
        }
        return n5.localDocuments.getDocuments(e6, o4).next((e7) => ({
          us: e7,
          removedBatchIds: i4,
          addedBatchIds: s4
        }));
      });
    });
  }
  function __PRIVATE_localStoreAcknowledgeBatch(e5, t4) {
    const n5 = __PRIVATE_debugCast(e5);
    return n5.persistence.runTransaction("Acknowledge batch", "readwrite-primary", (e6) => {
      const r5 = t4.batch.keys(), i4 = n5.os.newChangeBuffer({
        trackRemovals: true
      });
      return function __PRIVATE_applyWriteToRemoteDocuments(e7, t5, n6, r6) {
        const i5 = n6.batch, s4 = i5.keys();
        let o4 = PersistencePromise.resolve();
        return s4.forEach((e8) => {
          o4 = o4.next(() => r6.getEntry(t5, e8)).next((t6) => {
            const s5 = n6.docVersions.get(e8);
            __PRIVATE_hardAssert(null !== s5), t6.version.compareTo(s5) < 0 && (i5.applyToRemoteDocument(t6, n6), t6.isValidDocument() && // We use the commitVersion as the readTime rather than the
            // document's updateTime since the updateTime is not advanced
            // for updates that do not modify the underlying document.
            (t6.setReadTime(n6.commitVersion), r6.addEntry(t6)));
          });
        }), o4.next(() => e7.mutationQueue.removeMutationBatch(t5, i5));
      }(n5, e6, t4, i4).next(() => i4.apply(e6)).next(() => n5.mutationQueue.performConsistencyCheck(e6)).next(() => n5.documentOverlayCache.removeOverlaysForBatchId(e6, r5, t4.batch.batchId)).next(() => n5.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e6, function __PRIVATE_getKeysWithTransformResults(e7) {
        let t5 = __PRIVATE_documentKeySet();
        for (let n6 = 0; n6 < e7.mutationResults.length; ++n6) {
          e7.mutationResults[n6].transformResults.length > 0 && (t5 = t5.add(e7.batch.mutations[n6].key));
        }
        return t5;
      }(t4))).next(() => n5.localDocuments.getDocuments(e6, r5));
    });
  }
  function __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e5) {
    const t4 = __PRIVATE_debugCast(e5);
    return t4.persistence.runTransaction("Get last remote snapshot version", "readonly", (e6) => t4.Qr.getLastRemoteSnapshotVersion(e6));
  }
  function __PRIVATE_localStoreGetNextMutationBatch(e5, t4) {
    const n5 = __PRIVATE_debugCast(e5);
    return n5.persistence.runTransaction("Get next mutation batch", "readonly", (e6) => (void 0 === t4 && (t4 = -1), n5.mutationQueue.getNextMutationBatchAfterBatchId(e6, t4)));
  }
  var __PRIVATE_LocalClientState = class {
    constructor() {
      this.activeTargetIds = __PRIVATE_targetIdSet();
    }
    As(e5) {
      this.activeTargetIds = this.activeTargetIds.add(e5);
    }
    Rs(e5) {
      this.activeTargetIds = this.activeTargetIds.delete(e5);
    }
    /**
     * Converts this entry into a JSON-encoded format we can use for WebStorage.
     * Does not encode `clientId` as it is part of the key in WebStorage.
     */
    ds() {
      const e5 = {
        activeTargetIds: this.activeTargetIds.toArray(),
        updateTimeMs: Date.now()
      };
      return JSON.stringify(e5);
    }
  };
  var __PRIVATE_MemorySharedClientState = class {
    constructor() {
      this.no = new __PRIVATE_LocalClientState(), this.ro = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
    }
    addPendingMutation(e5) {
    }
    updateMutationState(e5, t4, n5) {
    }
    addLocalQueryTarget(e5) {
      return this.no.As(e5), this.ro[e5] || "not-current";
    }
    updateQueryState(e5, t4, n5) {
      this.ro[e5] = t4;
    }
    removeLocalQueryTarget(e5) {
      this.no.Rs(e5);
    }
    isLocalQueryTarget(e5) {
      return this.no.activeTargetIds.has(e5);
    }
    clearQueryState(e5) {
      delete this.ro[e5];
    }
    getAllActiveQueryTargets() {
      return this.no.activeTargetIds;
    }
    isActiveQueryTarget(e5) {
      return this.no.activeTargetIds.has(e5);
    }
    start() {
      return this.no = new __PRIVATE_LocalClientState(), Promise.resolve();
    }
    handleUserChange(e5, t4, n5) {
    }
    setOnlineState(e5) {
    }
    shutdown() {
    }
    writeSequenceNumber(e5) {
    }
    notifyBundleLoaded(e5) {
    }
  };
  var __PRIVATE_NoopConnectivityMonitor = class {
    io(e5) {
    }
    shutdown() {
    }
  };
  var __PRIVATE_BrowserConnectivityMonitor = class {
    constructor() {
      this.so = () => this.oo(), this._o = () => this.ao(), this.uo = [], this.co();
    }
    io(e5) {
      this.uo.push(e5);
    }
    shutdown() {
      window.removeEventListener("online", this.so), window.removeEventListener("offline", this._o);
    }
    co() {
      window.addEventListener("online", this.so), window.addEventListener("offline", this._o);
    }
    oo() {
      __PRIVATE_logDebug("ConnectivityMonitor", "Network connectivity changed: AVAILABLE");
      for (const e5 of this.uo) e5(
        0
        /* NetworkStatus.AVAILABLE */
      );
    }
    ao() {
      __PRIVATE_logDebug("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE");
      for (const e5 of this.uo) e5(
        1
        /* NetworkStatus.UNAVAILABLE */
      );
    }
    // TODO(chenbrian): Consider passing in window either into this component or
    // here for testing via FakeWindow.
    /** Checks that all used attributes of window are available. */
    static D() {
      return "undefined" != typeof window && void 0 !== window.addEventListener && void 0 !== window.removeEventListener;
    }
  };
  var Ve = null;
  function __PRIVATE_generateUniqueDebugId() {
    return null === Ve ? Ve = function __PRIVATE_generateInitialUniqueDebugId() {
      return 268435456 + Math.round(2147483648 * Math.random());
    }() : Ve++, "0x" + Ve.toString(16);
  }
  var me = {
    BatchGetDocuments: "batchGet",
    Commit: "commit",
    RunQuery: "runQuery",
    RunAggregationQuery: "runAggregationQuery"
  };
  var __PRIVATE_StreamBridge = class {
    constructor(e5) {
      this.lo = e5.lo, this.ho = e5.ho;
    }
    Po(e5) {
      this.Io = e5;
    }
    To(e5) {
      this.Eo = e5;
    }
    Ao(e5) {
      this.Ro = e5;
    }
    onMessage(e5) {
      this.Vo = e5;
    }
    close() {
      this.ho();
    }
    send(e5) {
      this.lo(e5);
    }
    mo() {
      this.Io();
    }
    fo() {
      this.Eo();
    }
    po(e5) {
      this.Ro(e5);
    }
    yo(e5) {
      this.Vo(e5);
    }
  };
  var fe = "WebChannelConnection";
  var __PRIVATE_WebChannelConnection = class extends /**
   * Base class for all Rest-based connections to the backend (WebChannel and
   * HTTP).
   */
  class __PRIVATE_RestConnection {
    constructor(e5) {
      this.databaseInfo = e5, this.databaseId = e5.databaseId;
      const t4 = e5.ssl ? "https" : "http", n5 = encodeURIComponent(this.databaseId.projectId), r5 = encodeURIComponent(this.databaseId.database);
      this.wo = t4 + "://" + e5.host, this.So = `projects/${n5}/databases/${r5}`, this.bo = "(default)" === this.databaseId.database ? `project_id=${n5}` : `project_id=${n5}&database_id=${r5}`;
    }
    get Do() {
      return false;
    }
    Co(e5, t4, n5, r5, i4) {
      const s4 = __PRIVATE_generateUniqueDebugId(), o4 = this.vo(e5, t4.toUriEncodedString());
      __PRIVATE_logDebug("RestConnection", `Sending RPC '${e5}' ${s4}:`, o4, n5);
      const _2 = {
        "google-cloud-resource-prefix": this.So,
        "x-goog-request-params": this.bo
      };
      return this.Fo(_2, r5, i4), this.Mo(e5, o4, _2, n5).then((t5) => (__PRIVATE_logDebug("RestConnection", `Received RPC '${e5}' ${s4}: `, t5), t5), (t5) => {
        throw __PRIVATE_logWarn("RestConnection", `RPC '${e5}' ${s4} failed with error: `, t5, "url: ", o4, "request:", n5), t5;
      });
    }
    xo(e5, t4, n5, r5, i4, s4) {
      return this.Co(e5, t4, n5, r5, i4);
    }
    /**
     * Modifies the headers for a request, adding any authorization token if
     * present and any additional headers for the request.
     */
    Fo(e5, t4, n5) {
      e5["X-Goog-Api-Client"] = // SDK_VERSION is updated to different value at runtime depending on the entry point,
      // so we need to get its value when we need it in a function.
      function __PRIVATE_getGoogApiClientValue() {
        return "gl-js/ fire/" + b3;
      }(), // Content-Type: text/plain will avoid preflight requests which might
      // mess with CORS and redirects by proxies. If we add custom headers
      // we will need to change this code to potentially use the $httpOverwrite
      // parameter supported by ESF to avoid triggering preflight requests.
      e5["Content-Type"] = "text/plain", this.databaseInfo.appId && (e5["X-Firebase-GMPID"] = this.databaseInfo.appId), t4 && t4.headers.forEach((t5, n6) => e5[n6] = t5), n5 && n5.headers.forEach((t5, n6) => e5[n6] = t5);
    }
    vo(e5, t4) {
      const n5 = me[e5];
      return `${this.wo}/v1/${t4}:${n5}`;
    }
    /**
     * Closes and cleans up any resources associated with the connection. This
     * implementation is a no-op because there are no resources associated
     * with the RestConnection that need to be cleaned up.
     */
    terminate() {
    }
  } {
    constructor(e5) {
      super(e5), this.forceLongPolling = e5.forceLongPolling, this.autoDetectLongPolling = e5.autoDetectLongPolling, this.useFetchStreams = e5.useFetchStreams, this.longPollingOptions = e5.longPollingOptions;
    }
    Mo(e5, t4, n5, r5) {
      const i4 = __PRIVATE_generateUniqueDebugId();
      return new Promise((s4, o4) => {
        const _2 = new XhrIo();
        _2.setWithCredentials(true), _2.listenOnce(EventType.COMPLETE, () => {
          try {
            switch (_2.getLastErrorCode()) {
              case ErrorCode.NO_ERROR:
                const t5 = _2.getResponseJson();
                __PRIVATE_logDebug(fe, `XHR for RPC '${e5}' ${i4} received:`, JSON.stringify(t5)), s4(t5);
                break;
              case ErrorCode.TIMEOUT:
                __PRIVATE_logDebug(fe, `RPC '${e5}' ${i4} timed out`), o4(new FirestoreError(C2.DEADLINE_EXCEEDED, "Request time out"));
                break;
              case ErrorCode.HTTP_ERROR:
                const n6 = _2.getStatus();
                if (__PRIVATE_logDebug(fe, `RPC '${e5}' ${i4} failed with status:`, n6, "response text:", _2.getResponseText()), n6 > 0) {
                  let e6 = _2.getResponseJson();
                  Array.isArray(e6) && (e6 = e6[0]);
                  const t6 = null == e6 ? void 0 : e6.error;
                  if (t6 && t6.status && t6.message) {
                    const e7 = function __PRIVATE_mapCodeFromHttpResponseErrorStatus(e8) {
                      const t7 = e8.toLowerCase().replace(/_/g, "-");
                      return Object.values(C2).indexOf(t7) >= 0 ? t7 : C2.UNKNOWN;
                    }(t6.status);
                    o4(new FirestoreError(e7, t6.message));
                  } else o4(new FirestoreError(C2.UNKNOWN, "Server responded with status " + _2.getStatus()));
                } else
                  o4(new FirestoreError(C2.UNAVAILABLE, "Connection failed."));
                break;
              default:
                fail();
            }
          } finally {
            __PRIVATE_logDebug(fe, `RPC '${e5}' ${i4} completed.`);
          }
        });
        const a3 = JSON.stringify(r5);
        __PRIVATE_logDebug(fe, `RPC '${e5}' ${i4} sending request:`, r5), _2.send(t4, "POST", a3, n5, 15);
      });
    }
    Oo(e5, t4, n5) {
      const r5 = __PRIVATE_generateUniqueDebugId(), i4 = [this.wo, "/", "google.firestore.v1.Firestore", "/", e5, "/channel"], s4 = createWebChannelTransport(), o4 = getStatEventTarget(), _2 = {
        // Required for backend stickiness, routing behavior is based on this
        // parameter.
        httpSessionIdParam: "gsessionid",
        initMessageHeaders: {},
        messageUrlParams: {
          // This param is used to improve routing and project isolation by the
          // backend and must be included in every request.
          database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
        },
        sendRawJson: true,
        supportsCrossDomainXhr: true,
        internalChannelParams: {
          // Override the default timeout (randomized between 10-20 seconds) since
          // a large write batch on a slow internet connection may take a long
          // time to send to the backend. Rather than have WebChannel impose a
          // tight timeout which could lead to infinite timeouts and retries, we
          // set it very large (5-10 minutes) and rely on the browser's builtin
          // timeouts to kick in if the request isn't working.
          forwardChannelRequestTimeoutMs: 6e5
        },
        forceLongPolling: this.forceLongPolling,
        detectBufferingProxy: this.autoDetectLongPolling
      }, a3 = this.longPollingOptions.timeoutSeconds;
      void 0 !== a3 && (_2.longPollingTimeout = Math.round(1e3 * a3)), this.useFetchStreams && (_2.xmlHttpFactory = new FetchXmlHttpFactory({})), this.Fo(_2.initMessageHeaders, t4, n5), // Sending the custom headers we just added to request.initMessageHeaders
      // (Authorization, etc.) will trigger the browser to make a CORS preflight
      // request because the XHR will no longer meet the criteria for a "simple"
      // CORS request:
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests
      // Therefore to avoid the CORS preflight request (an extra network
      // roundtrip), we use the encodeInitMessageHeaders option to specify that
      // the headers should instead be encoded in the request's POST payload,
      // which is recognized by the webchannel backend.
      _2.encodeInitMessageHeaders = true;
      const u3 = i4.join("");
      __PRIVATE_logDebug(fe, `Creating RPC '${e5}' stream ${r5}: ${u3}`, _2);
      const c4 = s4.createWebChannel(u3, _2);
      let l3 = false, h3 = false;
      const P2 = new __PRIVATE_StreamBridge({
        lo: (t5) => {
          h3 ? __PRIVATE_logDebug(fe, `Not sending because RPC '${e5}' stream ${r5} is closed:`, t5) : (l3 || (__PRIVATE_logDebug(fe, `Opening RPC '${e5}' stream ${r5} transport.`), c4.open(), l3 = true), __PRIVATE_logDebug(fe, `RPC '${e5}' stream ${r5} sending:`, t5), c4.send(t5));
        },
        ho: () => c4.close()
      }), __PRIVATE_unguardedEventListen = (e6, t5, n6) => {
        e6.listen(t5, (e7) => {
          try {
            n6(e7);
          } catch (e8) {
            setTimeout(() => {
              throw e8;
            }, 0);
          }
        });
      };
      return __PRIVATE_unguardedEventListen(c4, WebChannel.EventType.OPEN, () => {
        h3 || (__PRIVATE_logDebug(fe, `RPC '${e5}' stream ${r5} transport opened.`), P2.mo());
      }), __PRIVATE_unguardedEventListen(c4, WebChannel.EventType.CLOSE, () => {
        h3 || (h3 = true, __PRIVATE_logDebug(fe, `RPC '${e5}' stream ${r5} transport closed`), P2.po());
      }), __PRIVATE_unguardedEventListen(c4, WebChannel.EventType.ERROR, (t5) => {
        h3 || (h3 = true, __PRIVATE_logWarn(fe, `RPC '${e5}' stream ${r5} transport errored:`, t5), P2.po(new FirestoreError(C2.UNAVAILABLE, "The operation could not be completed")));
      }), __PRIVATE_unguardedEventListen(c4, WebChannel.EventType.MESSAGE, (t5) => {
        var n6;
        if (!h3) {
          const i5 = t5.data[0];
          __PRIVATE_hardAssert(!!i5);
          const s5 = i5, o5 = s5.error || (null === (n6 = s5[0]) || void 0 === n6 ? void 0 : n6.error);
          if (o5) {
            __PRIVATE_logDebug(fe, `RPC '${e5}' stream ${r5} received error:`, o5);
            const t6 = o5.status;
            let n7 = (
              /**
              * Maps an error Code from a GRPC status identifier like 'NOT_FOUND'.
              *
              * @returns The Code equivalent to the given status string or undefined if
              *     there is no match.
              */
              function __PRIVATE_mapCodeFromRpcStatus(e6) {
                const t7 = ce[e6];
                if (void 0 !== t7) return __PRIVATE_mapCodeFromRpcCode(t7);
              }(t6)
            ), i6 = o5.message;
            void 0 === n7 && (n7 = C2.INTERNAL, i6 = "Unknown error status: " + t6 + " with message " + o5.message), // Mark closed so no further events are propagated
            h3 = true, P2.po(new FirestoreError(n7, i6)), c4.close();
          } else __PRIVATE_logDebug(fe, `RPC '${e5}' stream ${r5} received:`, i5), P2.yo(i5);
        }
      }), __PRIVATE_unguardedEventListen(o4, Event.STAT_EVENT, (t5) => {
        t5.stat === Stat.PROXY ? __PRIVATE_logDebug(fe, `RPC '${e5}' stream ${r5} detected buffering proxy`) : t5.stat === Stat.NOPROXY && __PRIVATE_logDebug(fe, `RPC '${e5}' stream ${r5} detected no buffering proxy`);
      }), setTimeout(() => {
        P2.fo();
      }, 0), P2;
    }
  };
  function __PRIVATE_getWindow() {
    return "undefined" != typeof window ? window : null;
  }
  function getDocument() {
    return "undefined" != typeof document ? document : null;
  }
  function __PRIVATE_newSerializer(e5) {
    return new JsonProtoSerializer(
      e5,
      /* useProto3Json= */
      true
    );
  }
  var __PRIVATE_ExponentialBackoff = class {
    constructor(e5, t4, n5 = 1e3, r5 = 1.5, i4 = 6e4) {
      this.oi = e5, this.timerId = t4, this.No = n5, this.Lo = r5, this.Bo = i4, this.ko = 0, this.qo = null, /** The last backoff attempt, as epoch milliseconds. */
      this.Qo = Date.now(), this.reset();
    }
    /**
     * Resets the backoff delay.
     *
     * The very next backoffAndWait() will have no delay. If it is called again
     * (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
     * subsequent ones will increase according to the backoffFactor.
     */
    reset() {
      this.ko = 0;
    }
    /**
     * Resets the backoff delay to the maximum delay (e.g. for use after a
     * RESOURCE_EXHAUSTED error).
     */
    Ko() {
      this.ko = this.Bo;
    }
    /**
     * Returns a promise that resolves after currentDelayMs, and increases the
     * delay for any subsequent attempts. If there was a pending backoff operation
     * already, it will be canceled.
     */
    $o(e5) {
      this.cancel();
      const t4 = Math.floor(this.ko + this.Uo()), n5 = Math.max(0, Date.now() - this.Qo), r5 = Math.max(0, t4 - n5);
      r5 > 0 && __PRIVATE_logDebug("ExponentialBackoff", `Backing off for ${r5} ms (base delay: ${this.ko} ms, delay with jitter: ${t4} ms, last attempt: ${n5} ms ago)`), this.qo = this.oi.enqueueAfterDelay(this.timerId, r5, () => (this.Qo = Date.now(), e5())), // Apply backoff factor to determine next delay and ensure it is within
      // bounds.
      this.ko *= this.Lo, this.ko < this.No && (this.ko = this.No), this.ko > this.Bo && (this.ko = this.Bo);
    }
    Wo() {
      null !== this.qo && (this.qo.skipDelay(), this.qo = null);
    }
    cancel() {
      null !== this.qo && (this.qo.cancel(), this.qo = null);
    }
    /** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */
    Uo() {
      return (Math.random() - 0.5) * this.ko;
    }
  };
  var __PRIVATE_PersistentStream = class {
    constructor(e5, t4, n5, r5, i4, s4, o4, _2) {
      this.oi = e5, this.Go = n5, this.zo = r5, this.connection = i4, this.authCredentialsProvider = s4, this.appCheckCredentialsProvider = o4, this.listener = _2, this.state = 0, /**
       * A close count that's incremented every time the stream is closed; used by
       * getCloseGuardedDispatcher() to invalidate callbacks that happen after
       * close.
       */
      this.jo = 0, this.Ho = null, this.Jo = null, this.stream = null, this.Yo = new __PRIVATE_ExponentialBackoff(e5, t4);
    }
    /**
     * Returns true if start() has been called and no error has occurred. True
     * indicates the stream is open or in the process of opening (which
     * encompasses respecting backoff, getting auth tokens, and starting the
     * actual RPC). Use isOpen() to determine if the stream is open and ready for
     * outbound requests.
     */
    Zo() {
      return 1 === this.state || 5 === this.state || this.Xo();
    }
    /**
     * Returns true if the underlying RPC is open (the onOpen() listener has been
     * called) and the stream is ready for outbound requests.
     */
    Xo() {
      return 2 === this.state || 3 === this.state;
    }
    /**
     * Starts the RPC. Only allowed if isStarted() returns false. The stream is
     * not immediately ready for use: onOpen() will be invoked when the RPC is
     * ready for outbound requests, at which point isOpen() will return true.
     *
     * When start returns, isStarted() will return true.
     */
    start() {
      4 !== this.state ? this.auth() : this.e_();
    }
    /**
     * Stops the RPC. This call is idempotent and allowed regardless of the
     * current isStarted() state.
     *
     * When stop returns, isStarted() and isOpen() will both return false.
     */
    async stop() {
      this.Zo() && await this.close(
        0
        /* PersistentStreamState.Initial */
      );
    }
    /**
     * After an error the stream will usually back off on the next attempt to
     * start it. If the error warrants an immediate restart of the stream, the
     * sender can use this to indicate that the receiver should not back off.
     *
     * Each error will call the onClose() listener. That function can decide to
     * inhibit backoff if required.
     */
    t_() {
      this.state = 0, this.Yo.reset();
    }
    /**
     * Marks this stream as idle. If no further actions are performed on the
     * stream for one minute, the stream will automatically close itself and
     * notify the stream's onClose() handler with Status.OK. The stream will then
     * be in a !isStarted() state, requiring the caller to start the stream again
     * before further use.
     *
     * Only streams that are in state 'Open' can be marked idle, as all other
     * states imply pending network operations.
     */
    n_() {
      this.Xo() && null === this.Ho && (this.Ho = this.oi.enqueueAfterDelay(this.Go, 6e4, () => this.r_()));
    }
    /** Sends a message to the underlying stream. */
    i_(e5) {
      this.s_(), this.stream.send(e5);
    }
    /** Called by the idle timer when the stream should close due to inactivity. */
    async r_() {
      if (this.Xo())
        return this.close(
          0
          /* PersistentStreamState.Initial */
        );
    }
    /** Marks the stream as active again. */
    s_() {
      this.Ho && (this.Ho.cancel(), this.Ho = null);
    }
    /** Cancels the health check delayed operation. */
    o_() {
      this.Jo && (this.Jo.cancel(), this.Jo = null);
    }
    /**
     * Closes the stream and cleans up as necessary:
     *
     * * closes the underlying GRPC stream;
     * * calls the onClose handler with the given 'error';
     * * sets internal stream state to 'finalState';
     * * adjusts the backoff timer based on the error
     *
     * A new stream can be opened by calling start().
     *
     * @param finalState - the intended state of the stream after closing.
     * @param error - the error the connection was closed with.
     */
    async close(e5, t4) {
      this.s_(), this.o_(), this.Yo.cancel(), // Invalidates any stream-related callbacks (e.g. from auth or the
      // underlying stream), guaranteeing they won't execute.
      this.jo++, 4 !== e5 ? (
        // If this is an intentional close ensure we don't delay our next connection attempt.
        this.Yo.reset()
      ) : t4 && t4.code === C2.RESOURCE_EXHAUSTED ? (
        // Log the error. (Probably either 'quota exceeded' or 'max queue length reached'.)
        (__PRIVATE_logError(t4.toString()), __PRIVATE_logError("Using maximum backoff delay to prevent overloading the backend."), this.Yo.Ko())
      ) : t4 && t4.code === C2.UNAUTHENTICATED && 3 !== this.state && // "unauthenticated" error means the token was rejected. This should rarely
      // happen since both Auth and AppCheck ensure a sufficient TTL when we
      // request a token. If a user manually resets their system clock this can
      // fail, however. In this case, we should get a Code.UNAUTHENTICATED error
      // before we received the first message and we need to invalidate the token
      // to ensure that we fetch a new token.
      (this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), // Clean up the underlying stream because we are no longer interested in events.
      null !== this.stream && (this.__(), this.stream.close(), this.stream = null), // This state must be assigned before calling onClose() to allow the callback to
      // inhibit backoff or otherwise manipulate the state in its non-started state.
      this.state = e5, // Notify the listener that the stream closed.
      await this.listener.Ao(t4);
    }
    /**
     * Can be overridden to perform additional cleanup before the stream is closed.
     * Calling super.tearDown() is not required.
     */
    __() {
    }
    auth() {
      this.state = 1;
      const e5 = this.a_(this.jo), t4 = this.jo;
      Promise.all([this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken()]).then(([e6, n5]) => {
        this.jo === t4 && // Normally we'd have to schedule the callback on the AsyncQueue.
        // However, the following calls are safe to be called outside the
        // AsyncQueue since they don't chain asynchronous calls
        this.u_(e6, n5);
      }, (t5) => {
        e5(() => {
          const e6 = new FirestoreError(C2.UNKNOWN, "Fetching auth token failed: " + t5.message);
          return this.c_(e6);
        });
      });
    }
    u_(e5, t4) {
      const n5 = this.a_(this.jo);
      this.stream = this.l_(e5, t4), this.stream.Po(() => {
        n5(() => this.listener.Po());
      }), this.stream.To(() => {
        n5(() => (this.state = 2, this.Jo = this.oi.enqueueAfterDelay(this.zo, 1e4, () => (this.Xo() && (this.state = 3), Promise.resolve())), this.listener.To()));
      }), this.stream.Ao((e6) => {
        n5(() => this.c_(e6));
      }), this.stream.onMessage((e6) => {
        n5(() => this.onMessage(e6));
      });
    }
    e_() {
      this.state = 5, this.Yo.$o(async () => {
        this.state = 0, this.start();
      });
    }
    // Visible for tests
    c_(e5) {
      return __PRIVATE_logDebug("PersistentStream", `close with error: ${e5}`), this.stream = null, this.close(4, e5);
    }
    /**
     * Returns a "dispatcher" function that dispatches operations onto the
     * AsyncQueue but only runs them if closeCount remains unchanged. This allows
     * us to turn auth / stream callbacks into no-ops if the stream is closed /
     * re-opened, etc.
     */
    a_(e5) {
      return (t4) => {
        this.oi.enqueueAndForget(() => this.jo === e5 ? t4() : (__PRIVATE_logDebug("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
      };
    }
  };
  var __PRIVATE_PersistentWriteStream = class extends __PRIVATE_PersistentStream {
    constructor(e5, t4, n5, r5, i4, s4) {
      super(e5, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", t4, n5, r5, s4), this.serializer = i4, this.T_ = false;
    }
    /**
     * Tracks whether or not a handshake has been successfully exchanged and
     * the stream is ready to accept mutations.
     */
    get E_() {
      return this.T_;
    }
    // Override of PersistentStream.start
    start() {
      this.T_ = false, this.lastStreamToken = void 0, super.start();
    }
    __() {
      this.T_ && this.d_([]);
    }
    l_(e5, t4) {
      return this.connection.Oo("Write", e5, t4);
    }
    onMessage(e5) {
      if (
        // Always capture the last stream token.
        __PRIVATE_hardAssert(!!e5.streamToken), this.lastStreamToken = e5.streamToken, this.T_
      ) {
        this.Yo.reset();
        const t4 = __PRIVATE_fromWriteResults(e5.writeResults, e5.commitTime), n5 = __PRIVATE_fromVersion(e5.commitTime);
        return this.listener.A_(n5, t4);
      }
      return __PRIVATE_hardAssert(!e5.writeResults || 0 === e5.writeResults.length), this.T_ = true, this.listener.R_();
    }
    /**
     * Sends an initial streamToken to the server, performing the handshake
     * required to make the StreamingWrite RPC work. Subsequent
     * calls should wait until onHandshakeComplete was called.
     */
    V_() {
      const e5 = {};
      e5.database = __PRIVATE_getEncodedDatabaseId(this.serializer), this.i_(e5);
    }
    /** Sends a group of mutations to the Firestore backend to apply. */
    d_(e5) {
      const t4 = {
        streamToken: this.lastStreamToken,
        writes: e5.map((e6) => toMutation(this.serializer, e6))
      };
      this.i_(t4);
    }
  };
  var __PRIVATE_DatastoreImpl = class extends class Datastore {
  } {
    constructor(e5, t4, n5, r5) {
      super(), this.authCredentials = e5, this.appCheckCredentials = t4, this.connection = n5, this.serializer = r5, this.m_ = false;
    }
    f_() {
      if (this.m_) throw new FirestoreError(C2.FAILED_PRECONDITION, "The client has already been terminated.");
    }
    /** Invokes the provided RPC with auth and AppCheck tokens. */
    Co(e5, t4, n5, r5) {
      return this.f_(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([i4, s4]) => this.connection.Co(e5, __PRIVATE_toResourcePath(t4, n5), r5, i4, s4)).catch((e6) => {
        throw "FirebaseError" === e6.name ? (e6.code === C2.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e6) : new FirestoreError(C2.UNKNOWN, e6.toString());
      });
    }
    /** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */
    xo(e5, t4, n5, r5, i4) {
      return this.f_(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([s4, o4]) => this.connection.xo(e5, __PRIVATE_toResourcePath(t4, n5), r5, s4, o4, i4)).catch((e6) => {
        throw "FirebaseError" === e6.name ? (e6.code === C2.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e6) : new FirestoreError(C2.UNKNOWN, e6.toString());
      });
    }
    terminate() {
      this.m_ = true, this.connection.terminate();
    }
  };
  var __PRIVATE_OnlineStateTracker = class {
    constructor(e5, t4) {
      this.asyncQueue = e5, this.onlineStateHandler = t4, /** The current OnlineState. */
      this.state = "Unknown", /**
       * A count of consecutive failures to open the stream. If it reaches the
       * maximum defined by MAX_WATCH_STREAM_FAILURES, we'll set the OnlineState to
       * Offline.
       */
      this.g_ = 0, /**
       * A timer that elapses after ONLINE_STATE_TIMEOUT_MS, at which point we
       * transition from OnlineState.Unknown to OnlineState.Offline without waiting
       * for the stream to actually fail (MAX_WATCH_STREAM_FAILURES times).
       */
      this.p_ = null, /**
       * Whether the client should log a warning message if it fails to connect to
       * the backend (initially true, cleared after a successful stream, or if we've
       * logged the message already).
       */
      this.y_ = true;
    }
    /**
     * Called by RemoteStore when a watch stream is started (including on each
     * backoff attempt).
     *
     * If this is the first attempt, it sets the OnlineState to Unknown and starts
     * the onlineStateTimer.
     */
    w_() {
      0 === this.g_ && (this.S_(
        "Unknown"
        /* OnlineState.Unknown */
      ), this.p_ = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, () => (this.p_ = null, this.b_("Backend didn't respond within 10 seconds."), this.S_(
        "Offline"
        /* OnlineState.Offline */
      ), Promise.resolve())));
    }
    /**
     * Updates our OnlineState as appropriate after the watch stream reports a
     * failure. The first failure moves us to the 'Unknown' state. We then may
     * allow multiple failures (based on MAX_WATCH_STREAM_FAILURES) before we
     * actually transition to the 'Offline' state.
     */
    D_(e5) {
      "Online" === this.state ? this.S_(
        "Unknown"
        /* OnlineState.Unknown */
      ) : (this.g_++, this.g_ >= 1 && (this.C_(), this.b_(`Connection failed 1 times. Most recent error: ${e5.toString()}`), this.S_(
        "Offline"
        /* OnlineState.Offline */
      )));
    }
    /**
     * Explicitly sets the OnlineState to the specified state.
     *
     * Note that this resets our timers / failure counters, etc. used by our
     * Offline heuristics, so must not be used in place of
     * handleWatchStreamStart() and handleWatchStreamFailure().
     */
    set(e5) {
      this.C_(), this.g_ = 0, "Online" === e5 && // We've connected to watch at least once. Don't warn the developer
      // about being offline going forward.
      (this.y_ = false), this.S_(e5);
    }
    S_(e5) {
      e5 !== this.state && (this.state = e5, this.onlineStateHandler(e5));
    }
    b_(e5) {
      const t4 = `Could not reach Cloud Firestore backend. ${e5}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
      this.y_ ? (__PRIVATE_logError(t4), this.y_ = false) : __PRIVATE_logDebug("OnlineStateTracker", t4);
    }
    C_() {
      null !== this.p_ && (this.p_.cancel(), this.p_ = null);
    }
  };
  var __PRIVATE_RemoteStoreImpl = class {
    constructor(e5, t4, n5, r5, i4) {
      this.localStore = e5, this.datastore = t4, this.asyncQueue = n5, this.remoteSyncer = {}, /**
       * A list of up to MAX_PENDING_WRITES writes that we have fetched from the
       * LocalStore via fillWritePipeline() and have or will send to the write
       * stream.
       *
       * Whenever writePipeline.length > 0 the RemoteStore will attempt to start or
       * restart the write stream. When the stream is established the writes in the
       * pipeline will be sent in order.
       *
       * Writes remain in writePipeline until they are acknowledged by the backend
       * and thus will automatically be re-sent if the stream is interrupted /
       * restarted before they're acknowledged.
       *
       * Write responses from the backend are linked to their originating request
       * purely based on order, and so we can just shift() writes from the front of
       * the writePipeline as we receive responses.
       */
      this.v_ = [], /**
       * A mapping of watched targets that the client cares about tracking and the
       * user has explicitly called a 'listen' for this target.
       *
       * These targets may or may not have been sent to or acknowledged by the
       * server. On re-establishing the listen stream, these targets should be sent
       * to the server. The targets removed with unlistens are removed eagerly
       * without waiting for confirmation from the listen stream.
       */
      this.F_ = /* @__PURE__ */ new Map(), /**
       * A set of reasons for why the RemoteStore may be offline. If empty, the
       * RemoteStore may start its network connections.
       */
      this.M_ = /* @__PURE__ */ new Set(), /**
       * Event handlers that get called when the network is disabled or enabled.
       *
       * PORTING NOTE: These functions are used on the Web client to create the
       * underlying streams (to support tree-shakeable streams). On Android and iOS,
       * the streams are created during construction of RemoteStore.
       */
      this.x_ = [], this.O_ = i4, this.O_.io((e6) => {
        n5.enqueueAndForget(async () => {
          __PRIVATE_canUseNetwork(this) && (__PRIVATE_logDebug("RemoteStore", "Restarting streams for network reachability change."), await async function __PRIVATE_restartNetwork(e7) {
            const t5 = __PRIVATE_debugCast(e7);
            t5.M_.add(
              4
              /* OfflineCause.ConnectivityChange */
            ), await __PRIVATE_disableNetworkInternal(t5), t5.N_.set(
              "Unknown"
              /* OnlineState.Unknown */
            ), t5.M_.delete(
              4
              /* OfflineCause.ConnectivityChange */
            ), await __PRIVATE_enableNetworkInternal(t5);
          }(this));
        });
      }), this.N_ = new __PRIVATE_OnlineStateTracker(n5, r5);
    }
  };
  async function __PRIVATE_enableNetworkInternal(e5) {
    if (__PRIVATE_canUseNetwork(e5)) for (const t4 of e5.x_) await t4(
      /* enabled= */
      true
    );
  }
  async function __PRIVATE_disableNetworkInternal(e5) {
    for (const t4 of e5.x_) await t4(
      /* enabled= */
      false
    );
  }
  function __PRIVATE_canUseNetwork(e5) {
    return 0 === __PRIVATE_debugCast(e5).M_.size;
  }
  async function __PRIVATE_disableNetworkUntilRecovery(e5, t4, n5) {
    if (!__PRIVATE_isIndexedDbTransactionError(t4)) throw t4;
    e5.M_.add(
      1
      /* OfflineCause.IndexedDbFailed */
    ), // Disable network and raise offline snapshots
    await __PRIVATE_disableNetworkInternal(e5), e5.N_.set(
      "Offline"
      /* OnlineState.Offline */
    ), n5 || // Use a simple read operation to determine if IndexedDB recovered.
    // Ideally, we would expose a health check directly on SimpleDb, but
    // RemoteStore only has access to persistence through LocalStore.
    (n5 = () => __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e5.localStore)), // Probe IndexedDB periodically and re-enable network
    e5.asyncQueue.enqueueRetryable(async () => {
      __PRIVATE_logDebug("RemoteStore", "Retrying IndexedDB access"), await n5(), e5.M_.delete(
        1
        /* OfflineCause.IndexedDbFailed */
      ), await __PRIVATE_enableNetworkInternal(e5);
    });
  }
  function __PRIVATE_executeWithRecovery(e5, t4) {
    return t4().catch((n5) => __PRIVATE_disableNetworkUntilRecovery(e5, n5, t4));
  }
  async function __PRIVATE_fillWritePipeline(e5) {
    const t4 = __PRIVATE_debugCast(e5), n5 = __PRIVATE_ensureWriteStream(t4);
    let r5 = t4.v_.length > 0 ? t4.v_[t4.v_.length - 1].batchId : -1;
    for (; __PRIVATE_canAddToWritePipeline(t4); ) try {
      const e6 = await __PRIVATE_localStoreGetNextMutationBatch(t4.localStore, r5);
      if (null === e6) {
        0 === t4.v_.length && n5.n_();
        break;
      }
      r5 = e6.batchId, __PRIVATE_addToWritePipeline(t4, e6);
    } catch (e6) {
      await __PRIVATE_disableNetworkUntilRecovery(t4, e6);
    }
    __PRIVATE_shouldStartWriteStream(t4) && __PRIVATE_startWriteStream(t4);
  }
  function __PRIVATE_canAddToWritePipeline(e5) {
    return __PRIVATE_canUseNetwork(e5) && e5.v_.length < 10;
  }
  function __PRIVATE_addToWritePipeline(e5, t4) {
    e5.v_.push(t4);
    const n5 = __PRIVATE_ensureWriteStream(e5);
    n5.Xo() && n5.E_ && n5.d_(t4.mutations);
  }
  function __PRIVATE_shouldStartWriteStream(e5) {
    return __PRIVATE_canUseNetwork(e5) && !__PRIVATE_ensureWriteStream(e5).Zo() && e5.v_.length > 0;
  }
  function __PRIVATE_startWriteStream(e5) {
    __PRIVATE_ensureWriteStream(e5).start();
  }
  async function __PRIVATE_onWriteStreamOpen(e5) {
    __PRIVATE_ensureWriteStream(e5).V_();
  }
  async function __PRIVATE_onWriteHandshakeComplete(e5) {
    const t4 = __PRIVATE_ensureWriteStream(e5);
    for (const n5 of e5.v_) t4.d_(n5.mutations);
  }
  async function __PRIVATE_onMutationResult(e5, t4, n5) {
    const r5 = e5.v_.shift(), i4 = MutationBatchResult.from(r5, t4, n5);
    await __PRIVATE_executeWithRecovery(e5, () => e5.remoteSyncer.applySuccessfulWrite(i4)), // It's possible that with the completion of this mutation another
    // slot has freed up.
    await __PRIVATE_fillWritePipeline(e5);
  }
  async function __PRIVATE_onWriteStreamClose(e5, t4) {
    t4 && __PRIVATE_ensureWriteStream(e5).E_ && // This error affects the actual write.
    await async function __PRIVATE_handleWriteError(e6, t5) {
      if (function __PRIVATE_isPermanentWriteError(e7) {
        return __PRIVATE_isPermanentError(e7) && e7 !== C2.ABORTED;
      }(t5.code)) {
        const n5 = e6.v_.shift();
        __PRIVATE_ensureWriteStream(e6).t_(), await __PRIVATE_executeWithRecovery(e6, () => e6.remoteSyncer.rejectFailedWrite(n5.batchId, t5)), // It's possible that with the completion of this mutation
        // another slot has freed up.
        await __PRIVATE_fillWritePipeline(e6);
      }
    }(e5, t4), // The write stream might have been started by refilling the write
    // pipeline for failed writes
    __PRIVATE_shouldStartWriteStream(e5) && __PRIVATE_startWriteStream(e5);
  }
  async function __PRIVATE_remoteStoreApplyPrimaryState(e5, t4) {
    const n5 = __PRIVATE_debugCast(e5);
    t4 ? (n5.M_.delete(
      2
      /* OfflineCause.IsSecondary */
    ), await __PRIVATE_enableNetworkInternal(n5)) : t4 || (n5.M_.add(
      2
      /* OfflineCause.IsSecondary */
    ), await __PRIVATE_disableNetworkInternal(n5), n5.N_.set(
      "Unknown"
      /* OnlineState.Unknown */
    ));
  }
  function __PRIVATE_ensureWriteStream(e5) {
    return e5.k_ || // Create stream (but note that it is not started yet).
    (e5.k_ = function __PRIVATE_newPersistentWriteStream(e6, t4, n5) {
      const r5 = __PRIVATE_debugCast(e6);
      return r5.f_(), new __PRIVATE_PersistentWriteStream(t4, r5.connection, r5.authCredentials, r5.appCheckCredentials, r5.serializer, n5);
    }(e5.datastore, e5.asyncQueue, {
      Po: () => Promise.resolve(),
      To: __PRIVATE_onWriteStreamOpen.bind(null, e5),
      Ao: __PRIVATE_onWriteStreamClose.bind(null, e5),
      R_: __PRIVATE_onWriteHandshakeComplete.bind(null, e5),
      A_: __PRIVATE_onMutationResult.bind(null, e5)
    }), e5.x_.push(async (t4) => {
      t4 ? (e5.k_.t_(), // This will start the write stream if necessary.
      await __PRIVATE_fillWritePipeline(e5)) : (await e5.k_.stop(), e5.v_.length > 0 && (__PRIVATE_logDebug("RemoteStore", `Stopping write stream with ${e5.v_.length} pending writes`), e5.v_ = []));
    })), e5.k_;
  }
  var DelayedOperation = class _DelayedOperation {
    constructor(e5, t4, n5, r5, i4) {
      this.asyncQueue = e5, this.timerId = t4, this.targetTimeMs = n5, this.op = r5, this.removalCallback = i4, this.deferred = new __PRIVATE_Deferred(), this.then = this.deferred.promise.then.bind(this.deferred.promise), // It's normal for the deferred promise to be canceled (due to cancellation)
      // and so we attach a dummy catch callback to avoid
      // 'UnhandledPromiseRejectionWarning' log spam.
      this.deferred.promise.catch((e6) => {
      });
    }
    get promise() {
      return this.deferred.promise;
    }
    /**
     * Creates and returns a DelayedOperation that has been scheduled to be
     * executed on the provided asyncQueue after the provided delayMs.
     *
     * @param asyncQueue - The queue to schedule the operation on.
     * @param id - A Timer ID identifying the type of operation this is.
     * @param delayMs - The delay (ms) before the operation should be scheduled.
     * @param op - The operation to run.
     * @param removalCallback - A callback to be called synchronously once the
     *   operation is executed or canceled, notifying the AsyncQueue to remove it
     *   from its delayedOperations list.
     *   PORTING NOTE: This exists to prevent making removeDelayedOperation() and
     *   the DelayedOperation class public.
     */
    static createAndSchedule(e5, t4, n5, r5, i4) {
      const s4 = Date.now() + n5, o4 = new _DelayedOperation(e5, t4, s4, r5, i4);
      return o4.start(n5), o4;
    }
    /**
     * Starts the timer. This is called immediately after construction by
     * createAndSchedule().
     */
    start(e5) {
      this.timerHandle = setTimeout(() => this.handleDelayElapsed(), e5);
    }
    /**
     * Queues the operation to run immediately (if it hasn't already been run or
     * canceled).
     */
    skipDelay() {
      return this.handleDelayElapsed();
    }
    /**
     * Cancels the operation if it hasn't already been executed or canceled. The
     * promise will be rejected.
     *
     * As long as the operation has not yet been run, calling cancel() provides a
     * guarantee that the operation will not be run.
     */
    cancel(e5) {
      null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new FirestoreError(C2.CANCELLED, "Operation cancelled" + (e5 ? ": " + e5 : ""))));
    }
    handleDelayElapsed() {
      this.asyncQueue.enqueueAndForget(() => null !== this.timerHandle ? (this.clearTimeout(), this.op().then((e5) => this.deferred.resolve(e5))) : Promise.resolve());
    }
    clearTimeout() {
      null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
    }
  };
  function __PRIVATE_wrapInUserErrorIfRecoverable(e5, t4) {
    if (__PRIVATE_logError("AsyncQueue", `${t4}: ${e5}`), __PRIVATE_isIndexedDbTransactionError(e5)) return new FirestoreError(C2.UNAVAILABLE, `${t4}: ${e5}`);
    throw e5;
  }
  var __PRIVATE_EventManagerImpl = class {
    constructor() {
      this.queries = new ObjectMap((e5) => __PRIVATE_canonifyQuery(e5), __PRIVATE_queryEquals), this.onlineState = "Unknown", this.z_ = /* @__PURE__ */ new Set();
    }
  };
  function __PRIVATE_raiseSnapshotsInSyncEvent(e5) {
    e5.z_.forEach((e6) => {
      e6.next();
    });
  }
  var ge;
  var pe;
  (pe = ge || (ge = {})).J_ = "default", /** Listen to changes in cache only */
  pe.Cache = "cache";
  var __PRIVATE_SyncEngineImpl = class {
    constructor(e5, t4, n5, r5, i4, s4) {
      this.localStore = e5, this.remoteStore = t4, this.eventManager = n5, this.sharedClientState = r5, this.currentUser = i4, this.maxConcurrentLimboResolutions = s4, this.Sa = {}, this.ba = new ObjectMap((e6) => __PRIVATE_canonifyQuery(e6), __PRIVATE_queryEquals), this.Da = /* @__PURE__ */ new Map(), /**
       * The keys of documents that are in limbo for which we haven't yet started a
       * limbo resolution query. The strings in this set are the result of calling
       * `key.path.canonicalString()` where `key` is a `DocumentKey` object.
       *
       * The `Set` type was chosen because it provides efficient lookup and removal
       * of arbitrary elements and it also maintains insertion order, providing the
       * desired queue-like FIFO semantics.
       */
      this.Ca = /* @__PURE__ */ new Set(), /**
       * Keeps track of the target ID for each document that is in limbo with an
       * active target.
       */
      this.va = new SortedMap(DocumentKey.comparator), /**
       * Keeps track of the information about an active limbo resolution for each
       * active target ID that was started for the purpose of limbo resolution.
       */
      this.Fa = /* @__PURE__ */ new Map(), this.Ma = new __PRIVATE_ReferenceSet(), /** Stores user completion handlers, indexed by User and BatchId. */
      this.xa = {}, /** Stores user callbacks waiting for all pending writes to be acknowledged. */
      this.Oa = /* @__PURE__ */ new Map(), this.Na = __PRIVATE_TargetIdGenerator.Ln(), this.onlineState = "Unknown", // The primary state is set to `true` or `false` immediately after Firestore
      // startup. In the interim, a client should only be considered primary if
      // `isPrimary` is true.
      this.La = void 0;
    }
    get isPrimaryClient() {
      return true === this.La;
    }
  };
  function __PRIVATE_syncEngineApplyOnlineStateChange(e5, t4, n5) {
    const r5 = __PRIVATE_debugCast(e5);
    if (r5.isPrimaryClient && 0 === n5 || !r5.isPrimaryClient && 1 === n5) {
      const e6 = [];
      r5.ba.forEach((n6, r6) => {
        const i4 = r6.view.j_(t4);
        i4.snapshot && e6.push(i4.snapshot);
      }), function __PRIVATE_eventManagerOnOnlineStateChange(e7, t5) {
        const n6 = __PRIVATE_debugCast(e7);
        n6.onlineState = t5;
        let r6 = false;
        n6.queries.forEach((e8, n7) => {
          for (const e9 of n7.U_)
            e9.j_(t5) && (r6 = true);
        }), r6 && __PRIVATE_raiseSnapshotsInSyncEvent(n6);
      }(r5.eventManager, t4), e6.length && r5.Sa.h_(e6), r5.onlineState = t4, r5.isPrimaryClient && r5.sharedClientState.setOnlineState(t4);
    }
  }
  async function __PRIVATE_syncEngineApplySuccessfulWrite(e5, t4) {
    const n5 = __PRIVATE_debugCast(e5), r5 = t4.batch.batchId;
    try {
      const e6 = await __PRIVATE_localStoreAcknowledgeBatch(n5.localStore, t4);
      __PRIVATE_processUserCallback(
        n5,
        r5,
        /*error=*/
        null
      ), __PRIVATE_triggerPendingWritesCallbacks(n5, r5), n5.sharedClientState.updateMutationState(r5, "acknowledged"), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n5, e6);
    } catch (e6) {
      await __PRIVATE_ignoreIfPrimaryLeaseLoss(e6);
    }
  }
  async function __PRIVATE_syncEngineRejectFailedWrite(e5, t4, n5) {
    const r5 = __PRIVATE_debugCast(e5);
    try {
      const e6 = await function __PRIVATE_localStoreRejectBatch(e7, t5) {
        const n6 = __PRIVATE_debugCast(e7);
        return n6.persistence.runTransaction("Reject batch", "readwrite-primary", (e8) => {
          let r6;
          return n6.mutationQueue.lookupMutationBatch(e8, t5).next((t6) => (__PRIVATE_hardAssert(null !== t6), r6 = t6.keys(), n6.mutationQueue.removeMutationBatch(e8, t6))).next(() => n6.mutationQueue.performConsistencyCheck(e8)).next(() => n6.documentOverlayCache.removeOverlaysForBatchId(e8, r6, t5)).next(() => n6.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e8, r6)).next(() => n6.localDocuments.getDocuments(e8, r6));
        });
      }(r5.localStore, t4);
      __PRIVATE_processUserCallback(r5, t4, n5), __PRIVATE_triggerPendingWritesCallbacks(r5, t4), r5.sharedClientState.updateMutationState(t4, "rejected", n5), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r5, e6);
    } catch (n6) {
      await __PRIVATE_ignoreIfPrimaryLeaseLoss(n6);
    }
  }
  function __PRIVATE_triggerPendingWritesCallbacks(e5, t4) {
    (e5.Oa.get(t4) || []).forEach((e6) => {
      e6.resolve();
    }), e5.Oa.delete(t4);
  }
  function __PRIVATE_processUserCallback(e5, t4, n5) {
    const r5 = __PRIVATE_debugCast(e5);
    let i4 = r5.xa[r5.currentUser.toKey()];
    if (i4) {
      const e6 = i4.get(t4);
      e6 && (n5 ? e6.reject(n5) : e6.resolve(), i4 = i4.remove(t4)), r5.xa[r5.currentUser.toKey()] = i4;
    }
  }
  async function __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(e5, t4, n5) {
    const r5 = __PRIVATE_debugCast(e5), i4 = [], s4 = [], o4 = [];
    r5.ba.isEmpty() || (r5.ba.forEach((e6, _2) => {
      o4.push(r5.Ba(_2, t4, n5).then((e7) => {
        if ((e7 || n5) && r5.isPrimaryClient) {
          const t5 = e7 && !e7.fromCache;
          r5.sharedClientState.updateQueryState(_2.targetId, t5 ? "current" : "not-current");
        }
        if (e7) {
          i4.push(e7);
          const t5 = __PRIVATE_LocalViewChanges.Ki(_2.targetId, e7);
          s4.push(t5);
        }
      }));
    }), await Promise.all(o4), r5.Sa.h_(i4), await async function __PRIVATE_localStoreNotifyLocalViewChanges(e6, t5) {
      const n6 = __PRIVATE_debugCast(e6);
      try {
        await n6.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (e7) => PersistencePromise.forEach(t5, (t6) => PersistencePromise.forEach(t6.qi, (r6) => n6.persistence.referenceDelegate.addReference(e7, t6.targetId, r6)).next(() => PersistencePromise.forEach(t6.Qi, (r6) => n6.persistence.referenceDelegate.removeReference(e7, t6.targetId, r6)))));
      } catch (e7) {
        if (!__PRIVATE_isIndexedDbTransactionError(e7)) throw e7;
        __PRIVATE_logDebug("LocalStore", "Failed to update sequence numbers: " + e7);
      }
      for (const e7 of t5) {
        const t6 = e7.targetId;
        if (!e7.fromCache) {
          const e8 = n6.ns.get(t6), r6 = e8.snapshotVersion, i5 = e8.withLastLimboFreeSnapshotVersion(r6);
          n6.ns = n6.ns.insert(t6, i5);
        }
      }
    }(r5.localStore, s4));
  }
  async function __PRIVATE_syncEngineHandleCredentialChange(e5, t4) {
    const n5 = __PRIVATE_debugCast(e5);
    if (!n5.currentUser.isEqual(t4)) {
      __PRIVATE_logDebug("SyncEngine", "User change. New user:", t4.toKey());
      const e6 = await __PRIVATE_localStoreHandleUserChange(n5.localStore, t4);
      n5.currentUser = t4, // Fails tasks waiting for pending writes requested by previous user.
      function __PRIVATE_rejectOutstandingPendingWritesCallbacks(e7, t5) {
        e7.Oa.forEach((e8) => {
          e8.forEach((e9) => {
            e9.reject(new FirestoreError(C2.CANCELLED, t5));
          });
        }), e7.Oa.clear();
      }(n5, "'waitForPendingWrites' promise is rejected due to a user change."), // TODO(b/114226417): Consider calling this only in the primary tab.
      n5.sharedClientState.handleUserChange(t4, e6.removedBatchIds, e6.addedBatchIds), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n5, e6.us);
    }
  }
  function __PRIVATE_syncEngineEnsureWriteCallbacks(e5) {
    const t4 = __PRIVATE_debugCast(e5);
    return t4.remoteStore.remoteSyncer.applySuccessfulWrite = __PRIVATE_syncEngineApplySuccessfulWrite.bind(null, t4), t4.remoteStore.remoteSyncer.rejectFailedWrite = __PRIVATE_syncEngineRejectFailedWrite.bind(null, t4), t4;
  }
  var MemoryOfflineComponentProvider = class {
    constructor() {
      this.synchronizeTabs = false;
    }
    async initialize(e5) {
      this.serializer = __PRIVATE_newSerializer(e5.databaseInfo.databaseId), this.sharedClientState = this.createSharedClientState(e5), this.persistence = this.createPersistence(e5), await this.persistence.start(), this.localStore = this.createLocalStore(e5), this.gcScheduler = this.createGarbageCollectionScheduler(e5, this.localStore), this.indexBackfillerScheduler = this.createIndexBackfillerScheduler(e5, this.localStore);
    }
    createGarbageCollectionScheduler(e5, t4) {
      return null;
    }
    createIndexBackfillerScheduler(e5, t4) {
      return null;
    }
    createLocalStore(e5) {
      return __PRIVATE_newLocalStore(this.persistence, new __PRIVATE_QueryEngine(), e5.initialUser, this.serializer);
    }
    createPersistence(e5) {
      return new __PRIVATE_MemoryPersistence(__PRIVATE_MemoryEagerDelegate.Hr, this.serializer);
    }
    createSharedClientState(e5) {
      return new __PRIVATE_MemorySharedClientState();
    }
    async terminate() {
      var e5, t4;
      null === (e5 = this.gcScheduler) || void 0 === e5 || e5.stop(), null === (t4 = this.indexBackfillerScheduler) || void 0 === t4 || t4.stop(), this.sharedClientState.shutdown(), await this.persistence.shutdown();
    }
  };
  var __PRIVATE_IndexedDbOfflineComponentProvider = class extends MemoryOfflineComponentProvider {
    constructor(e5, t4, n5) {
      super(), this.Qa = e5, this.cacheSizeBytes = t4, this.forceOwnership = n5, this.synchronizeTabs = false;
    }
    async initialize(e5) {
      await super.initialize(e5), await this.Qa.initialize(this, e5), // Enqueue writes from a previous session
      await __PRIVATE_syncEngineEnsureWriteCallbacks(this.Qa.syncEngine), await __PRIVATE_fillWritePipeline(this.Qa.remoteStore), // NOTE: This will immediately call the listener, so we make sure to
      // set it after localStore / remoteStore are started.
      await this.persistence.fi(() => (this.gcScheduler && !this.gcScheduler.started && this.gcScheduler.start(), this.indexBackfillerScheduler && !this.indexBackfillerScheduler.started && this.indexBackfillerScheduler.start(), Promise.resolve()));
    }
    createLocalStore(e5) {
      return __PRIVATE_newLocalStore(this.persistence, new __PRIVATE_QueryEngine(), e5.initialUser, this.serializer);
    }
    createGarbageCollectionScheduler(e5, t4) {
      const n5 = this.persistence.referenceDelegate.garbageCollector;
      return new __PRIVATE_LruScheduler(n5, e5.asyncQueue, t4);
    }
    createIndexBackfillerScheduler(e5, t4) {
      const n5 = new __PRIVATE_IndexBackfiller(t4, this.persistence);
      return new __PRIVATE_IndexBackfillerScheduler(e5.asyncQueue, n5);
    }
    createPersistence(e5) {
      const t4 = __PRIVATE_indexedDbStoragePrefix(e5.databaseInfo.databaseId, e5.databaseInfo.persistenceKey), n5 = void 0 !== this.cacheSizeBytes ? LruParams.withCacheSize(this.cacheSizeBytes) : LruParams.DEFAULT;
      return new __PRIVATE_IndexedDbPersistence(this.synchronizeTabs, t4, e5.clientId, n5, e5.asyncQueue, __PRIVATE_getWindow(), getDocument(), this.serializer, this.sharedClientState, !!this.forceOwnership);
    }
    createSharedClientState(e5) {
      return new __PRIVATE_MemorySharedClientState();
    }
  };
  var OnlineComponentProvider = class {
    async initialize(e5, t4) {
      this.localStore || (this.localStore = e5.localStore, this.sharedClientState = e5.sharedClientState, this.datastore = this.createDatastore(t4), this.remoteStore = this.createRemoteStore(t4), this.eventManager = this.createEventManager(t4), this.syncEngine = this.createSyncEngine(
        t4,
        /* startAsPrimary=*/
        !e5.synchronizeTabs
      ), this.sharedClientState.onlineStateHandler = (e6) => __PRIVATE_syncEngineApplyOnlineStateChange(
        this.syncEngine,
        e6,
        1
        /* OnlineStateSource.SharedClientState */
      ), this.remoteStore.remoteSyncer.handleCredentialChange = __PRIVATE_syncEngineHandleCredentialChange.bind(null, this.syncEngine), await __PRIVATE_remoteStoreApplyPrimaryState(this.remoteStore, this.syncEngine.isPrimaryClient));
    }
    createEventManager(e5) {
      return function __PRIVATE_newEventManager() {
        return new __PRIVATE_EventManagerImpl();
      }();
    }
    createDatastore(e5) {
      const t4 = __PRIVATE_newSerializer(e5.databaseInfo.databaseId), n5 = function __PRIVATE_newConnection(e6) {
        return new __PRIVATE_WebChannelConnection(e6);
      }(e5.databaseInfo);
      return function __PRIVATE_newDatastore(e6, t5, n6, r5) {
        return new __PRIVATE_DatastoreImpl(e6, t5, n6, r5);
      }(e5.authCredentials, e5.appCheckCredentials, n5, t4);
    }
    createRemoteStore(e5) {
      return function __PRIVATE_newRemoteStore(e6, t4, n5, r5, i4) {
        return new __PRIVATE_RemoteStoreImpl(e6, t4, n5, r5, i4);
      }(this.localStore, this.datastore, e5.asyncQueue, (e6) => __PRIVATE_syncEngineApplyOnlineStateChange(
        this.syncEngine,
        e6,
        0
        /* OnlineStateSource.RemoteStore */
      ), function __PRIVATE_newConnectivityMonitor() {
        return __PRIVATE_BrowserConnectivityMonitor.D() ? new __PRIVATE_BrowserConnectivityMonitor() : new __PRIVATE_NoopConnectivityMonitor();
      }());
    }
    createSyncEngine(e5, t4) {
      return function __PRIVATE_newSyncEngine(e6, t5, n5, r5, i4, s4, o4) {
        const _2 = new __PRIVATE_SyncEngineImpl(e6, t5, n5, r5, i4, s4);
        return o4 && (_2.La = true), _2;
      }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, e5.initialUser, e5.maxConcurrentLimboResolutions, t4);
    }
    async terminate() {
      var e5;
      await async function __PRIVATE_remoteStoreShutdown(e6) {
        const t4 = __PRIVATE_debugCast(e6);
        __PRIVATE_logDebug("RemoteStore", "RemoteStore shutting down."), t4.M_.add(
          5
          /* OfflineCause.Shutdown */
        ), await __PRIVATE_disableNetworkInternal(t4), t4.O_.shutdown(), // Set the OnlineState to Unknown (rather than Offline) to avoid potentially
        // triggering spurious listener events with cached data, etc.
        t4.N_.set(
          "Unknown"
          /* OnlineState.Unknown */
        );
      }(this.remoteStore), null === (e5 = this.datastore) || void 0 === e5 || e5.terminate();
    }
  };
  var FirestoreClient = class {
    constructor(e5, t4, n5, r5) {
      this.authCredentials = e5, this.appCheckCredentials = t4, this.asyncQueue = n5, this.databaseInfo = r5, this.user = User.UNAUTHENTICATED, this.clientId = __PRIVATE_AutoId.newId(), this.authCredentialListener = () => Promise.resolve(), this.appCheckCredentialListener = () => Promise.resolve(), this.authCredentials.start(n5, async (e6) => {
        __PRIVATE_logDebug("FirestoreClient", "Received user=", e6.uid), await this.authCredentialListener(e6), this.user = e6;
      }), this.appCheckCredentials.start(n5, (e6) => (__PRIVATE_logDebug("FirestoreClient", "Received new app check token=", e6), this.appCheckCredentialListener(e6, this.user)));
    }
    get configuration() {
      return {
        asyncQueue: this.asyncQueue,
        databaseInfo: this.databaseInfo,
        clientId: this.clientId,
        authCredentials: this.authCredentials,
        appCheckCredentials: this.appCheckCredentials,
        initialUser: this.user,
        maxConcurrentLimboResolutions: 100
      };
    }
    setCredentialChangeListener(e5) {
      this.authCredentialListener = e5;
    }
    setAppCheckTokenChangeListener(e5) {
      this.appCheckCredentialListener = e5;
    }
    /**
     * Checks that the client has not been terminated. Ensures that other methods on //
     * this class cannot be called after the client is terminated. //
     */
    verifyNotTerminated() {
      if (this.asyncQueue.isShuttingDown) throw new FirestoreError(C2.FAILED_PRECONDITION, "The client has already been terminated.");
    }
    terminate() {
      this.asyncQueue.enterRestrictedMode();
      const e5 = new __PRIVATE_Deferred();
      return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async () => {
        try {
          this._onlineComponents && await this._onlineComponents.terminate(), this._offlineComponents && await this._offlineComponents.terminate(), // The credentials provider must be terminated after shutting down the
          // RemoteStore as it will prevent the RemoteStore from retrieving auth
          // tokens.
          this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), e5.resolve();
        } catch (t4) {
          const n5 = __PRIVATE_wrapInUserErrorIfRecoverable(t4, "Failed to shutdown persistence");
          e5.reject(n5);
        }
      }), e5.promise;
    }
  };
  function __PRIVATE_cloneLongPollingOptions(e5) {
    const t4 = {};
    return void 0 !== e5.timeoutSeconds && (t4.timeoutSeconds = e5.timeoutSeconds), t4;
  }
  var ye = /* @__PURE__ */ new Map();
  function __PRIVATE_validateIsNotUsedTogether(e5, t4, n5, r5) {
    if (true === t4 && true === r5) throw new FirestoreError(C2.INVALID_ARGUMENT, `${e5} and ${n5} cannot be used together.`);
  }
  var FirestoreSettingsImpl = class {
    constructor(e5) {
      var t4, n5;
      if (void 0 === e5.host) {
        if (void 0 !== e5.ssl) throw new FirestoreError(C2.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
        this.host = "firestore.googleapis.com", this.ssl = true;
      } else this.host = e5.host, this.ssl = null === (t4 = e5.ssl) || void 0 === t4 || t4;
      if (this.credentials = e5.credentials, this.ignoreUndefinedProperties = !!e5.ignoreUndefinedProperties, this.localCache = e5.localCache, void 0 === e5.cacheSizeBytes) this.cacheSizeBytes = 41943040;
      else {
        if (-1 !== e5.cacheSizeBytes && e5.cacheSizeBytes < 1048576) throw new FirestoreError(C2.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
        this.cacheSizeBytes = e5.cacheSizeBytes;
      }
      __PRIVATE_validateIsNotUsedTogether("experimentalForceLongPolling", e5.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e5.experimentalAutoDetectLongPolling), this.experimentalForceLongPolling = !!e5.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = false : void 0 === e5.experimentalAutoDetectLongPolling ? this.experimentalAutoDetectLongPolling = true : (
        // For backwards compatibility, coerce the value to boolean even though
        // the TypeScript compiler has narrowed the type to boolean already.
        // noinspection PointlessBooleanExpressionJS
        this.experimentalAutoDetectLongPolling = !!e5.experimentalAutoDetectLongPolling
      ), this.experimentalLongPollingOptions = __PRIVATE_cloneLongPollingOptions(null !== (n5 = e5.experimentalLongPollingOptions) && void 0 !== n5 ? n5 : {}), function __PRIVATE_validateLongPollingOptions(e6) {
        if (void 0 !== e6.timeoutSeconds) {
          if (isNaN(e6.timeoutSeconds)) throw new FirestoreError(C2.INVALID_ARGUMENT, `invalid long polling timeout: ${e6.timeoutSeconds} (must not be NaN)`);
          if (e6.timeoutSeconds < 5) throw new FirestoreError(C2.INVALID_ARGUMENT, `invalid long polling timeout: ${e6.timeoutSeconds} (minimum allowed value is 5)`);
          if (e6.timeoutSeconds > 30) throw new FirestoreError(C2.INVALID_ARGUMENT, `invalid long polling timeout: ${e6.timeoutSeconds} (maximum allowed value is 30)`);
        }
      }(this.experimentalLongPollingOptions), this.useFetchStreams = !!e5.useFetchStreams;
    }
    isEqual(e5) {
      return this.host === e5.host && this.ssl === e5.ssl && this.credentials === e5.credentials && this.cacheSizeBytes === e5.cacheSizeBytes && this.experimentalForceLongPolling === e5.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e5.experimentalAutoDetectLongPolling && function __PRIVATE_longPollingOptionsEqual(e6, t4) {
        return e6.timeoutSeconds === t4.timeoutSeconds;
      }(this.experimentalLongPollingOptions, e5.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e5.ignoreUndefinedProperties && this.useFetchStreams === e5.useFetchStreams;
    }
  };
  var Firestore$1 = class {
    /** @hideconstructor */
    constructor(e5, t4, n5, r5) {
      this._authCredentials = e5, this._appCheckCredentials = t4, this._databaseId = n5, this._app = r5, /**
       * Whether it's a Firestore or Firestore Lite instance.
       */
      this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new FirestoreSettingsImpl({}), this._settingsFrozen = false;
    }
    /**
     * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
     * instance.
     */
    get app() {
      if (!this._app) throw new FirestoreError(C2.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
      return this._app;
    }
    get _initialized() {
      return this._settingsFrozen;
    }
    get _terminated() {
      return void 0 !== this._terminateTask;
    }
    _setSettings(e5) {
      if (this._settingsFrozen) throw new FirestoreError(C2.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
      this._settings = new FirestoreSettingsImpl(e5), void 0 !== e5.credentials && (this._authCredentials = function __PRIVATE_makeAuthCredentialsProvider(e6) {
        if (!e6) return new __PRIVATE_EmptyAuthCredentialsProvider();
        switch (e6.type) {
          case "firstParty":
            return new __PRIVATE_FirstPartyAuthCredentialsProvider(e6.sessionIndex || "0", e6.iamToken || null, e6.authTokenFactory || null);
          case "provider":
            return e6.client;
          default:
            throw new FirestoreError(C2.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
        }
      }(e5.credentials));
    }
    _getSettings() {
      return this._settings;
    }
    _freezeSettings() {
      return this._settingsFrozen = true, this._settings;
    }
    _delete() {
      return this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask;
    }
    /** Returns a JSON-serializable representation of this `Firestore` instance. */
    toJSON() {
      return {
        app: this._app,
        databaseId: this._databaseId,
        settings: this._settings
      };
    }
    /**
     * Terminates all components used by this client. Subclasses can override
     * this method to clean up their own dependencies, but must also call this
     * method.
     *
     * Only ever called once.
     */
    _terminate() {
      return function __PRIVATE_removeComponents(e5) {
        const t4 = ye.get(e5);
        t4 && (__PRIVATE_logDebug("ComponentProvider", "Removing Datastore"), ye.delete(e5), t4.terminate());
      }(this), Promise.resolve();
    }
  };
  var __PRIVATE_AsyncQueueImpl = class {
    constructor() {
      this.iu = Promise.resolve(), // A list of retryable operations. Retryable operations are run in order and
      // retried with backoff.
      this.su = [], // Is this AsyncQueue being shut down? Once it is set to true, it will not
      // be changed again.
      this.ou = false, // Operations scheduled to be queued in the future. Operations are
      // automatically removed after they are run or canceled.
      this._u = [], // visible for testing
      this.au = null, // Flag set while there's an outstanding AsyncQueue operation, used for
      // assertion sanity-checks.
      this.uu = false, // Enabled during shutdown on Safari to prevent future access to IndexedDB.
      this.cu = false, // List of TimerIds to fast-forward delays for.
      this.lu = [], // Backoff timer used to schedule retries for retryable operations
      this.Yo = new __PRIVATE_ExponentialBackoff(
        this,
        "async_queue_retry"
        /* TimerId.AsyncQueueRetry */
      ), // Visibility handler that triggers an immediate retry of all retryable
      // operations. Meant to speed up recovery when we regain file system access
      // after page comes into foreground.
      this.hu = () => {
        const e6 = getDocument();
        e6 && __PRIVATE_logDebug("AsyncQueue", "Visibility state changed to " + e6.visibilityState), this.Yo.Wo();
      };
      const e5 = getDocument();
      e5 && "function" == typeof e5.addEventListener && e5.addEventListener("visibilitychange", this.hu);
    }
    get isShuttingDown() {
      return this.ou;
    }
    /**
     * Adds a new operation to the queue without waiting for it to complete (i.e.
     * we ignore the Promise result).
     */
    enqueueAndForget(e5) {
      this.enqueue(e5);
    }
    enqueueAndForgetEvenWhileRestricted(e5) {
      this.Pu(), // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.Iu(e5);
    }
    enterRestrictedMode(e5) {
      if (!this.ou) {
        this.ou = true, this.cu = e5 || false;
        const t4 = getDocument();
        t4 && "function" == typeof t4.removeEventListener && t4.removeEventListener("visibilitychange", this.hu);
      }
    }
    enqueue(e5) {
      if (this.Pu(), this.ou)
        return new Promise(() => {
        });
      const t4 = new __PRIVATE_Deferred();
      return this.Iu(() => this.ou && this.cu ? Promise.resolve() : (e5().then(t4.resolve, t4.reject), t4.promise)).then(() => t4.promise);
    }
    enqueueRetryable(e5) {
      this.enqueueAndForget(() => (this.su.push(e5), this.Tu()));
    }
    /**
     * Runs the next operation from the retryable queue. If the operation fails,
     * reschedules with backoff.
     */
    async Tu() {
      if (0 !== this.su.length) {
        try {
          await this.su[0](), this.su.shift(), this.Yo.reset();
        } catch (e5) {
          if (!__PRIVATE_isIndexedDbTransactionError(e5)) throw e5;
          __PRIVATE_logDebug("AsyncQueue", "Operation failed with retryable error: " + e5);
        }
        this.su.length > 0 && // If there are additional operations, we re-schedule `retryNextOp()`.
        // This is necessary to run retryable operations that failed during
        // their initial attempt since we don't know whether they are already
        // enqueued. If, for example, `op1`, `op2`, `op3` are enqueued and `op1`
        // needs to  be re-run, we will run `op1`, `op1`, `op2` using the
        // already enqueued calls to `retryNextOp()`. `op3()` will then run in the
        // call scheduled here.
        // Since `backoffAndRun()` cancels an existing backoff and schedules a
        // new backoff on every call, there is only ever a single additional
        // operation in the queue.
        this.Yo.$o(() => this.Tu());
      }
    }
    Iu(e5) {
      const t4 = this.iu.then(() => (this.uu = true, e5().catch((e6) => {
        this.au = e6, this.uu = false;
        const t5 = (
          /**
          * Chrome includes Error.message in Error.stack. Other browsers do not.
          * This returns expected output of message + stack when available.
          * @param error - Error or FirestoreError
          */
          function __PRIVATE_getMessageOrStack(e7) {
            let t6 = e7.message || "";
            e7.stack && (t6 = e7.stack.includes(e7.message) ? e7.stack : e7.message + "\n" + e7.stack);
            return t6;
          }(e6)
        );
        throw __PRIVATE_logError("INTERNAL UNHANDLED ERROR: ", t5), e6;
      }).then((e6) => (this.uu = false, e6))));
      return this.iu = t4, t4;
    }
    enqueueAfterDelay(e5, t4, n5) {
      this.Pu(), // Fast-forward delays for timerIds that have been overriden.
      this.lu.indexOf(e5) > -1 && (t4 = 0);
      const r5 = DelayedOperation.createAndSchedule(this, e5, t4, n5, (e6) => this.Eu(e6));
      return this._u.push(r5), r5;
    }
    Pu() {
      this.au && fail();
    }
    verifyOperationInProgress() {
    }
    /**
     * Waits until all currently queued tasks are finished executing. Delayed
     * operations are not run.
     */
    async du() {
      let e5;
      do {
        e5 = this.iu, await e5;
      } while (e5 !== this.iu);
    }
    /**
     * For Tests: Determine if a delayed operation with a particular TimerId
     * exists.
     */
    Au(e5) {
      for (const t4 of this._u) if (t4.timerId === e5) return true;
      return false;
    }
    /**
     * For Tests: Runs some or all delayed operations early.
     *
     * @param lastTimerId - Delayed operations up to and including this TimerId
     * will be drained. Pass TimerId.All to run all delayed operations.
     * @returns a Promise that resolves once all operations have been run.
     */
    Ru(e5) {
      return this.du().then(() => {
        this._u.sort((e6, t4) => e6.targetTimeMs - t4.targetTimeMs);
        for (const t4 of this._u) if (t4.skipDelay(), "all" !== e5 && t4.timerId === e5) break;
        return this.du();
      });
    }
    /**
     * For Tests: Skip all subsequent delays for a timer id.
     */
    Vu(e5) {
      this.lu.push(e5);
    }
    /** Called once a DelayedOperation is run or canceled. */
    Eu(e5) {
      const t4 = this._u.indexOf(e5);
      this._u.splice(t4, 1);
    }
  };
  var Firestore = class extends Firestore$1 {
    /** @hideconstructor */
    constructor(e5, t4, n5, r5) {
      super(e5, t4, n5, r5), /**
       * Whether it's a {@link Firestore} or Firestore Lite instance.
       */
      this.type = "firestore", this._queue = function __PRIVATE_newAsyncQueue() {
        return new __PRIVATE_AsyncQueueImpl();
      }(), this._persistenceKey = (null == r5 ? void 0 : r5.name) || "[DEFAULT]";
    }
    _terminate() {
      return this._firestoreClient || // The client must be initialized to ensure that all subsequent API
      // usage throws an exception.
      __PRIVATE_configureFirestore(this), this._firestoreClient.terminate();
    }
  };
  function initializeFirestore(e5, t4, n5) {
    n5 || (n5 = "(default)");
    const r5 = _getProvider(e5, "firestore");
    if (r5.isInitialized(n5)) {
      const e6 = r5.getImmediate({
        identifier: n5
      }), i4 = r5.getOptions(n5);
      if (deepEqual(i4, t4)) return e6;
      throw new FirestoreError(C2.FAILED_PRECONDITION, "initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.");
    }
    if (void 0 !== t4.cacheSizeBytes && void 0 !== t4.localCache) throw new FirestoreError(C2.INVALID_ARGUMENT, "cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");
    if (void 0 !== t4.cacheSizeBytes && -1 !== t4.cacheSizeBytes && t4.cacheSizeBytes < 1048576) throw new FirestoreError(C2.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
    return r5.initialize({
      options: t4,
      instanceIdentifier: n5
    });
  }
  function __PRIVATE_configureFirestore(e5) {
    var t4, n5, r5;
    const i4 = e5._freezeSettings(), s4 = function __PRIVATE_makeDatabaseInfo(e6, t5, n6, r6) {
      return new DatabaseInfo(e6, t5, n6, r6.host, r6.ssl, r6.experimentalForceLongPolling, r6.experimentalAutoDetectLongPolling, __PRIVATE_cloneLongPollingOptions(r6.experimentalLongPollingOptions), r6.useFetchStreams);
    }(e5._databaseId, (null === (t4 = e5._app) || void 0 === t4 ? void 0 : t4.options.appId) || "", e5._persistenceKey, i4);
    e5._firestoreClient = new FirestoreClient(e5._authCredentials, e5._appCheckCredentials, e5._queue, s4), (null === (n5 = i4.localCache) || void 0 === n5 ? void 0 : n5._offlineComponentProvider) && (null === (r5 = i4.localCache) || void 0 === r5 ? void 0 : r5._onlineComponentProvider) && (e5._firestoreClient._uninitializedComponentsProvider = {
      _offlineKind: i4.localCache.kind,
      _offline: i4.localCache._offlineComponentProvider,
      _online: i4.localCache._onlineComponentProvider
    });
  }
  var be = new RegExp("[~\\*/\\[\\]]");
  var __PRIVATE_PersistentLocalCacheImpl = class {
    constructor(e5) {
      let t4;
      this.kind = "persistent", (null == e5 ? void 0 : e5.tabManager) ? (e5.tabManager._initialize(e5), t4 = e5.tabManager) : (t4 = persistentSingleTabManager(void 0), t4._initialize(e5)), this._onlineComponentProvider = t4._onlineComponentProvider, this._offlineComponentProvider = t4._offlineComponentProvider;
    }
    toJSON() {
      return {
        kind: this.kind
      };
    }
  };
  function persistentLocalCache(e5) {
    return new __PRIVATE_PersistentLocalCacheImpl(e5);
  }
  var __PRIVATE_SingleTabManagerImpl = class {
    constructor(e5) {
      this.forceOwnership = e5, this.kind = "persistentSingleTab";
    }
    toJSON() {
      return {
        kind: this.kind
      };
    }
    /**
     * @internal
     */
    _initialize(e5) {
      this._onlineComponentProvider = new OnlineComponentProvider(), this._offlineComponentProvider = new __PRIVATE_IndexedDbOfflineComponentProvider(this._onlineComponentProvider, null == e5 ? void 0 : e5.cacheSizeBytes, this.forceOwnership);
    }
  };
  function persistentSingleTabManager(e5) {
    return new __PRIVATE_SingleTabManagerImpl(null == e5 ? void 0 : e5.forceOwnership);
  }
  !function __PRIVATE_registerFirestore(e5, t4 = true) {
    !function __PRIVATE_setSDKVersion(e6) {
      b3 = e6;
    }(SDK_VERSION), _registerComponent(new Component("firestore", (e6, { instanceIdentifier: n5, options: r5 }) => {
      const i4 = e6.getProvider("app").getImmediate(), s4 = new Firestore(new __PRIVATE_FirebaseAuthCredentialsProvider(e6.getProvider("auth-internal")), new __PRIVATE_FirebaseAppCheckTokenProvider(e6.getProvider("app-check-internal")), function __PRIVATE_databaseIdFromApp(e7, t5) {
        if (!Object.prototype.hasOwnProperty.apply(e7.options, ["projectId"])) throw new FirestoreError(C2.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
        return new DatabaseId(e7.options.projectId, t5);
      }(i4, n5), i4);
      return r5 = Object.assign({
        useFetchStreams: t4
      }, r5), s4._setSettings(r5), s4;
    }, "PUBLIC").setMultipleInstances(true)), registerVersion(S3, "4.6.3", e5), // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
    registerVersion(S3, "4.6.3", "esm2017");
  }();

  // client/index.ts
  var firebaseConfig = {
    apiKey: "AIzaSyAnm0inOehg-dpwxs1se08_K4qwLd_gWQg",
    authDomain: "obsidian-family-tree.firebaseapp.com",
    projectId: "obsidian-family-tree",
    storageBucket: "obsidian-family-tree.appspot.com",
    messagingSenderId: "105313428821",
    appId: "1:105313428821:web:6d9b5718a026cf0fdd7bdc",
    measurementId: "G-N7EMM8E9W3"
  };
  var startFirestore = async () => {
    const app = initializeApp(firebaseConfig);
    initializeFirestore(app, {
      localCache: persistentLocalCache(
        /*settings*/
        {}
      )
    });
  };
  document.addEventListener("DOMContentLoaded", async () => {
    await startFirestore();
  });
})();
/*! Bundled license information:

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/logger/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lucide/dist/esm/createElement.js:
  (**
   * @license lucide v0.416.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide/dist/esm/defaultAttributes.js:
  (**
   * @license lucide v0.416.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide/dist/esm/icons/panel-left-close.js:
  (**
   * @license lucide v0.416.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide/dist/esm/icons/terminal.js:
  (**
   * @license lucide v0.416.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide/dist/esm/lucide.js:
  (**
   * @license lucide v0.416.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/webchannel-wrapper/dist/webchannel-blob/esm/webchannel_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
  * @license
  * Copyright 2020 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=index.js.map
