import React, { useState } from 'react';
import useGetTrendingContent from '../../hooks/useGetTrendingContent';
import { useContentStore } from '../../store/content';
import Navbar from '../../components/Navbar';
import { ORIGINAL_IMG_BASE_URL } from '../../utils/constants';
import { Link } from 'react-router-dom';
import { Info, Play } from 'lucide-react';
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
          onLoad={() => {
            setImgLoading(false);
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 -z-40"></div>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-20">
          <div className="bg-gradient-to-b from-black via-transparent to-transparent absolute w-full h-full top-0 left-0 -z-10" />
          <div className="max-w-3xl">
            <h1 className="mt-4 text-6xl font-extrabold text-balance">
              {trendingContent?.title}
            </h1>
            <p className="mt-2 text-lg">
              {trendingContent?.release_date?.split('-')[0] ||
                trendingContent?.first_air_date.split('-')[0]}{' '}
              | {trendingContent?.adult ? '18+' : 'PG-13'}
            </p>
            <p className="mt-4 text-lg">
              {trendingContent?.overview.length > 200
                ? trendingContent?.overview.slice(0, 200) + '...'
                : trendingContent?.overview}
            </p>
          </div>
          <div className="flex mt-8">
            <Link
              to={`/watch/${trendingContent?.id}`}
              className="bg-white hover:bg-white/80 text-black font-semibold py-2 px-8 text-2xl rounded-md mr-4 flex items-center"
            >
              <Play className="size-10 mr-2 fill-black" />

              <div>Play</div>
            </Link>
            <Link
              to={`/watch/${trendingContent?.id}`}
              className="bg-gray-500/70 hover:bg-white/80 text-white font-semibold py-2 px-8 text-2xl rounded-md mr-4 flex items-center"
            >
              <Info className="size-10 mr-2 fill-black" />

              <div>More Info</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default HomeScreen;
