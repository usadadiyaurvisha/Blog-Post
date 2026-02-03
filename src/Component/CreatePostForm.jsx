import React, { useEffect, useState } from "react";
import "./CreatePostForm.css";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "./Loader";

export default function CreatePostForm() {
  const navigate = useNavigate();

  const [CreatePostFormData, setCreatePostFormData] = useState({
    title: "",
    body: "",
    image: ""
  });

  const [errors, setError] = useState({});
  const location = useLocation();
  const [Loading, setLoading] = useState(false);

  const editPostId = location.state?.id || null;

  const handleChange = (field, value) => {
    setError(prev => ({ ...prev, [field]: "" }));
    setCreatePostFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // 🔹 auto fill data (edit mode)
  useEffect(() => {
    if (!editPostId) return;

    const posts = JSON.parse(localStorage.getItem("postData")) || [];
    const postToEdit = posts.find((p) => p.id === editPostId);

    if (postToEdit) {
      setCreatePostFormData({
        title: postToEdit.title,
        body: postToEdit.body,
        image: postToEdit.image,
      });
    }
  }, [editPostId]);

  const handleImageChange = (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setError(prev => ({
        ...prev,
        image: "Only JPG, JPEG, PNG images are allowed"
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCreatePostFormData(prevData => ({
        ...prevData,
        image: reader.result
      }));
      setError(prev => ({ ...prev, image: "" }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newerror = {};
    if (!CreatePostFormData.title.trim()) newerror.title = "title is required";
    if (!CreatePostFormData.body.trim()) newerror.body = "body is required";
    if (!CreatePostFormData.image) newerror.image = "image is required";

    setError(newerror);
    if (Object.keys(newerror).length > 0) return;

    setLoading(true); 

    setTimeout(() => {
      const existingPosts =
        JSON.parse(localStorage.getItem("postData")) || [];

      if (editPostId) {
        const updatedPosts = existingPosts.map((p) =>
          p.id === editPostId ? { ...p, ...CreatePostFormData } : p
        );
        localStorage.setItem("postData", JSON.stringify(updatedPosts));
        toast.success("Post updated successfully 🎉");
      } else {
        const updatePosts = [
          ...existingPosts,
          { id: uuidv4(), ...CreatePostFormData }
        ];
        localStorage.setItem("postData", JSON.stringify(updatePosts));
        toast.success("Post added successfully ");
      }

      setLoading(false);
      navigate("/"); // 🔹 navigate after 3 sec
    }, 3000); // 3 seconds
  };

  // 🔹 Loader rendering
  if (Loading) {
    return <Loader />;
  }

  // 🔹 CANCEL BUTTON HANDLER
  const handleCancel = () => {
    navigate("/"); // home page
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mainform">
        <div className="form">
          <h1>Let's Create New Post</h1>

          <input
            type="text"
            className="area"
            placeholder="Enter title"
            value={CreatePostFormData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          {errors.title && <span className="error">{errors.title}</span>}

          <input
            type="text"
            className="desc"
            placeholder="Enter Body"
            value={CreatePostFormData.body}
            onChange={(e) => handleChange("body", e.target.value)}
          />
          {errors.body && <span className="error">{errors.body}</span>}

          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            className="area"
            onChange={(e) => handleImageChange(e.target.files[0])}
          />
          {errors.image && <span className="error">{errors.image}</span>}

          {CreatePostFormData.image && (
            <img
              src={CreatePostFormData.image}
              alt="preview"
              style={{ width: 200, borderRadius: 10, marginTop: 10 }}
            />
          )}

          <div className="btn-row">
            <button type="submit" className="btn">
              {editPostId ? "Update Post" : "Add Post"}
            </button>

            <button
              type="button"
              className="btn cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
