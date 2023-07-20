export interface UserMedia {
  getVideoTrack(stream?: MediaStream): MediaStreamTrack | undefined;
  getSettings(stream?: MediaStream): MediaTrackSettings | undefined;
  setupMedia(
    constrains: MediaStreamConstraints
  ): Promise<MediaStream | undefined>;
  mediaStart(stream?: MediaStream): Promise<MediaStream | undefined>;
  mediaPause(stream: MediaStream): Promise<MediaStream | undefined>;
  mediaStop(stream: MediaStream): Promise<MediaStream | undefined>;
  applyAspectRatio(
    stream: MediaStream,
    aspectRatio?: number
  ): Promise<MediaStream | undefined>;
  toggleFacingMode(stream: MediaStream): Promise<MediaStream | undefined>;
  applyFrameRate(
    stream: MediaStream,
    frameRate?: number
  ): Promise<MediaStream | undefined>;
}
