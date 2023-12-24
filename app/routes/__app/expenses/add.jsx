import { redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import ExpenseForm from "~/components/expenses/ExpenseForm";
import Modal from "~/components/util/Modal";
import { requireUserSession } from "~/data/auth.server";
import { addExpense } from "~/data/expense.server";
import { validateExpenseInput } from "~/data/validation.server";

export default function AddExpenses() {
  const navigate = useNavigate();
  return (
    <Modal onClose={() => navigate("..")}>
      <ExpenseForm />
    </Modal>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const expenseData = Object.fromEntries(formData);
  try {
    validateExpenseInput(expenseData);
  } catch (error) {
    return error;
  }
  const userId = await requireUserSession(request);
  await addExpense(expenseData, userId);
  return redirect("/expenses");
}
