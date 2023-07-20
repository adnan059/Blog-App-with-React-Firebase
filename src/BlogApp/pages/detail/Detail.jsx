import { deleteDoc, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "./../../firebase";
import "./Detail.css";

const Detail = ({ user }) => {
  const [blog, setBlog] = useState({});
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getBlog = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        setBlog({ ...docSnap.data() });
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getBlog();
  }, []);

  const gotoUpdate = () => {
    navigate("/update/" + id, { state: { ...blog } });
  };

  const handleDelete = async (id) => {
    if (confirm("Do you want to delete this blog?")) {
      try {
        setLoading(true);
        const docRef = doc(db, "blogs", id);
        await deleteDoc(docRef);
        setLoading(false);
        navigate("/");
      } catch (error) {
        alert(error.message);
        setLoading(false);
      }
    } else {
      return;
    }
  };

  if (loading) {
    return <h1 className="loading">LOADING....</h1>;
  }

  return (
    <>
      <section className="detail">
        <div className="container">
          <div className="image">
            <img src={blog?.imageUrl} alt="" />
            <div className="dateTitle">
              <p>{blog?.createdAt?.toDate().toDateString()}</p>
              <h2>{blog?.title}</h2>
            </div>
          </div>

          {blog?.authorId === user?.uid ? (
            <div className="icons">
              <i className="fa-solid fa-pen-to-square" onClick={gotoUpdate}></i>
              <i
                onClick={() => handleDelete(id)}
                className="fa-solid fa-trash-can"
              ></i>
            </div>
          ) : null}

          <div className="detail-tags">
            <div className="detailPost">
              <p> {blog?.description}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Detail;
