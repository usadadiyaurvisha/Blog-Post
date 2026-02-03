import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Component/Card";
import ConfirmationModal from "../Component/ConfirmationModal";
import arrow from "../assets/aarrow.jpg";
import './HomePage.css';
import ModeContext from "../context/ModeContext";
import Footer from "../Component/Footer";



export const HomePage = () => {
  const [allPostData, setAllPostData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const ctx = useContext(ModeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("postData")) || [];
    setAllPostData(storedData);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollBtn(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openDeleteModal = (index) => {
    setSelectedIndex(index);
    setShowModal(true);
  };

  const clickHandle = (id) => navigate(`/posts/${id}`);

  const confirmDelete = () => {
    const updatedPostData = allPostData.filter((_, i) => i !== selectedIndex);
    setAllPostData(updatedPostData);
    localStorage.setItem("postData", JSON.stringify(updatedPostData));
    setShowModal(false);
  };

  const handleEdit = (id) => navigate("/new-post", { state: { id } });

  return (
    <>
     
   <span id="top"></span>

<div className={`container-home ${ctx.mode}`}>
  <h1>Home Page</h1>

  {allPostData.length === 0 ? (
    <p>Data is not found</p>
  ) : (
    allPostData.map((item, index) => (
      <Card
        key={index}
        image={item.image}
        title={item.title}
        desc={item.body}
        onDelete={() => openDeleteModal(index)}
        onRedirect={() => clickHandle(item.id)}
        onEdit={() => handleEdit(item.id)}
      />
    ))
  )}
</div>

        {showScrollBtn && (
          <img
            src={arrow}
            alt="Scroll to Top"
            className="scroll-top-img"
            onClick={() => scrollToSection('top')}
          />
        )}
     
      {showModal && (
        <ConfirmationModal
          title="Delete Post?"
          desc="You are about to delete this post, are you sure?"
          onConfirm={confirmDelete}
          onClose={() => setShowModal(false)}
          confirmBtnText="Delete"
        />
      )}
    </>
  );
};
