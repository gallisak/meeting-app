import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { setUser } from "../app/features/userSlice";
import { loginUser } from "../app/services/auth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await loginUser(email, pass);

      dispatch(
        setUser({
          email: result?.user.email || "",
          uid: result!.user.uid,
          role: (result as { role?: string }).role || "user",
        })
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md flex flex-col gap-4 w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Log In</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded text-sm text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Log In
        </button>

        <div className="text-center text-sm text-gray-500">
          No account yet?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};
