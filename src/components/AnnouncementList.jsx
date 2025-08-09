import { useState, useEffect } from "react";
import { useSupabase } from "../hooks/useSupabase";

export default function AnnouncementList() {
  const { fetchTable } = useSupabase();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchTable("announcements");
      setAnnouncements(data || []);
    };
    load();
  }, []);

  return (
    <div>
      {announcements.length === 0 && <p>No announcements yet.</p>}
      {announcements.map((a) => (
        <div key={a.id} className="bg-gray-100 p-3 rounded mb-2">
          <h3 className="font-bold">{a.title}</h3>
          <p>{a.content}</p>
          <small>{new Date(a.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
