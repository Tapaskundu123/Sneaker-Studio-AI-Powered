import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/dbConnect';
import { Product } from '@/models/product.model';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    const product = await Product.findById(id);
    res.json(product);
  } else if (req.method === 'PUT') {
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } else if (req.method === 'DELETE') {
    await Product.findByIdAndDelete(id);
    res.status(204).end();
  }
}