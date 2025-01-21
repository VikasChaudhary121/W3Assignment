import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/allUsers");
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          setError(data.message || "Failed to fetch users.");
        }
      } catch (err) {
        setError("An error occurred while fetching users.");
      }
    };

    fetchUsers();
  }, []);

  const fetchUserDetails = async (username) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/users/${username}/images`);
      const data = await response.json();

      if (response.ok) {
        setSelectedUser(data);
      } else {
        setError(data.message || "Failed to fetch user details.");
      }
    } catch (err) {
      setError("An error occurred while fetching user details.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setRedirectToLogin(true);
      }
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Registered Users</h2>
        {users.length > 0 ? (
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user._id}
                className="cursor-pointer p-2 rounded hover:bg-blue-100"
                onClick={() => fetchUserDetails(user.username)}
              >
                {user.username}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {/* Main content */}
      <div className="w-2/3 p-4">
        {/* Admin Dashboard Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <p>Loading user details...</p>
        ) : selectedUser ? (
          <div>
            <h2 className="text-2xl font-bold">{selectedUser.username}</h2>
            <p className="text-lg text-gray-600 mb-4">
              Handle: {selectedUser.handle}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedUser.images.map((image, index) => (
                <img
                  key={index}
                  src={`data:${image.type};base64,${image.data}`}
                  alt={image.name}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          </div>
        ) : (
          <p>Select a user to see their details.</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
