import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { parse } from "@conform-to/validitystate";
import { useActionData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Form internals" },
    { name: "Form internals", content: "Form internals for conform" },
  ];
};

const constraints = {
  email: {
    type: "email",
    required: true,
  },
  password: {
    type: "password",
    required: true,
    minLength: 8,
    pattern: "(?=.*?[a-z])(?=.*?[A-Z]).*",
  },
  confirmPassword: {
    type: "password",
    required: true,
  },
};

function formatError({
  input,
  formData,
}: {
  input: HTMLInputElement;
  formData: FormData;
}) {
  switch (input.name) {
    case "email":
      if (input.validity.valueMissing) {
        return "Email is required";
      } else if (input.validity.typeMismatch) {
        return "Email is invalid";
      }
      break;
    case "password":
      if (input.validity.valueMissing) {
        return "Password is required";
      } else if (input.validity.tooShort) {
        return `Password must be at least ${input.minLength} characters`;
      } else if (input.validity.patternMismatch) {
        return "Password must contain at least one uppercase and one lowercase letter";
      }
      break;
    case "confirmPassword":
      if (input.validity.valueMissing) {
        return "Confirm password is required";
      } else if (input.value !== formData.get("password")) {
        return "Passwords do not match";
      }
      break;
  }

  return "";
}

type FormErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, {
    constraints,
    formatError,
  });
  if (submission.error) {
    return json(submission, { status: 400 });
  }
  // return await signup(submission.value);
  return json(submission.value);
}

export default function SignupForm() {
  const lastSubmission = useActionData();
  const [error, setError] = useState<FormErrors>(lastSubmission?.error ?? {});
  // const [error, setError] = useState<FormErrors>({});
  return (
    <form
      method="post"
      // Called for every invalid input
      onInvalid={(event) => {
        const input = event.target as HTMLFormElement;
        setError((error) => ({
          ...error,
          [input.name]: input.validationMessage,
        }));
        // Cancel the error display
        event.preventDefault();
      }}
      // Disable browser's default validation
      noValidate
      onSubmit={(event) => {
        const form = event.currentTarget;
        const formData = new FormData(form);

        // Set custom error messages
        for (const input of form.elements) {
          if (input instanceof HTMLInputElement) {
            input.setCustomValidity(formatError({ input, formData }));
          }
        }

        setError({});

        // Prevent form submission if constraint
        // validation fails
        if (!form.reportValidity()) {
          event.preventDefault();
        }
      }}
    >
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          {...constraints.email}
          className={error.email ? "error" : ""}
        />
        <p>{error.email}</p>
      </div>
      <div>
        <label htmlFor="passwd">Password</label>
        <input
          id="passwd"
          name="password"
          {...constraints.email}
          className={error.password ? "error" : ""}
        />
        <p>{error.password}</p>
      </div>
      <div>
        <label htmlFor="c-passwd">Confirm Password</label>
        <input
          id="c-passwd"
          name="confirmPassword"
          {...constraints.email}
          className={error.confirmPassword ? "error" : ""}
        />
        <p>{error.confirmPassword}</p>
      </div>
      <button>Signup</button>
    </form>
  );
}
