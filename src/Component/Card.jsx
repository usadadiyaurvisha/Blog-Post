import "./Card.css";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

const Card = (props) => {
  const [showModal, setShowModal] = useState(false);

  const loggedInUserData =
    JSON.parse(localStorage.getItem("loginData")) || {};

  const showModalHandler = () => setShowModal(true);
  const hideModalHandler = () => setShowModal(false);

  const handleDelete = () => {
    setShowModal(false);
    props.onDelete && props.onDelete();
  };

  // ✅ SAFE DESC (ERROR FIX)
  const desc = props.desc || "";

  return (
    <div className="card">
      <div className="icon-center" onClick={props.onRedirect}>
        <img
          className="card-img"
          src={
            props.image
              ? props.image
              : `https://picsum.photos/id/${props.id}/500/300`
          }
          alt="post"
        />
      </div>

      <div className="card-content">
        <h1>{props.title}</h1>

        <p>
          {desc.length > 90
            ? desc.substring(0, 90) + ".."
            : desc}
        </p>
      </div>

      {loggedInUserData?.role === "admin" && (
        <div className="btn-box">
          <button className="btn-edit" onClick={props.onEdit}>
            Edit
          </button>

          {/* 🔹 modal open */}
          <button className="btn-delete" onClick={showModalHandler}>
            Delete
          </button>
        </div>
      )}

      {showModal && (
        <ConfirmationModal
          title="Delete Post?"
          desc="You are about to delete this post. Are you sure?"
          onClose={hideModalHandler}
          onConfirm={handleDelete}
          confirmBtnText="Delete"
        />
      )}
    </div>
  );
};

export default Card;
