"use client";
import { AuthContext } from "@/components/providers/auth-provider";
import { redirect } from "next/navigation";
import { useContext } from "react";

export default function LoginPage() {
  const { user, login } = useContext(AuthContext);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    login(form.email.value, form.password.value);
  };

  if (user) {
    return redirect("/formations");
  }

  return (
    <div>
      <h1>Page de login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
