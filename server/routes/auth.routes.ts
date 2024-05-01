import express, { Router, Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authRouter: Router = express.Router();

authRouter.post(
	'/registration',
	[
		check('email', 'Incorrect email').isEmail(),
		check(
			'password',
			'Password must be longer than 3 and shorter than 12'
		).isLength({ min: 3, max: 12 }),
	],
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res
					.status(400)
					.json({ message: 'Incorrect request', errors });
			}

			const { email, password } = req.body;
			const candidate = await User.findOne({ email });

			if (candidate) {
				return res.status(400).json({
					message: `User with email ${email} alredy exist!`,
				});
			}

			const hashPassword = await bcrypt.hash(password, 15);
			const user = new User({ email, password: hashPassword });
			await user.save();

			return res.json({ message: 'User was created' });
		} catch (error) {
			console.log(error);
			res.send({ message: 'Server error' });
		}
	}
);

authRouter.post('/login', async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({
				message: `User with email "${email}" not found! Please, register user!`,
			});
		}

		const isPassValid = bcrypt.compareSync(
			password,
			user.password as string
		);

		if (!isPassValid) {
			return res.status(400).json({
				message: `Password for user "${email}" not correct!`,
			});
		}

		const token = jwt.sign(
			{ id: user.id },
			`${process.env.SECRET_KEY}`,
			{
				expiresIn: '1h',
			}
		);
	} catch (error) {
		console.log(error);
		res.send({ message: 'Server error' });
	}
});

export default authRouter;