import express from 'express';
import { deleteUser, getAllUsers, getUser, loginAdmin, logoutUser, registerUser, updateUser, updateUserImage } from '../controller/user.controller.js';
import { upload } from '../middleware/multer.midlleware.js';
import { AuthenticateUser } from '../middleware/Authenticate.js';
import { deleteUserValidator, getUserValidator, loginValidator, registerValidator, validateHandler } from '../lib/validator.js';

const app = express.Router();

app.post('/register', upload , registerUser);
app.post('/login', loginAdmin);


app.get('/logout', logoutUser);
app.get('/all', getAllUsers);
app.delete('/delete/:id', deleteUserValidator(), validateHandler,  deleteUser);
app.get('/user/:id', getUserValidator(), validateHandler, getUser);
app.put('/update/:id', getUserValidator(), validateHandler, updateUser);
app.put('/updateimg/:id', upload, getUserValidator(), validateHandler, updateUserImage);



export default app;