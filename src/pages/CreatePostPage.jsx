import React, { useContext } from "react";
import ModeContext from "../context/ModeContext";
import CreatePostForm from "../Component/CreatePostForm"
import "./CreatePostPage.css";

export const CreatePostPage = () =>

{ 
    const ctx = useContext(ModeContext);

    return(
    <div className={`create-post-page ${ctx.mode}`}>

    <CreatePostForm/>
    </div>
    )
};
