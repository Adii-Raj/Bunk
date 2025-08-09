import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CRPanel() {
  const navigate = useNavigate();
  const [cr, setCr] = useState(null);
  const [students, setStudents] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch CR data & students list
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Check if CR
      const { data: crData, error: crError } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_cr", true)
        .single();

      if (crError || !crData) {
        alert("You are not authorized to access CR panel");
        navigate("/dashboard");
        return;
      }

      setCr(crData);

      // Fetch students in same section/group
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .eq("section", crData.section)
        .eq("group_name", crData.group_name);

      if (studentsError) console.error(studentsError);
      else setStudents(studentsData);

      // Fetch timetable
      const { data: timetableData, error: timetableError } = await supabase
        .from("timetables")
        .select("*")
        .eq("section", crData.section)
        .eq("group_name", crData.group_name)
        .order("day_of_week", { ascending: true });

      if (timetableError) console.error(timetableError);
      else setTimetable(timetableData);

      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  // ✅ Save timetable changes
  const saveTimetable = async () => {
    for (let entry of timetable) {
      await supabase
        .from("timetables")
        .update({
          class_name: entry.class_name,
          start_time: entry.start_time,
          end_time: entry.end_time
        })
        .eq("id", entry.id);
    }
    alert("Timetable updated for all students in section");
  };

  // ✅ Mark attendance for a student
  const markAttendance = async (studentId, date, status) => {
    const { data: existing } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", studentId)
      .eq("date", date)
      .single();

    if (existing) {
      await supabase
        .from("attendance")
        .update({ status })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("attendance")
        .insert([{ student_id: studentId, date, status }]);
    }

    alert("Attendance updated");
  };

  if (loading) {
    return <div className="text-center mt-10">Loading CR Panel...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">CR Panel - {cr.section} {cr.group_name}</h1>
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

      {/* Timetable Editor */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Edit Timetable</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Day</th>
              <th className="border p-2">Class</th>
              <th className="border p-2">Start</th>
              <th className="border p-2">End</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((t, idx) => (
              <tr key={t.id}>
                <td className="border p-2">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][t.day_of_week]}</td>
                <td className="border p-2">
                  <input
                    value={t.class_name}
                    onChange={(e) => {
                      const newTT = [...timetable];
                      newTT[idx].class_name = e.target.value;
                      setTimetable(newTT);
                    }}
                    className="w-full border rounded px-2"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="time"
                    value={t.start_time}
                    onChange={(e) => {
                      const newTT = [...timetable];
                      newTT[idx].start_time = e.target.value;
                      setTimetable(newTT);
                    }}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="time"
                    value={t.end_time}
                    onChange={(e) => {
                      const newTT = [...timetable];
                      newTT[idx].end_time = e.target.value;
                      setTimetable(newTT);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={saveTimetable}
        >
          Save Timetable
        </button>
      </div>

      {/* Attendance Manager */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>
        {students.map((s) => (
          <div key={s.id} className="flex justify-between items-center border-b py-2">
            <span>{s.name} ({s.roll_no})</span>
            <div>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                onClick={() => markAttendance(s.id, new Date().toISOString().split("T")[0], "present")}
              >
                Present
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => markAttendance(s.id, new Date().toISOString().split("T")[0], "absent")}
              >
                Absent
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
