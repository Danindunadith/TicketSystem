import { createContext, useContext, useState, useEffect } from 'react';

const TicketReplyContext = createContext();

export const useTicketReplies = () => {
  const context = useContext(TicketReplyContext);
  if (!context) {
    throw new Error('useTicketReplies must be used within a TicketReplyProvider');
  }
  return context;
};

export const TicketReplyProvider = ({ children }) => {
  const [ticketReplies, setTicketReplies] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedReplies = localStorage.getItem('ticketReplies');
    if (savedReplies) {
      setTicketReplies(JSON.parse(savedReplies));
    }
  }, []);

  // Save to localStorage whenever ticketReplies changes
  useEffect(() => {
    localStorage.setItem('ticketReplies', JSON.stringify(ticketReplies));
  }, [ticketReplies]);

  const addTicketReply = (replyData) => {
    const newReply = {
      id: `TKT-${Date.now()}`,
      topic: replyData.topic,
      originalMessage: replyData.originalMessage || "Original ticket message",
      status: replyData.status,
      createdAt: replyData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminReply: replyData.reply,
      adminName: replyData.adminName || "Support Team",
      replyDate: new Date().toISOString()
    };

    setTicketReplies(prev => [newReply, ...prev]);
    return newReply;
  };

  const updateTicketReply = (id, updatedData) => {
    setTicketReplies(prev => 
      prev.map(reply => 
        reply.id === id 
          ? { ...reply, ...updatedData, updatedAt: new Date().toISOString() }
          : reply
      )
    );
  };

  const deleteTicketReply = (id) => {
    setTicketReplies(prev => prev.filter(reply => reply.id !== id));
  };

  const value = {
    ticketReplies,
    addTicketReply,
    updateTicketReply,
    deleteTicketReply
  };

  return (
    <TicketReplyContext.Provider value={value}>
      {children}
    </TicketReplyContext.Provider>
  );
}; 