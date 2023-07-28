export declare namespace Dom {
  export type UIElements = {
    viewport?: HTMLElement;
    video?: HTMLVideoElement;
    canvas?: HTMLCanvasElement;
    imageBuffer?: HTMLCanvasElement;
  };

  export type Selector = string | HTMLElement | ".viewport";
  export type SetupOptions = { grid?: number };
  export type CaptureType = "image/png" | "image/jpeg" | "image/webp";

  export interface CameraDom {
    setupDom(
      elems: UIElements,
      settings: MediaTrackSettings,
      options?: SetupOptions
    ): void;
    init(selector: Selector): UIElements;
    snap(
      video: HTMLVideoElement,
      canvas: HTMLCanvasElement,
      type?: CaptureType,
      quality?: number
    ): Promise<Blob | null>;
    toBlob(
      canvas: HTMLCanvasElement,
      type?: CaptureType,
      quality?: number
    ): Promise<Blob | null>;
    toDataURL(
      canvas: HTMLCanvasElement,
      type?: CaptureType,
      quality?: number
    ): string | null;
    drawGrid(canvas: HTMLCanvasElement, grid: number): void;
  }
}
