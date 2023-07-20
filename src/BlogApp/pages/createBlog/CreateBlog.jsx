import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import { db, storage } from "../../firebase";
import "./CreateBlog.css";

const CreateBlog = ({ user }) => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [blogData, setBlogData] = useState({
    title: "",
    trending: "no",
    category: "",
    description: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [file, setFile] = useState(null);

  const { title, trending, category, description } = blogData;

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
            .catch((error) => console.log(error));
        }
      );
    };

    file && uploadFile();
  }, [file]);

  const handleChange = (e) => {
    setBlogData({ ...blogData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log({ ...blogData, tags });
    const { title, category, description, trending } = blogData;

    if (!title || !category || !description || !trending) {
      return alert("Please, fill all the fields.");
    }

    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, "blogs"), {
        ...blogData,
        tags,
        createdAt: serverTimestamp(),
        author: user?.displayName,
        authorId: user?.uid,
      });

      setLoading(false);

      navigate("/");
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <section className="createBlog">
        <div className="container">
          <h2>Write What You Want to Share</h2>
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

            <input type="submit" value="Create" disabled={loading} />
          </form>
        </div>
      </section>
    </>
  );
};

export default CreateBlog;
