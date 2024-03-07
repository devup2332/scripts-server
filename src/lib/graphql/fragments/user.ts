import { gql } from 'graphql-request';

export const FRAGMENT_USER = gql`
  fragment userInfo on users_cl {
    full_name
    client_id
    email
    user_fb
    first_name
    last_name
    curp
    additional_info_json
  }
`;
