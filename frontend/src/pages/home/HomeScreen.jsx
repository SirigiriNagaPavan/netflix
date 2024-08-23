import React, { useState } from 'react';
import useGetTrendingContent from '../../hooks/useGetTrendingContent';
import { useContentStore } from '../../store/content';
import Navbar from '../../components/Navbar';
import { ORIGINAL_IMG_BASE_URL } from '../../utils/constants';
const HomeScreen = () => {
  const { trendingContent } = useGetTrendingContent();
  const { contentType } = useContentStore();
  const [imgLoading, setImgLoading] = useState(true);
  if (!trendingContent) {
    return (
      <div className="h-screen text-white relative">
        <Navbar />
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
      </div>
    );
  }
  return (
    <>
      <div className="h-screen text-white relative">
        <Navbar />
        {imgLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
        )}
        <img
          src={ORIGINAL_IMG_BASE_URL + trendingContent?.backdrop_path}
          alt="trending content"
          className="absolute top-0 left-0 w-full h-full object-cover -z-50"
        />
      </div>
    </>
  );
};
export default HomeScreen;
