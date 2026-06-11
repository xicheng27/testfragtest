'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import LandingPage from '@/components/LandingPage';
import MainPage from '@/components/MainPage';
import Quiz from '@/components/Quiz';
import ResultsPage from '@/components/ResultsPage';
import ShelfPage from '@/components/ShelfPage';
import PersonalityQuiz from '@/components/PersonalityQuiz';
import PersonalityResultPage from '@/components/PersonalityResultPage';
import { QuizAnswers, getRecommendations, ScoredFragrance } from '@/lib/scoring';
import { additionalQuizQuestions, quizQuestions } from '@/lib/quiz';
import { useQuizProgress } from '@/lib/quiz-progress-context';
import { PersonalityQuizResult } from '@/lib/personality-quiz';

type AppView = 'landing' | 'main' | 'quiz' | 'quiz-extended' | 'results' | 'shelf' | 'personality-quiz' | 'personality-result';
type ShelfReturnView = 'main' | 'results' | 'personality-result';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function Home() {
  const { hasEnteredApp, isReady, profileId } = useAuth();
  const {
    answers: storedAnswers,
    isExtended: storedIsExtended,
    hasPreviousResults,
    saveProgress,
    clearProgress,
  } = useQuizProgress();
  const [view, setView] = useState<AppView>('landing');
  const [results, setResults] = useState<ScoredFragrance[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [isExtended, setIsExtended] = useState(false);
  const [personalityResult, setPersonalityResult] = useState<PersonalityQuizResult | null>(null);
  const [personalityRun, setPersonalityRun] = useState(0);
  const [shelfReturnView, setShelfReturnView] = useState<ShelfReturnView>('main');
  const previousProfileId = useRef<string | null>(null);

  useEffect(() => {
    if (!isReady || previousProfileId.current === profileId) return;

    previousProfileId.current = profileId;
    setView(profileId ? 'main' : 'landing');
    setResults([]);
    setQuizAnswers({});
    setIsExtended(false);
    setPersonalityResult(null);
    setShelfReturnView('main');
  }, [isReady, profileId]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  if (!isReady) {
    return <div className="min-h-screen bg-stone-50" aria-label="Loading ScentMatch" />;
  }

  const currentView: AppView = !hasEnteredApp ? 'landing' : view === 'landing' ? 'main' : view;

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    saveProgress(answers, isExtended);
    const recs = getRecommendations(answers, 5);
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

  const handleStartPersonalityQuiz = () => {
    setPersonalityResult(null);
    setPersonalityRun(current => current + 1);
    setView('personality-quiz');
  };

  const handleViewShelf = (returnView: ShelfReturnView) => {
    setShelfReturnView(returnView);
    setView('shelf');
  };

  const handleViewPreviousResults = () => {
    setQuizAnswers(storedAnswers);
    setIsExtended(storedIsExtended);
    setResults(getRecommendations(storedAnswers, 5));
    setView('results');
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
          <MainPage
            onStartQuiz={handleStartQuiz}
            onViewShelf={() => handleViewShelf('main')}
            onViewPreviousResults={handleViewPreviousResults}
            onStartPersonalityQuiz={handleStartPersonalityQuiz}
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
            onRestart={handleRestart}
            onExtendedQuiz={handleExtendedQuiz}
            onViewShelf={() => handleViewShelf('results')}
            isExtended={isExtended}
          />
        </motion.div>
      )}
      {currentView === 'personality-quiz' && (
        <motion.div key={`personality-quiz-${personalityRun}`} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
          <PersonalityQuiz
            onBack={() => setView('main')}
            onComplete={result => {
              setPersonalityResult(result);
              setView('personality-result');
            }}
          />
        </motion.div>
      )}
      {currentView === 'personality-result' && personalityResult && (
        <motion.div key="personality-result" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
          <PersonalityResultPage
            result={personalityResult}
            onReplay={handleStartPersonalityQuiz}
            onHome={() => setView('main')}
            onViewShelf={() => handleViewShelf('personality-result')}
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
