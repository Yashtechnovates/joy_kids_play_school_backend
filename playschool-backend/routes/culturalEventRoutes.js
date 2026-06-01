const express = require('express');
const router = express.Router();
const CulturalEvent = require('../models/culturalEvent');

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await CulturalEvent.find({}).sort({ date: -1 });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const event = await CulturalEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST create event
router.post('/', async (req, res) => {
  try {
    const event = await CulturalEvent.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update event
router.put('/:id', async (req, res) => {
  try {
    const event = await CulturalEvent.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const event = await CulturalEvent.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;