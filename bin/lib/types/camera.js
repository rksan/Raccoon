"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _CameraEventTarget_target;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraEvent = exports.CameraEventTarget = void 0;
class CameraEventTarget extends EventTarget {
    constructor(stream) {
        super();
        _CameraEventTarget_target.set(this, void 0);
        __classPrivateFieldSet(this, _CameraEventTarget_target, stream, "f");
    }
}
exports.CameraEventTarget = CameraEventTarget;
_CameraEventTarget_target = new WeakMap();
class CameraEvent extends Event {
    constructor(type, options) {
        super(type, options);
    }
}
exports.CameraEvent = CameraEvent;
