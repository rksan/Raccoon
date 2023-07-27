import * as Types from "./lib/types/";
import * as camera from "./lib/camera";

export class Raccoon implements Types.Camera.ConnectedVideoDevice {
  #selector?: string | HTMLElement;
  #constrains?: MediaStreamConstraints;
  #connectedMediaDevice?: Types.Camera.ConnectedVideoDevice;

  constructor(
    selector?: string | HTMLElement,
    constrains?: MediaStreamConstraints
  ) {
    this.#selector = selector;
    this.#constrains = constrains;
  }

  get isConnected(): boolean {
    return this.#connectedMediaDevice !== undefined;
  }

  async connect(): Promise<Types.Camera.ConnectedVideoDevice> {
    if (this.#connectedMediaDevice) {
      return Promise.resolve(this.#connectedMediaDevice);
    } else {
      this.#connectedMediaDevice = await camera.defineConnectedMediaDvice(
        <Types.Dom.Selector>this.#selector,
        this.#constrains
      );

      return this.#connectedMediaDevice;
    }
  }

  getSettings(): MediaTrackSettings | undefined {
    if (this.#connectedMediaDevice) {
      return this.#connectedMediaDevice.getSettings();
    }
  }

  async grid(grid: number) {
    const device = await this.connect();
    device.grid(grid);
  }

  async start(): Promise<MediaStream | undefined> {
    const device = await this.connect();
    return await device.start();
  }

  async capture(
    type?: Types.Dom.CaptureType,
    quality?: number | undefined
  ): Promise<Blob | null> {
    const device = await this.connect();
    return await device.capture(type, quality);
  }

  async pause(): Promise<MediaStream | undefined> {
    const device = await this.connect();
    return await device.pause();
  }

  async stop(): Promise<MediaStream | undefined> {
    const device = await this.connect();
    return await device.stop();
  }

  async applyAspectRatio(
    aspectRatio: Types.Camera.AspectRatio
  ): Promise<MediaStream | undefined> {
    const device = await this.connect();
    return await device.applyAspectRatio(aspectRatio);
  }

  async toggleFacingMode(): Promise<MediaStream | undefined> {
    const device = await this.connect();
    return await device.toggleFacingMode();
  }

  async applyFrameRate(frameRate: number): Promise<MediaStream | undefined> {
    const device = await this.connect();
    return await device.applyFrameRate(frameRate);
  }

  addEventListener(
    type: string,
    handler: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined
  ): void {
    if (this.isConnected) {
      return this.#connectedMediaDevice?.addEventListener(
        type,
        handler,
        options
      );
    }
  }

  removeEventListener(
    type: string,
    handler: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions | undefined
  ): void {
    return this.#connectedMediaDevice?.removeEventListener(
      type,
      handler,
      options
    );
  }

  dispatchEvent(event: Event): boolean {
    if (this.#connectedMediaDevice) {
      return this.#connectedMediaDevice.dispatchEvent(event);
    }
    return false;
  }
}

export const defineConnectedMediaDvice = async (
  selector: Types.Dom.Selector,
  constrains?: MediaStreamConstraints
): Promise<Raccoon> => {
  const raccoon = new Raccoon(selector, constrains);

  return raccoon.connect().then(() => raccoon);
};

export default Raccoon;
