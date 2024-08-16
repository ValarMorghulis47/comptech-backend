import express from 'express';
import { deleteUser, getAllUsers, getUser, loginUser, logoutUser, registerUser, updateUser, updateUserImage } from '../controller/user.controller.js';
import { singleUpload } from '../middleware/multer.midlleware.js';
import { AuthenticateUser } from '../middleware/Authenticate.js';
import { deleteUserValidator, getUserValidator, loginValidator, registerValidator, validateHandler } from '../lib/validator.js';

const app = express.Router();

app.post('/register', registerValidator(), validateHandler , registerUser);
app.post('/login', loginValidator(), validateHandler, loginUser);


app.get('/logout', logoutUser);
app.get('/all', getAllUsers);
app.delete('/delete/:id', deleteUserValidator(), validateHandler,  deleteUser);
app.get('/user/:id', getUserValidator(), validateHandler, getUser);
app.put('/update/:id', getUserValidator(), validateHandler, updateUser);
app.put('/updateimg/:id', singleUpload, getUserValidator(), validateHandler, updateUserImage);



export default app;