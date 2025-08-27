"use client";
import React, { useState } from "react";

interface FAQQuestion {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  category: string;
  questions: FAQQuestion[];
}

interface FAQSectionProps {
  title?: string;
  titleColor?: string;
  iconPath?: string;
  faqData?: FAQCategory[];
}

const defaultFAQData: FAQCategory[] = [
  {
    id: "registration",
    category: "التسجيل والمشاركة",
    questions: [
      {
        id: "reg1",
        question: "كيف يمكنني التسجيل في الهاكاثون؟",
        answer: "يمكنك التسجيل من خلال ملء النموذج الإلكتروني المتاح على الموقع الرسمي. تأكد من إدخال جميع البيانات المطلوبة بدقة وإرفاق المستندات اللازمة."
      },
      {
        id: "reg2",
        question: "ما هي الشروط المطلوبة للمشاركة؟",
        answer: "يجب أن يكون المشارك طالباً جامعياً أو خريجاً حديثاً، ولديه خبرة أساسية في البرمجة أو التصميم أو إدارة الأعمال."
      },
      {
        id: "reg3",
        question: "هل يمكنني المشاركة بمفردي؟",
        answer: "نعم، يمكنك المشاركة بمفردك أو ضمن فريق يتكون من 2-5 أشخاص. سيتم تشكيل الفرق في بداية الفعالية للمشاركين الفرديين."
      }
    ]
  },
  {
    id: "competition",
    category: "المسابقة والجوائز",
    questions: [
      {
        id: "comp1",
        question: "ما هي قيمة الجوائز المقدمة؟",
        answer: "الجائزة الأولى 50,000 ريال، الثانية 30,000 ريال، والثالثة 20,000 ريال، بالإضافة إلى جوائز خاصة للابتكار والتصميم."
      },
      {
        id: "comp2",
        question: "ما هي معايير التقييم؟",
        answer: "يتم التقييم بناءً على الابتكار والإبداع، الجدوى التقنية، التصميم وتجربة المستخدم، والأثر المجتمعي للمشروع."
      },
      {
        id: "comp3",
        question: "متى سيتم الإعلان عن النتائج؟",
        answer: "سيتم الإعلان عن النتائج في اليوم الأخير من الهاكاثون خلال حفل الختام والتكريم."
      }
    ]
  },
  {
    id: "teams",
    category: "الفرق والتعاون",
    questions: [
      {
        id: "team1",
        question: "كيف يتم تشكيل الفرق؟",
        answer: "يمكنك تشكيل فريقك مسبقاً أو الانضمام لفريق موجود، أو يمكن للمنظمين مساعدتك في العثور على فريق مناسب."
      },
      {
        id: "team2",
        question: "ما هو العدد المثالي لأعضاء الفريق؟",
        answer: "العدد المثالي هو 3-4 أشخاص بتخصصات متنوعة: مطور، مصمم، ومختص في الأعمال أو التسويق."
      },
      {
        id: "team3",
        question: "هل يمكن تغيير أعضاء الفريق أثناء المسابقة؟",
        answer: "لا يُسمح بتغيير أعضاء الفريق بعد بداية المسابقة رسمياً، إلا في حالات استثنائية وبموافقة المنظمين."
      }
    ]
  },
  {
    id: "evaluation",
    category: "التقييم والنتائج",
    questions: [
      {
        id: "eval1",
        question: "من هم أعضاء لجنة التحكيم؟",
        answer: "تتكون لجنة التحكيم من خبراء في التكنولوجيا وريادة الأعمال من الشركات الرائدة والجامعات المرموقة."
      },
      {
        id: "eval2",
        question: "كيف تتم عملية التقييم؟",
        answer: "يتم التقييم على مراحل: تقييم أولي للأفكار، ثم تقييم النماذج الأولية، وأخيراً العروض التقديمية النهائية."
      },
      {
        id: "eval3",
        question: "هل يمكن الاعتراض على النتائج؟",
        answer: "يمكن تقديم استفسار حول النتائج خلال 24 ساعة من الإعلان، وسيتم مراجعته من قبل لجنة مستقلة."
      }
    ]
  },
  {
    id: "support",
    category: "الدعم التقني",
    questions: [
      {
        id: "sup1",
        question: "ما هي الأدوات والتقنيات المتاحة؟",
        answer: "سيتم توفير أجهزة كمبيوتر، إنترنت عالي السرعة، وإمكانية الوصول لمنصات التطوير السحابية والأدوات المجانية."
      },
      {
        id: "sup2",
        question: "هل يوجد دعم فني أثناء المسابقة؟",
        answer: "نعم، سيكون هناك فريق دعم فني متاح على مدار الساعة لمساعدة المشاركين في حل أي مشاكل تقنية."
      },
      {
        id: "sup3",
        question: "هل يمكن استخدام أدوات الذكاء الاصطناعي؟",
        answer: "نعم، يُسمح باستخدام أدوات الذكاء الاصطناعي المتاحة للعموم، مع ضرورة الإفصاح عن استخدامها في العرض النهائي."
      }
    ]
  }
];

export default function FAQSection({
  title = "الأسئلة الشائعة",
  titleColor = "#620F10",
  iconPath = "/Path 19188.png",
  faqData = defaultFAQData,
}: FAQSectionProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  return (
    <div className="faq-container" dir="rtl">
      {/* Main FAQ Title */}
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

      {/* FAQ Categories */}
      <div className="faq-content">
        {faqData.map((category, categoryIndex) => (
          <div key={category.id} className="faq-category">
            {/* Category Title */}
            <h3 className="category-title" style={{ color: titleColor }}>
              {category.category}
            </h3>

            {/* Questions List */}
            <div className="questions-list">
              {category.questions.map((question, questionIndex) => (
                <div key={question.id} className="question-item">
                  {/* Separator Line */}
                  <div className="separator-line"></div>
                  
                  {/* Question Row */}
                  <div 
                    className="question-row"
                    onClick={() => toggleQuestion(question.id)}
                  >
                    <div className="question-text">
                      {question.question}
                    </div>
                    <div className={`arrow-icon ${expandedQuestions.has(question.id) ? 'expanded' : ''}`}>
                      <img
                        src="/Path 19189.svg"
                        alt="Arrow"
                        className="arrow-svg"
                      />
                    </div>
                  </div>

                  {/* Answer (Expandable) */}
                  <div className={`answer-container ${expandedQuestions.has(question.id) ? 'expanded' : ''}`}>
                    <div className="answer-text">
                      {question.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
          margin-bottom: 3rem;
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

        .faq-content {
          max-width: 1600px;
          width: 100%;
        }

        .faq-category {
          margin-bottom: 3rem;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .faq-category:nth-child(1) { animation-delay: 0.3s; }
        .faq-category:nth-child(2) { animation-delay: 0.4s; }
        .faq-category:nth-child(3) { animation-delay: 0.5s; }
        .faq-category:nth-child(4) { animation-delay: 0.6s; }
        .faq-category:nth-child(5) { animation-delay: 0.7s; }

        .category-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0 0 2rem 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          font-family: 'Arial', sans-serif;
          text-align: right;
          padding-right: 2rem;
        }

        .questions-list {
          width: 100%;
        }

        .question-item {
          margin-bottom: 0.5rem;
        }

        .separator-line {
          width: 100%;
          height: 1px;
          background: #e0e0e0;
          margin-bottom: 1rem;
        }

        .question-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 8px;
        }

        .question-row:hover {
          background: rgba(98, 15, 16, 0.05);
        }

        .question-text {
          font-size: 1.1rem;
          font-weight: 500;
          color: #333;
          font-family: 'Arial', sans-serif;
          flex: 1;
          text-align: right;
          padding-right: 1rem;
        }

        .arrow-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .arrow-icon.expanded {
          transform: rotate(180deg);
        }

        .arrow-svg {
          width: 20px;
          height: 20px;
          object-fit: contain;
          transition: all 0.3s ease;
        }

        .answer-container {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, padding 0.4s ease;
          padding: 0 2rem;
        }

        .answer-container.expanded {
          max-height: 500px;
          padding: 1rem 2rem 2rem 2rem;
        }

        .answer-text {
          font-size: 1rem;
          line-height: 1.6;
          color: #555;
          font-family: 'Arial', sans-serif;
          text-align: right;
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
        }

        .answer-container.expanded .answer-text {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .faq-container {
            padding: 3rem 1rem;
          }

          .faq-header {
            padding-right: 1rem;
            margin-bottom: 2rem;
          }

          .faq-title {
            font-size: 1.5rem;
          }

          .faq-icon {
            width: 36px;
            height: 36px;
          }

          .category-title {
            font-size: 1.25rem;
            padding-right: 1rem;
            margin-bottom: 1.5rem;
          }

          .question-row {
            padding: 0.75rem 1rem;
          }

          .question-text {
            font-size: 1rem;
            padding-right: 0.5rem;
          }

          .answer-container {
            padding: 0 1rem;
          }

          .answer-container.expanded {
            padding: 0.75rem 1rem 1.5rem 1rem;
          }

          .answer-text {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .faq-container {
            padding: 2rem 0.5rem;
          }

          .faq-header {
            padding-right: 0.5rem;
          }

          .faq-title {
            font-size: 1.25rem;
          }

          .faq-icon {
            width: 32px;
            height: 32px;
          }

          .category-title {
            font-size: 1.1rem;
            padding-right: 0.5rem;
          }

          .question-row {
            padding: 0.5rem 0.75rem;
          }

          .question-text {
            font-size: 0.95rem;
          }

          .arrow-icon {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
