import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/home/HomePage';
import { useAuthStore } from './store/authUser';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
function App() {
  const { user, isCheckingAuth, authCheck } = useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-black h-full">
          <Loader className="animate-spin text-red-600 size-10" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path = '/' element = {</>}/>*/}
        {/* <Route path = '/' element = {</>}/>*/}
        {/* <Route path = '/' element = {</>}/>*/}
        {/* <Route path = '/' element = {</>}/>*/}
      </Routes>
      {/* <Footer/> */}
      <Toaster />
    </>
  );
}

export default App;
