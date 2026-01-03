
import React, { useState, useEffect } from 'react';
import { User, UserRole, Content, Exam, Attempt } from './types';
import { MOCK_CONTENTS, MOCK_EXAMS, PLACEMENT_EXAM, MOCK_TEACHER, MOCK_ADMIN } from './constants';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PlacementTestPage from './pages/PlacementTest';
import CitizenDashboard from './pages/CitizenDashboard';
import ContentLibrary from './pages/ContentLibrary';
import TeacherPanel from './pages/TeacherPanel';
import AdminPanel from './pages/AdminPanel';
import ExamPage from './pages/ExamPage';
import AuthPage from './pages/AuthPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [contents, setContents] = useState<Content[]>(MOCK_CONTENTS);
  const [exams, setExams] = useState<Exam[]>([PLACEMENT_EXAM, ...MOCK_EXAMS]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('cogni_session');
    const savedAttempts = localStorage.getItem('cogni_attempts');
    const savedContents = localStorage.getItem('cogni_contents');
    const savedExams = localStorage.getItem('cogni_exams');
    
    if (savedSession) {
      setCurrentUser(JSON.parse(savedSession));
      setIsLoggedIn(true);
    }
    if (savedAttempts) setAttempts(JSON.parse(savedAttempts));
    if (savedContents) setContents(JSON.parse(savedContents));
    if (savedExams) setExams(JSON.parse(savedExams));
    
    if (!localStorage.getItem('cogni_users_db')) {
      localStorage.setItem('cogni_users_db', JSON.stringify([MOCK_TEACHER, MOCK_ADMIN]));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cogni_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cogni_session');
    }
    localStorage.setItem('cogni_attempts', JSON.stringify(attempts));
    localStorage.setItem('cogni_contents', JSON.stringify(contents));
    localStorage.setItem('cogni_exams', JSON.stringify(exams));
  }, [currentUser, attempts, contents, exams]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('cogni_session');
  };

  // Logic from PDF: 70% to pass, 80%+ for Level Advancement (Max +1 level)
  const calculateNewLevel = (currentLevel: number, score: number) => {
    if (currentLevel >= 10) return 10;
    if (score >= 80) return currentLevel + 1;
    return currentLevel;
  };

  const handleCompleteExam = (examId: string, answers: any, finalScore?: number) => {
    if (!currentUser) return;
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
      // PDF: Placement test determines initial level (1-10)
      const initialLevel = Math.max(1, Math.min(10, Math.floor(finalScore / 10)));
      setCurrentUser(prev => prev ? ({ ...prev, level: initialLevel }) : null);
      setActiveTab('dashboard');
    } else if (finalScore !== undefined) {
      const nextLevel = calculateNewLevel(currentUser.level, finalScore);
      if (nextLevel > currentUser.level) {
        setCurrentUser(prev => prev ? ({ ...prev, level: nextLevel }) : null);
      }
    }
    
    setSelectedExamId(null);
  };

  if (!isLoggedIn || !currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const isBlocked = currentUser.role === UserRole.CITIZEN && currentUser.level === 0;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={currentUser.role} isBlocked={isBlocked} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={currentUser} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto h-full">
            {selectedExamId ? (
              <ExamPage 
                exam={exams.find(e => e.id === selectedExamId)!} 
                onComplete={handleCompleteExam} 
                onCancel={() => setSelectedExamId(null)} 
              />
            ) : (
              isBlocked && activeTab !== 'placement' ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="p-6 bg-yellow-100 rounded-full text-yellow-600">🎯</div>
                  <h2 className="text-2xl font-bold">تعیین سطح الزامی است</h2>
                  <button onClick={() => setActiveTab('placement')} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">شروع آزمون تعیین سطح</button>
                </div>
              ) : (
                <>
                  {activeTab === 'dashboard' && <CitizenDashboard user={currentUser} attempts={attempts} />}
                  {activeTab === 'placement' && <PlacementTestPage exam={PLACEMENT_EXAM} onComplete={(ans) => handleCompleteExam('placement', ans, 75)} />}
                  {activeTab === 'library' && <ContentLibrary contents={contents} userLevel={currentUser.level} onStartExam={setSelectedExamId} exams={exams} />}
                  {activeTab === 'teacher' && <TeacherPanel user={currentUser} attempts={attempts} onUpdateAttempts={setAttempts} contents={contents} onUpdateContents={setContents} exams={exams} onUpdateExams={setExams} />}
                  {activeTab === 'admin' && <AdminPanel attempts={attempts} />}
                </>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
