import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAppSelector } from "../app/hooks";

interface Room {
  id: string;
  title: string;
  description: string;
  capacity: number;
}

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export const RoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth);

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;
      try {
        const roomRef = doc(db, "rooms", id);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
          setRoom({ id: roomSnap.id, ...roomSnap.data() } as Room);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error loading room:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, navigate]);

  const handleBooking = async () => {
    if (!user.uid || !room) {
      alert("Please log in to book a room!");
      return;
    }

    setIsBooking(true);

    try {
      const q = query(
        collection(db, "bookings"),
        where("roomId", "==", room.id),
        where("date", "==", selectedDate),
        where("time", "==", selectedTime)
      );

      const existingBookings = await getDocs(q);

      if (!existingBookings.empty) {
        alert(
          "❌ This time slot is already booked! Please choose another time."
        );
        setIsBooking(false);
        return;
      }

      await addDoc(collection(db, "bookings"), {
        roomId: room.id,
        roomName: room.title,
        userId: user.uid,
        userEmail: user.email,
        date: selectedDate,
        time: selectedTime,
        createdAt: new Date().toISOString(),
      });

      alert("Success! Room booked successfully.");
      navigate("/");
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred while booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading)
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  if (!room) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block font-medium"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-48 bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <span className="text-6xl font-medium">Room</span>
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {room.title}
            </h1>
            <p className="text-gray-600 mb-8">{room.description}</p>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Select Date & Time
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Slot
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-1 rounded text-sm font-medium transition
                          ${
                            selectedTime === time
                              ? "bg-blue-600 text-white shadow-md transform scale-105"
                              : "bg-white text-gray-700 border hover:bg-blue-50"
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t flex justify-end">
                <button
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime || isBooking}
                  className={`px-8 py-3 rounded-lg font-bold text-white transition flex items-center gap-2
                    ${
                      !selectedDate || !selectedTime || isBooking
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl"
                    }
                  `}
                >
                  {isBooking ? "Checking availability..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
