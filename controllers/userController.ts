import {userModel} from "../models/userModel";
import {User} from "../models/userModel";

const getUserByEmailIdAndPassword = (email: string, password: string):  { user: User | null, error: string | null } => {
  let user = userModel.findOne(email);
  if (!user) {
    return { user: null, error: `Couldn't find user with email: ${email}`};
  }
  if (!isUserValid(user, password)) {
    return { user: null, error: "Password is incorrect" };
  }
  return { user, error: null };
};
const getUserById = (id:number): User | null => {
  let user = userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

function isUserValid(user: any, password: string): boolean {
  return user.password === password;
}

export {
  getUserByEmailIdAndPassword,
  getUserById
};
