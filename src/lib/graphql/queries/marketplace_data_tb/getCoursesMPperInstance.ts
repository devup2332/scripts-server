import { gql } from 'graphql-request';
import { FRAGMENT_COURSE } from '../../fragments/course';
import { FRAGMENT_MARKETPLACE_DATA_TB } from '../../fragments/marketplace_data_tb';

export const GET_COURSES_MP_PER_INSTANCE = gql`
  query GET_COURSES_MP_PER_INSTANCE($clientId: String) {
    courses: marketplace_data_tb(
      where: {
        client_fb: { _eq: $clientId }
        courses_cl: { origin: { _eq: "tecmilenio" } }
      }
    ) {
      ...mpDataTbInfo
      courses_cl {
        ...courseInfo
      }
    }
  }
  ${FRAGMENT_MARKETPLACE_DATA_TB}
  ${FRAGMENT_COURSE}
`;
