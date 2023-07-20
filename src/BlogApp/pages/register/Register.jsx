import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, storage } from "../../firebase";
import "./Register.css";

const Register = ({ setUser }) => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    photoUrl: "",
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const uploadFile = () => {
      const userImageRef = ref(storage, `UserImage/${file.name + Date.now()}`);

      const uploadTask = uploadBytesResumable(userImageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setLoading(true);

          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(prog);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              setUserData({ ...userData, photoUrl: url });
              setLoading(false);
            })
            .catch((error) => console.log(error));
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, photoUrl } = userData;
    if (!username || !email || !password) {
      return alert("All the fields must be filled");
    }

    try {
      setLoading(true);

      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(user, {
        displayName: username,
        photoURL: photoUrl,
      });

      console.log(user);

      setUser(user);

      setLoading(false);
      navigate("/");
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };
  return (
    <>
      <section className="register">
        <div className="container">
          <h1>Create Your Account</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="User Name"
              name="username"
              value={userData.username}
              onChange={handleChange}
            />

            <input
              type="email"
              placeholder="Email"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password; Minimum 6 Characters"
              value={userData.password}
              onChange={handleChange}
            />

            <label htmlFor="file">
              <i className="fa fa-upload"></i> Upload Your Photo{" "}
            </label>

            <input
              id="file"
              type="file"
              name="photo"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {progress > 0 ? <p>{progress}% Uploaded!</p> : null}

            <input type="submit" value="Register" disabled={loading} />
          </form>

          <p>Already Have an Account?</p>
          <Link to="/login" className="login">
            Login
          </Link>
        </div>
      </section>
    </>
  );
};

export default Register;
