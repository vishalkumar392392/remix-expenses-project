import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";

function ExpenseForm({ data }) {
  const today = new Date().toISOString().slice(0, 10); // yields something like 2023-09-10
  const validationErrors = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  // const submit = useSubmit();
  // const submitHandler = (event) => {
  //   event.preventDefault();
  //   // perform validation

  //   submit(event.target, {
  //     action: "/expenses/add",
  //     method: "post",
  //   });
  // };

  return (
    <Form
      method="post"
      className="form"
      id="expense-form"
      // onSubmit={submitHandler}
    >
      <p>
        <label htmlFor="title">Expense Title</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={data?.title}
          required
          maxLength={30}
        />
      </p>

      <div className="form-row">
        <p>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0"
            step="0.01"
            required
            defaultValue={data?.amount}
          />
        </p>
        <p>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={
              data?.date && new Date(data?.date).toISOString().slice(0, 10)
            }
            max={today}
            required
          />
        </p>
      </div>
      {validationErrors &&
        Object.values(validationErrors).map((error) => (
          <li key={error}>{error}</li>
        ))}
      <div className="form-actions">
        <button disabled={isSubmitting}>
          {isSubmitting ? "Saving...." : "Save Expense"}
        </button>
        <Link to={".."}>Cancel</Link>
      </div>
    </Form>
  );
}

export default ExpenseForm;
