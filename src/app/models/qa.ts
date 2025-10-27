export interface Question {
  id: string;
  courseName: string;
  question: string;
  askedBy: string;
  askedDate: Date;
  answers: Answer[];
  isResolved?: boolean;
}

export interface Answer {
  id: string;
  questionId: string;
  answer: string;
  answeredBy: string;
  answeredDate: Date;
  isInstructor: boolean;
  upvotes: number;
  isAccepted?: boolean;
}