import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/dbConnect';
import Customization from '@/models/Customization';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    const item = await Customization.findById(id);
    res.json(item);
  } else if (req.method === 'PUT') {
    const updated = await Customization.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } else if (req.method === 'DELETE') {
    await Customization.findByIdAndDelete(id);
    res.status(204).end();
  }
}