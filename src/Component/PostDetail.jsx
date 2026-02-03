import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PostDetail.css";
import ConfirmationModal from "./ConfirmationModal";

export default function PostDetail() {
  const navigate = useNavigate();
  const { postdetailId } = useParams();

  const postData = JSON.parse(localStorage.getItem("postData")) || [];
    const loggedInUserData = JSON.parse(localStorage.getItem("loginData")) || {};

  const [currentPost, setCurrentPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔹 Load current post
  useEffect(() => {
    const filtered = postData.find(
      (item) => String(item.id) === String(postdetailId)
    );

    if (filtered) {
      setCurrentPost(filtered);
    } else {
      // post na male to home par redirect
      navigate("/");
    }
  }, [postdetailId]);

  // 🔹 Close modal
  const hideModalHandle = () => {
    setShowModal(false);
  };

  // 🔹 Delete + Redirect
  const handleDeleteConfirm = () => {
    const updatedPosts = postData.filter(
      (item) => String(item.id) !== String(postdetailId)
    );

    localStorage.setItem("postData", JSON.stringify(updatedPosts));

    setShowModal(false);

    // Home page redirect
    navigate("/");
  };

  if (!currentPost) return null;

  return (
    <>
      <div className="postdetail-card">
        <div className="postdetail-img-box">
          <img src={currentPost.image} alt="post" />
        </div>

        <div className="postdetail-content">
          <div className="postdetail-desc">
            <h3>{currentPost.title}</h3>
            <p>{currentPost.body}</p>
          </div>
 {loggedInUserData?.role === "admin" ?(
          <div className="postdetail-actions">
            <button className="postdetail-btn postdetail-edit-btn"onClick={() => navigate("/new-post",{state:{id: currentPost.id},})}>Edit</button>
             
            <button
              className="postdetail-btn postdetail-delete-btn"
              onClick={() => setShowModal(true)}
            >
              Delete
            </button>
          </div>
          ): (<></>) }
        </div>
      </div>

      {showModal && (
        <ConfirmationModal
          title="Delete Post?"
          desc="Are you sure you want to delete this post?"
          onClose={hideModalHandle}
          onConfirm={handleDeleteConfirm}
          confirmBtnText="Delete"
        />
      )}
    </>
  );
}
