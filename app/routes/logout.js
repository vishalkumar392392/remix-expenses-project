import { destroySession } from "~/data/auth.server";

export async function action({ request }) {
  return await destroySession(request);
}
