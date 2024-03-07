import { gql } from 'graphql-request';
import { FRAGMENT_USER } from '../../fragments/user';
import { FRAGMENT_STUDENT } from '../../fragments/user_course_cl';
import { FRAGMENT_MODULE } from '../../fragments/module';
import { FRAGMENT_COURSE } from '../../fragments/course';

export const GET_STUDENTS_PER_COURSE_AND_DATE = gql`
  query GET_STUDENTS_PER_COURSE_AND_DATE(
    $clientId: String
    $dateStart: timestamptz
    $dateEnd: timestamptz
  ) {
    students: user_course_cl(
      where: {
        user: { client_id: { _eq: $clientId } }
        completed_at: { _lte: $dateEnd, _gte: $dateStart }
      }
    ) {
      ...studentInfo
      user {
        ...userInfo
        client {
          name
        }
        business_name {
          shcp
          name
          boss_name
          boss_name_workers
          instructor {
            full_name
          }
        }
        user_ou {
          name
        }
        additional_info_json
        user_role {
          name
        }
      }
      course {
        ...courseInfo
        modules {
          ...modulesInfo
        }
      }
    }
  }
  ${FRAGMENT_STUDENT}
  ${FRAGMENT_USER}
  ${FRAGMENT_COURSE}
  ${FRAGMENT_MODULE}
`;
