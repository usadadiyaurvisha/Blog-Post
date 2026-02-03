import React from "react";
import { createBrowserRouter, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { CreatePostPage } from "../pages/CreatePostPage";
import { Loginpage } from "../pages/LoginPage";
import PostDetail from "./PostDetail";
// import RootLayout from "../pages/Rootlayout";
import AuthGuard from "../guard/AuthGuard";
import NotFound from "./NotFound";
import  Explore  from "./Explore";
import Pagination from "./Pagination";



export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Loginpage />,
  },

  {
    path: "/",
    element: <AuthGuard />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/new-post",
        element: <CreatePostPage />,
      },
      {
        path: "/posts/:postdetailId",
        element: <PostDetail />,
      },
      {
        path: "Explore",
       element: <Explore />,
      },
      {
        path:"page",
        element:<Pagination/>
      }
        
    ],
  },
  {
    path: "*",
    element:
     <NotFound/>  },


]);

