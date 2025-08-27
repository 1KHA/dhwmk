"use client";
import React from "react";

interface FAQSectionProps {
  title?: string;
  titleColor?: string;
  iconPath?: string;
}

export default function FAQSection({
  title = "الأسئلة الشائعة",
  titleColor = "#620F10",
  iconPath = "/Path 19188.png",
}: FAQSectionProps) {
  return (
    <div className="faq-container" dir="rtl">
      <div className="faq-header">
        <div className="title-with-icon">
          <h2 className="faq-title" style={{ color: titleColor }}>
            {title}
          </h2>
          <img
            src={iconPath}
            alt="FAQ Icon"
            className="faq-icon"
          />
        </div>
      </div>

      <style jsx>{`
        .faq-container {
          width: 100%;
          padding: 4rem 2rem;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 300px;
        }

        .faq-header {
          max-width: 1600px;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          margin-bottom: 2rem;
          padding-right: 2rem;
        }

        .title-with-icon {
          display: flex;
          align-items: center;
          gap: 1rem;
          opacity: 0;
          transform: translateY(30px) scale(0.9);
          animation: fadeInScale 0.8s ease-out 0.2s forwards;
        }

        .faq-icon {
          width: 48px;
          height: 48px;
          object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .faq-title {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          font-family: 'Arial', sans-serif;
        }

        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .faq-container {
            padding: 3rem 1rem;
            min-height: 200px;
          }

          .title-with-icon {
            padding: 1rem 1.5rem;
            gap: 0.75rem;
            border-radius: 12px;
          }

          .faq-icon {
            width: 36px;
            height: 36px;
          }

          .faq-title {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .faq-container {
            padding: 2rem 0.5rem;
          }

          .title-with-icon {
            padding: 0.75rem 1rem;
            gap: 0.5rem;
            border-radius: 10px;
          }

          .faq-icon {
            width: 32px;
            height: 32px;
          }

          .faq-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
