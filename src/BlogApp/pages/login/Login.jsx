import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./../../firebase";
import "./Login.css";

const Login = ({ setUser }) => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = userData;
    if (!email || !password) {
      return alert("All the fields must be filled");
    }

    try {
      setLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);

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
      <section className="login">
        <div className="container">
          <h1>Log in to Your Account</h1>

          <form onSubmit={handleSubmit}>
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
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
            />

            <input type="submit" value="Login" disabled={loading} />
          </form>

          <p>Don't Have an Account?</p>
          <Link to="/register" className="register">
            Register
          </Link>
        </div>
      </section>
    </>
  );
};

export default Login;
