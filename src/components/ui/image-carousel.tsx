"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";

interface ImageCarouselProps {
  images?: string[];
  autoRotateInterval?: number;
}

export default function ImageCarousel({
  images = ["/01.png", "/02.png", "/03.png"],
  autoRotateInterval = 5000,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [fadePhase, setFadePhase] = useState<'idle' | 'fadeOut' | 'fadeIn'>('idle');
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleNext = useCallback(() => {
    if (isTransitioning || isDragging) return;
    setIsTransitioning(true);
    setFadePhase('fadeOut');
    
    // Phase 1: Fade out current images
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setFadePhase('fadeIn');
    }, 300);
    
    // Phase 2: Complete fade in and reset
    setTimeout(() => {
      setIsTransitioning(false);
      setFadePhase('idle');
    }, 700);
  }, [isTransitioning, isDragging, images.length]);

  const handlePrevious = useCallback(() => {
    if (isTransitioning || isDragging) return;
    setIsTransitioning(true);
    setFadePhase('fadeOut');
    
    // Phase 1: Fade out current images
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setFadePhase('fadeIn');
    }, 300);
    
    // Phase 2: Complete fade in and reset
    setTimeout(() => {
      setIsTransitioning(false);
      setFadePhase('idle');
    }, 700);
  }, [isTransitioning, isDragging, images.length]);

  // Auto-rotation effect (pause when dragging)
  useEffect(() => {
    if (isDragging) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [handleNext, autoRotateInterval, isDragging]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const offset = e.clientX - dragStart;
    setDragOffset(offset);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const threshold = 50; // minimum drag distance to trigger change
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  // Touch drag handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const offset = e.touches[0].clientX - dragStart;
    setDragOffset(offset);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  // Get the three visible images (left, center, right)
  const getVisibleImages = () => {
    const leftIndex = (currentIndex - 1 + images.length) % images.length;
    const centerIndex = currentIndex;
    const rightIndex = (currentIndex + 1) % images.length;

    return {
      left: images[leftIndex],
      center: images[centerIndex],
      right: images[rightIndex],
    };
  };

  const visibleImages = getVisibleImages();

  return (
    <div className="carousel-container">
      <div 
        className="carousel-track"
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: isDragging ? `translateX(${dragOffset * 0.3}px)` : 'translateX(0px)',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* Left Image */}
        <div className="carousel-image left-image">
          <img
            src={visibleImages.left}
            alt="Previous image"
            className="carousel-img"
            draggable={false}
          />
        </div>

        {/* Center Image (Main) */}
        <div className="carousel-image center-image">
          <img
            src={visibleImages.center}
            alt="Current image"
            className="carousel-img"
            draggable={false}
          />
        </div>

        {/* Right Image */}
        <div className="carousel-image right-image">
          <img
            src={visibleImages.right}
            alt="Next image"
            className="carousel-img"
            draggable={false}
          />
        </div>
      </div>

      <style jsx>{`
        .carousel-container {
          width: 100%;
          padding: 6rem 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
          min-height: 800px;
          position: relative;
          overflow: hidden;
          user-select: none;
        }

        .carousel-track {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          max-width: 100vw;
          width: 100%;
          position: relative;
          background: transparent !important;
        }

        .carousel-image {
          position: relative;
          transition: all 0.4s ease-in-out;
          flex-shrink: 0;
          background: transparent !important;
          border: none;
          box-shadow: none;
          border-radius: 0;
          overflow: visible;
        }

        .carousel-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          pointer-events: none;
          transition: opacity 0.4s ease-in-out;
          background: transparent !important;
          border: none;
          border-radius: 0;
        }

        /* Smooth fade animation phases */
        .carousel-image {
          opacity: ${fadePhase === 'fadeOut' ? '0' : fadePhase === 'fadeIn' ? '1' : '1'};
          transform: ${fadePhase === 'fadeOut' ? 'scale(0.95)' : fadePhase === 'fadeIn' ? 'scale(1)' : 'scale(1)'};
        }

        /* Override opacity for side images during normal state */
        .left-image,
        .right-image {
          opacity: ${fadePhase === 'fadeOut' ? '0' : fadePhase === 'fadeIn' ? '0.8' : '0.8'} !important;
        }

        /* Center image maintains full opacity when not transitioning */
        .center-image {
          opacity: ${fadePhase === 'fadeOut' ? '0' : fadePhase === 'fadeIn' ? '1' : '1'} !important;
        }

        /* Left Image Styles - 90% of main image size, half visible */
        .left-image {
          width: 720px;
          height: 540px;
          transform: scale(0.9) translateY(0px) translateX(25%);
          opacity: 0.8;
          z-index: 1;
        }

        /* Center Image Styles (Main) - Double size */
        .center-image {
          width: 800px;
          height: 600px;
          transform: scale(1) translateY(-40px);
          opacity: 1;
          z-index: 3;
        }

        /* Right Image Styles - 90% of main image size, half visible */
        .right-image {
          width: 720px;
          height: 540px;
          transform: scale(0.9) translateY(0px) translateX(-25%);
          opacity: 0.8;
          z-index: 1;
        }

        /* Hover Effects */
        .left-image:hover,
        .right-image:hover {
          opacity: 0.95;
          transform: scale(0.95) translateY(-10px) translateX(25%);
        }

        .right-image:hover {
          transform: scale(0.95) translateY(-10px) translateX(-25%);
        }

        .center-image:hover {
          transform: scale(1.05) translateY(-50px);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .carousel-container {
            padding: 4rem 0;
            min-height: 500px;
          }

          .carousel-track {
            gap: 3rem;
          }

          .left-image,
          .right-image {
            width: 432px;
            height: 324px;
            transform: scale(0.9) translateY(0px);
          }

          .left-image {
            transform: scale(0.9) translateY(0px) translateX(40%);
          }

          .right-image {
            transform: scale(0.9) translateY(0px) translateX(-40%);
          }

          .center-image {
            width: 480px;
            height: 360px;
            transform: scale(1) translateY(-30px);
          }

          .left-image:hover,
          .right-image:hover {
            transform: scale(0.95) translateY(-5px) translateX(40%);
          }

          .right-image:hover {
            transform: scale(0.95) translateY(-5px) translateX(-40%);
          }

          .center-image:hover {
            transform: scale(1.02) translateY(-35px);
          }
        }

        @media (max-width: 480px) {
          .carousel-container {
            padding: 3rem 0;
            min-height: 400px;
          }

          .carousel-track {
            gap: 2rem;
          }

          .left-image,
          .right-image {
            width: 324px;
            height: 243px;
          }

          .left-image {
            transform: scale(0.9) translateY(0px) translateX(30%);
          }

          .right-image {
            transform: scale(0.9) translateY(0px) translateX(-30%);
          }

          .center-image {
            width: 360px;
            height: 270px;
            transform: scale(1) translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
