import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useAppSelector } from "../app/hooks";

export const CreateRoom = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.role !== "admin") {
      navigate("/");
    }
  }, [user.role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "rooms"), {
        title,
        description,
        capacity: Number(capacity),
        createdAt: new Date().toISOString(),
      });

      alert("Room created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Error creating room");
    } finally {
      setLoading(false);
    }
  };

  if (user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create New Room
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Room Title
            </label>
            <input
              type="text"
              required
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Green Meeting Room"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              required
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Room details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Capacity (People)
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., 5"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-bold"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};
