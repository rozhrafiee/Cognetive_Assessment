
import React, { useState, useEffect } from 'react';
import { User, UserRole, Content, Exam, Attempt, SystemAlert, QuestionType } from './types';
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
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [contents, setContents] = useState<Content[]>(MOCK_CONTENTS);
  const [exams, setExams] = useState<Exam[]>([PLACEMENT_EXAM, ...MOCK_EXAMS]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([
    { id: '1', title: 'هشدار امنیت شناختی', message: 'موج جدیدی از اخبار جعلی درباره بحران آب در فضای مجازی منتشر شده است. هوشیار باشید.', severity: 'high', date: new Date().toISOString() }
  ]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('cogni_session');
    const savedAttempts = localStorage.getItem('cogni_attempts');
    const savedContents = localStorage.getItem('cogni_contents');
    const savedExams = localStorage.getItem('cogni_exams');
    const savedAlerts = localStorage.getItem('cogni_alerts');
    
    if (savedSession) {
      setCurrentUser(JSON.parse(savedSession));
      setIsLoggedIn(true);
    }
    if (savedAttempts) setAttempts(JSON.parse(savedAttempts));
    if (savedContents) setContents(JSON.parse(savedContents));
    if (savedExams) setExams(JSON.parse(savedExams));
    if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
    
    if (!localStorage.getItem('cogni_users_db')) {
      localStorage.setItem('cogni_users_db', JSON.stringify([MOCK_TEACHER, MOCK_ADMIN]));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cogni_session', JSON.stringify(currentUser));
      // Update users db to reflect changes (e.g. name update)
      const usersDb = JSON.parse(localStorage.getItem('cogni_users_db') || '[]');
      const updatedDb = usersDb.map((u: User) => u.id === currentUser.id ? currentUser : u);
      localStorage.setItem('cogni_users_db', JSON.stringify(updatedDb));
    }
    localStorage.setItem('cogni_attempts', JSON.stringify(attempts));
    localStorage.setItem('cogni_contents', JSON.stringify(contents));
    localStorage.setItem('cogni_exams', JSON.stringify(exams));
    localStorage.setItem('cogni_alerts', JSON.stringify(alerts));
  }, [currentUser, attempts, contents, exams, alerts]);

  const handleLogin = (user: User) => {
    setCurrentUser({ ...user, xp: user.xp || 0 });
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('cogni_session');
  };

  const calculatePlacementScore = (answers: any) => {
    const exam = PLACEMENT_EXAM;
    let correct = 0;
    let mcqCount = 0;
    exam.questions.forEach(q => {
      if (q.type === QuestionType.MCQ) {
        mcqCount++;
        if (answers[q.id] === q.correctOption) correct++;
      }
    });
    // For simplicity, we give 60 points for the MCQ part and assume 20 for descriptive
    const score = mcqCount > 0 ? (correct / mcqCount) * 80 + 10 : 75; 
    return Math.round(score);
  };

  const handleCompleteExam = (examId: string, answers: any, finalScore?: number) => {
    if (!currentUser) return;
    
    const computedScore = finalScore ?? (examId === 'placement' ? calculatePlacementScore(answers) : undefined);

    const newAttempt: Attempt = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      examId,
      answers,
      score: computedScore,
      isGraded: computedScore !== undefined,
      date: new Date().toISOString()
    };

    setAttempts(prev => [...prev, newAttempt]);
    
    if (computedScore !== undefined) {
      const gainedXp = computedScore * 10;
      const newXp = (currentUser.xp || 0) + gainedXp;
      const newLevel = Math.floor(newXp / 1000) + 1;

      setCurrentUser(prev => prev ? ({ 
        ...prev, 
        xp: newXp,
        level: examId === 'placement' ? Math.max(1, Math.floor(computedScore / 10)) : Math.max(prev.level, newLevel),
        scoreHistory: [...(prev.scoreHistory || []), { contentId: examId, score: computedScore, date: new Date().toISOString() }]
      }) : null);
    }
    
    setSelectedExamId(null);
    setActiveTab('dashboard');
  };

  const addAlert = (alert: SystemAlert) => setAlerts(prev => [alert, ...prev]);

  if (!isLoggedIn || !currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const isBlocked = currentUser.role === UserRole.CITIZEN && currentUser.level === 0;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-['Vazirmatn']" dir="rtl">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={currentUser.role} isBlocked={isBlocked} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={currentUser} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {selectedExamId ? (
              <ExamPage 
                exam={exams.find(e => e.id === selectedExamId)!} 
                onComplete={handleCompleteExam} 
                onCancel={() => setSelectedExamId(null)} 
              />
            ) : (
              isBlocked && activeTab !== 'placement' ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-700">
                  <div className="p-8 bg-indigo-100 rounded-[3rem] text-indigo-600 text-6xl shadow-2xl shadow-indigo-100">🎯</div>
                  <h2 className="text-3xl font-black">تعیین سطح سواد شناختی الزامی است</h2>
                  <p className="text-slate-500 max-w-md">برای دسترسی به محتواهای تطبیقی و سناریوهای آموزشی، ابتدا باید سطح اولیه شما مشخص گردد.</p>
                  <button onClick={() => setActiveTab('placement')} className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-lg shadow-indigo-100 hover:scale-105 transition-transform">شروع آزمون تعیین سطح</button>
                </div>
              ) : (
                <>
                  {activeTab === 'dashboard' && <CitizenDashboard user={currentUser} attempts={attempts} alerts={alerts} />}
                  {activeTab === 'profile' && <ProfilePage user={currentUser} onUpdateUser={setCurrentUser} />}
                  {activeTab === 'placement' && <PlacementTestPage exam={PLACEMENT_EXAM} onComplete={(ans) => handleCompleteExam('placement', ans)} />}
                  {activeTab === 'library' && <ContentLibrary contents={contents} userLevel={currentUser.level} onStartExam={setSelectedExamId} exams={exams} />}
                  {activeTab === 'teacher' && <TeacherPanel user={currentUser} attempts={attempts} onUpdateAttempts={setAttempts} contents={contents} onUpdateContents={setContents} exams={exams} onUpdateExams={setExams} />}
                  {activeTab === 'admin' && <AdminPanel attempts={attempts} onAddAlert={addAlert} />}
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
