import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

import { createUser } from "../../../_lib/data-service"; // Example import for createUser
import { deleteUser } from "../../../_lib/data-service"; // Example imports for updateUser and deleteUser

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Do something with the payload
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);

  try {
    if (evt.type === "user.created") {
      // Create a new user

      console.log("WEB HOOK USER CREATED !");
      const createdUser = await createUser({
        clerkId: evt.data.id,
        email: evt.data.email_addresses[0]["email_address"],
      });
      console.log("USER CREATED", createdUser);
    } else if (evt.type === "user.deleted") {
      // Delete user

      const deletedUser = await deleteUser({
        clerkId: evt.data.id,
      });
      console.log("DELETING USER", deletedUser);
    }

    return new Response("", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
