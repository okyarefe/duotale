const { Webhook } = require("svix");
const { headers } = require("next/headers");
const { WebhookEvent } = require("@clerk/nextjs/server");

const { createUser, deleteUser } = require("../../../_lib/data-service"); // Example imports for createUser and deleteUser

export async function POST(req) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  console.log("***************** WEB-HOOK RUNS *****************");

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

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Do something with the payload
  const { id } = evt.data;
  const eventType = evt.type;

  // console.log(`Webhook with an ID of ${id} and type of ${eventType}`);

  if (eventType === "user.created") {
    // Create a new user
    console.log("WEB HOOK EVENT IS - USER CREATED");
    console.log("UserId", evt.data.id);
    console.log("Email", evt.data.email_addresses[0]["email_address"]);

    console.log("Webhook: createUser run in webhooks");
    try {
      const createdUser = await createUser({
        clerkId: evt.data.id,
        email: evt.data.email_addresses[0]["email_address"],
      });
      console.log(
        "Webhook: created user returned from supabase in web hooks",
        createdUser
      );
      return new Response("Successfully created user", { status: 200 });
    } catch (error) {
      return new Response(error.message, { status: 500 });
    }
  } else if (eventType === "user.deleted") {
    // Delete user
    console.log("Webhook: Deleting user");
    const deletedUser = await deleteUser({
      clerkId: evt.data.id,
    });
    console.log("Webhook: Deleted user Successfully.User id:", {
      clerkId: evt.data.id,
    });
    return new Response("Successfully deleted user", { status: 200 });
  }

  return new Response("Nothing happened", { status: 200 });
}
