"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";

import img1 from "../assets/carousel/01.png";
import img2 from "../assets/carousel/02.png";
import img3 from "../assets/carousel/03.png";

const DEFAULT_IMAGES = [img1.src, img2.src, img3.src];

interface ImageCarouselProps {
  images?: string[];
  autoRotateInterval?: number;
}

export default function ImageCarousel({
  images = DEFAULT_IMAGES,
  autoRotateInterval = 5000,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [fadePhase, setFadePhase] = useState<"idle" | "fadeOut" | "fadeIn">("idle");
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleNext = useCallback(() => {
    if (isTransitioning || isDragging) return;
    setIsTransitioning(true);
    setFadePhase("fadeOut");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setFadePhase("fadeIn");
    }, 300);
    setTimeout(() => {
      setIsTransitioning(false);
      setFadePhase("idle");
    }, 700);
  }, [isTransitioning, isDragging, images.length]);

  const handlePrevious = useCallback(() => {
    if (isTransitioning || isDragging) return;
    setIsTransitioning(true);
    setFadePhase("fadeOut");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setFadePhase("fadeIn");
    }, 300);
    setTimeout(() => {
      setIsTransitioning(false);
      setFadePhase("idle");
    }, 700);
  }, [isTransitioning, isDragging, images.length]);

  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      handleNext();
    }, autoRotateInterval);
    return () => clearInterval(interval);
  }, [handleNext, autoRotateInterval, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setDragOffset(e.clientX - dragStart);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) handlePrevious();
      else handleNext();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setDragOffset(e.touches[0].clientX - dragStart);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) handlePrevious();
      else handleNext();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const leftIndex = (currentIndex - 1 + images.length) % images.length;
  const rightIndex = (currentIndex + 1) % images.length;

  return (
    <div className="dhl-carousel" data-fade={fadePhase}>
      <div
        className="dhl-car-track"
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: isDragging ? `translateX(${dragOffset * 0.3}px)` : "translateX(0px)",
          transition: isDragging ? "none" : "transform 0.3s ease-out",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <div className="dhl-car-image dhl-car-left">
          <img src={images[leftIndex]} alt="Previous image" draggable={false} />
        </div>
        <div className="dhl-car-image dhl-car-center">
          <img src={images[currentIndex]} alt="Current image" draggable={false} />
        </div>
        <div className="dhl-car-image dhl-car-right">
          <img src={images[rightIndex]} alt="Next image" draggable={false} />
        </div>
      </div>
    </div>
  );
}
