export interface UserProgress {
  [courseId: string]: {
    completedLessons: string[];
    currentLesson: string;
    quizScores: { [lessonId: string]: number };
  };
}
