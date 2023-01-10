// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config();

const connection = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
}

const knexConfig = {
  development: {
    client: 'pg',
    useNullAsDefault: true,
    connection
  },
  production: {
    client: 'pg',
    useNullAsDefault: true,
    connection
  },
};

export default knexConfig;
