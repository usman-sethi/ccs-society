import express from 'express';
import { Query } from '../models/index';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    const queries = await Query.find().sort({ created_at: -1 }).lean();
    
    const formattedQueries = queries.map(query => {
      const { _id, ...rest } = query;
      return { ...rest, id: _id.toString(), _id: _id.toString() };
    });
    
    res.json(formattedQueries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch queries' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newQuery = new Query({
      name: req.body.name || '',
      email: req.body.email || '',
      message: req.body.message || '',
      status: 'pending'
    });
    
    await newQuery.save();
    
    const obj = newQuery.toObject();
    res.json({ ...obj, id: obj._id.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add query' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existingQuery = await Query.findById(id);
    
    if (!existingQuery) {
      return res.status(404).json({ error: 'Query not found' });
    }

    existingQuery.status = req.body.status !== undefined ? req.body.status : existingQuery.status;

    await existingQuery.save();
    
    const obj = existingQuery.toObject();
    res.json({ ...obj, id: obj._id.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update query' });
  }
});

export default router;
