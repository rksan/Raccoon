//---------------------
// dom.ts
//---------------------
import { Dom } from "./types";

const createElem = (
  parent: HTMLElement | boolean,
  selector: string,
  tag: string,
  elemOpt: {
    classes?: Array<string> | string;
    attrs?: object;
  } = {}
): HTMLElement => {
  let elem: HTMLElement | undefined = undefined;

  if (parent) {
    if (parent instanceof HTMLElement)
      elem = <HTMLElement>parent.querySelector(selector);
  }

  if (!elem) {
    elem = document.createElement(tag);
    if (parent instanceof HTMLElement) parent.appendChild(elem);
  }

  if (elem) {
    if (elemOpt.classes) {
      const classes = elemOpt.classes;
      if (Array.isArray(classes)) {
        elem.classList.add(...classes);
      } else if (typeof classes === "string") {
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

export const setupDom = (
  elems: Dom.UIElements,
  settings: MediaTrackSettings,
  options: Dom.SetupOptions
) => {
  const { viewport, canvas, imageBuffer } = elems;

  if (viewport) viewport.style.aspectRatio = String(settings.aspectRatio);

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

const drawGrindOnCanvas = (canvas: HTMLCanvasElement, grid: number): void => {
  if (!grid) return;

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const size = {
    width: Math.floor(canvas.width),
    height: Math.floor(canvas.height),
  };

  const distance = {
    grid: Math.floor(grid),
    width: size.width / Math.floor(grid),
    height: size.height / Math.floor(grid),
  };

  const draw = (grid: number) => {
    if (!grid) return;

    ctx.beginPath();

    for (
      let i = 0, x = distance.width, y = 0;
      i < 3 - 1;
      i++, x += distance.width
    ) {
      ctx.moveTo(x, y);
      ctx.lineTo(x, size.height);
    }

    for (
      let i = 0, x = 0, y = distance.height;
      i < 3 - 1;
      i++, y += distance.height
    ) {
      ctx.moveTo(x, y);
      ctx.lineTo(size.width, y);
    }

    ctx.strokeStyle = "white";
    ctx.stroke();
  };

  draw(distance.grid);
};

const transferCanvas = async (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): Promise<HTMLCanvasElement> => {
  const { width, height } = {
    width: Math.floor(canvas.width),
    height: Math.floor(canvas.height),
  };

  const bitmap: ImageBitmap = await createImageBitmap(
    video,
    0,
    0,
    width,
    height
  );

  const ctx = canvas.getContext("bitmaprenderer");

  ctx?.transferFromImageBitmap(bitmap);

  return canvas;
};

//-------------
// DOM Actions
//-------------
export const init = (selector: Dom.Selector): Dom.UIElements => {
  const elems: Dom.UIElements = {
    viewport: undefined,
    video: undefined,
    canvas: undefined,
    imageBuffer: undefined,
  };

  let viewport: string | HTMLElement | undefined;

  if (!selector) {
    viewport = <HTMLElement>document.querySelector(".viewport");
  } else if (typeof selector === "string") {
    viewport = <HTMLElement>document.querySelector(selector);
  } else {
    viewport = selector;
  }

  elems.viewport = viewport;

  elems.canvas = <HTMLCanvasElement>(
    createElem(viewport, ":scope>canvas", "canvas")
  );

  elems.video = <HTMLVideoElement>(
    createElem(viewport, ":scope>video", "video", {
      attrs: { autoplay: true },
    })
  );

  elems.imageBuffer = <HTMLCanvasElement>(
    createElem(false, ":scope>canvas.imageBuffer", "canvas", {
      classes: "image-buffer",
    })
  );

  return elems;
};

export const snap = async (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  type?: Dom.CaptureType,
  quality?: number
): Promise<Blob | null> => {
  await transferCanvas(video, canvas);

  return await toBlob(canvas, type, quality);
};

const toBlob = async (
  canvas: HTMLCanvasElement,
  type?: Dom.CaptureType,
  quality?: number
): Promise<Blob | null> => {
  return new Promise((resolve, reject) => {
    try {
      canvas?.toBlob(
        (blob) => {
          resolve(blob);
        },
        type,
        quality
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const toDataURL = (
  canvas: HTMLCanvasElement,
  type?: Dom.CaptureType,
  quality?: number
): string | null => {
  return canvas.toDataURL(type, quality) || null;
};

export const drawGrid = (canvas: HTMLCanvasElement, grid: number) => {
  drawGrindOnCanvas(canvas, grid);
};

const dom: Dom.CameraDom = {
  setupDom,
  init,
  snap,
  toBlob,
  toDataURL,
  drawGrid,
};

export default dom;
