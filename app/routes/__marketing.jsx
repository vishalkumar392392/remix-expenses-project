import { Outlet, useActionData } from "@remix-run/react";
import MainHeader from "~/components/navigation/MainHeader";
import { getUserFromSession } from "~/data/auth.server";

import marketingStyles from "~/styles/marketing.css";

export default function MarketingLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />;
    </>
  );
}

export async function loader({ request }) {
  return await getUserFromSession(request);
}

export function links() {
  return [{ rel: "stylesheet", href: marketingStyles }];
}
