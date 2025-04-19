import React from 'react';
import { useLocation } from 'react-router-dom';

const GalleryPage = () => {
  const location = useLocation();
  const API = import.meta.env.VITE_API; 
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('Id');
  const iframeSrc = id 
  ? `/ThreeJS/index.html?Id=${id}&api=${API}` 
  : `/ThreeJS/index.html?api=${API}`; // ✅ If id is null, load without any query params

  return (
    <iframe
      src={iframeSrc}
      allow="fullscreen"
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Gallery"
    />
  );
};

export default GalleryPage;
