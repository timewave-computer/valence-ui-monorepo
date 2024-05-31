import { useRef, useState, useEffect } from "react";

/***
 * Takes a ref (specifically used with the graph) and measures the position and width for the overlay to render properly
 * watched for resize events to reposition the overlay
 */
export const useGraphOverlay = (
  graphRef: React.MutableRefObject<HTMLDivElement | null>,
) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // for repositioning based on container
  const [portalPosition, setPortalPosition] = useState({
    top: 0,
    left: 0,
    height: 0,
    width: 0,
  });
  // this is needed to trigger a re-render to populate refs
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const handleResize = () => {
      // take position of container, to place overlay appropriately
      if (graphRef.current && overlayRef.current) {
        const target = graphRef.current.getBoundingClientRect();
        const top = target.top;
        const left = target.left;
        const height = target.height;
        const width = target.width;

        setPortalPosition({ top, left, height, width });
      }
    };
    // Call handleResize directly to calculate initial position
    handleResize();

    // Subscribe to window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, [graphRef, isClient, setPortalPosition]);

  return {
    portalPosition,
    overlayRef,
  };
};
