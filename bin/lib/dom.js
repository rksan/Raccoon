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
exports.drawGrid = exports.toDataURL = exports.snap = exports.init = exports.setupDom = void 0;
const createElem = (parent, selector, tag, elemOpt = {}) => {
    let elem = undefined;
    if (parent) {
        if (parent instanceof HTMLElement)
            elem = parent.querySelector(selector);
    }
    if (!elem) {
        elem = document.createElement(tag);
        if (parent instanceof HTMLElement)
            parent.appendChild(elem);
    }
    if (elem) {
        if (elemOpt.classes) {
            const classes = elemOpt.classes;
            if (Array.isArray(classes)) {
                elem.classList.add(...classes);
            }
            else if (typeof classes === "string") {
                elem.classList.add(classes);
            }
        }
        if (elemOpt.attrs) {
            const attrs = elemOpt.attrs;
            Object.entries(attrs).forEach(([key, value]) => {
                !elem || elem.setAttribute(key, value);
            });
        }
    }
    return elem;
};
const setupDom = (elems, settings, options) => {
    const { viewport, canvas, imageBuffer } = elems;
    if (viewport)
        viewport.style.aspectRatio = String(settings.aspectRatio);
    const { width, height } = settings;
    if (canvas) {
        canvas.width = Number(width);
        canvas.height = Number(height);
        if (options && options.grid) {
            drawGrindOnCanvas(canvas, options.grid);
        }
    }
    if (imageBuffer) {
        imageBuffer.width = Number(width);
        imageBuffer.height = Number(height);
    }
};
exports.setupDom = setupDom;
const drawGrindOnCanvas = (canvas, grid) => {
    if (!grid)
        return;
    if (!canvas)
        return;
    const ctx = canvas.getContext("2d");
    if (!ctx)
        return;
    const size = {
        width: Math.floor(canvas.width),
        height: Math.floor(canvas.height),
    };
    const distance = {
        grid: Math.floor(grid),
        width: size.width / Math.floor(grid),
        height: size.height / Math.floor(grid),
    };
    const draw = (grid) => {
        if (!grid)
            return;
        ctx.beginPath();
        for (let i = 0, x = distance.width, y = 0; i < 3 - 1; i++, x += distance.width) {
            ctx.moveTo(x, y);
            ctx.lineTo(x, size.height);
        }
        for (let i = 0, x = 0, y = distance.height; i < 3 - 1; i++, y += distance.height) {
            ctx.moveTo(x, y);
            ctx.lineTo(size.width, y);
        }
        ctx.strokeStyle = "white";
        ctx.stroke();
    };
    draw(distance.grid);
};
const transferCanvas = (video, canvas) => __awaiter(void 0, void 0, void 0, function* () {
    const { width, height } = {
        width: Math.floor(canvas.width),
        height: Math.floor(canvas.height),
    };
    const bitmap = yield createImageBitmap(video, 0, 0, width, height);
    const ctx = canvas.getContext("bitmaprenderer");
    ctx === null || ctx === void 0 ? void 0 : ctx.transferFromImageBitmap(bitmap);
    return canvas;
});
//-------------
// DOM Actions
//-------------
const init = (selector) => {
    const elems = {
        viewport: undefined,
        video: undefined,
        canvas: undefined,
        imageBuffer: undefined,
    };
    let viewport;
    if (!selector) {
        viewport = document.querySelector(".viewport");
    }
    else if (typeof selector === "string") {
        viewport = document.querySelector(selector);
    }
    else {
        viewport = selector;
    }
    elems.viewport = viewport;
    elems.canvas = (createElem(viewport, ":scope>canvas", "canvas"));
    elems.video = (createElem(viewport, ":scope>video", "video", {
        attrs: { autoplay: true },
    }));
    elems.imageBuffer = (createElem(false, ":scope>canvas.imageBuffer", "canvas", {
        classes: "image-buffer",
    }));
    return elems;
};
exports.init = init;
const snap = (video, canvas, type, quality) => __awaiter(void 0, void 0, void 0, function* () {
    yield transferCanvas(video, canvas);
    return yield toBlob(canvas, type, quality);
});
exports.snap = snap;
const toBlob = (canvas, type, quality) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            canvas === null || canvas === void 0 ? void 0 : canvas.toBlob((blob) => {
                resolve(blob);
            }, type, quality);
        }
        catch (err) {
            reject(err);
        }
    });
});
const toDataURL = (canvas, type, quality) => {
    return canvas.toDataURL(type, quality) || null;
};
exports.toDataURL = toDataURL;
const drawGrid = (canvas, grid) => {
    drawGrindOnCanvas(canvas, grid);
};
exports.drawGrid = drawGrid;
const dom = {
    setupDom: exports.setupDom,
    init: exports.init,
    snap: exports.snap,
    toBlob,
    toDataURL: exports.toDataURL,
    drawGrid: exports.drawGrid,
};
exports.default = dom;
