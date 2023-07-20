import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./../../firebase";
import "./BlogsSection.css";

const BlogsSection = ({ setTagList }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getBlogs = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const blg = [];
        const tags = [];
        querySnapshot.forEach((doc) => {
          tags.push(...doc.get("tags"));
          blg.push({ ...doc.data(), id: doc.id });
        });
        setBlogs(blg);
        const uniqueTags = [...new Set(tags)];
        setTagList(uniqueTags);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  const gotoDetail = (id) => {
    navigate(`/detail/${id}`);
  };

  if (loading) {
    return <h1 className="loading">LOADING ....</h1>;
  }

  return (
    <>
      <section className="blogsSection">
        <h2>Daily Blogs</h2>
        <div className="blogsContainer">
          {blogs?.map((blog, i) => (
            <div className="blogBox" key={i}>
              <img src={blog?.imageUrl} alt="" className="blogImg" />

              <div className="blogContent">
                <div className="category">{blog?.category}</div>
                <div className="title">{blog?.title}</div>

                <p className="author_date">
                  <span>{blog?.author}</span> -{" "}
                  <span>{blog?.createdAt.toDate().toDateString()}</span>
                </p>

                <p className="desc">
                  {blog?.description.length > 40
                    ? blog?.description.slice(0, 40) + "..."
                    : blog?.description}
                </p>

                <button onClick={() => gotoDetail(blog?.id)}>Read More</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default BlogsSection;
