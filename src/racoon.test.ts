import { describe, expect, test } from "@jest/globals";
import { Raccoon, defineConnectedMediaDvice, Types } from "@rksan/raccoon";

Object.defineProperty(window, "navigator", {
  writable: true,
  value: {
    mediaDevices: {
      getUserMedia: jest.fn(),
    },
  },
});

document.body.innerHTML = `<div class="viewport">
  <canvas></canvas>
  <video></video>
  <canvas class="imageBuffer"></canvas>
  </div>`;

describe("raccoon.ts", () => {
  test("connect", async () => {
    const viewport: Types.Dom.Selector = <HTMLHtmlElement>(
      document.querySelector("viewport")
    );
    const raccoon: Raccoon = await defineConnectedMediaDvice(viewport);
    return raccoon.connect();
  });
});
