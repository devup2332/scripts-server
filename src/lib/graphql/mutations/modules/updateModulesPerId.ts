import { gql } from 'graphql-request';

export const UPDATE_MODULE_PER_ID = gql`
  mutation UPDATE_MODULE_PER_ID(
    $moduleFb: String
    $moduleInfo: module_cl_set_input!
  ) {
    update_module_cl(
      where: { module_fb: { _eq: $moduleFb } }
      _set: $moduleInfo
    ) {
      affected_rows
    }
  }
`;
