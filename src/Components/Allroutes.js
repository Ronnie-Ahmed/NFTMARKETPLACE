import React from "react";
import { Routes, Route } from "react-router-dom";
import { Buy } from "../Pages/Buy";
import { Sell } from "../Pages/Sell";
import { Home } from "../Pages/Home";
import { TokenDetails } from "../Pages/TokenDetails";
import { PageNotFound } from "../Pages/PageNotFound";
import { Userprofile } from "../Pages/Userprofile";

export const Allroutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/buy/:id" element={<TokenDetails />} />
        <Route path="/userprofile" element={<Userprofile />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};
