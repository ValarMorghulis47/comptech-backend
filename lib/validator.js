import { body, param, validationResult } from "express-validator";
import ErrorHandler from '../utils/ErrorHandler.js';

const validateHandler = (req, res, next) => {
    const errors = validationResult(req);
    const errorMessages = errors
        .array()
        .map((error) => error.msg)
        .join(", ");

    if (errors.isEmpty()) return next();
    else next(new ErrorHandler(errorMessages, 400));
};

// User Validators
const registerValidator = () => [
    body("name", "Please Enter Username").notEmpty(),
    body("about", "Please Enter About").notEmpty(),
    body("socialmedia", "Please enter valid social media data")
        .optional()
        .isString()
        .custom((value) => {
            try {
                JSON.parse(value);
                return true;
            } catch {
                throw new Error("Social media data must be a valid JSON string");
            }
        }),
    body("career", "Please enter valid career data")
        .optional()
        .isString()
        .custom((value) => {
            try {
                JSON.parse(value);
                return true;
            } catch {
                throw new Error("Career data must be a valid JSON string");
            }
        }),
    body("password", "Please Enter a Valid Password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

const loginValidator = () => [
    body("name", "Please Enter Username").notEmpty(),
    body("password", "Please Enter Password").notEmpty(),
];

const deleteUserValidator = () => [
    param("id", "Please Enter User ID").notEmpty(),
];

const getUserValidator = () => [
    param("id", "Please Enter User ID").notEmpty(),
];

// Event Validators
const registerEventValidator = () => [
    body("title", "Please Enter Title").notEmpty().withMessage("Title is required"),
    body("date", "Please Enter Date").notEmpty().isISO8601().withMessage("Date must be in ISO8601 format"),
    body("time", "Please Enter Time").optional().isString().withMessage("Time must be a valid string"),
    body("location", "Please Enter Location").notEmpty().withMessage("Location is required"),
    body("description", "Please Enter Description").notEmpty().withMessage("Description is required"),
    body("category", "Please Enter Category").notEmpty().withMessage("Category is required"),
    body("spokesPerson", "Please Enter Spokes Person").notEmpty(),
    body("collaboration")
        .optional()
        .isString(),
    body("eventPoints")
        .optional()
        .isString().withMessage("Event Points must be a valid JSON string")
        .custom((value) => {
            try {
                JSON.parse(value);
                return true;
            } catch {
                throw new Error("Event Points data must be a valid JSON string");
            }
        }),
    body("isFeatured")
        .optional()
        .isBoolean().withMessage("IsFeatured must be a boolean value"),
];

const getEventValidator = () => [
    param("id", "Please Enter Event ID").notEmpty(),
];

// Team Validators
const newTeamValidator = () => [
    body("name", "Please Enter Team Name").notEmpty(),
    body("members")
        .notEmpty()
        .withMessage("Please Enter Members")
        .isArray({ min: 2 })
        .withMessage("Members must at least be 2"),
];

const addMemberValidator = () => [
    body("teamId", "Please Enter Team ID").notEmpty(),
    body("members")
        .notEmpty()
        .withMessage("Please Enter Members")
        .isArray({ min: 1 })
        .withMessage("Members must at least be 1"),
];

const removeMemberValidator = () => [
    body("teamId", "Please Enter Team ID").notEmpty(),
    body("userId", "Please Enter User ID").notEmpty(),
];

export {
    deleteUserValidator, 
    getUserValidator, 
    loginValidator,
    registerValidator,
    validateHandler,
    registerEventValidator,
    getEventValidator,
    newTeamValidator,
    addMemberValidator,
    removeMemberValidator
};
