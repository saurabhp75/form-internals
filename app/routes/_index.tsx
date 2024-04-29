import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Form internals" },
    { name: "Form internals", content: "Form internals for conform" },
  ];
};

export default function SignupForm() {
  return (
    <form method="post">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div>
        <label htmlFor="passwd">Password</label>
        <input
          id="passwd"
          name="password"
          type="password"
          required
          minLength={8}
          pattern="(?=.*?[a-z])(?=.*?[A-Z]).*"
        />
      </div>
      <div>
        <label htmlFor="c-passwd">Confirm Password</label>
        <input id="c-passwd" name="confirmPassword" type="password" required />
      </div>
      <button>Signup</button>
    </form>
  );
}
