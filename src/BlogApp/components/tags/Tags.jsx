import React from "react";
import { Link } from "react-router-dom";
import "./Tags.css";

const Tags = ({ tagList }) => {
  return (
    <>
      <section className="tags">
        <h2>Topics</h2>
        <div className="tagContainer">
          {tagList?.map((tag, i) => {
            return (
              <Link to={`/tag/${tag}`} key={i}>
                {tag}
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Tags;
