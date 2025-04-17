const { JournalEntry } = require('../models');

const createEntry = async (req, res) => {
  try {
    const userId = req.user.userId; // from JWT
    const { content, course, datePlayed } = req.body;

    const entry = await JournalEntry.create({
      content,
      course,
      datePlayed,
      userId,
    });

    res.status(201).json({ message: 'Journal entry created.', entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getEntries = async (req, res) => {
  try {
    const userId = req.user.userId;
    const entries = await JournalEntry.findAll({ where: { userId } });
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getEntry = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const entry = await JournalEntry.findOne({ where: { id, userId } });
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found.' });
    }
    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateEntry = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { content, course, datePlayed } = req.body;

    const entry = await JournalEntry.findOne({ where: { id, userId } });
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found.' });
    }

    entry.content = content;
    entry.course = course;
    entry.datePlayed = datePlayed;
    await entry.save();

    res.json({ message: 'Entry updated.', entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const entry = await JournalEntry.findOne({ where: { id, userId } });
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found.' });
    }

    await entry.destroy();
    res.json({ message: 'Entry deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
};