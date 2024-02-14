import { gql } from 'graphql-request';
import { FRAGMENT_MODULE } from '../../fragments/module';

export const INSERT_NEW_MODULE = gql`
  mutation INSERT_NEW_MODULE($moduleInfo: module_cl_insert_input!) {
    module: insert_module_cl_one(
      object: $moduleInfo
      on_conflict: {
        constraint: module_cl_pkey
        update_columns: [name, description, index]
      }
    ) {
      ...moduleInfo
    }
  }
  ${FRAGMENT_MODULE}
`;
