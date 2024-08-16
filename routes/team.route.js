import express from 'express';
import { AuthenticateUser } from '../middleware/Authenticate.js'
import { addMembers, createTeam, removeMember } from '../controller/team.controller.js';
import { addMemberValidator, newTeamValidator, removeMemberValidator, validateHandler } from '../lib/validator.js';

const app = express.Router();

app.use(AuthenticateUser);

app.post('/newteam', newTeamValidator(), validateHandler, createTeam);
app.put('/addmembers', addMemberValidator(), validateHandler, addMembers);
app.put('/removemembers', removeMemberValidator(), validateHandler, removeMember);


export default app;