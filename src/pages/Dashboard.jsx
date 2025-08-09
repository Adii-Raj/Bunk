import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch logged in student data
  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Get student profile
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (studentError) {
        console.error(studentError);
        return;
      }

      setStudent(studentData);

      // Get timetable
      const { data: timetableData, error: timetableError } = await supabase
        .from("timetables")
        .select("*")
        .eq("section", studentData.section)
        .eq("group_name", studentData.group_name)
        .order("day_of_week", { ascending: true });

      if (timetableError) console.error(timetableError);
      else setTimetable(timetableData);

      // Get attendance
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", studentData.id)
        .order("date", { ascending: true });

      if (attendanceError) console.error(attendanceError);
      else setAttendance(attendanceData);

      setLoading(false);
    };

    getData();
  }, [navigate]);

  // Calculate bunk limit
  const getBunkInfo = () => {
    const totalClasses = attendance.length;
    const presentCount = attendance.filter(a => a.status === "present").length;
    const requiredClasses = Math.ceil(totalClasses * 0.75);

    const bunkable = presentCount - requiredClasses;
    return {
      presentCount,
      totalClasses,
      bunkable: bunkable > 0 ? bunkable : 0
    };
  };

  if (loading) {
    return <div className="text-center mt-10">Loading your dashboard...</div>;
  }

  const bunkInfo = getBunkInfo();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {student?.name}</h1>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* Bunk Info */}
      <div className="bg-blue-50 p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-2">Bunk Calculator</h2>
        <p>Total Classes: {bunkInfo.totalClasses}</p>
        <p>Present: {bunkInfo.presentCount}</p>
        <p className="font-bold">
          You can still bunk:{" "}
          <span className="text-green-600">{bunkInfo.bunkable}</span> classes
        </p>
      </div>

      {/* Timetable */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Weekly Timetable</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Day</th>
              <th className="border p-2">Class</th>
              <th className="border p-2">Start Time</th>
              <th className="border p-2">End Time</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((t) => (
              <tr key={t.id}>
                <td className="border p-2">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][t.day_of_week]}</td>
                <td className="border p-2">{t.class_name}</td>
                <td className="border p-2">{t.start_time}</td>
                <td className="border p-2">{t.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attendance Calendar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Attendance Calendar</h2>
        <div className="grid grid-cols-7 gap-2">
          {attendance.map((a) => (
            <div
              key={a.id}
              className={`p-2 text-center rounded-lg text-white ${
                a.status === "present" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
