import { Clerk } from "@clerk/clerk-js/headless";

let clerkSingleton: Clerk | null = null;

const clerk = new Clerk(process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY as string);

export const getClerkJs = async () => {
  if (clerkSingleton) {
    return clerkSingleton;
  }

  await clerk.load();
  return (clerkSingleton ??= clerk);
};
