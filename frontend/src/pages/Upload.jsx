import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Upload() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [username, setUsername] = useState("");
  const [handle, setHandle] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("handle", handle);
    selectedImages.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.post("/api/users/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload successful:", response.data);
      alert("uploaded successfully!");
      setUsername("");
      setHandle("");
      setSelectedImages([]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Upload Images
        </h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-600 font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="handle"
              className="block text-gray-600 font-medium mb-2"
            >
              Handle
            </label>
            <input
              type="text"
              id="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="Enter your handle"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="images"
              className="block text-gray-600 font-medium mb-2"
            >
              Upload Images
            </label>
            <input
              type="file"
              id="images"
              multiple
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="mt-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {image.name}
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleImageUpload}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Upload Images
          </button>
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <button
            type="button"
            onClick={handleImageUpload}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <Link to="/login" className="text-white-600 text-lg">
              Login as admin
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Upload;
