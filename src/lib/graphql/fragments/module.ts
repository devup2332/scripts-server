import { gql } from 'graphql-request';

export const FRAGMENT_MODULE = gql`
  fragment moduleInfo on module_cl {
    course_fb
    created_at
    deleted
    deleted_at
    description
    index
    module_fb
    name
    updated_at
    accreditation
  }
`;
