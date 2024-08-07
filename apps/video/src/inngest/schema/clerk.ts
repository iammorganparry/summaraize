import type { UserJSON } from "@clerk/clerk-sdk-node";

type ClerkUserCreatedEvent = {
  name: "clerk/user.created";
  data: UserJSON;
};

type ClerkUserUpdatedEvent = {
  name: "clerk/user.updated";
  data: UserJSON;
};

type ClerkUserDeletedEvent = {
  name: "clerk/user.deleted";
  data: UserJSON;
};

export type ClerkEvents = {
  "clerk/user.created": ClerkUserCreatedEvent;
  "clerk/user.updated": ClerkUserUpdatedEvent;
  "clerk/user.deleted": ClerkUserDeletedEvent;
};
