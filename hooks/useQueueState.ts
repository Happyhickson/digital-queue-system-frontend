import { useState, useCallback, useMemo } from 'react';
import { Ticket, Room, QueueMode } from '../types';
import { ROOM_DEFINITIONS } from '../constants';

// This custom hook simulates a backend service by managing all queue-related state and logic.
// In a real application, these functions would make API calls to a server.

interface State {
  tickets: Map<number, Ticket>;
  rooms: Map<string, Room>;
  mode: QueueMode;
  nextTicketNumber: number;
  oneStageServing: number | null;
  isAuthenticated: boolean;
}

export interface QueueActions {
  takeTicket: () => number;
  setMode: (mode: QueueMode) => void;
  callNextOneStage: () => void;
  callNextForAssignment: () => void;
  assignTicketToRoom: (ticketId: number, roomId: string) => void;
  callNextInRoom: (roomId: string) => void;
  setIsAuthenticated: (auth: boolean) => void;
  resetQueue: () => void;
}

export interface QueueState {
  state: State & {
    waitingRoomTickets: Ticket[];
    ticketReadyForAssignment: Ticket | undefined;
  };
  actions: QueueActions;
}

const initializeRooms = (): Map<string, Room> => {
  const roomMap = new Map<string, Room>();
  ROOM_DEFINITIONS.forEach(def => {
    roomMap.set(def.id, { ...def, queue: [], currentlyServing: null });
  });
  return roomMap;
};


export const useQueueState = (): QueueState => {
  const [state, setState] = useState<State>({
    tickets: new Map(),
    rooms: initializeRooms(),
    mode: QueueMode.OneStage,
    nextTicketNumber: 101,
    oneStageServing: null,
    isAuthenticated: false,
  });

  // Action: Generate a new ticket for a user.
  const takeTicket = useCallback(() => {
    const newTicketId = state.nextTicketNumber;
    const newTicket: Ticket = { id: newTicketId, status: 'waiting' };
    
    setState(prevState => {
      const newTickets = new Map(prevState.tickets);
      newTickets.set(newTicketId, newTicket);
      return {
        ...prevState,
        tickets: newTickets,
        nextTicketNumber: prevState.nextTicketNumber + 1,
      };
    });
    return newTicketId;
  }, [state.nextTicketNumber]);

  // Action: Toggle between one-stage and two-stage modes.
  const setMode = useCallback((mode: QueueMode) => {
    setState(prevState => ({ ...prevState, mode }));
  }, []);

  // Action: Call the next person in the one-stage queue.
  const callNextOneStage = useCallback(() => {
    setState(prevState => {
      const waitingTickets = Array.from(prevState.tickets.values())
        .filter(t => t.status === 'waiting')
        .sort((a, b) => a.id - b.id);
      
      if (waitingTickets.length === 0) return prevState;

      const nextTicket = waitingTickets[0];
      const newTickets = new Map(prevState.tickets);
      newTickets.set(nextTicket.id, { ...nextTicket, status: 'serving' });

      return {
        ...prevState,
        tickets: newTickets,
        oneStageServing: nextTicket.id,
      };
    });
  }, []);

  // Action: Call the next person from the general waiting pool for room assignment.
  const callNextForAssignment = useCallback(() => {
    setState(prevState => {
      const isAlreadyCalling = Array.from(prevState.tickets.values()).some(
        t => t.status === 'ready_for_assignment'
      );
      if (isAlreadyCalling) return prevState; // Only call one at a time

      const waitingTickets = Array.from(prevState.tickets.values())
        .filter(t => t.status === 'waiting')
        .sort((a, b) => a.id - b.id);
      
      if (waitingTickets.length === 0) return prevState;

      const nextTicket = waitingTickets[0];
      const newTickets = new Map(prevState.tickets);
      newTickets.set(nextTicket.id, { ...nextTicket, status: 'ready_for_assignment' });

      return {
        ...prevState,
        tickets: newTickets,
      };
    });
  }, []);


  // Action: Assign a called ticket to a specific room in two-stage mode.
  const assignTicketToRoom = useCallback((ticketId: number, roomId: string) => {
    setState(prevState => {
      const ticket = prevState.tickets.get(ticketId);
      const room = prevState.rooms.get(roomId);
      if (!ticket || !room || ticket.status !== 'ready_for_assignment') return prevState;

      const newTickets = new Map(prevState.tickets);
      newTickets.set(ticketId, { ...ticket, status: 'assigned' });
      
      const newRooms = new Map(prevState.rooms);
      const updatedRoom = { ...room, queue: [...room.queue, ticketId] };
      newRooms.set(roomId, updatedRoom);

      return { ...prevState, tickets: newTickets, rooms: newRooms };
    });
  }, []);

  // Action: Call the next person in a specific room's queue.
  const callNextInRoom = useCallback((roomId: string) => {
    setState(prevState => {
      const room = prevState.rooms.get(roomId);
      if (!room || room.queue.length === 0) return prevState;

      const newRooms = new Map(prevState.rooms);
      const newQueue = [...room.queue];
      const nextTicketId = newQueue.shift();
      
      if(nextTicketId === undefined) return prevState;

      const updatedRoom = { ...room, queue: newQueue, currentlyServing: nextTicketId };
      newRooms.set(roomId, updatedRoom);
      
      const newTickets = new Map(prevState.tickets);
      const ticket = newTickets.get(nextTicketId);
      if(ticket) {
          newTickets.set(nextTicketId, {...ticket, status: 'serving'});
      }

      return { ...prevState, rooms: newRooms, tickets: newTickets };
    });
  }, []);
  
  const setIsAuthenticated = useCallback((auth: boolean) => {
      setState(prevState => ({ ...prevState, isAuthenticated: auth }));
  },[]);

  // Action: Reset the queue (for demo purposes).
  const resetQueue = useCallback(() => {
    setState({
      tickets: new Map(),
      rooms: initializeRooms(),
      mode: QueueMode.OneStage,
      nextTicketNumber: 101,
      oneStageServing: null,
      isAuthenticated: state.isAuthenticated, // Keep auth state
    });
  }, [state.isAuthenticated]);

  const waitingRoomTickets = useMemo(() => {
    return Array.from(state.tickets.values()).filter(t => t.status === 'waiting');
  }, [state.tickets]);

  const ticketReadyForAssignment = useMemo(() => {
    return Array.from(state.tickets.values()).find(t => t.status === 'ready_for_assignment');
  }, [state.tickets]);


  return {
    state: { ...state, waitingRoomTickets, ticketReadyForAssignment },
    actions: { 
      takeTicket, 
      setMode, 
      callNextOneStage,
      callNextForAssignment,
      assignTicketToRoom, 
      callNextInRoom,
      setIsAuthenticated,
      resetQueue
    },
  };
};