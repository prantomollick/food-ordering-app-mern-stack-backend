import { NextFunction, Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.json(currentUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something wen wrong!" });
  }
};

const createCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { auth0Id } = req.body;

    const isUser = await User.findOne({ auth0Id });

    if (isUser) {
      return res.status(200).send();
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const updateCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, addressLine1, country, city } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export default {
  createCurrentUser,
  updateCurrentUser,
  getCurrentUser
};
