'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import LandingPage from '@/components/LandingPage';
import MainPage from '@/components/MainPage';
import Quiz from '@/components/Quiz';
import ResultsPage from '@/components/ResultsPage';
import SavedListPage from '@/components/SavedListPage';
import { QuizAnswers, getRecommendations, ScoredFragrance } from '@/lib/scoring';
import { additionalQuizQuestions, quizQuestions } from '@/lib/quiz';

type AppView = 'landing' | 'main' | 'quiz' | 'quiz-extended' | 'results' | 'saved';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function Home() {
  const { hasEnteredApp } = useAuth();
  const [view, setView] = useState<AppView>('landing');
  const [results, setResults] = useState<ScoredFragrance[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [isExtended, setIsExtended] = useState(false);
  const [savedReturnView, setSavedReturnView] = useState<'main' | 'results'>('main');

  // When auth state resolves (user signed in or continued as guest), advance past landing
  const currentView: AppView = !hasEnteredApp ? 'landing' : view === 'landing' ? 'main' : view;

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    const recs = getRecommendations(answers, 3);
    setResults(recs);
    setView('results');
  };

  const handleRestart = () => {
    setResults([]);
    setQuizAnswers({});
    setIsExtended(false);
    setView('main');
  };

  const handleExtendedQuiz = () => {
    setIsExtended(true);
    setView('quiz-extended');
  };

  const handleStartQuiz = () => {
    setQuizAnswers({});
    setIsExtended(false);
    setView('quiz');
  };

  const handleViewSaved = (returnView: 'main' | 'results') => {
    setSavedReturnView(returnView);
    setView('saved');
  };

  return (
    <AnimatePresence mode="wait">
      {currentView === 'landing' && (
        <motion.div key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
          <LandingPage />
        </motion.div>
      )}
      {currentView === 'main' && (
        <motion.div key="main" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
          <MainPage onStartQuiz={handleStartQuiz} onViewSaved={() => handleViewSaved('main')} />
        </motion.div>
      )}
      {currentView === 'quiz' && (
        <motion.div key="quiz" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
          <Quiz
            questions={quizQuestions}
            initialAnswers={quizAnswers}
            onComplete={handleQuizComplete}
            onBack={() => setView('main')}
          />
        </motion.div>
      )}
      {currentView === 'quiz-extended' && (
        <motion.div key="quiz-extended" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
          <Quiz
            questions={additionalQuizQuestions}
            initialAnswers={quizAnswers}
            onComplete={handleQuizComplete}
            onBack={() => setView('results')}
          />
        </motion.div>
      )}
      {currentView === 'results' && (
        <motion.div key="results" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
          <ResultsPage
            results={results}
            onRestart={handleRestart}
            onExtendedQuiz={handleExtendedQuiz}
            onViewSaved={() => handleViewSaved('results')}
            isExtended={isExtended}
          />
        </motion.div>
      )}
      {currentView === 'saved' && (
        <motion.div key="saved" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
          <SavedListPage
            onBack={() => setView(savedReturnView)}
            onStartQuiz={handleStartQuiz}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
