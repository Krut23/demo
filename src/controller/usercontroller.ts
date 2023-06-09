import { Request, Response } from 'express';
import User from '../model/user';

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, gender, mobilenumber,address } = req.body;
        const user = await User.create({ name, gender, mobilenumber,address });
        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }

export default {createUser};