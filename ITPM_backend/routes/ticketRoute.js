import express from 'express';

import { createTicket, getAllTickets,getTicketById,updateTicket,deleteTicket,} from '../controllers/ticketController.js';

const router = express.Router();
// Create a new ticket
router.post('/', createTicket);
// Get all tickets
router.get('/', getAllTickets);
// Get a ticket by ID
router.get('/:id', getTicketById);
// Update a ticket by ID
router.put('/:id', updateTicket);
// Delete a ticket by ID
router.delete('/:id', deleteTicket);

export default router;