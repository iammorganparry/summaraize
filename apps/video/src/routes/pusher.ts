import { Hono } from "hono";
import { pusher } from "@summaraize/pusher";

export const pusherAuthRoute = new Hono();

pusherAuthRoute.post("/", async (c) => {
  const data = await c.req.text();
  const [socketId, channelName] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  const auth = c.get("clerkAuth");
  const clerk = c.get("clerk");

  const userId = auth?.userId;

  if (!userId) {
    return c.json({ error: "Unauthorized - No user ID" }, { status: 401 });
  }

  const userIdFromChannel = channelName?.split("-")[1];

  if (userId !== userIdFromChannel) {
    return c.json(
      { error: "Unauthorized - UserID not the same as channel" },
      { status: 401 }
    );
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
      { status: 400 }
    );
  }

  console.log(
    `Authenticating user ${user.id} for socket ${socketId}, channel ${channelName}`
  );

  const authResponse = pusher.authorizeChannel(socketId, channelName, {
    user_id: user.id,
  });

  return c.json(authResponse);
});
