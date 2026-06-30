'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import LandingPage from '@/components/LandingPage';
import MainPage from '@/components/MainPage';
import Quiz from '@/components/Quiz';
import ResultsPage from '@/components/ResultsPage';
import ShelfPage from '@/components/ShelfPage';
import { QuizAnswers, getRecommendations, ScoredFragrance } from '@/lib/scoring';
import { additionalQuizQuestions, quizQuestions } from '@/lib/quiz';
import { useQuizProgress } from '@/lib/quiz-progress-context';

type AppView = 'landing' | 'main' | 'quiz' | 'quiz-extended' | 'results' | 'shelf';
type ShelfReturnView = 'main' | 'results';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

interface AppShellProps {
  // When true, skip the landing page and jump straight into the recommendation
  // quiz (entering guest mode automatically if no session exists yet). Used by
  // the standalone /quiz route so it's directly linkable/bookmarkable.
  autoStartQuiz?: boolean;
}

export default function AppShell({ autoStartQuiz = false }: AppShellProps) {
  const { hasEnteredApp, isReady, profileId, continueAsGuest } = useAuth();
  const {
    answers: storedAnswers,
    isExtended: storedIsExtended,
    hasPreviousResults,
    saveProgress,
    clearProgress,
  } = useQuizProgress();
  const [view, setView] = useState<AppView>(() => (autoStartQuiz ? 'quiz' : 'landing'));
  const [results, setResults] = useState<ScoredFragrance[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [isExtended, setIsExtended] = useState(false);
  const [shelfReturnView, setShelfReturnView] = useState<ShelfReturnView>('main');
  const previousProfileId = useRef<string | null>(null);
  const startQuizAfterGuestEntry = useRef(false);
  const autoStartHandled = useRef(false);

  useEffect(() => {
    if (!isReady || previousProfileId.current === profileId) return;

    previousProfileId.current = profileId;
    const shouldStartQuiz = profileId === 'guest' && startQuizAfterGuestEntry.current;
    startQuizAfterGuestEntry.current = false;
    setView(profileId ? (shouldStartQuiz ? 'quiz' : 'main') : 'landing');
    setResults([]);
    setQuizAnswers({});
    setIsExtended(false);
    setShelfReturnView('main');
  }, [isReady, profileId]);

  useEffect(() => {
    if (!autoStartQuiz || !isReady || autoStartHandled.current) return;
    if (hasEnteredApp) return;

    autoStartHandled.current = true;
    startQuizAfterGuestEntry.current = true;
    continueAsGuest();
  }, [autoStartQuiz, isReady, hasEnteredApp, continueAsGuest]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  if (!isReady || (autoStartQuiz && !hasEnteredApp)) {
    return <div className="marble-bg min-h-screen" aria-label="Loading ScentMatch" />;
  }

  const currentView: AppView = !hasEnteredApp ? 'landing' : view === 'landing' ? 'main' : view;

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    saveProgress(answers, isExtended);
    const recs = getRecommendations(answers, 7);
    setResults(recs);
    setView('results');
  };

  const handleRestart = () => {
    setResults([]);
    setQuizAnswers({});
    setIsExtended(false);
    clearProgress();
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

  const handleLandingStartQuiz = () => {
    setQuizAnswers({});
    setIsExtended(false);
    setView('quiz');
    startQuizAfterGuestEntry.current = true;
    continueAsGuest();
  };

  const handleViewShelf = (returnView: ShelfReturnView) => {
    setShelfReturnView(returnView);
    setView('shelf');
  };

  const handleViewPreviousResults = () => {
    setQuizAnswers(storedAnswers);
    setIsExtended(storedIsExtended);
    setResults(getRecommendations(storedAnswers, 7));
    setView('results');
  };

  return (
    <AnimatePresence mode="wait">
      {currentView === 'landing' && (
        <motion.div key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
          <LandingPage onStartQuiz={handleLandingStartQuiz} />
        </motion.div>
      )}
      {currentView === 'main' && (
        <motion.div key="main" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
          <MainPage
            onStartQuiz={handleStartQuiz}
            onViewShelf={() => handleViewShelf('main')}
            onViewPreviousResults={handleViewPreviousResults}
            hasPreviousResults={hasPreviousResults}
          />
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
            answers={quizAnswers}
            onRestart={handleRestart}
            onExtendedQuiz={handleExtendedQuiz}
            onViewShelf={() => handleViewShelf('results')}
            isExtended={isExtended}
          />
        </motion.div>
      )}
      {currentView === 'shelf' && (
        <motion.div key="shelf" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
          <ShelfPage
            onBack={() => setView(shelfReturnView)}
            onStartQuiz={handleStartQuiz}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
