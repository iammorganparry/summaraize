import fs from "node:fs";
import path from "node:path";
import { chunk } from "lodash";
import type winston from "winston";
import type { UTApi } from "uploadthing/server";
import { Blob } from "node:buffer";
import type { UploadFileResult } from "uploadthing/types";
import { randomUUID } from "node:crypto";

class BlobbyBoi extends Blob {
  public name: string;
  constructor(
    parts: (Blob | ArrayBuffer | Buffer)[],
    options?: BlobPropertyBag,
    name?: string
  ) {
    super(parts, options);
    this.name = name ?? randomUUID();
  }
}

export class ImageService {
  constructor(
    private readonly utapi: UTApi,
    private readonly logger: winston.Logger
  ) {}

  public async uploadImagesFromPath(imageDir: string) {
    this.logger.info(`Uploading images from ${imageDir}`);
    const images = fs.readdirSync(imageDir);

    this.logger.info(`Found ${images.length} images`, {
      images,
    });

    const batches = chunk(images, 10);
    const responses: UploadFileResult[] = [];
    for (const batch of batches) {
      const files = batch.map((image) => {
        const img = fs.readFileSync(path.join(imageDir, image));
        const blobEsque = new BlobbyBoi([img], { type: "image/jpeg" }, image);
        return blobEsque;
      });
      try {
        const resp = await this.utapi.uploadFiles(files);
        responses.push(...resp);
      } catch (e) {
        const err = e as Error;
        this.logger.error("Failed to upload images", err);
        throw new Error(err.message);
      }
    }
    return {
      message: "success",
      data: responses,
    };
  }
}
