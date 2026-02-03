
import './App.css';
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './Component/Routes';
import Snowfall from "react-snowfall";

function App(){
  return (
    <>
    <RouterProvider router={router}/>

      <Snowfall color=" #7db4f3" snowflakeCount={900}/>
    </>
  )
}

     


export default App;
