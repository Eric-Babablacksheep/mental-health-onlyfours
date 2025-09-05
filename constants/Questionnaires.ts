interface QuestionnaireItem {
  id: number;
  question: string;
  score: number;
}

export const depressionQuestions: QuestionnaireItem[] = [
  { id: 1, question: "Little interest or pleasure in doing things", score: 0 },
  { id: 2, question: "Feeling down, depressed, or hopeless", score: 0 },
  { id: 3, question: "Trouble falling asleep or staying asleep", score: 0 },
  { id: 4, question: "Feeling tired or having little energy", score: 0 },
  { id: 5, question: "Poor appetite or overeating", score: 0 },
  { id: 6, question: "Feeling bad about yourself", score: 0 },
  { id: 7, question: "Trouble concentrating on things", score: 0 },
  { id: 8, question: "Moving or speaking slowly or restlessly", score: 0 },
  { id: 9, question: "Thoughts of being better off dead", score: 0 }
];

export const anxietyQuestions: QuestionnaireItem[] = [
  { id: 1, question: "Feeling nervous, anxious, or on edge", score: 0 },
  { id: 2, question: "Not being able to stop or control worrying", score: 0 },
  { id: 3, question: "Worrying too much about different things", score: 0 },
  { id: 4, question: "Trouble relaxing", score: 0 },
  { id: 5, question: "Being so restless that it's hard to sit still", score: 0 },
  { id: 6, question: "Becoming easily annoyed or irritable", score: 0 },
  { id: 7, question: "Feeling afraid as if something awful might happen", score: 0 }
];

export const calculateLevel = (score: number, maxScore: number): string => {
  const percentage = (score / maxScore) * 100;
  if (percentage < 25) return 'minimal';
  if (percentage < 50) return 'mild';
  if (percentage < 75) return 'moderate';
  return 'severe';
};

export const motivationalQuotes = [
  "Every day is a new beginning. Take a deep breath and start again.",
  "You are stronger than you think and more capable than you imagine.",
  "It's okay not to be okay. What matters is that you're trying.",
  "Progress, not perfection. Every small step counts.",
  "Your mental health is just as important as your physical health.",
  "You've survived difficult days before. You can do it again.",
  "Self-care isn't selfish. It's necessary.",
  "You are worthy of love, care, and happiness."
];