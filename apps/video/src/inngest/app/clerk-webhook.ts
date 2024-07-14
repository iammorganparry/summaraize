import { inngest } from "../client";

export const syncUser = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  [{ event: "clerk/user.created" }, { event: "clerk/user.updated" }],
  async ({ event, logger, services }) => {
    // The event payload's data will be the Clerk User json object
    logger.info("Syncing user from Clerk", event.data);

    const {
      id,
      first_name,
      last_name,
      email_addresses,
      primary_email_address_id,
    } = event.data;
    const email = email_addresses?.find(
      (e) => e.id === primary_email_address_id
    )?.email_address;

    if (!email) {
      throw new Error(`No email found for user: ${id}`);
    }

    return await services.prisma.user.upsert({
      where: { id: id },
      update: {
        name: `${first_name} ${last_name}`,
        email: email,
      },
      create: {
        id: id,
        name: `${first_name} ${last_name}`,
        email: email,
      },
    });
  }
);
