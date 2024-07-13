import { Hono } from "hono";
import { getAuth } from "@hono/clerk-auth";
import { createClerkClient } from "@clerk/backend";
import { pusher } from "@summaraize/pusher";

export const pusherAuthRoute = new Hono();
const clerk = createClerkClient({});

pusherAuthRoute.post("/", async (c) => {
  const data = await c.req.text();
  const [socketId, channelName] = data.split("&").map((str) => str.split("=")[1]);

  const userId = getAuth(c)?.userId;
  if (!userId) {
    return c.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userIdFromChannel = channelName?.split("-")[1];

  if (userId !== userIdFromChannel) {
    return c.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log(`Authenticating user ${userId} for socket ${socketId}`);

  const user = await clerk.users.getUser(userId);

  if (!socketId || !channelName || !user) {
    const missingItems = [
      !socketId ? "socketId" : null,
      !channelName ? "channelName" : null,
      !user ? "user" : null,
    ].filter(Boolean);

    return c.json(
      {
        error: `Unable to establish socket connection, missing: ${missingItems.join(",")}`,
      },
      { status: 400 },
    );
  }

  const authResponse = pusher.authorizeChannel(socketId, channelName, {
    user_id: user.id,
  });

  return c.json(authResponse, { status: 200 });
});
