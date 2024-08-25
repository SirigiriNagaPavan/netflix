import { useContentStore } from '../store/content';
import Navbar from '../components/Navbar';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReactPlayer from 'react-player';
import { formatReleaseDate } from '../utils/dateFunction';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';

const WatchPage = () => {
  const { id } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [currentTrailerId, setCurrentTrailerId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [similarContent, setSimilarContent] = useState([]);
  const { contentType } = useContentStore();

  const sliderRef = useRef(null);
  useEffect(() => {
    const getTrailers = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`);
        setTrailers(res.data.trailers);
      } catch (error) {
        if (error.message.includes('404')) {
          setTrailers([]);
        }
      }
    };
    getTrailers();
  }, [contentType, id]);
  useEffect(() => {
    const getSimilarContent = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/similar`);
        setSimilarContent(res.data.content.results);
        console.log(res.data);
      } catch (error) {
        setSimilarContent([]);
      }
    };
    getSimilarContent();
  }, [contentType, id]);
  useEffect(() => {
    const getContentDetails = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/details`);
        setContent(res.data.content);
      } catch (error) {
        if (error.message.include('404')) {
          setContent(null);
        }
      } finally {
        setLoading(false);
      }
    };
    getContentDetails();
  }, [contentType, id]);
  const handleNext = () => {
    if (currentTrailerId < trailers.length - 1)
      setCurrentTrailerId(currentTrailerId + 1);
  };
  const handlePrev = () => {
    if (currentTrailerId > 0) setCurrentTrailerId(currentTrailerId - 1);
  };

  const scrollLeft = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: 'smooth',
      });
  };
  const scrollRight = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: 'smooth',
      });
  };

  if (loading) return <div className="min-h-screen bg-black p-10">Loading</div>;
  // if(!content)
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="mx-auto container px-4 gap-y-8 h-full">
        <Navbar />
        {trailers.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <button
              className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailerId === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={currentTrailerId === 0}
              onClick={handlePrev}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailerId === trailers?.length - 1
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              } `}
              disabled={currentTrailerId === trailers?.length - 1}
              onClick={handleNext}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
        <div className="aspect-video mb-8 p-1 h-[60vh] w-full sm:px-10 md:px-32">
          {trailers?.length > 0 && (
            <ReactPlayer
              controls={true}
              width={'100%'}
              height={'60vh'}
              className="mx-atuo overflow-hidden rounded-lg"
              url={`https://www.youtube.com/watch?v=${trailers[currentTrailerId].key}`}
            />
          )}
          {trailers?.length === 0 && (
            <h2 className="text-xl text-center mt-5">
              No trailers available for{' '}
              <span className="font-bold text-red-600">
                {content?.title || content?.name}
              </span>
            </h2>
          )}
        </div>
        {/* movie details */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto">
          <div className="mb-4 md:mb-0">
            <h2 className="text-5xl font-bold text-balance">
              {content?.title || content?.name}
            </h2>
            <p className="mt-2 text-lg">
              {formatReleaseDate(
                content?.release_date || content?.first_air_date
              )}{' '}
              |{' '}
              {content?.adult ? (
                <span className="text-red-600">18+</span>
              ) : (
                <span className="text-green-600">PG-13</span>
              )}
              <p className="mt-4 text-lg">{content?.overview}</p>
            </p>
          </div>
          <img
            src={ORIGINAL_IMG_BASE_URL + content?.poster_path}
            alt="poster image"
            className="max-h-[400px] rounded-md"
          />
        </div>
        {similarContent?.length > 0 && (
          <div className="mt-12">
            <h3>Similar Movies/Tv Shows</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
