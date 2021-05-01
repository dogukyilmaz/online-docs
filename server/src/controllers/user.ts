import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import Usr, { BaseUser, User } from "../models/User";

export interface UserResponse {
  success: boolean;
  user?: User | string | null;
  message?: string;
  token?: string;
}

export const loadUser = async (userId: string): Promise<UserResponse> => {
  try {
    const user = await Usr.findById(userId);
    if (!user) return { success: false, user: null, message: "User not found!" };
    return { success: true, user };
  } catch (error) {
    console.log(error);
    return { success: false, user: null, message: "Internal Server Error" };
  }
};

export const register = async (data: BaseUser): Promise<UserResponse> => {
  try {
    const { _id } = await Usr.create({ ...data });
    return { success: true, user: _id };
  } catch (error) {
    console.log(error);
    return { success: false, user: null, message: "Internal Server Error" };
  }
};

export const login = async ({ email, password }: Omit<User, "name">): Promise<UserResponse> => {
  try {
    const user = await Usr.findOne({ email }).select("+password");
    if (user) {
      const match = await compare(password, user.password);
      if (match) {
        const secret = process.env.JWT_SECRET!;
        const token = jwt.sign({ user: user.id }, secret, {
          expiresIn: "1d",
        });
        return { success: true, token };
      }
    }
    return { success: false, user: null, message: "Invalid credentials." };
  } catch (error) {
    console.log(error);
    return { success: false, user: null, message: "Internal Server Error" };
  }
};

// export const updateUser = async (id: string, data: Partial<User>) => {
//   try {
//     const user = await Usr.findByIdAndUpdate(id, { ...data }, { runValidators: true });
//     console.log({ user }, "update");
//   } catch (error) {
//     console.log(error);
//   }
// };
