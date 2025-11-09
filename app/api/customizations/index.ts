import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Customization from '../../../models/Customization';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method === 'GET') {
    const customizations = await Customization.find();
    res.json(customizations);
  } else if (req.method === 'POST') {
    const customization = await Customization.create(req.body);
    res.status(201).json(customization);
  }
}