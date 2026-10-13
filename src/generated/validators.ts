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
var schema31 = { "$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "https://anydevice.local/report-v2.schema.json", "title": "AnyDevice evidence report 2.0", "type": "object", "required": ["schemaVersion", "appVersion", "collectedAt", "os", "complete", "sanitized", "devices", "findings", "errors", "limitations", "provenance"], "properties": { "schemaVersion": { "const": "2.0" }, "appVersion": { "const": "0.2.0" }, "collectedAt": { "type": "string" }, "os": { "type": ["string", "null"] }, "complete": { "type": "boolean" }, "sanitized": { "type": "boolean" }, "devices": { "type": "array", "items": { "$ref": "#/$defs/device" } }, "previous": { "type": "object", "required": ["collectedAt", "devices", "provenance", "complete"], "properties": { "collectedAt": { "type": "string" }, "devices": { "type": "array", "items": { "$ref": "#/$defs/device" } }, "provenance": { "$ref": "#/$defs/provenance" }, "complete": { "type": "boolean" } }, "additionalProperties": false }, "findings": { "type": "array", "items": { "$ref": "#/$defs/finding" } }, "errors": { "type": "array", "items": { "type": "object", "required": ["kind", "message"], "properties": { "kind": { "enum": ["permission", "property", "enumeration", "malformed"] }, "message": { "type": "string" }, "deviceId": { "type": "string" } }, "additionalProperties": false } }, "limitations": { "type": "array", "items": { "type": "string" } }, "provenance": { "$ref": "#/$defs/provenance" } }, "additionalProperties": false, "$defs": { "device": { "type": "object", "required": ["id", "name", "category", "manufacturer", "hardwareIds", "parent", "location", "status", "problemCode", "vid", "pid", "transport", "observedAt", "source", "nodeKind", "physicalDeviceId", "interfacePaths", "present"], "properties": { "id": { "type": "string" }, "name": { "type": ["string", "null"] }, "category": { "type": ["string", "null"] }, "manufacturer": { "type": ["string", "null"] }, "hardwareIds": { "type": "array", "items": { "type": "string" } }, "parent": { "type": ["string", "null"] }, "location": { "type": ["string", "null"] }, "status": { "type": ["string", "null"] }, "problemCode": { "type": ["integer", "null"], "minimum": 0 }, "vid": { "type": ["string", "null"], "pattern": "^[0-9A-F]{4}$" }, "pid": { "type": ["string", "null"], "pattern": "^[0-9A-F]{4}$" }, "transport": { "enum": ["USB", "HID (transport unknown)", "Unknown"] }, "observedAt": { "type": "string" }, "source": { "type": "string" }, "nodeKind": { "const": "logical-pnp-node" }, "physicalDeviceId": { "type": "null" }, "interfacePaths": { "type": "array", "maxItems": 0 }, "present": { "type": ["boolean", "null"] } }, "additionalProperties": false }, "finding": { "type": "object", "required": ["id", "title", "severity", "classification", "confidence", "facts", "explanation", "evidence", "recommendation", "limitations"], "properties": { "id": { "type": "string" }, "deviceId": { "type": "string" }, "title": { "type": "string" }, "severity": { "enum": ["info", "warning", "error"] }, "classification": { "enum": ["Windows-reported error", "Confirmed observation"] }, "confidence": { "enum": ["high", "limited"] }, "facts": { "type": "array", "items": { "type": "string" } }, "explanation": { "type": "string" }, "evidence": { "type": "array", "items": { "type": "string" } }, "recommendation": { "type": "string" }, "limitations": { "type": "string" } }, "additionalProperties": false }, "provenance": { "type": "object", "required": ["provider", "providerVersion", "scope"], "properties": { "provider": { "enum": ["windows-cfgmgr32", "windows-pnp-fallback"] }, "providerVersion": { "const": "1.0" }, "scope": { "enum": ["usb-hid", "all-pnp"] } }, "additionalProperties": false } } };
var schema32 = { "type": "object", "required": ["id", "name", "category", "manufacturer", "hardwareIds", "parent", "location", "status", "problemCode", "vid", "pid", "transport", "observedAt", "source", "nodeKind", "physicalDeviceId", "interfacePaths", "present"], "properties": { "id": { "type": "string" }, "name": { "type": ["string", "null"] }, "category": { "type": ["string", "null"] }, "manufacturer": { "type": ["string", "null"] }, "hardwareIds": { "type": "array", "items": { "type": "string" } }, "parent": { "type": ["string", "null"] }, "location": { "type": ["string", "null"] }, "status": { "type": ["string", "null"] }, "problemCode": { "type": ["integer", "null"], "minimum": 0 }, "vid": { "type": ["string", "null"], "pattern": "^[0-9A-F]{4}$" }, "pid": { "type": ["string", "null"], "pattern": "^[0-9A-F]{4}$" }, "transport": { "enum": ["USB", "HID (transport unknown)", "Unknown"] }, "observedAt": { "type": "string" }, "source": { "type": "string" }, "nodeKind": { "const": "logical-pnp-node" }, "physicalDeviceId": { "type": "null" }, "interfacePaths": { "type": "array", "maxItems": 0 }, "present": { "type": ["boolean", "null"] } }, "additionalProperties": false };
var schema34 = { "type": "object", "required": ["provider", "providerVersion", "scope"], "properties": { "provider": { "enum": ["windows-cfgmgr32", "windows-pnp-fallback"] }, "providerVersion": { "const": "1.0" }, "scope": { "enum": ["usb-hid", "all-pnp"] } }, "additionalProperties": false };
var schema35 = { "type": "object", "required": ["id", "title", "severity", "classification", "confidence", "facts", "explanation", "evidence", "recommendation", "limitations"], "properties": { "id": { "type": "string" }, "deviceId": { "type": "string" }, "title": { "type": "string" }, "severity": { "enum": ["info", "warning", "error"] }, "classification": { "enum": ["Windows-reported error", "Confirmed observation"] }, "confidence": { "enum": ["high", "limited"] }, "facts": { "type": "array", "items": { "type": "string" } }, "explanation": { "type": "string" }, "evidence": { "type": "array", "items": { "type": "string" } }, "recommendation": { "type": "string" }, "limitations": { "type": "string" } }, "additionalProperties": false };
var func1 = Object.prototype.hasOwnProperty;
var pattern4 = new RegExp("^[0-9A-F]{4}$", "u");
function validate20(data, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {}) {
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
                          let data27 = data.previous;
                          const _errs54 = errors;
                          if (errors === _errs54) {
                            if (data27 && typeof data27 == "object" && !Array.isArray(data27)) {
                              let missing2;
                              if (data27.collectedAt === void 0 && (missing2 = "collectedAt") || data27.devices === void 0 && (missing2 = "devices") || data27.provenance === void 0 && (missing2 = "provenance") || data27.complete === void 0 && (missing2 = "complete")) {
                                validate20.errors = [{ instancePath: instancePath + "/previous", schemaPath: "#/properties/previous/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
                                return false;
                              } else {
                                const _errs56 = errors;
                                for (const key2 in data27) {
                                  if (!(key2 === "collectedAt" || key2 === "devices" || key2 === "provenance" || key2 === "complete")) {
                                    validate20.errors = [{ instancePath: instancePath + "/previous", schemaPath: "#/properties/previous/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                                    return false;
                                    break;
                                  }
                                }
                                if (_errs56 === errors) {
                                  if (data27.collectedAt !== void 0) {
                                    const _errs57 = errors;
                                    if (typeof data27.collectedAt !== "string") {
                                      validate20.errors = [{ instancePath: instancePath + "/previous/collectedAt", schemaPath: "#/properties/previous/properties/collectedAt/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                      return false;
                                    }
                                    var valid5 = _errs57 === errors;
                                  } else {
                                    var valid5 = true;
                                  }
                                  if (valid5) {
                                    if (data27.devices !== void 0) {
                                      let data29 = data27.devices;
                                      const _errs59 = errors;
                                      if (errors === _errs59) {
                                        if (Array.isArray(data29)) {
                                          var valid6 = true;
                                          const len2 = data29.length;
                                          for (let i2 = 0; i2 < len2; i2++) {
                                            let data30 = data29[i2];
                                            const _errs61 = errors;
                                            const _errs62 = errors;
                                            if (errors === _errs62) {
                                              if (data30 && typeof data30 == "object" && !Array.isArray(data30)) {
                                                let missing3;
                                                if (data30.id === void 0 && (missing3 = "id") || data30.name === void 0 && (missing3 = "name") || data30.category === void 0 && (missing3 = "category") || data30.manufacturer === void 0 && (missing3 = "manufacturer") || data30.hardwareIds === void 0 && (missing3 = "hardwareIds") || data30.parent === void 0 && (missing3 = "parent") || data30.location === void 0 && (missing3 = "location") || data30.status === void 0 && (missing3 = "status") || data30.problemCode === void 0 && (missing3 = "problemCode") || data30.vid === void 0 && (missing3 = "vid") || data30.pid === void 0 && (missing3 = "pid") || data30.transport === void 0 && (missing3 = "transport") || data30.observedAt === void 0 && (missing3 = "observedAt") || data30.source === void 0 && (missing3 = "source") || data30.nodeKind === void 0 && (missing3 = "nodeKind") || data30.physicalDeviceId === void 0 && (missing3 = "physicalDeviceId") || data30.interfacePaths === void 0 && (missing3 = "interfacePaths") || data30.present === void 0 && (missing3 = "present")) {
                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2, schemaPath: "#/$defs/device/required", keyword: "required", params: { missingProperty: missing3 }, message: "must have required property '" + missing3 + "'" }];
                                                  return false;
                                                } else {
                                                  const _errs64 = errors;
                                                  for (const key3 in data30) {
                                                    if (!func1.call(schema32.properties, key3)) {
                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2, schemaPath: "#/$defs/device/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties" }];
                                                      return false;
                                                      break;
                                                    }
                                                  }
                                                  if (_errs64 === errors) {
                                                    if (data30.id !== void 0) {
                                                      const _errs65 = errors;
                                                      if (typeof data30.id !== "string") {
                                                        validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/id", schemaPath: "#/$defs/device/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                        return false;
                                                      }
                                                      var valid8 = _errs65 === errors;
                                                    } else {
                                                      var valid8 = true;
                                                    }
                                                    if (valid8) {
                                                      if (data30.name !== void 0) {
                                                        let data32 = data30.name;
                                                        const _errs67 = errors;
                                                        if (typeof data32 !== "string" && data32 !== null) {
                                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/name", schemaPath: "#/$defs/device/properties/name/type", keyword: "type", params: { type: schema32.properties.name.type }, message: "must be string,null" }];
                                                          return false;
                                                        }
                                                        var valid8 = _errs67 === errors;
                                                      } else {
                                                        var valid8 = true;
                                                      }
                                                      if (valid8) {
                                                        if (data30.category !== void 0) {
                                                          let data33 = data30.category;
                                                          const _errs69 = errors;
                                                          if (typeof data33 !== "string" && data33 !== null) {
                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/category", schemaPath: "#/$defs/device/properties/category/type", keyword: "type", params: { type: schema32.properties.category.type }, message: "must be string,null" }];
                                                            return false;
                                                          }
                                                          var valid8 = _errs69 === errors;
                                                        } else {
                                                          var valid8 = true;
                                                        }
                                                        if (valid8) {
                                                          if (data30.manufacturer !== void 0) {
                                                            let data34 = data30.manufacturer;
                                                            const _errs71 = errors;
                                                            if (typeof data34 !== "string" && data34 !== null) {
                                                              validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/manufacturer", schemaPath: "#/$defs/device/properties/manufacturer/type", keyword: "type", params: { type: schema32.properties.manufacturer.type }, message: "must be string,null" }];
                                                              return false;
                                                            }
                                                            var valid8 = _errs71 === errors;
                                                          } else {
                                                            var valid8 = true;
                                                          }
                                                          if (valid8) {
                                                            if (data30.hardwareIds !== void 0) {
                                                              let data35 = data30.hardwareIds;
                                                              const _errs73 = errors;
                                                              if (errors === _errs73) {
                                                                if (Array.isArray(data35)) {
                                                                  var valid9 = true;
                                                                  const len3 = data35.length;
                                                                  for (let i3 = 0; i3 < len3; i3++) {
                                                                    const _errs75 = errors;
                                                                    if (typeof data35[i3] !== "string") {
                                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/hardwareIds/" + i3, schemaPath: "#/$defs/device/properties/hardwareIds/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                      return false;
                                                                    }
                                                                    var valid9 = _errs75 === errors;
                                                                    if (!valid9) {
                                                                      break;
                                                                    }
                                                                  }
                                                                } else {
                                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/hardwareIds", schemaPath: "#/$defs/device/properties/hardwareIds/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                  return false;
                                                                }
                                                              }
                                                              var valid8 = _errs73 === errors;
                                                            } else {
                                                              var valid8 = true;
                                                            }
                                                            if (valid8) {
                                                              if (data30.parent !== void 0) {
                                                                let data37 = data30.parent;
                                                                const _errs77 = errors;
                                                                if (typeof data37 !== "string" && data37 !== null) {
                                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/parent", schemaPath: "#/$defs/device/properties/parent/type", keyword: "type", params: { type: schema32.properties.parent.type }, message: "must be string,null" }];
                                                                  return false;
                                                                }
                                                                var valid8 = _errs77 === errors;
                                                              } else {
                                                                var valid8 = true;
                                                              }
                                                              if (valid8) {
                                                                if (data30.location !== void 0) {
                                                                  let data38 = data30.location;
                                                                  const _errs79 = errors;
                                                                  if (typeof data38 !== "string" && data38 !== null) {
                                                                    validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/location", schemaPath: "#/$defs/device/properties/location/type", keyword: "type", params: { type: schema32.properties.location.type }, message: "must be string,null" }];
                                                                    return false;
                                                                  }
                                                                  var valid8 = _errs79 === errors;
                                                                } else {
                                                                  var valid8 = true;
                                                                }
                                                                if (valid8) {
                                                                  if (data30.status !== void 0) {
                                                                    let data39 = data30.status;
                                                                    const _errs81 = errors;
                                                                    if (typeof data39 !== "string" && data39 !== null) {
                                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/status", schemaPath: "#/$defs/device/properties/status/type", keyword: "type", params: { type: schema32.properties.status.type }, message: "must be string,null" }];
                                                                      return false;
                                                                    }
                                                                    var valid8 = _errs81 === errors;
                                                                  } else {
                                                                    var valid8 = true;
                                                                  }
                                                                  if (valid8) {
                                                                    if (data30.problemCode !== void 0) {
                                                                      let data40 = data30.problemCode;
                                                                      const _errs83 = errors;
                                                                      if (!(typeof data40 == "number" && (!(data40 % 1) && !isNaN(data40)) && isFinite(data40)) && data40 !== null) {
                                                                        validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/problemCode", schemaPath: "#/$defs/device/properties/problemCode/type", keyword: "type", params: { type: schema32.properties.problemCode.type }, message: "must be integer,null" }];
                                                                        return false;
                                                                      }
                                                                      if (errors === _errs83) {
                                                                        if (typeof data40 == "number" && isFinite(data40)) {
                                                                          if (data40 < 0 || isNaN(data40)) {
                                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/problemCode", schemaPath: "#/$defs/device/properties/problemCode/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                            return false;
                                                                          }
                                                                        }
                                                                      }
                                                                      var valid8 = _errs83 === errors;
                                                                    } else {
                                                                      var valid8 = true;
                                                                    }
                                                                    if (valid8) {
                                                                      if (data30.vid !== void 0) {
                                                                        let data41 = data30.vid;
                                                                        const _errs85 = errors;
                                                                        if (typeof data41 !== "string" && data41 !== null) {
                                                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/vid", schemaPath: "#/$defs/device/properties/vid/type", keyword: "type", params: { type: schema32.properties.vid.type }, message: "must be string,null" }];
                                                                          return false;
                                                                        }
                                                                        if (errors === _errs85) {
                                                                          if (typeof data41 === "string") {
                                                                            if (!pattern4.test(data41)) {
                                                                              validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/vid", schemaPath: "#/$defs/device/properties/vid/pattern", keyword: "pattern", params: { pattern: "^[0-9A-F]{4}$" }, message: 'must match pattern "^[0-9A-F]{4}$"' }];
                                                                              return false;
                                                                            }
                                                                          }
                                                                        }
                                                                        var valid8 = _errs85 === errors;
                                                                      } else {
                                                                        var valid8 = true;
                                                                      }
                                                                      if (valid8) {
                                                                        if (data30.pid !== void 0) {
                                                                          let data42 = data30.pid;
                                                                          const _errs87 = errors;
                                                                          if (typeof data42 !== "string" && data42 !== null) {
                                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/pid", schemaPath: "#/$defs/device/properties/pid/type", keyword: "type", params: { type: schema32.properties.pid.type }, message: "must be string,null" }];
                                                                            return false;
                                                                          }
                                                                          if (errors === _errs87) {
                                                                            if (typeof data42 === "string") {
                                                                              if (!pattern4.test(data42)) {
                                                                                validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/pid", schemaPath: "#/$defs/device/properties/pid/pattern", keyword: "pattern", params: { pattern: "^[0-9A-F]{4}$" }, message: 'must match pattern "^[0-9A-F]{4}$"' }];
                                                                                return false;
                                                                              }
                                                                            }
                                                                          }
                                                                          var valid8 = _errs87 === errors;
                                                                        } else {
                                                                          var valid8 = true;
                                                                        }
                                                                        if (valid8) {
                                                                          if (data30.transport !== void 0) {
                                                                            let data43 = data30.transport;
                                                                            const _errs89 = errors;
                                                                            if (!(data43 === "USB" || data43 === "HID (transport unknown)" || data43 === "Unknown")) {
                                                                              validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/transport", schemaPath: "#/$defs/device/properties/transport/enum", keyword: "enum", params: { allowedValues: schema32.properties.transport.enum }, message: "must be equal to one of the allowed values" }];
                                                                              return false;
                                                                            }
                                                                            var valid8 = _errs89 === errors;
                                                                          } else {
                                                                            var valid8 = true;
                                                                          }
                                                                          if (valid8) {
                                                                            if (data30.observedAt !== void 0) {
                                                                              const _errs90 = errors;
                                                                              if (typeof data30.observedAt !== "string") {
                                                                                validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/observedAt", schemaPath: "#/$defs/device/properties/observedAt/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                return false;
                                                                              }
                                                                              var valid8 = _errs90 === errors;
                                                                            } else {
                                                                              var valid8 = true;
                                                                            }
                                                                            if (valid8) {
                                                                              if (data30.source !== void 0) {
                                                                                const _errs92 = errors;
                                                                                if (typeof data30.source !== "string") {
                                                                                  validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/source", schemaPath: "#/$defs/device/properties/source/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                  return false;
                                                                                }
                                                                                var valid8 = _errs92 === errors;
                                                                              } else {
                                                                                var valid8 = true;
                                                                              }
                                                                              if (valid8) {
                                                                                if (data30.nodeKind !== void 0) {
                                                                                  const _errs94 = errors;
                                                                                  if ("logical-pnp-node" !== data30.nodeKind) {
                                                                                    validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/nodeKind", schemaPath: "#/$defs/device/properties/nodeKind/const", keyword: "const", params: { allowedValue: "logical-pnp-node" }, message: "must be equal to constant" }];
                                                                                    return false;
                                                                                  }
                                                                                  var valid8 = _errs94 === errors;
                                                                                } else {
                                                                                  var valid8 = true;
                                                                                }
                                                                                if (valid8) {
                                                                                  if (data30.physicalDeviceId !== void 0) {
                                                                                    const _errs95 = errors;
                                                                                    if (data30.physicalDeviceId !== null) {
                                                                                      validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/physicalDeviceId", schemaPath: "#/$defs/device/properties/physicalDeviceId/type", keyword: "type", params: { type: "null" }, message: "must be null" }];
                                                                                      return false;
                                                                                    }
                                                                                    var valid8 = _errs95 === errors;
                                                                                  } else {
                                                                                    var valid8 = true;
                                                                                  }
                                                                                  if (valid8) {
                                                                                    if (data30.interfacePaths !== void 0) {
                                                                                      let data48 = data30.interfacePaths;
                                                                                      const _errs97 = errors;
                                                                                      if (errors === _errs97) {
                                                                                        if (Array.isArray(data48)) {
                                                                                          if (data48.length > 0) {
                                                                                            validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/interfacePaths", schemaPath: "#/$defs/device/properties/interfacePaths/maxItems", keyword: "maxItems", params: { limit: 0 }, message: "must NOT have more than 0 items" }];
                                                                                            return false;
                                                                                          }
                                                                                        } else {
                                                                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/interfacePaths", schemaPath: "#/$defs/device/properties/interfacePaths/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                          return false;
                                                                                        }
                                                                                      }
                                                                                      var valid8 = _errs97 === errors;
                                                                                    } else {
                                                                                      var valid8 = true;
                                                                                    }
                                                                                    if (valid8) {
                                                                                      if (data30.present !== void 0) {
                                                                                        let data49 = data30.present;
                                                                                        const _errs99 = errors;
                                                                                        if (typeof data49 !== "boolean" && data49 !== null) {
                                                                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2 + "/present", schemaPath: "#/$defs/device/properties/present/type", keyword: "type", params: { type: schema32.properties.present.type }, message: "must be boolean,null" }];
                                                                                          return false;
                                                                                        }
                                                                                        var valid8 = _errs99 === errors;
                                                                                      } else {
                                                                                        var valid8 = true;
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
                                                validate20.errors = [{ instancePath: instancePath + "/previous/devices/" + i2, schemaPath: "#/$defs/device/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                return false;
                                              }
                                            }
                                            var valid6 = _errs61 === errors;
                                            if (!valid6) {
                                              break;
                                            }
                                          }
                                        } else {
                                          validate20.errors = [{ instancePath: instancePath + "/previous/devices", schemaPath: "#/properties/previous/properties/devices/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                          return false;
                                        }
                                      }
                                      var valid5 = _errs59 === errors;
                                    } else {
                                      var valid5 = true;
                                    }
                                    if (valid5) {
                                      if (data27.provenance !== void 0) {
                                        let data50 = data27.provenance;
                                        const _errs101 = errors;
                                        const _errs102 = errors;
                                        if (errors === _errs102) {
                                          if (data50 && typeof data50 == "object" && !Array.isArray(data50)) {
                                            let missing4;
                                            if (data50.provider === void 0 && (missing4 = "provider") || data50.providerVersion === void 0 && (missing4 = "providerVersion") || data50.scope === void 0 && (missing4 = "scope")) {
                                              validate20.errors = [{ instancePath: instancePath + "/previous/provenance", schemaPath: "#/$defs/provenance/required", keyword: "required", params: { missingProperty: missing4 }, message: "must have required property '" + missing4 + "'" }];
                                              return false;
                                            } else {
                                              const _errs104 = errors;
                                              for (const key4 in data50) {
                                                if (!(key4 === "provider" || key4 === "providerVersion" || key4 === "scope")) {
                                                  validate20.errors = [{ instancePath: instancePath + "/previous/provenance", schemaPath: "#/$defs/provenance/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties" }];
                                                  return false;
                                                  break;
                                                }
                                              }
                                              if (_errs104 === errors) {
                                                if (data50.provider !== void 0) {
                                                  let data51 = data50.provider;
                                                  const _errs105 = errors;
                                                  if (!(data51 === "windows-cfgmgr32" || data51 === "windows-pnp-fallback")) {
                                                    validate20.errors = [{ instancePath: instancePath + "/previous/provenance/provider", schemaPath: "#/$defs/provenance/properties/provider/enum", keyword: "enum", params: { allowedValues: schema34.properties.provider.enum }, message: "must be equal to one of the allowed values" }];
                                                    return false;
                                                  }
                                                  var valid11 = _errs105 === errors;
                                                } else {
                                                  var valid11 = true;
                                                }
                                                if (valid11) {
                                                  if (data50.providerVersion !== void 0) {
                                                    const _errs106 = errors;
                                                    if ("1.0" !== data50.providerVersion) {
                                                      validate20.errors = [{ instancePath: instancePath + "/previous/provenance/providerVersion", schemaPath: "#/$defs/provenance/properties/providerVersion/const", keyword: "const", params: { allowedValue: "1.0" }, message: "must be equal to constant" }];
                                                      return false;
                                                    }
                                                    var valid11 = _errs106 === errors;
                                                  } else {
                                                    var valid11 = true;
                                                  }
                                                  if (valid11) {
                                                    if (data50.scope !== void 0) {
                                                      let data53 = data50.scope;
                                                      const _errs107 = errors;
                                                      if (!(data53 === "usb-hid" || data53 === "all-pnp")) {
                                                        validate20.errors = [{ instancePath: instancePath + "/previous/provenance/scope", schemaPath: "#/$defs/provenance/properties/scope/enum", keyword: "enum", params: { allowedValues: schema34.properties.scope.enum }, message: "must be equal to one of the allowed values" }];
                                                        return false;
                                                      }
                                                      var valid11 = _errs107 === errors;
                                                    } else {
                                                      var valid11 = true;
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
                                        var valid5 = _errs101 === errors;
                                      } else {
                                        var valid5 = true;
                                      }
                                      if (valid5) {
                                        if (data27.complete !== void 0) {
                                          const _errs108 = errors;
                                          if (typeof data27.complete !== "boolean") {
                                            validate20.errors = [{ instancePath: instancePath + "/previous/complete", schemaPath: "#/properties/previous/properties/complete/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                            return false;
                                          }
                                          var valid5 = _errs108 === errors;
                                        } else {
                                          var valid5 = true;
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
                          var valid0 = _errs54 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.findings !== void 0) {
                            let data55 = data.findings;
                            const _errs110 = errors;
                            if (errors === _errs110) {
                              if (Array.isArray(data55)) {
                                var valid12 = true;
                                const len4 = data55.length;
                                for (let i4 = 0; i4 < len4; i4++) {
                                  let data56 = data55[i4];
                                  const _errs112 = errors;
                                  const _errs113 = errors;
                                  if (errors === _errs113) {
                                    if (data56 && typeof data56 == "object" && !Array.isArray(data56)) {
                                      let missing5;
                                      if (data56.id === void 0 && (missing5 = "id") || data56.title === void 0 && (missing5 = "title") || data56.severity === void 0 && (missing5 = "severity") || data56.classification === void 0 && (missing5 = "classification") || data56.confidence === void 0 && (missing5 = "confidence") || data56.facts === void 0 && (missing5 = "facts") || data56.explanation === void 0 && (missing5 = "explanation") || data56.evidence === void 0 && (missing5 = "evidence") || data56.recommendation === void 0 && (missing5 = "recommendation") || data56.limitations === void 0 && (missing5 = "limitations")) {
                                        validate20.errors = [{ instancePath: instancePath + "/findings/" + i4, schemaPath: "#/$defs/finding/required", keyword: "required", params: { missingProperty: missing5 }, message: "must have required property '" + missing5 + "'" }];
                                        return false;
                                      } else {
                                        const _errs115 = errors;
                                        for (const key5 in data56) {
                                          if (!func1.call(schema35.properties, key5)) {
                                            validate20.errors = [{ instancePath: instancePath + "/findings/" + i4, schemaPath: "#/$defs/finding/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key5 }, message: "must NOT have additional properties" }];
                                            return false;
                                            break;
                                          }
                                        }
                                        if (_errs115 === errors) {
                                          if (data56.id !== void 0) {
                                            const _errs116 = errors;
                                            if (typeof data56.id !== "string") {
                                              validate20.errors = [{ instancePath: instancePath + "/findings/" + i4 + "/id", schemaPath: "#/$defs/finding/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                              return false;
                                            }
                                            var valid14 = _errs116 === errors;
                                          } else {
                                            var valid14 = true;
                                          }
                                          if (valid14) {
                                            if (data56.deviceId !== void 0) {
                                              const _errs118 = errors;
                                              if (typeof data56.deviceId !== "string") {
                                                validate20.errors = [{ instancePath: instancePath + "/findings/" + i4 + "/deviceId", schemaPath: "#/$defs/finding/properties/deviceId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                return false;
                                              }
                                              var valid14 = _errs118 === errors;
                                            } else {
                                              var valid14 = true;
                                            }
                                            if (valid14) {
                                              if (data56.title !== void 0) {
                                                const _errs120 = errors;
                                                if (typeof data56.title !== "string") {
                                                  validate20.errors = [{ instancePath: instancePath + "/findings/" + i4 + "/title", schemaPath: "#/$defs/finding/properties/title/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                  return false;
                                                }
                                                var valid14 = _errs120 === errors;
                                              } else {
                                                var valid14 = true;
                                              }
                                              if (valid14) {
                                                if (data56.severity !== void 0) {
                                                  let data60 = data56.severity;
                                                  const _errs122 = errors;
                                                  if (!(data60 === "info" || data60 === "warning" || data60 === "error")) {
                                                    validate20.errors = [{ instancePath: instancePath + "/findings/" + i4 + "/severity", schemaPath: "#/$defs/finding/properties/severity/enum", keyword: "enum", params: { allowedValues: schema35.properties.severity.enum }, message: "must be equal to one of the allowed values" }];
                                                    return false;
                                                  }
                                                  var valid14 = _errs122 === errors;
                                                } else {
                                                  var valid14 = true;
                                                }
                                                if (valid14) {
                                                  if (data56.classification !== void 0) {
                                                    let data61 = data56.classification;
                                                    const _errs123 = errors;
                                                    if (!(data61 === "Windows-reported error" || data61 === "Confirmed observation")) {
                                                      validate20.errors = [{ instancePath: instancePath + "/findings/" + i4 + "/classification", schemaPath: "#/$defs/finding/properties/classification/enum", keyword: "enum", params: { allowedValues: schema35.properties.classification.enum }, message: "must be equal to one of the allowed values" }];
                                                      return false;
                                                    }
                                                    var valid14 = _errs123 === errors;
                                                  } else {
                                                    var valid14 = true;
                                                  }
                                                  if (valid14) {
                                                    if (data56.confidence !== void 0) {
                                                      let data62 = data56.confidence;
                                                      const _errs124 = errors;
                                                      if (!(data62 === "high" || data62 === "limited")) {
                                                        validate20.errors = [{ instancePath: instancePath + "/findings/" + i4 + "/confidence", schemaPath: "#/$defs/finding/properties/confidence/enum", keyword: "enum", params: { allowedValues: schema35.properties.confidence.enum }, message: "must be equal to one of the allowed values" }];
                                                        return false;
                                                      }
                                                      var valid14 = _errs124 === errors;
                                                    } else {
                                                      var valid14 = true;
                                                    }
                                                    if (valid14) {
                                                      if (data56.facts !== void 0) {
                                                        let data63 = data56.facts;
                                                        const _errs125 = errors;
                                                        if (errors === _errs125) {
                                                          if (Array.isArray(data63)) {
                                                            var valid15 = true;
                                                            const len5 = data63.length;
                                                            for (let i5 = 0; i5 < len5; i5++) {
                                                              const _errs127 = errors;
                                                              if (typeof data63[i5] !== "string") {
                                                                validate20.errors = [{ instancePath: instancePath + "/findings/" + i4 + "/facts/" + i5, schemaPath: "#/$defs/finding/properties/facts/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                return false;
                                                              }
                                                              var valid15 = _errs127 === errors;
                                                              if (!valid15) {
                                                                break;
                                                              }
                                                            }
                                                          } else {
                                                            validate20.errors = [{ instancePath: instancePath + "/findings/" + i4 + "/facts", schemaPath: "#/$defs/finding/properties/facts/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                            return false;
                                                          }
                                                        }
                                                        var valid14 = _errs125 === errors;
                                                      } else {
                                                        var valid14 = true;
                                                      }
                                                      if (valid14) {
                                                        if (data56.explanation !== void 0) {
                                                          const _errs129 = errors;
                                                          if (typeof data56.explanation !== "string") {
                                                            validate20.errors = [{ instancePath: instancePath + "/findings/" + i4 + "/explanation", schemaPath: "#/$defs/finding/properties/explanation/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                            return false;
                                                          }
                                                          var valid14 = _errs129 === errors;
                                                        } else {
                                                          var valid14 = true;
                                                        }
                                                        if (valid14) {
                                                          if (data56.evidence !== void 0) {
                                                            let data66 = data56.evidence;
                                                            const _errs131 = errors;
                                                            if (errors === _errs131) {
                                                              if (Array.isArray(data66)) {
                                                                var valid16 = true;
                                                                const len6 = data66.length;
                                                                for (let i6 = 0; i6 < len6; i6++) {
                                                                  const _errs133 = errors;
                                                                  if (typeof data66[i6] !== "string") {
                                                                    validate20.errors = [{ instancePath: instancePath + "/findings/" + i4 + "/evidence/" + i6, schemaPath: "#/$defs/finding/properties/evidence/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                    return false;
                                                                  }
                                                                  var valid16 = _errs133 === errors;
                                                                  if (!valid16) {
                                                                    break;
                                                                  }
                                                                }
                                                              } else {
                                                                validate20.errors = [{ instancePath: instancePath + "/findings/" + i4 + "/evidence", schemaPath: "#/$defs/finding/properties/evidence/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                return false;
                                                              }
                                                            }
                                                            var valid14 = _errs131 === errors;
                                                          } else {
                                                            var valid14 = true;
                                                          }
                                                          if (valid14) {
                                                            if (data56.recommendation !== void 0) {
                                                              const _errs135 = errors;
                                                              if (typeof data56.recommendation !== "string") {
                                                                validate20.errors = [{ instancePath: instancePath + "/findings/" + i4 + "/recommendation", schemaPath: "#/$defs/finding/properties/recommendation/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                return false;
                                                              }
                                                              var valid14 = _errs135 === errors;
                                                            } else {
                                                              var valid14 = true;
                                                            }
                                                            if (valid14) {
                                                              if (data56.limitations !== void 0) {
                                                                const _errs137 = errors;
                                                                if (typeof data56.limitations !== "string") {
                                                                  validate20.errors = [{ instancePath: instancePath + "/findings/" + i4 + "/limitations", schemaPath: "#/$defs/finding/properties/limitations/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                  return false;
                                                                }
                                                                var valid14 = _errs137 === errors;
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
                                        }
                                      }
                                    } else {
                                      validate20.errors = [{ instancePath: instancePath + "/findings/" + i4, schemaPath: "#/$defs/finding/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                      return false;
                                    }
                                  }
                                  var valid12 = _errs112 === errors;
                                  if (!valid12) {
                                    break;
                                  }
                                }
                              } else {
                                validate20.errors = [{ instancePath: instancePath + "/findings", schemaPath: "#/properties/findings/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                return false;
                              }
                            }
                            var valid0 = _errs110 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.errors !== void 0) {
                              let data70 = data.errors;
                              const _errs139 = errors;
                              if (errors === _errs139) {
                                if (Array.isArray(data70)) {
                                  var valid17 = true;
                                  const len7 = data70.length;
                                  for (let i7 = 0; i7 < len7; i7++) {
                                    let data71 = data70[i7];
                                    const _errs141 = errors;
                                    if (errors === _errs141) {
                                      if (data71 && typeof data71 == "object" && !Array.isArray(data71)) {
                                        let missing6;
                                        if (data71.kind === void 0 && (missing6 = "kind") || data71.message === void 0 && (missing6 = "message")) {
                                          validate20.errors = [{ instancePath: instancePath + "/errors/" + i7, schemaPath: "#/properties/errors/items/required", keyword: "required", params: { missingProperty: missing6 }, message: "must have required property '" + missing6 + "'" }];
                                          return false;
                                        } else {
                                          const _errs143 = errors;
                                          for (const key6 in data71) {
                                            if (!(key6 === "kind" || key6 === "message" || key6 === "deviceId")) {
                                              validate20.errors = [{ instancePath: instancePath + "/errors/" + i7, schemaPath: "#/properties/errors/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key6 }, message: "must NOT have additional properties" }];
                                              return false;
                                              break;
                                            }
                                          }
                                          if (_errs143 === errors) {
                                            if (data71.kind !== void 0) {
                                              let data72 = data71.kind;
                                              const _errs144 = errors;
                                              if (!(data72 === "permission" || data72 === "property" || data72 === "enumeration" || data72 === "malformed")) {
                                                validate20.errors = [{ instancePath: instancePath + "/errors/" + i7 + "/kind", schemaPath: "#/properties/errors/items/properties/kind/enum", keyword: "enum", params: { allowedValues: schema31.properties.errors.items.properties.kind.enum }, message: "must be equal to one of the allowed values" }];
                                                return false;
                                              }
                                              var valid18 = _errs144 === errors;
                                            } else {
                                              var valid18 = true;
                                            }
                                            if (valid18) {
                                              if (data71.message !== void 0) {
                                                const _errs145 = errors;
                                                if (typeof data71.message !== "string") {
                                                  validate20.errors = [{ instancePath: instancePath + "/errors/" + i7 + "/message", schemaPath: "#/properties/errors/items/properties/message/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                  return false;
                                                }
                                                var valid18 = _errs145 === errors;
                                              } else {
                                                var valid18 = true;
                                              }
                                              if (valid18) {
                                                if (data71.deviceId !== void 0) {
                                                  const _errs147 = errors;
                                                  if (typeof data71.deviceId !== "string") {
                                                    validate20.errors = [{ instancePath: instancePath + "/errors/" + i7 + "/deviceId", schemaPath: "#/properties/errors/items/properties/deviceId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                    return false;
                                                  }
                                                  var valid18 = _errs147 === errors;
                                                } else {
                                                  var valid18 = true;
                                                }
                                              }
                                            }
                                          }
                                        }
                                      } else {
                                        validate20.errors = [{ instancePath: instancePath + "/errors/" + i7, schemaPath: "#/properties/errors/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                        return false;
                                      }
                                    }
                                    var valid17 = _errs141 === errors;
                                    if (!valid17) {
                                      break;
                                    }
                                  }
                                } else {
                                  validate20.errors = [{ instancePath: instancePath + "/errors", schemaPath: "#/properties/errors/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                  return false;
                                }
                              }
                              var valid0 = _errs139 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.limitations !== void 0) {
                                let data75 = data.limitations;
                                const _errs149 = errors;
                                if (errors === _errs149) {
                                  if (Array.isArray(data75)) {
                                    var valid19 = true;
                                    const len8 = data75.length;
                                    for (let i8 = 0; i8 < len8; i8++) {
                                      const _errs151 = errors;
                                      if (typeof data75[i8] !== "string") {
                                        validate20.errors = [{ instancePath: instancePath + "/limitations/" + i8, schemaPath: "#/properties/limitations/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                        return false;
                                      }
                                      var valid19 = _errs151 === errors;
                                      if (!valid19) {
                                        break;
                                      }
                                    }
                                  } else {
                                    validate20.errors = [{ instancePath: instancePath + "/limitations", schemaPath: "#/properties/limitations/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                    return false;
                                  }
                                }
                                var valid0 = _errs149 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.provenance !== void 0) {
                                  let data77 = data.provenance;
                                  const _errs153 = errors;
                                  const _errs154 = errors;
                                  if (errors === _errs154) {
                                    if (data77 && typeof data77 == "object" && !Array.isArray(data77)) {
                                      let missing7;
                                      if (data77.provider === void 0 && (missing7 = "provider") || data77.providerVersion === void 0 && (missing7 = "providerVersion") || data77.scope === void 0 && (missing7 = "scope")) {
                                        validate20.errors = [{ instancePath: instancePath + "/provenance", schemaPath: "#/$defs/provenance/required", keyword: "required", params: { missingProperty: missing7 }, message: "must have required property '" + missing7 + "'" }];
                                        return false;
                                      } else {
                                        const _errs156 = errors;
                                        for (const key7 in data77) {
                                          if (!(key7 === "provider" || key7 === "providerVersion" || key7 === "scope")) {
                                            validate20.errors = [{ instancePath: instancePath + "/provenance", schemaPath: "#/$defs/provenance/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key7 }, message: "must NOT have additional properties" }];
                                            return false;
                                            break;
                                          }
                                        }
                                        if (_errs156 === errors) {
                                          if (data77.provider !== void 0) {
                                            let data78 = data77.provider;
                                            const _errs157 = errors;
                                            if (!(data78 === "windows-cfgmgr32" || data78 === "windows-pnp-fallback")) {
                                              validate20.errors = [{ instancePath: instancePath + "/provenance/provider", schemaPath: "#/$defs/provenance/properties/provider/enum", keyword: "enum", params: { allowedValues: schema34.properties.provider.enum }, message: "must be equal to one of the allowed values" }];
                                              return false;
                                            }
                                            var valid21 = _errs157 === errors;
                                          } else {
                                            var valid21 = true;
                                          }
                                          if (valid21) {
                                            if (data77.providerVersion !== void 0) {
                                              const _errs158 = errors;
                                              if ("1.0" !== data77.providerVersion) {
                                                validate20.errors = [{ instancePath: instancePath + "/provenance/providerVersion", schemaPath: "#/$defs/provenance/properties/providerVersion/const", keyword: "const", params: { allowedValue: "1.0" }, message: "must be equal to constant" }];
                                                return false;
                                              }
                                              var valid21 = _errs158 === errors;
                                            } else {
                                              var valid21 = true;
                                            }
                                            if (valid21) {
                                              if (data77.scope !== void 0) {
                                                let data80 = data77.scope;
                                                const _errs159 = errors;
                                                if (!(data80 === "usb-hid" || data80 === "all-pnp")) {
                                                  validate20.errors = [{ instancePath: instancePath + "/provenance/scope", schemaPath: "#/$defs/provenance/properties/scope/enum", keyword: "enum", params: { allowedValues: schema34.properties.scope.enum }, message: "must be equal to one of the allowed values" }];
                                                  return false;
                                                }
                                                var valid21 = _errs159 === errors;
                                              } else {
                                                var valid21 = true;
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
                                  var valid0 = _errs153 === errors;
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
var func5 = require_ucs2length().default;
function validate21(data, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {}) {
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
                                                          if (func5(data10) > 2e3) {
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
function validate23(data, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {}) {
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
                                              if (func5(data11) > 2e3) {
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
export {
  analysis,
  diagnostic,
  investigation
};
