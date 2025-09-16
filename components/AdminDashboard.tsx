import React, { useContext, useState } from 'react';
import { QueueContext } from '../App';
import { QueueMode } from '../types';
import Card from './common/Card';
import Button from './common/Button';

interface AdminDashboardProps {
  onNavigateToRoom: (roomId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToRoom }) => {
  const queueContext = useContext(QueueContext);
  // Local state for the dropdown selection in two-stage mode
  const [selectedRoom, setSelectedRoom] = useState<string>('');

  if (!queueContext) return <div>Loading...</div>;
  const { state, actions } = queueContext;

  const handleAssign = () => {
    if (state.ticketReadyForAssignment && selectedRoom) {
      actions.assignTicketToRoom(state.ticketReadyForAssignment.id, selectedRoom);
      setSelectedRoom('');
    }
  };

  const handleModeToggle = () => {
    const newMode = state.mode === QueueMode.OneStage ? QueueMode.TwoStage : QueueMode.OneStage;
    actions.setMode(newMode);
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Staff Dashboard</h1>
        <Button onClick={actions.resetQueue} variant="danger">Reset Queue</Button>
      </div>

      <Card>
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-lg font-semibold">Queue Mode</h3>
                <p className="text-slate-600">Current Mode: <span className="font-bold text-indigo-700">{state.mode === QueueMode.OneStage ? 'One-Stage' : 'Two-Stage'}</span></p>
            </div>
          <Button onClick={handleModeToggle} variant="secondary">
            Switch to {state.mode === QueueMode.OneStage ? 'Two-Stage' : 'One-Stage'}
          </Button>
        </div>
      </Card>

      {state.mode === QueueMode.OneStage ? (
        <Card title="One-Stage Queue Control">
          <div className="text-center">
            <p className="text-slate-600">Currently Serving</p>
            <p className="text-6xl font-bold my-4">{state.oneStageServing || '---'}</p>
            <Button onClick={actions.callNextOneStage} className="px-8 py-3 text-lg">
              Call Next
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2 lg:col-span-1">
                 <Card title="Waiting Room Control" className="h-full">
                    <div className="space-y-4 text-center">
                        <div>
                            <p className="text-slate-600">Tickets Waiting</p>
                            <p className="text-4xl font-bold">{state.waitingRoomTickets.length}</p>
                        </div>
                        <Button
                            onClick={actions.callNextForAssignment}
                            disabled={!!state.ticketReadyForAssignment || state.waitingRoomTickets.length === 0}
                            fullWidth
                        >
                            Call Next for Assignment
                        </Button>

                        <hr className="my-4 border-slate-200"/>

                        {state.ticketReadyForAssignment ? (
                            <div className="space-y-3 p-3 bg-indigo-50 rounded-lg">
                                <p className="text-slate-600">Now Assigning</p>
                                <p className="text-5xl font-bold text-indigo-700">Ticket #{state.ticketReadyForAssignment.id}</p>
                                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
                                    <select
                                        value={selectedRoom}
                                        onChange={(e) => setSelectedRoom(e.target.value)}
                                        className="block w-full pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        <option value="" disabled>Select Room</option>
                                        {Array.from(state.rooms.values()).map(room => (
                                            <option key={room.id} value={room.id}>{room.name}</option>
                                        ))}
                                    </select>
                                    <Button onClick={handleAssign} disabled={!selectedRoom} className="w-full sm:w-auto flex-shrink-0">
                                        Assign
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-slate-500 py-4">
                                <p>No ticket called for assignment.</p>
                                <p className="text-sm">Click "Call Next" to proceed.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {Array.from(state.rooms.values()).map(room => (
                    <Card key={room.id} title={room.name}>
                        <div className="space-y-3">
                            <p className="text-slate-600">Waiting in room: <span className="font-bold">{room.queue.length}</span></p>
                            <p className="text-slate-600">Next ticket: <span className="font-bold">{room.queue[0] || '---'}</span></p>
                            <p className="text-slate-600">Currently serving: <span className="font-bold text-teal-700">{room.currentlyServing || '---'}</span></p>
                             <Button onClick={() => onNavigateToRoom(room.id)} fullWidth>
                                Manage {room.name}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;