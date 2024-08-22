import express from 'express';
import { AuthenticateUser } from '../middleware/Authenticate.js'
import { deleteEvent, getAllEvents, getEventById, registerEvent, updateEvent } from '../controller/event.controller.js';
import { singleUpload } from '../middleware/multer.midlleware.js'
import { getEventValidator, registerEventValidator, validateHandler } from '../lib/validator.js';

const app = express.Router();

app.get('/all', getAllEvents);
app.get('/single/:id', getEventValidator(), validateHandler, getEventById);

app.post('/create', singleUpload, registerEvent);
app.put('/update/:id', getEventValidator(), validateHandler, updateEvent);
app.delete('/delete/:id', getEventValidator(), validateHandler, deleteEvent);


export default app;