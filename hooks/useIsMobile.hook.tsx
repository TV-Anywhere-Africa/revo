import { useEffect, useState } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // List of common mobile user agents
      const mobileUserAgents = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
      ];

      // Check if the user agent matches any mobile pattern
      const isMobileDevice = mobileUserAgents.some((ua) =>
        ua.test(navigator.userAgent)
      );

      setIsMobile(isMobileDevice);
    };

    // Call the function once on component mount
    checkIsMobile();

    // Add an event listener to check on window resize
    window.addEventListener("resize", checkIsMobile);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
