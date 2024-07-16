import { describe, expect, it } from "vitest";
import { XataService } from "../xata";
import { xata } from "@thatrundown/xata";
import { db } from "@thatrundown/prisma";
import { logger } from "../../lib/logger";

const service = new XataService(xata, db, logger);

describe("Chat", () => {
  it("should handle semanticSearch", async () => {
    const resp = await service.semanticSearch(
      "What is it? Gandalf?",
      "user_2jF960TkoXyGenkxLTxpMWVRxa2"
    );
    console.log(resp);
    expect(resp).toBeDefined();
  });

  it("should handle ask", async () => {
    const resp = await service.askSummary(
      "What is it? Gandalf?",
      "user_2jF960TkoXyGenkxLTxpMWVRxa2"
    );
    console.log(resp);
    expect(resp).toBeDefined();
  });
});
