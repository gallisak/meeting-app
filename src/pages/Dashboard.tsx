import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout } from "../app/features/userSlice";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export const Dashboard = () => {
  const user = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Бронювання кімнат
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {user.email} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
            >
              Вийти
            </button>
          </div>
        </header>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Доступні кімнати</h2>
          <p className="text-gray-500">Тут скоро буде список кімнат...</p>
        </div>
      </div>
    </div>
  );
};
