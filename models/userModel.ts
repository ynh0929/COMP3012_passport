interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

const database: User [] = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    role: 'user',
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    role: 'user',
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    role: 'admin',
  },
];

const userModel = {

  /* FIX ME (types) 😭 */
  findOne: (email: string): User | null => {
    const user = database.find((user) => user.email === email);
    if (user) {
      return user;
    }
    return null;
  },
  /* FIX ME (types) 😭 */
  findById: (id: number) => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },

  create: (user: Omit<User, 'id'>): User => {
    const newUser = {
      id: database.length + 1,
      ...user,
    };
    database.push(newUser);
    return newUser;
  }
};

export { database, userModel, User };
