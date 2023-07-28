import { Dom, Camera } from "./types";

import dom from "./dom";
import media from "./media";

export const defineConnectedMediaDvice = async (
  selector: string | HTMLElement = ".viewport",
  constrains?: MediaStreamConstraints
): Promise<Camera.ConnectedVideoDevice> => {
  //---------
  // local members

  type LocalMembers = {
    elems: Dom.UIElements;
    stream?: MediaStream;
    events: { target?: Camera.CameraEventTarget };
  };

  const members: LocalMembers = {
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
  const defineCameraEventTarget = (
    stream: MediaStream
  ): Camera.CameraEventTarget => {
    if (!members.events.target) {
      members.events.target = new Camera.CameraEventTarget(stream);
    }
    return members.events.target;
  };

  const dispatchCameraEvent = (
    stream: MediaStream,
    evtOpts: { name: string; options?: object }
  ): Camera.CameraEvent => {
    const target = defineCameraEventTarget(stream);
    const event = new Camera.CameraEvent(evtOpts.name, evtOpts.options);
    target.dispatchEvent(event);
    return event;
  };

  //---------
  // public methods

  const connect = async (constrains?: MediaStreamConstraints) => {
    members.elems = dom.init(selector);

    return media
      .setupMedia(constrains || { audio: false, video: true })
      .then((stream) => {
        members.stream = stream;

        const settings = media.getSettings(stream);

        if (settings) {
          const video = members.elems?.video;

          if (video) {
            video.srcObject = <MediaProvider>stream;
          }

          const elems: Dom.UIElements = members.elems;

          dom.setupDom(elems, settings, { grid: 3 });
        }

        return stream;
      })
      .then((stream) => {
        if (stream) {
          dispatchCameraEvent(stream, { name: "connected" });
        }

        return stream;
      });
  };

  // doms
  const capture = async (
    type?: Dom.CaptureType,
    quality?: number
  ): Promise<Blob | null> => {
    const video = members.elems?.video;
    const imageBuffer = members.elems?.imageBuffer;

    if (video && imageBuffer) {
      return await dom.snap(video, imageBuffer, type, quality);
    }

    return null;
  };

  const grid = async (grid: number): Promise<void> => {
    const canvas = members.elems?.canvas;

    if (canvas) dom.drawGrid(canvas, grid);
  };
  // medias

  const getSettings = (): MediaTrackSettings | undefined => {
    const { stream } = members;

    if (!stream) return;

    return media.getSettings(stream);
  };

  const start = async () => {
    const { stream } = members;

    return await media.mediaStart(stream).then((stream) => {
      if (stream) {
        dispatchCameraEvent(stream, { name: "started" });
      }
      return stream;
    });
  };

  const pause = async () => {
    const { stream } = members;

    if (stream)
      return await media.mediaPause(stream).then((stream) => {
        if (stream) {
          dispatchCameraEvent(stream, { name: "paused" });
        }
        return stream;
      });
  };

  const stop = async () => {
    const { stream } = members;

    if (stream) {
      return await media.mediaStop(stream).then((stream) => {
        if (stream) {
          dispatchCameraEvent(stream, { name: "stoped" });
        }
        return stream;
      });
    }
  };

  const applyAspectRatio = async (
    aspectRatio: Camera.AspectRatio
  ): Promise<MediaStream | undefined> => {
    const { stream } = members;

    const dblAcceptRatio: number = (() => {
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
      return media.applyAspectRatio(stream, dblAcceptRatio).then((stream) => {
        const settings = getSettings();

        if (settings) dom.setupDom(members.elems, settings);

        return stream;
      });
    }
  };

  const toggleFacingMode = async (): Promise<MediaStream | undefined> => {
    const { stream } = members;

    if (stream) {
      return media.toggleFacingMode(stream);
    }
  };

  const applyFrameRate = async (
    frameRate: Camera.FrameRate
  ): Promise<MediaStream | undefined> => {
    const { stream } = members;

    if (stream) {
      return media.applyFrameRate(stream, frameRate);
    }
  };

  //---------
  // create object
  return connect(constrains).then(() => {
    const cameraDevide: Camera.ConnectedVideoDevice = {
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
};

export default {
  defineConnectedMediaDvice,
};
