import { auth, clerkClient } from "@clerk/nextjs/server";
import { pusher } from "@summaraize/pusher";

export async function POST(req: Request) {
	const data = await req.text();
	const [socketId, channelName] = data
		.split("&")
		.map((str) => str.split("=")[1]);

	const userId = auth().userId;
	if (!userId) {
		return new Response("Unauthorized", { status: 401 });
	}

	const userIdFromChannel = channelName?.split("-")[1];

	if (userId !== userIdFromChannel) {
		return new Response("Unauthorized", { status: 401 });
	}

	console.log(`Authenticating user ${userId} for socket ${socketId}`);

	const user = await clerkClient.users.getUser(userId);

	if (!socketId || !channelName || !user) {
		return new Response("Unauthorized", { status: 401 });
	}
	const authResponse = pusher.authorizeChannel(socketId, channelName, {
		user_id: user.id,
	});

	return new Response(JSON.stringify(authResponse));
}
