import React, { useState } from "react";
import Tags from "../../components/tags/Tags";
import Trending from "../../components/trending/Trending";
import BlogsSection from "./../../components/blogsSection/BlogsSection";
import "./Home.css";

const Home = () => {
  const [tagList, setTagList] = useState([]);
  return (
    <>
      <section className="home">
        <div className="container">
          <Trending />
          <div className="blogs_tags">
            <BlogsSection setTagList={setTagList} />
            <Tags tagList={tagList} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
