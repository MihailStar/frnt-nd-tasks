import { FromSchema } from 'json-schema-to-ts';

import userSchema from '../schemas/user.schema';

type User = FromSchema<typeof userSchema>;

const users: Array<User> = [
  {
    id: '75ug_iKxTm8Z661dPimPF',
    name: 'Джон Китаец',
    email: 'mail@mail.mail',
    password: '750def46d74f39225fd824a6483f6dff',
  },
  {
    id: 'K6QJsNHDxfTrKPFGutGNL',
    name: 'John Chinaman',
    email: 'email@email.email',
    password: '15fc59e600347f9b4d342cc2badf21b5',
  },
];

const Users = {
  async getByEmail(email: User['email']): Promise<User | null> {
    const user = users.find((u) => u.email === email);

    return user === undefined ? null : { ...user };
  },
};

export default Users;
export { User };
