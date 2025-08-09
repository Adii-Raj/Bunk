import { useState, useEffect } from "react";
import { useSupabase } from "../hooks/useSupabase";
import { useAuth } from "../hooks/useAuth";

export default function AttendanceCounter() {
  const { user } = useAuth();
  const { fetchTable } = useSupabase();
  const [presentCount, setPresentCount] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);

  useEffect(() => {
    const loadAttendance = async () => {
      const data = await fetchTable("attendance", { student_id: user.id });
      if (data) {
        setTotalClasses(data.length);
        setPresentCount(data.filter((a) => a.present).length);
      }
    };
    loadAttendance();
  }, []);

  const percentage = totalClasses
    ? ((presentCount / totalClasses) * 100).toFixed(2)
    : 100;

  const canBunk = () => {
    let allowed = 0;
    let attended = presentCount;
    let total = totalClasses;
    while (((attended / total) * 100) >= 75) {
      total++;
      allowed++;
    }
    return allowed - 1;
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-lg">Attendance Summary</h2>
      <p>Present: {presentCount}</p>
      <p>Total: {totalClasses}</p>
      <p>Percentage: {percentage}%</p>
      <p>You can bunk: {canBunk()} classes</p>
    </div>
  );
}
