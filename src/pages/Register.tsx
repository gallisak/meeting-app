import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { setUser } from "../app/features/userSlice";
import { registerUser } from "../app/services/auth";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await registerUser(name, email, pass);

      dispatch(
        setUser({
          email: user.email || "",
          uid: user.uid,
          role: "user",
        })
      );
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-md flex flex-col gap-4 w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Registration</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Your name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          placeholder="Password (min. 6 characters)"
          className="border p-2 rounded"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
          minLength={6}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Create an account
        </button>

        <div className="text-center text-sm text-gray-500">
          Already have an account??{" "}
          <Link to="/login" className="text-blue-600 underline">
            log in
          </Link>
        </div>
      </form>
    </div>
  );
};
