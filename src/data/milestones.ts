// Mock data for milestones
// This file serves as a shared data source for both admin and participant dashboards

export type MilestoneStatus = 'upcoming' | 'active' | 'completed' | 'overdue';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string
  status: MilestoneStatus;
  requirements: string[];
  submissionLink?: string; // Optional link for participants to submit
  submissionCount?: number; // Number of teams that have submitted (for admin view)
}

// Mock milestones data
export const milestones: Milestone[] = [
  {
    id: "1",
    title: "تقديم فكرة المشروع",
    description: "تقديم وصف مفصل لفكرة المشروع والمشكلة التي يحلها والفئة المستهدفة.",
    dueDate: "2025-08-15T23:59:59Z",
    status: "upcoming",
    requirements: [
      "ملف PDF لا يزيد عن 5 صفحات",
      "شرح المشكلة التي يحلها المشروع",
      "وصف الحل المقترح",
      "تحليل السوق المستهدف"
    ],
    submissionCount: 0
  },
  {
    id: "2",
    title: "نموذج أولي للمنتج",
    description: "تطوير نموذج أولي يوضح الوظائف الأساسية للمنتج أو الخدمة.",
    dueDate: "2025-09-01T23:59:59Z",
    status: "upcoming",
    requirements: [
      "رابط للنموذج الأولي",
      "فيديو توضيحي لا يزيد عن 3 دقائق",
      "قائمة بالميزات المنفذة والميزات المخطط لها"
    ],
    submissionCount: 0
  },
  {
    id: "3",
    title: "خطة العمل",
    description: "تقديم خطة عمل تفصيلية تشمل استراتيجية السوق والنموذج المالي.",
    dueDate: "2025-09-15T23:59:59Z",
    status: "upcoming",
    requirements: [
      "نموذج مالي لمدة 3 سنوات",
      "استراتيجية التسويق والمبيعات",
      "خطة التوسع",
      "تحليل المنافسين"
    ],
    submissionCount: 0
  },
  {
    id: "4",
    title: "العرض النهائي",
    description: "تقديم عرض نهائي أمام لجنة التحكيم يشمل جميع جوانب المشروع.",
    dueDate: "2025-10-01T23:59:59Z",
    status: "upcoming",
    requirements: [
      "عرض تقديمي لا يزيد عن 10 دقائق",
      "عرض المنتج النهائي",
      "خطة النمو المستقبلية",
      "الإجابة على أسئلة لجنة التحكيم"
    ],
    submissionCount: 0
  }
];

// Helper function to get milestones by status
export function getMilestonesByStatus(status: MilestoneStatus): Milestone[] {
  return milestones.filter(milestone => milestone.status === status);
}

// Helper function to get a single milestone by ID
export function getMilestoneById(id: string): Milestone | undefined {
  return milestones.find(milestone => milestone.id === id);
}

// Function to add a new milestone
export function addMilestone(milestone: Omit<Milestone, 'id'>): Milestone {
  // Generate a new ID (in a real app, this would be handled by the database)
  const newId = (milestones.length + 1).toString();
  
  // Create the new milestone with the generated ID
  const newMilestone: Milestone = {
    id: newId,
    ...milestone,
    submissionCount: 0 // Initialize submission count to 0
  };
  
  // Add to the milestones array
  milestones.push(newMilestone);
  
  // In a real application, this would save to a database
  // For now, we're just updating the in-memory array
  
  // Return the newly created milestone
  return newMilestone;
}

// Function to update a milestone
export function updateMilestone(id: string, updates: Partial<Milestone>): Milestone | undefined {
  const index = milestones.findIndex(milestone => milestone.id === id);
  
  if (index === -1) {
    return undefined; // Milestone not found
  }
  
  // Update the milestone
  milestones[index] = {
    ...milestones[index],
    ...updates
  };
  
  // Return the updated milestone
  return milestones[index];
}

// In a real application, these functions would interact with an API or database
// For now, they work with the mock data above
