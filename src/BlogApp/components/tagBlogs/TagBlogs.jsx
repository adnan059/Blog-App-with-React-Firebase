import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "./../../firebase";
import "./TagBlogs.css";

const TagBlogs = () => {
  const { tag } = useParams();
  const [tagBlogs, setTagBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTagBlogs = async () => {
      try {
        setLoading(true);

        const q = query(
          collection(db, "blogs"),
          where("tags", "array-contains", tag),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);

        const blg = [];
        querySnapshot.forEach((doc) => {
          blg.push({ ...doc.data(), id: doc.id });
        });
        setTagBlogs(blg);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    getTagBlogs();
  }, []);

  if (loading) {
    return <h1 className="loading">LOADING....</h1>;
  }

  return (
    <>
      <section className="tagBlogs">
        <div className="container">
          {tagBlogs.map((blog, i) => (
            <div key={i} className="tbBox">
              <img src={blog?.imageUrl} alt="" />

              <div className="tbContent">
                <p className="category">{blog?.category}</p>
                <h2 className="title">{blog?.title}</h2>
                <p className="author_date">
                  <span>{blog?.author}</span>-
                  <span>{blog?.createdAt?.toDate().toDateString()}</span>
                </p>
                <p className="desc">
                  {blog?.description?.length > 40
                    ? blog?.description?.slice(0, 40) + "..."
                    : blog?.description}
                </p>
                <Link to={`/detail/${blog?.id}`} className="readMore">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default TagBlogs;
