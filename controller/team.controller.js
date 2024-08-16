import { TryCatch } from '../middleware/asyncErrors.js';
import { Team } from '../models/team.model.js';
import { User } from '../models/user.model.js';
import ErrorHandler from '../utils/ErrorHandler.js';


const createTeam = TryCatch(async (req, res, next) => {
    const { name, members } = req.body;
    if (members.length < 2) return next(new ErrorHandler('Team must have at least 2 members', 400));
    const team = await Team.create({
        name,
        members
    })
    if (!team) return next(new ErrorHandler('Team could not be created', 400));

    return res.status(201)
        .json({
            sucess: true,
            message: "Team Created Suceesfully",
            data: team
        });
});

const addMembers = TryCatch(async (req, res, next) => {
    const { members, teamId } = req.body;
    if (members.length < 1)
        return next(new ErrorHandler('Please provide members', 400));
    const team = await Team.findById(teamId);
    if (!team)
        return next(new ErrorHandler('team not found', 404));

    // we have to check if the user is already in the team
    const ExistMember = members.some(member => team.members.includes(member));
    if (ExistMember)
        return next(new ErrorHandler('Member already in the team', 400));

    const newMembers = members.map((member_id) => User.findById(member_id, "name"));
    const AllMembers = await Promise.all(newMembers);
    console.log(...AllMembers);
    team.members.push(...AllMembers);
    await team.save();
    const newMembersName = AllMembers.map(member => member.name).join(', ');
    return res.status(200)
        .json({
            success: true,
            message: `${newMembersName} was added to the team`,
            data: team
        })
});

const removeMember = TryCatch(async (req, res, next) => {
    const { teamId, userId } = req.body;
    const [team, userThatWillBeRemoved] = await Promise.all([
        Team.findById(teamId),
        User.findById(userId, "name")
    ]);

    if (!team)
        return next(new ErrorHandler('Team not found', 404));
    if (!userThatWillBeRemoved)
        return next(new ErrorHandler('User not found', 404));
    if (!team.members.includes(userId))
        return next(new ErrorHandler('User not in the team', 400));
    if (team.members.length < 3)
        return next(new ErrorHandler('Team must have at least 2 members', 400));
    team.members = team.members.filter(member => member.toString() !== userId);
    await team.save();

    return res.status(200)
        .json({
            success: true,
            message: `${userThatWillBeRemoved.name} was removed from the team`,
            data: team
        })
});

export {
    createTeam,
    addMembers,
    removeMember
}