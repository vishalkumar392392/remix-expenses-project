import { prisma } from "./database.server";

export async function addExpense(expense, userId) {
  try {
    return await prisma.expense.create({
      data: {
        title: expense.title,
        amount: +expense.amount,
        date: new Date(expense.date),
        User: { connect: { id: userId } },
      },
    });
  } catch (error) {
    console.log("error occured => ", error);
    throw error;
  }
}

export async function getExpenses(userId) {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: userId },
      orderBy: {
        dateAdded: "desc",
      },
    });
    return expenses;
  } catch (error) {
    console.log("error occured => ", error);
    throw error;
  }
}
export async function getExpenseById(expenseId) {
  try {
    return await prisma.expense.findMany({
      where: {
        id: expenseId,
      },
    });
  } catch (error) {
    console.log("error occured => ", error);
    throw error;
  }
}

export async function updateExpense(id, expense) {
  try {
    await prisma.expense.update({
      where: { id },
      data: {
        title: expense.title,
        amount: +expense.amount,
        date: new Date(expense.date),
      },
    });
  } catch (error) {
    console.log("error occured => ", error);
    throw error;
  }
}

export async function deleteExpense(id) {
  try {
    await prisma.expense.delete({
      where: { id },
    });
  } catch (error) {
    console.log("error occured => ", error);
    throw error;
  }
}
