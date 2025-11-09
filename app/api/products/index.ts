import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/dbConnect';
import productModel from '@/models/product.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  if (req.method === 'GET') {
    const products = await productModel.find();
    res.json(products);
  } else if (req.method === 'POST') {
    const product = await productModel.create(req.body);
    res.status(201).json(product);
  }
}