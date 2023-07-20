import { signOut } from "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import "./Header.css";

const Header = ({ user, setUser }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser({});
      localStorage.clear();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <header>
        <div className="container">
          <nav>
            <div className="left">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/create">Create</Link>
            </div>

            <div className="right">
              {user?.uid ? (
                <span className="userInfo">
                  <img
                    src={`${
                      user?.photoURL
                        ? user.photoURL
                        : "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
                    }`}
                    alt=""
                  />
                  <span>{user?.displayName}</span>
                </span>
              ) : null}
              {user?.uid ? (
                <span
                  onClick={handleLogout}
                  className="fa-solid fa-right-from-bracket"
                  title="Logout"
                ></span>
              ) : (
                <span>
                  <Link to="/login" style={{ marginRight: "1rem" }}>
                    Login
                  </Link>
                  <Link to="/register">Register</Link>
                </span>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
