"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Raccoon_selector, _Raccoon_constrains, _Raccoon_connectedMediaDevice;
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineConnectedMediaDvice = exports.Raccoon = void 0;
const camera = __importStar(require("./lib/camera"));
class Raccoon {
    constructor(selector, constrains) {
        _Raccoon_selector.set(this, void 0);
        _Raccoon_constrains.set(this, void 0);
        _Raccoon_connectedMediaDevice.set(this, void 0);
        __classPrivateFieldSet(this, _Raccoon_selector, selector, "f");
        __classPrivateFieldSet(this, _Raccoon_constrains, constrains, "f");
    }
    get isConnected() {
        return __classPrivateFieldGet(this, _Raccoon_connectedMediaDevice, "f") !== undefined;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _Raccoon_connectedMediaDevice, "f")) {
                return Promise.resolve(__classPrivateFieldGet(this, _Raccoon_connectedMediaDevice, "f"));
            }
            else {
                __classPrivateFieldSet(this, _Raccoon_connectedMediaDevice, yield camera.defineConnectedMediaDvice(__classPrivateFieldGet(this, _Raccoon_selector, "f"), __classPrivateFieldGet(this, _Raccoon_constrains, "f")), "f");
                return __classPrivateFieldGet(this, _Raccoon_connectedMediaDevice, "f");
            }
        });
    }
    getSettings() {
        if (__classPrivateFieldGet(this, _Raccoon_connectedMediaDevice, "f")) {
            return __classPrivateFieldGet(this, _Raccoon_connectedMediaDevice, "f").getSettings();
        }
    }
    grid(grid) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield this.connect();
            device.grid(grid);
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield this.connect();
            return yield device.start();
        });
    }
    capture(type, quality) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield this.connect();
            return yield device.capture(type, quality);
        });
    }
    pause() {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield this.connect();
            return yield device.pause();
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield this.connect();
            return yield device.stop();
        });
    }
    applyAspectRatio(aspectRatio) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield this.connect();
            return yield device.applyAspectRatio(aspectRatio);
        });
    }
    toggleFacingMode() {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield this.connect();
            return yield device.toggleFacingMode();
        });
    }
    applyFrameRate(frameRate) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield this.connect();
            return yield device.applyFrameRate(frameRate);
        });
    }
    addEventListener(type, handler, options) {
        var _a;
        if (this.isConnected) {
            return (_a = __classPrivateFieldGet(this, _Raccoon_connectedMediaDevice, "f")) === null || _a === void 0 ? void 0 : _a.addEventListener(type, handler, options);
        }
    }
    removeEventListener(type, handler, options) {
        var _a;
        return (_a = __classPrivateFieldGet(this, _Raccoon_connectedMediaDevice, "f")) === null || _a === void 0 ? void 0 : _a.removeEventListener(type, handler, options);
    }
    dispatchEvent(event) {
        if (__classPrivateFieldGet(this, _Raccoon_connectedMediaDevice, "f")) {
            return __classPrivateFieldGet(this, _Raccoon_connectedMediaDevice, "f").dispatchEvent(event);
        }
        return false;
    }
}
exports.Raccoon = Raccoon;
_Raccoon_selector = new WeakMap(), _Raccoon_constrains = new WeakMap(), _Raccoon_connectedMediaDevice = new WeakMap();
const defineConnectedMediaDvice = (selector, constrains) => __awaiter(void 0, void 0, void 0, function* () {
    const raccoon = new Raccoon(selector, constrains);
    return raccoon.connect().then(() => raccoon);
});
exports.defineConnectedMediaDvice = defineConnectedMediaDvice;
exports.default = Raccoon;
