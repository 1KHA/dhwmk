"use client";
import { useState } from "react";

const MasarMobileSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ["/masar1.png", "/masar2.png", "/masar3.png"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="masar-section-mobile">
      {/* Section Title */}
      <div className="masar-title-container">
        <img 
          src="/masartitle.png" 
          alt="مسار العنوان" 
          className="masar-title"
        />
      </div>
      
      {/* Carousel */}
      <div className="masar-carousel">
        <button 
          onClick={prevImage}
          className="carousel-btn carousel-btn-prev"
          aria-label="الصورة السابقة"
        >
          ‹
        </button>
        
        <div className="carousel-image-container">
          <img 
            src={images[currentImageIndex]} 
            alt={`مسار ${currentImageIndex + 1}`}
            className="carousel-image"
          />
        </div>
        
        <button 
          onClick={nextImage}
          className="carousel-btn carousel-btn-next"
          aria-label="الصورة التالية"
        >
          ›
        </button>
      </div>
      
      {/* Dots indicator */}
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`dot ${index === currentImageIndex ? 'active' : ''}`}
            aria-label={`انتقل إلى الصورة ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .masar-section-mobile {
          display: none;
        }
        
        @media (max-width: 520px) {
          .masar-section-mobile {
            display: block;
            background-color: #620F10;
            width: 100%;
            padding: 24px 16px;
            text-align: center;
          }
          
          .masar-title-container {
            margin-bottom: 20px;
          }
          
          .masar-title {
            width: 60%;
            max-width: 280px;
            height: auto;
            margin: 0 auto;
            margin-right: 20px;
            display: block;
          }
          
          .masar-carousel {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 16px;
          }
          
          .carousel-image-container {
            flex: 1;
            max-width: 280px;
          }
          
          .carousel-image {
            width: 100%;
            height: auto;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          
          .carousel-btn {
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            color: #620F10;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }
          
          .carousel-btn:hover {
            background: white;
            transform: scale(1.1);
          }
          
          .carousel-btn:active {
            transform: scale(0.95);
          }
          
          .carousel-dots {
            display: flex;
            justify-content: center;
            gap: 8px;
          }
          
          .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: none;
            background: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .dot.active {
            background: white;
            transform: scale(1.2);
          }
          
          .dot:hover {
            background: rgba(255, 255, 255, 0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default MasarMobileSection;
