import { ClientSession } from "mongoose";
import UserSchema, { User } from "./../models/user";

// export const addData: (
//     userBody: User,
//     session: ClientSession
// ) => Promise<User> = (userBody, session) => {
//     return UserSchema.create([userBody], { session: session });
// };

// export const addData: (
//     userBody: User,
//     session: ClientSession
// ) => Promise<User> = async (userBody, session) => {
//     const [createdUser]: [User] = await UserSchema.create([userBody], {
//         session: session,
//     });
//     return createdUser;
// };
export const addUser: (
    userBody: User,
    session: ClientSession
) => Promise<User> = async (userBody, session) => {
    const users: User[] = await UserSchema.create([userBody], {
        session: session,
    });
    const createdUser: User = users[0]; // Retrieve the first user from the array
    return Promise.resolve(createdUser);
};
