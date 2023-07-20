import React, { useEffect, useState } from "react";
import "./Trending.css";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Pagination } from "swiper/modules";
import { db } from "../../firebase";

const Trending = () => {
  const [trendBlogs, setTrendBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        setLoading(true);

        const q = query(
          collection(db, "blogs"),
          where("trending", "==", "yes"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);

        const blg = [];

        querySnapshot.forEach((doc) => {
          blg.push({ ...doc.data(), id: doc.id });
        });

        setTrendBlogs(blg);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  if (loading) {
    return <h1 className="loading">LOADING .......</h1>;
  }

  return (
    <>
      <section className="trending">
        <h2>Trending Blogs</h2>

        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          modules={[Pagination]}
          className="trendingBlogsContainer"
          loop={true}
        >
          {trendBlogs.map((tb, i) => (
            <SwiperSlide key={i} className="tbBox">
              <img src={tb?.imageUrl} alt="" className="tbImage" />
              <Link to={`/trending/detail/${tb?.id}`}>
                <div className="tbInfo">
                  <p className="tbTitle">{tb?.title}</p>
                  <p className="tbAuthorDate">
                    <span>{tb?.author}</span> -{" "}
                    <span>{tb?.createdAt.toDate().toDateString()}</span>
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
};

export default Trending;
