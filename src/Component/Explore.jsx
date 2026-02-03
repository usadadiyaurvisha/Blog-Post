import React, { useEffect, useState, useContext } from "react";
import "./Explore.css";
import Card from "./Card";
import Pagination from "./Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch } from "react-icons/fa";
import ModeContext from "../context/ModeContext"; // ✅ import context

export default function ExplorePost() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({});
  const [editPostId, setEditPostId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);

  const ctx = useContext(ModeContext); // ✅ use context for dark/light mode

  // Apply dark/light mode to body
  useEffect(() => {
    if (ctx.mode === "dark") {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [ctx.mode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://696b4b20624d7ddccaa0bb77.mockapi.io/createpostdata"
      );
      const data = await response.json();
      const reverseData = [...data].reverse();
      setPosts(reverseData);
      setFilteredPosts(reverseData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setCurrentPage(1);

    const result = posts.filter(
      (item) =>
        item.title.toLowerCase().includes(value) ||
        item.body.toLowerCase().includes(value)
    );
    setFilteredPosts(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!body.trim()) newErrors.body = "Body is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      let response;

      if (editPostId) {
        response = await fetch(
          `https://696b4b20624d7ddccaa0bb77.mockapi.io/createpostdata/${editPostId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, body }),
          }
        );
      } else {
        response = await fetch(
          "https://696b4b20624d7ddccaa0bb77.mockapi.io/createpostdata",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              body,
              image: `https://picsum.photos/seed/${Date.now()}/300/200`,
            }),
          }
        );
      }

      if (!response.ok) throw new Error("Failed");

      const post = await response.json();

      if (editPostId) {
        setPosts((prev) => prev.map((p) => (p.id === editPostId ? post : p)));
        setFilteredPosts((prev) =>
          prev.map((p) => (p.id === editPostId ? post : p))
        );
        toast.success("Post updated successfully!");
      } else {
        setPosts((prev) => [post, ...prev]);
        setFilteredPosts((prev) => [post, ...prev]);
        toast.success("Post created successfully!");
      }

      setTitle("");
      setBody("");
      setErrors({});
      setShowForm(false);
      setEditPostId(null);
    } catch (error) {
      toast.error("Failed to save post!");
    }
  };

  const handleEdit = (post) => {
    setEditPostId(post.id);
    setTitle(post.title);
    setBody(post.body);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await fetch(
        `https://696b4b20624d7ddccaa0bb77.mockapi.io/createpostdata/${deletePostId}`,
        { method: "DELETE" }
      );

      setPosts((prev) => prev.filter((p) => p.id !== deletePostId));
      setFilteredPosts((prev) => prev.filter((p) => p.id !== deletePostId));
      toast.success("Post deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete post!");
    } finally {
      setShowDeleteModal(false);
      setDeletePostId(null);
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const totalPages = Math.ceil(filteredPosts.length / pageSize);

  return (
    <>
      <ToastContainer />

      {/* ===== TOP BAR ===== */}
      <div className={`explore-topbar ${ctx.mode}`}>
        <button className="createbtn" onClick={() => setShowForm(true)}>
          Create Form
        </button>

        <h2 className="headerclass">Explore Posts</h2>

        <div className="search-wrapper">
          <FaSearch />
          <input
            type="text"
            placeholder="Search item..."
            value={search}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {/* ===== FORM ===== */}
      {showForm && (
        <form className={`create-form ${ctx.mode}`} onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-input"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="error">{errors.title}</p>}

          <textarea
            className="form-textarea"
            placeholder="Enter Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
          {errors.body && <p className="error">{errors.body}</p>}

          <div className="form-button">
            <button type="submit" className="submit-btn">
              {editPostId ? "Update" : "Submit"}
            </button>
            <button
              type="button"
              className="cancle-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ===== CARDS ===== */}
      <div className="card-container">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state">No posts found</div>
        ) : (
          filteredPosts
            .slice(startIndex, startIndex + pageSize)
            .map((item) => (
              <Card
                key={item.id}
                {...item}
                onEdit={() => handleEdit(item)}
                onDelete={() => {
                  setDeletePostId(item.id);
                  setShowDeleteModal(true);
                }}
              />
            ))
        )}
      </div>

      {/* ===== DELETE MODAL ===== */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className={`modal-box ${ctx.mode}`}>
            <h3>Confirm Delete</h3>
            <p>Are you sure?</p>
            <div className="modal-actions">
              <button className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((p) => p - 1)}
        onNext={() => setCurrentPage((p) => setCurrentPage((p) => p + 1))}
        onPageSizeChange={(size) => setPageSize(size)}
      />
    </>
  );
}
