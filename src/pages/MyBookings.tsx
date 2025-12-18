import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAppSelector } from "../app/hooks";

interface Booking {
  id: string;
  roomName: string;
  date: string;
  time: string;
  roomId: string;
}

export const MyBookings = () => {
  const user = useAppSelector((state) => state.auth);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user.uid) return;

    try {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);

      const list: Booking[] = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Booking)
      );

      setBookings(list);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user.uid]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      await deleteDoc(doc(db, "bookings", id));

      setBookings((prev) => prev.filter((booking) => booking.id !== id));

      alert("Booking cancelled successfully");
    } catch (error) {
      console.error("Error cancelling:", error);
      alert("Failed to cancel booking");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading your schedule...</p>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg mb-4">
              You have no active bookings.
            </p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Find a Room
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {booking.roomName}
                  </h3>
                  <div className="text-gray-600 mt-1 flex gap-4">
                    <span className="flex items-center gap-1">
                      📅 {booking.date}
                    </span>
                    <span className="flex items-center gap-1">
                      ⏰ {booking.time}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(booking.id)}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded border border-red-100 hover:bg-red-100 transition text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
