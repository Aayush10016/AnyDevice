// @ts-nocheck
// Generated from repository-owned JSON schemas; regenerate with npm run schemas.
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// <stdin>
var diagnostic = validate20;
var schema31 = { "$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "https://anydevice.local/report-v2.schema.json", "title": "AnyDevice evidence report 2.0", "type": "object", "required": ["schemaVersion", "appVersion", "collectedAt", "os", "complete", "sanitized", "devices", "findings", "errors", "limitations", "provenance"], "properties": { "schemaVersion": { "const": "2.0" }, "appVersion": { "const": "0.2.0" }, "collectedAt": { "type": "string" }, "os": { "type": ["string", "null"] }, "complete": { "type": "boolean" }, "sanitized": { "type": "boolean" }, "devices": { "type": "array", "items": { "$ref": "#/$defs/device" } }, "previous": { "type": "object", "required": ["collectedAt", "devices", "provenance", "complete"], "properties": { "collectedAt": { "type": "string" }, "devices": { "type": "array", "items": { "$ref": "#/$defs/device" } }, "provenance": { "$ref": "#/$defs/provenance" }, "complete": { "type": "boolean" } }, "additionalProperties": false }, "findings": { "type": "array", "items": { "$ref": "#/$defs/finding" } }, "errors": { "type": "array", "items": { "type": "object", "required": ["kind", "message"], "properties": { "kind": { "enum": ["permission", "property", "enumeration", "malformed"] }, "message": { "type": "string" }, "deviceId": { "type": "string" } }, "additionalProperties": false } }, "limitations": { "type": "array", "items": { "type": "string" } }, "provenance": { "$ref": "#/$defs/provenance" } }, "additionalProperties": false, "$defs": { "device": { "type": "object", "required": ["id", "name", "category", "manufacturer", "hardwareIds", "parent", "location", "status", "problemCode", "vid", "pid", "transport", "observedAt", "source", "nodeKind", "physicalDeviceId", "interfacePaths", "present"], "properties": { "id": { "type": "string" }, "name": { "type": ["string", "null"] }, "category": { "type": ["string", "null"] }, "manufacturer": { "type": ["string", "null"] }, "hardwareIds": { "type": "array", "items": { "type": "string" } }, "parent": { "type": ["string", "null"] }, "location": { "type": ["string", "null"] }, "status": { "type": ["string", "null"] }, "problemCode": { "type": ["integer", "null"], "minimum": 0 }, "vid": { "type": ["string", "null"], "pattern": "^[0-9A-F]{4}$" }, "pid": { "type": ["string", "null"], "pattern": "^[0-9A-F]{4}$" }, "transport": { "enum": ["USB", "HID (transport unknown)", "Unknown"] }, "observedAt": { "type": "string" }, "source": { "type": "string" }, "nodeKind": { "const": "logical-pnp-node" }, "physicalDeviceId": { "type": "null" }, "interfacePaths": { "type": "array", "maxItems": 0 }, "present": { "type": ["boolean", "null"] }, "containerId": { "type": ["string", "null"], "maxLength": 128 }, "compatibleIds": { "type": "array", "maxItems": 256, "items": { "type": "string" } }, "locationPaths": { "type": "array", "maxItems": 256, "items": { "type": "string" } }, "deviceCapabilities": { "type": ["integer", "null"], "minimum": 0, "maximum": 4294967295 }, "removalPolicy": { "enum": [null, 1, 2, 3] }, "enumeratorName": { "type": ["string", "null"], "maxLength": 8192 } }, "additionalProperties": false }, "finding": { "type": "object", "required": ["id", "title", "severity", "classification", "confidence", "facts", "explanation", "evidence", "recommendation", "limitations"], "properties": { "id": { "type": "string" }, "deviceId": { "type": "string" }, "title": { "type": "string" }, "severity": { "enum": ["info", "warning", "error"] }, "classification": { "enum": ["Windows-reported error", "Confirmed observation"] }, "confidence": { "enum": ["high", "limited"] }, "facts": { "type": "array", "items": { "type": "string" } }, "explanation": { "type": "string" }, "evidence": { "type": "array", "items": { "type": "string" } }, "recommendation": { "type": "string" }, "limitations": { "type": "string" } }, "additionalProperties": false }, "provenance": { "type": "object", "required": ["provider", "providerVersion", "scope"], "properties": { "provider": { "enum": ["windows-cfgmgr32", "windows-pnp-fallback"] }, "providerVersion": { "const": "1.0" }, "scope": { "enum": ["usb-hid", "all-pnp"] } }, "additionalProperties": false } } };
var schema32 = { "type": "object", "required": ["id", "name", "category", "manufacturer", "hardwareIds", "parent", "location", "status", "problemCode", "vid", "pid", "transport", "observedAt", "source", "nodeKind", "physicalDeviceId", "interfacePaths", "present"], "properties": { "id": { "type": "string" }, "name": { "type": ["string", "null"] }, "category": { "type": ["string", "null"] }, "manufacturer": { "type": ["string", "null"] }, "hardwareIds": { "type": "array", "items": { "type": "string" } }, "parent": { "type": ["string", "null"] }, "location": { "type": ["string", "null"] }, "status": { "type": ["string", "null"] }, "problemCode": { "type": ["integer", "null"], "minimum": 0 }, "vid": { "type": ["string", "null"], "pattern": "^[0-9A-F]{4}$" }, "pid": { "type": ["string", "null"], "pattern": "^[0-9A-F]{4}$" }, "transport": { "enum": ["USB", "HID (transport unknown)", "Unknown"] }, "observedAt": { "type": "string" }, "source": { "type": "string" }, "nodeKind": { "const": "logical-pnp-node" }, "physicalDeviceId": { "type": "null" }, "interfacePaths": { "type": "array", "maxItems": 0 }, "present": { "type": ["boolean", "null"] }, "containerId": { "type": ["string", "null"], "maxLength": 128 }, "compatibleIds": { "type": "array", "maxItems": 256, "items": { "type": "string" } }, "locationPaths": { "type": "array", "maxItems": 256, "items": { "type": "string" } }, "deviceCapabilities": { "type": ["integer", "null"], "minimum": 0, "maximum": 4294967295 }, "removalPolicy": { "enum": [null, 1, 2, 3] }, "enumeratorName": { "type": ["string", "null"], "maxLength": 8192 } }, "additionalProperties": false };
var schema34 = { "type": "object", "required": ["provider", "providerVersion", "scope"], "properties": { "provider": { "enum": ["windows-cfgmgr32", "windows-pnp-fallback"] }, "providerVersion": { "const": "1.0" }, "scope": { "enum": ["usb-hid", "all-pnp"] } }, "additionalProperties": false };
var schema35 = { "type": "object", "required": ["id", "title", "severity", "classification", "confidence", "facts", "explanation", "evidence", "recommendation", "limitations"], "properties": { "id": { "type": "string" }, "deviceId": { "type": "string" }, "title": { "type": "string" }, "severity": { "enum": ["info", "warning", "error"] }, "classification": { "enum": ["Windows-reported error", "Confirmed observation"] }, "confidence": { "enum": ["high", "limited"] }, "facts": { "type": "array", "items": { "type": "string" } }, "explanation": { "type": "string" }, "evidence": { "type": "array", "items": { "type": "string" } }, "recommendation": { "type": "string" }, "limitations": { "type": "string" } }, "additionalProperties": false };
var func1 = Object.prototype.hasOwnProperty;
var func3 = require_ucs2length().default;
var pattern4 = new RegExp("^[0-9A-F]{4}$", "u");
function validate20(data: any, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {}): boolean {
  ;
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate20.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = void 0;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = void 0;
  }
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.schemaVersion === void 0 && (missing0 = "schemaVersion") || data.appVersion === void 0 && (missing0 = "appVersion") || data.collectedAt === void 0 && (missing0 = "collectedAt") || data.os === void 0 && (missing0 = "os") || data.complete === void 0 && (missing0 = "complete") || data.sanitized === void 0 && (missing0 = "sanitized") || data.devices === void 0 && (missing0 = "devices") || data.findings === void 0 && (missing0 = "findings") || data.errors === void 0 && (missing0 = "errors") || data.limitations === void 0 && (missing0 = "limitations") || data.provenance === void 0 && (missing0 = "provenance")) {
        validate20.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!func1.call(schema31.properties, key0)) {
            validate20.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.schemaVersion !== void 0) {
            const _errs2 = errors;
            if ("2.0" !== data.schemaVersion) {
              validate20.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: "2.0" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.appVersion !== void 0) {
              const _errs3 = errors;
              if ("0.2.0" !== data.appVersion) {
                validate20.errors = [{ instancePath: instancePath + "/appVersion", schemaPath: "#/properties/appVersion/const", keyword: "const", params: { allowedValue: "0.2.0" }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.collectedAt !== void 0) {
                const _errs4 = errors;
                if (typeof data.collectedAt !== "string") {
                  validate20.errors = [{ instancePath: instancePath + "/collectedAt", schemaPath: "#/properties/collectedAt/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                  return false;
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.os !== void 0) {
                  let data3 = data.os;
                  const _errs6 = errors;
                  if (typeof data3 !== "string" && data3 !== null) {
                    validate20.errors = [{ instancePath: instancePath + "/os", schemaPath: "#/properties/os/type", keyword: "type", params: { type: schema31.properties.os.type }, message: "must be string,null" }];
                    return false;
                  }
                  var valid0 = _errs6 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.complete !== void 0) {
                    const _errs8 = errors;
                    if (typeof data.complete !== "boolean") {
                      validate20.errors = [{ instancePath: instancePath + "/complete", schemaPath: "#/properties/complete/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                      return false;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.sanitized !== void 0) {
                      const _errs10 = errors;
                      if (typeof data.sanitized !== "boolean") {
                        validate20.errors = [{ instancePath: instancePath + "/sanitized", schemaPath: "#/properties/sanitized/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                        return false;
                      }
                      var valid0 = _errs10 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.devices !== void 0) {
                        let data6 = data.devices;
                        const _errs12 = errors;
                        if (errors === _errs12) {
                          if (Array.isArray(data6)) {
                            var valid1 = true;
                            const len0 = data6.length;
                            for (let i0 = 0; i0 < len0; i0++) {
                              let data7 = data6[i0];
                              const _errs14 = errors;
                              const _errs15 = errors;
                              if (errors === _errs15) {
                                if (data7 && typeof data7 == "object" && !Array.isArray(data7)) {
                                  let missing1;
                                  if (data7.id === void 0 && (missing1 = "id") || data7.name === void 0 && (missing1 = "name") || data7.category === void 0 && (missing1 = "category") || data7.manufacturer === void 0 && (missing1 = "manufacturer") || data7.hardwareIds === void 0 && (missing1 = "hardwareIds") || data7.parent === void 0 && (missing1 = "parent") || data7.location === void 0 && (missing1 = "location") || data7.status === void 0 && (missing1 = "status") || data7.problemCode === void 0 && (missing1 = "problemCode") || data7.vid === void 0 && (missing1 = "vid") || data7.pid === void 0 && (missing1 = "pid") || data7.transport === void 0 && (missing1 = "transport") || data7.observedAt === void 0 && (missing1 = "observedAt") || data7.source === void 0 && (missing1 = "source") || data7.nodeKind === void 0 && (missing1 = "nodeKind") || data7.physicalDeviceId === void 0 && (missing1 = "physicalDeviceId") || data7.interfacePaths === void 0 && (missing1 = "interfacePaths") || data7.present === void 0 && (missing1 = "present")) {
                                    validate20.errors = [{ instancePath: instancePath + "/devices/" + i0, schemaPath: "#/$defs/device/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                                    return false;
                                  } else {
                                    const _errs17 = errors;
                                    for (const key1 in data7) {
                                      if (!func1.call(schema32.properties, key1)) {
                                        validate20.errors = [{ instancePath: instancePath + "/devices/" + i0, schemaPath: "#/$defs/device/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                                        return false;
                                        break;
                                      }
                                    }
                                    if (_errs17 === errors) {
                                      if (data7.id !== void 0) {
                                        const _errs18 = errors;
                                        if (typeof data7.id !== "string") {
                                          validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/id", schemaPath: "#/$defs/device/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                          return false;
                                        }
                                        var valid3 = _errs18 === errors;
                                      } else {
                                        var valid3 = true;
                                      }
                                      if (valid3) {
                                        if (data7.name !== void 0) {
                                          let data9 = data7.name;
                                          const _errs20 = errors;
                                          if (typeof data9 !== "string" && data9 !== null) {
                                            validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/name", schemaPath: "#/$defs/device/properties/name/type", keyword: "type", params: { type: schema32.properties.name.type }, message: "must be string,null" }];
                                            return false;
                                          }
                                          var valid3 = _errs20 === errors;
                                        } else {
                                          var valid3 = true;
                                        }
                                        if (valid3) {
                                          if (data7.category !== void 0) {
                                            let data10 = data7.category;
                                            const _errs22 = errors;
                                            if (typeof data10 !== "string" && data10 !== null) {
                                              validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/category", schemaPath: "#/$defs/device/properties/category/type", keyword: "type", params: { type: schema32.properties.category.type }, message: "must be string,null" }];
                                              return false;
                                            }
                                            var valid3 = _errs22 === errors;
                                          } else {
                                            var valid3 = true;
                                          }
                                          if (valid3) {
                                            if (data7.manufacturer !== void 0) {
                                              let data11 = data7.manufacturer;
                                              const _errs24 = errors;
                                              if (typeof data11 !== "string" && data11 !== null) {
                                                validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/manufacturer", schemaPath: "#/$defs/device/properties/manufacturer/type", keyword: "type", params: { type: schema32.properties.manufacturer.type }, message: "must be string,null" }];
                                                return false;
                                              }
                                              var valid3 = _errs24 === errors;
                                            } else {
                                              var valid3 = true;
                                            }
                                            if (valid3) {
                                              if (data7.hardwareIds !== void 0) {
                                                let data12 = data7.hardwareIds;
                                                const _errs26 = errors;
                                                if (errors === _errs26) {
                                                  if (Array.isArray(data12)) {
                                                    var valid4 = true;
                                                    const len1 = data12.length;
                                                    for (let i1 = 0; i1 < len1; i1++) {
                                                      const _errs28 = errors;
                                                      if (typeof data12[i1] !== "string") {
                                                        validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/hardwareIds/" + i1, schemaPath: "#/$defs/device/properties/hardwareIds/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                        return false;
                                                      }
                                                      var valid4 = _errs28 === errors;
                                                      if (!valid4) {
                                                        break;
                                                      }
                                                    }
                                                  } else {
                                                    validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/hardwareIds", schemaPath: "#/$defs/device/properties/hardwareIds/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                    return false;
                                                  }
                                                }
                                                var valid3 = _errs26 === errors;
                                              } else {
                                                var valid3 = true;
                                              }
                                              if (valid3) {
                                                if (data7.parent !== void 0) {
                                                  let data14 = data7.parent;
                                                  const _errs30 = errors;
                                                  if (typeof data14 !== "string" && data14 !== null) {
                                                    validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/parent", schemaPath: "#/$defs/device/properties/parent/type", keyword: "type", params: { type: schema32.properties.parent.type }, message: "must be string,null" }];
                                                    return false;
                                                  }
                                                  var valid3 = _errs30 === errors;
                                                } else {
                                                  var valid3 = true;
                                                }
                                                if (valid3) {
                                                  if (data7.location !== void 0) {
                                                    let data15 = data7.location;
                                                    const _errs32 = errors;
                                                    if (typeof data15 !== "string" && data15 !== null) {
                                                      validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/location", schemaPath: "#/$defs/device/properties/location/type", keyword: "type", params: { type: schema32.properties.location.type }, message: "must be string,null" }];
                                                      return false;
                                                    }
                                                    var valid3 = _errs32 === errors;
                                                  } else {
                                                    var valid3 = true;
                                                  }
                                                  if (valid3) {
                                                    if (data7.status !== void 0) {
                                                      let data16 = data7.status;
                                                      const _errs34 = errors;
                                                      if (typeof data16 !== "string" && data16 !== null) {
                                                        validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/status", schemaPath: "#/$defs/device/properties/status/type", keyword: "type", params: { type: schema32.properties.status.type }, message: "must be string,null" }];
                                                        return false;
                                                      }
                                                      var valid3 = _errs34 === errors;
                                                    } else {
                                                      var valid3 = true;
                                                    }
                                                    if (valid3) {
                                                      if (data7.problemCode !== void 0) {
                                                        let data17 = data7.problemCode;
                                                        const _errs36 = errors;
                                                        if (!(typeof data17 == "number" && (!(data17 % 1) && !isNaN(data17)) && isFinite(data17)) && data17 !== null) {
                                                          validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/problemCode", schemaPath: "#/$defs/device/properties/problemCode/type", keyword: "type", params: { type: schema32.properties.problemCode.type }, message: "must be integer,null" }];
                                                          return false;
                                                        }
                                                        if (errors === _errs36) {
                                                          if (typeof data17 == "number" && isFinite(data17)) {
                                                            if (data17 < 0 || isNaN(data17)) {
                                                              validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/problemCode", schemaPath: "#/$defs/device/properties/problemCode/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                              return false;
                                                            }
                                                          }
                                                        }
                                                        var valid3 = _errs36 === errors;
                                                      } else {
                                                        var valid3 = true;
                                                      }
                                                      if (valid3) {
                                                        if (data7.vid !== void 0) {
                                                          let data18 = data7.vid;
                                                          const _errs38 = errors;
                                                          if (typeof data18 !== "string" && data18 !== null) {
                                                            validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/vid", schemaPath: "#/$defs/device/properties/vid/type", keyword: "type", params: { type: schema32.properties.vid.type }, message: "must be string,null" }];
                                                            return false;
                                                          }
                                                          if (errors === _errs38) {
                                                            if (typeof data18 === "string") {
                                                              if (!pattern4.test(data18)) {
                                                                validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/vid", schemaPath: "#/$defs/device/properties/vid/pattern", keyword: "pattern", params: { pattern: "^[0-9A-F]{4}$" }, message: 'must match pattern "^[0-9A-F]{4}$"' }];
                                                                return false;
                                                              }
                                                            }
                                                          }
                                                          var valid3 = _errs38 === errors;
                                                        } else {
                                                          var valid3 = true;
                                                        }
                                                        if (valid3) {
                                                          if (data7.pid !== void 0) {
                                                            let data19 = data7.pid;
                                                            const _errs40 = errors;
                                                            if (typeof data19 !== "string" && data19 !== null) {
                                                              validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/pid", schemaPath: "#/$defs/device/properties/pid/type", keyword: "type", params: { type: schema32.properties.pid.type }, message: "must be string,null" }];
                                                              return false;
                                                            }
                                                            if (errors === _errs40) {
                                                              if (typeof data19 === "string") {
                                                                if (!pattern4.test(data19)) {
                                                                  validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/pid", schemaPath: "#/$defs/device/properties/pid/pattern", keyword: "pattern", params: { pattern: "^[0-9A-F]{4}$" }, message: 'must match pattern "^[0-9A-F]{4}$"' }];
                                                                  return false;
                                                                }
                                                              }
                                                            }
                                                            var valid3 = _errs40 === errors;
                                                          } else {
                                                            var valid3 = true;
                                                          }
                                                          if (valid3) {
                                                            if (data7.transport !== void 0) {
                                                              let data20 = data7.transport;
                                                              const _errs42 = errors;
                                                              if (!(data20 === "USB" || data20 === "HID (transport unknown)" || data20 === "Unknown")) {
                                                                validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/transport", schemaPath: "#/$defs/device/properties/transport/enum", keyword: "enum", params: { allowedValues: schema32.properties.transport.enum }, message: "must be equal to one of the allowed values" }];
                                                                return false;
                                                              }
                                                              var valid3 = _errs42 === errors;
                                                            } else {
                                                              var valid3 = true;
                                                            }
                                                            if (valid3) {
                                                              if (data7.observedAt !== void 0) {
                                                                const _errs43 = errors;
                                                                if (typeof data7.observedAt !== "string") {
                                                                  validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/observedAt", schemaPath: "#/$defs/device/properties/observedAt/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                  return false;
                                                                }
                                                                var valid3 = _errs43 === errors;
                                                              } else {
                                                                var valid3 = true;
                                                              }
                                                              if (valid3) {
                                                                if (data7.source !== void 0) {
                                                                  const _errs45 = errors;
                                                                  if (typeof data7.source !== "string") {
                                                                    validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/source", schemaPath: "#/$defs/device/properties/source/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                    return false;
                                                                  }
                                                                  var valid3 = _errs45 === errors;
                                                                } else {
                                                                  var valid3 = true;
                                                                }
                                                                if (valid3) {
                                                                  if (data7.nodeKind !== void 0) {
                                                                    const _errs47 = errors;
                                                                    if ("logical-pnp-node" !== data7.nodeKind) {
                                                                      validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/nodeKind", schemaPath: "#/$defs/device/properties/nodeKind/const", keyword: "const", params: { allowedValue: "logical-pnp-node" }, message: "must be equal to constant" }];
                                                                      return false;
                                                                    }
                                                                    var valid3 = _errs47 === errors;
                                                                  } else {
                                                                    var valid3 = true;
                                                                  }
                                                                  if (valid3) {
                                                                    if (data7.physicalDeviceId !== void 0) {
                                                                      const _errs48 = errors;
                                                                      if (data7.physicalDeviceId !== null) {
                                                                        validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/physicalDeviceId", schemaPath: "#/$defs/device/properties/physicalDeviceId/type", keyword: "type", params: { type: "null" }, message: "must be null" }];
                                                                        return false;
                                                                      }
                                                                      var valid3 = _errs48 === errors;
                                                                    } else {
                                                                      var valid3 = true;
                                                                    }
                                                                    if (valid3) {
                                                                      if (data7.interfacePaths !== void 0) {
                                                                        let data25 = data7.interfacePaths;
                                                                        const _errs50 = errors;
                                                                        if (errors === _errs50) {
                                                                          if (Array.isArray(data25)) {
                                                                            if (data25.length > 0) {
                                                                              validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/interfacePaths", schemaPath: "#/$defs/device/properties/interfacePaths/maxItems", keyword: "maxItems", params: { limit: 0 }, message: "must NOT have more than 0 items" }];
                                                                              return false;
                                                                            }
                                                                          } else {
                                                                            validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/interfacePaths", schemaPath: "#/$defs/device/properties/interfacePaths/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                            return false;
                                                                          }
                                                                        }
                                                                        var valid3 = _errs50 === errors;
                                                                      } else {
                                                                        var valid3 = true;
                                                                      }
                                                                      if (valid3) {
                                                                        if (data7.present !== void 0) {
                                                                          let data26 = data7.present;
                                                                          const _errs52 = errors;
                                                                          if (typeof data26 !== "boolean" && data26 !== null) {
                                                                            validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/present", schemaPath: "#/$defs/device/properties/present/type", keyword: "type", params: { type: schema32.properties.present.type }, message: "must be boolean,null" }];
                                                                            return false;
                                                                          }
                                                                          var valid3 = _errs52 === errors;
                                                                        } else {
                                                                          var valid3 = true;
                                                                        }
                                                                        if (valid3) {
                                                                          if (data7.containerId !== void 0) {
                                                                            let data27 = data7.containerId;
                                                                            const _errs54 = errors;
                                                                            if (typeof data27 !== "string" && data27 !== null) {
                                                                              validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/containerId", schemaPath: "#/$defs/device/properties/containerId/type", keyword: "type", params: { type: schema32.properties.containerId.type }, message: "must be string,null" }];
                                                                              return false;
                                                                            }
                                                                            if (errors === _errs54) {
                                                                              if (typeof data27 === "string") {
                                                                                if (func3(data27) > 128) {
                                                                                  validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/containerId", schemaPath: "#/$defs/device/properties/containerId/maxLength", keyword: "maxLength", params: { limit: 128 }, message: "must NOT have more than 128 characters" }];
                                                                                  return false;
                                                                                }
                                                                              }
                                                                            }
                                                                            var valid3 = _errs54 === errors;
                                                                          } else {
                                                                            var valid3 = true;
                                                                          }
                                                                          if (valid3) {
                                                                            if (data7.compatibleIds !== void 0) {
                                                                              let data28 = data7.compatibleIds;
                                                                              const _errs56 = errors;
                                                                              if (errors === _errs56) {
                                                                                if (Array.isArray(data28)) {
                                                                                  if (data28.length > 256) {
                                                                                    validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/compatibleIds", schemaPath: "#/$defs/device/properties/compatibleIds/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                                                                                    return false;
                                                                                  } else {
                                                                                    var valid5 = true;
                                                                                    const len2 = data28.length;
                                                                                    for (let i2 = 0; i2 < len2; i2++) {
                                                                                      const _errs58 = errors;
                                                                                      if (typeof data28[i2] !== "string") {
                                                                                        validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/compatibleIds/" + i2, schemaPath: "#/$defs/device/properties/compatibleIds/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                        return false;
                                                                                      }
                                                                                      var valid5 = _errs58 === errors;
                                                                                      if (!valid5) {
                                                                                        break;
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                } else {
                                                                                  validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/compatibleIds", schemaPath: "#/$defs/device/properties/compatibleIds/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                  return false;
                                                                                }
                                                                              }
                                                                              var valid3 = _errs56 === errors;
                                                                            } else {
                                                                              var valid3 = true;
                                                                            }
                                                                            if (valid3) {
                                                                              if (data7.locationPaths !== void 0) {
                                                                                let data30 = data7.locationPaths;
                                                                                const _errs60 = errors;
                                                                                if (errors === _errs60) {
                                                                                  if (Array.isArray(data30)) {
                                                                                    if (data30.length > 256) {
                                                                                      validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/locationPaths", schemaPath: "#/$defs/device/properties/locationPaths/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                                                                                      return false;
                                                                                    } else {
                                                                                      var valid6 = true;
                                                                                      const len3 = data30.length;
                                                                                      for (let i3 = 0; i3 < len3; i3++) {
                                                                                        const _errs62 = errors;
                                                                                        if (typeof data30[i3] !== "string") {
                                                                                          validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/locationPaths/" + i3, schemaPath: "#/$defs/device/properties/locationPaths/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                          return false;
                                                                                        }
                                                                                        var valid6 = _errs62 === errors;
                                                                                        if (!valid6) {
                                                                                          break;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  } else {
                                                                                    validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/locationPaths", schemaPath: "#/$defs/device/properties/locationPaths/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                    return false;
                                                                                  }
                                                                                }
                                                                                var valid3 = _errs60 === errors;
                                                                              } else {
                                                                                var valid3 = true;
                                                                              }
                                                                              if (valid3) {
                                                                                if (data7.deviceCapabilities !== void 0) {
                                                                                  let data32 = data7.deviceCapabilities;
                                                                                  const _errs64 = errors;
                                                                                  if (!(typeof data32 == "number" && (!(data32 % 1) && !isNaN(data32)) && isFinite(data32)) && data32 !== null) {
                                                                                    validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/deviceCapabilities", schemaPath: "#/$defs/device/properties/deviceCapabilities/type", keyword: "type", params: { type: schema32.properties.deviceCapabilities.type }, message: "must be integer,null" }];
                                                                                    return false;
                                                                                  }
                                                                                  if (errors === _errs64) {
                                                                                    if (typeof data32 == "number" && isFinite(data32)) {
                                                                                      if (data32 > 4294967295 || isNaN(data32)) {
                                                                                        validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/deviceCapabilities", schemaPath: "#/$defs/device/properties/deviceCapabilities/maximum", keyword: "maximum", params: { comparison: "<=", limit: 4294967295 }, message: "must be <= 4294967295" }];
                                                                                        return false;
                                                                                      } else {
                                                                                        if (data32 < 0 || isNaN(data32)) {
                                                                                          validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/deviceCapabilities", schemaPath: "#/$defs/device/properties/deviceCapabilities/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                          return false;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                  var valid3 = _errs64 === errors;
                                                                                } else {
                                                                                  var valid3 = true;
                                                                                }
                                                                                if (valid3) {
                                                                                  if (data7.removalPolicy !== void 0) {
                                                                                    let data33 = data7.removalPolicy;
                                                                                    const _errs66 = errors;
                                                                                    if (!(data33 === null || data33 === 1 || data33 === 2 || data33 === 3)) {
                                                                                      validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/removalPolicy", schemaPath: "#/$defs/device/properties/removalPolicy/enum", keyword: "enum", params: { allowedValues: schema32.properties.removalPolicy.enum }, message: "must be equal to one of the allowed values" }];
                                                                                      return false;
                                                                                    }
                                                                                    var valid3 = _errs66 === errors;
                                                                                  } else {
                                                                                    var valid3 = true;
                                                                                  }
                                                                                  if (valid3) {
                                                                                    if (data7.enumeratorName !== void 0) {
                                                                                      let data34 = data7.enumeratorName;
                                                                                      const _errs67 = errors;
                                                                                      if (typeof data34 !== "string" && data34 !== null) {
                                                                                        validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/enumeratorName", schemaPath: "#/$defs/device/properties/enumeratorName/type", keyword: "type", params: { type: schema32.properties.enumeratorName.type }, message: "must be string,null" }];
                                                                                        return false;
                                                                                      }
                                                                                      if (errors === _errs67) {
                                                                                        if (typeof data34 === "string") {
                                                                                          if (func3(data34) > 8192) {
                                                                                            validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/enumeratorName", schemaPath: "#/$defs/device/properties/enumeratorName/maxLength", keyword: "maxLength", params: { limit: 8192 }, message: "must NOT have more than 8192 characters" }];
                                                                                            return false;
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                      var valid3 = _errs67 === errors;
                                                                                    } else {
                                                                                      var valid3 = true;
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  validate20.errors = [{ instancePath: instancePath + "/devices/" + i0, schemaPath: "#/$defs/device/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                  return false;
                                }
                              }
                              var valid1 = _errs14 === errors;
                              if (!valid1) {
                                break;
                              }
                            }
                          } else {
                            validate20.errors = [{ instancePath: instancePath + "/devices", schemaPath: "#/properties/devices/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                            return false;
                          }
                        }
                        var valid0 = _errs12 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.previous !== void 0) {
                          let data35 = data.previous;
                          const _errs69 = errors;
                          if (errors === _errs69) {
                            if (data35 && typeof data35 == "object" && !Array.isArray(data35)) {
                              let missing2;
                              if (data35.collectedAt === void 0 && (missing2 = "collectedAt") || data35.devices === void 0 && (missing2 = "devices") || data35.provenance === void 0 && (missing2 = "provenance") || data35.complete === void 0 && (missing2 = "complete")) {
                                validate20.errors = [{ instancePath: instancePath + "/previous", schemaPath: "#/properties/previous/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
                                return false;
                              } else {
                                const _errs71 = errors;
                                for (const key2 in data35) {
                                  if (!(key2 === "collectedAt" || key2 === "devices" || key2 === "provenance" || key2 === "complete")) {
                                    validate20.errors = [{ instancePath: instancePath + "/previous", schemaPath: "#/properties/previous/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                                    return false;
                                    break;
                                  }
                                }
                                if (_errs71 === errors) {
                                  if (data35.collectedAt !== void 0) {
                                    const _errs72 = errors;
                                    if (typeof data35.collectedAt !== "string") {
                                      validate20.errors = [{ instancePath: instancePath + "/previous/collectedAt", schemaPath: "#/properties/previous/properties/collectedAt/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                      return false;
                                    }
                                    var valid7 = _errs72 === errors;
                                  } else {
                                    var valid7 = true;
                                  }
                                  if (valid7) {
                                    if (data35.devices !== void 0) {
                                      let data37 = data35.devices;
                                      const _errs74 = errors;
                                      if (errors === _errs74) {
                                        if (Array.isArray(data37)) {
                                          var valid8 = true;
                                          const len4 = data37.length;
                                          for (let i4 = 0; i4 < len4; i4++) {
                                            let data38 = data37[i4];
                                            const _errs76 = errors;
                                            const _errs77 = errors;
                                            if (errors === _errs77) {
                                              if (data38 && typeof data38 == "object" && !Array.isArray(data38)) {
                                                let missing3;
                                                if (data38.id === void 0 && (missing3 = "id") || data38.name === void 0 && (missing3 = "name") || data38.category === void 0 && (missing3 = "category") || data38.manufacturer === void 0 && (missing3 = "manufacturer") || data38.hardwareIds === void 0 && (missing3 = "hardwareIds") || data38.parent === void 0 && (missing3 = "parent") || data38.location === void 0 && (missing3 = "location") || data38.status === void 0 && (missing3 = "status") || data38.problemCode === void 0 && (missing3 = "problemCode") || data38.vid === void 0 && (missing3 = "vid") || data38.pid === void 0 && (missing3 = "pid") || data38.transport === void 0 && (missing3 = "transport") || data38.observedAt === void 0 && (missing3 = "observedAt") || data38.source === void 0 && (missing3 = "source") || data38.nodeKind === void 0 && (missing3 = "nodeKind") || data38.physicalDeviceId === void 0 && (missing3 = "physicalDeviceId") || data38.interfacePaths === void 0 && (missing3 = "interfacePaths") || data38.present === void 0 && (missing3 = "present")) {
                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4, schemaPath: "#/$defs/device/required", keyword: "required", params: { missingProperty: missing3 }, message: "must have required property '" + missing3 + "'" }];
                                                  return false;
                                                } else {
                                                  const _errs79 = errors;
                                                  for (const key3 in data38) {
                                                    if (!func1.call(schema32.properties, key3)) {
                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4, schemaPath: "#/$defs/device/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties" }];
                                                      return false;
                                                      break;
                                                    }
                                                  }
                                                  if (_errs79 === errors) {
                                                    if (data38.id !== void 0) {
                                                      const _errs80 = errors;
                                                      if (typeof data38.id !== "string") {
                                                        validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/id", schemaPath: "#/$defs/device/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                        return false;
                                                      }
                                                      var valid10 = _errs80 === errors;
                                                    } else {
                                                      var valid10 = true;
                                                    }
                                                    if (valid10) {
                                                      if (data38.name !== void 0) {
                                                        let data40 = data38.name;
                                                        const _errs82 = errors;
                                                        if (typeof data40 !== "string" && data40 !== null) {
                                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/name", schemaPath: "#/$defs/device/properties/name/type", keyword: "type", params: { type: schema32.properties.name.type }, message: "must be string,null" }];
                                                          return false;
                                                        }
                                                        var valid10 = _errs82 === errors;
                                                      } else {
                                                        var valid10 = true;
                                                      }
                                                      if (valid10) {
                                                        if (data38.category !== void 0) {
                                                          let data41 = data38.category;
                                                          const _errs84 = errors;
                                                          if (typeof data41 !== "string" && data41 !== null) {
                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/category", schemaPath: "#/$defs/device/properties/category/type", keyword: "type", params: { type: schema32.properties.category.type }, message: "must be string,null" }];
                                                            return false;
                                                          }
                                                          var valid10 = _errs84 === errors;
                                                        } else {
                                                          var valid10 = true;
                                                        }
                                                        if (valid10) {
                                                          if (data38.manufacturer !== void 0) {
                                                            let data42 = data38.manufacturer;
                                                            const _errs86 = errors;
                                                            if (typeof data42 !== "string" && data42 !== null) {
                                                              validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/manufacturer", schemaPath: "#/$defs/device/properties/manufacturer/type", keyword: "type", params: { type: schema32.properties.manufacturer.type }, message: "must be string,null" }];
                                                              return false;
                                                            }
                                                            var valid10 = _errs86 === errors;
                                                          } else {
                                                            var valid10 = true;
                                                          }
                                                          if (valid10) {
                                                            if (data38.hardwareIds !== void 0) {
                                                              let data43 = data38.hardwareIds;
                                                              const _errs88 = errors;
                                                              if (errors === _errs88) {
                                                                if (Array.isArray(data43)) {
                                                                  var valid11 = true;
                                                                  const len5 = data43.length;
                                                                  for (let i5 = 0; i5 < len5; i5++) {
                                                                    const _errs90 = errors;
                                                                    if (typeof data43[i5] !== "string") {
                                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/hardwareIds/" + i5, schemaPath: "#/$defs/device/properties/hardwareIds/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                      return false;
                                                                    }
                                                                    var valid11 = _errs90 === errors;
                                                                    if (!valid11) {
                                                                      break;
                                                                    }
                                                                  }
                                                                } else {
                                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/hardwareIds", schemaPath: "#/$defs/device/properties/hardwareIds/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                  return false;
                                                                }
                                                              }
                                                              var valid10 = _errs88 === errors;
                                                            } else {
                                                              var valid10 = true;
                                                            }
                                                            if (valid10) {
                                                              if (data38.parent !== void 0) {
                                                                let data45 = data38.parent;
                                                                const _errs92 = errors;
                                                                if (typeof data45 !== "string" && data45 !== null) {
                                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/parent", schemaPath: "#/$defs/device/properties/parent/type", keyword: "type", params: { type: schema32.properties.parent.type }, message: "must be string,null" }];
                                                                  return false;
                                                                }
                                                                var valid10 = _errs92 === errors;
                                                              } else {
                                                                var valid10 = true;
                                                              }
                                                              if (valid10) {
                                                                if (data38.location !== void 0) {
                                                                  let data46 = data38.location;
                                                                  const _errs94 = errors;
                                                                  if (typeof data46 !== "string" && data46 !== null) {
                                                                    validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/location", schemaPath: "#/$defs/device/properties/location/type", keyword: "type", params: { type: schema32.properties.location.type }, message: "must be string,null" }];
                                                                    return false;
                                                                  }
                                                                  var valid10 = _errs94 === errors;
                                                                } else {
                                                                  var valid10 = true;
                                                                }
                                                                if (valid10) {
                                                                  if (data38.status !== void 0) {
                                                                    let data47 = data38.status;
                                                                    const _errs96 = errors;
                                                                    if (typeof data47 !== "string" && data47 !== null) {
                                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/status", schemaPath: "#/$defs/device/properties/status/type", keyword: "type", params: { type: schema32.properties.status.type }, message: "must be string,null" }];
                                                                      return false;
                                                                    }
                                                                    var valid10 = _errs96 === errors;
                                                                  } else {
                                                                    var valid10 = true;
                                                                  }
                                                                  if (valid10) {
                                                                    if (data38.problemCode !== void 0) {
                                                                      let data48 = data38.problemCode;
                                                                      const _errs98 = errors;
                                                                      if (!(typeof data48 == "number" && (!(data48 % 1) && !isNaN(data48)) && isFinite(data48)) && data48 !== null) {
                                                                        validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/problemCode", schemaPath: "#/$defs/device/properties/problemCode/type", keyword: "type", params: { type: schema32.properties.problemCode.type }, message: "must be integer,null" }];
                                                                        return false;
                                                                      }
                                                                      if (errors === _errs98) {
                                                                        if (typeof data48 == "number" && isFinite(data48)) {
                                                                          if (data48 < 0 || isNaN(data48)) {
                                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/problemCode", schemaPath: "#/$defs/device/properties/problemCode/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                            return false;
                                                                          }
                                                                        }
                                                                      }
                                                                      var valid10 = _errs98 === errors;
                                                                    } else {
                                                                      var valid10 = true;
                                                                    }
                                                                    if (valid10) {
                                                                      if (data38.vid !== void 0) {
                                                                        let data49 = data38.vid;
                                                                        const _errs100 = errors;
                                                                        if (typeof data49 !== "string" && data49 !== null) {
                                                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/vid", schemaPath: "#/$defs/device/properties/vid/type", keyword: "type", params: { type: schema32.properties.vid.type }, message: "must be string,null" }];
                                                                          return false;
                                                                        }
                                                                        if (errors === _errs100) {
                                                                          if (typeof data49 === "string") {
                                                                            if (!pattern4.test(data49)) {
                                                                              validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/vid", schemaPath: "#/$defs/device/properties/vid/pattern", keyword: "pattern", params: { pattern: "^[0-9A-F]{4}$" }, message: 'must match pattern "^[0-9A-F]{4}$"' }];
                                                                              return false;
                                                                            }
                                                                          }
                                                                        }
                                                                        var valid10 = _errs100 === errors;
                                                                      } else {
                                                                        var valid10 = true;
                                                                      }
                                                                      if (valid10) {
                                                                        if (data38.pid !== void 0) {
                                                                          let data50 = data38.pid;
                                                                          const _errs102 = errors;
                                                                          if (typeof data50 !== "string" && data50 !== null) {
                                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/pid", schemaPath: "#/$defs/device/properties/pid/type", keyword: "type", params: { type: schema32.properties.pid.type }, message: "must be string,null" }];
                                                                            return false;
                                                                          }
                                                                          if (errors === _errs102) {
                                                                            if (typeof data50 === "string") {
                                                                              if (!pattern4.test(data50)) {
                                                                                validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/pid", schemaPath: "#/$defs/device/properties/pid/pattern", keyword: "pattern", params: { pattern: "^[0-9A-F]{4}$" }, message: 'must match pattern "^[0-9A-F]{4}$"' }];
                                                                                return false;
                                                                              }
                                                                            }
                                                                          }
                                                                          var valid10 = _errs102 === errors;
                                                                        } else {
                                                                          var valid10 = true;
                                                                        }
                                                                        if (valid10) {
                                                                          if (data38.transport !== void 0) {
                                                                            let data51 = data38.transport;
                                                                            const _errs104 = errors;
                                                                            if (!(data51 === "USB" || data51 === "HID (transport unknown)" || data51 === "Unknown")) {
                                                                              validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/transport", schemaPath: "#/$defs/device/properties/transport/enum", keyword: "enum", params: { allowedValues: schema32.properties.transport.enum }, message: "must be equal to one of the allowed values" }];
                                                                              return false;
                                                                            }
                                                                            var valid10 = _errs104 === errors;
                                                                          } else {
                                                                            var valid10 = true;
                                                                          }
                                                                          if (valid10) {
                                                                            if (data38.observedAt !== void 0) {
                                                                              const _errs105 = errors;
                                                                              if (typeof data38.observedAt !== "string") {
                                                                                validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/observedAt", schemaPath: "#/$defs/device/properties/observedAt/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                return false;
                                                                              }
                                                                              var valid10 = _errs105 === errors;
                                                                            } else {
                                                                              var valid10 = true;
                                                                            }
                                                                            if (valid10) {
                                                                              if (data38.source !== void 0) {
                                                                                const _errs107 = errors;
                                                                                if (typeof data38.source !== "string") {
                                                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/source", schemaPath: "#/$defs/device/properties/source/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                  return false;
                                                                                }
                                                                                var valid10 = _errs107 === errors;
                                                                              } else {
                                                                                var valid10 = true;
                                                                              }
                                                                              if (valid10) {
                                                                                if (data38.nodeKind !== void 0) {
                                                                                  const _errs109 = errors;
                                                                                  if ("logical-pnp-node" !== data38.nodeKind) {
                                                                                    validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/nodeKind", schemaPath: "#/$defs/device/properties/nodeKind/const", keyword: "const", params: { allowedValue: "logical-pnp-node" }, message: "must be equal to constant" }];
                                                                                    return false;
                                                                                  }
                                                                                  var valid10 = _errs109 === errors;
                                                                                } else {
                                                                                  var valid10 = true;
                                                                                }
                                                                                if (valid10) {
                                                                                  if (data38.physicalDeviceId !== void 0) {
                                                                                    const _errs110 = errors;
                                                                                    if (data38.physicalDeviceId !== null) {
                                                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/physicalDeviceId", schemaPath: "#/$defs/device/properties/physicalDeviceId/type", keyword: "type", params: { type: "null" }, message: "must be null" }];
                                                                                      return false;
                                                                                    }
                                                                                    var valid10 = _errs110 === errors;
                                                                                  } else {
                                                                                    var valid10 = true;
                                                                                  }
                                                                                  if (valid10) {
                                                                                    if (data38.interfacePaths !== void 0) {
                                                                                      let data56 = data38.interfacePaths;
                                                                                      const _errs112 = errors;
                                                                                      if (errors === _errs112) {
                                                                                        if (Array.isArray(data56)) {
                                                                                          if (data56.length > 0) {
                                                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/interfacePaths", schemaPath: "#/$defs/device/properties/interfacePaths/maxItems", keyword: "maxItems", params: { limit: 0 }, message: "must NOT have more than 0 items" }];
                                                                                            return false;
                                                                                          }
                                                                                        } else {
                                                                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/interfacePaths", schemaPath: "#/$defs/device/properties/interfacePaths/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                          return false;
                                                                                        }
                                                                                      }
                                                                                      var valid10 = _errs112 === errors;
                                                                                    } else {
                                                                                      var valid10 = true;
                                                                                    }
                                                                                    if (valid10) {
                                                                                      if (data38.present !== void 0) {
                                                                                        let data57 = data38.present;
                                                                                        const _errs114 = errors;
                                                                                        if (typeof data57 !== "boolean" && data57 !== null) {
                                                                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/present", schemaPath: "#/$defs/device/properties/present/type", keyword: "type", params: { type: schema32.properties.present.type }, message: "must be boolean,null" }];
                                                                                          return false;
                                                                                        }
                                                                                        var valid10 = _errs114 === errors;
                                                                                      } else {
                                                                                        var valid10 = true;
                                                                                      }
                                                                                      if (valid10) {
                                                                                        if (data38.containerId !== void 0) {
                                                                                          let data58 = data38.containerId;
                                                                                          const _errs116 = errors;
                                                                                          if (typeof data58 !== "string" && data58 !== null) {
                                                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/containerId", schemaPath: "#/$defs/device/properties/containerId/type", keyword: "type", params: { type: schema32.properties.containerId.type }, message: "must be string,null" }];
                                                                                            return false;
                                                                                          }
                                                                                          if (errors === _errs116) {
                                                                                            if (typeof data58 === "string") {
                                                                                              if (func3(data58) > 128) {
                                                                                                validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/containerId", schemaPath: "#/$defs/device/properties/containerId/maxLength", keyword: "maxLength", params: { limit: 128 }, message: "must NOT have more than 128 characters" }];
                                                                                                return false;
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                          var valid10 = _errs116 === errors;
                                                                                        } else {
                                                                                          var valid10 = true;
                                                                                        }
                                                                                        if (valid10) {
                                                                                          if (data38.compatibleIds !== void 0) {
                                                                                            let data59 = data38.compatibleIds;
                                                                                            const _errs118 = errors;
                                                                                            if (errors === _errs118) {
                                                                                              if (Array.isArray(data59)) {
                                                                                                if (data59.length > 256) {
                                                                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/compatibleIds", schemaPath: "#/$defs/device/properties/compatibleIds/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                                                                                                  return false;
                                                                                                } else {
                                                                                                  var valid12 = true;
                                                                                                  const len6 = data59.length;
                                                                                                  for (let i6 = 0; i6 < len6; i6++) {
                                                                                                    const _errs120 = errors;
                                                                                                    if (typeof data59[i6] !== "string") {
                                                                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/compatibleIds/" + i6, schemaPath: "#/$defs/device/properties/compatibleIds/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                      return false;
                                                                                                    }
                                                                                                    var valid12 = _errs120 === errors;
                                                                                                    if (!valid12) {
                                                                                                      break;
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              } else {
                                                                                                validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/compatibleIds", schemaPath: "#/$defs/device/properties/compatibleIds/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                                return false;
                                                                                              }
                                                                                            }
                                                                                            var valid10 = _errs118 === errors;
                                                                                          } else {
                                                                                            var valid10 = true;
                                                                                          }
                                                                                          if (valid10) {
                                                                                            if (data38.locationPaths !== void 0) {
                                                                                              let data61 = data38.locationPaths;
                                                                                              const _errs122 = errors;
                                                                                              if (errors === _errs122) {
                                                                                                if (Array.isArray(data61)) {
                                                                                                  if (data61.length > 256) {
                                                                                                    validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/locationPaths", schemaPath: "#/$defs/device/properties/locationPaths/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                                                                                                    return false;
                                                                                                  } else {
                                                                                                    var valid13 = true;
                                                                                                    const len7 = data61.length;
                                                                                                    for (let i7 = 0; i7 < len7; i7++) {
                                                                                                      const _errs124 = errors;
                                                                                                      if (typeof data61[i7] !== "string") {
                                                                                                        validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/locationPaths/" + i7, schemaPath: "#/$defs/device/properties/locationPaths/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                        return false;
                                                                                                      }
                                                                                                      var valid13 = _errs124 === errors;
                                                                                                      if (!valid13) {
                                                                                                        break;
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                } else {
                                                                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/locationPaths", schemaPath: "#/$defs/device/properties/locationPaths/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                                  return false;
                                                                                                }
                                                                                              }
                                                                                              var valid10 = _errs122 === errors;
                                                                                            } else {
                                                                                              var valid10 = true;
                                                                                            }
                                                                                            if (valid10) {
                                                                                              if (data38.deviceCapabilities !== void 0) {
                                                                                                let data63 = data38.deviceCapabilities;
                                                                                                const _errs126 = errors;
                                                                                                if (!(typeof data63 == "number" && (!(data63 % 1) && !isNaN(data63)) && isFinite(data63)) && data63 !== null) {
                                                                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/deviceCapabilities", schemaPath: "#/$defs/device/properties/deviceCapabilities/type", keyword: "type", params: { type: schema32.properties.deviceCapabilities.type }, message: "must be integer,null" }];
                                                                                                  return false;
                                                                                                }
                                                                                                if (errors === _errs126) {
                                                                                                  if (typeof data63 == "number" && isFinite(data63)) {
                                                                                                    if (data63 > 4294967295 || isNaN(data63)) {
                                                                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/deviceCapabilities", schemaPath: "#/$defs/device/properties/deviceCapabilities/maximum", keyword: "maximum", params: { comparison: "<=", limit: 4294967295 }, message: "must be <= 4294967295" }];
                                                                                                      return false;
                                                                                                    } else {
                                                                                                      if (data63 < 0 || isNaN(data63)) {
                                                                                                        validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/deviceCapabilities", schemaPath: "#/$defs/device/properties/deviceCapabilities/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                                        return false;
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                                var valid10 = _errs126 === errors;
                                                                                              } else {
                                                                                                var valid10 = true;
                                                                                              }
                                                                                              if (valid10) {
                                                                                                if (data38.removalPolicy !== void 0) {
                                                                                                  let data64 = data38.removalPolicy;
                                                                                                  const _errs128 = errors;
                                                                                                  if (!(data64 === null || data64 === 1 || data64 === 2 || data64 === 3)) {
                                                                                                    validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/removalPolicy", schemaPath: "#/$defs/device/properties/removalPolicy/enum", keyword: "enum", params: { allowedValues: schema32.properties.removalPolicy.enum }, message: "must be equal to one of the allowed values" }];
                                                                                                    return false;
                                                                                                  }
                                                                                                  var valid10 = _errs128 === errors;
                                                                                                } else {
                                                                                                  var valid10 = true;
                                                                                                }
                                                                                                if (valid10) {
                                                                                                  if (data38.enumeratorName !== void 0) {
                                                                                                    let data65 = data38.enumeratorName;
                                                                                                    const _errs129 = errors;
                                                                                                    if (typeof data65 !== "string" && data65 !== null) {
                                                                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/enumeratorName", schemaPath: "#/$defs/device/properties/enumeratorName/type", keyword: "type", params: { type: schema32.properties.enumeratorName.type }, message: "must be string,null" }];
                                                                                                      return false;
                                                                                                    }
                                                                                                    if (errors === _errs129) {
                                                                                                      if (typeof data65 === "string") {
                                                                                                        if (func3(data65) > 8192) {
                                                                                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/enumeratorName", schemaPath: "#/$defs/device/properties/enumeratorName/maxLength", keyword: "maxLength", params: { limit: 8192 }, message: "must NOT have more than 8192 characters" }];
                                                                                                          return false;
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                    var valid10 = _errs129 === errors;
                                                                                                  } else {
                                                                                                    var valid10 = true;
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              } else {
                                                validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4, schemaPath: "#/$defs/device/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                return false;
                                              }
                                            }
                                            var valid8 = _errs76 === errors;
                                            if (!valid8) {
                                              break;
                                            }
                                          }
                                        } else {
                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices", schemaPath: "#/properties/previous/properties/devices/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                          return false;
                                        }
                                      }
                                      var valid7 = _errs74 === errors;
                                    } else {
                                      var valid7 = true;
                                    }
                                    if (valid7) {
                                      if (data35.provenance !== void 0) {
                                        let data66 = data35.provenance;
                                        const _errs131 = errors;
                                        const _errs132 = errors;
                                        if (errors === _errs132) {
                                          if (data66 && typeof data66 == "object" && !Array.isArray(data66)) {
                                            let missing4;
                                            if (data66.provider === void 0 && (missing4 = "provider") || data66.providerVersion === void 0 && (missing4 = "providerVersion") || data66.scope === void 0 && (missing4 = "scope")) {
                                              validate20.errors = [{ instancePath: instancePath + "/previous/provenance", schemaPath: "#/$defs/provenance/required", keyword: "required", params: { missingProperty: missing4 }, message: "must have required property '" + missing4 + "'" }];
                                              return false;
                                            } else {
                                              const _errs134 = errors;
                                              for (const key4 in data66) {
                                                if (!(key4 === "provider" || key4 === "providerVersion" || key4 === "scope")) {
                                                  validate20.errors = [{ instancePath: instancePath + "/previous/provenance", schemaPath: "#/$defs/provenance/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties" }];
                                                  return false;
                                                  break;
                                                }
                                              }
                                              if (_errs134 === errors) {
                                                if (data66.provider !== void 0) {
                                                  let data67 = data66.provider;
                                                  const _errs135 = errors;
                                                  if (!(data67 === "windows-cfgmgr32" || data67 === "windows-pnp-fallback")) {
                                                    validate20.errors = [{ instancePath: instancePath + "/previous/provenance/provider", schemaPath: "#/$defs/provenance/properties/provider/enum", keyword: "enum", params: { allowedValues: schema34.properties.provider.enum }, message: "must be equal to one of the allowed values" }];
                                                    return false;
                                                  }
                                                  var valid15 = _errs135 === errors;
                                                } else {
                                                  var valid15 = true;
                                                }
                                                if (valid15) {
                                                  if (data66.providerVersion !== void 0) {
                                                    const _errs136 = errors;
                                                    if ("1.0" !== data66.providerVersion) {
                                                      validate20.errors = [{ instancePath: instancePath + "/previous/provenance/providerVersion", schemaPath: "#/$defs/provenance/properties/providerVersion/const", keyword: "const", params: { allowedValue: "1.0" }, message: "must be equal to constant" }];
                                                      return false;
                                                    }
                                                    var valid15 = _errs136 === errors;
                                                  } else {
                                                    var valid15 = true;
                                                  }
                                                  if (valid15) {
                                                    if (data66.scope !== void 0) {
                                                      let data69 = data66.scope;
                                                      const _errs137 = errors;
                                                      if (!(data69 === "usb-hid" || data69 === "all-pnp")) {
                                                        validate20.errors = [{ instancePath: instancePath + "/previous/provenance/scope", schemaPath: "#/$defs/provenance/properties/scope/enum", keyword: "enum", params: { allowedValues: schema34.properties.scope.enum }, message: "must be equal to one of the allowed values" }];
                                                        return false;
                                                      }
                                                      var valid15 = _errs137 === errors;
                                                    } else {
                                                      var valid15 = true;
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          } else {
                                            validate20.errors = [{ instancePath: instancePath + "/previous/provenance", schemaPath: "#/$defs/provenance/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                            return false;
                                          }
                                        }
                                        var valid7 = _errs131 === errors;
                                      } else {
                                        var valid7 = true;
                                      }
                                      if (valid7) {
                                        if (data35.complete !== void 0) {
                                          const _errs138 = errors;
                                          if (typeof data35.complete !== "boolean") {
                                            validate20.errors = [{ instancePath: instancePath + "/previous/complete", schemaPath: "#/properties/previous/properties/complete/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                            return false;
                                          }
                                          var valid7 = _errs138 === errors;
                                        } else {
                                          var valid7 = true;
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            } else {
                              validate20.errors = [{ instancePath: instancePath + "/previous", schemaPath: "#/properties/previous/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                              return false;
                            }
                          }
                          var valid0 = _errs69 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.findings !== void 0) {
                            let data71 = data.findings;
                            const _errs140 = errors;
                            if (errors === _errs140) {
                              if (Array.isArray(data71)) {
                                var valid16 = true;
                                const len8 = data71.length;
                                for (let i8 = 0; i8 < len8; i8++) {
                                  let data72 = data71[i8];
                                  const _errs142 = errors;
                                  const _errs143 = errors;
                                  if (errors === _errs143) {
                                    if (data72 && typeof data72 == "object" && !Array.isArray(data72)) {
                                      let missing5;
                                      if (data72.id === void 0 && (missing5 = "id") || data72.title === void 0 && (missing5 = "title") || data72.severity === void 0 && (missing5 = "severity") || data72.classification === void 0 && (missing5 = "classification") || data72.confidence === void 0 && (missing5 = "confidence") || data72.facts === void 0 && (missing5 = "facts") || data72.explanation === void 0 && (missing5 = "explanation") || data72.evidence === void 0 && (missing5 = "evidence") || data72.recommendation === void 0 && (missing5 = "recommendation") || data72.limitations === void 0 && (missing5 = "limitations")) {
                                        validate20.errors = [{ instancePath: instancePath + "/findings/" + i8, schemaPath: "#/$defs/finding/required", keyword: "required", params: { missingProperty: missing5 }, message: "must have required property '" + missing5 + "'" }];
                                        return false;
                                      } else {
                                        const _errs145 = errors;
                                        for (const key5 in data72) {
                                          if (!func1.call(schema35.properties, key5)) {
                                            validate20.errors = [{ instancePath: instancePath + "/findings/" + i8, schemaPath: "#/$defs/finding/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key5 }, message: "must NOT have additional properties" }];
                                            return false;
                                            break;
                                          }
                                        }
                                        if (_errs145 === errors) {
                                          if (data72.id !== void 0) {
                                            const _errs146 = errors;
                                            if (typeof data72.id !== "string") {
                                              validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/id", schemaPath: "#/$defs/finding/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                              return false;
                                            }
                                            var valid18 = _errs146 === errors;
                                          } else {
                                            var valid18 = true;
                                          }
                                          if (valid18) {
                                            if (data72.deviceId !== void 0) {
                                              const _errs148 = errors;
                                              if (typeof data72.deviceId !== "string") {
                                                validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/deviceId", schemaPath: "#/$defs/finding/properties/deviceId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                return false;
                                              }
                                              var valid18 = _errs148 === errors;
                                            } else {
                                              var valid18 = true;
                                            }
                                            if (valid18) {
                                              if (data72.title !== void 0) {
                                                const _errs150 = errors;
                                                if (typeof data72.title !== "string") {
                                                  validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/title", schemaPath: "#/$defs/finding/properties/title/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                  return false;
                                                }
                                                var valid18 = _errs150 === errors;
                                              } else {
                                                var valid18 = true;
                                              }
                                              if (valid18) {
                                                if (data72.severity !== void 0) {
                                                  let data76 = data72.severity;
                                                  const _errs152 = errors;
                                                  if (!(data76 === "info" || data76 === "warning" || data76 === "error")) {
                                                    validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/severity", schemaPath: "#/$defs/finding/properties/severity/enum", keyword: "enum", params: { allowedValues: schema35.properties.severity.enum }, message: "must be equal to one of the allowed values" }];
                                                    return false;
                                                  }
                                                  var valid18 = _errs152 === errors;
                                                } else {
                                                  var valid18 = true;
                                                }
                                                if (valid18) {
                                                  if (data72.classification !== void 0) {
                                                    let data77 = data72.classification;
                                                    const _errs153 = errors;
                                                    if (!(data77 === "Windows-reported error" || data77 === "Confirmed observation")) {
                                                      validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/classification", schemaPath: "#/$defs/finding/properties/classification/enum", keyword: "enum", params: { allowedValues: schema35.properties.classification.enum }, message: "must be equal to one of the allowed values" }];
                                                      return false;
                                                    }
                                                    var valid18 = _errs153 === errors;
                                                  } else {
                                                    var valid18 = true;
                                                  }
                                                  if (valid18) {
                                                    if (data72.confidence !== void 0) {
                                                      let data78 = data72.confidence;
                                                      const _errs154 = errors;
                                                      if (!(data78 === "high" || data78 === "limited")) {
                                                        validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/confidence", schemaPath: "#/$defs/finding/properties/confidence/enum", keyword: "enum", params: { allowedValues: schema35.properties.confidence.enum }, message: "must be equal to one of the allowed values" }];
                                                        return false;
                                                      }
                                                      var valid18 = _errs154 === errors;
                                                    } else {
                                                      var valid18 = true;
                                                    }
                                                    if (valid18) {
                                                      if (data72.facts !== void 0) {
                                                        let data79 = data72.facts;
                                                        const _errs155 = errors;
                                                        if (errors === _errs155) {
                                                          if (Array.isArray(data79)) {
                                                            var valid19 = true;
                                                            const len9 = data79.length;
                                                            for (let i9 = 0; i9 < len9; i9++) {
                                                              const _errs157 = errors;
                                                              if (typeof data79[i9] !== "string") {
                                                                validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/facts/" + i9, schemaPath: "#/$defs/finding/properties/facts/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                return false;
                                                              }
                                                              var valid19 = _errs157 === errors;
                                                              if (!valid19) {
                                                                break;
                                                              }
                                                            }
                                                          } else {
                                                            validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/facts", schemaPath: "#/$defs/finding/properties/facts/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                            return false;
                                                          }
                                                        }
                                                        var valid18 = _errs155 === errors;
                                                      } else {
                                                        var valid18 = true;
                                                      }
                                                      if (valid18) {
                                                        if (data72.explanation !== void 0) {
                                                          const _errs159 = errors;
                                                          if (typeof data72.explanation !== "string") {
                                                            validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/explanation", schemaPath: "#/$defs/finding/properties/explanation/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                            return false;
                                                          }
                                                          var valid18 = _errs159 === errors;
                                                        } else {
                                                          var valid18 = true;
                                                        }
                                                        if (valid18) {
                                                          if (data72.evidence !== void 0) {
                                                            let data82 = data72.evidence;
                                                            const _errs161 = errors;
                                                            if (errors === _errs161) {
                                                              if (Array.isArray(data82)) {
                                                                var valid20 = true;
                                                                const len10 = data82.length;
                                                                for (let i10 = 0; i10 < len10; i10++) {
                                                                  const _errs163 = errors;
                                                                  if (typeof data82[i10] !== "string") {
                                                                    validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/evidence/" + i10, schemaPath: "#/$defs/finding/properties/evidence/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                    return false;
                                                                  }
                                                                  var valid20 = _errs163 === errors;
                                                                  if (!valid20) {
                                                                    break;
                                                                  }
                                                                }
                                                              } else {
                                                                validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/evidence", schemaPath: "#/$defs/finding/properties/evidence/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                return false;
                                                              }
                                                            }
                                                            var valid18 = _errs161 === errors;
                                                          } else {
                                                            var valid18 = true;
                                                          }
                                                          if (valid18) {
                                                            if (data72.recommendation !== void 0) {
                                                              const _errs165 = errors;
                                                              if (typeof data72.recommendation !== "string") {
                                                                validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/recommendation", schemaPath: "#/$defs/finding/properties/recommendation/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                return false;
                                                              }
                                                              var valid18 = _errs165 === errors;
                                                            } else {
                                                              var valid18 = true;
                                                            }
                                                            if (valid18) {
                                                              if (data72.limitations !== void 0) {
                                                                const _errs167 = errors;
                                                                if (typeof data72.limitations !== "string") {
                                                                  validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/limitations", schemaPath: "#/$defs/finding/properties/limitations/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                  return false;
                                                                }
                                                                var valid18 = _errs167 === errors;
                                                              } else {
                                                                var valid18 = true;
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    } else {
                                      validate20.errors = [{ instancePath: instancePath + "/findings/" + i8, schemaPath: "#/$defs/finding/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                      return false;
                                    }
                                  }
                                  var valid16 = _errs142 === errors;
                                  if (!valid16) {
                                    break;
                                  }
                                }
                              } else {
                                validate20.errors = [{ instancePath: instancePath + "/findings", schemaPath: "#/properties/findings/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                return false;
                              }
                            }
                            var valid0 = _errs140 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.errors !== void 0) {
                              let data86 = data.errors;
                              const _errs169 = errors;
                              if (errors === _errs169) {
                                if (Array.isArray(data86)) {
                                  var valid21 = true;
                                  const len11 = data86.length;
                                  for (let i11 = 0; i11 < len11; i11++) {
                                    let data87 = data86[i11];
                                    const _errs171 = errors;
                                    if (errors === _errs171) {
                                      if (data87 && typeof data87 == "object" && !Array.isArray(data87)) {
                                        let missing6;
                                        if (data87.kind === void 0 && (missing6 = "kind") || data87.message === void 0 && (missing6 = "message")) {
                                          validate20.errors = [{ instancePath: instancePath + "/errors/" + i11, schemaPath: "#/properties/errors/items/required", keyword: "required", params: { missingProperty: missing6 }, message: "must have required property '" + missing6 + "'" }];
                                          return false;
                                        } else {
                                          const _errs173 = errors;
                                          for (const key6 in data87) {
                                            if (!(key6 === "kind" || key6 === "message" || key6 === "deviceId")) {
                                              validate20.errors = [{ instancePath: instancePath + "/errors/" + i11, schemaPath: "#/properties/errors/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key6 }, message: "must NOT have additional properties" }];
                                              return false;
                                              break;
                                            }
                                          }
                                          if (_errs173 === errors) {
                                            if (data87.kind !== void 0) {
                                              let data88 = data87.kind;
                                              const _errs174 = errors;
                                              if (!(data88 === "permission" || data88 === "property" || data88 === "enumeration" || data88 === "malformed")) {
                                                validate20.errors = [{ instancePath: instancePath + "/errors/" + i11 + "/kind", schemaPath: "#/properties/errors/items/properties/kind/enum", keyword: "enum", params: { allowedValues: schema31.properties.errors.items.properties.kind.enum }, message: "must be equal to one of the allowed values" }];
                                                return false;
                                              }
                                              var valid22 = _errs174 === errors;
                                            } else {
                                              var valid22 = true;
                                            }
                                            if (valid22) {
                                              if (data87.message !== void 0) {
                                                const _errs175 = errors;
                                                if (typeof data87.message !== "string") {
                                                  validate20.errors = [{ instancePath: instancePath + "/errors/" + i11 + "/message", schemaPath: "#/properties/errors/items/properties/message/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                  return false;
                                                }
                                                var valid22 = _errs175 === errors;
                                              } else {
                                                var valid22 = true;
                                              }
                                              if (valid22) {
                                                if (data87.deviceId !== void 0) {
                                                  const _errs177 = errors;
                                                  if (typeof data87.deviceId !== "string") {
                                                    validate20.errors = [{ instancePath: instancePath + "/errors/" + i11 + "/deviceId", schemaPath: "#/properties/errors/items/properties/deviceId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                    return false;
                                                  }
                                                  var valid22 = _errs177 === errors;
                                                } else {
                                                  var valid22 = true;
                                                }
                                              }
                                            }
                                          }
                                        }
                                      } else {
                                        validate20.errors = [{ instancePath: instancePath + "/errors/" + i11, schemaPath: "#/properties/errors/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                        return false;
                                      }
                                    }
                                    var valid21 = _errs171 === errors;
                                    if (!valid21) {
                                      break;
                                    }
                                  }
                                } else {
                                  validate20.errors = [{ instancePath: instancePath + "/errors", schemaPath: "#/properties/errors/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                  return false;
                                }
                              }
                              var valid0 = _errs169 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.limitations !== void 0) {
                                let data91 = data.limitations;
                                const _errs179 = errors;
                                if (errors === _errs179) {
                                  if (Array.isArray(data91)) {
                                    var valid23 = true;
                                    const len12 = data91.length;
                                    for (let i12 = 0; i12 < len12; i12++) {
                                      const _errs181 = errors;
                                      if (typeof data91[i12] !== "string") {
                                        validate20.errors = [{ instancePath: instancePath + "/limitations/" + i12, schemaPath: "#/properties/limitations/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                        return false;
                                      }
                                      var valid23 = _errs181 === errors;
                                      if (!valid23) {
                                        break;
                                      }
                                    }
                                  } else {
                                    validate20.errors = [{ instancePath: instancePath + "/limitations", schemaPath: "#/properties/limitations/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                    return false;
                                  }
                                }
                                var valid0 = _errs179 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.provenance !== void 0) {
                                  let data93 = data.provenance;
                                  const _errs183 = errors;
                                  const _errs184 = errors;
                                  if (errors === _errs184) {
                                    if (data93 && typeof data93 == "object" && !Array.isArray(data93)) {
                                      let missing7;
                                      if (data93.provider === void 0 && (missing7 = "provider") || data93.providerVersion === void 0 && (missing7 = "providerVersion") || data93.scope === void 0 && (missing7 = "scope")) {
                                        validate20.errors = [{ instancePath: instancePath + "/provenance", schemaPath: "#/$defs/provenance/required", keyword: "required", params: { missingProperty: missing7 }, message: "must have required property '" + missing7 + "'" }];
                                        return false;
                                      } else {
                                        const _errs186 = errors;
                                        for (const key7 in data93) {
                                          if (!(key7 === "provider" || key7 === "providerVersion" || key7 === "scope")) {
                                            validate20.errors = [{ instancePath: instancePath + "/provenance", schemaPath: "#/$defs/provenance/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key7 }, message: "must NOT have additional properties" }];
                                            return false;
                                            break;
                                          }
                                        }
                                        if (_errs186 === errors) {
                                          if (data93.provider !== void 0) {
                                            let data94 = data93.provider;
                                            const _errs187 = errors;
                                            if (!(data94 === "windows-cfgmgr32" || data94 === "windows-pnp-fallback")) {
                                              validate20.errors = [{ instancePath: instancePath + "/provenance/provider", schemaPath: "#/$defs/provenance/properties/provider/enum", keyword: "enum", params: { allowedValues: schema34.properties.provider.enum }, message: "must be equal to one of the allowed values" }];
                                              return false;
                                            }
                                            var valid25 = _errs187 === errors;
                                          } else {
                                            var valid25 = true;
                                          }
                                          if (valid25) {
                                            if (data93.providerVersion !== void 0) {
                                              const _errs188 = errors;
                                              if ("1.0" !== data93.providerVersion) {
                                                validate20.errors = [{ instancePath: instancePath + "/provenance/providerVersion", schemaPath: "#/$defs/provenance/properties/providerVersion/const", keyword: "const", params: { allowedValue: "1.0" }, message: "must be equal to constant" }];
                                                return false;
                                              }
                                              var valid25 = _errs188 === errors;
                                            } else {
                                              var valid25 = true;
                                            }
                                            if (valid25) {
                                              if (data93.scope !== void 0) {
                                                let data96 = data93.scope;
                                                const _errs189 = errors;
                                                if (!(data96 === "usb-hid" || data96 === "all-pnp")) {
                                                  validate20.errors = [{ instancePath: instancePath + "/provenance/scope", schemaPath: "#/$defs/provenance/properties/scope/enum", keyword: "enum", params: { allowedValues: schema34.properties.scope.enum }, message: "must be equal to one of the allowed values" }];
                                                  return false;
                                                }
                                                var valid25 = _errs189 === errors;
                                              } else {
                                                var valid25 = true;
                                              }
                                            }
                                          }
                                        }
                                      }
                                    } else {
                                      validate20.errors = [{ instancePath: instancePath + "/provenance", schemaPath: "#/$defs/provenance/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                      return false;
                                    }
                                  }
                                  var valid0 = _errs183 === errors;
                                } else {
                                  var valid0 = true;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate20.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate20.errors = vErrors;
  return errors === 0;
}
validate20.evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false };
var investigation = validate21;
var schema37 = { "type": "object", "required": ["schemaVersion", "appVersion", "startedAt", "sanitized", "limitations", "captures"], "properties": { "schemaVersion": { "const": "investigation-1.0" }, "appVersion": { "const": "0.2.0" }, "startedAt": { "type": "string" }, "sanitized": { "type": "boolean" }, "limitations": { "type": "array", "items": { "type": "string" } }, "captures": { "type": "array", "items": { "type": "object", "required": ["annotation", "report", "comparison"], "properties": { "annotation": { "type": "object", "required": ["source", "text"], "properties": { "source": { "const": "user" }, "text": { "type": "string", "maxLength": 2e3 } }, "additionalProperties": false }, "report": { "$ref": "https://anydevice.local/report-v2.schema.json" }, "comparison": { "anyOf": [{ "type": "null" }, { "type": "object", "required": ["comparable", "reason", "changes"], "properties": { "comparable": { "type": "boolean" }, "reason": { "type": "string" }, "changes": { "type": "array", "items": { "type": "object", "required": ["id", "kind", "fields"], "properties": { "id": { "type": "string" }, "kind": { "enum": ["added", "removed", "changed"] }, "fields": { "type": "array", "items": { "enum": ["name", "category", "manufacturer", "hardwareIds", "parent", "location", "status", "problemCode"] } } }, "additionalProperties": false } } }, "additionalProperties": false }] } }, "additionalProperties": false }, "minItems": 1, "maxItems": 8 } }, "additionalProperties": false, "$schema": "https://json-schema.org/draft/2020-12/schema" };
function validate21(data: any, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {}): boolean {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate21.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = void 0;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = void 0;
  }
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.schemaVersion === void 0 && (missing0 = "schemaVersion") || data.appVersion === void 0 && (missing0 = "appVersion") || data.startedAt === void 0 && (missing0 = "startedAt") || data.sanitized === void 0 && (missing0 = "sanitized") || data.limitations === void 0 && (missing0 = "limitations") || data.captures === void 0 && (missing0 = "captures")) {
        validate21.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "schemaVersion" || key0 === "appVersion" || key0 === "startedAt" || key0 === "sanitized" || key0 === "limitations" || key0 === "captures")) {
            validate21.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.schemaVersion !== void 0) {
            const _errs2 = errors;
            if ("investigation-1.0" !== data.schemaVersion) {
              validate21.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: "investigation-1.0" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.appVersion !== void 0) {
              const _errs3 = errors;
              if ("0.2.0" !== data.appVersion) {
                validate21.errors = [{ instancePath: instancePath + "/appVersion", schemaPath: "#/properties/appVersion/const", keyword: "const", params: { allowedValue: "0.2.0" }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.startedAt !== void 0) {
                const _errs4 = errors;
                if (typeof data.startedAt !== "string") {
                  validate21.errors = [{ instancePath: instancePath + "/startedAt", schemaPath: "#/properties/startedAt/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                  return false;
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.sanitized !== void 0) {
                  const _errs6 = errors;
                  if (typeof data.sanitized !== "boolean") {
                    validate21.errors = [{ instancePath: instancePath + "/sanitized", schemaPath: "#/properties/sanitized/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                    return false;
                  }
                  var valid0 = _errs6 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.limitations !== void 0) {
                    let data4 = data.limitations;
                    const _errs8 = errors;
                    if (errors === _errs8) {
                      if (Array.isArray(data4)) {
                        var valid1 = true;
                        const len0 = data4.length;
                        for (let i0 = 0; i0 < len0; i0++) {
                          const _errs10 = errors;
                          if (typeof data4[i0] !== "string") {
                            validate21.errors = [{ instancePath: instancePath + "/limitations/" + i0, schemaPath: "#/properties/limitations/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                            return false;
                          }
                          var valid1 = _errs10 === errors;
                          if (!valid1) {
                            break;
                          }
                        }
                      } else {
                        validate21.errors = [{ instancePath: instancePath + "/limitations", schemaPath: "#/properties/limitations/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                        return false;
                      }
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.captures !== void 0) {
                      let data6 = data.captures;
                      const _errs12 = errors;
                      if (errors === _errs12) {
                        if (Array.isArray(data6)) {
                          if (data6.length > 8) {
                            validate21.errors = [{ instancePath: instancePath + "/captures", schemaPath: "#/properties/captures/maxItems", keyword: "maxItems", params: { limit: 8 }, message: "must NOT have more than 8 items" }];
                            return false;
                          } else {
                            if (data6.length < 1) {
                              validate21.errors = [{ instancePath: instancePath + "/captures", schemaPath: "#/properties/captures/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                              return false;
                            } else {
                              var valid2 = true;
                              const len1 = data6.length;
                              for (let i1 = 0; i1 < len1; i1++) {
                                let data7 = data6[i1];
                                const _errs14 = errors;
                                if (errors === _errs14) {
                                  if (data7 && typeof data7 == "object" && !Array.isArray(data7)) {
                                    let missing1;
                                    if (data7.annotation === void 0 && (missing1 = "annotation") || data7.report === void 0 && (missing1 = "report") || data7.comparison === void 0 && (missing1 = "comparison")) {
                                      validate21.errors = [{ instancePath: instancePath + "/captures/" + i1, schemaPath: "#/properties/captures/items/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                                      return false;
                                    } else {
                                      const _errs16 = errors;
                                      for (const key1 in data7) {
                                        if (!(key1 === "annotation" || key1 === "report" || key1 === "comparison")) {
                                          validate21.errors = [{ instancePath: instancePath + "/captures/" + i1, schemaPath: "#/properties/captures/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                                          return false;
                                          break;
                                        }
                                      }
                                      if (_errs16 === errors) {
                                        if (data7.annotation !== void 0) {
                                          let data8 = data7.annotation;
                                          const _errs17 = errors;
                                          if (errors === _errs17) {
                                            if (data8 && typeof data8 == "object" && !Array.isArray(data8)) {
                                              let missing2;
                                              if (data8.source === void 0 && (missing2 = "source") || data8.text === void 0 && (missing2 = "text")) {
                                                validate21.errors = [{ instancePath: instancePath + "/captures/" + i1 + "/annotation", schemaPath: "#/properties/captures/items/properties/annotation/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
                                                return false;
                                              } else {
                                                const _errs19 = errors;
                                                for (const key2 in data8) {
                                                  if (!(key2 === "source" || key2 === "text")) {
                                                    validate21.errors = [{ instancePath: instancePath + "/captures/" + i1 + "/annotation", schemaPath: "#/properties/captures/items/properties/annotation/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                                                    return false;
                                                    break;
                                                  }
                                                }
                                                if (_errs19 === errors) {
                                                  if (data8.source !== void 0) {
                                                    const _errs20 = errors;
                                                    if ("user" !== data8.source) {
                                                      validate21.errors = [{ instancePath: instancePath + "/captures/" + i1 + "/annotation/source", schemaPath: "#/properties/captures/items/properties/annotation/properties/source/const", keyword: "const", params: { allowedValue: "user" }, message: "must be equal to constant" }];
                                                      return false;
                                                    }
                                                    var valid4 = _errs20 === errors;
                                                  } else {
                                                    var valid4 = true;
                                                  }
                                                  if (valid4) {
                                                    if (data8.text !== void 0) {
                                                      let data10 = data8.text;
                                                      const _errs21 = errors;
                                                      if (errors === _errs21) {
                                                        if (typeof data10 === "string") {
                                                          if (func3(data10) > 2e3) {
                                                            validate21.errors = [{ instancePath: instancePath + "/captures/" + i1 + "/annotation/text", schemaPath: "#/properties/captures/items/properties/annotation/properties/text/maxLength", keyword: "maxLength", params: { limit: 2e3 }, message: "must NOT have more than 2000 characters" }];
                                                            return false;
                                                          }
                                                        } else {
                                                          validate21.errors = [{ instancePath: instancePath + "/captures/" + i1 + "/annotation/text", schemaPath: "#/properties/captures/items/properties/annotation/properties/text/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                          return false;
                                                        }
                                                      }
                                                      var valid4 = _errs21 === errors;
                                                    } else {
                                                      var valid4 = true;
                                                    }
                                                  }
                                                }
                                              }
                                            } else {
                                              validate21.errors = [{ instancePath: instancePath + "/captures/" + i1 + "/annotation", schemaPath: "#/properties/captures/items/properties/annotation/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                              return false;
                                            }
                                          }
                                          var valid3 = _errs17 === errors;
                                        } else {
                                          var valid3 = true;
                                        }
                                        if (valid3) {
                                          if (data7.report !== void 0) {
                                            const _errs23 = errors;
                                            if (!validate20(data7.report, { instancePath: instancePath + "/captures/" + i1 + "/report", parentData: data7, parentDataProperty: "report", rootData, dynamicAnchors })) {
                                              vErrors = vErrors === null ? validate20.errors : vErrors.concat(validate20.errors);
                                              errors = vErrors.length;
                                            }
                                            var valid3 = _errs23 === errors;
                                          } else {
                                            var valid3 = true;
                                          }
                                          if (valid3) {
                                            if (data7.comparison !== void 0) {
                                              let data12 = data7.comparison;
                                              const _errs24 = errors;
                                              const _errs25 = errors;
                                              let valid5 = false;
                                              const _errs26 = errors;
                                              if (data12 !== null) {
                                                const err0 = { instancePath: instancePath + "/captures/" + i1 + "/comparison", schemaPath: "#/properties/captures/items/properties/comparison/anyOf/0/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                if (vErrors === null) {
                                                  vErrors = [err0];
                                                } else {
                                                  vErrors.push(err0);
                                                }
                                                errors++;
                                              }
                                              var _valid0 = _errs26 === errors;
                                              valid5 = valid5 || _valid0;
                                              const _errs28 = errors;
                                              if (errors === _errs28) {
                                                if (data12 && typeof data12 == "object" && !Array.isArray(data12)) {
                                                  let missing3;
                                                  if (data12.comparable === void 0 && (missing3 = "comparable") || data12.reason === void 0 && (missing3 = "reason") || data12.changes === void 0 && (missing3 = "changes")) {
                                                    const err1 = { instancePath: instancePath + "/captures/" + i1 + "/comparison", schemaPath: "#/properties/captures/items/properties/comparison/anyOf/1/required", keyword: "required", params: { missingProperty: missing3 }, message: "must have required property '" + missing3 + "'" };
                                                    if (vErrors === null) {
                                                      vErrors = [err1];
                                                    } else {
                                                      vErrors.push(err1);
                                                    }
                                                    errors++;
                                                  } else {
                                                    const _errs30 = errors;
                                                    for (const key3 in data12) {
                                                      if (!(key3 === "comparable" || key3 === "reason" || key3 === "changes")) {
                                                        const err2 = { instancePath: instancePath + "/captures/" + i1 + "/comparison", schemaPath: "#/properties/captures/items/properties/comparison/anyOf/1/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties" };
                                                        if (vErrors === null) {
                                                          vErrors = [err2];
                                                        } else {
                                                          vErrors.push(err2);
                                                        }
                                                        errors++;
                                                        break;
                                                      }
                                                    }
                                                    if (_errs30 === errors) {
                                                      if (data12.comparable !== void 0) {
                                                        const _errs31 = errors;
                                                        if (typeof data12.comparable !== "boolean") {
                                                          const err3 = { instancePath: instancePath + "/captures/" + i1 + "/comparison/comparable", schemaPath: "#/properties/captures/items/properties/comparison/anyOf/1/properties/comparable/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                          if (vErrors === null) {
                                                            vErrors = [err3];
                                                          } else {
                                                            vErrors.push(err3);
                                                          }
                                                          errors++;
                                                        }
                                                        var valid6 = _errs31 === errors;
                                                      } else {
                                                        var valid6 = true;
                                                      }
                                                      if (valid6) {
                                                        if (data12.reason !== void 0) {
                                                          const _errs33 = errors;
                                                          if (typeof data12.reason !== "string") {
                                                            const err4 = { instancePath: instancePath + "/captures/" + i1 + "/comparison/reason", schemaPath: "#/properties/captures/items/properties/comparison/anyOf/1/properties/reason/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                            if (vErrors === null) {
                                                              vErrors = [err4];
                                                            } else {
                                                              vErrors.push(err4);
                                                            }
                                                            errors++;
                                                          }
                                                          var valid6 = _errs33 === errors;
                                                        } else {
                                                          var valid6 = true;
                                                        }
                                                        if (valid6) {
                                                          if (data12.changes !== void 0) {
                                                            let data15 = data12.changes;
                                                            const _errs35 = errors;
                                                            if (errors === _errs35) {
                                                              if (Array.isArray(data15)) {
                                                                var valid7 = true;
                                                                const len2 = data15.length;
                                                                for (let i2 = 0; i2 < len2; i2++) {
                                                                  let data16 = data15[i2];
                                                                  const _errs37 = errors;
                                                                  if (errors === _errs37) {
                                                                    if (data16 && typeof data16 == "object" && !Array.isArray(data16)) {
                                                                      let missing4;
                                                                      if (data16.id === void 0 && (missing4 = "id") || data16.kind === void 0 && (missing4 = "kind") || data16.fields === void 0 && (missing4 = "fields")) {
                                                                        const err5 = { instancePath: instancePath + "/captures/" + i1 + "/comparison/changes/" + i2, schemaPath: "#/properties/captures/items/properties/comparison/anyOf/1/properties/changes/items/required", keyword: "required", params: { missingProperty: missing4 }, message: "must have required property '" + missing4 + "'" };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err5];
                                                                        } else {
                                                                          vErrors.push(err5);
                                                                        }
                                                                        errors++;
                                                                      } else {
                                                                        const _errs39 = errors;
                                                                        for (const key4 in data16) {
                                                                          if (!(key4 === "id" || key4 === "kind" || key4 === "fields")) {
                                                                            const err6 = { instancePath: instancePath + "/captures/" + i1 + "/comparison/changes/" + i2, schemaPath: "#/properties/captures/items/properties/comparison/anyOf/1/properties/changes/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties" };
                                                                            if (vErrors === null) {
                                                                              vErrors = [err6];
                                                                            } else {
                                                                              vErrors.push(err6);
                                                                            }
                                                                            errors++;
                                                                            break;
                                                                          }
                                                                        }
                                                                        if (_errs39 === errors) {
                                                                          if (data16.id !== void 0) {
                                                                            const _errs40 = errors;
                                                                            if (typeof data16.id !== "string") {
                                                                              const err7 = { instancePath: instancePath + "/captures/" + i1 + "/comparison/changes/" + i2 + "/id", schemaPath: "#/properties/captures/items/properties/comparison/anyOf/1/properties/changes/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                              if (vErrors === null) {
                                                                                vErrors = [err7];
                                                                              } else {
                                                                                vErrors.push(err7);
                                                                              }
                                                                              errors++;
                                                                            }
                                                                            var valid8 = _errs40 === errors;
                                                                          } else {
                                                                            var valid8 = true;
                                                                          }
                                                                          if (valid8) {
                                                                            if (data16.kind !== void 0) {
                                                                              let data18 = data16.kind;
                                                                              const _errs42 = errors;
                                                                              if (!(data18 === "added" || data18 === "removed" || data18 === "changed")) {
                                                                                const err8 = { instancePath: instancePath + "/captures/" + i1 + "/comparison/changes/" + i2 + "/kind", schemaPath: "#/properties/captures/items/properties/comparison/anyOf/1/properties/changes/items/properties/kind/enum", keyword: "enum", params: { allowedValues: schema37.properties.captures.items.properties.comparison.anyOf[1].properties.changes.items.properties.kind.enum }, message: "must be equal to one of the allowed values" };
                                                                                if (vErrors === null) {
                                                                                  vErrors = [err8];
                                                                                } else {
                                                                                  vErrors.push(err8);
                                                                                }
                                                                                errors++;
                                                                              }
                                                                              var valid8 = _errs42 === errors;
                                                                            } else {
                                                                              var valid8 = true;
                                                                            }
                                                                            if (valid8) {
                                                                              if (data16.fields !== void 0) {
                                                                                let data19 = data16.fields;
                                                                                const _errs43 = errors;
                                                                                if (errors === _errs43) {
                                                                                  if (Array.isArray(data19)) {
                                                                                    var valid9 = true;
                                                                                    const len3 = data19.length;
                                                                                    for (let i3 = 0; i3 < len3; i3++) {
                                                                                      let data20 = data19[i3];
                                                                                      const _errs45 = errors;
                                                                                      if (!(data20 === "name" || data20 === "category" || data20 === "manufacturer" || data20 === "hardwareIds" || data20 === "parent" || data20 === "location" || data20 === "status" || data20 === "problemCode")) {
                                                                                        const err9 = { instancePath: instancePath + "/captures/" + i1 + "/comparison/changes/" + i2 + "/fields/" + i3, schemaPath: "#/properties/captures/items/properties/comparison/anyOf/1/properties/changes/items/properties/fields/items/enum", keyword: "enum", params: { allowedValues: schema37.properties.captures.items.properties.comparison.anyOf[1].properties.changes.items.properties.fields.items.enum }, message: "must be equal to one of the allowed values" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err9];
                                                                                        } else {
                                                                                          vErrors.push(err9);
                                                                                        }
                                                                                        errors++;
                                                                                      }
                                                                                      var valid9 = _errs45 === errors;
                                                                                      if (!valid9) {
                                                                                        break;
                                                                                      }
                                                                                    }
                                                                                  } else {
                                                                                    const err10 = { instancePath: instancePath + "/captures/" + i1 + "/comparison/changes/" + i2 + "/fields", schemaPath: "#/properties/captures/items/properties/comparison/anyOf/1/properties/changes/items/properties/fields/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err10];
                                                                                    } else {
                                                                                      vErrors.push(err10);
                                                                                    }
                                                                                    errors++;
                                                                                  }
                                                                                }
                                                                                var valid8 = _errs43 === errors;
                                                                              } else {
                                                                                var valid8 = true;
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    } else {
                                                                      const err11 = { instancePath: instancePath + "/captures/" + i1 + "/comparison/changes/" + i2, schemaPath: "#/properties/captures/items/properties/comparison/anyOf/1/properties/changes/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err11];
                                                                      } else {
                                                                        vErrors.push(err11);
                                                                      }
                                                                      errors++;
                                                                    }
                                                                  }
                                                                  var valid7 = _errs37 === errors;
                                                                  if (!valid7) {
                                                                    break;
                                                                  }
                                                                }
                                                              } else {
                                                                const err12 = { instancePath: instancePath + "/captures/" + i1 + "/comparison/changes", schemaPath: "#/properties/captures/items/properties/comparison/anyOf/1/properties/changes/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err12];
                                                                } else {
                                                                  vErrors.push(err12);
                                                                }
                                                                errors++;
                                                              }
                                                            }
                                                            var valid6 = _errs35 === errors;
                                                          } else {
                                                            var valid6 = true;
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                } else {
                                                  const err13 = { instancePath: instancePath + "/captures/" + i1 + "/comparison", schemaPath: "#/properties/captures/items/properties/comparison/anyOf/1/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                                  if (vErrors === null) {
                                                    vErrors = [err13];
                                                  } else {
                                                    vErrors.push(err13);
                                                  }
                                                  errors++;
                                                }
                                              }
                                              var _valid0 = _errs28 === errors;
                                              valid5 = valid5 || _valid0;
                                              if (!valid5) {
                                                const err14 = { instancePath: instancePath + "/captures/" + i1 + "/comparison", schemaPath: "#/properties/captures/items/properties/comparison/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                if (vErrors === null) {
                                                  vErrors = [err14];
                                                } else {
                                                  vErrors.push(err14);
                                                }
                                                errors++;
                                                validate21.errors = vErrors;
                                                return false;
                                              } else {
                                                errors = _errs25;
                                                if (vErrors !== null) {
                                                  if (_errs25) {
                                                    vErrors.length = _errs25;
                                                  } else {
                                                    vErrors = null;
                                                  }
                                                }
                                              }
                                              var valid3 = _errs24 === errors;
                                            } else {
                                              var valid3 = true;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    validate21.errors = [{ instancePath: instancePath + "/captures/" + i1, schemaPath: "#/properties/captures/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                    return false;
                                  }
                                }
                                var valid2 = _errs14 === errors;
                                if (!valid2) {
                                  break;
                                }
                              }
                            }
                          }
                        } else {
                          validate21.errors = [{ instancePath: instancePath + "/captures", schemaPath: "#/properties/captures/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                          return false;
                        }
                      }
                      var valid0 = _errs12 === errors;
                    } else {
                      var valid0 = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate21.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate21.errors = vErrors;
  return errors === 0;
}
validate21.evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false };
var analysis = validate23;
var schema38 = { "type": "object", "required": ["schemaVersion", "appVersion", "sanitized", "source", "annotations", "comparison", "limitations"], "properties": { "schemaVersion": { "const": "binary-analysis-1.0" }, "appVersion": { "const": "0.2.0" }, "sanitized": { "type": "boolean" }, "source": { "type": "object", "required": ["name", "length", "sha256"], "properties": { "name": { "type": ["string", "null"] }, "length": { "type": "integer", "minimum": 1, "maximum": 1048576 }, "sha256": { "type": ["string", "null"], "pattern": "^[0-9a-f]{64}$" } }, "additionalProperties": false }, "annotations": { "type": "array", "items": { "type": "object", "required": ["offset", "length", "label", "status"], "properties": { "offset": { "type": "integer", "minimum": 0 }, "length": { "type": "integer", "minimum": 1 }, "label": { "type": "string", "maxLength": 2e3 }, "status": { "const": "unvalidated hypothesis" } }, "additionalProperties": false }, "maxItems": 256 }, "comparison": { "anyOf": [{ "type": "null" }, { "type": "object", "required": ["source", "differences", "firstOffsets", "commonPrefixLength", "offsetsTruncated", "limitations"], "properties": { "source": { "type": "object", "required": ["name", "length", "sha256"], "properties": { "name": { "type": ["string", "null"] }, "length": { "type": "integer", "minimum": 1, "maximum": 1048576 }, "sha256": { "type": ["string", "null"], "pattern": "^[0-9a-f]{64}$" } }, "additionalProperties": false }, "differences": { "type": "integer", "minimum": 0 }, "firstOffsets": { "type": "array", "items": { "type": "integer", "minimum": 0 }, "maxItems": 256 }, "commonPrefixLength": { "type": "integer", "minimum": 0 }, "offsetsTruncated": { "type": "boolean" }, "limitations": { "type": "string" } }, "additionalProperties": false }] }, "limitations": { "type": "array", "items": { "type": "string" } } }, "additionalProperties": false, "$schema": "https://json-schema.org/draft/2020-12/schema" };
var pattern8 = new RegExp("^[0-9a-f]{64}$", "u");
function validate23(data: any, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {}): boolean {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate23.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = void 0;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = void 0;
  }
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.schemaVersion === void 0 && (missing0 = "schemaVersion") || data.appVersion === void 0 && (missing0 = "appVersion") || data.sanitized === void 0 && (missing0 = "sanitized") || data.source === void 0 && (missing0 = "source") || data.annotations === void 0 && (missing0 = "annotations") || data.comparison === void 0 && (missing0 = "comparison") || data.limitations === void 0 && (missing0 = "limitations")) {
        validate23.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "schemaVersion" || key0 === "appVersion" || key0 === "sanitized" || key0 === "source" || key0 === "annotations" || key0 === "comparison" || key0 === "limitations")) {
            validate23.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.schemaVersion !== void 0) {
            const _errs2 = errors;
            if ("binary-analysis-1.0" !== data.schemaVersion) {
              validate23.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: "binary-analysis-1.0" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.appVersion !== void 0) {
              const _errs3 = errors;
              if ("0.2.0" !== data.appVersion) {
                validate23.errors = [{ instancePath: instancePath + "/appVersion", schemaPath: "#/properties/appVersion/const", keyword: "const", params: { allowedValue: "0.2.0" }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.sanitized !== void 0) {
                const _errs4 = errors;
                if (typeof data.sanitized !== "boolean") {
                  validate23.errors = [{ instancePath: instancePath + "/sanitized", schemaPath: "#/properties/sanitized/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                  return false;
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.source !== void 0) {
                  let data3 = data.source;
                  const _errs6 = errors;
                  if (errors === _errs6) {
                    if (data3 && typeof data3 == "object" && !Array.isArray(data3)) {
                      let missing1;
                      if (data3.name === void 0 && (missing1 = "name") || data3.length === void 0 && (missing1 = "length") || data3.sha256 === void 0 && (missing1 = "sha256")) {
                        validate23.errors = [{ instancePath: instancePath + "/source", schemaPath: "#/properties/source/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                        return false;
                      } else {
                        const _errs8 = errors;
                        for (const key1 in data3) {
                          if (!(key1 === "name" || key1 === "length" || key1 === "sha256")) {
                            validate23.errors = [{ instancePath: instancePath + "/source", schemaPath: "#/properties/source/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                            return false;
                            break;
                          }
                        }
                        if (_errs8 === errors) {
                          if (data3.name !== void 0) {
                            let data4 = data3.name;
                            const _errs9 = errors;
                            if (typeof data4 !== "string" && data4 !== null) {
                              validate23.errors = [{ instancePath: instancePath + "/source/name", schemaPath: "#/properties/source/properties/name/type", keyword: "type", params: { type: schema38.properties.source.properties.name.type }, message: "must be string,null" }];
                              return false;
                            }
                            var valid1 = _errs9 === errors;
                          } else {
                            var valid1 = true;
                          }
                          if (valid1) {
                            if (data3.length !== void 0) {
                              let data5 = data3.length;
                              const _errs11 = errors;
                              if (!(typeof data5 == "number" && (!(data5 % 1) && !isNaN(data5)) && isFinite(data5))) {
                                validate23.errors = [{ instancePath: instancePath + "/source/length", schemaPath: "#/properties/source/properties/length/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                return false;
                              }
                              if (errors === _errs11) {
                                if (typeof data5 == "number" && isFinite(data5)) {
                                  if (data5 > 1048576 || isNaN(data5)) {
                                    validate23.errors = [{ instancePath: instancePath + "/source/length", schemaPath: "#/properties/source/properties/length/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1048576 }, message: "must be <= 1048576" }];
                                    return false;
                                  } else {
                                    if (data5 < 1 || isNaN(data5)) {
                                      validate23.errors = [{ instancePath: instancePath + "/source/length", schemaPath: "#/properties/source/properties/length/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" }];
                                      return false;
                                    }
                                  }
                                }
                              }
                              var valid1 = _errs11 === errors;
                            } else {
                              var valid1 = true;
                            }
                            if (valid1) {
                              if (data3.sha256 !== void 0) {
                                let data6 = data3.sha256;
                                const _errs13 = errors;
                                if (typeof data6 !== "string" && data6 !== null) {
                                  validate23.errors = [{ instancePath: instancePath + "/source/sha256", schemaPath: "#/properties/source/properties/sha256/type", keyword: "type", params: { type: schema38.properties.source.properties.sha256.type }, message: "must be string,null" }];
                                  return false;
                                }
                                if (errors === _errs13) {
                                  if (typeof data6 === "string") {
                                    if (!pattern8.test(data6)) {
                                      validate23.errors = [{ instancePath: instancePath + "/source/sha256", schemaPath: "#/properties/source/properties/sha256/pattern", keyword: "pattern", params: { pattern: "^[0-9a-f]{64}$" }, message: 'must match pattern "^[0-9a-f]{64}$"' }];
                                      return false;
                                    }
                                  }
                                }
                                var valid1 = _errs13 === errors;
                              } else {
                                var valid1 = true;
                              }
                            }
                          }
                        }
                      }
                    } else {
                      validate23.errors = [{ instancePath: instancePath + "/source", schemaPath: "#/properties/source/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                      return false;
                    }
                  }
                  var valid0 = _errs6 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.annotations !== void 0) {
                    let data7 = data.annotations;
                    const _errs15 = errors;
                    if (errors === _errs15) {
                      if (Array.isArray(data7)) {
                        if (data7.length > 256) {
                          validate23.errors = [{ instancePath: instancePath + "/annotations", schemaPath: "#/properties/annotations/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                          return false;
                        } else {
                          var valid2 = true;
                          const len0 = data7.length;
                          for (let i0 = 0; i0 < len0; i0++) {
                            let data8 = data7[i0];
                            const _errs17 = errors;
                            if (errors === _errs17) {
                              if (data8 && typeof data8 == "object" && !Array.isArray(data8)) {
                                let missing2;
                                if (data8.offset === void 0 && (missing2 = "offset") || data8.length === void 0 && (missing2 = "length") || data8.label === void 0 && (missing2 = "label") || data8.status === void 0 && (missing2 = "status")) {
                                  validate23.errors = [{ instancePath: instancePath + "/annotations/" + i0, schemaPath: "#/properties/annotations/items/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
                                  return false;
                                } else {
                                  const _errs19 = errors;
                                  for (const key2 in data8) {
                                    if (!(key2 === "offset" || key2 === "length" || key2 === "label" || key2 === "status")) {
                                      validate23.errors = [{ instancePath: instancePath + "/annotations/" + i0, schemaPath: "#/properties/annotations/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                                      return false;
                                      break;
                                    }
                                  }
                                  if (_errs19 === errors) {
                                    if (data8.offset !== void 0) {
                                      let data9 = data8.offset;
                                      const _errs20 = errors;
                                      if (!(typeof data9 == "number" && (!(data9 % 1) && !isNaN(data9)) && isFinite(data9))) {
                                        validate23.errors = [{ instancePath: instancePath + "/annotations/" + i0 + "/offset", schemaPath: "#/properties/annotations/items/properties/offset/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                        return false;
                                      }
                                      if (errors === _errs20) {
                                        if (typeof data9 == "number" && isFinite(data9)) {
                                          if (data9 < 0 || isNaN(data9)) {
                                            validate23.errors = [{ instancePath: instancePath + "/annotations/" + i0 + "/offset", schemaPath: "#/properties/annotations/items/properties/offset/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                            return false;
                                          }
                                        }
                                      }
                                      var valid3 = _errs20 === errors;
                                    } else {
                                      var valid3 = true;
                                    }
                                    if (valid3) {
                                      if (data8.length !== void 0) {
                                        let data10 = data8.length;
                                        const _errs22 = errors;
                                        if (!(typeof data10 == "number" && (!(data10 % 1) && !isNaN(data10)) && isFinite(data10))) {
                                          validate23.errors = [{ instancePath: instancePath + "/annotations/" + i0 + "/length", schemaPath: "#/properties/annotations/items/properties/length/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                          return false;
                                        }
                                        if (errors === _errs22) {
                                          if (typeof data10 == "number" && isFinite(data10)) {
                                            if (data10 < 1 || isNaN(data10)) {
                                              validate23.errors = [{ instancePath: instancePath + "/annotations/" + i0 + "/length", schemaPath: "#/properties/annotations/items/properties/length/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" }];
                                              return false;
                                            }
                                          }
                                        }
                                        var valid3 = _errs22 === errors;
                                      } else {
                                        var valid3 = true;
                                      }
                                      if (valid3) {
                                        if (data8.label !== void 0) {
                                          let data11 = data8.label;
                                          const _errs24 = errors;
                                          if (errors === _errs24) {
                                            if (typeof data11 === "string") {
                                              if (func3(data11) > 2e3) {
                                                validate23.errors = [{ instancePath: instancePath + "/annotations/" + i0 + "/label", schemaPath: "#/properties/annotations/items/properties/label/maxLength", keyword: "maxLength", params: { limit: 2e3 }, message: "must NOT have more than 2000 characters" }];
                                                return false;
                                              }
                                            } else {
                                              validate23.errors = [{ instancePath: instancePath + "/annotations/" + i0 + "/label", schemaPath: "#/properties/annotations/items/properties/label/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                              return false;
                                            }
                                          }
                                          var valid3 = _errs24 === errors;
                                        } else {
                                          var valid3 = true;
                                        }
                                        if (valid3) {
                                          if (data8.status !== void 0) {
                                            const _errs26 = errors;
                                            if ("unvalidated hypothesis" !== data8.status) {
                                              validate23.errors = [{ instancePath: instancePath + "/annotations/" + i0 + "/status", schemaPath: "#/properties/annotations/items/properties/status/const", keyword: "const", params: { allowedValue: "unvalidated hypothesis" }, message: "must be equal to constant" }];
                                              return false;
                                            }
                                            var valid3 = _errs26 === errors;
                                          } else {
                                            var valid3 = true;
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              } else {
                                validate23.errors = [{ instancePath: instancePath + "/annotations/" + i0, schemaPath: "#/properties/annotations/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                return false;
                              }
                            }
                            var valid2 = _errs17 === errors;
                            if (!valid2) {
                              break;
                            }
                          }
                        }
                      } else {
                        validate23.errors = [{ instancePath: instancePath + "/annotations", schemaPath: "#/properties/annotations/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                        return false;
                      }
                    }
                    var valid0 = _errs15 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.comparison !== void 0) {
                      let data13 = data.comparison;
                      const _errs27 = errors;
                      const _errs28 = errors;
                      let valid4 = false;
                      const _errs29 = errors;
                      if (data13 !== null) {
                        const err0 = { instancePath: instancePath + "/comparison", schemaPath: "#/properties/comparison/anyOf/0/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                        if (vErrors === null) {
                          vErrors = [err0];
                        } else {
                          vErrors.push(err0);
                        }
                        errors++;
                      }
                      var _valid0 = _errs29 === errors;
                      valid4 = valid4 || _valid0;
                      const _errs31 = errors;
                      if (errors === _errs31) {
                        if (data13 && typeof data13 == "object" && !Array.isArray(data13)) {
                          let missing3;
                          if (data13.source === void 0 && (missing3 = "source") || data13.differences === void 0 && (missing3 = "differences") || data13.firstOffsets === void 0 && (missing3 = "firstOffsets") || data13.commonPrefixLength === void 0 && (missing3 = "commonPrefixLength") || data13.offsetsTruncated === void 0 && (missing3 = "offsetsTruncated") || data13.limitations === void 0 && (missing3 = "limitations")) {
                            const err1 = { instancePath: instancePath + "/comparison", schemaPath: "#/properties/comparison/anyOf/1/required", keyword: "required", params: { missingProperty: missing3 }, message: "must have required property '" + missing3 + "'" };
                            if (vErrors === null) {
                              vErrors = [err1];
                            } else {
                              vErrors.push(err1);
                            }
                            errors++;
                          } else {
                            const _errs33 = errors;
                            for (const key3 in data13) {
                              if (!(key3 === "source" || key3 === "differences" || key3 === "firstOffsets" || key3 === "commonPrefixLength" || key3 === "offsetsTruncated" || key3 === "limitations")) {
                                const err2 = { instancePath: instancePath + "/comparison", schemaPath: "#/properties/comparison/anyOf/1/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties" };
                                if (vErrors === null) {
                                  vErrors = [err2];
                                } else {
                                  vErrors.push(err2);
                                }
                                errors++;
                                break;
                              }
                            }
                            if (_errs33 === errors) {
                              if (data13.source !== void 0) {
                                let data14 = data13.source;
                                const _errs34 = errors;
                                if (errors === _errs34) {
                                  if (data14 && typeof data14 == "object" && !Array.isArray(data14)) {
                                    let missing4;
                                    if (data14.name === void 0 && (missing4 = "name") || data14.length === void 0 && (missing4 = "length") || data14.sha256 === void 0 && (missing4 = "sha256")) {
                                      const err3 = { instancePath: instancePath + "/comparison/source", schemaPath: "#/properties/comparison/anyOf/1/properties/source/required", keyword: "required", params: { missingProperty: missing4 }, message: "must have required property '" + missing4 + "'" };
                                      if (vErrors === null) {
                                        vErrors = [err3];
                                      } else {
                                        vErrors.push(err3);
                                      }
                                      errors++;
                                    } else {
                                      const _errs36 = errors;
                                      for (const key4 in data14) {
                                        if (!(key4 === "name" || key4 === "length" || key4 === "sha256")) {
                                          const err4 = { instancePath: instancePath + "/comparison/source", schemaPath: "#/properties/comparison/anyOf/1/properties/source/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties" };
                                          if (vErrors === null) {
                                            vErrors = [err4];
                                          } else {
                                            vErrors.push(err4);
                                          }
                                          errors++;
                                          break;
                                        }
                                      }
                                      if (_errs36 === errors) {
                                        if (data14.name !== void 0) {
                                          let data15 = data14.name;
                                          const _errs37 = errors;
                                          if (typeof data15 !== "string" && data15 !== null) {
                                            const err5 = { instancePath: instancePath + "/comparison/source/name", schemaPath: "#/properties/comparison/anyOf/1/properties/source/properties/name/type", keyword: "type", params: { type: schema38.properties.comparison.anyOf[1].properties.source.properties.name.type }, message: "must be string,null" };
                                            if (vErrors === null) {
                                              vErrors = [err5];
                                            } else {
                                              vErrors.push(err5);
                                            }
                                            errors++;
                                          }
                                          var valid6 = _errs37 === errors;
                                        } else {
                                          var valid6 = true;
                                        }
                                        if (valid6) {
                                          if (data14.length !== void 0) {
                                            let data16 = data14.length;
                                            const _errs39 = errors;
                                            if (!(typeof data16 == "number" && (!(data16 % 1) && !isNaN(data16)) && isFinite(data16))) {
                                              const err6 = { instancePath: instancePath + "/comparison/source/length", schemaPath: "#/properties/comparison/anyOf/1/properties/source/properties/length/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                              if (vErrors === null) {
                                                vErrors = [err6];
                                              } else {
                                                vErrors.push(err6);
                                              }
                                              errors++;
                                            }
                                            if (errors === _errs39) {
                                              if (typeof data16 == "number" && isFinite(data16)) {
                                                if (data16 > 1048576 || isNaN(data16)) {
                                                  const err7 = { instancePath: instancePath + "/comparison/source/length", schemaPath: "#/properties/comparison/anyOf/1/properties/source/properties/length/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1048576 }, message: "must be <= 1048576" };
                                                  if (vErrors === null) {
                                                    vErrors = [err7];
                                                  } else {
                                                    vErrors.push(err7);
                                                  }
                                                  errors++;
                                                } else {
                                                  if (data16 < 1 || isNaN(data16)) {
                                                    const err8 = { instancePath: instancePath + "/comparison/source/length", schemaPath: "#/properties/comparison/anyOf/1/properties/source/properties/length/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" };
                                                    if (vErrors === null) {
                                                      vErrors = [err8];
                                                    } else {
                                                      vErrors.push(err8);
                                                    }
                                                    errors++;
                                                  }
                                                }
                                              }
                                            }
                                            var valid6 = _errs39 === errors;
                                          } else {
                                            var valid6 = true;
                                          }
                                          if (valid6) {
                                            if (data14.sha256 !== void 0) {
                                              let data17 = data14.sha256;
                                              const _errs41 = errors;
                                              if (typeof data17 !== "string" && data17 !== null) {
                                                const err9 = { instancePath: instancePath + "/comparison/source/sha256", schemaPath: "#/properties/comparison/anyOf/1/properties/source/properties/sha256/type", keyword: "type", params: { type: schema38.properties.comparison.anyOf[1].properties.source.properties.sha256.type }, message: "must be string,null" };
                                                if (vErrors === null) {
                                                  vErrors = [err9];
                                                } else {
                                                  vErrors.push(err9);
                                                }
                                                errors++;
                                              }
                                              if (errors === _errs41) {
                                                if (typeof data17 === "string") {
                                                  if (!pattern8.test(data17)) {
                                                    const err10 = { instancePath: instancePath + "/comparison/source/sha256", schemaPath: "#/properties/comparison/anyOf/1/properties/source/properties/sha256/pattern", keyword: "pattern", params: { pattern: "^[0-9a-f]{64}$" }, message: 'must match pattern "^[0-9a-f]{64}$"' };
                                                    if (vErrors === null) {
                                                      vErrors = [err10];
                                                    } else {
                                                      vErrors.push(err10);
                                                    }
                                                    errors++;
                                                  }
                                                }
                                              }
                                              var valid6 = _errs41 === errors;
                                            } else {
                                              var valid6 = true;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    const err11 = { instancePath: instancePath + "/comparison/source", schemaPath: "#/properties/comparison/anyOf/1/properties/source/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                    if (vErrors === null) {
                                      vErrors = [err11];
                                    } else {
                                      vErrors.push(err11);
                                    }
                                    errors++;
                                  }
                                }
                                var valid5 = _errs34 === errors;
                              } else {
                                var valid5 = true;
                              }
                              if (valid5) {
                                if (data13.differences !== void 0) {
                                  let data18 = data13.differences;
                                  const _errs43 = errors;
                                  if (!(typeof data18 == "number" && (!(data18 % 1) && !isNaN(data18)) && isFinite(data18))) {
                                    const err12 = { instancePath: instancePath + "/comparison/differences", schemaPath: "#/properties/comparison/anyOf/1/properties/differences/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                    if (vErrors === null) {
                                      vErrors = [err12];
                                    } else {
                                      vErrors.push(err12);
                                    }
                                    errors++;
                                  }
                                  if (errors === _errs43) {
                                    if (typeof data18 == "number" && isFinite(data18)) {
                                      if (data18 < 0 || isNaN(data18)) {
                                        const err13 = { instancePath: instancePath + "/comparison/differences", schemaPath: "#/properties/comparison/anyOf/1/properties/differences/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                        if (vErrors === null) {
                                          vErrors = [err13];
                                        } else {
                                          vErrors.push(err13);
                                        }
                                        errors++;
                                      }
                                    }
                                  }
                                  var valid5 = _errs43 === errors;
                                } else {
                                  var valid5 = true;
                                }
                                if (valid5) {
                                  if (data13.firstOffsets !== void 0) {
                                    let data19 = data13.firstOffsets;
                                    const _errs45 = errors;
                                    if (errors === _errs45) {
                                      if (Array.isArray(data19)) {
                                        if (data19.length > 256) {
                                          const err14 = { instancePath: instancePath + "/comparison/firstOffsets", schemaPath: "#/properties/comparison/anyOf/1/properties/firstOffsets/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" };
                                          if (vErrors === null) {
                                            vErrors = [err14];
                                          } else {
                                            vErrors.push(err14);
                                          }
                                          errors++;
                                        } else {
                                          var valid7 = true;
                                          const len1 = data19.length;
                                          for (let i1 = 0; i1 < len1; i1++) {
                                            let data20 = data19[i1];
                                            const _errs47 = errors;
                                            if (!(typeof data20 == "number" && (!(data20 % 1) && !isNaN(data20)) && isFinite(data20))) {
                                              const err15 = { instancePath: instancePath + "/comparison/firstOffsets/" + i1, schemaPath: "#/properties/comparison/anyOf/1/properties/firstOffsets/items/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                              if (vErrors === null) {
                                                vErrors = [err15];
                                              } else {
                                                vErrors.push(err15);
                                              }
                                              errors++;
                                            }
                                            if (errors === _errs47) {
                                              if (typeof data20 == "number" && isFinite(data20)) {
                                                if (data20 < 0 || isNaN(data20)) {
                                                  const err16 = { instancePath: instancePath + "/comparison/firstOffsets/" + i1, schemaPath: "#/properties/comparison/anyOf/1/properties/firstOffsets/items/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                                  if (vErrors === null) {
                                                    vErrors = [err16];
                                                  } else {
                                                    vErrors.push(err16);
                                                  }
                                                  errors++;
                                                }
                                              }
                                            }
                                            var valid7 = _errs47 === errors;
                                            if (!valid7) {
                                              break;
                                            }
                                          }
                                        }
                                      } else {
                                        const err17 = { instancePath: instancePath + "/comparison/firstOffsets", schemaPath: "#/properties/comparison/anyOf/1/properties/firstOffsets/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                        if (vErrors === null) {
                                          vErrors = [err17];
                                        } else {
                                          vErrors.push(err17);
                                        }
                                        errors++;
                                      }
                                    }
                                    var valid5 = _errs45 === errors;
                                  } else {
                                    var valid5 = true;
                                  }
                                  if (valid5) {
                                    if (data13.commonPrefixLength !== void 0) {
                                      let data21 = data13.commonPrefixLength;
                                      const _errs49 = errors;
                                      if (!(typeof data21 == "number" && (!(data21 % 1) && !isNaN(data21)) && isFinite(data21))) {
                                        const err18 = { instancePath: instancePath + "/comparison/commonPrefixLength", schemaPath: "#/properties/comparison/anyOf/1/properties/commonPrefixLength/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                        if (vErrors === null) {
                                          vErrors = [err18];
                                        } else {
                                          vErrors.push(err18);
                                        }
                                        errors++;
                                      }
                                      if (errors === _errs49) {
                                        if (typeof data21 == "number" && isFinite(data21)) {
                                          if (data21 < 0 || isNaN(data21)) {
                                            const err19 = { instancePath: instancePath + "/comparison/commonPrefixLength", schemaPath: "#/properties/comparison/anyOf/1/properties/commonPrefixLength/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                            if (vErrors === null) {
                                              vErrors = [err19];
                                            } else {
                                              vErrors.push(err19);
                                            }
                                            errors++;
                                          }
                                        }
                                      }
                                      var valid5 = _errs49 === errors;
                                    } else {
                                      var valid5 = true;
                                    }
                                    if (valid5) {
                                      if (data13.offsetsTruncated !== void 0) {
                                        const _errs51 = errors;
                                        if (typeof data13.offsetsTruncated !== "boolean") {
                                          const err20 = { instancePath: instancePath + "/comparison/offsetsTruncated", schemaPath: "#/properties/comparison/anyOf/1/properties/offsetsTruncated/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                          if (vErrors === null) {
                                            vErrors = [err20];
                                          } else {
                                            vErrors.push(err20);
                                          }
                                          errors++;
                                        }
                                        var valid5 = _errs51 === errors;
                                      } else {
                                        var valid5 = true;
                                      }
                                      if (valid5) {
                                        if (data13.limitations !== void 0) {
                                          const _errs53 = errors;
                                          if (typeof data13.limitations !== "string") {
                                            const err21 = { instancePath: instancePath + "/comparison/limitations", schemaPath: "#/properties/comparison/anyOf/1/properties/limitations/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                            if (vErrors === null) {
                                              vErrors = [err21];
                                            } else {
                                              vErrors.push(err21);
                                            }
                                            errors++;
                                          }
                                          var valid5 = _errs53 === errors;
                                        } else {
                                          var valid5 = true;
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        } else {
                          const err22 = { instancePath: instancePath + "/comparison", schemaPath: "#/properties/comparison/anyOf/1/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                          if (vErrors === null) {
                            vErrors = [err22];
                          } else {
                            vErrors.push(err22);
                          }
                          errors++;
                        }
                      }
                      var _valid0 = _errs31 === errors;
                      valid4 = valid4 || _valid0;
                      if (!valid4) {
                        const err23 = { instancePath: instancePath + "/comparison", schemaPath: "#/properties/comparison/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                        if (vErrors === null) {
                          vErrors = [err23];
                        } else {
                          vErrors.push(err23);
                        }
                        errors++;
                        validate23.errors = vErrors;
                        return false;
                      } else {
                        errors = _errs28;
                        if (vErrors !== null) {
                          if (_errs28) {
                            vErrors.length = _errs28;
                          } else {
                            vErrors = null;
                          }
                        }
                      }
                      var valid0 = _errs27 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.limitations !== void 0) {
                        let data24 = data.limitations;
                        const _errs55 = errors;
                        if (errors === _errs55) {
                          if (Array.isArray(data24)) {
                            var valid8 = true;
                            const len2 = data24.length;
                            for (let i2 = 0; i2 < len2; i2++) {
                              const _errs57 = errors;
                              if (typeof data24[i2] !== "string") {
                                validate23.errors = [{ instancePath: instancePath + "/limitations/" + i2, schemaPath: "#/properties/limitations/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                return false;
                              }
                              var valid8 = _errs57 === errors;
                              if (!valid8) {
                                break;
                              }
                            }
                          } else {
                            validate23.errors = [{ instancePath: instancePath + "/limitations", schemaPath: "#/properties/limitations/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                            return false;
                          }
                        }
                        var valid0 = _errs55 === errors;
                      } else {
                        var valid0 = true;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate23.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate23.errors = vErrors;
  return errors === 0;
}
validate23.evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false };
var workbench = validate24;
var schema39 = { "$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "https://anydevice.local/device-workbench.schema.json", "type": "object", "required": ["schemaVersion", "createdAt", "sanitized", "target", "userReport", "tests", "limitations"], "properties": { "schemaVersion": { "const": "device-workbench-1.0" }, "createdAt": { "type": "string" }, "sanitized": { "type": "boolean" }, "target": { "type": "object", "required": ["id", "name"], "properties": { "id": { "type": "string", "maxLength": 8192 }, "name": { "type": ["string", "null"] } }, "additionalProperties": false }, "userReport": { "type": "object", "required": ["source", "symptom", "conditions", "physicalAttempts"], "properties": { "source": { "const": "user" }, "symptom": { "type": ["string", "null"], "maxLength": 2e3 }, "conditions": { "type": ["string", "null"], "maxLength": 2e3 }, "physicalAttempts": { "type": ["integer", "null"], "minimum": 0, "maximum": 1e4 } }, "additionalProperties": false }, "tests": { "type": "array", "maxItems": 8, "items": { "type": "object", "required": ["targetId", "mode", "startedAt", "status", "cleanup", "stats", "historyTruncated"], "properties": { "targetId": { "type": "string", "maxLength": 8192 }, "mode": { "enum": ["mouse", "keyboard", "x-key"] }, "startedAt": { "type": "string" }, "status": { "enum": ["testing", "eventsObserved", "noEventsObserved", "completed", "focusLost", "disconnected", "failed", "unsupported"] }, "cleanup": { "type": "boolean" }, "historyTruncated": { "type": "boolean" }, "stats": { "type": "object", "required": ["events", "movements", "x", "y", "absolute", "buttons", "keys", "wheelUp", "wheelDown", "horizontal"], "properties": { "events": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "movements": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "wheelUp": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "wheelDown": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "horizontal": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "x": { "type": "integer" }, "y": { "type": "integer" }, "absolute": { "type": "boolean" }, "keys": { "type": "object", "maxProperties": 255, "propertyNames": { "pattern": "^(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-4])$" }, "additionalProperties": { "type": "object", "required": ["down", "up", "repeat", "held"], "properties": { "down": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "up": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "repeat": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "held": { "type": "boolean" } }, "additionalProperties": false } }, "buttons": { "type": "object", "maxProperties": 5, "propertyNames": { "pattern": "^[1-5]$" }, "additionalProperties": { "type": "object", "required": ["down", "up", "repeat", "held"], "properties": { "down": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "up": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "repeat": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "held": { "type": "boolean" } }, "additionalProperties": false } } }, "additionalProperties": false } }, "additionalProperties": false } }, "limitations": { "type": "array", "maxItems": 10, "items": { "type": "string" } } }, "additionalProperties": false };
var pattern10 = new RegExp("^(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-4])$", "u");
var pattern11 = new RegExp("^[1-5]$", "u");
function validate24(data: any, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {}): boolean {
  ;
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate24.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = void 0;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = void 0;
  }
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.schemaVersion === void 0 && (missing0 = "schemaVersion") || data.createdAt === void 0 && (missing0 = "createdAt") || data.sanitized === void 0 && (missing0 = "sanitized") || data.target === void 0 && (missing0 = "target") || data.userReport === void 0 && (missing0 = "userReport") || data.tests === void 0 && (missing0 = "tests") || data.limitations === void 0 && (missing0 = "limitations")) {
        validate24.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "schemaVersion" || key0 === "createdAt" || key0 === "sanitized" || key0 === "target" || key0 === "userReport" || key0 === "tests" || key0 === "limitations")) {
            validate24.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.schemaVersion !== void 0) {
            const _errs2 = errors;
            if ("device-workbench-1.0" !== data.schemaVersion) {
              validate24.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: "device-workbench-1.0" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.createdAt !== void 0) {
              const _errs3 = errors;
              if (typeof data.createdAt !== "string") {
                validate24.errors = [{ instancePath: instancePath + "/createdAt", schemaPath: "#/properties/createdAt/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.sanitized !== void 0) {
                const _errs5 = errors;
                if (typeof data.sanitized !== "boolean") {
                  validate24.errors = [{ instancePath: instancePath + "/sanitized", schemaPath: "#/properties/sanitized/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                  return false;
                }
                var valid0 = _errs5 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.target !== void 0) {
                  let data3 = data.target;
                  const _errs7 = errors;
                  if (errors === _errs7) {
                    if (data3 && typeof data3 == "object" && !Array.isArray(data3)) {
                      let missing1;
                      if (data3.id === void 0 && (missing1 = "id") || data3.name === void 0 && (missing1 = "name")) {
                        validate24.errors = [{ instancePath: instancePath + "/target", schemaPath: "#/properties/target/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                        return false;
                      } else {
                        const _errs9 = errors;
                        for (const key1 in data3) {
                          if (!(key1 === "id" || key1 === "name")) {
                            validate24.errors = [{ instancePath: instancePath + "/target", schemaPath: "#/properties/target/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                            return false;
                            break;
                          }
                        }
                        if (_errs9 === errors) {
                          if (data3.id !== void 0) {
                            let data4 = data3.id;
                            const _errs10 = errors;
                            if (errors === _errs10) {
                              if (typeof data4 === "string") {
                                if (func3(data4) > 8192) {
                                  validate24.errors = [{ instancePath: instancePath + "/target/id", schemaPath: "#/properties/target/properties/id/maxLength", keyword: "maxLength", params: { limit: 8192 }, message: "must NOT have more than 8192 characters" }];
                                  return false;
                                }
                              } else {
                                validate24.errors = [{ instancePath: instancePath + "/target/id", schemaPath: "#/properties/target/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                return false;
                              }
                            }
                            var valid1 = _errs10 === errors;
                          } else {
                            var valid1 = true;
                          }
                          if (valid1) {
                            if (data3.name !== void 0) {
                              let data5 = data3.name;
                              const _errs12 = errors;
                              if (typeof data5 !== "string" && data5 !== null) {
                                validate24.errors = [{ instancePath: instancePath + "/target/name", schemaPath: "#/properties/target/properties/name/type", keyword: "type", params: { type: schema39.properties.target.properties.name.type }, message: "must be string,null" }];
                                return false;
                              }
                              var valid1 = _errs12 === errors;
                            } else {
                              var valid1 = true;
                            }
                          }
                        }
                      }
                    } else {
                      validate24.errors = [{ instancePath: instancePath + "/target", schemaPath: "#/properties/target/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                      return false;
                    }
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.userReport !== void 0) {
                    let data6 = data.userReport;
                    const _errs14 = errors;
                    if (errors === _errs14) {
                      if (data6 && typeof data6 == "object" && !Array.isArray(data6)) {
                        let missing2;
                        if (data6.source === void 0 && (missing2 = "source") || data6.symptom === void 0 && (missing2 = "symptom") || data6.conditions === void 0 && (missing2 = "conditions") || data6.physicalAttempts === void 0 && (missing2 = "physicalAttempts")) {
                          validate24.errors = [{ instancePath: instancePath + "/userReport", schemaPath: "#/properties/userReport/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
                          return false;
                        } else {
                          const _errs16 = errors;
                          for (const key2 in data6) {
                            if (!(key2 === "source" || key2 === "symptom" || key2 === "conditions" || key2 === "physicalAttempts")) {
                              validate24.errors = [{ instancePath: instancePath + "/userReport", schemaPath: "#/properties/userReport/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                              return false;
                              break;
                            }
                          }
                          if (_errs16 === errors) {
                            if (data6.source !== void 0) {
                              const _errs17 = errors;
                              if ("user" !== data6.source) {
                                validate24.errors = [{ instancePath: instancePath + "/userReport/source", schemaPath: "#/properties/userReport/properties/source/const", keyword: "const", params: { allowedValue: "user" }, message: "must be equal to constant" }];
                                return false;
                              }
                              var valid2 = _errs17 === errors;
                            } else {
                              var valid2 = true;
                            }
                            if (valid2) {
                              if (data6.symptom !== void 0) {
                                let data8 = data6.symptom;
                                const _errs18 = errors;
                                if (typeof data8 !== "string" && data8 !== null) {
                                  validate24.errors = [{ instancePath: instancePath + "/userReport/symptom", schemaPath: "#/properties/userReport/properties/symptom/type", keyword: "type", params: { type: schema39.properties.userReport.properties.symptom.type }, message: "must be string,null" }];
                                  return false;
                                }
                                if (errors === _errs18) {
                                  if (typeof data8 === "string") {
                                    if (func3(data8) > 2e3) {
                                      validate24.errors = [{ instancePath: instancePath + "/userReport/symptom", schemaPath: "#/properties/userReport/properties/symptom/maxLength", keyword: "maxLength", params: { limit: 2e3 }, message: "must NOT have more than 2000 characters" }];
                                      return false;
                                    }
                                  }
                                }
                                var valid2 = _errs18 === errors;
                              } else {
                                var valid2 = true;
                              }
                              if (valid2) {
                                if (data6.conditions !== void 0) {
                                  let data9 = data6.conditions;
                                  const _errs20 = errors;
                                  if (typeof data9 !== "string" && data9 !== null) {
                                    validate24.errors = [{ instancePath: instancePath + "/userReport/conditions", schemaPath: "#/properties/userReport/properties/conditions/type", keyword: "type", params: { type: schema39.properties.userReport.properties.conditions.type }, message: "must be string,null" }];
                                    return false;
                                  }
                                  if (errors === _errs20) {
                                    if (typeof data9 === "string") {
                                      if (func3(data9) > 2e3) {
                                        validate24.errors = [{ instancePath: instancePath + "/userReport/conditions", schemaPath: "#/properties/userReport/properties/conditions/maxLength", keyword: "maxLength", params: { limit: 2e3 }, message: "must NOT have more than 2000 characters" }];
                                        return false;
                                      }
                                    }
                                  }
                                  var valid2 = _errs20 === errors;
                                } else {
                                  var valid2 = true;
                                }
                                if (valid2) {
                                  if (data6.physicalAttempts !== void 0) {
                                    let data10 = data6.physicalAttempts;
                                    const _errs22 = errors;
                                    if (!(typeof data10 == "number" && (!(data10 % 1) && !isNaN(data10)) && isFinite(data10)) && data10 !== null) {
                                      validate24.errors = [{ instancePath: instancePath + "/userReport/physicalAttempts", schemaPath: "#/properties/userReport/properties/physicalAttempts/type", keyword: "type", params: { type: schema39.properties.userReport.properties.physicalAttempts.type }, message: "must be integer,null" }];
                                      return false;
                                    }
                                    if (errors === _errs22) {
                                      if (typeof data10 == "number" && isFinite(data10)) {
                                        if (data10 > 1e4 || isNaN(data10)) {
                                          validate24.errors = [{ instancePath: instancePath + "/userReport/physicalAttempts", schemaPath: "#/properties/userReport/properties/physicalAttempts/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1e4 }, message: "must be <= 10000" }];
                                          return false;
                                        } else {
                                          if (data10 < 0 || isNaN(data10)) {
                                            validate24.errors = [{ instancePath: instancePath + "/userReport/physicalAttempts", schemaPath: "#/properties/userReport/properties/physicalAttempts/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                            return false;
                                          }
                                        }
                                      }
                                    }
                                    var valid2 = _errs22 === errors;
                                  } else {
                                    var valid2 = true;
                                  }
                                }
                              }
                            }
                          }
                        }
                      } else {
                        validate24.errors = [{ instancePath: instancePath + "/userReport", schemaPath: "#/properties/userReport/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                        return false;
                      }
                    }
                    var valid0 = _errs14 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.tests !== void 0) {
                      let data11 = data.tests;
                      const _errs24 = errors;
                      if (errors === _errs24) {
                        if (Array.isArray(data11)) {
                          if (data11.length > 8) {
                            validate24.errors = [{ instancePath: instancePath + "/tests", schemaPath: "#/properties/tests/maxItems", keyword: "maxItems", params: { limit: 8 }, message: "must NOT have more than 8 items" }];
                            return false;
                          } else {
                            var valid3 = true;
                            const len0 = data11.length;
                            for (let i0 = 0; i0 < len0; i0++) {
                              let data12 = data11[i0];
                              const _errs26 = errors;
                              if (errors === _errs26) {
                                if (data12 && typeof data12 == "object" && !Array.isArray(data12)) {
                                  let missing3;
                                  if (data12.targetId === void 0 && (missing3 = "targetId") || data12.mode === void 0 && (missing3 = "mode") || data12.startedAt === void 0 && (missing3 = "startedAt") || data12.status === void 0 && (missing3 = "status") || data12.cleanup === void 0 && (missing3 = "cleanup") || data12.stats === void 0 && (missing3 = "stats") || data12.historyTruncated === void 0 && (missing3 = "historyTruncated")) {
                                    validate24.errors = [{ instancePath: instancePath + "/tests/" + i0, schemaPath: "#/properties/tests/items/required", keyword: "required", params: { missingProperty: missing3 }, message: "must have required property '" + missing3 + "'" }];
                                    return false;
                                  } else {
                                    const _errs28 = errors;
                                    for (const key3 in data12) {
                                      if (!(key3 === "targetId" || key3 === "mode" || key3 === "startedAt" || key3 === "status" || key3 === "cleanup" || key3 === "historyTruncated" || key3 === "stats")) {
                                        validate24.errors = [{ instancePath: instancePath + "/tests/" + i0, schemaPath: "#/properties/tests/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties" }];
                                        return false;
                                        break;
                                      }
                                    }
                                    if (_errs28 === errors) {
                                      if (data12.targetId !== void 0) {
                                        let data13 = data12.targetId;
                                        const _errs29 = errors;
                                        if (errors === _errs29) {
                                          if (typeof data13 === "string") {
                                            if (func3(data13) > 8192) {
                                              validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/targetId", schemaPath: "#/properties/tests/items/properties/targetId/maxLength", keyword: "maxLength", params: { limit: 8192 }, message: "must NOT have more than 8192 characters" }];
                                              return false;
                                            }
                                          } else {
                                            validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/targetId", schemaPath: "#/properties/tests/items/properties/targetId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                            return false;
                                          }
                                        }
                                        var valid4 = _errs29 === errors;
                                      } else {
                                        var valid4 = true;
                                      }
                                      if (valid4) {
                                        if (data12.mode !== void 0) {
                                          let data14 = data12.mode;
                                          const _errs31 = errors;
                                          if (!(data14 === "mouse" || data14 === "keyboard" || data14 === "x-key")) {
                                            validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/mode", schemaPath: "#/properties/tests/items/properties/mode/enum", keyword: "enum", params: { allowedValues: schema39.properties.tests.items.properties.mode.enum }, message: "must be equal to one of the allowed values" }];
                                            return false;
                                          }
                                          var valid4 = _errs31 === errors;
                                        } else {
                                          var valid4 = true;
                                        }
                                        if (valid4) {
                                          if (data12.startedAt !== void 0) {
                                            const _errs32 = errors;
                                            if (typeof data12.startedAt !== "string") {
                                              validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/startedAt", schemaPath: "#/properties/tests/items/properties/startedAt/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                              return false;
                                            }
                                            var valid4 = _errs32 === errors;
                                          } else {
                                            var valid4 = true;
                                          }
                                          if (valid4) {
                                            if (data12.status !== void 0) {
                                              let data16 = data12.status;
                                              const _errs34 = errors;
                                              if (!(data16 === "testing" || data16 === "eventsObserved" || data16 === "noEventsObserved" || data16 === "completed" || data16 === "focusLost" || data16 === "disconnected" || data16 === "failed" || data16 === "unsupported")) {
                                                validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/status", schemaPath: "#/properties/tests/items/properties/status/enum", keyword: "enum", params: { allowedValues: schema39.properties.tests.items.properties.status.enum }, message: "must be equal to one of the allowed values" }];
                                                return false;
                                              }
                                              var valid4 = _errs34 === errors;
                                            } else {
                                              var valid4 = true;
                                            }
                                            if (valid4) {
                                              if (data12.cleanup !== void 0) {
                                                const _errs35 = errors;
                                                if (typeof data12.cleanup !== "boolean") {
                                                  validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/cleanup", schemaPath: "#/properties/tests/items/properties/cleanup/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                                  return false;
                                                }
                                                var valid4 = _errs35 === errors;
                                              } else {
                                                var valid4 = true;
                                              }
                                              if (valid4) {
                                                if (data12.historyTruncated !== void 0) {
                                                  const _errs37 = errors;
                                                  if (typeof data12.historyTruncated !== "boolean") {
                                                    validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/historyTruncated", schemaPath: "#/properties/tests/items/properties/historyTruncated/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                                    return false;
                                                  }
                                                  var valid4 = _errs37 === errors;
                                                } else {
                                                  var valid4 = true;
                                                }
                                                if (valid4) {
                                                  if (data12.stats !== void 0) {
                                                    let data19 = data12.stats;
                                                    const _errs39 = errors;
                                                    if (errors === _errs39) {
                                                      if (data19 && typeof data19 == "object" && !Array.isArray(data19)) {
                                                        let missing4;
                                                        if (data19.events === void 0 && (missing4 = "events") || data19.movements === void 0 && (missing4 = "movements") || data19.x === void 0 && (missing4 = "x") || data19.y === void 0 && (missing4 = "y") || data19.absolute === void 0 && (missing4 = "absolute") || data19.buttons === void 0 && (missing4 = "buttons") || data19.keys === void 0 && (missing4 = "keys") || data19.wheelUp === void 0 && (missing4 = "wheelUp") || data19.wheelDown === void 0 && (missing4 = "wheelDown") || data19.horizontal === void 0 && (missing4 = "horizontal")) {
                                                          validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats", schemaPath: "#/properties/tests/items/properties/stats/required", keyword: "required", params: { missingProperty: missing4 }, message: "must have required property '" + missing4 + "'" }];
                                                          return false;
                                                        } else {
                                                          const _errs41 = errors;
                                                          for (const key4 in data19) {
                                                            if (!func1.call(schema39.properties.tests.items.properties.stats.properties, key4)) {
                                                              validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats", schemaPath: "#/properties/tests/items/properties/stats/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties" }];
                                                              return false;
                                                              break;
                                                            }
                                                          }
                                                          if (_errs41 === errors) {
                                                            if (data19.events !== void 0) {
                                                              let data20 = data19.events;
                                                              const _errs42 = errors;
                                                              if (!(typeof data20 == "number" && (!(data20 % 1) && !isNaN(data20)) && isFinite(data20))) {
                                                                validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/events", schemaPath: "#/properties/tests/items/properties/stats/properties/events/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                return false;
                                                              }
                                                              if (errors === _errs42) {
                                                                if (typeof data20 == "number" && isFinite(data20)) {
                                                                  if (data20 > 15e4 || isNaN(data20)) {
                                                                    validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/events", schemaPath: "#/properties/tests/items/properties/stats/properties/events/maximum", keyword: "maximum", params: { comparison: "<=", limit: 15e4 }, message: "must be <= 150000" }];
                                                                    return false;
                                                                  } else {
                                                                    if (data20 < 0 || isNaN(data20)) {
                                                                      validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/events", schemaPath: "#/properties/tests/items/properties/stats/properties/events/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                      return false;
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                              var valid5 = _errs42 === errors;
                                                            } else {
                                                              var valid5 = true;
                                                            }
                                                            if (valid5) {
                                                              if (data19.movements !== void 0) {
                                                                let data21 = data19.movements;
                                                                const _errs44 = errors;
                                                                if (!(typeof data21 == "number" && (!(data21 % 1) && !isNaN(data21)) && isFinite(data21))) {
                                                                  validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/movements", schemaPath: "#/properties/tests/items/properties/stats/properties/movements/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                  return false;
                                                                }
                                                                if (errors === _errs44) {
                                                                  if (typeof data21 == "number" && isFinite(data21)) {
                                                                    if (data21 > 15e4 || isNaN(data21)) {
                                                                      validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/movements", schemaPath: "#/properties/tests/items/properties/stats/properties/movements/maximum", keyword: "maximum", params: { comparison: "<=", limit: 15e4 }, message: "must be <= 150000" }];
                                                                      return false;
                                                                    } else {
                                                                      if (data21 < 0 || isNaN(data21)) {
                                                                        validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/movements", schemaPath: "#/properties/tests/items/properties/stats/properties/movements/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                        return false;
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                                var valid5 = _errs44 === errors;
                                                              } else {
                                                                var valid5 = true;
                                                              }
                                                              if (valid5) {
                                                                if (data19.wheelUp !== void 0) {
                                                                  let data22 = data19.wheelUp;
                                                                  const _errs46 = errors;
                                                                  if (!(typeof data22 == "number" && (!(data22 % 1) && !isNaN(data22)) && isFinite(data22))) {
                                                                    validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/wheelUp", schemaPath: "#/properties/tests/items/properties/stats/properties/wheelUp/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                    return false;
                                                                  }
                                                                  if (errors === _errs46) {
                                                                    if (typeof data22 == "number" && isFinite(data22)) {
                                                                      if (data22 > 15e4 || isNaN(data22)) {
                                                                        validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/wheelUp", schemaPath: "#/properties/tests/items/properties/stats/properties/wheelUp/maximum", keyword: "maximum", params: { comparison: "<=", limit: 15e4 }, message: "must be <= 150000" }];
                                                                        return false;
                                                                      } else {
                                                                        if (data22 < 0 || isNaN(data22)) {
                                                                          validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/wheelUp", schemaPath: "#/properties/tests/items/properties/stats/properties/wheelUp/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                          return false;
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                  var valid5 = _errs46 === errors;
                                                                } else {
                                                                  var valid5 = true;
                                                                }
                                                                if (valid5) {
                                                                  if (data19.wheelDown !== void 0) {
                                                                    let data23 = data19.wheelDown;
                                                                    const _errs48 = errors;
                                                                    if (!(typeof data23 == "number" && (!(data23 % 1) && !isNaN(data23)) && isFinite(data23))) {
                                                                      validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/wheelDown", schemaPath: "#/properties/tests/items/properties/stats/properties/wheelDown/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                      return false;
                                                                    }
                                                                    if (errors === _errs48) {
                                                                      if (typeof data23 == "number" && isFinite(data23)) {
                                                                        if (data23 > 15e4 || isNaN(data23)) {
                                                                          validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/wheelDown", schemaPath: "#/properties/tests/items/properties/stats/properties/wheelDown/maximum", keyword: "maximum", params: { comparison: "<=", limit: 15e4 }, message: "must be <= 150000" }];
                                                                          return false;
                                                                        } else {
                                                                          if (data23 < 0 || isNaN(data23)) {
                                                                            validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/wheelDown", schemaPath: "#/properties/tests/items/properties/stats/properties/wheelDown/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                            return false;
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                    var valid5 = _errs48 === errors;
                                                                  } else {
                                                                    var valid5 = true;
                                                                  }
                                                                  if (valid5) {
                                                                    if (data19.horizontal !== void 0) {
                                                                      let data24 = data19.horizontal;
                                                                      const _errs50 = errors;
                                                                      if (!(typeof data24 == "number" && (!(data24 % 1) && !isNaN(data24)) && isFinite(data24))) {
                                                                        validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/horizontal", schemaPath: "#/properties/tests/items/properties/stats/properties/horizontal/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                        return false;
                                                                      }
                                                                      if (errors === _errs50) {
                                                                        if (typeof data24 == "number" && isFinite(data24)) {
                                                                          if (data24 > 15e4 || isNaN(data24)) {
                                                                            validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/horizontal", schemaPath: "#/properties/tests/items/properties/stats/properties/horizontal/maximum", keyword: "maximum", params: { comparison: "<=", limit: 15e4 }, message: "must be <= 150000" }];
                                                                            return false;
                                                                          } else {
                                                                            if (data24 < 0 || isNaN(data24)) {
                                                                              validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/horizontal", schemaPath: "#/properties/tests/items/properties/stats/properties/horizontal/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                              return false;
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                      var valid5 = _errs50 === errors;
                                                                    } else {
                                                                      var valid5 = true;
                                                                    }
                                                                    if (valid5) {
                                                                      if (data19.x !== void 0) {
                                                                        let data25 = data19.x;
                                                                        const _errs52 = errors;
                                                                        if (!(typeof data25 == "number" && (!(data25 % 1) && !isNaN(data25)) && isFinite(data25))) {
                                                                          validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/x", schemaPath: "#/properties/tests/items/properties/stats/properties/x/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                          return false;
                                                                        }
                                                                        var valid5 = _errs52 === errors;
                                                                      } else {
                                                                        var valid5 = true;
                                                                      }
                                                                      if (valid5) {
                                                                        if (data19.y !== void 0) {
                                                                          let data26 = data19.y;
                                                                          const _errs54 = errors;
                                                                          if (!(typeof data26 == "number" && (!(data26 % 1) && !isNaN(data26)) && isFinite(data26))) {
                                                                            validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/y", schemaPath: "#/properties/tests/items/properties/stats/properties/y/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                            return false;
                                                                          }
                                                                          var valid5 = _errs54 === errors;
                                                                        } else {
                                                                          var valid5 = true;
                                                                        }
                                                                        if (valid5) {
                                                                          if (data19.absolute !== void 0) {
                                                                            const _errs56 = errors;
                                                                            if (typeof data19.absolute !== "boolean") {
                                                                              validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/absolute", schemaPath: "#/properties/tests/items/properties/stats/properties/absolute/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                                                              return false;
                                                                            }
                                                                            var valid5 = _errs56 === errors;
                                                                          } else {
                                                                            var valid5 = true;
                                                                          }
                                                                          if (valid5) {
                                                                            if (data19.keys !== void 0) {
                                                                              let data28 = data19.keys;
                                                                              const _errs58 = errors;
                                                                              if (errors === _errs58) {
                                                                                if (data28 && typeof data28 == "object" && !Array.isArray(data28)) {
                                                                                  if (Object.keys(data28).length > 255) {
                                                                                    validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/keys", schemaPath: "#/properties/tests/items/properties/stats/properties/keys/maxProperties", keyword: "maxProperties", params: { limit: 255 }, message: "must NOT have more than 255 properties" }];
                                                                                    return false;
                                                                                  } else {
                                                                                    for (const key5 in data28) {
                                                                                      const _errs60 = errors;
                                                                                      if (typeof key5 === "string") {
                                                                                        if (!pattern10.test(key5)) {
                                                                                          const err0 = { instancePath: instancePath + "/tests/" + i0 + "/stats/keys", schemaPath: "#/properties/tests/items/properties/stats/properties/keys/propertyNames/pattern", keyword: "pattern", params: { pattern: "^(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-4])$" }, message: 'must match pattern "^(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-4])$"', propertyName: key5 };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err0];
                                                                                          } else {
                                                                                            vErrors.push(err0);
                                                                                          }
                                                                                          errors++;
                                                                                        }
                                                                                      }
                                                                                      var valid6 = _errs60 === errors;
                                                                                      if (!valid6) {
                                                                                        const err1 = { instancePath: instancePath + "/tests/" + i0 + "/stats/keys", schemaPath: "#/properties/tests/items/properties/stats/properties/keys/propertyNames", keyword: "propertyNames", params: { propertyName: key5 }, message: "property name must be valid" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err1];
                                                                                        } else {
                                                                                          vErrors.push(err1);
                                                                                        }
                                                                                        errors++;
                                                                                        validate24.errors = vErrors;
                                                                                        return false;
                                                                                        break;
                                                                                      }
                                                                                    }
                                                                                    if (valid6) {
                                                                                      for (const key6 in data28) {
                                                                                        let data29 = data28[key6];
                                                                                        const _errs62 = errors;
                                                                                        if (errors === _errs62) {
                                                                                          if (data29 && typeof data29 == "object" && !Array.isArray(data29)) {
                                                                                            let missing5;
                                                                                            if (data29.down === void 0 && (missing5 = "down") || data29.up === void 0 && (missing5 = "up") || data29.repeat === void 0 && (missing5 = "repeat") || data29.held === void 0 && (missing5 = "held")) {
                                                                                              validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/keys/" + key6.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/tests/items/properties/stats/properties/keys/additionalProperties/required", keyword: "required", params: { missingProperty: missing5 }, message: "must have required property '" + missing5 + "'" }];
                                                                                              return false;
                                                                                            } else {
                                                                                              const _errs64 = errors;
                                                                                              for (const key7 in data29) {
                                                                                                if (!(key7 === "down" || key7 === "up" || key7 === "repeat" || key7 === "held")) {
                                                                                                  validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/keys/" + key6.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/tests/items/properties/stats/properties/keys/additionalProperties/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key7 }, message: "must NOT have additional properties" }];
                                                                                                  return false;
                                                                                                  break;
                                                                                                }
                                                                                              }
                                                                                              if (_errs64 === errors) {
                                                                                                if (data29.down !== void 0) {
                                                                                                  let data30 = data29.down;
                                                                                                  const _errs65 = errors;
                                                                                                  if (!(typeof data30 == "number" && (!(data30 % 1) && !isNaN(data30)) && isFinite(data30))) {
                                                                                                    validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/keys/" + key6.replace(/~/g, "~0").replace(/\//g, "~1") + "/down", schemaPath: "#/properties/tests/items/properties/stats/properties/keys/additionalProperties/properties/down/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                    return false;
                                                                                                  }
                                                                                                  if (errors === _errs65) {
                                                                                                    if (typeof data30 == "number" && isFinite(data30)) {
                                                                                                      if (data30 > 15e4 || isNaN(data30)) {
                                                                                                        validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/keys/" + key6.replace(/~/g, "~0").replace(/\//g, "~1") + "/down", schemaPath: "#/properties/tests/items/properties/stats/properties/keys/additionalProperties/properties/down/maximum", keyword: "maximum", params: { comparison: "<=", limit: 15e4 }, message: "must be <= 150000" }];
                                                                                                        return false;
                                                                                                      } else {
                                                                                                        if (data30 < 0 || isNaN(data30)) {
                                                                                                          validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/keys/" + key6.replace(/~/g, "~0").replace(/\//g, "~1") + "/down", schemaPath: "#/properties/tests/items/properties/stats/properties/keys/additionalProperties/properties/down/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                                          return false;
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                  var valid8 = _errs65 === errors;
                                                                                                } else {
                                                                                                  var valid8 = true;
                                                                                                }
                                                                                                if (valid8) {
                                                                                                  if (data29.up !== void 0) {
                                                                                                    let data31 = data29.up;
                                                                                                    const _errs67 = errors;
                                                                                                    if (!(typeof data31 == "number" && (!(data31 % 1) && !isNaN(data31)) && isFinite(data31))) {
                                                                                                      validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/keys/" + key6.replace(/~/g, "~0").replace(/\//g, "~1") + "/up", schemaPath: "#/properties/tests/items/properties/stats/properties/keys/additionalProperties/properties/up/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                      return false;
                                                                                                    }
                                                                                                    if (errors === _errs67) {
                                                                                                      if (typeof data31 == "number" && isFinite(data31)) {
                                                                                                        if (data31 > 15e4 || isNaN(data31)) {
                                                                                                          validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/keys/" + key6.replace(/~/g, "~0").replace(/\//g, "~1") + "/up", schemaPath: "#/properties/tests/items/properties/stats/properties/keys/additionalProperties/properties/up/maximum", keyword: "maximum", params: { comparison: "<=", limit: 15e4 }, message: "must be <= 150000" }];
                                                                                                          return false;
                                                                                                        } else {
                                                                                                          if (data31 < 0 || isNaN(data31)) {
                                                                                                            validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/keys/" + key6.replace(/~/g, "~0").replace(/\//g, "~1") + "/up", schemaPath: "#/properties/tests/items/properties/stats/properties/keys/additionalProperties/properties/up/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                                            return false;
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                    var valid8 = _errs67 === errors;
                                                                                                  } else {
                                                                                                    var valid8 = true;
                                                                                                  }
                                                                                                  if (valid8) {
                                                                                                    if (data29.repeat !== void 0) {
                                                                                                      let data32 = data29.repeat;
                                                                                                      const _errs69 = errors;
                                                                                                      if (!(typeof data32 == "number" && (!(data32 % 1) && !isNaN(data32)) && isFinite(data32))) {
                                                                                                        validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/keys/" + key6.replace(/~/g, "~0").replace(/\//g, "~1") + "/repeat", schemaPath: "#/properties/tests/items/properties/stats/properties/keys/additionalProperties/properties/repeat/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                        return false;
                                                                                                      }
                                                                                                      if (errors === _errs69) {
                                                                                                        if (typeof data32 == "number" && isFinite(data32)) {
                                                                                                          if (data32 > 15e4 || isNaN(data32)) {
                                                                                                            validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/keys/" + key6.replace(/~/g, "~0").replace(/\//g, "~1") + "/repeat", schemaPath: "#/properties/tests/items/properties/stats/properties/keys/additionalProperties/properties/repeat/maximum", keyword: "maximum", params: { comparison: "<=", limit: 15e4 }, message: "must be <= 150000" }];
                                                                                                            return false;
                                                                                                          } else {
                                                                                                            if (data32 < 0 || isNaN(data32)) {
                                                                                                              validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/keys/" + key6.replace(/~/g, "~0").replace(/\//g, "~1") + "/repeat", schemaPath: "#/properties/tests/items/properties/stats/properties/keys/additionalProperties/properties/repeat/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                                              return false;
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                      var valid8 = _errs69 === errors;
                                                                                                    } else {
                                                                                                      var valid8 = true;
                                                                                                    }
                                                                                                    if (valid8) {
                                                                                                      if (data29.held !== void 0) {
                                                                                                        const _errs71 = errors;
                                                                                                        if (typeof data29.held !== "boolean") {
                                                                                                          validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/keys/" + key6.replace(/~/g, "~0").replace(/\//g, "~1") + "/held", schemaPath: "#/properties/tests/items/properties/stats/properties/keys/additionalProperties/properties/held/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                                                                                          return false;
                                                                                                        }
                                                                                                        var valid8 = _errs71 === errors;
                                                                                                      } else {
                                                                                                        var valid8 = true;
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          } else {
                                                                                            validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/keys/" + key6.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/tests/items/properties/stats/properties/keys/additionalProperties/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                                                            return false;
                                                                                          }
                                                                                        }
                                                                                        var valid7 = _errs62 === errors;
                                                                                        if (!valid7) {
                                                                                          break;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                } else {
                                                                                  validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/keys", schemaPath: "#/properties/tests/items/properties/stats/properties/keys/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                                                  return false;
                                                                                }
                                                                              }
                                                                              var valid5 = _errs58 === errors;
                                                                            } else {
                                                                              var valid5 = true;
                                                                            }
                                                                            if (valid5) {
                                                                              if (data19.buttons !== void 0) {
                                                                                let data34 = data19.buttons;
                                                                                const _errs73 = errors;
                                                                                if (errors === _errs73) {
                                                                                  if (data34 && typeof data34 == "object" && !Array.isArray(data34)) {
                                                                                    if (Object.keys(data34).length > 5) {
                                                                                      validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/buttons", schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/maxProperties", keyword: "maxProperties", params: { limit: 5 }, message: "must NOT have more than 5 properties" }];
                                                                                      return false;
                                                                                    } else {
                                                                                      for (const key8 in data34) {
                                                                                        const _errs75 = errors;
                                                                                        if (typeof key8 === "string") {
                                                                                          if (!pattern11.test(key8)) {
                                                                                            const err2 = { instancePath: instancePath + "/tests/" + i0 + "/stats/buttons", schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/propertyNames/pattern", keyword: "pattern", params: { pattern: "^[1-5]$" }, message: 'must match pattern "^[1-5]$"', propertyName: key8 };
                                                                                            if (vErrors === null) {
                                                                                              vErrors = [err2];
                                                                                            } else {
                                                                                              vErrors.push(err2);
                                                                                            }
                                                                                            errors++;
                                                                                          }
                                                                                        }
                                                                                        var valid9 = _errs75 === errors;
                                                                                        if (!valid9) {
                                                                                          const err3 = { instancePath: instancePath + "/tests/" + i0 + "/stats/buttons", schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/propertyNames", keyword: "propertyNames", params: { propertyName: key8 }, message: "property name must be valid" };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err3];
                                                                                          } else {
                                                                                            vErrors.push(err3);
                                                                                          }
                                                                                          errors++;
                                                                                          validate24.errors = vErrors;
                                                                                          return false;
                                                                                          break;
                                                                                        }
                                                                                      }
                                                                                      if (valid9) {
                                                                                        for (const key9 in data34) {
                                                                                          let data35 = data34[key9];
                                                                                          const _errs77 = errors;
                                                                                          if (errors === _errs77) {
                                                                                            if (data35 && typeof data35 == "object" && !Array.isArray(data35)) {
                                                                                              let missing6;
                                                                                              if (data35.down === void 0 && (missing6 = "down") || data35.up === void 0 && (missing6 = "up") || data35.repeat === void 0 && (missing6 = "repeat") || data35.held === void 0 && (missing6 = "held")) {
                                                                                                validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/buttons/" + key9.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/additionalProperties/required", keyword: "required", params: { missingProperty: missing6 }, message: "must have required property '" + missing6 + "'" }];
                                                                                                return false;
                                                                                              } else {
                                                                                                const _errs79 = errors;
                                                                                                for (const key10 in data35) {
                                                                                                  if (!(key10 === "down" || key10 === "up" || key10 === "repeat" || key10 === "held")) {
                                                                                                    validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/buttons/" + key9.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/additionalProperties/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key10 }, message: "must NOT have additional properties" }];
                                                                                                    return false;
                                                                                                    break;
                                                                                                  }
                                                                                                }
                                                                                                if (_errs79 === errors) {
                                                                                                  if (data35.down !== void 0) {
                                                                                                    let data36 = data35.down;
                                                                                                    const _errs80 = errors;
                                                                                                    if (!(typeof data36 == "number" && (!(data36 % 1) && !isNaN(data36)) && isFinite(data36))) {
                                                                                                      validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/buttons/" + key9.replace(/~/g, "~0").replace(/\//g, "~1") + "/down", schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/additionalProperties/properties/down/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                      return false;
                                                                                                    }
                                                                                                    if (errors === _errs80) {
                                                                                                      if (typeof data36 == "number" && isFinite(data36)) {
                                                                                                        if (data36 > 15e4 || isNaN(data36)) {
                                                                                                          validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/buttons/" + key9.replace(/~/g, "~0").replace(/\//g, "~1") + "/down", schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/additionalProperties/properties/down/maximum", keyword: "maximum", params: { comparison: "<=", limit: 15e4 }, message: "must be <= 150000" }];
                                                                                                          return false;
                                                                                                        } else {
                                                                                                          if (data36 < 0 || isNaN(data36)) {
                                                                                                            validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/buttons/" + key9.replace(/~/g, "~0").replace(/\//g, "~1") + "/down", schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/additionalProperties/properties/down/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                                            return false;
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                    var valid11 = _errs80 === errors;
                                                                                                  } else {
                                                                                                    var valid11 = true;
                                                                                                  }
                                                                                                  if (valid11) {
                                                                                                    if (data35.up !== void 0) {
                                                                                                      let data37 = data35.up;
                                                                                                      const _errs82 = errors;
                                                                                                      if (!(typeof data37 == "number" && (!(data37 % 1) && !isNaN(data37)) && isFinite(data37))) {
                                                                                                        validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/buttons/" + key9.replace(/~/g, "~0").replace(/\//g, "~1") + "/up", schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/additionalProperties/properties/up/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                        return false;
                                                                                                      }
                                                                                                      if (errors === _errs82) {
                                                                                                        if (typeof data37 == "number" && isFinite(data37)) {
                                                                                                          if (data37 > 15e4 || isNaN(data37)) {
                                                                                                            validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/buttons/" + key9.replace(/~/g, "~0").replace(/\//g, "~1") + "/up", schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/additionalProperties/properties/up/maximum", keyword: "maximum", params: { comparison: "<=", limit: 15e4 }, message: "must be <= 150000" }];
                                                                                                            return false;
                                                                                                          } else {
                                                                                                            if (data37 < 0 || isNaN(data37)) {
                                                                                                              validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/buttons/" + key9.replace(/~/g, "~0").replace(/\//g, "~1") + "/up", schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/additionalProperties/properties/up/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                                              return false;
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                      var valid11 = _errs82 === errors;
                                                                                                    } else {
                                                                                                      var valid11 = true;
                                                                                                    }
                                                                                                    if (valid11) {
                                                                                                      if (data35.repeat !== void 0) {
                                                                                                        let data38 = data35.repeat;
                                                                                                        const _errs84 = errors;
                                                                                                        if (!(typeof data38 == "number" && (!(data38 % 1) && !isNaN(data38)) && isFinite(data38))) {
                                                                                                          validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/buttons/" + key9.replace(/~/g, "~0").replace(/\//g, "~1") + "/repeat", schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/additionalProperties/properties/repeat/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                          return false;
                                                                                                        }
                                                                                                        if (errors === _errs84) {
                                                                                                          if (typeof data38 == "number" && isFinite(data38)) {
                                                                                                            if (data38 > 15e4 || isNaN(data38)) {
                                                                                                              validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/buttons/" + key9.replace(/~/g, "~0").replace(/\//g, "~1") + "/repeat", schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/additionalProperties/properties/repeat/maximum", keyword: "maximum", params: { comparison: "<=", limit: 15e4 }, message: "must be <= 150000" }];
                                                                                                              return false;
                                                                                                            } else {
                                                                                                              if (data38 < 0 || isNaN(data38)) {
                                                                                                                validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/buttons/" + key9.replace(/~/g, "~0").replace(/\//g, "~1") + "/repeat", schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/additionalProperties/properties/repeat/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                                                return false;
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                        var valid11 = _errs84 === errors;
                                                                                                      } else {
                                                                                                        var valid11 = true;
                                                                                                      }
                                                                                                      if (valid11) {
                                                                                                        if (data35.held !== void 0) {
                                                                                                          const _errs86 = errors;
                                                                                                          if (typeof data35.held !== "boolean") {
                                                                                                            validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/buttons/" + key9.replace(/~/g, "~0").replace(/\//g, "~1") + "/held", schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/additionalProperties/properties/held/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                                                                                            return false;
                                                                                                          }
                                                                                                          var valid11 = _errs86 === errors;
                                                                                                        } else {
                                                                                                          var valid11 = true;
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            } else {
                                                                                              validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/buttons/" + key9.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/additionalProperties/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                                                              return false;
                                                                                            }
                                                                                          }
                                                                                          var valid10 = _errs77 === errors;
                                                                                          if (!valid10) {
                                                                                            break;
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  } else {
                                                                                    validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats/buttons", schemaPath: "#/properties/tests/items/properties/stats/properties/buttons/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                                                    return false;
                                                                                  }
                                                                                }
                                                                                var valid5 = _errs73 === errors;
                                                                              } else {
                                                                                var valid5 = true;
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      } else {
                                                        validate24.errors = [{ instancePath: instancePath + "/tests/" + i0 + "/stats", schemaPath: "#/properties/tests/items/properties/stats/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                        return false;
                                                      }
                                                    }
                                                    var valid4 = _errs39 === errors;
                                                  } else {
                                                    var valid4 = true;
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  validate24.errors = [{ instancePath: instancePath + "/tests/" + i0, schemaPath: "#/properties/tests/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                  return false;
                                }
                              }
                              var valid3 = _errs26 === errors;
                              if (!valid3) {
                                break;
                              }
                            }
                          }
                        } else {
                          validate24.errors = [{ instancePath: instancePath + "/tests", schemaPath: "#/properties/tests/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                          return false;
                        }
                      }
                      var valid0 = _errs24 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.limitations !== void 0) {
                        let data40 = data.limitations;
                        const _errs88 = errors;
                        if (errors === _errs88) {
                          if (Array.isArray(data40)) {
                            if (data40.length > 10) {
                              validate24.errors = [{ instancePath: instancePath + "/limitations", schemaPath: "#/properties/limitations/maxItems", keyword: "maxItems", params: { limit: 10 }, message: "must NOT have more than 10 items" }];
                              return false;
                            } else {
                              var valid12 = true;
                              const len1 = data40.length;
                              for (let i1 = 0; i1 < len1; i1++) {
                                const _errs90 = errors;
                                if (typeof data40[i1] !== "string") {
                                  validate24.errors = [{ instancePath: instancePath + "/limitations/" + i1, schemaPath: "#/properties/limitations/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                  return false;
                                }
                                var valid12 = _errs90 === errors;
                                if (!valid12) {
                                  break;
                                }
                              }
                            }
                          } else {
                            validate24.errors = [{ instancePath: instancePath + "/limitations", schemaPath: "#/properties/limitations/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                            return false;
                          }
                        }
                        var valid0 = _errs88 === errors;
                      } else {
                        var valid0 = true;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate24.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate24.errors = vErrors;
  return errors === 0;
}
validate24.evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false };
export {
  analysis,
  diagnostic,
  investigation,
  workbench
};
