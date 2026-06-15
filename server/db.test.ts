import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { connectDB } from './db';

const originalUri = process.env.MONGODB_URI;

test('connectDB returns false instead of crashing when MongoDB is unavailable', async () => {
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/test';

  try {
    await mongoose.disconnect();
    const result = await connectDB();
    assert.equal(result, false);
  } finally {
    await mongoose.disconnect().catch(() => undefined);
    if (originalUri === undefined) {
      delete process.env.MONGODB_URI;
    } else {
      process.env.MONGODB_URI = originalUri;
    }
  }
});
