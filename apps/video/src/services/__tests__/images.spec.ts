import { describe, expect, it } from "vitest";
import { ImageService } from "../images";
import path from "node:path";
import { logger } from "../../lib/logger";
import { utapi } from "../uploadthing";

const service = new ImageService(utapi, logger);
describe("Images", () => {
  it("should upload an image", async () => {
    const testImagePath = path.join(__dirname, "images");
    const resp = await service.uploadImagesFromPath(testImagePath);
    console.log(resp.data);
    expect(resp.message).toEqual("success");
  });
});
