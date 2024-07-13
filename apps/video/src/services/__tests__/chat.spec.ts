import { describe, expect, it } from "vitest";
import { XataService } from "../xata";
import { xata } from "@summaraize/xata";
import { db } from "@summaraize/prisma";
import { logger } from "../../lib/logger";

const service = new XataService(xata, db, logger);

describe("Chat", () => {
  it("should handle semanticSearch", async () => {
    const resp = await service.semanticSearch("This is a test transcript", "user_2iuPh9T519gz50eUoP8MG21u08j");
    console.log(resp);
    expect(resp).toBeDefined();
  });
});
