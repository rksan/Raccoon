"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineConnectedMediaDvice = void 0;
const types_1 = require("./types");
const dom_1 = __importDefault(require("./dom"));
const media_1 = __importDefault(require("./media"));
const defineConnectedMediaDvice = (selector = ".viewport", constrains) => __awaiter(void 0, void 0, void 0, function* () {
    //---------
    // local members
    const members = {
        elems: {
            viewport: undefined,
            video: undefined,
            canvas: undefined,
            imageBuffer: undefined,
        },
        //settings: { first: undefined },
        events: {},
    };
    // local methods
    const defineCameraEventTarget = (stream) => {
        if (!members.events.target) {
            members.events.target = new types_1.Camera.CameraEventTarget(stream);
        }
        return members.events.target;
    };
    const dispatchCameraEvent = (stream, evtOpts) => {
        const target = defineCameraEventTarget(stream);
        const event = new types_1.Camera.CameraEvent(evtOpts.name, evtOpts.options);
        target.dispatchEvent(event);
        return event;
    };
    //---------
    // public methods
    const connect = (constrains) => __awaiter(void 0, void 0, void 0, function* () {
        members.elems = dom_1.default.init(selector);
        return media_1.default
            .setupMedia(constrains || { audio: false, video: true })
            .then((stream) => {
            var _a;
            members.stream = stream;
            const settings = media_1.default.getSettings(stream);
            if (settings) {
                const video = (_a = members.elems) === null || _a === void 0 ? void 0 : _a.video;
                if (video) {
                    video.srcObject = stream;
                }
                const elems = members.elems;
                dom_1.default.setupDom(elems, settings, { grid: 3 });
            }
            return stream;
        })
            .then((stream) => {
            if (stream) {
                dispatchCameraEvent(stream, { name: "connected" });
            }
            return stream;
        });
    });
    // doms
    const capture = (type, quality) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const video = (_a = members.elems) === null || _a === void 0 ? void 0 : _a.video;
        const imageBuffer = (_b = members.elems) === null || _b === void 0 ? void 0 : _b.imageBuffer;
        if (video && imageBuffer) {
            return yield dom_1.default.snap(video, imageBuffer, type, quality);
        }
        return null;
    });
    const grid = (grid) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const canvas = (_c = members.elems) === null || _c === void 0 ? void 0 : _c.canvas;
        if (canvas)
            dom_1.default.drawGrid(canvas, grid);
    });
    // medias
    const getSettings = () => {
        const { stream } = members;
        if (!stream)
            return;
        return media_1.default.getSettings(stream);
    };
    const start = () => __awaiter(void 0, void 0, void 0, function* () {
        const { stream } = members;
        return yield media_1.default.mediaStart(stream).then((stream) => {
            if (stream) {
                dispatchCameraEvent(stream, { name: "started" });
            }
            return stream;
        });
    });
    const pause = () => __awaiter(void 0, void 0, void 0, function* () {
        const { stream } = members;
        if (stream)
            return yield media_1.default.mediaPause(stream).then((stream) => {
                if (stream) {
                    dispatchCameraEvent(stream, { name: "paused" });
                }
                return stream;
            });
    });
    const stop = () => __awaiter(void 0, void 0, void 0, function* () {
        const { stream } = members;
        if (stream) {
            return yield media_1.default.mediaStop(stream).then((stream) => {
                if (stream) {
                    dispatchCameraEvent(stream, { name: "stoped" });
                }
                return stream;
            });
        }
    });
    const applyAspectRatio = (aspectRatio) => __awaiter(void 0, void 0, void 0, function* () {
        const { stream } = members;
        const dblAcceptRatio = (() => {
            switch (aspectRatio) {
                case "16/9":
                    return 16 / 9;
                case "4/3":
                    return 4 / 3;
                default:
                    return 1;
            }
        })();
        if (stream) {
            return media_1.default.applyAspectRatio(stream, dblAcceptRatio).then((stream) => {
                const settings = getSettings();
                if (settings)
                    dom_1.default.setupDom(members.elems, settings);
                return stream;
            });
        }
    });
    const toggleFacingMode = () => __awaiter(void 0, void 0, void 0, function* () {
        const { stream } = members;
        if (stream) {
            return media_1.default.toggleFacingMode(stream);
        }
    });
    const applyFrameRate = (frameRate) => __awaiter(void 0, void 0, void 0, function* () {
        const { stream } = members;
        if (stream) {
            return media_1.default.applyFrameRate(stream, frameRate);
        }
    });
    //---------
    // create object
    return connect(constrains).then(() => {
        const cameraDevide = {
            //connect,
            capture,
            grid,
            getSettings,
            start,
            pause,
            stop,
            applyAspectRatio,
            toggleFacingMode,
            applyFrameRate,
            addEventListener(...args) {
                if (members.stream) {
                    const target = defineCameraEventTarget(members.stream);
                    return target.addEventListener(...args);
                }
            },
            dispatchEvent(event) {
                if (members.stream) {
                    const target = defineCameraEventTarget(members.stream);
                    return target.dispatchEvent(event);
                }
                return false;
            },
            removeEventListener(...args) {
                if (members.stream) {
                    const target = defineCameraEventTarget(members.stream);
                    return target.removeEventListener(...args);
                }
            },
        };
        return cameraDevide;
    });
});
exports.defineConnectedMediaDvice = defineConnectedMediaDvice;
exports.default = {
    defineConnectedMediaDvice: exports.defineConnectedMediaDvice,
};
