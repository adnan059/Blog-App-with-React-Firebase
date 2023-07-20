import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./BA.css";
import Header from "./components/header/Header";
import TagBlogs from "./components/tagBlogs/TagBlogs";
import About from "./pages/about/About";
import CreateBlog from "./pages/createBlog/CreateBlog";
import Detail from "./pages/detail/Detail";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import UpdateBlog from "./pages/updateBlog/UpdateBlog";
import ViewBlog from "./pages/viewBlog/ViewBlog";

const BA = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  return (
    <>
      <BrowserRouter>
        <Header user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/trending/detail/:id" element={<Detail user={user} />} />

          <Route path="/detail/:id" element={<Detail user={user} />} />

          <Route
            path="/create"
            element={
              user?.uid ? (
                <CreateBlog user={user} />
              ) : (
                <Login setUser={setUser} />
              )
            }
          />
          <Route path="/view/:id" element={<ViewBlog />} />
          <Route
            path="/update/:id"
            element={
              user?.uid ? (
                <UpdateBlog user={user} />
              ) : (
                <Login setUser={setUser} />
              )
            }
          />

          <Route path="/tag/:tag" element={<TagBlogs />} />

          <Route path="/*" element={<h1>Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default BA;
