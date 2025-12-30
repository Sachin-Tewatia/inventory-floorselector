
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// const Earth_Video = () => {
//     const navigate = useNavigate();
//     const videoRef = useRef(null);

//     useEffect(() => {
//         const video = videoRef.current;
        
//         // Handle video ended event
//         const handleVideoEnd = () => {
//             navigate("/twentykm");
//         };

//         // Ensure video plays and has event listener
//         const handleCanPlay = () => {
//             video.play().catch(error => {
//                 console.log("Auto-play prevented:", error);
//                 // Fallback: Show play button or implement user interaction
//             });
//         };

//         video.addEventListener('ended', handleVideoEnd);
//         video.addEventListener('canplay', handleCanPlay);

//         return () => {
//             video.removeEventListener('ended', handleVideoEnd);
//             video.removeEventListener('canplay', handleCanPlay);
//         };
//     }, [navigate]);

//     return (
//         <AnimatePresence>
//             <motion.div
//                 key="earth-video"
//                 initial={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 1, delay: 1 }}
//                 style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}
//             >
//                 <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
//                     <video
//                         ref={videoRef}
//                         muted
//                         autoPlay
//                         className="w-full h-full"
//                         style={{
//                             width: '100%',
//                             height: '100%',
//                             objectFit: 'cover',
//                         }}
//                     >
//                         <source src="https://d1zhaax9dcu4d9.cloudfront.net/salarpuria/video/salarpuria_map.mp4" type="video/mp4" />
//                         Your browser does not support the video tag.
//                     </video>
//                 </div>
//             </motion.div>
//         </AnimatePresence>
//     );
// };
const Earth_Video = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const handleVideoEnd = () => {
      console.log('Video ended, navigating to /twentykm');
      navigate('/twentykm');
    };

    const handleCanPlay = () => {
      console.log('Video can play, attempting auto-play');
      video
        .play()
        .then(() => {
          console.log('Video auto-play started successfully');
        })
        .catch((error) => {
          console.error('Auto-play failed:', error);
          // No UI fallback; log error and attempt navigation after delay
          setTimeout(() => {
            console.log('Auto-play failed, navigating to /twentykm as fallback');
            navigate('/twentykm');
          }, 2000);
        });
    };

    const handleError = (e) => {
      console.error('Video playback error:', e.target.error);
      // Navigate to /twentykm on error to avoid stuck screen
      setTimeout(() => {
        console.log('Video error, navigating to /twentykm');
        navigate('/twentykm');
      }, 2000);
    };

    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Attempt to load video immediately
    video.load();

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [navigate]);

  return (
    <AnimatePresence>
      <motion.div
        key="earth-video"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, delay: 1 }}
        style={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}
      >
        <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
          <video
            ref={videoRef}
            muted
            playsInline
            autoPlay
            preload="auto"
            className="w-full h-full"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          >
            <source
              src="https://d1zhaax9dcu4d9.cloudfront.net/salarpuria/video/salarpuria_map.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default Earth_Video;