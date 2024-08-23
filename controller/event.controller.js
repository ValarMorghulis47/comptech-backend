import { TryCatch } from "../middleware/asyncErrors.js";
import { Event } from "../models/event.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { DeleteFileCloudinary, UploadFilesCloudinary } from "../utils/features.js";


const registerEvent = TryCatch(async (req, res, next) => {
    
    const { title, date, time , location, description, category, spokesPerson, isFeatured } = req.body;
    let eventData = { title, date: new Date(date), time ,location, description, category, spokesPerson, isFeatured };

    if (req.body?.collaboration) {
        eventData.collaboration = req.body.collaboration;
    }

    if (req.body?.keyPoints) {
        eventData.keyPoints = JSON.parse(req.body.keyPoints);
    }

    if (req?.file) {
        const folder = "event";
        const result = await UploadFilesCloudinary(req.file, folder);
        if (!result) return next(new ErrorHandler('Image upload failed', 400));

        eventData.img = {
            public_id: result.public_id,
            url: result.secure_url
        };
    }
    
    const event = await Event.create(eventData);
    
    if (!event) {
        if (eventData.img && eventData.img.public_id) {
            await DeleteFileCloudinary(eventData.img.public_id);
        }
        return next(new ErrorHandler('Event creation failed', 400));
    }

    return res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: event
    });
});

const getAllEvents = TryCatch(async (req, res, next) => {
    const events = await Event.find().populate('spokesPerson', 'name img currentPosition eventPoints about');
    if (!events) return next(new ErrorHandler('No events found', 404));

    return res.status(200).json({
        success: true,
        message: 'All events fetched successfully',
        data: events
    });
})

const getEventById = TryCatch(async (req, res, next) => {
    const event = await Event.findById(req.params.id).populate('spokesPerson', 'name img currentPosition eventPoints about');
    if (!event) return next(new ErrorHandler('Event not found', 404));

    return res.status(200).json({
        success: true,
        message: 'Event fetched successfully',
        data: event
    });
});

const updateEvent = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;
    const event = await Event.findById(id);
    if (!event) {
        return next(new ErrorHandler("Event not found", 404));
    }
    // Check if event Points is provided in the update
    if (updateData.eventPoints) {
        // Case 1: Update specific Event Points object by unique identifier (e.g., id)
        if (updateData.eventPoints._id) {
            console.log("in if");
            const index = event.eventPoints.findIndex(e => e._id.toString() === updateData.eventPoints._id.toString());
            console.log(index);
            if (index !== -1) {
                // Update existing Event Points object by id
                event.eventPoints[index] = { ...event.eventPoints[index], ...updateData.eventPoints };
            } else {
                // Optionally handle the case where the id does not exist
                event.eventPoints.push(updateData.eventPoints);
            }
        }
        // Case 2: Replace entire career array
        else if (Array.isArray(updateData.eventPoints)) {
            event.eventPoints = updateData.eventPoints;
        }
        delete updateData.eventPoints; // Prevent re-updating
    }

    // Update other fields
    Object.keys(updateData).forEach(key => {
        event[key] = updateData[key];
    });

    await event.save();
    res.status(200).json({
        success: true,
        message: "Event updated successfully",
        event
    });
});

const deleteEvent = TryCatch(async (req, res, next) => {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return next(new ErrorHandler('Event not found', 404));

    if (event.img && event.img.public_id) {
        await DeleteFileCloudinary(event.img.public_id);
    }

    return res.status(200).json({
        success: true,
        message: 'Event deleted successfully'
    });
});


export {
    registerEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
}