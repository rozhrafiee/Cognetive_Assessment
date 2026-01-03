
import React, { useState, useEffect } from 'react';
import { User, UserRole, Content, Exam, Attempt } from './types';
import { INITIAL_USER, MOCK_CONTENTS, MOCK_EXAMS, PLACEMENT_EXAM, MOCK_TEACHER, MOCK_ADMIN } from './constants';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PlacementTestPage from './pages/PlacementTest';
import CitizenDashboard from './pages/CitizenDashboard';
import ContentLibrary from './pages/ContentLibrary';
import TeacherPanel from './pages/TeacherPanel';
import AdminPanel from './pages/AdminPanel';
import ExamPage from './pages/ExamPage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [contents, setContents] = useState<Content[]>(MOCK_CONTENTS);
  const [exams, setExams] = useState<Exam[]>([PLACEMENT_EXAM, ...MOCK_EXAMS]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('cogni_user');
    const savedAttempts = localStorage.getItem('cogni_attempts');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedAttempts) setAttempts(JSON.parse(savedAttempts));
  }, []);

  useEffect(() => {
    localStorage.setItem('cogni_user', JSON.stringify(currentUser));
    localStorage.setItem('cogni_attempts', JSON.stringify(attempts));
  }, [currentUser, attempts]);

  const calculateNewLevel = (currentLevel: number, allAttempts: Attempt[]) => {
    const gradedAttempts = allAttempts.filter(a => a.userId === currentUser.id && a.isGraded && a.examId !== 'placement');
    
    // Logic: If user has at least 2 exams in current level with avg > 80, level up
    const currentLevelAttempts = gradedAttempts.filter(a => {
      const exam = exams.find(e => e.id === a.examId);
      const content = contents.find(c => c.id === exam?.contentId);
      return content && content.minLevel === currentLevel;
    });

    if (currentLevelAttempts.length >= 2) {
      const avg = currentLevelAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / currentLevelAttempts.length;
      if (avg > 80) return currentLevel + 1;
    }
    return currentLevel;
  };

  const handleCompleteExam = (examId: string, answers: any, finalScore?: number) => {
    const newAttempt: Attempt = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      examId,
      answers,
      score: finalScore,
      isGraded: finalScore !== undefined,
      date: new Date().toISOString()
    };

    const updatedAttempts = [...attempts, newAttempt];
    setAttempts(updatedAttempts);
    
    if (examId === 'placement' && finalScore !== undefined) {
      let initialLevel = 1;
      if (finalScore > 85) initialLevel = 3;
      else if (finalScore > 50) initialLevel = 2;
      
      setCurrentUser(prev => ({ ...prev, level: initialLevel }));
      setActiveTab('dashboard');
    } else if (finalScore !== undefined) {
      // Check for level up after regular exam
      const nextLevel = calculateNewLevel(currentUser.level, updatedAttempts);
      if (nextLevel > currentUser.level) {
        alert(`تبریک! شما به سطح ${nextLevel} ارتقا یافتید!`);
        setCurrentUser(prev => ({ ...prev, level: nextLevel }));
      }
    }
    
    setSelectedExamId(null);
  };

  const handleRoleSwitch = (role: UserRole) => {
    if (role === UserRole.TEACHER) setCurrentUser(MOCK_TEACHER);
    else if (role === UserRole.ADMIN) setCurrentUser(MOCK_ADMIN);
    else setCurrentUser(INITIAL_USER);
    setActiveTab('dashboard');
  };

  const isBlocked = currentUser.role === UserRole.CITIZEN && currentUser.level === 0;

  const renderContent = () => {
    if (selectedExamId) {
      const exam = exams.find(e => e.id === selectedExamId);
      return <ExamPage exam={exam!} onComplete={handleCompleteExam} onCancel={() => setSelectedExamId(null)} />;
    }

    if (isBlocked && activeTab !== 'placement') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 p-10">
          <div className="p-6 bg-yellow-100 rounded-full text-yellow-600">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-8a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <h2 className="text-2xl font-bold">دسترسی محدود!</h2>
          <p className="text-gray-600 max-w-md">شما هنوز آزمون تعیین سطح را نداده‌اید. برای دسترسی به محتواهای آموزشی، لطفاً ابتدا در آزمون تعیین سطح شرکت کنید.</p>
          <button 
            onClick={() => setActiveTab('placement')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
          >
            شروع آزمون تعیین سطح
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <CitizenDashboard user={currentUser} attempts={attempts} />;
      case 'placement':
        return <PlacementTestPage exam={PLACEMENT_EXAM} onComplete={(ans) => handleCompleteExam('placement', ans, 75)} />;
      case 'library':
        return <ContentLibrary contents={contents} userLevel={currentUser.level} onStartExam={setSelectedExamId} exams={exams} />;
      case 'teacher':
        return <TeacherPanel user={currentUser} attempts={attempts} onUpdateAttempts={(newAttempts) => {
          setAttempts(newAttempts);
          // Recalculate level if a teacher just graded an exam
          const nextLevel = calculateNewLevel(currentUser.level, newAttempts);
          if (nextLevel > currentUser.level) {
            setCurrentUser(prev => ({ ...prev, level: nextLevel }));
          }
        }} />;
      case 'admin':
        return <AdminPanel attempts={attempts} />;
      default:
        return <div>در حال ساخت...</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={currentUser.role} isBlocked={isBlocked} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={currentUser} onRoleSwitch={handleRoleSwitch} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
