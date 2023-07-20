export interface ConnectedVideoDevice extends EventTarget {
  /* connect(
    constrains?: MediaStreamConstraints
  ): Promise<MediaStream | undefined>; */
  capture(type?: string, quality?: number): Promise<Blob | null>;
  grid(grid: number): Promise<void>;
  getSettings(): MediaTrackSettings | undefined;
  start(): Promise<MediaStream | undefined>;
  pause(): Promise<MediaStream | undefined>;
  stop(): Promise<MediaStream | undefined>;
  applyAspectRatio(aspectRatio: AspectRatio): Promise<MediaStream | undefined>;
  toggleFacingMode(): Promise<MediaStream | undefined>;
  applyFrameRate(frameRate: number): Promise<MediaStream | undefined>;
}

export type AspectRatio = "16/9" | "4/3" | "1/1";
export type FacingMode = "user" | "environment";
export type FrameRate = 0 | 4 | 8 | 16 | 24 | 30 | 50 | 60;

export class CameraEventTarget extends EventTarget {
  #target: MediaStream;

  constructor(stream: MediaStream) {
    super();
    this.#target = stream;
  }
}

export class CameraEvent extends Event {
  constructor(type: string, options?: object) {
    super(type, options);
  }
}
