import { config } from 'dotenv';
config();
export const environments = {
  PORT: process.env.PORT || 80,
  GRAPHQL_BACKEND_URI: process.env.GRAPHQL_BACKEND_URI || '',
  GRAPHQL_BACKEND_SECRET: process.env.GRAPHQL_BACKEND_SECRET || '',
  VOLDEMORT_API: process.env.VOLDEMORT_API || '',
  TOKEN_VOLDEMORT: process.env.TOKEN_VOLDEMORT || '',
};
