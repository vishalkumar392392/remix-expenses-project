import { getExpenses } from "~/data/expense.server";

export async function loader() {
  return await getExpenses();
}
