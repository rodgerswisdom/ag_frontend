import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axios";
import Blogscard from "./Blogcard";

function Blogspreview() {
  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    axiosInstance.get('/blogs/')
      .then((res) => {
        const blogs = res.data;
        const onlyTwoBlogs = blogs.slice(0, 2);
        setBlogData(onlyTwoBlogs);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <div>
        <p className="text-2xl">Latest Stories</p>
      </div>
      <div className="flex flex-col gap-4 my-6">
        {blogData.map((item) => (
          <Blogscard
            key={item.id} // Make sure each card has a unique key
            title={item.title} // Pass the title as a prop
            content={item.content} // Pass the content as a prop
            image={item.image}
          />
        ))}
      </div>
      <Link to="/blogs" className="bg-[#23CE6B] p-2 text-white rounded-2xl">
        View Blogs
      </Link>
    </div>
  );
}

export default Blogspreview;
