import express from 'express';
import { Team } from '../models/index';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    const teams = await Team.find().sort({ created_at: -1 }).lean();
    
    const formattedTeams = teams.map(team => {
      const { _id, ...rest } = team;
      return { ...rest, id: _id.toString(), _id: _id.toString() };
    });
    
    res.json(formattedTeams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams', details: String(error) });
  }
});

router.post('/', async (req, res) => {
  try {
    const newTeam = new Team({
      name: req.body.team_name || 'Unnamed Team',
      team_name: req.body.team_name || '',
      description: req.body.description || '',
      lead_id: req.body.lead_id || ''
    });
    
    await newTeam.save();
    
    const obj = newTeam.toObject();
    res.json({ ...obj, id: obj._id.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add team' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existingTeam = await Team.findById(id);
    
    if (!existingTeam) {
      return res.status(404).json({ error: 'Team not found' });
    }

    existingTeam.team_name = req.body.team_name !== undefined ? req.body.team_name : existingTeam.team_name;
    existingTeam.name = existingTeam.team_name;
    existingTeam.description = req.body.description !== undefined ? req.body.description : existingTeam.description;
    existingTeam.lead_id = req.body.lead_id !== undefined ? req.body.lead_id : existingTeam.lead_id;

    await existingTeam.save();
    
    const obj = existingTeam.toObject();
    res.json({ ...obj, id: obj._id.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTeam = await Team.findByIdAndDelete(id);
    
    if (!deletedTeam) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

export default router;
