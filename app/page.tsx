'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import LandingPage from '@/components/LandingPage';
import MainPage from '@/components/MainPage';
import Quiz from '@/components/Quiz';
import ResultsPage from '@/components/ResultsPage';
import { QuizAnswers, getRecommendations, ScoredFragrance } from '@/lib/scoring';

type AppView = 'landing' | 'main' | 'quiz' | 'quiz-extended' | 'results';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function Home() {
  const { hasEnteredApp } = useAuth();
  const [view, setView] = useState<AppView>('landing');
  const [results, setResults] = useState<ScoredFragrance[]>([]);
  const [isExtended, setIsExtended] = useState(false);

  // When auth state resolves (user signed in or continued as guest), advance past landing
  const currentView: AppView = !hasEnteredApp ? 'landing' : view === 'landing' ? 'main' : view;

  const handleQuizComplete = (answers: QuizAnswers) => {
    const recs = getRecommendations(answers, 3);
    setResults(recs);
    setView('results');
  };

  const handleRestart = () => {
    setResults([]);
    setIsExtended(false);
    setView('main');
  };

  const handleExtendedQuiz = () => {
    setIsExtended(true);
    setView('quiz-extended');
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
          <MainPage onStartQuiz={() => setView('quiz')} />
        </motion.div>
      )}
      {currentView === 'quiz' && (
        <motion.div key="quiz" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
          <Quiz extended={false} onComplete={handleQuizComplete} onBack={() => setView('main')} />
        </motion.div>
      )}
      {currentView === 'quiz-extended' && (
        <motion.div key="quiz-extended" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
          <Quiz extended={true} onComplete={handleQuizComplete} onBack={() => setView('results')} />
        </motion.div>
      )}
      {currentView === 'results' && (
        <motion.div key="results" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
          <ResultsPage
            results={results}
            onRestart={handleRestart}
            onExtendedQuiz={handleExtendedQuiz}
            isExtended={isExtended}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
