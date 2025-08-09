import { useState, useEffect } from "react";
import { useSupabase } from "../hooks/useSupabase";
import { useAuth } from "../hooks/useAuth";

export default function CalendarView() {
  const { user } = useAuth();
  const { fetchTable, upsertData } = useSupabase();
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const loadAttendance = async () => {
      const data = await fetchTable("attendance", { student_id: user.id });
      setAttendance(data || []);
    };
    loadAttendance();
  }, []);

  const toggleDay = async (date) => {
    const existing = attendance.find((a) => a.date === date);
    const present = existing ? !existing.present : false;
    await upsertData("attendance", {
      student_id: user.id,
      date,
      present,
    });
    setAttendance((prev) => {
      const updated = prev.filter((a) => a.date !== date);
      return [...updated, { date, present }];
    });
  };

  // Generate dates for current month
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates = [...Array(daysInMonth).keys()].map((d) => {
    const day = String(d + 1).padStart(2, "0");
    return `${year}-${String(month + 1).padStart(2, "0")}-${day}`;
  });

  return (
    <div>
      <h2 className="text-lg mb-3">Attendance Calendar</h2>
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date) => {
          const record = attendance.find((a) => a.date === date);
          const isPresent = record?.present ?? true; // default to present if no record
          return (
            <div
              key={date}
              className={`p-2 rounded text-center cursor-pointer ${
                isPresent ? "bg-green-200" : "bg-red-200"
              }`}
              onClick={() => toggleDay(date)}
            >
              {date.split("-")[2]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
