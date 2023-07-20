import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import { db, storage } from "../../firebase";
import "./UpdateBlog.css";

const UpdateBlog = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState(state.tags);
  const [blogData, setBlogData] = useState({
    title: state.title,
    trending: state.trending,
    category: state.category,
    description: state.description,
    imageUrl: state.imageUrl,
  });

  const [file, setFile] = useState(null);

  const { title, category, description } = blogData;

  // useEffect for file upload

  useEffect(() => {
    const uploadFile = () => {
      const blogImageRef = ref(storage, `blogImage/${file.name + Date.now()}`);

      const uploadTask = uploadBytesResumable(blogImageRef, file);

      uploadTask.on(
        "state_changed",
        () => {
          setLoading(true);
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              setBlogData({ ...blogData, imageUrl: url });
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
        }
      );
    };

    file && uploadFile();
  }, [file]);

  // all the functions
  const handleChange = (e) => {
    setBlogData({ ...blogData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const docRef = doc(db, "blogs", id);
      await updateDoc(docRef, {
        ...blogData,
        tags,
        updatedAt: serverTimestamp(),
      });
      setLoading(false);

      navigate(`/detail/${id}`);
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  // return part
  return (
    <>
      <section className="updateBlog">
        <div className="container">
          <h2>Update Your Blog</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={title}
              onChange={handleChange}
            />
            <TagsInput
              value={tags}
              onChange={setTags}
              name="tags"
              placeHolder="Tags"
            />

            <div className="trendingDiv">
              <span>Is it trending?</span>
              <input
                type="radio"
                name="trending"
                value="yes"
                onChange={handleChange}
                required
              />{" "}
              Yes
              <input
                type="radio"
                name="trending"
                value="no"
                onChange={handleChange}
                required
              />{" "}
              No
            </div>

            <select name="category" value={category} onChange={handleChange}>
              <option>Select a Category</option>
              <option value="sports">Sports</option>
              <option value="fashion">Fashion</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
            </select>

            <textarea
              name="description"
              style={{ resize: "none" }}
              cols="30"
              rows="10"
              placeholder="Description"
              value={description}
              onChange={handleChange}
            ></textarea>

            <input type="file" onChange={(e) => setFile(e.target.files[0])} />

            <input type="submit" value="Update" disabled={loading} />
          </form>
        </div>
      </section>
    </>
  );
};

export default UpdateBlog;
