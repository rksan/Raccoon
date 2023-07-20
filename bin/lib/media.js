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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMedia = void 0;
const members = {
    settings: undefined,
};
const setupMedia = (constraints) => __awaiter(void 0, void 0, void 0, function* () {
    const stream = yield navigator.mediaDevices.getUserMedia(constraints);
    members.settings = getSettings(stream);
    return stream;
});
exports.setupMedia = setupMedia;
const applyConstrains = (stream, constrains) => __awaiter(void 0, void 0, void 0, function* () {
    const tracks = stream.getTracks();
    for (const track of tracks) {
        yield track.applyConstraints(constrains);
    }
    return stream;
});
const getFirstSettings = () => {
    return members.settings;
};
//---------------
// Media actions
//---------------
const getVideoTrack = (stream) => {
    return stream === null || stream === void 0 ? void 0 : stream.getVideoTracks().find((track) => track);
};
const getSettings = (stream) => {
    const track = getVideoTrack(stream);
    return track === null || track === void 0 ? void 0 : track.getSettings();
};
const mediaStart = (stream) => __awaiter(void 0, void 0, void 0, function* () {
    const track = getVideoTrack(stream);
    if (track) {
        if (!track.enabled)
            track.enabled = true;
    }
    return stream;
});
const mediaPause = (stream) => __awaiter(void 0, void 0, void 0, function* () {
    const track = getVideoTrack(stream);
    if (!track)
        return stream;
    const enabled = !track.enabled;
    track.enabled = enabled;
    return stream;
});
const mediaStop = (stream) => __awaiter(void 0, void 0, void 0, function* () {
    stream.getTracks().forEach((track) => {
        if (!track.enabled) {
            track.enabled = true;
        }
        track.stop();
    });
    return stream;
});
const applyAspectRatio = (stream, aspectRatio) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = getFirstSettings() || getSettings(stream);
    return yield applyConstrains(stream, {
        width: { ideal: settings === null || settings === void 0 ? void 0 : settings.width },
        aspectRatio: { exact: aspectRatio },
    }).catch((err) => {
        console.warn(err);
        return err;
    });
});
const toggleFacingMode = (stream) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = getFirstSettings() || getSettings(stream);
    if (!settings)
        return stream;
    const facingMode = settings.facingMode === "user" ? "environment" : "user";
    return yield applyConstrains(stream, {
        width: settings.width,
        facingMode: { exact: facingMode },
    });
});
const applyFrameRate = (stream, frameRate) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = getFirstSettings() || getSettings(stream);
    return yield applyConstrains(stream, {
        width: settings === null || settings === void 0 ? void 0 : settings.width,
        frameRate: { exact: frameRate },
    });
});
const userMedia = {
    getVideoTrack,
    getSettings,
    setupMedia: exports.setupMedia,
    mediaStart,
    mediaPause,
    mediaStop,
    applyAspectRatio,
    toggleFacingMode,
    applyFrameRate,
};
exports.default = userMedia;
