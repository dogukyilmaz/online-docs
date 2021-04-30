import { compare } from "bcryptjs";
import Usr, { BaseUser, User } from "../models/User";

export interface UserResponse {
  success: boolean;
  user?: User | string | null;
  message?: string;
  token?: string;
}

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
        return { success: true, token: "token=>wqrqrqwrqwrqwrqw" };
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
