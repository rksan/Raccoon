//----------------------------
// media.ts
//----------------------------
import { UserMedia } from "./types/media";

type LocalMembers = {
  settings?: MediaTrackSettings;
};

const members: LocalMembers = {
  settings: undefined,
};

export const setupMedia = async (
  constraints?: MediaStreamConstraints
): Promise<MediaStream | undefined> => {
  const stream = await navigator.mediaDevices.getUserMedia(
    <MediaStreamConstraints>constraints
  );

  members.settings = getSettings(stream);

  return stream;
};

const applyConstrains = async (
  stream: MediaStream,
  constrains?: MediaTrackConstraints
): Promise<MediaStream | undefined> => {
  const tracks = stream.getTracks();

  for (const track of tracks) {
    await track.applyConstraints(constrains);
  }

  return stream;
};

const getFirstSettings = (): MediaTrackSettings | undefined => {
  return members.settings;
};
//---------------
// Media actions
//---------------
const getVideoTrack = (stream?: MediaStream): MediaStreamTrack | undefined => {
  return stream?.getVideoTracks().find((track) => track);
};

const getSettings = (stream?: MediaStream): MediaTrackSettings | undefined => {
  const track = getVideoTrack(stream);

  return track?.getSettings();
};

const mediaStart = async (
  stream?: MediaStream
): Promise<MediaStream | undefined> => {
  const track = getVideoTrack(stream);

  if (track) {
    if (!track.enabled) track.enabled = true;
  }

  return stream;
};

const mediaPause = async (
  stream: MediaStream
): Promise<MediaStream | undefined> => {
  const track = getVideoTrack(stream);

  if (!track) return stream;

  const enabled = !track.enabled;

  track.enabled = enabled;

  return stream;
};

const mediaStop = async (
  stream: MediaStream
): Promise<MediaStream | undefined> => {
  stream.getTracks().forEach((track) => {
    if (!track.enabled) {
      track.enabled = true;
    }
    track.stop();
  });

  return stream;
};

const applyAspectRatio = async (
  stream: MediaStream,
  aspectRatio: number
): Promise<MediaStream | undefined> => {
  const settings = getFirstSettings() || getSettings(stream);

  return await applyConstrains(stream, {
    width: { ideal: settings?.width },
    aspectRatio: { exact: aspectRatio },
  }).catch((err) => {
    console.warn(err);
    return err;
  });
};

const toggleFacingMode = async (
  stream: MediaStream
): Promise<MediaStream | undefined> => {
  const settings = getFirstSettings() || getSettings(stream);

  if (!settings) return stream;

  const facingMode = settings.facingMode === "user" ? "environment" : "user";

  return await applyConstrains(stream, {
    width: settings.width,
    facingMode: { exact: facingMode },
  });
};

const applyFrameRate = async (stream: MediaStream, frameRate: number) => {
  const settings = getFirstSettings() || getSettings(stream);

  return await applyConstrains(stream, {
    width: settings?.width,
    frameRate: { exact: frameRate },
  });
};

const userMedia: UserMedia = {
  getVideoTrack,
  getSettings,
  setupMedia,
  mediaStart,
  mediaPause,
  mediaStop,
  applyAspectRatio,
  toggleFacingMode,
  applyFrameRate,
};

export default userMedia;
