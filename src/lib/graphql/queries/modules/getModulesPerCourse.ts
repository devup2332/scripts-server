import { gql } from 'graphql-request';
import { FRAGMENT_MODULE } from '../../fragments/module';

export const GET_MODULES_PER_COURSE = gql`
  query GET_MODULES_PER_COURSE($courseId: String) {
    modules: module_cl(where: { course_fb: { _eq: $courseId } }) {
      ...moduleInfo
    }
  }
  ${FRAGMENT_MODULE}
`;
