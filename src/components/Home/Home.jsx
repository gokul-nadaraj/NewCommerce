import React from "react";
import Craft from "../craft/Craft";
import Bedproduct from "../Bedsheet/Bedproduct";
import Organic from "../Organicproduct/Organic";
import Gift from "../GiftProduct/Gift";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  return (
    <>
     
      <Craft />
      <Bedproduct />
      <Organic />
      <Gift />
    </>
  );
};

export default Home;
