const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Atlas connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const entrySchema = new mongoose.Schema({
  driverName: String,
  vehicleNumber: String,
  date: String,
  present: Boolean,
  advance: Number,
  cngCost: Number,
  driverSalary: Number,
  shiftTo: String,
  billTo: String,
  partyRate: Number,
  gstPercent: Number,
  vehicleRate: Number,
  remark: String
});

const Entry = mongoose.model('Entry', entrySchema);

app.get('/api/entries', async (req, res) => {
  try {
    const entries = await Entry.find();
    res.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).send('Error fetching entries');
  }
});

app.post('/api/add-entry', async (req, res) => {
  const { advance, cngCost, driverSalary, partyRate, gstPercent, vehicleRate } = req.body;
  try {
    const newEntry = new Entry({
      ...req.body,
      advance: Number(advance),
      cngCost: Number(cngCost),
      driverSalary: Number(driverSalary),
      partyRate: Number(partyRate),
      gstPercent: Number(gstPercent),
      vehicleRate: Number(vehicleRate)
    });

    await newEntry.save();
    res.json(newEntry);
  } catch (error) {
    console.error('Error adding entry:', error);
    res.status(500).send('Error adding entry');
  }
});

app.put('/api/edit-entry/:id', async (req, res) => {
  try {
    const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEntry) {
      return res.status(404).send('Entry not found');
    }
    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).send('Error updating entry');
  }
});

app.delete('/api/delete-entry/:id', async (req, res) => {
  try {
    const deletedEntry = await Entry.findByIdAndDelete(req.params.id);
    if (!deletedEntry) return res.status(404).send('Entry not found');
    res.json(deletedEntry);
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).send('Error deleting entry');
  }
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
