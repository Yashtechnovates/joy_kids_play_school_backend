const CulturalEvent = require('../../models/culturalEvent');

const createEvent = async (req, res) => {
  try {
    const event = await CulturalEvent.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const { tag, search } = req.query;
    let query = {};
    if (tag) query.tag = tag;
    if (search) query.title = { $regex: search, $options: 'i' };
    const events = await CulturalEvent.find(query).sort({ date: -1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await CulturalEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await CulturalEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await CulturalEvent.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };