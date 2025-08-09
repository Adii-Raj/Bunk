import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roll_number: "",
    section: "A",
    group_name: "1",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. Insert into students table
      const { error: dbError } = await supabase.from("students").insert([
        {
          user_id: authData.user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          roll_number: formData.roll_number,
          section: formData.section,
          group_name: formData.group_name,
        },
      ]);

      if (dbError) throw dbError;

      setMessage({
        type: "success",
        text: "Signup successful! Please check your email to verify.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        roll_number: "",
        section: "A",
        group_name: "1",
        password: "",
      });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Create Your Account</h2>

        {message && (
          <div
            className={`p-3 mb-4 rounded-lg text-white ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
          <input
            type="email"
            name="email"
            placeholder="College Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="roll_number"
            placeholder="Roll Number"
            value={formData.roll_number}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Section</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Group</label>
              <select
                name="group_name"
                value={formData.group_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
          </div>

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
