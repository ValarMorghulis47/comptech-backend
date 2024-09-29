import { TryCatch } from "../middleware/asyncErrors.js";
import { Event } from "../models/event.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { DeleteFileCloudinary, UploadFilesCloudinary } from "../utils/features.js";


const registerEvent = TryCatch(async (req, res, next) => {
    const { title, date, time, location, description, category, spokesPerson, isFeatured } = req.body;
    let eventData = {
        title,
        date: new Date(date),
        time,
        location,
        description,
        category,
        isFeatured: isFeatured !== undefined ? isFeatured : false
    };

    // Check if spokesPerson is a string and parse it because of multipart/form-data
    let parsedSpokesPerson;
    parsedSpokesPerson = typeof spokesPerson === 'string' ? JSON.parse(spokesPerson) : spokesPerson;

    eventData.spokesPerson = {
        name: parsedSpokesPerson.name,
        description: parsedSpokesPerson.description,
        image: parsedSpokesPerson.image || {},
        socials: parsedSpokesPerson.socials || []
    };

    if (req.body?.collaboration) {
        eventData.collaboration = req.body.collaboration;
    }

    if (req.body?.keyPoints) {
        eventData.keyPoints = JSON.parse(req.body.keyPoints);
    }

    if (req?.files?.image) {
        const folder = "event";
        const result = await UploadFilesCloudinary(req.files.image[0], folder);
        if (!result) return next(new ErrorHandler('Image upload failed', 400));

        eventData.eventCover = {
            public_id: result.public_id,
            url: result.secure_url
        };
    }

    if (req?.files?.person) {
        const folder = "avatar";
        const result = await UploadFilesCloudinary(req.files.person[0], folder);
        if (!result) return next(new ErrorHandler('Image upload failed', 400));

        eventData.spokesPerson.image = {
            public_id: result.public_id,
            url: result.secure_url
        };
    }

    const event = await Event.create(eventData);

    if (!event) {
        if (eventData?.eventCover && eventData.eventCover.public_id) {
            await DeleteFileCloudinary(eventData.eventCover.public_id);
        }
        return next(new ErrorHandler("Event creation failed", 500));
    }

    res.status(201).json({
        success: true,
        event
    });
});

const getAllEvents = TryCatch(async (req, res, next) => {

    const events = await Event.find();
    if (!events) return next(new ErrorHandler('No events found', 404));

    return res.status(200).json({
        success: true,
        message: 'All events fetched successfully',
        data: events
    });
})

const getEventById = TryCatch(async (req, res, next) => {
    const event = await Event.findById(req.params.id);
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
    // console.log(updateData);
    

    if (!event) {
        return next(new ErrorHandler("Event not found", 404));
    }
    console.log(req.files.eventPics);
    

    // Handle eventCover
    if (req.files?.image) {
        const folder = "event";
        const result = await UploadFilesCloudinary(req.files.image, folder);
        if (!result) return next(new ErrorHandler('Image upload failed', 400));

        if (event.eventCover?.public_id) {
            await DeleteFileCloudinary(event.eventCover.public_id);
        }

        event.eventCover = {
            public_id: result.public_id,
            url: result.secure_url
        };
    }

    // Handle eventPics 
    // TODO: First delte the existing eventPics
    if (req.files?.eventPics) { 
        const folder = "eventPics";
        const results = await Promise.all(req.files.eventPics.map(file => UploadFilesCloudinary(file, folder)));
        event.eventPics = results.map(result => ({
            public_id: result.public_id,
            url: result.secure_url
        }));
    }

    // Handle spokesPerson image
    if (req.files?.person) {
        const folder = "avatar";
        const result = await UploadFilesCloudinary(req.files.person, folder);
        if (!result) return next(new ErrorHandler('Image upload failed', 400));

        if (event.spokesPerson.image?.public_id) {
            await DeleteFileCloudinary(event.spokesPerson.image.public_id);
        }

        event.spokesPerson.image = {
            public_id: result.public_id,
            url: result.secure_url
        };
    }

    // Handle spokesPerson
    if (updateData.spokesPerson) {
        try {
            updateData.spokesPerson = JSON.parse(updateData.spokesPerson);
        } catch (error) {
            return next(new ErrorHandler("Invalid spokesPerson data", 400));
        }
        
        event.spokesPerson.name = updateData.spokesPerson.name || event.spokesPerson.name;
        event.spokesPerson.description = updateData.spokesPerson.description || event.spokesPerson.description;

        if (updateData.spokesPerson.socials) {
            updateData.spokesPerson.socials.forEach(social => {
                const index = event.spokesPerson.socials.findIndex(s => s.name === social.name);
                if (index !== -1) {
                    event.spokesPerson.socials[index] = social;
                } else {
                    event.spokesPerson.socials.push(social);
                }
            });
        }

        delete updateData.spokesPerson;
    }

    // Handle keyPoints
    if (updateData.keyPoints) {
        try {
            updateData.keyPoints = JSON.parse(updateData.keyPoints);
        } catch (error) {
            return next(new ErrorHandler("Invalid keyPoints data", 400));
        }
        updateData.keyPoints.forEach(keyPoint => {
            const index = event.keyPoints.findIndex(kp => kp._id.toString() === keyPoint._id.toString());
            if (index !== -1) {
                event.keyPoints[index] = { ...event.keyPoints[index], ...keyPoint };
            } else {
                event.keyPoints.push(keyPoint);
            }
        });
        delete updateData.keyPoints;
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
    const event = await Event.findById(req.params.id);
    if (!event) return next(new ErrorHandler('Event not found', 404));

    // Delete eventCover image
    if (event.eventCover && event.eventCover.public_id) {
        await DeleteFileCloudinary(event.eventCover.public_id);
    }

    // Delete eventPics images
    if (event.eventPics && event.eventPics.length > 0) {
        await Promise.all(event.eventPics.map(pic => DeleteFileCloudinary(pic.public_id)));
    }

    // Delete spokesPerson image
    if (event.spokesPerson && event.spokesPerson.image && event.spokesPerson.image.public_id) {
        await DeleteFileCloudinary(event.spokesPerson.image.public_id);
    }

    // Delete the event
    await Event.findByIdAndDelete(req.params.id);

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