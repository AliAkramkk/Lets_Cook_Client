import React from "react";
import { Route, Routes } from "react-router-dom";
import RequerAuth from "../features/RequerAuth";
import AdminHome from "../pages/Admin/Home/AdminHome";
import Userlist from "../pages/Admin/Userlist/Userlist";
import Cheflist from "../pages/Admin/Cheflist/Cheflist";
import Category from "../pages/Admin/CategoryManagment/Category";
import Transaction from "../pages/Admin/Transaction/Transaction";
const Role = 1000;
function Admin() {
  return (
    <Routes>
      <Route element={<RequerAuth allows={[Role]} />}>
        <Route exact path="/" element={<AdminHome />} />
        <Route path="/userlist" element={<Userlist />} />
        <Route path="/cheflist" element={<Cheflist />} />
        <Route path="/category" element={<Category />} />
        <Route path="/transaction" element={<Transaction />} />
      </Route>
    </Routes>
  );
}

export default Admin;
