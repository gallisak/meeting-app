import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout } from "../app/features/userSlice";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

interface Room {
  id: string;
  title: string;
  description: string;
  capacity: number;
}

export const Dashboard = () => {
  const user = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rooms"));

        const roomsList: Room[] = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Room)
        );

        setRooms(roomsList);
      } catch (error) {
        console.error("Помилка при завантаженні кімнат:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
          <Link
            to="/my-bookings"
            className="text-blue-600 hover:text-blue-800 font-medium mr-4"
          >
            My Bookings
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Booking App</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-medium text-gray-900">{user.email}</div>
              <div className="text-xs text-gray-500 uppercase">{user.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              Log Out
            </button>
          </div>
        </header>

        <h2 className="text-xl font-bold mb-6 text-gray-700">
          Available Rooms
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Завантажую кімнати...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-100"
              >
                <div className="h-32 bg-blue-500 flex items-center justify-center">
                  <span className="text-4xl font-bold">Room</span>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {room.title}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      {room.capacity} people
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  <Link to={`/room/${room.id}`}>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer">
                      Book Room
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && rooms.length === 0 && (
          <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
            📭 Список кімнат порожній. Додай їх у Firebase Console!
          </div>
        )}
      </div>
    </div>
  );
};
