import React, { useContext, useMemo } from 'react';
import { QueueContext } from '../App';
import { QueueMode, Ticket } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants';

const LandingPage: React.FC = () => {
  const queueContext = useContext(QueueContext);
  const [myTicketId, setMyTicketId] = useLocalStorage<number | null>(LOCAL_STORAGE_KEY, null);

  if (!queueContext) return <div>Loading...</div>;
  const { state, actions } = queueContext;

  const handleTakeTicket = () => {
    const newTicketId = actions.takeTicket();
    setMyTicketId(newTicketId);
  };

  const myTicket: Ticket | undefined = myTicketId ? state.tickets.get(myTicketId) : undefined;
  
  const statusInfo = useMemo(() => {
    if (!myTicketId || !myTicket) {
      return null;
    }
    
    // One-Stage Mode
    if (state.mode === QueueMode.OneStage) {
      const serving = state.oneStageServing || '---';
      if (myTicket.status === 'serving') {
        return { message: "It's your turn! Please proceed.", serving, ahead: 0, color: "text-teal-700", bg: "bg-teal-100" };
      }
      const waitingTickets = Array.from(state.tickets.values()).filter(t => t.status === 'waiting');
      const peopleAhead = waitingTickets.filter(t => t.id < myTicketId).length;
      return { message: "Please wait for your number.", serving, ahead: peopleAhead };
    }
    
    // Two-Stage Mode
    const currentlyCalling = Array.from(state.tickets.values()).find(t => t.status === 'ready_for_assignment');

    if (myTicket.status === 'serving') {
        const servingRoom = Array.from(state.rooms.values()).find(r => r.currentlyServing === myTicketId);
        return { message: `It's your turn in ${servingRoom?.name || 'the room'}!`, serving: `Serving in ${servingRoom?.name || 'room'}`, ahead: 0, color: "text-teal-700", bg: "bg-teal-100" };
    }

    if (myTicket.status === 'ready_for_assignment') {
        return { message: "You're being called! Please go to the front desk.", serving: `Now Calling: ${myTicketId}`, ahead: 0, color: "text-teal-700", bg: "bg-teal-100" };
    }

    if (myTicket.status === 'assigned') {
        const myRoom = Array.from(state.rooms.values()).find(r => r.queue.includes(myTicketId));
        if (myRoom) {
            const position = myRoom.queue.indexOf(myTicketId);
            return { message: `Assigned to ${myRoom.name}.`, serving: `Room serving: ${myRoom.currentlyServing || '---'}`, ahead: position };
        }
    }
    
    const waitingForAssignment = Array.from(state.tickets.values()).filter(t => t.status === 'waiting');
    const peopleAhead = waitingForAssignment.filter(t => t.id < myTicketId).length;
    const servingText = currentlyCalling ? `Assigning: ${currentlyCalling.id}` : '---';
    return { message: "Waiting for your number to be called for assignment.", serving: servingText, ahead: peopleAhead };

  }, [myTicketId, myTicket, state]);

  return (
    <div className="container mx-auto max-w-2xl space-y-8">
      <Card className="text-center">
        {!myTicketId || !statusInfo ? (
            <>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome!</h2>
                <p className="text-slate-600 mb-6">Click the button below to receive your queue number.</p>
                <Button onClick={handleTakeTicket} className="px-8 py-4 text-xl">
                Take a Queue Number
                </Button>
            </>
        ) : (
            <div>
                <p className="text-lg text-slate-600">Your Ticket Number is</p>
                <p className="text-7xl font-bold text-indigo-700 my-4">{myTicketId}</p>
                <div className={`p-4 rounded-lg ${statusInfo.bg || 'bg-slate-100'}`}>
                    <p className={`text-xl font-semibold ${statusInfo.color || 'text-slate-800'}`}>{statusInfo.message}</p>
                </div>
                
                <div className="mt-6 grid grid-cols-2 divide-x divide-slate-200">
                    <div className="px-4">
                        <p className="text-sm text-slate-500">Currently Serving</p>
                        <p className="text-2xl font-bold">{statusInfo.serving}</p>
                    </div>
                    <div className="px-4">
                        <p className="text-sm text-slate-500">People Ahead</p>
                        <p className="text-2xl font-bold">{statusInfo.ahead !== null ? statusInfo.ahead : '---'}</p>
                    </div>
                </div>
            </div>
        )}
      </Card>
    </div>
  );
};

export default LandingPage;