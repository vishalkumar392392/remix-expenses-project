import { redirect } from "@remix-run/node";
import {
  useLoaderData,
  useMatches,
  useNavigate,
  useParams,
} from "@remix-run/react";
import ExpenseForm from "~/components/expenses/ExpenseForm";
import Modal from "~/components/util/Modal";
import { deleteExpense, updateExpense } from "~/data/expense.server";
import { validateExpenseInput } from "~/data/validation.server";

export default function ExpensesId() {
  const navigate = useNavigate();
  const matches = useMatches();
  const params = useParams();
  const expensesData = matches
    ?.filter((route) => route.pathname === "/expenses")
    .map((filteredData) => filteredData.data)
    .flat()
    .filter((d) => d.id === params.id)[0];

  return (
    <Modal onClose={() => navigate("..")}>
      <ExpenseForm data={expensesData} />
    </Modal>
  );
}

// export async function loader({ params }) {
//   console.log("params: ", params);
//   const res = await getExpenseById(params.id);
//   console.log("res: ", res);
//   return res;
// }

export async function action({ params, request }) {
  if (request.method === "DELETE") {
    await deleteExpense(params.id);
    return redirect("/expenses");
  }

  const formData = await request.formData();
  const expenseData = Object.fromEntries(formData);
  try {
    validateExpenseInput(expenseData);
  } catch (error) {
    return error;
  }
  await updateExpense(params.id, expenseData);
  return redirect("/expenses");
}
