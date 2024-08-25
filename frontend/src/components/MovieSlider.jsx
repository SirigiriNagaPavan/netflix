import React, { useEffect, useRef, useState } from 'react';
import { useContentStore } from '../store/content';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { SMALL_IMG_BASE_URL } from '../utils/constants';

const MovieSlider = ({ category }) => {
  const { contentType } = useContentStore();
  const [content, setContent] = useState([]);
  const [showArrows, setShowArrows] = useState(false);

  const sliderRef = useRef(null);

  const formattedCategoryName =
    category.replaceAll('_', ' ')[0].toUpperCase() +
    category.replaceAll('_', ' ').slice(1);
  const formattedContentType = contentType === 'movie' ? 'Movies' : 'TV Shows';

  useEffect(() => {
    const getContent = async () => {
      const res = await axios.get(`/api/v1/${contentType}/${category}`);
      setContent(res.data.content);
      console.log(res.data.content);
    };
    getContent();
  }, [contentType, category]);

  return (
    <div
      className="bg-[#141414] text-white  px-5 md:px-20"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <h2 className="mb-2 text-2xl font-semibold">
        {formattedCategoryName} {formattedContentType}
      </h2>
      <div
        className="flex space-x-8 py-4 overflow-x-scroll scrollbar-hide hover:scale-110 transition-all ease duration-400"
        ref={sliderRef}
      >
        {content.map((item) => (
          <Link
            to={`/watch/${item.id}`}
            className="min-w-[300px] relative hover:scale-125 transition-all ease-in-out duration-300 hvoer:z-10 top-0 left-0"
            key={item.id}
          >
            <div className="rounded overflow-hidden">
              <img
                src={SMALL_IMG_BASE_URL + item.backdrop_path}
                alt="Movie image"
                className="transition-transform duration-300 ease-in-out group-hover:scale-125"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieSlider;
