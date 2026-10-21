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
var schema31 = { "$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "https://anydevice.local/report-v2.schema.json", "title": "AnyDevice evidence report 2.0", "type": "object", "required": ["schemaVersion", "appVersion", "collectedAt", "os", "complete", "sanitized", "devices", "findings", "errors", "limitations", "provenance"], "properties": { "schemaVersion": { "const": "2.0" }, "appVersion": { "const": "0.2.0" }, "collectedAt": { "type": "string" }, "os": { "type": ["string", "null"] }, "complete": { "type": "boolean" }, "sanitized": { "type": "boolean" }, "devices": { "type": "array", "items": { "$ref": "#/$defs/device" } }, "previous": { "type": "object", "required": ["collectedAt", "devices", "provenance", "complete"], "properties": { "collectedAt": { "type": "string" }, "devices": { "type": "array", "items": { "$ref": "#/$defs/device" } }, "provenance": { "$ref": "#/$defs/provenance" }, "complete": { "type": "boolean" } }, "additionalProperties": false }, "findings": { "type": "array", "items": { "$ref": "#/$defs/finding" } }, "errors": { "type": "array", "items": { "type": "object", "required": ["kind", "message"], "properties": { "kind": { "enum": ["permission", "property", "enumeration", "malformed"] }, "message": { "type": "string" }, "deviceId": { "type": "string" } }, "additionalProperties": false } }, "limitations": { "type": "array", "items": { "type": "string" } }, "provenance": { "$ref": "#/$defs/provenance" } }, "additionalProperties": false, "$defs": { "device": { "type": "object", "required": ["id", "name", "category", "manufacturer", "hardwareIds", "parent", "location", "status", "problemCode", "vid", "pid", "transport", "observedAt", "source", "nodeKind", "physicalDeviceId", "interfacePaths", "present"], "properties": { "id": { "type": "string" }, "name": { "type": ["string", "null"] }, "category": { "type": ["string", "null"] }, "manufacturer": { "type": ["string", "null"] }, "hardwareIds": { "type": "array", "items": { "type": "string" } }, "parent": { "type": ["string", "null"] }, "location": { "type": ["string", "null"] }, "status": { "type": ["string", "null"] }, "problemCode": { "type": ["integer", "null"], "minimum": 0 }, "vid": { "type": ["string", "null"], "pattern": "^[0-9A-F]{4}$" }, "pid": { "type": ["string", "null"], "pattern": "^[0-9A-F]{4}$" }, "transport": { "enum": ["USB", "HID (transport unknown)", "Unknown"] }, "observedAt": { "type": "string" }, "source": { "type": "string" }, "nodeKind": { "const": "logical-pnp-node" }, "physicalDeviceId": { "type": "null" }, "interfacePaths": { "type": "array", "maxItems": 0 }, "present": { "type": ["boolean", "null"] }, "containerId": { "type": ["string", "null"], "maxLength": 128 }, "compatibleIds": { "type": "array", "maxItems": 256, "items": { "type": "string" } }, "locationPaths": { "type": "array", "maxItems": 256, "items": { "type": "string" } }, "deviceCapabilities": { "type": ["integer", "null"], "minimum": 0, "maximum": 4294967295 }, "removalPolicy": { "enum": [null, 1, 2, 3] }, "enumeratorName": { "type": ["string", "null"], "maxLength": 8192 }, "driverProvider": { "type": ["string", "null"], "maxLength": 2048 }, "driverVersion": { "type": ["string", "null"], "maxLength": 2048 }, "driverDate": { "type": ["string", "null"], "maxLength": 100 } }, "additionalProperties": false }, "finding": { "type": "object", "required": ["id", "title", "severity", "classification", "confidence", "facts", "explanation", "evidence", "recommendation", "limitations"], "properties": { "id": { "type": "string" }, "deviceId": { "type": "string" }, "title": { "type": "string" }, "severity": { "enum": ["info", "warning", "error"] }, "classification": { "enum": ["Windows-reported error", "Confirmed observation"] }, "confidence": { "enum": ["high", "limited"] }, "facts": { "type": "array", "items": { "type": "string" } }, "explanation": { "type": "string" }, "evidence": { "type": "array", "items": { "type": "string" } }, "recommendation": { "type": "string" }, "limitations": { "type": "string" } }, "additionalProperties": false }, "provenance": { "type": "object", "required": ["provider", "providerVersion", "scope"], "properties": { "provider": { "enum": ["windows-cfgmgr32", "windows-pnp-fallback"] }, "providerVersion": { "const": "1.0" }, "scope": { "enum": ["usb-hid", "all-pnp"] } }, "additionalProperties": false } } };
var schema32 = { "type": "object", "required": ["id", "name", "category", "manufacturer", "hardwareIds", "parent", "location", "status", "problemCode", "vid", "pid", "transport", "observedAt", "source", "nodeKind", "physicalDeviceId", "interfacePaths", "present"], "properties": { "id": { "type": "string" }, "name": { "type": ["string", "null"] }, "category": { "type": ["string", "null"] }, "manufacturer": { "type": ["string", "null"] }, "hardwareIds": { "type": "array", "items": { "type": "string" } }, "parent": { "type": ["string", "null"] }, "location": { "type": ["string", "null"] }, "status": { "type": ["string", "null"] }, "problemCode": { "type": ["integer", "null"], "minimum": 0 }, "vid": { "type": ["string", "null"], "pattern": "^[0-9A-F]{4}$" }, "pid": { "type": ["string", "null"], "pattern": "^[0-9A-F]{4}$" }, "transport": { "enum": ["USB", "HID (transport unknown)", "Unknown"] }, "observedAt": { "type": "string" }, "source": { "type": "string" }, "nodeKind": { "const": "logical-pnp-node" }, "physicalDeviceId": { "type": "null" }, "interfacePaths": { "type": "array", "maxItems": 0 }, "present": { "type": ["boolean", "null"] }, "containerId": { "type": ["string", "null"], "maxLength": 128 }, "compatibleIds": { "type": "array", "maxItems": 256, "items": { "type": "string" } }, "locationPaths": { "type": "array", "maxItems": 256, "items": { "type": "string" } }, "deviceCapabilities": { "type": ["integer", "null"], "minimum": 0, "maximum": 4294967295 }, "removalPolicy": { "enum": [null, 1, 2, 3] }, "enumeratorName": { "type": ["string", "null"], "maxLength": 8192 }, "driverProvider": { "type": ["string", "null"], "maxLength": 2048 }, "driverVersion": { "type": ["string", "null"], "maxLength": 2048 }, "driverDate": { "type": ["string", "null"], "maxLength": 100 } }, "additionalProperties": false };
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
                                                                                    if (valid3) {
                                                                                      if (data7.driverProvider !== void 0) {
                                                                                        let data35 = data7.driverProvider;
                                                                                        const _errs69 = errors;
                                                                                        if (typeof data35 !== "string" && data35 !== null) {
                                                                                          validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/driverProvider", schemaPath: "#/$defs/device/properties/driverProvider/type", keyword: "type", params: { type: schema32.properties.driverProvider.type }, message: "must be string,null" }];
                                                                                          return false;
                                                                                        }
                                                                                        if (errors === _errs69) {
                                                                                          if (typeof data35 === "string") {
                                                                                            if (func3(data35) > 2048) {
                                                                                              validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/driverProvider", schemaPath: "#/$defs/device/properties/driverProvider/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                              return false;
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                        var valid3 = _errs69 === errors;
                                                                                      } else {
                                                                                        var valid3 = true;
                                                                                      }
                                                                                      if (valid3) {
                                                                                        if (data7.driverVersion !== void 0) {
                                                                                          let data36 = data7.driverVersion;
                                                                                          const _errs71 = errors;
                                                                                          if (typeof data36 !== "string" && data36 !== null) {
                                                                                            validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/driverVersion", schemaPath: "#/$defs/device/properties/driverVersion/type", keyword: "type", params: { type: schema32.properties.driverVersion.type }, message: "must be string,null" }];
                                                                                            return false;
                                                                                          }
                                                                                          if (errors === _errs71) {
                                                                                            if (typeof data36 === "string") {
                                                                                              if (func3(data36) > 2048) {
                                                                                                validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/driverVersion", schemaPath: "#/$defs/device/properties/driverVersion/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                                return false;
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                          var valid3 = _errs71 === errors;
                                                                                        } else {
                                                                                          var valid3 = true;
                                                                                        }
                                                                                        if (valid3) {
                                                                                          if (data7.driverDate !== void 0) {
                                                                                            let data37 = data7.driverDate;
                                                                                            const _errs73 = errors;
                                                                                            if (typeof data37 !== "string" && data37 !== null) {
                                                                                              validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/driverDate", schemaPath: "#/$defs/device/properties/driverDate/type", keyword: "type", params: { type: schema32.properties.driverDate.type }, message: "must be string,null" }];
                                                                                              return false;
                                                                                            }
                                                                                            if (errors === _errs73) {
                                                                                              if (typeof data37 === "string") {
                                                                                                if (func3(data37) > 100) {
                                                                                                  validate20.errors = [{ instancePath: instancePath + "/devices/" + i0 + "/driverDate", schemaPath: "#/$defs/device/properties/driverDate/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                                                                                  return false;
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                            var valid3 = _errs73 === errors;
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
                          let data38 = data.previous;
                          const _errs75 = errors;
                          if (errors === _errs75) {
                            if (data38 && typeof data38 == "object" && !Array.isArray(data38)) {
                              let missing2;
                              if (data38.collectedAt === void 0 && (missing2 = "collectedAt") || data38.devices === void 0 && (missing2 = "devices") || data38.provenance === void 0 && (missing2 = "provenance") || data38.complete === void 0 && (missing2 = "complete")) {
                                validate20.errors = [{ instancePath: instancePath + "/previous", schemaPath: "#/properties/previous/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
                                return false;
                              } else {
                                const _errs77 = errors;
                                for (const key2 in data38) {
                                  if (!(key2 === "collectedAt" || key2 === "devices" || key2 === "provenance" || key2 === "complete")) {
                                    validate20.errors = [{ instancePath: instancePath + "/previous", schemaPath: "#/properties/previous/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                                    return false;
                                    break;
                                  }
                                }
                                if (_errs77 === errors) {
                                  if (data38.collectedAt !== void 0) {
                                    const _errs78 = errors;
                                    if (typeof data38.collectedAt !== "string") {
                                      validate20.errors = [{ instancePath: instancePath + "/previous/collectedAt", schemaPath: "#/properties/previous/properties/collectedAt/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                      return false;
                                    }
                                    var valid7 = _errs78 === errors;
                                  } else {
                                    var valid7 = true;
                                  }
                                  if (valid7) {
                                    if (data38.devices !== void 0) {
                                      let data40 = data38.devices;
                                      const _errs80 = errors;
                                      if (errors === _errs80) {
                                        if (Array.isArray(data40)) {
                                          var valid8 = true;
                                          const len4 = data40.length;
                                          for (let i4 = 0; i4 < len4; i4++) {
                                            let data41 = data40[i4];
                                            const _errs82 = errors;
                                            const _errs83 = errors;
                                            if (errors === _errs83) {
                                              if (data41 && typeof data41 == "object" && !Array.isArray(data41)) {
                                                let missing3;
                                                if (data41.id === void 0 && (missing3 = "id") || data41.name === void 0 && (missing3 = "name") || data41.category === void 0 && (missing3 = "category") || data41.manufacturer === void 0 && (missing3 = "manufacturer") || data41.hardwareIds === void 0 && (missing3 = "hardwareIds") || data41.parent === void 0 && (missing3 = "parent") || data41.location === void 0 && (missing3 = "location") || data41.status === void 0 && (missing3 = "status") || data41.problemCode === void 0 && (missing3 = "problemCode") || data41.vid === void 0 && (missing3 = "vid") || data41.pid === void 0 && (missing3 = "pid") || data41.transport === void 0 && (missing3 = "transport") || data41.observedAt === void 0 && (missing3 = "observedAt") || data41.source === void 0 && (missing3 = "source") || data41.nodeKind === void 0 && (missing3 = "nodeKind") || data41.physicalDeviceId === void 0 && (missing3 = "physicalDeviceId") || data41.interfacePaths === void 0 && (missing3 = "interfacePaths") || data41.present === void 0 && (missing3 = "present")) {
                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4, schemaPath: "#/$defs/device/required", keyword: "required", params: { missingProperty: missing3 }, message: "must have required property '" + missing3 + "'" }];
                                                  return false;
                                                } else {
                                                  const _errs85 = errors;
                                                  for (const key3 in data41) {
                                                    if (!func1.call(schema32.properties, key3)) {
                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4, schemaPath: "#/$defs/device/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties" }];
                                                      return false;
                                                      break;
                                                    }
                                                  }
                                                  if (_errs85 === errors) {
                                                    if (data41.id !== void 0) {
                                                      const _errs86 = errors;
                                                      if (typeof data41.id !== "string") {
                                                        validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/id", schemaPath: "#/$defs/device/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                        return false;
                                                      }
                                                      var valid10 = _errs86 === errors;
                                                    } else {
                                                      var valid10 = true;
                                                    }
                                                    if (valid10) {
                                                      if (data41.name !== void 0) {
                                                        let data43 = data41.name;
                                                        const _errs88 = errors;
                                                        if (typeof data43 !== "string" && data43 !== null) {
                                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/name", schemaPath: "#/$defs/device/properties/name/type", keyword: "type", params: { type: schema32.properties.name.type }, message: "must be string,null" }];
                                                          return false;
                                                        }
                                                        var valid10 = _errs88 === errors;
                                                      } else {
                                                        var valid10 = true;
                                                      }
                                                      if (valid10) {
                                                        if (data41.category !== void 0) {
                                                          let data44 = data41.category;
                                                          const _errs90 = errors;
                                                          if (typeof data44 !== "string" && data44 !== null) {
                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/category", schemaPath: "#/$defs/device/properties/category/type", keyword: "type", params: { type: schema32.properties.category.type }, message: "must be string,null" }];
                                                            return false;
                                                          }
                                                          var valid10 = _errs90 === errors;
                                                        } else {
                                                          var valid10 = true;
                                                        }
                                                        if (valid10) {
                                                          if (data41.manufacturer !== void 0) {
                                                            let data45 = data41.manufacturer;
                                                            const _errs92 = errors;
                                                            if (typeof data45 !== "string" && data45 !== null) {
                                                              validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/manufacturer", schemaPath: "#/$defs/device/properties/manufacturer/type", keyword: "type", params: { type: schema32.properties.manufacturer.type }, message: "must be string,null" }];
                                                              return false;
                                                            }
                                                            var valid10 = _errs92 === errors;
                                                          } else {
                                                            var valid10 = true;
                                                          }
                                                          if (valid10) {
                                                            if (data41.hardwareIds !== void 0) {
                                                              let data46 = data41.hardwareIds;
                                                              const _errs94 = errors;
                                                              if (errors === _errs94) {
                                                                if (Array.isArray(data46)) {
                                                                  var valid11 = true;
                                                                  const len5 = data46.length;
                                                                  for (let i5 = 0; i5 < len5; i5++) {
                                                                    const _errs96 = errors;
                                                                    if (typeof data46[i5] !== "string") {
                                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/hardwareIds/" + i5, schemaPath: "#/$defs/device/properties/hardwareIds/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                      return false;
                                                                    }
                                                                    var valid11 = _errs96 === errors;
                                                                    if (!valid11) {
                                                                      break;
                                                                    }
                                                                  }
                                                                } else {
                                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/hardwareIds", schemaPath: "#/$defs/device/properties/hardwareIds/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                  return false;
                                                                }
                                                              }
                                                              var valid10 = _errs94 === errors;
                                                            } else {
                                                              var valid10 = true;
                                                            }
                                                            if (valid10) {
                                                              if (data41.parent !== void 0) {
                                                                let data48 = data41.parent;
                                                                const _errs98 = errors;
                                                                if (typeof data48 !== "string" && data48 !== null) {
                                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/parent", schemaPath: "#/$defs/device/properties/parent/type", keyword: "type", params: { type: schema32.properties.parent.type }, message: "must be string,null" }];
                                                                  return false;
                                                                }
                                                                var valid10 = _errs98 === errors;
                                                              } else {
                                                                var valid10 = true;
                                                              }
                                                              if (valid10) {
                                                                if (data41.location !== void 0) {
                                                                  let data49 = data41.location;
                                                                  const _errs100 = errors;
                                                                  if (typeof data49 !== "string" && data49 !== null) {
                                                                    validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/location", schemaPath: "#/$defs/device/properties/location/type", keyword: "type", params: { type: schema32.properties.location.type }, message: "must be string,null" }];
                                                                    return false;
                                                                  }
                                                                  var valid10 = _errs100 === errors;
                                                                } else {
                                                                  var valid10 = true;
                                                                }
                                                                if (valid10) {
                                                                  if (data41.status !== void 0) {
                                                                    let data50 = data41.status;
                                                                    const _errs102 = errors;
                                                                    if (typeof data50 !== "string" && data50 !== null) {
                                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/status", schemaPath: "#/$defs/device/properties/status/type", keyword: "type", params: { type: schema32.properties.status.type }, message: "must be string,null" }];
                                                                      return false;
                                                                    }
                                                                    var valid10 = _errs102 === errors;
                                                                  } else {
                                                                    var valid10 = true;
                                                                  }
                                                                  if (valid10) {
                                                                    if (data41.problemCode !== void 0) {
                                                                      let data51 = data41.problemCode;
                                                                      const _errs104 = errors;
                                                                      if (!(typeof data51 == "number" && (!(data51 % 1) && !isNaN(data51)) && isFinite(data51)) && data51 !== null) {
                                                                        validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/problemCode", schemaPath: "#/$defs/device/properties/problemCode/type", keyword: "type", params: { type: schema32.properties.problemCode.type }, message: "must be integer,null" }];
                                                                        return false;
                                                                      }
                                                                      if (errors === _errs104) {
                                                                        if (typeof data51 == "number" && isFinite(data51)) {
                                                                          if (data51 < 0 || isNaN(data51)) {
                                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/problemCode", schemaPath: "#/$defs/device/properties/problemCode/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                            return false;
                                                                          }
                                                                        }
                                                                      }
                                                                      var valid10 = _errs104 === errors;
                                                                    } else {
                                                                      var valid10 = true;
                                                                    }
                                                                    if (valid10) {
                                                                      if (data41.vid !== void 0) {
                                                                        let data52 = data41.vid;
                                                                        const _errs106 = errors;
                                                                        if (typeof data52 !== "string" && data52 !== null) {
                                                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/vid", schemaPath: "#/$defs/device/properties/vid/type", keyword: "type", params: { type: schema32.properties.vid.type }, message: "must be string,null" }];
                                                                          return false;
                                                                        }
                                                                        if (errors === _errs106) {
                                                                          if (typeof data52 === "string") {
                                                                            if (!pattern4.test(data52)) {
                                                                              validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/vid", schemaPath: "#/$defs/device/properties/vid/pattern", keyword: "pattern", params: { pattern: "^[0-9A-F]{4}$" }, message: 'must match pattern "^[0-9A-F]{4}$"' }];
                                                                              return false;
                                                                            }
                                                                          }
                                                                        }
                                                                        var valid10 = _errs106 === errors;
                                                                      } else {
                                                                        var valid10 = true;
                                                                      }
                                                                      if (valid10) {
                                                                        if (data41.pid !== void 0) {
                                                                          let data53 = data41.pid;
                                                                          const _errs108 = errors;
                                                                          if (typeof data53 !== "string" && data53 !== null) {
                                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/pid", schemaPath: "#/$defs/device/properties/pid/type", keyword: "type", params: { type: schema32.properties.pid.type }, message: "must be string,null" }];
                                                                            return false;
                                                                          }
                                                                          if (errors === _errs108) {
                                                                            if (typeof data53 === "string") {
                                                                              if (!pattern4.test(data53)) {
                                                                                validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/pid", schemaPath: "#/$defs/device/properties/pid/pattern", keyword: "pattern", params: { pattern: "^[0-9A-F]{4}$" }, message: 'must match pattern "^[0-9A-F]{4}$"' }];
                                                                                return false;
                                                                              }
                                                                            }
                                                                          }
                                                                          var valid10 = _errs108 === errors;
                                                                        } else {
                                                                          var valid10 = true;
                                                                        }
                                                                        if (valid10) {
                                                                          if (data41.transport !== void 0) {
                                                                            let data54 = data41.transport;
                                                                            const _errs110 = errors;
                                                                            if (!(data54 === "USB" || data54 === "HID (transport unknown)" || data54 === "Unknown")) {
                                                                              validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/transport", schemaPath: "#/$defs/device/properties/transport/enum", keyword: "enum", params: { allowedValues: schema32.properties.transport.enum }, message: "must be equal to one of the allowed values" }];
                                                                              return false;
                                                                            }
                                                                            var valid10 = _errs110 === errors;
                                                                          } else {
                                                                            var valid10 = true;
                                                                          }
                                                                          if (valid10) {
                                                                            if (data41.observedAt !== void 0) {
                                                                              const _errs111 = errors;
                                                                              if (typeof data41.observedAt !== "string") {
                                                                                validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/observedAt", schemaPath: "#/$defs/device/properties/observedAt/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                return false;
                                                                              }
                                                                              var valid10 = _errs111 === errors;
                                                                            } else {
                                                                              var valid10 = true;
                                                                            }
                                                                            if (valid10) {
                                                                              if (data41.source !== void 0) {
                                                                                const _errs113 = errors;
                                                                                if (typeof data41.source !== "string") {
                                                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/source", schemaPath: "#/$defs/device/properties/source/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                  return false;
                                                                                }
                                                                                var valid10 = _errs113 === errors;
                                                                              } else {
                                                                                var valid10 = true;
                                                                              }
                                                                              if (valid10) {
                                                                                if (data41.nodeKind !== void 0) {
                                                                                  const _errs115 = errors;
                                                                                  if ("logical-pnp-node" !== data41.nodeKind) {
                                                                                    validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/nodeKind", schemaPath: "#/$defs/device/properties/nodeKind/const", keyword: "const", params: { allowedValue: "logical-pnp-node" }, message: "must be equal to constant" }];
                                                                                    return false;
                                                                                  }
                                                                                  var valid10 = _errs115 === errors;
                                                                                } else {
                                                                                  var valid10 = true;
                                                                                }
                                                                                if (valid10) {
                                                                                  if (data41.physicalDeviceId !== void 0) {
                                                                                    const _errs116 = errors;
                                                                                    if (data41.physicalDeviceId !== null) {
                                                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/physicalDeviceId", schemaPath: "#/$defs/device/properties/physicalDeviceId/type", keyword: "type", params: { type: "null" }, message: "must be null" }];
                                                                                      return false;
                                                                                    }
                                                                                    var valid10 = _errs116 === errors;
                                                                                  } else {
                                                                                    var valid10 = true;
                                                                                  }
                                                                                  if (valid10) {
                                                                                    if (data41.interfacePaths !== void 0) {
                                                                                      let data59 = data41.interfacePaths;
                                                                                      const _errs118 = errors;
                                                                                      if (errors === _errs118) {
                                                                                        if (Array.isArray(data59)) {
                                                                                          if (data59.length > 0) {
                                                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/interfacePaths", schemaPath: "#/$defs/device/properties/interfacePaths/maxItems", keyword: "maxItems", params: { limit: 0 }, message: "must NOT have more than 0 items" }];
                                                                                            return false;
                                                                                          }
                                                                                        } else {
                                                                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/interfacePaths", schemaPath: "#/$defs/device/properties/interfacePaths/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                          return false;
                                                                                        }
                                                                                      }
                                                                                      var valid10 = _errs118 === errors;
                                                                                    } else {
                                                                                      var valid10 = true;
                                                                                    }
                                                                                    if (valid10) {
                                                                                      if (data41.present !== void 0) {
                                                                                        let data60 = data41.present;
                                                                                        const _errs120 = errors;
                                                                                        if (typeof data60 !== "boolean" && data60 !== null) {
                                                                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/present", schemaPath: "#/$defs/device/properties/present/type", keyword: "type", params: { type: schema32.properties.present.type }, message: "must be boolean,null" }];
                                                                                          return false;
                                                                                        }
                                                                                        var valid10 = _errs120 === errors;
                                                                                      } else {
                                                                                        var valid10 = true;
                                                                                      }
                                                                                      if (valid10) {
                                                                                        if (data41.containerId !== void 0) {
                                                                                          let data61 = data41.containerId;
                                                                                          const _errs122 = errors;
                                                                                          if (typeof data61 !== "string" && data61 !== null) {
                                                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/containerId", schemaPath: "#/$defs/device/properties/containerId/type", keyword: "type", params: { type: schema32.properties.containerId.type }, message: "must be string,null" }];
                                                                                            return false;
                                                                                          }
                                                                                          if (errors === _errs122) {
                                                                                            if (typeof data61 === "string") {
                                                                                              if (func3(data61) > 128) {
                                                                                                validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/containerId", schemaPath: "#/$defs/device/properties/containerId/maxLength", keyword: "maxLength", params: { limit: 128 }, message: "must NOT have more than 128 characters" }];
                                                                                                return false;
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                          var valid10 = _errs122 === errors;
                                                                                        } else {
                                                                                          var valid10 = true;
                                                                                        }
                                                                                        if (valid10) {
                                                                                          if (data41.compatibleIds !== void 0) {
                                                                                            let data62 = data41.compatibleIds;
                                                                                            const _errs124 = errors;
                                                                                            if (errors === _errs124) {
                                                                                              if (Array.isArray(data62)) {
                                                                                                if (data62.length > 256) {
                                                                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/compatibleIds", schemaPath: "#/$defs/device/properties/compatibleIds/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                                                                                                  return false;
                                                                                                } else {
                                                                                                  var valid12 = true;
                                                                                                  const len6 = data62.length;
                                                                                                  for (let i6 = 0; i6 < len6; i6++) {
                                                                                                    const _errs126 = errors;
                                                                                                    if (typeof data62[i6] !== "string") {
                                                                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/compatibleIds/" + i6, schemaPath: "#/$defs/device/properties/compatibleIds/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                      return false;
                                                                                                    }
                                                                                                    var valid12 = _errs126 === errors;
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
                                                                                            var valid10 = _errs124 === errors;
                                                                                          } else {
                                                                                            var valid10 = true;
                                                                                          }
                                                                                          if (valid10) {
                                                                                            if (data41.locationPaths !== void 0) {
                                                                                              let data64 = data41.locationPaths;
                                                                                              const _errs128 = errors;
                                                                                              if (errors === _errs128) {
                                                                                                if (Array.isArray(data64)) {
                                                                                                  if (data64.length > 256) {
                                                                                                    validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/locationPaths", schemaPath: "#/$defs/device/properties/locationPaths/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                                                                                                    return false;
                                                                                                  } else {
                                                                                                    var valid13 = true;
                                                                                                    const len7 = data64.length;
                                                                                                    for (let i7 = 0; i7 < len7; i7++) {
                                                                                                      const _errs130 = errors;
                                                                                                      if (typeof data64[i7] !== "string") {
                                                                                                        validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/locationPaths/" + i7, schemaPath: "#/$defs/device/properties/locationPaths/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                        return false;
                                                                                                      }
                                                                                                      var valid13 = _errs130 === errors;
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
                                                                                              var valid10 = _errs128 === errors;
                                                                                            } else {
                                                                                              var valid10 = true;
                                                                                            }
                                                                                            if (valid10) {
                                                                                              if (data41.deviceCapabilities !== void 0) {
                                                                                                let data66 = data41.deviceCapabilities;
                                                                                                const _errs132 = errors;
                                                                                                if (!(typeof data66 == "number" && (!(data66 % 1) && !isNaN(data66)) && isFinite(data66)) && data66 !== null) {
                                                                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/deviceCapabilities", schemaPath: "#/$defs/device/properties/deviceCapabilities/type", keyword: "type", params: { type: schema32.properties.deviceCapabilities.type }, message: "must be integer,null" }];
                                                                                                  return false;
                                                                                                }
                                                                                                if (errors === _errs132) {
                                                                                                  if (typeof data66 == "number" && isFinite(data66)) {
                                                                                                    if (data66 > 4294967295 || isNaN(data66)) {
                                                                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/deviceCapabilities", schemaPath: "#/$defs/device/properties/deviceCapabilities/maximum", keyword: "maximum", params: { comparison: "<=", limit: 4294967295 }, message: "must be <= 4294967295" }];
                                                                                                      return false;
                                                                                                    } else {
                                                                                                      if (data66 < 0 || isNaN(data66)) {
                                                                                                        validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/deviceCapabilities", schemaPath: "#/$defs/device/properties/deviceCapabilities/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                                        return false;
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                                var valid10 = _errs132 === errors;
                                                                                              } else {
                                                                                                var valid10 = true;
                                                                                              }
                                                                                              if (valid10) {
                                                                                                if (data41.removalPolicy !== void 0) {
                                                                                                  let data67 = data41.removalPolicy;
                                                                                                  const _errs134 = errors;
                                                                                                  if (!(data67 === null || data67 === 1 || data67 === 2 || data67 === 3)) {
                                                                                                    validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/removalPolicy", schemaPath: "#/$defs/device/properties/removalPolicy/enum", keyword: "enum", params: { allowedValues: schema32.properties.removalPolicy.enum }, message: "must be equal to one of the allowed values" }];
                                                                                                    return false;
                                                                                                  }
                                                                                                  var valid10 = _errs134 === errors;
                                                                                                } else {
                                                                                                  var valid10 = true;
                                                                                                }
                                                                                                if (valid10) {
                                                                                                  if (data41.enumeratorName !== void 0) {
                                                                                                    let data68 = data41.enumeratorName;
                                                                                                    const _errs135 = errors;
                                                                                                    if (typeof data68 !== "string" && data68 !== null) {
                                                                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/enumeratorName", schemaPath: "#/$defs/device/properties/enumeratorName/type", keyword: "type", params: { type: schema32.properties.enumeratorName.type }, message: "must be string,null" }];
                                                                                                      return false;
                                                                                                    }
                                                                                                    if (errors === _errs135) {
                                                                                                      if (typeof data68 === "string") {
                                                                                                        if (func3(data68) > 8192) {
                                                                                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/enumeratorName", schemaPath: "#/$defs/device/properties/enumeratorName/maxLength", keyword: "maxLength", params: { limit: 8192 }, message: "must NOT have more than 8192 characters" }];
                                                                                                          return false;
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                    var valid10 = _errs135 === errors;
                                                                                                  } else {
                                                                                                    var valid10 = true;
                                                                                                  }
                                                                                                  if (valid10) {
                                                                                                    if (data41.driverProvider !== void 0) {
                                                                                                      let data69 = data41.driverProvider;
                                                                                                      const _errs137 = errors;
                                                                                                      if (typeof data69 !== "string" && data69 !== null) {
                                                                                                        validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/driverProvider", schemaPath: "#/$defs/device/properties/driverProvider/type", keyword: "type", params: { type: schema32.properties.driverProvider.type }, message: "must be string,null" }];
                                                                                                        return false;
                                                                                                      }
                                                                                                      if (errors === _errs137) {
                                                                                                        if (typeof data69 === "string") {
                                                                                                          if (func3(data69) > 2048) {
                                                                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/driverProvider", schemaPath: "#/$defs/device/properties/driverProvider/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                                            return false;
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                      var valid10 = _errs137 === errors;
                                                                                                    } else {
                                                                                                      var valid10 = true;
                                                                                                    }
                                                                                                    if (valid10) {
                                                                                                      if (data41.driverVersion !== void 0) {
                                                                                                        let data70 = data41.driverVersion;
                                                                                                        const _errs139 = errors;
                                                                                                        if (typeof data70 !== "string" && data70 !== null) {
                                                                                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/driverVersion", schemaPath: "#/$defs/device/properties/driverVersion/type", keyword: "type", params: { type: schema32.properties.driverVersion.type }, message: "must be string,null" }];
                                                                                                          return false;
                                                                                                        }
                                                                                                        if (errors === _errs139) {
                                                                                                          if (typeof data70 === "string") {
                                                                                                            if (func3(data70) > 2048) {
                                                                                                              validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/driverVersion", schemaPath: "#/$defs/device/properties/driverVersion/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                                              return false;
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                        var valid10 = _errs139 === errors;
                                                                                                      } else {
                                                                                                        var valid10 = true;
                                                                                                      }
                                                                                                      if (valid10) {
                                                                                                        if (data41.driverDate !== void 0) {
                                                                                                          let data71 = data41.driverDate;
                                                                                                          const _errs141 = errors;
                                                                                                          if (typeof data71 !== "string" && data71 !== null) {
                                                                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/driverDate", schemaPath: "#/$defs/device/properties/driverDate/type", keyword: "type", params: { type: schema32.properties.driverDate.type }, message: "must be string,null" }];
                                                                                                            return false;
                                                                                                          }
                                                                                                          if (errors === _errs141) {
                                                                                                            if (typeof data71 === "string") {
                                                                                                              if (func3(data71) > 100) {
                                                                                                                validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4 + "/driverDate", schemaPath: "#/$defs/device/properties/driverDate/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                                                                                                return false;
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                          var valid10 = _errs141 === errors;
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
                                                    }
                                                  }
                                                }
                                              } else {
                                                validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i4, schemaPath: "#/$defs/device/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                return false;
                                              }
                                            }
                                            var valid8 = _errs82 === errors;
                                            if (!valid8) {
                                              break;
                                            }
                                          }
                                        } else {
                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices", schemaPath: "#/properties/previous/properties/devices/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                          return false;
                                        }
                                      }
                                      var valid7 = _errs80 === errors;
                                    } else {
                                      var valid7 = true;
                                    }
                                    if (valid7) {
                                      if (data38.provenance !== void 0) {
                                        let data72 = data38.provenance;
                                        const _errs143 = errors;
                                        const _errs144 = errors;
                                        if (errors === _errs144) {
                                          if (data72 && typeof data72 == "object" && !Array.isArray(data72)) {
                                            let missing4;
                                            if (data72.provider === void 0 && (missing4 = "provider") || data72.providerVersion === void 0 && (missing4 = "providerVersion") || data72.scope === void 0 && (missing4 = "scope")) {
                                              validate20.errors = [{ instancePath: instancePath + "/previous/provenance", schemaPath: "#/$defs/provenance/required", keyword: "required", params: { missingProperty: missing4 }, message: "must have required property '" + missing4 + "'" }];
                                              return false;
                                            } else {
                                              const _errs146 = errors;
                                              for (const key4 in data72) {
                                                if (!(key4 === "provider" || key4 === "providerVersion" || key4 === "scope")) {
                                                  validate20.errors = [{ instancePath: instancePath + "/previous/provenance", schemaPath: "#/$defs/provenance/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties" }];
                                                  return false;
                                                  break;
                                                }
                                              }
                                              if (_errs146 === errors) {
                                                if (data72.provider !== void 0) {
                                                  let data73 = data72.provider;
                                                  const _errs147 = errors;
                                                  if (!(data73 === "windows-cfgmgr32" || data73 === "windows-pnp-fallback")) {
                                                    validate20.errors = [{ instancePath: instancePath + "/previous/provenance/provider", schemaPath: "#/$defs/provenance/properties/provider/enum", keyword: "enum", params: { allowedValues: schema34.properties.provider.enum }, message: "must be equal to one of the allowed values" }];
                                                    return false;
                                                  }
                                                  var valid15 = _errs147 === errors;
                                                } else {
                                                  var valid15 = true;
                                                }
                                                if (valid15) {
                                                  if (data72.providerVersion !== void 0) {
                                                    const _errs148 = errors;
                                                    if ("1.0" !== data72.providerVersion) {
                                                      validate20.errors = [{ instancePath: instancePath + "/previous/provenance/providerVersion", schemaPath: "#/$defs/provenance/properties/providerVersion/const", keyword: "const", params: { allowedValue: "1.0" }, message: "must be equal to constant" }];
                                                      return false;
                                                    }
                                                    var valid15 = _errs148 === errors;
                                                  } else {
                                                    var valid15 = true;
                                                  }
                                                  if (valid15) {
                                                    if (data72.scope !== void 0) {
                                                      let data75 = data72.scope;
                                                      const _errs149 = errors;
                                                      if (!(data75 === "usb-hid" || data75 === "all-pnp")) {
                                                        validate20.errors = [{ instancePath: instancePath + "/previous/provenance/scope", schemaPath: "#/$defs/provenance/properties/scope/enum", keyword: "enum", params: { allowedValues: schema34.properties.scope.enum }, message: "must be equal to one of the allowed values" }];
                                                        return false;
                                                      }
                                                      var valid15 = _errs149 === errors;
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
                                        var valid7 = _errs143 === errors;
                                      } else {
                                        var valid7 = true;
                                      }
                                      if (valid7) {
                                        if (data38.complete !== void 0) {
                                          const _errs150 = errors;
                                          if (typeof data38.complete !== "boolean") {
                                            validate20.errors = [{ instancePath: instancePath + "/previous/complete", schemaPath: "#/properties/previous/properties/complete/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                            return false;
                                          }
                                          var valid7 = _errs150 === errors;
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
                          var valid0 = _errs75 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.findings !== void 0) {
                            let data77 = data.findings;
                            const _errs152 = errors;
                            if (errors === _errs152) {
                              if (Array.isArray(data77)) {
                                var valid16 = true;
                                const len8 = data77.length;
                                for (let i8 = 0; i8 < len8; i8++) {
                                  let data78 = data77[i8];
                                  const _errs154 = errors;
                                  const _errs155 = errors;
                                  if (errors === _errs155) {
                                    if (data78 && typeof data78 == "object" && !Array.isArray(data78)) {
                                      let missing5;
                                      if (data78.id === void 0 && (missing5 = "id") || data78.title === void 0 && (missing5 = "title") || data78.severity === void 0 && (missing5 = "severity") || data78.classification === void 0 && (missing5 = "classification") || data78.confidence === void 0 && (missing5 = "confidence") || data78.facts === void 0 && (missing5 = "facts") || data78.explanation === void 0 && (missing5 = "explanation") || data78.evidence === void 0 && (missing5 = "evidence") || data78.recommendation === void 0 && (missing5 = "recommendation") || data78.limitations === void 0 && (missing5 = "limitations")) {
                                        validate20.errors = [{ instancePath: instancePath + "/findings/" + i8, schemaPath: "#/$defs/finding/required", keyword: "required", params: { missingProperty: missing5 }, message: "must have required property '" + missing5 + "'" }];
                                        return false;
                                      } else {
                                        const _errs157 = errors;
                                        for (const key5 in data78) {
                                          if (!func1.call(schema35.properties, key5)) {
                                            validate20.errors = [{ instancePath: instancePath + "/findings/" + i8, schemaPath: "#/$defs/finding/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key5 }, message: "must NOT have additional properties" }];
                                            return false;
                                            break;
                                          }
                                        }
                                        if (_errs157 === errors) {
                                          if (data78.id !== void 0) {
                                            const _errs158 = errors;
                                            if (typeof data78.id !== "string") {
                                              validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/id", schemaPath: "#/$defs/finding/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                              return false;
                                            }
                                            var valid18 = _errs158 === errors;
                                          } else {
                                            var valid18 = true;
                                          }
                                          if (valid18) {
                                            if (data78.deviceId !== void 0) {
                                              const _errs160 = errors;
                                              if (typeof data78.deviceId !== "string") {
                                                validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/deviceId", schemaPath: "#/$defs/finding/properties/deviceId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                return false;
                                              }
                                              var valid18 = _errs160 === errors;
                                            } else {
                                              var valid18 = true;
                                            }
                                            if (valid18) {
                                              if (data78.title !== void 0) {
                                                const _errs162 = errors;
                                                if (typeof data78.title !== "string") {
                                                  validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/title", schemaPath: "#/$defs/finding/properties/title/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                  return false;
                                                }
                                                var valid18 = _errs162 === errors;
                                              } else {
                                                var valid18 = true;
                                              }
                                              if (valid18) {
                                                if (data78.severity !== void 0) {
                                                  let data82 = data78.severity;
                                                  const _errs164 = errors;
                                                  if (!(data82 === "info" || data82 === "warning" || data82 === "error")) {
                                                    validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/severity", schemaPath: "#/$defs/finding/properties/severity/enum", keyword: "enum", params: { allowedValues: schema35.properties.severity.enum }, message: "must be equal to one of the allowed values" }];
                                                    return false;
                                                  }
                                                  var valid18 = _errs164 === errors;
                                                } else {
                                                  var valid18 = true;
                                                }
                                                if (valid18) {
                                                  if (data78.classification !== void 0) {
                                                    let data83 = data78.classification;
                                                    const _errs165 = errors;
                                                    if (!(data83 === "Windows-reported error" || data83 === "Confirmed observation")) {
                                                      validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/classification", schemaPath: "#/$defs/finding/properties/classification/enum", keyword: "enum", params: { allowedValues: schema35.properties.classification.enum }, message: "must be equal to one of the allowed values" }];
                                                      return false;
                                                    }
                                                    var valid18 = _errs165 === errors;
                                                  } else {
                                                    var valid18 = true;
                                                  }
                                                  if (valid18) {
                                                    if (data78.confidence !== void 0) {
                                                      let data84 = data78.confidence;
                                                      const _errs166 = errors;
                                                      if (!(data84 === "high" || data84 === "limited")) {
                                                        validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/confidence", schemaPath: "#/$defs/finding/properties/confidence/enum", keyword: "enum", params: { allowedValues: schema35.properties.confidence.enum }, message: "must be equal to one of the allowed values" }];
                                                        return false;
                                                      }
                                                      var valid18 = _errs166 === errors;
                                                    } else {
                                                      var valid18 = true;
                                                    }
                                                    if (valid18) {
                                                      if (data78.facts !== void 0) {
                                                        let data85 = data78.facts;
                                                        const _errs167 = errors;
                                                        if (errors === _errs167) {
                                                          if (Array.isArray(data85)) {
                                                            var valid19 = true;
                                                            const len9 = data85.length;
                                                            for (let i9 = 0; i9 < len9; i9++) {
                                                              const _errs169 = errors;
                                                              if (typeof data85[i9] !== "string") {
                                                                validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/facts/" + i9, schemaPath: "#/$defs/finding/properties/facts/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                return false;
                                                              }
                                                              var valid19 = _errs169 === errors;
                                                              if (!valid19) {
                                                                break;
                                                              }
                                                            }
                                                          } else {
                                                            validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/facts", schemaPath: "#/$defs/finding/properties/facts/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                            return false;
                                                          }
                                                        }
                                                        var valid18 = _errs167 === errors;
                                                      } else {
                                                        var valid18 = true;
                                                      }
                                                      if (valid18) {
                                                        if (data78.explanation !== void 0) {
                                                          const _errs171 = errors;
                                                          if (typeof data78.explanation !== "string") {
                                                            validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/explanation", schemaPath: "#/$defs/finding/properties/explanation/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                            return false;
                                                          }
                                                          var valid18 = _errs171 === errors;
                                                        } else {
                                                          var valid18 = true;
                                                        }
                                                        if (valid18) {
                                                          if (data78.evidence !== void 0) {
                                                            let data88 = data78.evidence;
                                                            const _errs173 = errors;
                                                            if (errors === _errs173) {
                                                              if (Array.isArray(data88)) {
                                                                var valid20 = true;
                                                                const len10 = data88.length;
                                                                for (let i10 = 0; i10 < len10; i10++) {
                                                                  const _errs175 = errors;
                                                                  if (typeof data88[i10] !== "string") {
                                                                    validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/evidence/" + i10, schemaPath: "#/$defs/finding/properties/evidence/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                    return false;
                                                                  }
                                                                  var valid20 = _errs175 === errors;
                                                                  if (!valid20) {
                                                                    break;
                                                                  }
                                                                }
                                                              } else {
                                                                validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/evidence", schemaPath: "#/$defs/finding/properties/evidence/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                return false;
                                                              }
                                                            }
                                                            var valid18 = _errs173 === errors;
                                                          } else {
                                                            var valid18 = true;
                                                          }
                                                          if (valid18) {
                                                            if (data78.recommendation !== void 0) {
                                                              const _errs177 = errors;
                                                              if (typeof data78.recommendation !== "string") {
                                                                validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/recommendation", schemaPath: "#/$defs/finding/properties/recommendation/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                return false;
                                                              }
                                                              var valid18 = _errs177 === errors;
                                                            } else {
                                                              var valid18 = true;
                                                            }
                                                            if (valid18) {
                                                              if (data78.limitations !== void 0) {
                                                                const _errs179 = errors;
                                                                if (typeof data78.limitations !== "string") {
                                                                  validate20.errors = [{ instancePath: instancePath + "/findings/" + i8 + "/limitations", schemaPath: "#/$defs/finding/properties/limitations/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                  return false;
                                                                }
                                                                var valid18 = _errs179 === errors;
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
                                  var valid16 = _errs154 === errors;
                                  if (!valid16) {
                                    break;
                                  }
                                }
                              } else {
                                validate20.errors = [{ instancePath: instancePath + "/findings", schemaPath: "#/properties/findings/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                return false;
                              }
                            }
                            var valid0 = _errs152 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.errors !== void 0) {
                              let data92 = data.errors;
                              const _errs181 = errors;
                              if (errors === _errs181) {
                                if (Array.isArray(data92)) {
                                  var valid21 = true;
                                  const len11 = data92.length;
                                  for (let i11 = 0; i11 < len11; i11++) {
                                    let data93 = data92[i11];
                                    const _errs183 = errors;
                                    if (errors === _errs183) {
                                      if (data93 && typeof data93 == "object" && !Array.isArray(data93)) {
                                        let missing6;
                                        if (data93.kind === void 0 && (missing6 = "kind") || data93.message === void 0 && (missing6 = "message")) {
                                          validate20.errors = [{ instancePath: instancePath + "/errors/" + i11, schemaPath: "#/properties/errors/items/required", keyword: "required", params: { missingProperty: missing6 }, message: "must have required property '" + missing6 + "'" }];
                                          return false;
                                        } else {
                                          const _errs185 = errors;
                                          for (const key6 in data93) {
                                            if (!(key6 === "kind" || key6 === "message" || key6 === "deviceId")) {
                                              validate20.errors = [{ instancePath: instancePath + "/errors/" + i11, schemaPath: "#/properties/errors/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key6 }, message: "must NOT have additional properties" }];
                                              return false;
                                              break;
                                            }
                                          }
                                          if (_errs185 === errors) {
                                            if (data93.kind !== void 0) {
                                              let data94 = data93.kind;
                                              const _errs186 = errors;
                                              if (!(data94 === "permission" || data94 === "property" || data94 === "enumeration" || data94 === "malformed")) {
                                                validate20.errors = [{ instancePath: instancePath + "/errors/" + i11 + "/kind", schemaPath: "#/properties/errors/items/properties/kind/enum", keyword: "enum", params: { allowedValues: schema31.properties.errors.items.properties.kind.enum }, message: "must be equal to one of the allowed values" }];
                                                return false;
                                              }
                                              var valid22 = _errs186 === errors;
                                            } else {
                                              var valid22 = true;
                                            }
                                            if (valid22) {
                                              if (data93.message !== void 0) {
                                                const _errs187 = errors;
                                                if (typeof data93.message !== "string") {
                                                  validate20.errors = [{ instancePath: instancePath + "/errors/" + i11 + "/message", schemaPath: "#/properties/errors/items/properties/message/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                  return false;
                                                }
                                                var valid22 = _errs187 === errors;
                                              } else {
                                                var valid22 = true;
                                              }
                                              if (valid22) {
                                                if (data93.deviceId !== void 0) {
                                                  const _errs189 = errors;
                                                  if (typeof data93.deviceId !== "string") {
                                                    validate20.errors = [{ instancePath: instancePath + "/errors/" + i11 + "/deviceId", schemaPath: "#/properties/errors/items/properties/deviceId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                    return false;
                                                  }
                                                  var valid22 = _errs189 === errors;
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
                                    var valid21 = _errs183 === errors;
                                    if (!valid21) {
                                      break;
                                    }
                                  }
                                } else {
                                  validate20.errors = [{ instancePath: instancePath + "/errors", schemaPath: "#/properties/errors/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                  return false;
                                }
                              }
                              var valid0 = _errs181 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.limitations !== void 0) {
                                let data97 = data.limitations;
                                const _errs191 = errors;
                                if (errors === _errs191) {
                                  if (Array.isArray(data97)) {
                                    var valid23 = true;
                                    const len12 = data97.length;
                                    for (let i12 = 0; i12 < len12; i12++) {
                                      const _errs193 = errors;
                                      if (typeof data97[i12] !== "string") {
                                        validate20.errors = [{ instancePath: instancePath + "/limitations/" + i12, schemaPath: "#/properties/limitations/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                        return false;
                                      }
                                      var valid23 = _errs193 === errors;
                                      if (!valid23) {
                                        break;
                                      }
                                    }
                                  } else {
                                    validate20.errors = [{ instancePath: instancePath + "/limitations", schemaPath: "#/properties/limitations/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                    return false;
                                  }
                                }
                                var valid0 = _errs191 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.provenance !== void 0) {
                                  let data99 = data.provenance;
                                  const _errs195 = errors;
                                  const _errs196 = errors;
                                  if (errors === _errs196) {
                                    if (data99 && typeof data99 == "object" && !Array.isArray(data99)) {
                                      let missing7;
                                      if (data99.provider === void 0 && (missing7 = "provider") || data99.providerVersion === void 0 && (missing7 = "providerVersion") || data99.scope === void 0 && (missing7 = "scope")) {
                                        validate20.errors = [{ instancePath: instancePath + "/provenance", schemaPath: "#/$defs/provenance/required", keyword: "required", params: { missingProperty: missing7 }, message: "must have required property '" + missing7 + "'" }];
                                        return false;
                                      } else {
                                        const _errs198 = errors;
                                        for (const key7 in data99) {
                                          if (!(key7 === "provider" || key7 === "providerVersion" || key7 === "scope")) {
                                            validate20.errors = [{ instancePath: instancePath + "/provenance", schemaPath: "#/$defs/provenance/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key7 }, message: "must NOT have additional properties" }];
                                            return false;
                                            break;
                                          }
                                        }
                                        if (_errs198 === errors) {
                                          if (data99.provider !== void 0) {
                                            let data100 = data99.provider;
                                            const _errs199 = errors;
                                            if (!(data100 === "windows-cfgmgr32" || data100 === "windows-pnp-fallback")) {
                                              validate20.errors = [{ instancePath: instancePath + "/provenance/provider", schemaPath: "#/$defs/provenance/properties/provider/enum", keyword: "enum", params: { allowedValues: schema34.properties.provider.enum }, message: "must be equal to one of the allowed values" }];
                                              return false;
                                            }
                                            var valid25 = _errs199 === errors;
                                          } else {
                                            var valid25 = true;
                                          }
                                          if (valid25) {
                                            if (data99.providerVersion !== void 0) {
                                              const _errs200 = errors;
                                              if ("1.0" !== data99.providerVersion) {
                                                validate20.errors = [{ instancePath: instancePath + "/provenance/providerVersion", schemaPath: "#/$defs/provenance/properties/providerVersion/const", keyword: "const", params: { allowedValue: "1.0" }, message: "must be equal to constant" }];
                                                return false;
                                              }
                                              var valid25 = _errs200 === errors;
                                            } else {
                                              var valid25 = true;
                                            }
                                            if (valid25) {
                                              if (data99.scope !== void 0) {
                                                let data102 = data99.scope;
                                                const _errs201 = errors;
                                                if (!(data102 === "usb-hid" || data102 === "all-pnp")) {
                                                  validate20.errors = [{ instancePath: instancePath + "/provenance/scope", schemaPath: "#/$defs/provenance/properties/scope/enum", keyword: "enum", params: { allowedValues: schema34.properties.scope.enum }, message: "must be equal to one of the allowed values" }];
                                                  return false;
                                                }
                                                var valid25 = _errs201 === errors;
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
                                  var valid0 = _errs195 === errors;
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
var schema39 = { "$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "https://anydevice.local/device-workbench.schema.json", "type": "object", "required": ["schemaVersion", "createdAt", "sanitized", "target", "userReport", "tests", "limitations"], "properties": { "schemaVersion": { "const": "device-workbench-1.0" }, "createdAt": { "type": "string" }, "sanitized": { "type": "boolean" }, "target": { "type": "object", "required": ["id", "name"], "properties": { "id": { "type": "string", "maxLength": 8192 }, "name": { "type": ["string", "null"] } }, "additionalProperties": false }, "userReport": { "type": "object", "required": ["source", "symptom", "conditions", "physicalAttempts"], "properties": { "source": { "const": "user" }, "symptom": { "type": ["string", "null"], "maxLength": 2e3 }, "conditions": { "type": ["string", "null"], "maxLength": 2e3 }, "physicalAttempts": { "type": ["integer", "null"], "minimum": 0, "maximum": 1e4 } }, "additionalProperties": false }, "tests": { "type": "array", "maxItems": 8, "items": { "type": "object", "required": ["targetId", "mode", "startedAt", "status", "cleanup", "stats", "historyTruncated"], "properties": { "targetId": { "type": "string", "maxLength": 8192 }, "mode": { "enum": ["mouse", "keyboard", "x-key"] }, "startedAt": { "type": "string" }, "status": { "enum": ["testing", "eventsObserved", "noEventsObserved", "completed", "focusLost", "disconnected", "failed", "unsupported"] }, "cleanup": { "type": "boolean" }, "historyTruncated": { "type": "boolean" }, "stats": { "type": "object", "required": ["events", "movements", "x", "y", "absolute", "buttons", "keys", "wheelUp", "wheelDown", "horizontal"], "properties": { "events": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "movements": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "wheelUp": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "wheelDown": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "horizontal": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "x": { "type": "integer" }, "y": { "type": "integer" }, "absolute": { "type": "boolean" }, "keys": { "type": "object", "maxProperties": 255, "propertyNames": { "pattern": "^(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-4])$" }, "additionalProperties": { "type": "object", "required": ["down", "up", "repeat", "held"], "properties": { "down": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "up": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "repeat": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "held": { "type": "boolean" } }, "additionalProperties": false } }, "buttons": { "type": "object", "maxProperties": 5, "propertyNames": { "pattern": "^[1-5]$" }, "additionalProperties": { "type": "object", "required": ["down", "up", "repeat", "held"], "properties": { "down": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "up": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "repeat": { "type": "integer", "minimum": 0, "maximum": 15e4 }, "held": { "type": "boolean" } }, "additionalProperties": false } } }, "additionalProperties": false } }, "additionalProperties": false } }, "limitations": { "type": "array", "maxItems": 10, "items": { "type": "string" } }, "lightingInvestigation": { "anyOf": [{ "type": "null" }, { "type": "object", "additionalProperties": false, "properties": { "model": { "type": ["string", "null"], "maxLength": 160 }, "modelEvidence": { "type": ["string", "null"], "maxLength": 512 }, "modelSource": { "enum": ["unknown", "label", "manual"] }, "conditions": { "type": ["string", "null"], "maxLength": 1e3 }, "uniformModeCompared": { "type": "boolean" }, "affectedLight": { "enum": ["not checked", "lit", "dark"] }, "otherLights": { "enum": ["not checked", "lit", "dark"] }, "repeated": { "type": "boolean" }, "source": { "const": "Owner report; no independent illumination measurement" } }, "required": ["model", "modelEvidence", "modelSource", "conditions", "uniformModeCompared", "affectedLight", "otherLights", "repeated", "source"] }] } }, "additionalProperties": false };
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
          if (!(key0 === "schemaVersion" || key0 === "createdAt" || key0 === "sanitized" || key0 === "target" || key0 === "userReport" || key0 === "tests" || key0 === "limitations" || key0 === "lightingInvestigation")) {
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
                      if (valid0) {
                        if (data.lightingInvestigation !== void 0) {
                          let data42 = data.lightingInvestigation;
                          const _errs92 = errors;
                          const _errs93 = errors;
                          let valid13 = false;
                          const _errs94 = errors;
                          if (data42 !== null) {
                            const err4 = { instancePath: instancePath + "/lightingInvestigation", schemaPath: "#/properties/lightingInvestigation/anyOf/0/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                            if (vErrors === null) {
                              vErrors = [err4];
                            } else {
                              vErrors.push(err4);
                            }
                            errors++;
                          }
                          var _valid0 = _errs94 === errors;
                          valid13 = valid13 || _valid0;
                          const _errs96 = errors;
                          if (errors === _errs96) {
                            if (data42 && typeof data42 == "object" && !Array.isArray(data42)) {
                              let missing7;
                              if (data42.model === void 0 && (missing7 = "model") || data42.modelEvidence === void 0 && (missing7 = "modelEvidence") || data42.modelSource === void 0 && (missing7 = "modelSource") || data42.conditions === void 0 && (missing7 = "conditions") || data42.uniformModeCompared === void 0 && (missing7 = "uniformModeCompared") || data42.affectedLight === void 0 && (missing7 = "affectedLight") || data42.otherLights === void 0 && (missing7 = "otherLights") || data42.repeated === void 0 && (missing7 = "repeated") || data42.source === void 0 && (missing7 = "source")) {
                                const err5 = { instancePath: instancePath + "/lightingInvestigation", schemaPath: "#/properties/lightingInvestigation/anyOf/1/required", keyword: "required", params: { missingProperty: missing7 }, message: "must have required property '" + missing7 + "'" };
                                if (vErrors === null) {
                                  vErrors = [err5];
                                } else {
                                  vErrors.push(err5);
                                }
                                errors++;
                              } else {
                                const _errs98 = errors;
                                for (const key11 in data42) {
                                  if (!func1.call(schema39.properties.lightingInvestigation.anyOf[1].properties, key11)) {
                                    const err6 = { instancePath: instancePath + "/lightingInvestigation", schemaPath: "#/properties/lightingInvestigation/anyOf/1/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key11 }, message: "must NOT have additional properties" };
                                    if (vErrors === null) {
                                      vErrors = [err6];
                                    } else {
                                      vErrors.push(err6);
                                    }
                                    errors++;
                                    break;
                                  }
                                }
                                if (_errs98 === errors) {
                                  if (data42.model !== void 0) {
                                    let data43 = data42.model;
                                    const _errs99 = errors;
                                    if (typeof data43 !== "string" && data43 !== null) {
                                      const err7 = { instancePath: instancePath + "/lightingInvestigation/model", schemaPath: "#/properties/lightingInvestigation/anyOf/1/properties/model/type", keyword: "type", params: { type: schema39.properties.lightingInvestigation.anyOf[1].properties.model.type }, message: "must be string,null" };
                                      if (vErrors === null) {
                                        vErrors = [err7];
                                      } else {
                                        vErrors.push(err7);
                                      }
                                      errors++;
                                    }
                                    if (errors === _errs99) {
                                      if (typeof data43 === "string") {
                                        if (func3(data43) > 160) {
                                          const err8 = { instancePath: instancePath + "/lightingInvestigation/model", schemaPath: "#/properties/lightingInvestigation/anyOf/1/properties/model/maxLength", keyword: "maxLength", params: { limit: 160 }, message: "must NOT have more than 160 characters" };
                                          if (vErrors === null) {
                                            vErrors = [err8];
                                          } else {
                                            vErrors.push(err8);
                                          }
                                          errors++;
                                        }
                                      }
                                    }
                                    var valid14 = _errs99 === errors;
                                  } else {
                                    var valid14 = true;
                                  }
                                  if (valid14) {
                                    if (data42.modelEvidence !== void 0) {
                                      let data44 = data42.modelEvidence;
                                      const _errs101 = errors;
                                      if (typeof data44 !== "string" && data44 !== null) {
                                        const err9 = { instancePath: instancePath + "/lightingInvestigation/modelEvidence", schemaPath: "#/properties/lightingInvestigation/anyOf/1/properties/modelEvidence/type", keyword: "type", params: { type: schema39.properties.lightingInvestigation.anyOf[1].properties.modelEvidence.type }, message: "must be string,null" };
                                        if (vErrors === null) {
                                          vErrors = [err9];
                                        } else {
                                          vErrors.push(err9);
                                        }
                                        errors++;
                                      }
                                      if (errors === _errs101) {
                                        if (typeof data44 === "string") {
                                          if (func3(data44) > 512) {
                                            const err10 = { instancePath: instancePath + "/lightingInvestigation/modelEvidence", schemaPath: "#/properties/lightingInvestigation/anyOf/1/properties/modelEvidence/maxLength", keyword: "maxLength", params: { limit: 512 }, message: "must NOT have more than 512 characters" };
                                            if (vErrors === null) {
                                              vErrors = [err10];
                                            } else {
                                              vErrors.push(err10);
                                            }
                                            errors++;
                                          }
                                        }
                                      }
                                      var valid14 = _errs101 === errors;
                                    } else {
                                      var valid14 = true;
                                    }
                                    if (valid14) {
                                      if (data42.modelSource !== void 0) {
                                        let data45 = data42.modelSource;
                                        const _errs103 = errors;
                                        if (!(data45 === "unknown" || data45 === "label" || data45 === "manual")) {
                                          const err11 = { instancePath: instancePath + "/lightingInvestigation/modelSource", schemaPath: "#/properties/lightingInvestigation/anyOf/1/properties/modelSource/enum", keyword: "enum", params: { allowedValues: schema39.properties.lightingInvestigation.anyOf[1].properties.modelSource.enum }, message: "must be equal to one of the allowed values" };
                                          if (vErrors === null) {
                                            vErrors = [err11];
                                          } else {
                                            vErrors.push(err11);
                                          }
                                          errors++;
                                        }
                                        var valid14 = _errs103 === errors;
                                      } else {
                                        var valid14 = true;
                                      }
                                      if (valid14) {
                                        if (data42.conditions !== void 0) {
                                          let data46 = data42.conditions;
                                          const _errs104 = errors;
                                          if (typeof data46 !== "string" && data46 !== null) {
                                            const err12 = { instancePath: instancePath + "/lightingInvestigation/conditions", schemaPath: "#/properties/lightingInvestigation/anyOf/1/properties/conditions/type", keyword: "type", params: { type: schema39.properties.lightingInvestigation.anyOf[1].properties.conditions.type }, message: "must be string,null" };
                                            if (vErrors === null) {
                                              vErrors = [err12];
                                            } else {
                                              vErrors.push(err12);
                                            }
                                            errors++;
                                          }
                                          if (errors === _errs104) {
                                            if (typeof data46 === "string") {
                                              if (func3(data46) > 1e3) {
                                                const err13 = { instancePath: instancePath + "/lightingInvestigation/conditions", schemaPath: "#/properties/lightingInvestigation/anyOf/1/properties/conditions/maxLength", keyword: "maxLength", params: { limit: 1e3 }, message: "must NOT have more than 1000 characters" };
                                                if (vErrors === null) {
                                                  vErrors = [err13];
                                                } else {
                                                  vErrors.push(err13);
                                                }
                                                errors++;
                                              }
                                            }
                                          }
                                          var valid14 = _errs104 === errors;
                                        } else {
                                          var valid14 = true;
                                        }
                                        if (valid14) {
                                          if (data42.uniformModeCompared !== void 0) {
                                            const _errs106 = errors;
                                            if (typeof data42.uniformModeCompared !== "boolean") {
                                              const err14 = { instancePath: instancePath + "/lightingInvestigation/uniformModeCompared", schemaPath: "#/properties/lightingInvestigation/anyOf/1/properties/uniformModeCompared/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                              if (vErrors === null) {
                                                vErrors = [err14];
                                              } else {
                                                vErrors.push(err14);
                                              }
                                              errors++;
                                            }
                                            var valid14 = _errs106 === errors;
                                          } else {
                                            var valid14 = true;
                                          }
                                          if (valid14) {
                                            if (data42.affectedLight !== void 0) {
                                              let data48 = data42.affectedLight;
                                              const _errs108 = errors;
                                              if (!(data48 === "not checked" || data48 === "lit" || data48 === "dark")) {
                                                const err15 = { instancePath: instancePath + "/lightingInvestigation/affectedLight", schemaPath: "#/properties/lightingInvestigation/anyOf/1/properties/affectedLight/enum", keyword: "enum", params: { allowedValues: schema39.properties.lightingInvestigation.anyOf[1].properties.affectedLight.enum }, message: "must be equal to one of the allowed values" };
                                                if (vErrors === null) {
                                                  vErrors = [err15];
                                                } else {
                                                  vErrors.push(err15);
                                                }
                                                errors++;
                                              }
                                              var valid14 = _errs108 === errors;
                                            } else {
                                              var valid14 = true;
                                            }
                                            if (valid14) {
                                              if (data42.otherLights !== void 0) {
                                                let data49 = data42.otherLights;
                                                const _errs109 = errors;
                                                if (!(data49 === "not checked" || data49 === "lit" || data49 === "dark")) {
                                                  const err16 = { instancePath: instancePath + "/lightingInvestigation/otherLights", schemaPath: "#/properties/lightingInvestigation/anyOf/1/properties/otherLights/enum", keyword: "enum", params: { allowedValues: schema39.properties.lightingInvestigation.anyOf[1].properties.otherLights.enum }, message: "must be equal to one of the allowed values" };
                                                  if (vErrors === null) {
                                                    vErrors = [err16];
                                                  } else {
                                                    vErrors.push(err16);
                                                  }
                                                  errors++;
                                                }
                                                var valid14 = _errs109 === errors;
                                              } else {
                                                var valid14 = true;
                                              }
                                              if (valid14) {
                                                if (data42.repeated !== void 0) {
                                                  const _errs110 = errors;
                                                  if (typeof data42.repeated !== "boolean") {
                                                    const err17 = { instancePath: instancePath + "/lightingInvestigation/repeated", schemaPath: "#/properties/lightingInvestigation/anyOf/1/properties/repeated/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                    if (vErrors === null) {
                                                      vErrors = [err17];
                                                    } else {
                                                      vErrors.push(err17);
                                                    }
                                                    errors++;
                                                  }
                                                  var valid14 = _errs110 === errors;
                                                } else {
                                                  var valid14 = true;
                                                }
                                                if (valid14) {
                                                  if (data42.source !== void 0) {
                                                    const _errs112 = errors;
                                                    if ("Owner report; no independent illumination measurement" !== data42.source) {
                                                      const err18 = { instancePath: instancePath + "/lightingInvestigation/source", schemaPath: "#/properties/lightingInvestigation/anyOf/1/properties/source/const", keyword: "const", params: { allowedValue: "Owner report; no independent illumination measurement" }, message: "must be equal to constant" };
                                                      if (vErrors === null) {
                                                        vErrors = [err18];
                                                      } else {
                                                        vErrors.push(err18);
                                                      }
                                                      errors++;
                                                    }
                                                    var valid14 = _errs112 === errors;
                                                  } else {
                                                    var valid14 = true;
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
                              const err19 = { instancePath: instancePath + "/lightingInvestigation", schemaPath: "#/properties/lightingInvestigation/anyOf/1/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                              if (vErrors === null) {
                                vErrors = [err19];
                              } else {
                                vErrors.push(err19);
                              }
                              errors++;
                            }
                          }
                          var _valid0 = _errs96 === errors;
                          valid13 = valid13 || _valid0;
                          if (!valid13) {
                            const err20 = { instancePath: instancePath + "/lightingInvestigation", schemaPath: "#/properties/lightingInvestigation/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                            if (vErrors === null) {
                              vErrors = [err20];
                            } else {
                              vErrors.push(err20);
                            }
                            errors++;
                            validate24.errors = vErrors;
                            return false;
                          } else {
                            errors = _errs93;
                            if (vErrors !== null) {
                              if (_errs93) {
                                vErrors.length = _errs93;
                              } else {
                                vErrors = null;
                              }
                            }
                          }
                          var valid0 = _errs92 === errors;
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
    } else {
      validate24.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate24.errors = vErrors;
  return errors === 0;
}
validate24.evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false };
var engine = validate25;
var schema40 = { "type": "object", "additionalProperties": false, "properties": { "schemaVersion": { "const": "diagnostic-engine-1.0" }, "appVersion": { "const": "0.2.0" }, "createdAt": { "type": "string", "maxLength": 100 }, "sanitized": { "type": "boolean" }, "coverage": { "type": "string", "maxLength": 2048 }, "scanComplete": { "type": "boolean" }, "discoveryProvenance": { "anyOf": [{ "type": "object", "additionalProperties": false, "properties": { "provider": { "type": "string", "maxLength": 2048 }, "scope": { "type": "string", "maxLength": 2048 }, "collectedAt": { "type": "string", "maxLength": 100 } }, "required": ["provider", "scope", "collectedAt"] }, { "type": "null" }] }, "userAudioReport": { "anyOf": [{ "type": "object", "additionalProperties": false, "properties": { "sessionId": { "anyOf": [{ "type": "integer", "minimum": 1 }, { "type": "null" }] }, "heardExpected": { "enum": ["yes", "no", "unknown"] }, "staticReported": { "type": ["boolean", "null"] } }, "required": ["sessionId", "heardExpected", "staticReported"] }, { "type": "null" }] }, "checks": { "type": "array", "items": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "string", "maxLength": 8192 }, "target": { "type": "string", "maxLength": 8192 }, "test": { "type": "string", "maxLength": 2048 }, "outcome": { "enum": ["Passed", "Issue detected", "Inconclusive", "Not supported", "Not tested", "Cancelled or interrupted", "Warning", "Skipped"] }, "confidence": { "enum": ["Windows-reported", "Measured", "User-reported", "Limited"] }, "measurements": { "type": "object", "maxProperties": 32, "additionalProperties": { "anyOf": [{ "type": "string", "maxLength": 2048 }, { "type": "number" }, { "type": "boolean" }, { "type": "null" }] } }, "conclusion": { "type": "string", "maxLength": 2048 }, "nextStep": { "type": "string", "maxLength": 2048 }, "hypotheses": { "type": "array", "items": { "type": "object", "additionalProperties": false, "properties": { "cause": { "type": "string", "maxLength": 2048 }, "confidence": { "enum": ["Confirmed configuration", "Possible", "Insufficient evidence"] }, "distinguishingTest": { "type": "string", "maxLength": 2048 }, "supportingEvidence": { "type": "array", "maxItems": 32, "items": { "type": "string", "maxLength": 2048 } }, "contradictingEvidence": { "type": "array", "maxItems": 32, "items": { "type": "string", "maxLength": 2048 } }, "verificationCriterion": { "type": "string", "maxLength": 2048 } }, "required": ["cause", "confidence", "distinguishingTest"] }, "maxItems": 16 }, "definitionId": { "type": "string", "maxLength": 2048 }, "checkVersion": { "const": 1 }, "category": { "enum": ["audio", "input-and-protocol", "inventory"] }, "preconditions": { "type": "array", "maxItems": 64, "items": { "type": "string", "maxLength": 2048 } }, "evidenceSource": { "type": "string", "maxLength": 2048 }, "confidenceRationale": { "type": "string", "maxLength": 2048 }, "supportingEvidence": { "type": "array", "maxItems": 64, "items": { "type": "string", "maxLength": 2048 } }, "contradictingEvidence": { "type": "array", "maxItems": 64, "items": { "type": "string", "maxLength": 2048 } }, "unknowns": { "type": "array", "maxItems": 64, "items": { "type": "string", "maxLength": 2048 } }, "verificationRequirements": { "type": "array", "maxItems": 64, "items": { "type": "string", "maxLength": 2048 } }, "repair": { "type": "object", "additionalProperties": false, "properties": { "providerId": { "enum": ["audio-endpoint-mute-v1", null] }, "availability": { "type": "string", "maxLength": 2048 }, "reason": { "type": "string", "maxLength": 2048 } }, "required": ["providerId", "availability", "reason"] }, "classification": { "enum": ["confirmed_issue", "potential_issue", "informational", "inconclusive", "unsupported", "not_tested"] }, "observedAt": { "type": ["string", "null"], "maxLength": 100 } }, "required": ["id", "target", "test", "outcome", "confidence", "measurements", "conclusion", "nextStep", "hypotheses"] }, "maxItems": 8192 }, "audioEndpoints": { "type": "array", "items": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "string", "maxLength": 2048 }, "name": { "type": ["string", "null"], "maxLength": 2048 }, "instanceId": { "type": ["string", "null"], "maxLength": 2048 }, "containerId": { "type": ["string", "null"], "maxLength": 2048 }, "kind": { "enum": ["playback", "recording"] }, "state": { "enum": ["active", "disabled", "unplugged", "notPresent"] }, "defaultRoles": { "type": "array", "items": { "enum": ["console", "multimedia", "communications"] }, "maxItems": 3 }, "mute": { "type": ["boolean", "null"] }, "volume": { "type": ["number", "null"] }, "format": { "anyOf": [{ "type": "object", "additionalProperties": false, "properties": { "sampleRate": { "type": "integer", "minimum": 0 }, "channels": { "type": "integer", "minimum": 0 }, "bits": { "type": "integer", "minimum": 0 }, "float": { "type": "boolean" }, "blockAlign": { "type": "integer", "minimum": 0 }, "channelMask": { "type": "integer", "minimum": 0 }, "supported": { "type": "boolean" } }, "required": ["sampleRate", "channels", "bits", "float", "blockAlign", "channelMask", "supported"] }, { "type": "null" }] } }, "required": ["id", "name", "instanceId", "containerId", "kind", "state", "defaultRoles", "mute", "volume", "format"] }, "maxItems": 256 }, "audioSessions": { "type": "array", "items": { "type": "object", "additionalProperties": false, "properties": { "sessionId": { "type": "integer", "minimum": 0 }, "targetId": { "type": "string", "maxLength": 2048 }, "mode": { "enum": ["left", "right", "tone", "ambient", "speech"] }, "status": { "type": "string", "maxLength": 100 }, "reason": { "type": "string", "maxLength": 2048 }, "startedAt": { "type": "string", "maxLength": 100 }, "format": { "anyOf": [{ "type": "object", "additionalProperties": false, "properties": { "sampleRate": { "type": "integer", "minimum": 0 }, "channels": { "type": "integer", "minimum": 0 }, "bits": { "type": "integer", "minimum": 0 }, "float": { "type": "boolean" }, "blockAlign": { "type": "integer", "minimum": 0 }, "channelMask": { "type": "integer", "minimum": 0 }, "supported": { "type": "boolean" } }, "required": ["sampleRate", "channels", "bits", "float", "blockAlign", "channelMask", "supported"] }, { "type": "null" }] }, "frames": { "type": "integer", "minimum": 0 }, "aggregate": { "type": "array", "items": { "type": "object", "additionalProperties": false, "properties": { "samples": { "type": "integer", "minimum": 0 }, "rms": { "type": "number" }, "rmsDbfs": { "type": "number" }, "peak": { "type": "number" }, "clippingProportion": { "type": "number" }, "zeroProportion": { "type": "number" }, "invalidSamples": { "type": "integer", "minimum": 0 } }, "required": ["samples", "rms", "rmsDbfs", "peak", "clippingProportion", "zeroProportion", "invalidSamples"] }, "maxItems": 8 }, "window": { "type": "array", "items": { "type": "object", "additionalProperties": false, "properties": { "samples": { "type": "integer", "minimum": 0 }, "rms": { "type": "number" }, "rmsDbfs": { "type": "number" }, "peak": { "type": "number" }, "clippingProportion": { "type": "number" }, "zeroProportion": { "type": "number" }, "invalidSamples": { "type": "integer", "minimum": 0 } }, "required": ["samples", "rms", "rmsDbfs", "peak", "clippingProportion", "zeroProportion", "invalidSamples"] }, "maxItems": 8 }, "discontinuities": { "type": "integer", "minimum": 0 }, "timestampErrors": { "type": "integer", "minimum": 0 }, "cleanup": { "type": "boolean" }, "engineConsumedFrames": { "type": ["integer", "null"], "minimum": 0 }, "elapsedMs": { "type": "integer", "minimum": 0, "maximum": 12e3 }, "sessionMute": { "type": ["boolean", "null"] }, "sessionLevel": { "type": ["number", "null"], "minimum": 0, "maximum": 1 }, "sessionVolumeError": { "type": ["string", "null"], "maxLength": 2048 }, "sessionVolumeObservedAt": { "type": ["string", "null"], "minLength": 20, "maxLength": 64, "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})$" }, "signalPeak": { "type": ["number", "null"], "minimum": 0, "maximum": 0.1 } }, "required": ["sessionId", "targetId", "mode", "status", "reason", "startedAt", "format", "frames", "aggregate", "window", "discontinuities", "timestampErrors", "cleanup"] }, "maxItems": 8 }, "repairs": { "type": "array", "items": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "integer", "minimum": 0 }, "targetId": { "type": "string", "maxLength": 2048 }, "approved": { "type": "boolean" }, "beforeMute": { "type": "boolean" }, "desiredMute": { "type": "boolean" }, "afterMute": { "type": ["boolean", "null"] }, "verified": { "type": "boolean" }, "rolledBack": { "type": "boolean" }, "status": { "type": "string", "maxLength": 2048 } }, "required": ["id", "targetId", "approved", "beforeMute", "desiredMute", "afterMute", "verified", "rolledBack", "status"] }, "maxItems": 8 }, "limitations": { "type": "array", "items": { "type": "string", "maxLength": 2048 }, "maxItems": 32 }, "routingReports": { "type": "array", "maxItems": 8, "items": { "type": "object", "additionalProperties": false, "properties": { "sessionId": { "type": "integer", "minimum": 1 }, "targetId": { "type": "string", "maxLength": 2048 }, "mode": { "enum": ["left", "right", "tone"] }, "observation": { "enum": ["left", "right", "both", "neither", "unsure"] } }, "required": ["sessionId", "targetId", "mode", "observation"] } }, "functionalVerification": { "anyOf": [{ "type": "null" }, { "type": "object", "additionalProperties": false, "properties": { "repairId": { "type": "integer", "minimum": 1 }, "beforeSessionId": { "anyOf": [{ "type": "integer", "minimum": 1 }, { "type": "null" }] }, "afterSessionId": { "anyOf": [{ "type": "integer", "minimum": 1 }, { "type": "null" }] }, "comparable": { "type": "boolean" }, "reason": { "type": "string", "maxLength": 2048 }, "changesDb": { "type": "array", "maxItems": 8, "items": { "type": "number" } }, "userOutcome": { "enum": ["unverified", "improved", "unchanged", "worse"] } }, "required": ["repairId", "beforeSessionId", "afterSessionId", "comparable", "reason", "changesDb", "userOutcome"] }] } }, "required": ["schemaVersion", "appVersion", "createdAt", "sanitized", "coverage", "scanComplete", "discoveryProvenance", "userAudioReport", "checks", "audioEndpoints", "audioSessions", "repairs", "limitations"], "$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "https://anydevice.local/diagnostic-engine.schema.json" };
var pattern12 = new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})$", "u");
function validate25(data: any, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {}): boolean {
  ;
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate25.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = void 0;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = void 0;
  }
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.schemaVersion === void 0 && (missing0 = "schemaVersion") || data.appVersion === void 0 && (missing0 = "appVersion") || data.createdAt === void 0 && (missing0 = "createdAt") || data.sanitized === void 0 && (missing0 = "sanitized") || data.coverage === void 0 && (missing0 = "coverage") || data.scanComplete === void 0 && (missing0 = "scanComplete") || data.discoveryProvenance === void 0 && (missing0 = "discoveryProvenance") || data.userAudioReport === void 0 && (missing0 = "userAudioReport") || data.checks === void 0 && (missing0 = "checks") || data.audioEndpoints === void 0 && (missing0 = "audioEndpoints") || data.audioSessions === void 0 && (missing0 = "audioSessions") || data.repairs === void 0 && (missing0 = "repairs") || data.limitations === void 0 && (missing0 = "limitations")) {
        validate25.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!func1.call(schema40.properties, key0)) {
            validate25.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.schemaVersion !== void 0) {
            const _errs2 = errors;
            if ("diagnostic-engine-1.0" !== data.schemaVersion) {
              validate25.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: "diagnostic-engine-1.0" }, message: "must be equal to constant" }];
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
                validate25.errors = [{ instancePath: instancePath + "/appVersion", schemaPath: "#/properties/appVersion/const", keyword: "const", params: { allowedValue: "0.2.0" }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.createdAt !== void 0) {
                let data2 = data.createdAt;
                const _errs4 = errors;
                if (errors === _errs4) {
                  if (typeof data2 === "string") {
                    if (func3(data2) > 100) {
                      validate25.errors = [{ instancePath: instancePath + "/createdAt", schemaPath: "#/properties/createdAt/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                      return false;
                    }
                  } else {
                    validate25.errors = [{ instancePath: instancePath + "/createdAt", schemaPath: "#/properties/createdAt/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                    return false;
                  }
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.sanitized !== void 0) {
                  const _errs6 = errors;
                  if (typeof data.sanitized !== "boolean") {
                    validate25.errors = [{ instancePath: instancePath + "/sanitized", schemaPath: "#/properties/sanitized/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                    return false;
                  }
                  var valid0 = _errs6 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.coverage !== void 0) {
                    let data4 = data.coverage;
                    const _errs8 = errors;
                    if (errors === _errs8) {
                      if (typeof data4 === "string") {
                        if (func3(data4) > 2048) {
                          validate25.errors = [{ instancePath: instancePath + "/coverage", schemaPath: "#/properties/coverage/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                          return false;
                        }
                      } else {
                        validate25.errors = [{ instancePath: instancePath + "/coverage", schemaPath: "#/properties/coverage/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.scanComplete !== void 0) {
                      const _errs10 = errors;
                      if (typeof data.scanComplete !== "boolean") {
                        validate25.errors = [{ instancePath: instancePath + "/scanComplete", schemaPath: "#/properties/scanComplete/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                        return false;
                      }
                      var valid0 = _errs10 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.discoveryProvenance !== void 0) {
                        let data6 = data.discoveryProvenance;
                        const _errs12 = errors;
                        const _errs13 = errors;
                        let valid1 = false;
                        const _errs14 = errors;
                        if (errors === _errs14) {
                          if (data6 && typeof data6 == "object" && !Array.isArray(data6)) {
                            let missing1;
                            if (data6.provider === void 0 && (missing1 = "provider") || data6.scope === void 0 && (missing1 = "scope") || data6.collectedAt === void 0 && (missing1 = "collectedAt")) {
                              const err0 = { instancePath: instancePath + "/discoveryProvenance", schemaPath: "#/properties/discoveryProvenance/anyOf/0/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" };
                              if (vErrors === null) {
                                vErrors = [err0];
                              } else {
                                vErrors.push(err0);
                              }
                              errors++;
                            } else {
                              const _errs16 = errors;
                              for (const key1 in data6) {
                                if (!(key1 === "provider" || key1 === "scope" || key1 === "collectedAt")) {
                                  const err1 = { instancePath: instancePath + "/discoveryProvenance", schemaPath: "#/properties/discoveryProvenance/anyOf/0/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" };
                                  if (vErrors === null) {
                                    vErrors = [err1];
                                  } else {
                                    vErrors.push(err1);
                                  }
                                  errors++;
                                  break;
                                }
                              }
                              if (_errs16 === errors) {
                                if (data6.provider !== void 0) {
                                  let data7 = data6.provider;
                                  const _errs17 = errors;
                                  if (errors === _errs17) {
                                    if (typeof data7 === "string") {
                                      if (func3(data7) > 2048) {
                                        const err2 = { instancePath: instancePath + "/discoveryProvenance/provider", schemaPath: "#/properties/discoveryProvenance/anyOf/0/properties/provider/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" };
                                        if (vErrors === null) {
                                          vErrors = [err2];
                                        } else {
                                          vErrors.push(err2);
                                        }
                                        errors++;
                                      }
                                    } else {
                                      const err3 = { instancePath: instancePath + "/discoveryProvenance/provider", schemaPath: "#/properties/discoveryProvenance/anyOf/0/properties/provider/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                      if (vErrors === null) {
                                        vErrors = [err3];
                                      } else {
                                        vErrors.push(err3);
                                      }
                                      errors++;
                                    }
                                  }
                                  var valid2 = _errs17 === errors;
                                } else {
                                  var valid2 = true;
                                }
                                if (valid2) {
                                  if (data6.scope !== void 0) {
                                    let data8 = data6.scope;
                                    const _errs19 = errors;
                                    if (errors === _errs19) {
                                      if (typeof data8 === "string") {
                                        if (func3(data8) > 2048) {
                                          const err4 = { instancePath: instancePath + "/discoveryProvenance/scope", schemaPath: "#/properties/discoveryProvenance/anyOf/0/properties/scope/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" };
                                          if (vErrors === null) {
                                            vErrors = [err4];
                                          } else {
                                            vErrors.push(err4);
                                          }
                                          errors++;
                                        }
                                      } else {
                                        const err5 = { instancePath: instancePath + "/discoveryProvenance/scope", schemaPath: "#/properties/discoveryProvenance/anyOf/0/properties/scope/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                        if (vErrors === null) {
                                          vErrors = [err5];
                                        } else {
                                          vErrors.push(err5);
                                        }
                                        errors++;
                                      }
                                    }
                                    var valid2 = _errs19 === errors;
                                  } else {
                                    var valid2 = true;
                                  }
                                  if (valid2) {
                                    if (data6.collectedAt !== void 0) {
                                      let data9 = data6.collectedAt;
                                      const _errs21 = errors;
                                      if (errors === _errs21) {
                                        if (typeof data9 === "string") {
                                          if (func3(data9) > 100) {
                                            const err6 = { instancePath: instancePath + "/discoveryProvenance/collectedAt", schemaPath: "#/properties/discoveryProvenance/anyOf/0/properties/collectedAt/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" };
                                            if (vErrors === null) {
                                              vErrors = [err6];
                                            } else {
                                              vErrors.push(err6);
                                            }
                                            errors++;
                                          }
                                        } else {
                                          const err7 = { instancePath: instancePath + "/discoveryProvenance/collectedAt", schemaPath: "#/properties/discoveryProvenance/anyOf/0/properties/collectedAt/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                          if (vErrors === null) {
                                            vErrors = [err7];
                                          } else {
                                            vErrors.push(err7);
                                          }
                                          errors++;
                                        }
                                      }
                                      var valid2 = _errs21 === errors;
                                    } else {
                                      var valid2 = true;
                                    }
                                  }
                                }
                              }
                            }
                          } else {
                            const err8 = { instancePath: instancePath + "/discoveryProvenance", schemaPath: "#/properties/discoveryProvenance/anyOf/0/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                            if (vErrors === null) {
                              vErrors = [err8];
                            } else {
                              vErrors.push(err8);
                            }
                            errors++;
                          }
                        }
                        var _valid0 = _errs14 === errors;
                        valid1 = valid1 || _valid0;
                        const _errs23 = errors;
                        if (data6 !== null) {
                          const err9 = { instancePath: instancePath + "/discoveryProvenance", schemaPath: "#/properties/discoveryProvenance/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                          if (vErrors === null) {
                            vErrors = [err9];
                          } else {
                            vErrors.push(err9);
                          }
                          errors++;
                        }
                        var _valid0 = _errs23 === errors;
                        valid1 = valid1 || _valid0;
                        if (!valid1) {
                          const err10 = { instancePath: instancePath + "/discoveryProvenance", schemaPath: "#/properties/discoveryProvenance/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                          if (vErrors === null) {
                            vErrors = [err10];
                          } else {
                            vErrors.push(err10);
                          }
                          errors++;
                          validate25.errors = vErrors;
                          return false;
                        } else {
                          errors = _errs13;
                          if (vErrors !== null) {
                            if (_errs13) {
                              vErrors.length = _errs13;
                            } else {
                              vErrors = null;
                            }
                          }
                        }
                        var valid0 = _errs12 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.userAudioReport !== void 0) {
                          let data10 = data.userAudioReport;
                          const _errs25 = errors;
                          const _errs26 = errors;
                          let valid3 = false;
                          const _errs27 = errors;
                          if (errors === _errs27) {
                            if (data10 && typeof data10 == "object" && !Array.isArray(data10)) {
                              let missing2;
                              if (data10.sessionId === void 0 && (missing2 = "sessionId") || data10.heardExpected === void 0 && (missing2 = "heardExpected") || data10.staticReported === void 0 && (missing2 = "staticReported")) {
                                const err11 = { instancePath: instancePath + "/userAudioReport", schemaPath: "#/properties/userAudioReport/anyOf/0/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" };
                                if (vErrors === null) {
                                  vErrors = [err11];
                                } else {
                                  vErrors.push(err11);
                                }
                                errors++;
                              } else {
                                const _errs29 = errors;
                                for (const key2 in data10) {
                                  if (!(key2 === "sessionId" || key2 === "heardExpected" || key2 === "staticReported")) {
                                    const err12 = { instancePath: instancePath + "/userAudioReport", schemaPath: "#/properties/userAudioReport/anyOf/0/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" };
                                    if (vErrors === null) {
                                      vErrors = [err12];
                                    } else {
                                      vErrors.push(err12);
                                    }
                                    errors++;
                                    break;
                                  }
                                }
                                if (_errs29 === errors) {
                                  if (data10.sessionId !== void 0) {
                                    let data11 = data10.sessionId;
                                    const _errs30 = errors;
                                    const _errs31 = errors;
                                    let valid5 = false;
                                    const _errs32 = errors;
                                    if (!(typeof data11 == "number" && (!(data11 % 1) && !isNaN(data11)) && isFinite(data11))) {
                                      const err13 = { instancePath: instancePath + "/userAudioReport/sessionId", schemaPath: "#/properties/userAudioReport/anyOf/0/properties/sessionId/anyOf/0/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                      if (vErrors === null) {
                                        vErrors = [err13];
                                      } else {
                                        vErrors.push(err13);
                                      }
                                      errors++;
                                    }
                                    if (errors === _errs32) {
                                      if (typeof data11 == "number" && isFinite(data11)) {
                                        if (data11 < 1 || isNaN(data11)) {
                                          const err14 = { instancePath: instancePath + "/userAudioReport/sessionId", schemaPath: "#/properties/userAudioReport/anyOf/0/properties/sessionId/anyOf/0/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" };
                                          if (vErrors === null) {
                                            vErrors = [err14];
                                          } else {
                                            vErrors.push(err14);
                                          }
                                          errors++;
                                        }
                                      }
                                    }
                                    var _valid2 = _errs32 === errors;
                                    valid5 = valid5 || _valid2;
                                    const _errs34 = errors;
                                    if (data11 !== null) {
                                      const err15 = { instancePath: instancePath + "/userAudioReport/sessionId", schemaPath: "#/properties/userAudioReport/anyOf/0/properties/sessionId/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                      if (vErrors === null) {
                                        vErrors = [err15];
                                      } else {
                                        vErrors.push(err15);
                                      }
                                      errors++;
                                    }
                                    var _valid2 = _errs34 === errors;
                                    valid5 = valid5 || _valid2;
                                    if (!valid5) {
                                      const err16 = { instancePath: instancePath + "/userAudioReport/sessionId", schemaPath: "#/properties/userAudioReport/anyOf/0/properties/sessionId/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                      if (vErrors === null) {
                                        vErrors = [err16];
                                      } else {
                                        vErrors.push(err16);
                                      }
                                      errors++;
                                    } else {
                                      errors = _errs31;
                                      if (vErrors !== null) {
                                        if (_errs31) {
                                          vErrors.length = _errs31;
                                        } else {
                                          vErrors = null;
                                        }
                                      }
                                    }
                                    var valid4 = _errs30 === errors;
                                  } else {
                                    var valid4 = true;
                                  }
                                  if (valid4) {
                                    if (data10.heardExpected !== void 0) {
                                      let data12 = data10.heardExpected;
                                      const _errs36 = errors;
                                      if (!(data12 === "yes" || data12 === "no" || data12 === "unknown")) {
                                        const err17 = { instancePath: instancePath + "/userAudioReport/heardExpected", schemaPath: "#/properties/userAudioReport/anyOf/0/properties/heardExpected/enum", keyword: "enum", params: { allowedValues: schema40.properties.userAudioReport.anyOf[0].properties.heardExpected.enum }, message: "must be equal to one of the allowed values" };
                                        if (vErrors === null) {
                                          vErrors = [err17];
                                        } else {
                                          vErrors.push(err17);
                                        }
                                        errors++;
                                      }
                                      var valid4 = _errs36 === errors;
                                    } else {
                                      var valid4 = true;
                                    }
                                    if (valid4) {
                                      if (data10.staticReported !== void 0) {
                                        let data13 = data10.staticReported;
                                        const _errs37 = errors;
                                        if (typeof data13 !== "boolean" && data13 !== null) {
                                          const err18 = { instancePath: instancePath + "/userAudioReport/staticReported", schemaPath: "#/properties/userAudioReport/anyOf/0/properties/staticReported/type", keyword: "type", params: { type: schema40.properties.userAudioReport.anyOf[0].properties.staticReported.type }, message: "must be boolean,null" };
                                          if (vErrors === null) {
                                            vErrors = [err18];
                                          } else {
                                            vErrors.push(err18);
                                          }
                                          errors++;
                                        }
                                        var valid4 = _errs37 === errors;
                                      } else {
                                        var valid4 = true;
                                      }
                                    }
                                  }
                                }
                              }
                            } else {
                              const err19 = { instancePath: instancePath + "/userAudioReport", schemaPath: "#/properties/userAudioReport/anyOf/0/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                              if (vErrors === null) {
                                vErrors = [err19];
                              } else {
                                vErrors.push(err19);
                              }
                              errors++;
                            }
                          }
                          var _valid1 = _errs27 === errors;
                          valid3 = valid3 || _valid1;
                          const _errs39 = errors;
                          if (data10 !== null) {
                            const err20 = { instancePath: instancePath + "/userAudioReport", schemaPath: "#/properties/userAudioReport/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                            if (vErrors === null) {
                              vErrors = [err20];
                            } else {
                              vErrors.push(err20);
                            }
                            errors++;
                          }
                          var _valid1 = _errs39 === errors;
                          valid3 = valid3 || _valid1;
                          if (!valid3) {
                            const err21 = { instancePath: instancePath + "/userAudioReport", schemaPath: "#/properties/userAudioReport/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                            if (vErrors === null) {
                              vErrors = [err21];
                            } else {
                              vErrors.push(err21);
                            }
                            errors++;
                            validate25.errors = vErrors;
                            return false;
                          } else {
                            errors = _errs26;
                            if (vErrors !== null) {
                              if (_errs26) {
                                vErrors.length = _errs26;
                              } else {
                                vErrors = null;
                              }
                            }
                          }
                          var valid0 = _errs25 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.checks !== void 0) {
                            let data14 = data.checks;
                            const _errs41 = errors;
                            if (errors === _errs41) {
                              if (Array.isArray(data14)) {
                                if (data14.length > 8192) {
                                  validate25.errors = [{ instancePath: instancePath + "/checks", schemaPath: "#/properties/checks/maxItems", keyword: "maxItems", params: { limit: 8192 }, message: "must NOT have more than 8192 items" }];
                                  return false;
                                } else {
                                  var valid6 = true;
                                  const len0 = data14.length;
                                  for (let i0 = 0; i0 < len0; i0++) {
                                    let data15 = data14[i0];
                                    const _errs43 = errors;
                                    if (errors === _errs43) {
                                      if (data15 && typeof data15 == "object" && !Array.isArray(data15)) {
                                        let missing3;
                                        if (data15.id === void 0 && (missing3 = "id") || data15.target === void 0 && (missing3 = "target") || data15.test === void 0 && (missing3 = "test") || data15.outcome === void 0 && (missing3 = "outcome") || data15.confidence === void 0 && (missing3 = "confidence") || data15.measurements === void 0 && (missing3 = "measurements") || data15.conclusion === void 0 && (missing3 = "conclusion") || data15.nextStep === void 0 && (missing3 = "nextStep") || data15.hypotheses === void 0 && (missing3 = "hypotheses")) {
                                          validate25.errors = [{ instancePath: instancePath + "/checks/" + i0, schemaPath: "#/properties/checks/items/required", keyword: "required", params: { missingProperty: missing3 }, message: "must have required property '" + missing3 + "'" }];
                                          return false;
                                        } else {
                                          const _errs45 = errors;
                                          for (const key3 in data15) {
                                            if (!func1.call(schema40.properties.checks.items.properties, key3)) {
                                              validate25.errors = [{ instancePath: instancePath + "/checks/" + i0, schemaPath: "#/properties/checks/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties" }];
                                              return false;
                                              break;
                                            }
                                          }
                                          if (_errs45 === errors) {
                                            if (data15.id !== void 0) {
                                              let data16 = data15.id;
                                              const _errs46 = errors;
                                              if (errors === _errs46) {
                                                if (typeof data16 === "string") {
                                                  if (func3(data16) > 8192) {
                                                    validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/id", schemaPath: "#/properties/checks/items/properties/id/maxLength", keyword: "maxLength", params: { limit: 8192 }, message: "must NOT have more than 8192 characters" }];
                                                    return false;
                                                  }
                                                } else {
                                                  validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/id", schemaPath: "#/properties/checks/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                  return false;
                                                }
                                              }
                                              var valid7 = _errs46 === errors;
                                            } else {
                                              var valid7 = true;
                                            }
                                            if (valid7) {
                                              if (data15.target !== void 0) {
                                                let data17 = data15.target;
                                                const _errs48 = errors;
                                                if (errors === _errs48) {
                                                  if (typeof data17 === "string") {
                                                    if (func3(data17) > 8192) {
                                                      validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/target", schemaPath: "#/properties/checks/items/properties/target/maxLength", keyword: "maxLength", params: { limit: 8192 }, message: "must NOT have more than 8192 characters" }];
                                                      return false;
                                                    }
                                                  } else {
                                                    validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/target", schemaPath: "#/properties/checks/items/properties/target/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                    return false;
                                                  }
                                                }
                                                var valid7 = _errs48 === errors;
                                              } else {
                                                var valid7 = true;
                                              }
                                              if (valid7) {
                                                if (data15.test !== void 0) {
                                                  let data18 = data15.test;
                                                  const _errs50 = errors;
                                                  if (errors === _errs50) {
                                                    if (typeof data18 === "string") {
                                                      if (func3(data18) > 2048) {
                                                        validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/test", schemaPath: "#/properties/checks/items/properties/test/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                        return false;
                                                      }
                                                    } else {
                                                      validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/test", schemaPath: "#/properties/checks/items/properties/test/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                      return false;
                                                    }
                                                  }
                                                  var valid7 = _errs50 === errors;
                                                } else {
                                                  var valid7 = true;
                                                }
                                                if (valid7) {
                                                  if (data15.outcome !== void 0) {
                                                    let data19 = data15.outcome;
                                                    const _errs52 = errors;
                                                    if (!(data19 === "Passed" || data19 === "Issue detected" || data19 === "Inconclusive" || data19 === "Not supported" || data19 === "Not tested" || data19 === "Cancelled or interrupted" || data19 === "Warning" || data19 === "Skipped")) {
                                                      validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/outcome", schemaPath: "#/properties/checks/items/properties/outcome/enum", keyword: "enum", params: { allowedValues: schema40.properties.checks.items.properties.outcome.enum }, message: "must be equal to one of the allowed values" }];
                                                      return false;
                                                    }
                                                    var valid7 = _errs52 === errors;
                                                  } else {
                                                    var valid7 = true;
                                                  }
                                                  if (valid7) {
                                                    if (data15.confidence !== void 0) {
                                                      let data20 = data15.confidence;
                                                      const _errs53 = errors;
                                                      if (!(data20 === "Windows-reported" || data20 === "Measured" || data20 === "User-reported" || data20 === "Limited")) {
                                                        validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/confidence", schemaPath: "#/properties/checks/items/properties/confidence/enum", keyword: "enum", params: { allowedValues: schema40.properties.checks.items.properties.confidence.enum }, message: "must be equal to one of the allowed values" }];
                                                        return false;
                                                      }
                                                      var valid7 = _errs53 === errors;
                                                    } else {
                                                      var valid7 = true;
                                                    }
                                                    if (valid7) {
                                                      if (data15.measurements !== void 0) {
                                                        let data21 = data15.measurements;
                                                        const _errs54 = errors;
                                                        if (errors === _errs54) {
                                                          if (data21 && typeof data21 == "object" && !Array.isArray(data21)) {
                                                            if (Object.keys(data21).length > 32) {
                                                              validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/measurements", schemaPath: "#/properties/checks/items/properties/measurements/maxProperties", keyword: "maxProperties", params: { limit: 32 }, message: "must NOT have more than 32 properties" }];
                                                              return false;
                                                            } else {
                                                              for (const key4 in data21) {
                                                                let data22 = data21[key4];
                                                                const _errs57 = errors;
                                                                const _errs58 = errors;
                                                                let valid9 = false;
                                                                const _errs59 = errors;
                                                                if (errors === _errs59) {
                                                                  if (typeof data22 === "string") {
                                                                    if (func3(data22) > 2048) {
                                                                      const err22 = { instancePath: instancePath + "/checks/" + i0 + "/measurements/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/checks/items/properties/measurements/additionalProperties/anyOf/0/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err22];
                                                                      } else {
                                                                        vErrors.push(err22);
                                                                      }
                                                                      errors++;
                                                                    }
                                                                  } else {
                                                                    const err23 = { instancePath: instancePath + "/checks/" + i0 + "/measurements/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/checks/items/properties/measurements/additionalProperties/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err23];
                                                                    } else {
                                                                      vErrors.push(err23);
                                                                    }
                                                                    errors++;
                                                                  }
                                                                }
                                                                var _valid3 = _errs59 === errors;
                                                                valid9 = valid9 || _valid3;
                                                                const _errs61 = errors;
                                                                if (!(typeof data22 == "number" && isFinite(data22))) {
                                                                  const err24 = { instancePath: instancePath + "/checks/" + i0 + "/measurements/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/checks/items/properties/measurements/additionalProperties/anyOf/1/type", keyword: "type", params: { type: "number" }, message: "must be number" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err24];
                                                                  } else {
                                                                    vErrors.push(err24);
                                                                  }
                                                                  errors++;
                                                                }
                                                                var _valid3 = _errs61 === errors;
                                                                valid9 = valid9 || _valid3;
                                                                const _errs63 = errors;
                                                                if (typeof data22 !== "boolean") {
                                                                  const err25 = { instancePath: instancePath + "/checks/" + i0 + "/measurements/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/checks/items/properties/measurements/additionalProperties/anyOf/2/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err25];
                                                                  } else {
                                                                    vErrors.push(err25);
                                                                  }
                                                                  errors++;
                                                                }
                                                                var _valid3 = _errs63 === errors;
                                                                valid9 = valid9 || _valid3;
                                                                const _errs65 = errors;
                                                                if (data22 !== null) {
                                                                  const err26 = { instancePath: instancePath + "/checks/" + i0 + "/measurements/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/checks/items/properties/measurements/additionalProperties/anyOf/3/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err26];
                                                                  } else {
                                                                    vErrors.push(err26);
                                                                  }
                                                                  errors++;
                                                                }
                                                                var _valid3 = _errs65 === errors;
                                                                valid9 = valid9 || _valid3;
                                                                if (!valid9) {
                                                                  const err27 = { instancePath: instancePath + "/checks/" + i0 + "/measurements/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/checks/items/properties/measurements/additionalProperties/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err27];
                                                                  } else {
                                                                    vErrors.push(err27);
                                                                  }
                                                                  errors++;
                                                                  validate25.errors = vErrors;
                                                                  return false;
                                                                } else {
                                                                  errors = _errs58;
                                                                  if (vErrors !== null) {
                                                                    if (_errs58) {
                                                                      vErrors.length = _errs58;
                                                                    } else {
                                                                      vErrors = null;
                                                                    }
                                                                  }
                                                                }
                                                                var valid8 = _errs57 === errors;
                                                                if (!valid8) {
                                                                  break;
                                                                }
                                                              }
                                                            }
                                                          } else {
                                                            validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/measurements", schemaPath: "#/properties/checks/items/properties/measurements/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                            return false;
                                                          }
                                                        }
                                                        var valid7 = _errs54 === errors;
                                                      } else {
                                                        var valid7 = true;
                                                      }
                                                      if (valid7) {
                                                        if (data15.conclusion !== void 0) {
                                                          let data23 = data15.conclusion;
                                                          const _errs67 = errors;
                                                          if (errors === _errs67) {
                                                            if (typeof data23 === "string") {
                                                              if (func3(data23) > 2048) {
                                                                validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/conclusion", schemaPath: "#/properties/checks/items/properties/conclusion/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                return false;
                                                              }
                                                            } else {
                                                              validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/conclusion", schemaPath: "#/properties/checks/items/properties/conclusion/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                              return false;
                                                            }
                                                          }
                                                          var valid7 = _errs67 === errors;
                                                        } else {
                                                          var valid7 = true;
                                                        }
                                                        if (valid7) {
                                                          if (data15.nextStep !== void 0) {
                                                            let data24 = data15.nextStep;
                                                            const _errs69 = errors;
                                                            if (errors === _errs69) {
                                                              if (typeof data24 === "string") {
                                                                if (func3(data24) > 2048) {
                                                                  validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/nextStep", schemaPath: "#/properties/checks/items/properties/nextStep/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                  return false;
                                                                }
                                                              } else {
                                                                validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/nextStep", schemaPath: "#/properties/checks/items/properties/nextStep/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                return false;
                                                              }
                                                            }
                                                            var valid7 = _errs69 === errors;
                                                          } else {
                                                            var valid7 = true;
                                                          }
                                                          if (valid7) {
                                                            if (data15.hypotheses !== void 0) {
                                                              let data25 = data15.hypotheses;
                                                              const _errs71 = errors;
                                                              if (errors === _errs71) {
                                                                if (Array.isArray(data25)) {
                                                                  if (data25.length > 16) {
                                                                    validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses", schemaPath: "#/properties/checks/items/properties/hypotheses/maxItems", keyword: "maxItems", params: { limit: 16 }, message: "must NOT have more than 16 items" }];
                                                                    return false;
                                                                  } else {
                                                                    var valid10 = true;
                                                                    const len1 = data25.length;
                                                                    for (let i1 = 0; i1 < len1; i1++) {
                                                                      let data26 = data25[i1];
                                                                      const _errs73 = errors;
                                                                      if (errors === _errs73) {
                                                                        if (data26 && typeof data26 == "object" && !Array.isArray(data26)) {
                                                                          let missing4;
                                                                          if (data26.cause === void 0 && (missing4 = "cause") || data26.confidence === void 0 && (missing4 = "confidence") || data26.distinguishingTest === void 0 && (missing4 = "distinguishingTest")) {
                                                                            validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1, schemaPath: "#/properties/checks/items/properties/hypotheses/items/required", keyword: "required", params: { missingProperty: missing4 }, message: "must have required property '" + missing4 + "'" }];
                                                                            return false;
                                                                          } else {
                                                                            const _errs75 = errors;
                                                                            for (const key5 in data26) {
                                                                              if (!(key5 === "cause" || key5 === "confidence" || key5 === "distinguishingTest" || key5 === "supportingEvidence" || key5 === "contradictingEvidence" || key5 === "verificationCriterion")) {
                                                                                validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1, schemaPath: "#/properties/checks/items/properties/hypotheses/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key5 }, message: "must NOT have additional properties" }];
                                                                                return false;
                                                                                break;
                                                                              }
                                                                            }
                                                                            if (_errs75 === errors) {
                                                                              if (data26.cause !== void 0) {
                                                                                let data27 = data26.cause;
                                                                                const _errs76 = errors;
                                                                                if (errors === _errs76) {
                                                                                  if (typeof data27 === "string") {
                                                                                    if (func3(data27) > 2048) {
                                                                                      validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1 + "/cause", schemaPath: "#/properties/checks/items/properties/hypotheses/items/properties/cause/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                      return false;
                                                                                    }
                                                                                  } else {
                                                                                    validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1 + "/cause", schemaPath: "#/properties/checks/items/properties/hypotheses/items/properties/cause/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                    return false;
                                                                                  }
                                                                                }
                                                                                var valid11 = _errs76 === errors;
                                                                              } else {
                                                                                var valid11 = true;
                                                                              }
                                                                              if (valid11) {
                                                                                if (data26.confidence !== void 0) {
                                                                                  let data28 = data26.confidence;
                                                                                  const _errs78 = errors;
                                                                                  if (!(data28 === "Confirmed configuration" || data28 === "Possible" || data28 === "Insufficient evidence")) {
                                                                                    validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1 + "/confidence", schemaPath: "#/properties/checks/items/properties/hypotheses/items/properties/confidence/enum", keyword: "enum", params: { allowedValues: schema40.properties.checks.items.properties.hypotheses.items.properties.confidence.enum }, message: "must be equal to one of the allowed values" }];
                                                                                    return false;
                                                                                  }
                                                                                  var valid11 = _errs78 === errors;
                                                                                } else {
                                                                                  var valid11 = true;
                                                                                }
                                                                                if (valid11) {
                                                                                  if (data26.distinguishingTest !== void 0) {
                                                                                    let data29 = data26.distinguishingTest;
                                                                                    const _errs79 = errors;
                                                                                    if (errors === _errs79) {
                                                                                      if (typeof data29 === "string") {
                                                                                        if (func3(data29) > 2048) {
                                                                                          validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1 + "/distinguishingTest", schemaPath: "#/properties/checks/items/properties/hypotheses/items/properties/distinguishingTest/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                          return false;
                                                                                        }
                                                                                      } else {
                                                                                        validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1 + "/distinguishingTest", schemaPath: "#/properties/checks/items/properties/hypotheses/items/properties/distinguishingTest/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                        return false;
                                                                                      }
                                                                                    }
                                                                                    var valid11 = _errs79 === errors;
                                                                                  } else {
                                                                                    var valid11 = true;
                                                                                  }
                                                                                  if (valid11) {
                                                                                    if (data26.supportingEvidence !== void 0) {
                                                                                      let data30 = data26.supportingEvidence;
                                                                                      const _errs81 = errors;
                                                                                      if (errors === _errs81) {
                                                                                        if (Array.isArray(data30)) {
                                                                                          if (data30.length > 32) {
                                                                                            validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1 + "/supportingEvidence", schemaPath: "#/properties/checks/items/properties/hypotheses/items/properties/supportingEvidence/maxItems", keyword: "maxItems", params: { limit: 32 }, message: "must NOT have more than 32 items" }];
                                                                                            return false;
                                                                                          } else {
                                                                                            var valid12 = true;
                                                                                            const len2 = data30.length;
                                                                                            for (let i2 = 0; i2 < len2; i2++) {
                                                                                              let data31 = data30[i2];
                                                                                              const _errs83 = errors;
                                                                                              if (errors === _errs83) {
                                                                                                if (typeof data31 === "string") {
                                                                                                  if (func3(data31) > 2048) {
                                                                                                    validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1 + "/supportingEvidence/" + i2, schemaPath: "#/properties/checks/items/properties/hypotheses/items/properties/supportingEvidence/items/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                                    return false;
                                                                                                  }
                                                                                                } else {
                                                                                                  validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1 + "/supportingEvidence/" + i2, schemaPath: "#/properties/checks/items/properties/hypotheses/items/properties/supportingEvidence/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                  return false;
                                                                                                }
                                                                                              }
                                                                                              var valid12 = _errs83 === errors;
                                                                                              if (!valid12) {
                                                                                                break;
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        } else {
                                                                                          validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1 + "/supportingEvidence", schemaPath: "#/properties/checks/items/properties/hypotheses/items/properties/supportingEvidence/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                          return false;
                                                                                        }
                                                                                      }
                                                                                      var valid11 = _errs81 === errors;
                                                                                    } else {
                                                                                      var valid11 = true;
                                                                                    }
                                                                                    if (valid11) {
                                                                                      if (data26.contradictingEvidence !== void 0) {
                                                                                        let data32 = data26.contradictingEvidence;
                                                                                        const _errs85 = errors;
                                                                                        if (errors === _errs85) {
                                                                                          if (Array.isArray(data32)) {
                                                                                            if (data32.length > 32) {
                                                                                              validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1 + "/contradictingEvidence", schemaPath: "#/properties/checks/items/properties/hypotheses/items/properties/contradictingEvidence/maxItems", keyword: "maxItems", params: { limit: 32 }, message: "must NOT have more than 32 items" }];
                                                                                              return false;
                                                                                            } else {
                                                                                              var valid13 = true;
                                                                                              const len3 = data32.length;
                                                                                              for (let i3 = 0; i3 < len3; i3++) {
                                                                                                let data33 = data32[i3];
                                                                                                const _errs87 = errors;
                                                                                                if (errors === _errs87) {
                                                                                                  if (typeof data33 === "string") {
                                                                                                    if (func3(data33) > 2048) {
                                                                                                      validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1 + "/contradictingEvidence/" + i3, schemaPath: "#/properties/checks/items/properties/hypotheses/items/properties/contradictingEvidence/items/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                                      return false;
                                                                                                    }
                                                                                                  } else {
                                                                                                    validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1 + "/contradictingEvidence/" + i3, schemaPath: "#/properties/checks/items/properties/hypotheses/items/properties/contradictingEvidence/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                    return false;
                                                                                                  }
                                                                                                }
                                                                                                var valid13 = _errs87 === errors;
                                                                                                if (!valid13) {
                                                                                                  break;
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          } else {
                                                                                            validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1 + "/contradictingEvidence", schemaPath: "#/properties/checks/items/properties/hypotheses/items/properties/contradictingEvidence/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                            return false;
                                                                                          }
                                                                                        }
                                                                                        var valid11 = _errs85 === errors;
                                                                                      } else {
                                                                                        var valid11 = true;
                                                                                      }
                                                                                      if (valid11) {
                                                                                        if (data26.verificationCriterion !== void 0) {
                                                                                          let data34 = data26.verificationCriterion;
                                                                                          const _errs89 = errors;
                                                                                          if (errors === _errs89) {
                                                                                            if (typeof data34 === "string") {
                                                                                              if (func3(data34) > 2048) {
                                                                                                validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1 + "/verificationCriterion", schemaPath: "#/properties/checks/items/properties/hypotheses/items/properties/verificationCriterion/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                                return false;
                                                                                              }
                                                                                            } else {
                                                                                              validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1 + "/verificationCriterion", schemaPath: "#/properties/checks/items/properties/hypotheses/items/properties/verificationCriterion/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                              return false;
                                                                                            }
                                                                                          }
                                                                                          var valid11 = _errs89 === errors;
                                                                                        } else {
                                                                                          var valid11 = true;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        } else {
                                                                          validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses/" + i1, schemaPath: "#/properties/checks/items/properties/hypotheses/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                                          return false;
                                                                        }
                                                                      }
                                                                      var valid10 = _errs73 === errors;
                                                                      if (!valid10) {
                                                                        break;
                                                                      }
                                                                    }
                                                                  }
                                                                } else {
                                                                  validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/hypotheses", schemaPath: "#/properties/checks/items/properties/hypotheses/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                  return false;
                                                                }
                                                              }
                                                              var valid7 = _errs71 === errors;
                                                            } else {
                                                              var valid7 = true;
                                                            }
                                                            if (valid7) {
                                                              if (data15.definitionId !== void 0) {
                                                                let data35 = data15.definitionId;
                                                                const _errs91 = errors;
                                                                if (errors === _errs91) {
                                                                  if (typeof data35 === "string") {
                                                                    if (func3(data35) > 2048) {
                                                                      validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/definitionId", schemaPath: "#/properties/checks/items/properties/definitionId/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                      return false;
                                                                    }
                                                                  } else {
                                                                    validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/definitionId", schemaPath: "#/properties/checks/items/properties/definitionId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                    return false;
                                                                  }
                                                                }
                                                                var valid7 = _errs91 === errors;
                                                              } else {
                                                                var valid7 = true;
                                                              }
                                                              if (valid7) {
                                                                if (data15.checkVersion !== void 0) {
                                                                  const _errs93 = errors;
                                                                  if (1 !== data15.checkVersion) {
                                                                    validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/checkVersion", schemaPath: "#/properties/checks/items/properties/checkVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                                                                    return false;
                                                                  }
                                                                  var valid7 = _errs93 === errors;
                                                                } else {
                                                                  var valid7 = true;
                                                                }
                                                                if (valid7) {
                                                                  if (data15.category !== void 0) {
                                                                    let data37 = data15.category;
                                                                    const _errs94 = errors;
                                                                    if (!(data37 === "audio" || data37 === "input-and-protocol" || data37 === "inventory")) {
                                                                      validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/category", schemaPath: "#/properties/checks/items/properties/category/enum", keyword: "enum", params: { allowedValues: schema40.properties.checks.items.properties.category.enum }, message: "must be equal to one of the allowed values" }];
                                                                      return false;
                                                                    }
                                                                    var valid7 = _errs94 === errors;
                                                                  } else {
                                                                    var valid7 = true;
                                                                  }
                                                                  if (valid7) {
                                                                    if (data15.preconditions !== void 0) {
                                                                      let data38 = data15.preconditions;
                                                                      const _errs95 = errors;
                                                                      if (errors === _errs95) {
                                                                        if (Array.isArray(data38)) {
                                                                          if (data38.length > 64) {
                                                                            validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/preconditions", schemaPath: "#/properties/checks/items/properties/preconditions/maxItems", keyword: "maxItems", params: { limit: 64 }, message: "must NOT have more than 64 items" }];
                                                                            return false;
                                                                          } else {
                                                                            var valid14 = true;
                                                                            const len4 = data38.length;
                                                                            for (let i4 = 0; i4 < len4; i4++) {
                                                                              let data39 = data38[i4];
                                                                              const _errs97 = errors;
                                                                              if (errors === _errs97) {
                                                                                if (typeof data39 === "string") {
                                                                                  if (func3(data39) > 2048) {
                                                                                    validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/preconditions/" + i4, schemaPath: "#/properties/checks/items/properties/preconditions/items/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                    return false;
                                                                                  }
                                                                                } else {
                                                                                  validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/preconditions/" + i4, schemaPath: "#/properties/checks/items/properties/preconditions/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                  return false;
                                                                                }
                                                                              }
                                                                              var valid14 = _errs97 === errors;
                                                                              if (!valid14) {
                                                                                break;
                                                                              }
                                                                            }
                                                                          }
                                                                        } else {
                                                                          validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/preconditions", schemaPath: "#/properties/checks/items/properties/preconditions/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                          return false;
                                                                        }
                                                                      }
                                                                      var valid7 = _errs95 === errors;
                                                                    } else {
                                                                      var valid7 = true;
                                                                    }
                                                                    if (valid7) {
                                                                      if (data15.evidenceSource !== void 0) {
                                                                        let data40 = data15.evidenceSource;
                                                                        const _errs99 = errors;
                                                                        if (errors === _errs99) {
                                                                          if (typeof data40 === "string") {
                                                                            if (func3(data40) > 2048) {
                                                                              validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/evidenceSource", schemaPath: "#/properties/checks/items/properties/evidenceSource/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                              return false;
                                                                            }
                                                                          } else {
                                                                            validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/evidenceSource", schemaPath: "#/properties/checks/items/properties/evidenceSource/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                            return false;
                                                                          }
                                                                        }
                                                                        var valid7 = _errs99 === errors;
                                                                      } else {
                                                                        var valid7 = true;
                                                                      }
                                                                      if (valid7) {
                                                                        if (data15.confidenceRationale !== void 0) {
                                                                          let data41 = data15.confidenceRationale;
                                                                          const _errs101 = errors;
                                                                          if (errors === _errs101) {
                                                                            if (typeof data41 === "string") {
                                                                              if (func3(data41) > 2048) {
                                                                                validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/confidenceRationale", schemaPath: "#/properties/checks/items/properties/confidenceRationale/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                return false;
                                                                              }
                                                                            } else {
                                                                              validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/confidenceRationale", schemaPath: "#/properties/checks/items/properties/confidenceRationale/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                              return false;
                                                                            }
                                                                          }
                                                                          var valid7 = _errs101 === errors;
                                                                        } else {
                                                                          var valid7 = true;
                                                                        }
                                                                        if (valid7) {
                                                                          if (data15.supportingEvidence !== void 0) {
                                                                            let data42 = data15.supportingEvidence;
                                                                            const _errs103 = errors;
                                                                            if (errors === _errs103) {
                                                                              if (Array.isArray(data42)) {
                                                                                if (data42.length > 64) {
                                                                                  validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/supportingEvidence", schemaPath: "#/properties/checks/items/properties/supportingEvidence/maxItems", keyword: "maxItems", params: { limit: 64 }, message: "must NOT have more than 64 items" }];
                                                                                  return false;
                                                                                } else {
                                                                                  var valid15 = true;
                                                                                  const len5 = data42.length;
                                                                                  for (let i5 = 0; i5 < len5; i5++) {
                                                                                    let data43 = data42[i5];
                                                                                    const _errs105 = errors;
                                                                                    if (errors === _errs105) {
                                                                                      if (typeof data43 === "string") {
                                                                                        if (func3(data43) > 2048) {
                                                                                          validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/supportingEvidence/" + i5, schemaPath: "#/properties/checks/items/properties/supportingEvidence/items/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                          return false;
                                                                                        }
                                                                                      } else {
                                                                                        validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/supportingEvidence/" + i5, schemaPath: "#/properties/checks/items/properties/supportingEvidence/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                        return false;
                                                                                      }
                                                                                    }
                                                                                    var valid15 = _errs105 === errors;
                                                                                    if (!valid15) {
                                                                                      break;
                                                                                    }
                                                                                  }
                                                                                }
                                                                              } else {
                                                                                validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/supportingEvidence", schemaPath: "#/properties/checks/items/properties/supportingEvidence/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                return false;
                                                                              }
                                                                            }
                                                                            var valid7 = _errs103 === errors;
                                                                          } else {
                                                                            var valid7 = true;
                                                                          }
                                                                          if (valid7) {
                                                                            if (data15.contradictingEvidence !== void 0) {
                                                                              let data44 = data15.contradictingEvidence;
                                                                              const _errs107 = errors;
                                                                              if (errors === _errs107) {
                                                                                if (Array.isArray(data44)) {
                                                                                  if (data44.length > 64) {
                                                                                    validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/contradictingEvidence", schemaPath: "#/properties/checks/items/properties/contradictingEvidence/maxItems", keyword: "maxItems", params: { limit: 64 }, message: "must NOT have more than 64 items" }];
                                                                                    return false;
                                                                                  } else {
                                                                                    var valid16 = true;
                                                                                    const len6 = data44.length;
                                                                                    for (let i6 = 0; i6 < len6; i6++) {
                                                                                      let data45 = data44[i6];
                                                                                      const _errs109 = errors;
                                                                                      if (errors === _errs109) {
                                                                                        if (typeof data45 === "string") {
                                                                                          if (func3(data45) > 2048) {
                                                                                            validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/contradictingEvidence/" + i6, schemaPath: "#/properties/checks/items/properties/contradictingEvidence/items/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                            return false;
                                                                                          }
                                                                                        } else {
                                                                                          validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/contradictingEvidence/" + i6, schemaPath: "#/properties/checks/items/properties/contradictingEvidence/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                          return false;
                                                                                        }
                                                                                      }
                                                                                      var valid16 = _errs109 === errors;
                                                                                      if (!valid16) {
                                                                                        break;
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                } else {
                                                                                  validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/contradictingEvidence", schemaPath: "#/properties/checks/items/properties/contradictingEvidence/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                  return false;
                                                                                }
                                                                              }
                                                                              var valid7 = _errs107 === errors;
                                                                            } else {
                                                                              var valid7 = true;
                                                                            }
                                                                            if (valid7) {
                                                                              if (data15.unknowns !== void 0) {
                                                                                let data46 = data15.unknowns;
                                                                                const _errs111 = errors;
                                                                                if (errors === _errs111) {
                                                                                  if (Array.isArray(data46)) {
                                                                                    if (data46.length > 64) {
                                                                                      validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/unknowns", schemaPath: "#/properties/checks/items/properties/unknowns/maxItems", keyword: "maxItems", params: { limit: 64 }, message: "must NOT have more than 64 items" }];
                                                                                      return false;
                                                                                    } else {
                                                                                      var valid17 = true;
                                                                                      const len7 = data46.length;
                                                                                      for (let i7 = 0; i7 < len7; i7++) {
                                                                                        let data47 = data46[i7];
                                                                                        const _errs113 = errors;
                                                                                        if (errors === _errs113) {
                                                                                          if (typeof data47 === "string") {
                                                                                            if (func3(data47) > 2048) {
                                                                                              validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/unknowns/" + i7, schemaPath: "#/properties/checks/items/properties/unknowns/items/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                              return false;
                                                                                            }
                                                                                          } else {
                                                                                            validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/unknowns/" + i7, schemaPath: "#/properties/checks/items/properties/unknowns/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                            return false;
                                                                                          }
                                                                                        }
                                                                                        var valid17 = _errs113 === errors;
                                                                                        if (!valid17) {
                                                                                          break;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  } else {
                                                                                    validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/unknowns", schemaPath: "#/properties/checks/items/properties/unknowns/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                    return false;
                                                                                  }
                                                                                }
                                                                                var valid7 = _errs111 === errors;
                                                                              } else {
                                                                                var valid7 = true;
                                                                              }
                                                                              if (valid7) {
                                                                                if (data15.verificationRequirements !== void 0) {
                                                                                  let data48 = data15.verificationRequirements;
                                                                                  const _errs115 = errors;
                                                                                  if (errors === _errs115) {
                                                                                    if (Array.isArray(data48)) {
                                                                                      if (data48.length > 64) {
                                                                                        validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/verificationRequirements", schemaPath: "#/properties/checks/items/properties/verificationRequirements/maxItems", keyword: "maxItems", params: { limit: 64 }, message: "must NOT have more than 64 items" }];
                                                                                        return false;
                                                                                      } else {
                                                                                        var valid18 = true;
                                                                                        const len8 = data48.length;
                                                                                        for (let i8 = 0; i8 < len8; i8++) {
                                                                                          let data49 = data48[i8];
                                                                                          const _errs117 = errors;
                                                                                          if (errors === _errs117) {
                                                                                            if (typeof data49 === "string") {
                                                                                              if (func3(data49) > 2048) {
                                                                                                validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/verificationRequirements/" + i8, schemaPath: "#/properties/checks/items/properties/verificationRequirements/items/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                                return false;
                                                                                              }
                                                                                            } else {
                                                                                              validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/verificationRequirements/" + i8, schemaPath: "#/properties/checks/items/properties/verificationRequirements/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                              return false;
                                                                                            }
                                                                                          }
                                                                                          var valid18 = _errs117 === errors;
                                                                                          if (!valid18) {
                                                                                            break;
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    } else {
                                                                                      validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/verificationRequirements", schemaPath: "#/properties/checks/items/properties/verificationRequirements/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                      return false;
                                                                                    }
                                                                                  }
                                                                                  var valid7 = _errs115 === errors;
                                                                                } else {
                                                                                  var valid7 = true;
                                                                                }
                                                                                if (valid7) {
                                                                                  if (data15.repair !== void 0) {
                                                                                    let data50 = data15.repair;
                                                                                    const _errs119 = errors;
                                                                                    if (errors === _errs119) {
                                                                                      if (data50 && typeof data50 == "object" && !Array.isArray(data50)) {
                                                                                        let missing5;
                                                                                        if (data50.providerId === void 0 && (missing5 = "providerId") || data50.availability === void 0 && (missing5 = "availability") || data50.reason === void 0 && (missing5 = "reason")) {
                                                                                          validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/repair", schemaPath: "#/properties/checks/items/properties/repair/required", keyword: "required", params: { missingProperty: missing5 }, message: "must have required property '" + missing5 + "'" }];
                                                                                          return false;
                                                                                        } else {
                                                                                          const _errs121 = errors;
                                                                                          for (const key6 in data50) {
                                                                                            if (!(key6 === "providerId" || key6 === "availability" || key6 === "reason")) {
                                                                                              validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/repair", schemaPath: "#/properties/checks/items/properties/repair/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key6 }, message: "must NOT have additional properties" }];
                                                                                              return false;
                                                                                              break;
                                                                                            }
                                                                                          }
                                                                                          if (_errs121 === errors) {
                                                                                            if (data50.providerId !== void 0) {
                                                                                              let data51 = data50.providerId;
                                                                                              const _errs122 = errors;
                                                                                              if (!(data51 === "audio-endpoint-mute-v1" || data51 === null)) {
                                                                                                validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/repair/providerId", schemaPath: "#/properties/checks/items/properties/repair/properties/providerId/enum", keyword: "enum", params: { allowedValues: schema40.properties.checks.items.properties.repair.properties.providerId.enum }, message: "must be equal to one of the allowed values" }];
                                                                                                return false;
                                                                                              }
                                                                                              var valid19 = _errs122 === errors;
                                                                                            } else {
                                                                                              var valid19 = true;
                                                                                            }
                                                                                            if (valid19) {
                                                                                              if (data50.availability !== void 0) {
                                                                                                let data52 = data50.availability;
                                                                                                const _errs123 = errors;
                                                                                                if (errors === _errs123) {
                                                                                                  if (typeof data52 === "string") {
                                                                                                    if (func3(data52) > 2048) {
                                                                                                      validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/repair/availability", schemaPath: "#/properties/checks/items/properties/repair/properties/availability/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                                      return false;
                                                                                                    }
                                                                                                  } else {
                                                                                                    validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/repair/availability", schemaPath: "#/properties/checks/items/properties/repair/properties/availability/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                    return false;
                                                                                                  }
                                                                                                }
                                                                                                var valid19 = _errs123 === errors;
                                                                                              } else {
                                                                                                var valid19 = true;
                                                                                              }
                                                                                              if (valid19) {
                                                                                                if (data50.reason !== void 0) {
                                                                                                  let data53 = data50.reason;
                                                                                                  const _errs125 = errors;
                                                                                                  if (errors === _errs125) {
                                                                                                    if (typeof data53 === "string") {
                                                                                                      if (func3(data53) > 2048) {
                                                                                                        validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/repair/reason", schemaPath: "#/properties/checks/items/properties/repair/properties/reason/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                                        return false;
                                                                                                      }
                                                                                                    } else {
                                                                                                      validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/repair/reason", schemaPath: "#/properties/checks/items/properties/repair/properties/reason/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                      return false;
                                                                                                    }
                                                                                                  }
                                                                                                  var valid19 = _errs125 === errors;
                                                                                                } else {
                                                                                                  var valid19 = true;
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      } else {
                                                                                        validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/repair", schemaPath: "#/properties/checks/items/properties/repair/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                                                        return false;
                                                                                      }
                                                                                    }
                                                                                    var valid7 = _errs119 === errors;
                                                                                  } else {
                                                                                    var valid7 = true;
                                                                                  }
                                                                                  if (valid7) {
                                                                                    if (data15.classification !== void 0) {
                                                                                      let data54 = data15.classification;
                                                                                      const _errs127 = errors;
                                                                                      if (!(data54 === "confirmed_issue" || data54 === "potential_issue" || data54 === "informational" || data54 === "inconclusive" || data54 === "unsupported" || data54 === "not_tested")) {
                                                                                        validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/classification", schemaPath: "#/properties/checks/items/properties/classification/enum", keyword: "enum", params: { allowedValues: schema40.properties.checks.items.properties.classification.enum }, message: "must be equal to one of the allowed values" }];
                                                                                        return false;
                                                                                      }
                                                                                      var valid7 = _errs127 === errors;
                                                                                    } else {
                                                                                      var valid7 = true;
                                                                                    }
                                                                                    if (valid7) {
                                                                                      if (data15.observedAt !== void 0) {
                                                                                        let data55 = data15.observedAt;
                                                                                        const _errs128 = errors;
                                                                                        if (typeof data55 !== "string" && data55 !== null) {
                                                                                          validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/observedAt", schemaPath: "#/properties/checks/items/properties/observedAt/type", keyword: "type", params: { type: schema40.properties.checks.items.properties.observedAt.type }, message: "must be string,null" }];
                                                                                          return false;
                                                                                        }
                                                                                        if (errors === _errs128) {
                                                                                          if (typeof data55 === "string") {
                                                                                            if (func3(data55) > 100) {
                                                                                              validate25.errors = [{ instancePath: instancePath + "/checks/" + i0 + "/observedAt", schemaPath: "#/properties/checks/items/properties/observedAt/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                                                                              return false;
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                        var valid7 = _errs128 === errors;
                                                                                      } else {
                                                                                        var valid7 = true;
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
                                        validate25.errors = [{ instancePath: instancePath + "/checks/" + i0, schemaPath: "#/properties/checks/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                        return false;
                                      }
                                    }
                                    var valid6 = _errs43 === errors;
                                    if (!valid6) {
                                      break;
                                    }
                                  }
                                }
                              } else {
                                validate25.errors = [{ instancePath: instancePath + "/checks", schemaPath: "#/properties/checks/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                return false;
                              }
                            }
                            var valid0 = _errs41 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.audioEndpoints !== void 0) {
                              let data56 = data.audioEndpoints;
                              const _errs130 = errors;
                              if (errors === _errs130) {
                                if (Array.isArray(data56)) {
                                  if (data56.length > 256) {
                                    validate25.errors = [{ instancePath: instancePath + "/audioEndpoints", schemaPath: "#/properties/audioEndpoints/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                                    return false;
                                  } else {
                                    var valid20 = true;
                                    const len9 = data56.length;
                                    for (let i9 = 0; i9 < len9; i9++) {
                                      let data57 = data56[i9];
                                      const _errs132 = errors;
                                      if (errors === _errs132) {
                                        if (data57 && typeof data57 == "object" && !Array.isArray(data57)) {
                                          let missing6;
                                          if (data57.id === void 0 && (missing6 = "id") || data57.name === void 0 && (missing6 = "name") || data57.instanceId === void 0 && (missing6 = "instanceId") || data57.containerId === void 0 && (missing6 = "containerId") || data57.kind === void 0 && (missing6 = "kind") || data57.state === void 0 && (missing6 = "state") || data57.defaultRoles === void 0 && (missing6 = "defaultRoles") || data57.mute === void 0 && (missing6 = "mute") || data57.volume === void 0 && (missing6 = "volume") || data57.format === void 0 && (missing6 = "format")) {
                                            validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9, schemaPath: "#/properties/audioEndpoints/items/required", keyword: "required", params: { missingProperty: missing6 }, message: "must have required property '" + missing6 + "'" }];
                                            return false;
                                          } else {
                                            const _errs134 = errors;
                                            for (const key7 in data57) {
                                              if (!func1.call(schema40.properties.audioEndpoints.items.properties, key7)) {
                                                validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9, schemaPath: "#/properties/audioEndpoints/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key7 }, message: "must NOT have additional properties" }];
                                                return false;
                                                break;
                                              }
                                            }
                                            if (_errs134 === errors) {
                                              if (data57.id !== void 0) {
                                                let data58 = data57.id;
                                                const _errs135 = errors;
                                                if (errors === _errs135) {
                                                  if (typeof data58 === "string") {
                                                    if (func3(data58) > 2048) {
                                                      validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9 + "/id", schemaPath: "#/properties/audioEndpoints/items/properties/id/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                      return false;
                                                    }
                                                  } else {
                                                    validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9 + "/id", schemaPath: "#/properties/audioEndpoints/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                    return false;
                                                  }
                                                }
                                                var valid21 = _errs135 === errors;
                                              } else {
                                                var valid21 = true;
                                              }
                                              if (valid21) {
                                                if (data57.name !== void 0) {
                                                  let data59 = data57.name;
                                                  const _errs137 = errors;
                                                  if (typeof data59 !== "string" && data59 !== null) {
                                                    validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9 + "/name", schemaPath: "#/properties/audioEndpoints/items/properties/name/type", keyword: "type", params: { type: schema40.properties.audioEndpoints.items.properties.name.type }, message: "must be string,null" }];
                                                    return false;
                                                  }
                                                  if (errors === _errs137) {
                                                    if (typeof data59 === "string") {
                                                      if (func3(data59) > 2048) {
                                                        validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9 + "/name", schemaPath: "#/properties/audioEndpoints/items/properties/name/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                        return false;
                                                      }
                                                    }
                                                  }
                                                  var valid21 = _errs137 === errors;
                                                } else {
                                                  var valid21 = true;
                                                }
                                                if (valid21) {
                                                  if (data57.instanceId !== void 0) {
                                                    let data60 = data57.instanceId;
                                                    const _errs139 = errors;
                                                    if (typeof data60 !== "string" && data60 !== null) {
                                                      validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9 + "/instanceId", schemaPath: "#/properties/audioEndpoints/items/properties/instanceId/type", keyword: "type", params: { type: schema40.properties.audioEndpoints.items.properties.instanceId.type }, message: "must be string,null" }];
                                                      return false;
                                                    }
                                                    if (errors === _errs139) {
                                                      if (typeof data60 === "string") {
                                                        if (func3(data60) > 2048) {
                                                          validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9 + "/instanceId", schemaPath: "#/properties/audioEndpoints/items/properties/instanceId/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                          return false;
                                                        }
                                                      }
                                                    }
                                                    var valid21 = _errs139 === errors;
                                                  } else {
                                                    var valid21 = true;
                                                  }
                                                  if (valid21) {
                                                    if (data57.containerId !== void 0) {
                                                      let data61 = data57.containerId;
                                                      const _errs141 = errors;
                                                      if (typeof data61 !== "string" && data61 !== null) {
                                                        validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9 + "/containerId", schemaPath: "#/properties/audioEndpoints/items/properties/containerId/type", keyword: "type", params: { type: schema40.properties.audioEndpoints.items.properties.containerId.type }, message: "must be string,null" }];
                                                        return false;
                                                      }
                                                      if (errors === _errs141) {
                                                        if (typeof data61 === "string") {
                                                          if (func3(data61) > 2048) {
                                                            validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9 + "/containerId", schemaPath: "#/properties/audioEndpoints/items/properties/containerId/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                            return false;
                                                          }
                                                        }
                                                      }
                                                      var valid21 = _errs141 === errors;
                                                    } else {
                                                      var valid21 = true;
                                                    }
                                                    if (valid21) {
                                                      if (data57.kind !== void 0) {
                                                        let data62 = data57.kind;
                                                        const _errs143 = errors;
                                                        if (!(data62 === "playback" || data62 === "recording")) {
                                                          validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9 + "/kind", schemaPath: "#/properties/audioEndpoints/items/properties/kind/enum", keyword: "enum", params: { allowedValues: schema40.properties.audioEndpoints.items.properties.kind.enum }, message: "must be equal to one of the allowed values" }];
                                                          return false;
                                                        }
                                                        var valid21 = _errs143 === errors;
                                                      } else {
                                                        var valid21 = true;
                                                      }
                                                      if (valid21) {
                                                        if (data57.state !== void 0) {
                                                          let data63 = data57.state;
                                                          const _errs144 = errors;
                                                          if (!(data63 === "active" || data63 === "disabled" || data63 === "unplugged" || data63 === "notPresent")) {
                                                            validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9 + "/state", schemaPath: "#/properties/audioEndpoints/items/properties/state/enum", keyword: "enum", params: { allowedValues: schema40.properties.audioEndpoints.items.properties.state.enum }, message: "must be equal to one of the allowed values" }];
                                                            return false;
                                                          }
                                                          var valid21 = _errs144 === errors;
                                                        } else {
                                                          var valid21 = true;
                                                        }
                                                        if (valid21) {
                                                          if (data57.defaultRoles !== void 0) {
                                                            let data64 = data57.defaultRoles;
                                                            const _errs145 = errors;
                                                            if (errors === _errs145) {
                                                              if (Array.isArray(data64)) {
                                                                if (data64.length > 3) {
                                                                  validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9 + "/defaultRoles", schemaPath: "#/properties/audioEndpoints/items/properties/defaultRoles/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
                                                                  return false;
                                                                } else {
                                                                  var valid22 = true;
                                                                  const len10 = data64.length;
                                                                  for (let i10 = 0; i10 < len10; i10++) {
                                                                    let data65 = data64[i10];
                                                                    const _errs147 = errors;
                                                                    if (!(data65 === "console" || data65 === "multimedia" || data65 === "communications")) {
                                                                      validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9 + "/defaultRoles/" + i10, schemaPath: "#/properties/audioEndpoints/items/properties/defaultRoles/items/enum", keyword: "enum", params: { allowedValues: schema40.properties.audioEndpoints.items.properties.defaultRoles.items.enum }, message: "must be equal to one of the allowed values" }];
                                                                      return false;
                                                                    }
                                                                    var valid22 = _errs147 === errors;
                                                                    if (!valid22) {
                                                                      break;
                                                                    }
                                                                  }
                                                                }
                                                              } else {
                                                                validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9 + "/defaultRoles", schemaPath: "#/properties/audioEndpoints/items/properties/defaultRoles/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                return false;
                                                              }
                                                            }
                                                            var valid21 = _errs145 === errors;
                                                          } else {
                                                            var valid21 = true;
                                                          }
                                                          if (valid21) {
                                                            if (data57.mute !== void 0) {
                                                              let data66 = data57.mute;
                                                              const _errs148 = errors;
                                                              if (typeof data66 !== "boolean" && data66 !== null) {
                                                                validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9 + "/mute", schemaPath: "#/properties/audioEndpoints/items/properties/mute/type", keyword: "type", params: { type: schema40.properties.audioEndpoints.items.properties.mute.type }, message: "must be boolean,null" }];
                                                                return false;
                                                              }
                                                              var valid21 = _errs148 === errors;
                                                            } else {
                                                              var valid21 = true;
                                                            }
                                                            if (valid21) {
                                                              if (data57.volume !== void 0) {
                                                                let data67 = data57.volume;
                                                                const _errs150 = errors;
                                                                if (!(typeof data67 == "number" && isFinite(data67)) && data67 !== null) {
                                                                  validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9 + "/volume", schemaPath: "#/properties/audioEndpoints/items/properties/volume/type", keyword: "type", params: { type: schema40.properties.audioEndpoints.items.properties.volume.type }, message: "must be number,null" }];
                                                                  return false;
                                                                }
                                                                var valid21 = _errs150 === errors;
                                                              } else {
                                                                var valid21 = true;
                                                              }
                                                              if (valid21) {
                                                                if (data57.format !== void 0) {
                                                                  let data68 = data57.format;
                                                                  const _errs152 = errors;
                                                                  const _errs153 = errors;
                                                                  let valid23 = false;
                                                                  const _errs154 = errors;
                                                                  if (errors === _errs154) {
                                                                    if (data68 && typeof data68 == "object" && !Array.isArray(data68)) {
                                                                      let missing7;
                                                                      if (data68.sampleRate === void 0 && (missing7 = "sampleRate") || data68.channels === void 0 && (missing7 = "channels") || data68.bits === void 0 && (missing7 = "bits") || data68.float === void 0 && (missing7 = "float") || data68.blockAlign === void 0 && (missing7 = "blockAlign") || data68.channelMask === void 0 && (missing7 = "channelMask") || data68.supported === void 0 && (missing7 = "supported")) {
                                                                        const err28 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/0/required", keyword: "required", params: { missingProperty: missing7 }, message: "must have required property '" + missing7 + "'" };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err28];
                                                                        } else {
                                                                          vErrors.push(err28);
                                                                        }
                                                                        errors++;
                                                                      } else {
                                                                        const _errs156 = errors;
                                                                        for (const key8 in data68) {
                                                                          if (!(key8 === "sampleRate" || key8 === "channels" || key8 === "bits" || key8 === "float" || key8 === "blockAlign" || key8 === "channelMask" || key8 === "supported")) {
                                                                            const err29 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/0/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key8 }, message: "must NOT have additional properties" };
                                                                            if (vErrors === null) {
                                                                              vErrors = [err29];
                                                                            } else {
                                                                              vErrors.push(err29);
                                                                            }
                                                                            errors++;
                                                                            break;
                                                                          }
                                                                        }
                                                                        if (_errs156 === errors) {
                                                                          if (data68.sampleRate !== void 0) {
                                                                            let data69 = data68.sampleRate;
                                                                            const _errs157 = errors;
                                                                            if (!(typeof data69 == "number" && (!(data69 % 1) && !isNaN(data69)) && isFinite(data69))) {
                                                                              const err30 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format/sampleRate", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/0/properties/sampleRate/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                              if (vErrors === null) {
                                                                                vErrors = [err30];
                                                                              } else {
                                                                                vErrors.push(err30);
                                                                              }
                                                                              errors++;
                                                                            }
                                                                            if (errors === _errs157) {
                                                                              if (typeof data69 == "number" && isFinite(data69)) {
                                                                                if (data69 < 0 || isNaN(data69)) {
                                                                                  const err31 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format/sampleRate", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/0/properties/sampleRate/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                                                                  if (vErrors === null) {
                                                                                    vErrors = [err31];
                                                                                  } else {
                                                                                    vErrors.push(err31);
                                                                                  }
                                                                                  errors++;
                                                                                }
                                                                              }
                                                                            }
                                                                            var valid24 = _errs157 === errors;
                                                                          } else {
                                                                            var valid24 = true;
                                                                          }
                                                                          if (valid24) {
                                                                            if (data68.channels !== void 0) {
                                                                              let data70 = data68.channels;
                                                                              const _errs159 = errors;
                                                                              if (!(typeof data70 == "number" && (!(data70 % 1) && !isNaN(data70)) && isFinite(data70))) {
                                                                                const err32 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format/channels", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/0/properties/channels/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                                if (vErrors === null) {
                                                                                  vErrors = [err32];
                                                                                } else {
                                                                                  vErrors.push(err32);
                                                                                }
                                                                                errors++;
                                                                              }
                                                                              if (errors === _errs159) {
                                                                                if (typeof data70 == "number" && isFinite(data70)) {
                                                                                  if (data70 < 0 || isNaN(data70)) {
                                                                                    const err33 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format/channels", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/0/properties/channels/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err33];
                                                                                    } else {
                                                                                      vErrors.push(err33);
                                                                                    }
                                                                                    errors++;
                                                                                  }
                                                                                }
                                                                              }
                                                                              var valid24 = _errs159 === errors;
                                                                            } else {
                                                                              var valid24 = true;
                                                                            }
                                                                            if (valid24) {
                                                                              if (data68.bits !== void 0) {
                                                                                let data71 = data68.bits;
                                                                                const _errs161 = errors;
                                                                                if (!(typeof data71 == "number" && (!(data71 % 1) && !isNaN(data71)) && isFinite(data71))) {
                                                                                  const err34 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format/bits", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/0/properties/bits/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                                  if (vErrors === null) {
                                                                                    vErrors = [err34];
                                                                                  } else {
                                                                                    vErrors.push(err34);
                                                                                  }
                                                                                  errors++;
                                                                                }
                                                                                if (errors === _errs161) {
                                                                                  if (typeof data71 == "number" && isFinite(data71)) {
                                                                                    if (data71 < 0 || isNaN(data71)) {
                                                                                      const err35 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format/bits", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/0/properties/bits/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err35];
                                                                                      } else {
                                                                                        vErrors.push(err35);
                                                                                      }
                                                                                      errors++;
                                                                                    }
                                                                                  }
                                                                                }
                                                                                var valid24 = _errs161 === errors;
                                                                              } else {
                                                                                var valid24 = true;
                                                                              }
                                                                              if (valid24) {
                                                                                if (data68.float !== void 0) {
                                                                                  const _errs163 = errors;
                                                                                  if (typeof data68.float !== "boolean") {
                                                                                    const err36 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format/float", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/0/properties/float/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err36];
                                                                                    } else {
                                                                                      vErrors.push(err36);
                                                                                    }
                                                                                    errors++;
                                                                                  }
                                                                                  var valid24 = _errs163 === errors;
                                                                                } else {
                                                                                  var valid24 = true;
                                                                                }
                                                                                if (valid24) {
                                                                                  if (data68.blockAlign !== void 0) {
                                                                                    let data73 = data68.blockAlign;
                                                                                    const _errs165 = errors;
                                                                                    if (!(typeof data73 == "number" && (!(data73 % 1) && !isNaN(data73)) && isFinite(data73))) {
                                                                                      const err37 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format/blockAlign", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/0/properties/blockAlign/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err37];
                                                                                      } else {
                                                                                        vErrors.push(err37);
                                                                                      }
                                                                                      errors++;
                                                                                    }
                                                                                    if (errors === _errs165) {
                                                                                      if (typeof data73 == "number" && isFinite(data73)) {
                                                                                        if (data73 < 0 || isNaN(data73)) {
                                                                                          const err38 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format/blockAlign", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/0/properties/blockAlign/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err38];
                                                                                          } else {
                                                                                            vErrors.push(err38);
                                                                                          }
                                                                                          errors++;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                    var valid24 = _errs165 === errors;
                                                                                  } else {
                                                                                    var valid24 = true;
                                                                                  }
                                                                                  if (valid24) {
                                                                                    if (data68.channelMask !== void 0) {
                                                                                      let data74 = data68.channelMask;
                                                                                      const _errs167 = errors;
                                                                                      if (!(typeof data74 == "number" && (!(data74 % 1) && !isNaN(data74)) && isFinite(data74))) {
                                                                                        const err39 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format/channelMask", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/0/properties/channelMask/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err39];
                                                                                        } else {
                                                                                          vErrors.push(err39);
                                                                                        }
                                                                                        errors++;
                                                                                      }
                                                                                      if (errors === _errs167) {
                                                                                        if (typeof data74 == "number" && isFinite(data74)) {
                                                                                          if (data74 < 0 || isNaN(data74)) {
                                                                                            const err40 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format/channelMask", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/0/properties/channelMask/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                                                                            if (vErrors === null) {
                                                                                              vErrors = [err40];
                                                                                            } else {
                                                                                              vErrors.push(err40);
                                                                                            }
                                                                                            errors++;
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                      var valid24 = _errs167 === errors;
                                                                                    } else {
                                                                                      var valid24 = true;
                                                                                    }
                                                                                    if (valid24) {
                                                                                      if (data68.supported !== void 0) {
                                                                                        const _errs169 = errors;
                                                                                        if (typeof data68.supported !== "boolean") {
                                                                                          const err41 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format/supported", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/0/properties/supported/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err41];
                                                                                          } else {
                                                                                            vErrors.push(err41);
                                                                                          }
                                                                                          errors++;
                                                                                        }
                                                                                        var valid24 = _errs169 === errors;
                                                                                      } else {
                                                                                        var valid24 = true;
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
                                                                      const err42 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/0/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err42];
                                                                      } else {
                                                                        vErrors.push(err42);
                                                                      }
                                                                      errors++;
                                                                    }
                                                                  }
                                                                  var _valid4 = _errs154 === errors;
                                                                  valid23 = valid23 || _valid4;
                                                                  const _errs171 = errors;
                                                                  if (data68 !== null) {
                                                                    const err43 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err43];
                                                                    } else {
                                                                      vErrors.push(err43);
                                                                    }
                                                                    errors++;
                                                                  }
                                                                  var _valid4 = _errs171 === errors;
                                                                  valid23 = valid23 || _valid4;
                                                                  if (!valid23) {
                                                                    const err44 = { instancePath: instancePath + "/audioEndpoints/" + i9 + "/format", schemaPath: "#/properties/audioEndpoints/items/properties/format/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err44];
                                                                    } else {
                                                                      vErrors.push(err44);
                                                                    }
                                                                    errors++;
                                                                    validate25.errors = vErrors;
                                                                    return false;
                                                                  } else {
                                                                    errors = _errs153;
                                                                    if (vErrors !== null) {
                                                                      if (_errs153) {
                                                                        vErrors.length = _errs153;
                                                                      } else {
                                                                        vErrors = null;
                                                                      }
                                                                    }
                                                                  }
                                                                  var valid21 = _errs152 === errors;
                                                                } else {
                                                                  var valid21 = true;
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
                                          validate25.errors = [{ instancePath: instancePath + "/audioEndpoints/" + i9, schemaPath: "#/properties/audioEndpoints/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                          return false;
                                        }
                                      }
                                      var valid20 = _errs132 === errors;
                                      if (!valid20) {
                                        break;
                                      }
                                    }
                                  }
                                } else {
                                  validate25.errors = [{ instancePath: instancePath + "/audioEndpoints", schemaPath: "#/properties/audioEndpoints/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                  return false;
                                }
                              }
                              var valid0 = _errs130 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.audioSessions !== void 0) {
                                let data76 = data.audioSessions;
                                const _errs173 = errors;
                                if (errors === _errs173) {
                                  if (Array.isArray(data76)) {
                                    if (data76.length > 8) {
                                      validate25.errors = [{ instancePath: instancePath + "/audioSessions", schemaPath: "#/properties/audioSessions/maxItems", keyword: "maxItems", params: { limit: 8 }, message: "must NOT have more than 8 items" }];
                                      return false;
                                    } else {
                                      var valid25 = true;
                                      const len11 = data76.length;
                                      for (let i11 = 0; i11 < len11; i11++) {
                                        let data77 = data76[i11];
                                        const _errs175 = errors;
                                        if (errors === _errs175) {
                                          if (data77 && typeof data77 == "object" && !Array.isArray(data77)) {
                                            let missing8;
                                            if (data77.sessionId === void 0 && (missing8 = "sessionId") || data77.targetId === void 0 && (missing8 = "targetId") || data77.mode === void 0 && (missing8 = "mode") || data77.status === void 0 && (missing8 = "status") || data77.reason === void 0 && (missing8 = "reason") || data77.startedAt === void 0 && (missing8 = "startedAt") || data77.format === void 0 && (missing8 = "format") || data77.frames === void 0 && (missing8 = "frames") || data77.aggregate === void 0 && (missing8 = "aggregate") || data77.window === void 0 && (missing8 = "window") || data77.discontinuities === void 0 && (missing8 = "discontinuities") || data77.timestampErrors === void 0 && (missing8 = "timestampErrors") || data77.cleanup === void 0 && (missing8 = "cleanup")) {
                                              validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11, schemaPath: "#/properties/audioSessions/items/required", keyword: "required", params: { missingProperty: missing8 }, message: "must have required property '" + missing8 + "'" }];
                                              return false;
                                            } else {
                                              const _errs177 = errors;
                                              for (const key9 in data77) {
                                                if (!func1.call(schema40.properties.audioSessions.items.properties, key9)) {
                                                  validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11, schemaPath: "#/properties/audioSessions/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key9 }, message: "must NOT have additional properties" }];
                                                  return false;
                                                  break;
                                                }
                                              }
                                              if (_errs177 === errors) {
                                                if (data77.sessionId !== void 0) {
                                                  let data78 = data77.sessionId;
                                                  const _errs178 = errors;
                                                  if (!(typeof data78 == "number" && (!(data78 % 1) && !isNaN(data78)) && isFinite(data78))) {
                                                    validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/sessionId", schemaPath: "#/properties/audioSessions/items/properties/sessionId/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                    return false;
                                                  }
                                                  if (errors === _errs178) {
                                                    if (typeof data78 == "number" && isFinite(data78)) {
                                                      if (data78 < 0 || isNaN(data78)) {
                                                        validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/sessionId", schemaPath: "#/properties/audioSessions/items/properties/sessionId/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                        return false;
                                                      }
                                                    }
                                                  }
                                                  var valid26 = _errs178 === errors;
                                                } else {
                                                  var valid26 = true;
                                                }
                                                if (valid26) {
                                                  if (data77.targetId !== void 0) {
                                                    let data79 = data77.targetId;
                                                    const _errs180 = errors;
                                                    if (errors === _errs180) {
                                                      if (typeof data79 === "string") {
                                                        if (func3(data79) > 2048) {
                                                          validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/targetId", schemaPath: "#/properties/audioSessions/items/properties/targetId/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                          return false;
                                                        }
                                                      } else {
                                                        validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/targetId", schemaPath: "#/properties/audioSessions/items/properties/targetId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                        return false;
                                                      }
                                                    }
                                                    var valid26 = _errs180 === errors;
                                                  } else {
                                                    var valid26 = true;
                                                  }
                                                  if (valid26) {
                                                    if (data77.mode !== void 0) {
                                                      let data80 = data77.mode;
                                                      const _errs182 = errors;
                                                      if (!(data80 === "left" || data80 === "right" || data80 === "tone" || data80 === "ambient" || data80 === "speech")) {
                                                        validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/mode", schemaPath: "#/properties/audioSessions/items/properties/mode/enum", keyword: "enum", params: { allowedValues: schema40.properties.audioSessions.items.properties.mode.enum }, message: "must be equal to one of the allowed values" }];
                                                        return false;
                                                      }
                                                      var valid26 = _errs182 === errors;
                                                    } else {
                                                      var valid26 = true;
                                                    }
                                                    if (valid26) {
                                                      if (data77.status !== void 0) {
                                                        let data81 = data77.status;
                                                        const _errs183 = errors;
                                                        if (errors === _errs183) {
                                                          if (typeof data81 === "string") {
                                                            if (func3(data81) > 100) {
                                                              validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/status", schemaPath: "#/properties/audioSessions/items/properties/status/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                                              return false;
                                                            }
                                                          } else {
                                                            validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/status", schemaPath: "#/properties/audioSessions/items/properties/status/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                            return false;
                                                          }
                                                        }
                                                        var valid26 = _errs183 === errors;
                                                      } else {
                                                        var valid26 = true;
                                                      }
                                                      if (valid26) {
                                                        if (data77.reason !== void 0) {
                                                          let data82 = data77.reason;
                                                          const _errs185 = errors;
                                                          if (errors === _errs185) {
                                                            if (typeof data82 === "string") {
                                                              if (func3(data82) > 2048) {
                                                                validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/reason", schemaPath: "#/properties/audioSessions/items/properties/reason/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                return false;
                                                              }
                                                            } else {
                                                              validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/reason", schemaPath: "#/properties/audioSessions/items/properties/reason/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                              return false;
                                                            }
                                                          }
                                                          var valid26 = _errs185 === errors;
                                                        } else {
                                                          var valid26 = true;
                                                        }
                                                        if (valid26) {
                                                          if (data77.startedAt !== void 0) {
                                                            let data83 = data77.startedAt;
                                                            const _errs187 = errors;
                                                            if (errors === _errs187) {
                                                              if (typeof data83 === "string") {
                                                                if (func3(data83) > 100) {
                                                                  validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/startedAt", schemaPath: "#/properties/audioSessions/items/properties/startedAt/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                                                  return false;
                                                                }
                                                              } else {
                                                                validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/startedAt", schemaPath: "#/properties/audioSessions/items/properties/startedAt/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                return false;
                                                              }
                                                            }
                                                            var valid26 = _errs187 === errors;
                                                          } else {
                                                            var valid26 = true;
                                                          }
                                                          if (valid26) {
                                                            if (data77.format !== void 0) {
                                                              let data84 = data77.format;
                                                              const _errs189 = errors;
                                                              const _errs190 = errors;
                                                              let valid27 = false;
                                                              const _errs191 = errors;
                                                              if (errors === _errs191) {
                                                                if (data84 && typeof data84 == "object" && !Array.isArray(data84)) {
                                                                  let missing9;
                                                                  if (data84.sampleRate === void 0 && (missing9 = "sampleRate") || data84.channels === void 0 && (missing9 = "channels") || data84.bits === void 0 && (missing9 = "bits") || data84.float === void 0 && (missing9 = "float") || data84.blockAlign === void 0 && (missing9 = "blockAlign") || data84.channelMask === void 0 && (missing9 = "channelMask") || data84.supported === void 0 && (missing9 = "supported")) {
                                                                    const err45 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/0/required", keyword: "required", params: { missingProperty: missing9 }, message: "must have required property '" + missing9 + "'" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err45];
                                                                    } else {
                                                                      vErrors.push(err45);
                                                                    }
                                                                    errors++;
                                                                  } else {
                                                                    const _errs193 = errors;
                                                                    for (const key10 in data84) {
                                                                      if (!(key10 === "sampleRate" || key10 === "channels" || key10 === "bits" || key10 === "float" || key10 === "blockAlign" || key10 === "channelMask" || key10 === "supported")) {
                                                                        const err46 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/0/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key10 }, message: "must NOT have additional properties" };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err46];
                                                                        } else {
                                                                          vErrors.push(err46);
                                                                        }
                                                                        errors++;
                                                                        break;
                                                                      }
                                                                    }
                                                                    if (_errs193 === errors) {
                                                                      if (data84.sampleRate !== void 0) {
                                                                        let data85 = data84.sampleRate;
                                                                        const _errs194 = errors;
                                                                        if (!(typeof data85 == "number" && (!(data85 % 1) && !isNaN(data85)) && isFinite(data85))) {
                                                                          const err47 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format/sampleRate", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/0/properties/sampleRate/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                          if (vErrors === null) {
                                                                            vErrors = [err47];
                                                                          } else {
                                                                            vErrors.push(err47);
                                                                          }
                                                                          errors++;
                                                                        }
                                                                        if (errors === _errs194) {
                                                                          if (typeof data85 == "number" && isFinite(data85)) {
                                                                            if (data85 < 0 || isNaN(data85)) {
                                                                              const err48 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format/sampleRate", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/0/properties/sampleRate/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                                                              if (vErrors === null) {
                                                                                vErrors = [err48];
                                                                              } else {
                                                                                vErrors.push(err48);
                                                                              }
                                                                              errors++;
                                                                            }
                                                                          }
                                                                        }
                                                                        var valid28 = _errs194 === errors;
                                                                      } else {
                                                                        var valid28 = true;
                                                                      }
                                                                      if (valid28) {
                                                                        if (data84.channels !== void 0) {
                                                                          let data86 = data84.channels;
                                                                          const _errs196 = errors;
                                                                          if (!(typeof data86 == "number" && (!(data86 % 1) && !isNaN(data86)) && isFinite(data86))) {
                                                                            const err49 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format/channels", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/0/properties/channels/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                            if (vErrors === null) {
                                                                              vErrors = [err49];
                                                                            } else {
                                                                              vErrors.push(err49);
                                                                            }
                                                                            errors++;
                                                                          }
                                                                          if (errors === _errs196) {
                                                                            if (typeof data86 == "number" && isFinite(data86)) {
                                                                              if (data86 < 0 || isNaN(data86)) {
                                                                                const err50 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format/channels", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/0/properties/channels/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                                                                if (vErrors === null) {
                                                                                  vErrors = [err50];
                                                                                } else {
                                                                                  vErrors.push(err50);
                                                                                }
                                                                                errors++;
                                                                              }
                                                                            }
                                                                          }
                                                                          var valid28 = _errs196 === errors;
                                                                        } else {
                                                                          var valid28 = true;
                                                                        }
                                                                        if (valid28) {
                                                                          if (data84.bits !== void 0) {
                                                                            let data87 = data84.bits;
                                                                            const _errs198 = errors;
                                                                            if (!(typeof data87 == "number" && (!(data87 % 1) && !isNaN(data87)) && isFinite(data87))) {
                                                                              const err51 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format/bits", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/0/properties/bits/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                              if (vErrors === null) {
                                                                                vErrors = [err51];
                                                                              } else {
                                                                                vErrors.push(err51);
                                                                              }
                                                                              errors++;
                                                                            }
                                                                            if (errors === _errs198) {
                                                                              if (typeof data87 == "number" && isFinite(data87)) {
                                                                                if (data87 < 0 || isNaN(data87)) {
                                                                                  const err52 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format/bits", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/0/properties/bits/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                                                                  if (vErrors === null) {
                                                                                    vErrors = [err52];
                                                                                  } else {
                                                                                    vErrors.push(err52);
                                                                                  }
                                                                                  errors++;
                                                                                }
                                                                              }
                                                                            }
                                                                            var valid28 = _errs198 === errors;
                                                                          } else {
                                                                            var valid28 = true;
                                                                          }
                                                                          if (valid28) {
                                                                            if (data84.float !== void 0) {
                                                                              const _errs200 = errors;
                                                                              if (typeof data84.float !== "boolean") {
                                                                                const err53 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format/float", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/0/properties/float/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                                                if (vErrors === null) {
                                                                                  vErrors = [err53];
                                                                                } else {
                                                                                  vErrors.push(err53);
                                                                                }
                                                                                errors++;
                                                                              }
                                                                              var valid28 = _errs200 === errors;
                                                                            } else {
                                                                              var valid28 = true;
                                                                            }
                                                                            if (valid28) {
                                                                              if (data84.blockAlign !== void 0) {
                                                                                let data89 = data84.blockAlign;
                                                                                const _errs202 = errors;
                                                                                if (!(typeof data89 == "number" && (!(data89 % 1) && !isNaN(data89)) && isFinite(data89))) {
                                                                                  const err54 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format/blockAlign", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/0/properties/blockAlign/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                                  if (vErrors === null) {
                                                                                    vErrors = [err54];
                                                                                  } else {
                                                                                    vErrors.push(err54);
                                                                                  }
                                                                                  errors++;
                                                                                }
                                                                                if (errors === _errs202) {
                                                                                  if (typeof data89 == "number" && isFinite(data89)) {
                                                                                    if (data89 < 0 || isNaN(data89)) {
                                                                                      const err55 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format/blockAlign", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/0/properties/blockAlign/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err55];
                                                                                      } else {
                                                                                        vErrors.push(err55);
                                                                                      }
                                                                                      errors++;
                                                                                    }
                                                                                  }
                                                                                }
                                                                                var valid28 = _errs202 === errors;
                                                                              } else {
                                                                                var valid28 = true;
                                                                              }
                                                                              if (valid28) {
                                                                                if (data84.channelMask !== void 0) {
                                                                                  let data90 = data84.channelMask;
                                                                                  const _errs204 = errors;
                                                                                  if (!(typeof data90 == "number" && (!(data90 % 1) && !isNaN(data90)) && isFinite(data90))) {
                                                                                    const err56 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format/channelMask", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/0/properties/channelMask/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err56];
                                                                                    } else {
                                                                                      vErrors.push(err56);
                                                                                    }
                                                                                    errors++;
                                                                                  }
                                                                                  if (errors === _errs204) {
                                                                                    if (typeof data90 == "number" && isFinite(data90)) {
                                                                                      if (data90 < 0 || isNaN(data90)) {
                                                                                        const err57 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format/channelMask", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/0/properties/channelMask/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err57];
                                                                                        } else {
                                                                                          vErrors.push(err57);
                                                                                        }
                                                                                        errors++;
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                  var valid28 = _errs204 === errors;
                                                                                } else {
                                                                                  var valid28 = true;
                                                                                }
                                                                                if (valid28) {
                                                                                  if (data84.supported !== void 0) {
                                                                                    const _errs206 = errors;
                                                                                    if (typeof data84.supported !== "boolean") {
                                                                                      const err58 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format/supported", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/0/properties/supported/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err58];
                                                                                      } else {
                                                                                        vErrors.push(err58);
                                                                                      }
                                                                                      errors++;
                                                                                    }
                                                                                    var valid28 = _errs206 === errors;
                                                                                  } else {
                                                                                    var valid28 = true;
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
                                                                  const err59 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/0/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err59];
                                                                  } else {
                                                                    vErrors.push(err59);
                                                                  }
                                                                  errors++;
                                                                }
                                                              }
                                                              var _valid5 = _errs191 === errors;
                                                              valid27 = valid27 || _valid5;
                                                              const _errs208 = errors;
                                                              if (data84 !== null) {
                                                                const err60 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err60];
                                                                } else {
                                                                  vErrors.push(err60);
                                                                }
                                                                errors++;
                                                              }
                                                              var _valid5 = _errs208 === errors;
                                                              valid27 = valid27 || _valid5;
                                                              if (!valid27) {
                                                                const err61 = { instancePath: instancePath + "/audioSessions/" + i11 + "/format", schemaPath: "#/properties/audioSessions/items/properties/format/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err61];
                                                                } else {
                                                                  vErrors.push(err61);
                                                                }
                                                                errors++;
                                                                validate25.errors = vErrors;
                                                                return false;
                                                              } else {
                                                                errors = _errs190;
                                                                if (vErrors !== null) {
                                                                  if (_errs190) {
                                                                    vErrors.length = _errs190;
                                                                  } else {
                                                                    vErrors = null;
                                                                  }
                                                                }
                                                              }
                                                              var valid26 = _errs189 === errors;
                                                            } else {
                                                              var valid26 = true;
                                                            }
                                                            if (valid26) {
                                                              if (data77.frames !== void 0) {
                                                                let data92 = data77.frames;
                                                                const _errs210 = errors;
                                                                if (!(typeof data92 == "number" && (!(data92 % 1) && !isNaN(data92)) && isFinite(data92))) {
                                                                  validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/frames", schemaPath: "#/properties/audioSessions/items/properties/frames/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                  return false;
                                                                }
                                                                if (errors === _errs210) {
                                                                  if (typeof data92 == "number" && isFinite(data92)) {
                                                                    if (data92 < 0 || isNaN(data92)) {
                                                                      validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/frames", schemaPath: "#/properties/audioSessions/items/properties/frames/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                      return false;
                                                                    }
                                                                  }
                                                                }
                                                                var valid26 = _errs210 === errors;
                                                              } else {
                                                                var valid26 = true;
                                                              }
                                                              if (valid26) {
                                                                if (data77.aggregate !== void 0) {
                                                                  let data93 = data77.aggregate;
                                                                  const _errs212 = errors;
                                                                  if (errors === _errs212) {
                                                                    if (Array.isArray(data93)) {
                                                                      if (data93.length > 8) {
                                                                        validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/aggregate", schemaPath: "#/properties/audioSessions/items/properties/aggregate/maxItems", keyword: "maxItems", params: { limit: 8 }, message: "must NOT have more than 8 items" }];
                                                                        return false;
                                                                      } else {
                                                                        var valid29 = true;
                                                                        const len12 = data93.length;
                                                                        for (let i12 = 0; i12 < len12; i12++) {
                                                                          let data94 = data93[i12];
                                                                          const _errs214 = errors;
                                                                          if (errors === _errs214) {
                                                                            if (data94 && typeof data94 == "object" && !Array.isArray(data94)) {
                                                                              let missing10;
                                                                              if (data94.samples === void 0 && (missing10 = "samples") || data94.rms === void 0 && (missing10 = "rms") || data94.rmsDbfs === void 0 && (missing10 = "rmsDbfs") || data94.peak === void 0 && (missing10 = "peak") || data94.clippingProportion === void 0 && (missing10 = "clippingProportion") || data94.zeroProportion === void 0 && (missing10 = "zeroProportion") || data94.invalidSamples === void 0 && (missing10 = "invalidSamples")) {
                                                                                validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/aggregate/" + i12, schemaPath: "#/properties/audioSessions/items/properties/aggregate/items/required", keyword: "required", params: { missingProperty: missing10 }, message: "must have required property '" + missing10 + "'" }];
                                                                                return false;
                                                                              } else {
                                                                                const _errs216 = errors;
                                                                                for (const key11 in data94) {
                                                                                  if (!(key11 === "samples" || key11 === "rms" || key11 === "rmsDbfs" || key11 === "peak" || key11 === "clippingProportion" || key11 === "zeroProportion" || key11 === "invalidSamples")) {
                                                                                    validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/aggregate/" + i12, schemaPath: "#/properties/audioSessions/items/properties/aggregate/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key11 }, message: "must NOT have additional properties" }];
                                                                                    return false;
                                                                                    break;
                                                                                  }
                                                                                }
                                                                                if (_errs216 === errors) {
                                                                                  if (data94.samples !== void 0) {
                                                                                    let data95 = data94.samples;
                                                                                    const _errs217 = errors;
                                                                                    if (!(typeof data95 == "number" && (!(data95 % 1) && !isNaN(data95)) && isFinite(data95))) {
                                                                                      validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/aggregate/" + i12 + "/samples", schemaPath: "#/properties/audioSessions/items/properties/aggregate/items/properties/samples/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                      return false;
                                                                                    }
                                                                                    if (errors === _errs217) {
                                                                                      if (typeof data95 == "number" && isFinite(data95)) {
                                                                                        if (data95 < 0 || isNaN(data95)) {
                                                                                          validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/aggregate/" + i12 + "/samples", schemaPath: "#/properties/audioSessions/items/properties/aggregate/items/properties/samples/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                          return false;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                    var valid30 = _errs217 === errors;
                                                                                  } else {
                                                                                    var valid30 = true;
                                                                                  }
                                                                                  if (valid30) {
                                                                                    if (data94.rms !== void 0) {
                                                                                      let data96 = data94.rms;
                                                                                      const _errs219 = errors;
                                                                                      if (!(typeof data96 == "number" && isFinite(data96))) {
                                                                                        validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/aggregate/" + i12 + "/rms", schemaPath: "#/properties/audioSessions/items/properties/aggregate/items/properties/rms/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                                                                                        return false;
                                                                                      }
                                                                                      var valid30 = _errs219 === errors;
                                                                                    } else {
                                                                                      var valid30 = true;
                                                                                    }
                                                                                    if (valid30) {
                                                                                      if (data94.rmsDbfs !== void 0) {
                                                                                        let data97 = data94.rmsDbfs;
                                                                                        const _errs221 = errors;
                                                                                        if (!(typeof data97 == "number" && isFinite(data97))) {
                                                                                          validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/aggregate/" + i12 + "/rmsDbfs", schemaPath: "#/properties/audioSessions/items/properties/aggregate/items/properties/rmsDbfs/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                                                                                          return false;
                                                                                        }
                                                                                        var valid30 = _errs221 === errors;
                                                                                      } else {
                                                                                        var valid30 = true;
                                                                                      }
                                                                                      if (valid30) {
                                                                                        if (data94.peak !== void 0) {
                                                                                          let data98 = data94.peak;
                                                                                          const _errs223 = errors;
                                                                                          if (!(typeof data98 == "number" && isFinite(data98))) {
                                                                                            validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/aggregate/" + i12 + "/peak", schemaPath: "#/properties/audioSessions/items/properties/aggregate/items/properties/peak/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                                                                                            return false;
                                                                                          }
                                                                                          var valid30 = _errs223 === errors;
                                                                                        } else {
                                                                                          var valid30 = true;
                                                                                        }
                                                                                        if (valid30) {
                                                                                          if (data94.clippingProportion !== void 0) {
                                                                                            let data99 = data94.clippingProportion;
                                                                                            const _errs225 = errors;
                                                                                            if (!(typeof data99 == "number" && isFinite(data99))) {
                                                                                              validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/aggregate/" + i12 + "/clippingProportion", schemaPath: "#/properties/audioSessions/items/properties/aggregate/items/properties/clippingProportion/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                                                                                              return false;
                                                                                            }
                                                                                            var valid30 = _errs225 === errors;
                                                                                          } else {
                                                                                            var valid30 = true;
                                                                                          }
                                                                                          if (valid30) {
                                                                                            if (data94.zeroProportion !== void 0) {
                                                                                              let data100 = data94.zeroProportion;
                                                                                              const _errs227 = errors;
                                                                                              if (!(typeof data100 == "number" && isFinite(data100))) {
                                                                                                validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/aggregate/" + i12 + "/zeroProportion", schemaPath: "#/properties/audioSessions/items/properties/aggregate/items/properties/zeroProportion/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                                                                                                return false;
                                                                                              }
                                                                                              var valid30 = _errs227 === errors;
                                                                                            } else {
                                                                                              var valid30 = true;
                                                                                            }
                                                                                            if (valid30) {
                                                                                              if (data94.invalidSamples !== void 0) {
                                                                                                let data101 = data94.invalidSamples;
                                                                                                const _errs229 = errors;
                                                                                                if (!(typeof data101 == "number" && (!(data101 % 1) && !isNaN(data101)) && isFinite(data101))) {
                                                                                                  validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/aggregate/" + i12 + "/invalidSamples", schemaPath: "#/properties/audioSessions/items/properties/aggregate/items/properties/invalidSamples/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                  return false;
                                                                                                }
                                                                                                if (errors === _errs229) {
                                                                                                  if (typeof data101 == "number" && isFinite(data101)) {
                                                                                                    if (data101 < 0 || isNaN(data101)) {
                                                                                                      validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/aggregate/" + i12 + "/invalidSamples", schemaPath: "#/properties/audioSessions/items/properties/aggregate/items/properties/invalidSamples/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                                      return false;
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                                var valid30 = _errs229 === errors;
                                                                                              } else {
                                                                                                var valid30 = true;
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
                                                                              validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/aggregate/" + i12, schemaPath: "#/properties/audioSessions/items/properties/aggregate/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                                              return false;
                                                                            }
                                                                          }
                                                                          var valid29 = _errs214 === errors;
                                                                          if (!valid29) {
                                                                            break;
                                                                          }
                                                                        }
                                                                      }
                                                                    } else {
                                                                      validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/aggregate", schemaPath: "#/properties/audioSessions/items/properties/aggregate/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                      return false;
                                                                    }
                                                                  }
                                                                  var valid26 = _errs212 === errors;
                                                                } else {
                                                                  var valid26 = true;
                                                                }
                                                                if (valid26) {
                                                                  if (data77.window !== void 0) {
                                                                    let data102 = data77.window;
                                                                    const _errs231 = errors;
                                                                    if (errors === _errs231) {
                                                                      if (Array.isArray(data102)) {
                                                                        if (data102.length > 8) {
                                                                          validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/window", schemaPath: "#/properties/audioSessions/items/properties/window/maxItems", keyword: "maxItems", params: { limit: 8 }, message: "must NOT have more than 8 items" }];
                                                                          return false;
                                                                        } else {
                                                                          var valid31 = true;
                                                                          const len13 = data102.length;
                                                                          for (let i13 = 0; i13 < len13; i13++) {
                                                                            let data103 = data102[i13];
                                                                            const _errs233 = errors;
                                                                            if (errors === _errs233) {
                                                                              if (data103 && typeof data103 == "object" && !Array.isArray(data103)) {
                                                                                let missing11;
                                                                                if (data103.samples === void 0 && (missing11 = "samples") || data103.rms === void 0 && (missing11 = "rms") || data103.rmsDbfs === void 0 && (missing11 = "rmsDbfs") || data103.peak === void 0 && (missing11 = "peak") || data103.clippingProportion === void 0 && (missing11 = "clippingProportion") || data103.zeroProportion === void 0 && (missing11 = "zeroProportion") || data103.invalidSamples === void 0 && (missing11 = "invalidSamples")) {
                                                                                  validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/window/" + i13, schemaPath: "#/properties/audioSessions/items/properties/window/items/required", keyword: "required", params: { missingProperty: missing11 }, message: "must have required property '" + missing11 + "'" }];
                                                                                  return false;
                                                                                } else {
                                                                                  const _errs235 = errors;
                                                                                  for (const key12 in data103) {
                                                                                    if (!(key12 === "samples" || key12 === "rms" || key12 === "rmsDbfs" || key12 === "peak" || key12 === "clippingProportion" || key12 === "zeroProportion" || key12 === "invalidSamples")) {
                                                                                      validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/window/" + i13, schemaPath: "#/properties/audioSessions/items/properties/window/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key12 }, message: "must NOT have additional properties" }];
                                                                                      return false;
                                                                                      break;
                                                                                    }
                                                                                  }
                                                                                  if (_errs235 === errors) {
                                                                                    if (data103.samples !== void 0) {
                                                                                      let data104 = data103.samples;
                                                                                      const _errs236 = errors;
                                                                                      if (!(typeof data104 == "number" && (!(data104 % 1) && !isNaN(data104)) && isFinite(data104))) {
                                                                                        validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/window/" + i13 + "/samples", schemaPath: "#/properties/audioSessions/items/properties/window/items/properties/samples/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                        return false;
                                                                                      }
                                                                                      if (errors === _errs236) {
                                                                                        if (typeof data104 == "number" && isFinite(data104)) {
                                                                                          if (data104 < 0 || isNaN(data104)) {
                                                                                            validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/window/" + i13 + "/samples", schemaPath: "#/properties/audioSessions/items/properties/window/items/properties/samples/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                            return false;
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                      var valid32 = _errs236 === errors;
                                                                                    } else {
                                                                                      var valid32 = true;
                                                                                    }
                                                                                    if (valid32) {
                                                                                      if (data103.rms !== void 0) {
                                                                                        let data105 = data103.rms;
                                                                                        const _errs238 = errors;
                                                                                        if (!(typeof data105 == "number" && isFinite(data105))) {
                                                                                          validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/window/" + i13 + "/rms", schemaPath: "#/properties/audioSessions/items/properties/window/items/properties/rms/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                                                                                          return false;
                                                                                        }
                                                                                        var valid32 = _errs238 === errors;
                                                                                      } else {
                                                                                        var valid32 = true;
                                                                                      }
                                                                                      if (valid32) {
                                                                                        if (data103.rmsDbfs !== void 0) {
                                                                                          let data106 = data103.rmsDbfs;
                                                                                          const _errs240 = errors;
                                                                                          if (!(typeof data106 == "number" && isFinite(data106))) {
                                                                                            validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/window/" + i13 + "/rmsDbfs", schemaPath: "#/properties/audioSessions/items/properties/window/items/properties/rmsDbfs/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                                                                                            return false;
                                                                                          }
                                                                                          var valid32 = _errs240 === errors;
                                                                                        } else {
                                                                                          var valid32 = true;
                                                                                        }
                                                                                        if (valid32) {
                                                                                          if (data103.peak !== void 0) {
                                                                                            let data107 = data103.peak;
                                                                                            const _errs242 = errors;
                                                                                            if (!(typeof data107 == "number" && isFinite(data107))) {
                                                                                              validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/window/" + i13 + "/peak", schemaPath: "#/properties/audioSessions/items/properties/window/items/properties/peak/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                                                                                              return false;
                                                                                            }
                                                                                            var valid32 = _errs242 === errors;
                                                                                          } else {
                                                                                            var valid32 = true;
                                                                                          }
                                                                                          if (valid32) {
                                                                                            if (data103.clippingProportion !== void 0) {
                                                                                              let data108 = data103.clippingProportion;
                                                                                              const _errs244 = errors;
                                                                                              if (!(typeof data108 == "number" && isFinite(data108))) {
                                                                                                validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/window/" + i13 + "/clippingProportion", schemaPath: "#/properties/audioSessions/items/properties/window/items/properties/clippingProportion/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                                                                                                return false;
                                                                                              }
                                                                                              var valid32 = _errs244 === errors;
                                                                                            } else {
                                                                                              var valid32 = true;
                                                                                            }
                                                                                            if (valid32) {
                                                                                              if (data103.zeroProportion !== void 0) {
                                                                                                let data109 = data103.zeroProportion;
                                                                                                const _errs246 = errors;
                                                                                                if (!(typeof data109 == "number" && isFinite(data109))) {
                                                                                                  validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/window/" + i13 + "/zeroProportion", schemaPath: "#/properties/audioSessions/items/properties/window/items/properties/zeroProportion/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                                                                                                  return false;
                                                                                                }
                                                                                                var valid32 = _errs246 === errors;
                                                                                              } else {
                                                                                                var valid32 = true;
                                                                                              }
                                                                                              if (valid32) {
                                                                                                if (data103.invalidSamples !== void 0) {
                                                                                                  let data110 = data103.invalidSamples;
                                                                                                  const _errs248 = errors;
                                                                                                  if (!(typeof data110 == "number" && (!(data110 % 1) && !isNaN(data110)) && isFinite(data110))) {
                                                                                                    validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/window/" + i13 + "/invalidSamples", schemaPath: "#/properties/audioSessions/items/properties/window/items/properties/invalidSamples/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                    return false;
                                                                                                  }
                                                                                                  if (errors === _errs248) {
                                                                                                    if (typeof data110 == "number" && isFinite(data110)) {
                                                                                                      if (data110 < 0 || isNaN(data110)) {
                                                                                                        validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/window/" + i13 + "/invalidSamples", schemaPath: "#/properties/audioSessions/items/properties/window/items/properties/invalidSamples/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                                        return false;
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                  var valid32 = _errs248 === errors;
                                                                                                } else {
                                                                                                  var valid32 = true;
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
                                                                                validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/window/" + i13, schemaPath: "#/properties/audioSessions/items/properties/window/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                                                return false;
                                                                              }
                                                                            }
                                                                            var valid31 = _errs233 === errors;
                                                                            if (!valid31) {
                                                                              break;
                                                                            }
                                                                          }
                                                                        }
                                                                      } else {
                                                                        validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/window", schemaPath: "#/properties/audioSessions/items/properties/window/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                        return false;
                                                                      }
                                                                    }
                                                                    var valid26 = _errs231 === errors;
                                                                  } else {
                                                                    var valid26 = true;
                                                                  }
                                                                  if (valid26) {
                                                                    if (data77.discontinuities !== void 0) {
                                                                      let data111 = data77.discontinuities;
                                                                      const _errs250 = errors;
                                                                      if (!(typeof data111 == "number" && (!(data111 % 1) && !isNaN(data111)) && isFinite(data111))) {
                                                                        validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/discontinuities", schemaPath: "#/properties/audioSessions/items/properties/discontinuities/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                        return false;
                                                                      }
                                                                      if (errors === _errs250) {
                                                                        if (typeof data111 == "number" && isFinite(data111)) {
                                                                          if (data111 < 0 || isNaN(data111)) {
                                                                            validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/discontinuities", schemaPath: "#/properties/audioSessions/items/properties/discontinuities/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                            return false;
                                                                          }
                                                                        }
                                                                      }
                                                                      var valid26 = _errs250 === errors;
                                                                    } else {
                                                                      var valid26 = true;
                                                                    }
                                                                    if (valid26) {
                                                                      if (data77.timestampErrors !== void 0) {
                                                                        let data112 = data77.timestampErrors;
                                                                        const _errs252 = errors;
                                                                        if (!(typeof data112 == "number" && (!(data112 % 1) && !isNaN(data112)) && isFinite(data112))) {
                                                                          validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/timestampErrors", schemaPath: "#/properties/audioSessions/items/properties/timestampErrors/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                          return false;
                                                                        }
                                                                        if (errors === _errs252) {
                                                                          if (typeof data112 == "number" && isFinite(data112)) {
                                                                            if (data112 < 0 || isNaN(data112)) {
                                                                              validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/timestampErrors", schemaPath: "#/properties/audioSessions/items/properties/timestampErrors/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                              return false;
                                                                            }
                                                                          }
                                                                        }
                                                                        var valid26 = _errs252 === errors;
                                                                      } else {
                                                                        var valid26 = true;
                                                                      }
                                                                      if (valid26) {
                                                                        if (data77.cleanup !== void 0) {
                                                                          const _errs254 = errors;
                                                                          if (typeof data77.cleanup !== "boolean") {
                                                                            validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/cleanup", schemaPath: "#/properties/audioSessions/items/properties/cleanup/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                                                            return false;
                                                                          }
                                                                          var valid26 = _errs254 === errors;
                                                                        } else {
                                                                          var valid26 = true;
                                                                        }
                                                                        if (valid26) {
                                                                          if (data77.engineConsumedFrames !== void 0) {
                                                                            let data114 = data77.engineConsumedFrames;
                                                                            const _errs256 = errors;
                                                                            if (!(typeof data114 == "number" && (!(data114 % 1) && !isNaN(data114)) && isFinite(data114)) && data114 !== null) {
                                                                              validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/engineConsumedFrames", schemaPath: "#/properties/audioSessions/items/properties/engineConsumedFrames/type", keyword: "type", params: { type: schema40.properties.audioSessions.items.properties.engineConsumedFrames.type }, message: "must be integer,null" }];
                                                                              return false;
                                                                            }
                                                                            if (errors === _errs256) {
                                                                              if (typeof data114 == "number" && isFinite(data114)) {
                                                                                if (data114 < 0 || isNaN(data114)) {
                                                                                  validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/engineConsumedFrames", schemaPath: "#/properties/audioSessions/items/properties/engineConsumedFrames/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                  return false;
                                                                                }
                                                                              }
                                                                            }
                                                                            var valid26 = _errs256 === errors;
                                                                          } else {
                                                                            var valid26 = true;
                                                                          }
                                                                          if (valid26) {
                                                                            if (data77.elapsedMs !== void 0) {
                                                                              let data115 = data77.elapsedMs;
                                                                              const _errs258 = errors;
                                                                              if (!(typeof data115 == "number" && (!(data115 % 1) && !isNaN(data115)) && isFinite(data115))) {
                                                                                validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/elapsedMs", schemaPath: "#/properties/audioSessions/items/properties/elapsedMs/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                return false;
                                                                              }
                                                                              if (errors === _errs258) {
                                                                                if (typeof data115 == "number" && isFinite(data115)) {
                                                                                  if (data115 > 12e3 || isNaN(data115)) {
                                                                                    validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/elapsedMs", schemaPath: "#/properties/audioSessions/items/properties/elapsedMs/maximum", keyword: "maximum", params: { comparison: "<=", limit: 12e3 }, message: "must be <= 12000" }];
                                                                                    return false;
                                                                                  } else {
                                                                                    if (data115 < 0 || isNaN(data115)) {
                                                                                      validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/elapsedMs", schemaPath: "#/properties/audioSessions/items/properties/elapsedMs/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                      return false;
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                              var valid26 = _errs258 === errors;
                                                                            } else {
                                                                              var valid26 = true;
                                                                            }
                                                                            if (valid26) {
                                                                              if (data77.sessionMute !== void 0) {
                                                                                let data116 = data77.sessionMute;
                                                                                const _errs260 = errors;
                                                                                if (typeof data116 !== "boolean" && data116 !== null) {
                                                                                  validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/sessionMute", schemaPath: "#/properties/audioSessions/items/properties/sessionMute/type", keyword: "type", params: { type: schema40.properties.audioSessions.items.properties.sessionMute.type }, message: "must be boolean,null" }];
                                                                                  return false;
                                                                                }
                                                                                var valid26 = _errs260 === errors;
                                                                              } else {
                                                                                var valid26 = true;
                                                                              }
                                                                              if (valid26) {
                                                                                if (data77.sessionLevel !== void 0) {
                                                                                  let data117 = data77.sessionLevel;
                                                                                  const _errs262 = errors;
                                                                                  if (!(typeof data117 == "number" && isFinite(data117)) && data117 !== null) {
                                                                                    validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/sessionLevel", schemaPath: "#/properties/audioSessions/items/properties/sessionLevel/type", keyword: "type", params: { type: schema40.properties.audioSessions.items.properties.sessionLevel.type }, message: "must be number,null" }];
                                                                                    return false;
                                                                                  }
                                                                                  if (errors === _errs262) {
                                                                                    if (typeof data117 == "number" && isFinite(data117)) {
                                                                                      if (data117 > 1 || isNaN(data117)) {
                                                                                        validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/sessionLevel", schemaPath: "#/properties/audioSessions/items/properties/sessionLevel/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1 }, message: "must be <= 1" }];
                                                                                        return false;
                                                                                      } else {
                                                                                        if (data117 < 0 || isNaN(data117)) {
                                                                                          validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/sessionLevel", schemaPath: "#/properties/audioSessions/items/properties/sessionLevel/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                          return false;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                  var valid26 = _errs262 === errors;
                                                                                } else {
                                                                                  var valid26 = true;
                                                                                }
                                                                                if (valid26) {
                                                                                  if (data77.sessionVolumeError !== void 0) {
                                                                                    let data118 = data77.sessionVolumeError;
                                                                                    const _errs264 = errors;
                                                                                    if (typeof data118 !== "string" && data118 !== null) {
                                                                                      validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/sessionVolumeError", schemaPath: "#/properties/audioSessions/items/properties/sessionVolumeError/type", keyword: "type", params: { type: schema40.properties.audioSessions.items.properties.sessionVolumeError.type }, message: "must be string,null" }];
                                                                                      return false;
                                                                                    }
                                                                                    if (errors === _errs264) {
                                                                                      if (typeof data118 === "string") {
                                                                                        if (func3(data118) > 2048) {
                                                                                          validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/sessionVolumeError", schemaPath: "#/properties/audioSessions/items/properties/sessionVolumeError/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                                          return false;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                    var valid26 = _errs264 === errors;
                                                                                  } else {
                                                                                    var valid26 = true;
                                                                                  }
                                                                                  if (valid26) {
                                                                                    if (data77.sessionVolumeObservedAt !== void 0) {
                                                                                      let data119 = data77.sessionVolumeObservedAt;
                                                                                      const _errs266 = errors;
                                                                                      if (typeof data119 !== "string" && data119 !== null) {
                                                                                        validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/sessionVolumeObservedAt", schemaPath: "#/properties/audioSessions/items/properties/sessionVolumeObservedAt/type", keyword: "type", params: { type: schema40.properties.audioSessions.items.properties.sessionVolumeObservedAt.type }, message: "must be string,null" }];
                                                                                        return false;
                                                                                      }
                                                                                      if (errors === _errs266) {
                                                                                        if (typeof data119 === "string") {
                                                                                          if (func3(data119) > 64) {
                                                                                            validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/sessionVolumeObservedAt", schemaPath: "#/properties/audioSessions/items/properties/sessionVolumeObservedAt/maxLength", keyword: "maxLength", params: { limit: 64 }, message: "must NOT have more than 64 characters" }];
                                                                                            return false;
                                                                                          } else {
                                                                                            if (func3(data119) < 20) {
                                                                                              validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/sessionVolumeObservedAt", schemaPath: "#/properties/audioSessions/items/properties/sessionVolumeObservedAt/minLength", keyword: "minLength", params: { limit: 20 }, message: "must NOT have fewer than 20 characters" }];
                                                                                              return false;
                                                                                            } else {
                                                                                              if (!pattern12.test(data119)) {
                                                                                                validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/sessionVolumeObservedAt", schemaPath: "#/properties/audioSessions/items/properties/sessionVolumeObservedAt/pattern", keyword: "pattern", params: { pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})$" }, message: 'must match pattern "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})$"' }];
                                                                                                return false;
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                      var valid26 = _errs266 === errors;
                                                                                    } else {
                                                                                      var valid26 = true;
                                                                                    }
                                                                                    if (valid26) {
                                                                                      if (data77.signalPeak !== void 0) {
                                                                                        let data120 = data77.signalPeak;
                                                                                        const _errs268 = errors;
                                                                                        if (!(typeof data120 == "number" && isFinite(data120)) && data120 !== null) {
                                                                                          validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/signalPeak", schemaPath: "#/properties/audioSessions/items/properties/signalPeak/type", keyword: "type", params: { type: schema40.properties.audioSessions.items.properties.signalPeak.type }, message: "must be number,null" }];
                                                                                          return false;
                                                                                        }
                                                                                        if (errors === _errs268) {
                                                                                          if (typeof data120 == "number" && isFinite(data120)) {
                                                                                            if (data120 > 0.1 || isNaN(data120)) {
                                                                                              validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/signalPeak", schemaPath: "#/properties/audioSessions/items/properties/signalPeak/maximum", keyword: "maximum", params: { comparison: "<=", limit: 0.1 }, message: "must be <= 0.1" }];
                                                                                              return false;
                                                                                            } else {
                                                                                              if (data120 < 0 || isNaN(data120)) {
                                                                                                validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11 + "/signalPeak", schemaPath: "#/properties/audioSessions/items/properties/signalPeak/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                                return false;
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                        var valid26 = _errs268 === errors;
                                                                                      } else {
                                                                                        var valid26 = true;
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
                                            validate25.errors = [{ instancePath: instancePath + "/audioSessions/" + i11, schemaPath: "#/properties/audioSessions/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                            return false;
                                          }
                                        }
                                        var valid25 = _errs175 === errors;
                                        if (!valid25) {
                                          break;
                                        }
                                      }
                                    }
                                  } else {
                                    validate25.errors = [{ instancePath: instancePath + "/audioSessions", schemaPath: "#/properties/audioSessions/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                    return false;
                                  }
                                }
                                var valid0 = _errs173 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.repairs !== void 0) {
                                  let data121 = data.repairs;
                                  const _errs270 = errors;
                                  if (errors === _errs270) {
                                    if (Array.isArray(data121)) {
                                      if (data121.length > 8) {
                                        validate25.errors = [{ instancePath: instancePath + "/repairs", schemaPath: "#/properties/repairs/maxItems", keyword: "maxItems", params: { limit: 8 }, message: "must NOT have more than 8 items" }];
                                        return false;
                                      } else {
                                        var valid33 = true;
                                        const len14 = data121.length;
                                        for (let i14 = 0; i14 < len14; i14++) {
                                          let data122 = data121[i14];
                                          const _errs272 = errors;
                                          if (errors === _errs272) {
                                            if (data122 && typeof data122 == "object" && !Array.isArray(data122)) {
                                              let missing12;
                                              if (data122.id === void 0 && (missing12 = "id") || data122.targetId === void 0 && (missing12 = "targetId") || data122.approved === void 0 && (missing12 = "approved") || data122.beforeMute === void 0 && (missing12 = "beforeMute") || data122.desiredMute === void 0 && (missing12 = "desiredMute") || data122.afterMute === void 0 && (missing12 = "afterMute") || data122.verified === void 0 && (missing12 = "verified") || data122.rolledBack === void 0 && (missing12 = "rolledBack") || data122.status === void 0 && (missing12 = "status")) {
                                                validate25.errors = [{ instancePath: instancePath + "/repairs/" + i14, schemaPath: "#/properties/repairs/items/required", keyword: "required", params: { missingProperty: missing12 }, message: "must have required property '" + missing12 + "'" }];
                                                return false;
                                              } else {
                                                const _errs274 = errors;
                                                for (const key13 in data122) {
                                                  if (!func1.call(schema40.properties.repairs.items.properties, key13)) {
                                                    validate25.errors = [{ instancePath: instancePath + "/repairs/" + i14, schemaPath: "#/properties/repairs/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key13 }, message: "must NOT have additional properties" }];
                                                    return false;
                                                    break;
                                                  }
                                                }
                                                if (_errs274 === errors) {
                                                  if (data122.id !== void 0) {
                                                    let data123 = data122.id;
                                                    const _errs275 = errors;
                                                    if (!(typeof data123 == "number" && (!(data123 % 1) && !isNaN(data123)) && isFinite(data123))) {
                                                      validate25.errors = [{ instancePath: instancePath + "/repairs/" + i14 + "/id", schemaPath: "#/properties/repairs/items/properties/id/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                      return false;
                                                    }
                                                    if (errors === _errs275) {
                                                      if (typeof data123 == "number" && isFinite(data123)) {
                                                        if (data123 < 0 || isNaN(data123)) {
                                                          validate25.errors = [{ instancePath: instancePath + "/repairs/" + i14 + "/id", schemaPath: "#/properties/repairs/items/properties/id/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                          return false;
                                                        }
                                                      }
                                                    }
                                                    var valid34 = _errs275 === errors;
                                                  } else {
                                                    var valid34 = true;
                                                  }
                                                  if (valid34) {
                                                    if (data122.targetId !== void 0) {
                                                      let data124 = data122.targetId;
                                                      const _errs277 = errors;
                                                      if (errors === _errs277) {
                                                        if (typeof data124 === "string") {
                                                          if (func3(data124) > 2048) {
                                                            validate25.errors = [{ instancePath: instancePath + "/repairs/" + i14 + "/targetId", schemaPath: "#/properties/repairs/items/properties/targetId/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                            return false;
                                                          }
                                                        } else {
                                                          validate25.errors = [{ instancePath: instancePath + "/repairs/" + i14 + "/targetId", schemaPath: "#/properties/repairs/items/properties/targetId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                          return false;
                                                        }
                                                      }
                                                      var valid34 = _errs277 === errors;
                                                    } else {
                                                      var valid34 = true;
                                                    }
                                                    if (valid34) {
                                                      if (data122.approved !== void 0) {
                                                        const _errs279 = errors;
                                                        if (typeof data122.approved !== "boolean") {
                                                          validate25.errors = [{ instancePath: instancePath + "/repairs/" + i14 + "/approved", schemaPath: "#/properties/repairs/items/properties/approved/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                                          return false;
                                                        }
                                                        var valid34 = _errs279 === errors;
                                                      } else {
                                                        var valid34 = true;
                                                      }
                                                      if (valid34) {
                                                        if (data122.beforeMute !== void 0) {
                                                          const _errs281 = errors;
                                                          if (typeof data122.beforeMute !== "boolean") {
                                                            validate25.errors = [{ instancePath: instancePath + "/repairs/" + i14 + "/beforeMute", schemaPath: "#/properties/repairs/items/properties/beforeMute/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                                            return false;
                                                          }
                                                          var valid34 = _errs281 === errors;
                                                        } else {
                                                          var valid34 = true;
                                                        }
                                                        if (valid34) {
                                                          if (data122.desiredMute !== void 0) {
                                                            const _errs283 = errors;
                                                            if (typeof data122.desiredMute !== "boolean") {
                                                              validate25.errors = [{ instancePath: instancePath + "/repairs/" + i14 + "/desiredMute", schemaPath: "#/properties/repairs/items/properties/desiredMute/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                                              return false;
                                                            }
                                                            var valid34 = _errs283 === errors;
                                                          } else {
                                                            var valid34 = true;
                                                          }
                                                          if (valid34) {
                                                            if (data122.afterMute !== void 0) {
                                                              let data128 = data122.afterMute;
                                                              const _errs285 = errors;
                                                              if (typeof data128 !== "boolean" && data128 !== null) {
                                                                validate25.errors = [{ instancePath: instancePath + "/repairs/" + i14 + "/afterMute", schemaPath: "#/properties/repairs/items/properties/afterMute/type", keyword: "type", params: { type: schema40.properties.repairs.items.properties.afterMute.type }, message: "must be boolean,null" }];
                                                                return false;
                                                              }
                                                              var valid34 = _errs285 === errors;
                                                            } else {
                                                              var valid34 = true;
                                                            }
                                                            if (valid34) {
                                                              if (data122.verified !== void 0) {
                                                                const _errs287 = errors;
                                                                if (typeof data122.verified !== "boolean") {
                                                                  validate25.errors = [{ instancePath: instancePath + "/repairs/" + i14 + "/verified", schemaPath: "#/properties/repairs/items/properties/verified/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                                                  return false;
                                                                }
                                                                var valid34 = _errs287 === errors;
                                                              } else {
                                                                var valid34 = true;
                                                              }
                                                              if (valid34) {
                                                                if (data122.rolledBack !== void 0) {
                                                                  const _errs289 = errors;
                                                                  if (typeof data122.rolledBack !== "boolean") {
                                                                    validate25.errors = [{ instancePath: instancePath + "/repairs/" + i14 + "/rolledBack", schemaPath: "#/properties/repairs/items/properties/rolledBack/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                                                    return false;
                                                                  }
                                                                  var valid34 = _errs289 === errors;
                                                                } else {
                                                                  var valid34 = true;
                                                                }
                                                                if (valid34) {
                                                                  if (data122.status !== void 0) {
                                                                    let data131 = data122.status;
                                                                    const _errs291 = errors;
                                                                    if (errors === _errs291) {
                                                                      if (typeof data131 === "string") {
                                                                        if (func3(data131) > 2048) {
                                                                          validate25.errors = [{ instancePath: instancePath + "/repairs/" + i14 + "/status", schemaPath: "#/properties/repairs/items/properties/status/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                          return false;
                                                                        }
                                                                      } else {
                                                                        validate25.errors = [{ instancePath: instancePath + "/repairs/" + i14 + "/status", schemaPath: "#/properties/repairs/items/properties/status/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                        return false;
                                                                      }
                                                                    }
                                                                    var valid34 = _errs291 === errors;
                                                                  } else {
                                                                    var valid34 = true;
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
                                              validate25.errors = [{ instancePath: instancePath + "/repairs/" + i14, schemaPath: "#/properties/repairs/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                              return false;
                                            }
                                          }
                                          var valid33 = _errs272 === errors;
                                          if (!valid33) {
                                            break;
                                          }
                                        }
                                      }
                                    } else {
                                      validate25.errors = [{ instancePath: instancePath + "/repairs", schemaPath: "#/properties/repairs/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                      return false;
                                    }
                                  }
                                  var valid0 = _errs270 === errors;
                                } else {
                                  var valid0 = true;
                                }
                                if (valid0) {
                                  if (data.limitations !== void 0) {
                                    let data132 = data.limitations;
                                    const _errs293 = errors;
                                    if (errors === _errs293) {
                                      if (Array.isArray(data132)) {
                                        if (data132.length > 32) {
                                          validate25.errors = [{ instancePath: instancePath + "/limitations", schemaPath: "#/properties/limitations/maxItems", keyword: "maxItems", params: { limit: 32 }, message: "must NOT have more than 32 items" }];
                                          return false;
                                        } else {
                                          var valid35 = true;
                                          const len15 = data132.length;
                                          for (let i15 = 0; i15 < len15; i15++) {
                                            let data133 = data132[i15];
                                            const _errs295 = errors;
                                            if (errors === _errs295) {
                                              if (typeof data133 === "string") {
                                                if (func3(data133) > 2048) {
                                                  validate25.errors = [{ instancePath: instancePath + "/limitations/" + i15, schemaPath: "#/properties/limitations/items/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                  return false;
                                                }
                                              } else {
                                                validate25.errors = [{ instancePath: instancePath + "/limitations/" + i15, schemaPath: "#/properties/limitations/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                return false;
                                              }
                                            }
                                            var valid35 = _errs295 === errors;
                                            if (!valid35) {
                                              break;
                                            }
                                          }
                                        }
                                      } else {
                                        validate25.errors = [{ instancePath: instancePath + "/limitations", schemaPath: "#/properties/limitations/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                        return false;
                                      }
                                    }
                                    var valid0 = _errs293 === errors;
                                  } else {
                                    var valid0 = true;
                                  }
                                  if (valid0) {
                                    if (data.routingReports !== void 0) {
                                      let data134 = data.routingReports;
                                      const _errs297 = errors;
                                      if (errors === _errs297) {
                                        if (Array.isArray(data134)) {
                                          if (data134.length > 8) {
                                            validate25.errors = [{ instancePath: instancePath + "/routingReports", schemaPath: "#/properties/routingReports/maxItems", keyword: "maxItems", params: { limit: 8 }, message: "must NOT have more than 8 items" }];
                                            return false;
                                          } else {
                                            var valid36 = true;
                                            const len16 = data134.length;
                                            for (let i16 = 0; i16 < len16; i16++) {
                                              let data135 = data134[i16];
                                              const _errs299 = errors;
                                              if (errors === _errs299) {
                                                if (data135 && typeof data135 == "object" && !Array.isArray(data135)) {
                                                  let missing13;
                                                  if (data135.sessionId === void 0 && (missing13 = "sessionId") || data135.targetId === void 0 && (missing13 = "targetId") || data135.mode === void 0 && (missing13 = "mode") || data135.observation === void 0 && (missing13 = "observation")) {
                                                    validate25.errors = [{ instancePath: instancePath + "/routingReports/" + i16, schemaPath: "#/properties/routingReports/items/required", keyword: "required", params: { missingProperty: missing13 }, message: "must have required property '" + missing13 + "'" }];
                                                    return false;
                                                  } else {
                                                    const _errs301 = errors;
                                                    for (const key14 in data135) {
                                                      if (!(key14 === "sessionId" || key14 === "targetId" || key14 === "mode" || key14 === "observation")) {
                                                        validate25.errors = [{ instancePath: instancePath + "/routingReports/" + i16, schemaPath: "#/properties/routingReports/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key14 }, message: "must NOT have additional properties" }];
                                                        return false;
                                                        break;
                                                      }
                                                    }
                                                    if (_errs301 === errors) {
                                                      if (data135.sessionId !== void 0) {
                                                        let data136 = data135.sessionId;
                                                        const _errs302 = errors;
                                                        if (!(typeof data136 == "number" && (!(data136 % 1) && !isNaN(data136)) && isFinite(data136))) {
                                                          validate25.errors = [{ instancePath: instancePath + "/routingReports/" + i16 + "/sessionId", schemaPath: "#/properties/routingReports/items/properties/sessionId/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                          return false;
                                                        }
                                                        if (errors === _errs302) {
                                                          if (typeof data136 == "number" && isFinite(data136)) {
                                                            if (data136 < 1 || isNaN(data136)) {
                                                              validate25.errors = [{ instancePath: instancePath + "/routingReports/" + i16 + "/sessionId", schemaPath: "#/properties/routingReports/items/properties/sessionId/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" }];
                                                              return false;
                                                            }
                                                          }
                                                        }
                                                        var valid37 = _errs302 === errors;
                                                      } else {
                                                        var valid37 = true;
                                                      }
                                                      if (valid37) {
                                                        if (data135.targetId !== void 0) {
                                                          let data137 = data135.targetId;
                                                          const _errs304 = errors;
                                                          if (errors === _errs304) {
                                                            if (typeof data137 === "string") {
                                                              if (func3(data137) > 2048) {
                                                                validate25.errors = [{ instancePath: instancePath + "/routingReports/" + i16 + "/targetId", schemaPath: "#/properties/routingReports/items/properties/targetId/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" }];
                                                                return false;
                                                              }
                                                            } else {
                                                              validate25.errors = [{ instancePath: instancePath + "/routingReports/" + i16 + "/targetId", schemaPath: "#/properties/routingReports/items/properties/targetId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                              return false;
                                                            }
                                                          }
                                                          var valid37 = _errs304 === errors;
                                                        } else {
                                                          var valid37 = true;
                                                        }
                                                        if (valid37) {
                                                          if (data135.mode !== void 0) {
                                                            let data138 = data135.mode;
                                                            const _errs306 = errors;
                                                            if (!(data138 === "left" || data138 === "right" || data138 === "tone")) {
                                                              validate25.errors = [{ instancePath: instancePath + "/routingReports/" + i16 + "/mode", schemaPath: "#/properties/routingReports/items/properties/mode/enum", keyword: "enum", params: { allowedValues: schema40.properties.routingReports.items.properties.mode.enum }, message: "must be equal to one of the allowed values" }];
                                                              return false;
                                                            }
                                                            var valid37 = _errs306 === errors;
                                                          } else {
                                                            var valid37 = true;
                                                          }
                                                          if (valid37) {
                                                            if (data135.observation !== void 0) {
                                                              let data139 = data135.observation;
                                                              const _errs307 = errors;
                                                              if (!(data139 === "left" || data139 === "right" || data139 === "both" || data139 === "neither" || data139 === "unsure")) {
                                                                validate25.errors = [{ instancePath: instancePath + "/routingReports/" + i16 + "/observation", schemaPath: "#/properties/routingReports/items/properties/observation/enum", keyword: "enum", params: { allowedValues: schema40.properties.routingReports.items.properties.observation.enum }, message: "must be equal to one of the allowed values" }];
                                                                return false;
                                                              }
                                                              var valid37 = _errs307 === errors;
                                                            } else {
                                                              var valid37 = true;
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                } else {
                                                  validate25.errors = [{ instancePath: instancePath + "/routingReports/" + i16, schemaPath: "#/properties/routingReports/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                  return false;
                                                }
                                              }
                                              var valid36 = _errs299 === errors;
                                              if (!valid36) {
                                                break;
                                              }
                                            }
                                          }
                                        } else {
                                          validate25.errors = [{ instancePath: instancePath + "/routingReports", schemaPath: "#/properties/routingReports/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                          return false;
                                        }
                                      }
                                      var valid0 = _errs297 === errors;
                                    } else {
                                      var valid0 = true;
                                    }
                                    if (valid0) {
                                      if (data.functionalVerification !== void 0) {
                                        let data140 = data.functionalVerification;
                                        const _errs308 = errors;
                                        const _errs309 = errors;
                                        let valid38 = false;
                                        const _errs310 = errors;
                                        if (data140 !== null) {
                                          const err62 = { instancePath: instancePath + "/functionalVerification", schemaPath: "#/properties/functionalVerification/anyOf/0/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                          if (vErrors === null) {
                                            vErrors = [err62];
                                          } else {
                                            vErrors.push(err62);
                                          }
                                          errors++;
                                        }
                                        var _valid6 = _errs310 === errors;
                                        valid38 = valid38 || _valid6;
                                        const _errs312 = errors;
                                        if (errors === _errs312) {
                                          if (data140 && typeof data140 == "object" && !Array.isArray(data140)) {
                                            let missing14;
                                            if (data140.repairId === void 0 && (missing14 = "repairId") || data140.beforeSessionId === void 0 && (missing14 = "beforeSessionId") || data140.afterSessionId === void 0 && (missing14 = "afterSessionId") || data140.comparable === void 0 && (missing14 = "comparable") || data140.reason === void 0 && (missing14 = "reason") || data140.changesDb === void 0 && (missing14 = "changesDb") || data140.userOutcome === void 0 && (missing14 = "userOutcome")) {
                                              const err63 = { instancePath: instancePath + "/functionalVerification", schemaPath: "#/properties/functionalVerification/anyOf/1/required", keyword: "required", params: { missingProperty: missing14 }, message: "must have required property '" + missing14 + "'" };
                                              if (vErrors === null) {
                                                vErrors = [err63];
                                              } else {
                                                vErrors.push(err63);
                                              }
                                              errors++;
                                            } else {
                                              const _errs314 = errors;
                                              for (const key15 in data140) {
                                                if (!(key15 === "repairId" || key15 === "beforeSessionId" || key15 === "afterSessionId" || key15 === "comparable" || key15 === "reason" || key15 === "changesDb" || key15 === "userOutcome")) {
                                                  const err64 = { instancePath: instancePath + "/functionalVerification", schemaPath: "#/properties/functionalVerification/anyOf/1/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key15 }, message: "must NOT have additional properties" };
                                                  if (vErrors === null) {
                                                    vErrors = [err64];
                                                  } else {
                                                    vErrors.push(err64);
                                                  }
                                                  errors++;
                                                  break;
                                                }
                                              }
                                              if (_errs314 === errors) {
                                                if (data140.repairId !== void 0) {
                                                  let data141 = data140.repairId;
                                                  const _errs315 = errors;
                                                  if (!(typeof data141 == "number" && (!(data141 % 1) && !isNaN(data141)) && isFinite(data141))) {
                                                    const err65 = { instancePath: instancePath + "/functionalVerification/repairId", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/repairId/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                    if (vErrors === null) {
                                                      vErrors = [err65];
                                                    } else {
                                                      vErrors.push(err65);
                                                    }
                                                    errors++;
                                                  }
                                                  if (errors === _errs315) {
                                                    if (typeof data141 == "number" && isFinite(data141)) {
                                                      if (data141 < 1 || isNaN(data141)) {
                                                        const err66 = { instancePath: instancePath + "/functionalVerification/repairId", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/repairId/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" };
                                                        if (vErrors === null) {
                                                          vErrors = [err66];
                                                        } else {
                                                          vErrors.push(err66);
                                                        }
                                                        errors++;
                                                      }
                                                    }
                                                  }
                                                  var valid39 = _errs315 === errors;
                                                } else {
                                                  var valid39 = true;
                                                }
                                                if (valid39) {
                                                  if (data140.beforeSessionId !== void 0) {
                                                    let data142 = data140.beforeSessionId;
                                                    const _errs317 = errors;
                                                    const _errs318 = errors;
                                                    let valid40 = false;
                                                    const _errs319 = errors;
                                                    if (!(typeof data142 == "number" && (!(data142 % 1) && !isNaN(data142)) && isFinite(data142))) {
                                                      const err67 = { instancePath: instancePath + "/functionalVerification/beforeSessionId", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/beforeSessionId/anyOf/0/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                      if (vErrors === null) {
                                                        vErrors = [err67];
                                                      } else {
                                                        vErrors.push(err67);
                                                      }
                                                      errors++;
                                                    }
                                                    if (errors === _errs319) {
                                                      if (typeof data142 == "number" && isFinite(data142)) {
                                                        if (data142 < 1 || isNaN(data142)) {
                                                          const err68 = { instancePath: instancePath + "/functionalVerification/beforeSessionId", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/beforeSessionId/anyOf/0/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" };
                                                          if (vErrors === null) {
                                                            vErrors = [err68];
                                                          } else {
                                                            vErrors.push(err68);
                                                          }
                                                          errors++;
                                                        }
                                                      }
                                                    }
                                                    var _valid7 = _errs319 === errors;
                                                    valid40 = valid40 || _valid7;
                                                    const _errs321 = errors;
                                                    if (data142 !== null) {
                                                      const err69 = { instancePath: instancePath + "/functionalVerification/beforeSessionId", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/beforeSessionId/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                      if (vErrors === null) {
                                                        vErrors = [err69];
                                                      } else {
                                                        vErrors.push(err69);
                                                      }
                                                      errors++;
                                                    }
                                                    var _valid7 = _errs321 === errors;
                                                    valid40 = valid40 || _valid7;
                                                    if (!valid40) {
                                                      const err70 = { instancePath: instancePath + "/functionalVerification/beforeSessionId", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/beforeSessionId/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                      if (vErrors === null) {
                                                        vErrors = [err70];
                                                      } else {
                                                        vErrors.push(err70);
                                                      }
                                                      errors++;
                                                    } else {
                                                      errors = _errs318;
                                                      if (vErrors !== null) {
                                                        if (_errs318) {
                                                          vErrors.length = _errs318;
                                                        } else {
                                                          vErrors = null;
                                                        }
                                                      }
                                                    }
                                                    var valid39 = _errs317 === errors;
                                                  } else {
                                                    var valid39 = true;
                                                  }
                                                  if (valid39) {
                                                    if (data140.afterSessionId !== void 0) {
                                                      let data143 = data140.afterSessionId;
                                                      const _errs323 = errors;
                                                      const _errs324 = errors;
                                                      let valid41 = false;
                                                      const _errs325 = errors;
                                                      if (!(typeof data143 == "number" && (!(data143 % 1) && !isNaN(data143)) && isFinite(data143))) {
                                                        const err71 = { instancePath: instancePath + "/functionalVerification/afterSessionId", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/afterSessionId/anyOf/0/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                        if (vErrors === null) {
                                                          vErrors = [err71];
                                                        } else {
                                                          vErrors.push(err71);
                                                        }
                                                        errors++;
                                                      }
                                                      if (errors === _errs325) {
                                                        if (typeof data143 == "number" && isFinite(data143)) {
                                                          if (data143 < 1 || isNaN(data143)) {
                                                            const err72 = { instancePath: instancePath + "/functionalVerification/afterSessionId", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/afterSessionId/anyOf/0/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" };
                                                            if (vErrors === null) {
                                                              vErrors = [err72];
                                                            } else {
                                                              vErrors.push(err72);
                                                            }
                                                            errors++;
                                                          }
                                                        }
                                                      }
                                                      var _valid8 = _errs325 === errors;
                                                      valid41 = valid41 || _valid8;
                                                      const _errs327 = errors;
                                                      if (data143 !== null) {
                                                        const err73 = { instancePath: instancePath + "/functionalVerification/afterSessionId", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/afterSessionId/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                        if (vErrors === null) {
                                                          vErrors = [err73];
                                                        } else {
                                                          vErrors.push(err73);
                                                        }
                                                        errors++;
                                                      }
                                                      var _valid8 = _errs327 === errors;
                                                      valid41 = valid41 || _valid8;
                                                      if (!valid41) {
                                                        const err74 = { instancePath: instancePath + "/functionalVerification/afterSessionId", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/afterSessionId/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                        if (vErrors === null) {
                                                          vErrors = [err74];
                                                        } else {
                                                          vErrors.push(err74);
                                                        }
                                                        errors++;
                                                      } else {
                                                        errors = _errs324;
                                                        if (vErrors !== null) {
                                                          if (_errs324) {
                                                            vErrors.length = _errs324;
                                                          } else {
                                                            vErrors = null;
                                                          }
                                                        }
                                                      }
                                                      var valid39 = _errs323 === errors;
                                                    } else {
                                                      var valid39 = true;
                                                    }
                                                    if (valid39) {
                                                      if (data140.comparable !== void 0) {
                                                        const _errs329 = errors;
                                                        if (typeof data140.comparable !== "boolean") {
                                                          const err75 = { instancePath: instancePath + "/functionalVerification/comparable", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/comparable/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                          if (vErrors === null) {
                                                            vErrors = [err75];
                                                          } else {
                                                            vErrors.push(err75);
                                                          }
                                                          errors++;
                                                        }
                                                        var valid39 = _errs329 === errors;
                                                      } else {
                                                        var valid39 = true;
                                                      }
                                                      if (valid39) {
                                                        if (data140.reason !== void 0) {
                                                          let data145 = data140.reason;
                                                          const _errs331 = errors;
                                                          if (errors === _errs331) {
                                                            if (typeof data145 === "string") {
                                                              if (func3(data145) > 2048) {
                                                                const err76 = { instancePath: instancePath + "/functionalVerification/reason", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/reason/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err76];
                                                                } else {
                                                                  vErrors.push(err76);
                                                                }
                                                                errors++;
                                                              }
                                                            } else {
                                                              const err77 = { instancePath: instancePath + "/functionalVerification/reason", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/reason/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                              if (vErrors === null) {
                                                                vErrors = [err77];
                                                              } else {
                                                                vErrors.push(err77);
                                                              }
                                                              errors++;
                                                            }
                                                          }
                                                          var valid39 = _errs331 === errors;
                                                        } else {
                                                          var valid39 = true;
                                                        }
                                                        if (valid39) {
                                                          if (data140.changesDb !== void 0) {
                                                            let data146 = data140.changesDb;
                                                            const _errs333 = errors;
                                                            if (errors === _errs333) {
                                                              if (Array.isArray(data146)) {
                                                                if (data146.length > 8) {
                                                                  const err78 = { instancePath: instancePath + "/functionalVerification/changesDb", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/changesDb/maxItems", keyword: "maxItems", params: { limit: 8 }, message: "must NOT have more than 8 items" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err78];
                                                                  } else {
                                                                    vErrors.push(err78);
                                                                  }
                                                                  errors++;
                                                                } else {
                                                                  var valid42 = true;
                                                                  const len17 = data146.length;
                                                                  for (let i17 = 0; i17 < len17; i17++) {
                                                                    let data147 = data146[i17];
                                                                    const _errs335 = errors;
                                                                    if (!(typeof data147 == "number" && isFinite(data147))) {
                                                                      const err79 = { instancePath: instancePath + "/functionalVerification/changesDb/" + i17, schemaPath: "#/properties/functionalVerification/anyOf/1/properties/changesDb/items/type", keyword: "type", params: { type: "number" }, message: "must be number" };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err79];
                                                                      } else {
                                                                        vErrors.push(err79);
                                                                      }
                                                                      errors++;
                                                                    }
                                                                    var valid42 = _errs335 === errors;
                                                                    if (!valid42) {
                                                                      break;
                                                                    }
                                                                  }
                                                                }
                                                              } else {
                                                                const err80 = { instancePath: instancePath + "/functionalVerification/changesDb", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/changesDb/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err80];
                                                                } else {
                                                                  vErrors.push(err80);
                                                                }
                                                                errors++;
                                                              }
                                                            }
                                                            var valid39 = _errs333 === errors;
                                                          } else {
                                                            var valid39 = true;
                                                          }
                                                          if (valid39) {
                                                            if (data140.userOutcome !== void 0) {
                                                              let data148 = data140.userOutcome;
                                                              const _errs337 = errors;
                                                              if (!(data148 === "unverified" || data148 === "improved" || data148 === "unchanged" || data148 === "worse")) {
                                                                const err81 = { instancePath: instancePath + "/functionalVerification/userOutcome", schemaPath: "#/properties/functionalVerification/anyOf/1/properties/userOutcome/enum", keyword: "enum", params: { allowedValues: schema40.properties.functionalVerification.anyOf[1].properties.userOutcome.enum }, message: "must be equal to one of the allowed values" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err81];
                                                                } else {
                                                                  vErrors.push(err81);
                                                                }
                                                                errors++;
                                                              }
                                                              var valid39 = _errs337 === errors;
                                                            } else {
                                                              var valid39 = true;
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
                                            const err82 = { instancePath: instancePath + "/functionalVerification", schemaPath: "#/properties/functionalVerification/anyOf/1/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                            if (vErrors === null) {
                                              vErrors = [err82];
                                            } else {
                                              vErrors.push(err82);
                                            }
                                            errors++;
                                          }
                                        }
                                        var _valid6 = _errs312 === errors;
                                        valid38 = valid38 || _valid6;
                                        if (!valid38) {
                                          const err83 = { instancePath: instancePath + "/functionalVerification", schemaPath: "#/properties/functionalVerification/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                          if (vErrors === null) {
                                            vErrors = [err83];
                                          } else {
                                            vErrors.push(err83);
                                          }
                                          errors++;
                                          validate25.errors = vErrors;
                                          return false;
                                        } else {
                                          errors = _errs309;
                                          if (vErrors !== null) {
                                            if (_errs309) {
                                              vErrors.length = _errs309;
                                            } else {
                                              vErrors = null;
                                            }
                                          }
                                        }
                                        var valid0 = _errs308 === errors;
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
          }
        }
      }
    } else {
      validate25.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate25.errors = vErrors;
  return errors === 0;
}
validate25.evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false };
export {
  analysis,
  diagnostic,
  engine,
  investigation,
  workbench
};
