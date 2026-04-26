import { useState, ReactNode } from 'react';
import { TopNav } from './components/layout/TopNav';
import { SideNav } from './components/layout/SideNav';
import { Kanban } from './views/Kanban';
import { Dashboard } from './views/Dashboard';
import { TicketDetail } from './views/TicketDetail';
import { Review } from './views/Review';
import { Epic } from './views/Epic';
import { Agents } from './views/Agents';
import { Settings } from './views/Settings';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const handleTicketSelect = (id: string) => {
    setSelectedTicket(id);
    setCurrentView('ticket');
  };

  const handleBackToKanban = () => {
    setSelectedTicket(null);
    setCurrentView('kanban');
  };

  let content: ReactNode = null;
  switch (currentView) {
    case 'dashboard':
      content = <Dashboard />;
      break;
    case 'kanban':
      content = <Kanban onTicketSelect={handleTicketSelect} />;
      break;
    case 'ticket':
      content = <TicketDetail id={selectedTicket || '#VB-ERROR'} onBack={handleBackToKanban} />;
      break;
    case 'review':
      content = <Review />;
      break;
    case 'epic':
      content = <Epic />;
      break;
    case 'agents':
      content = <Agents />;
      break;
    case 'settings':
      content = <Settings />;
      break;
    default:
      content = <Dashboard />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface font-body-md text-on-surface">
      <TopNav />
      <SideNav currentView={currentView} setView={setCurrentView} />
      
      <main className="md:ml-64 pt-16 flex-1 h-screen overflow-hidden flex flex-col p-4 md:p-6 pb-6 box-border grid-bg max-w-[1600px] w-full mx-auto">
         {content}
      </main>
    </div>
  );
}

