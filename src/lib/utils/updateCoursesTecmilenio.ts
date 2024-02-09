import { ICourse } from 'src/models/course';
import graphqlClientLernit from '../graphql/client';
import { GET_INFO_COURSES_BY_INSTANCE } from '../graphql/queries/courses/getInfoCoursesByInstance';
import { GET_COURSES_TECMILENIO_IN_MP } from '../graphql/queries/courses/getCoursesTecmilenioInMP';
import { UPDATE_COURSE_INFO } from '../graphql/mutations/courses/update_courses_cl';
import { sleep } from './sleep';
import { GET_LESSONS_BY_COURSE } from '../graphql/queries/lessons/getLessonsByCourse';
import { ILesson } from 'src/models/lesson';
import { GET_MODULES_PER_COURSE } from '../graphql/queries/modules/getModulesPerCourse';
import { IModule } from 'src/models/module';
import { UPDATE_MODULE_PER_ID } from '../graphql/mutations/modules/updateModulesPerId';
import { makeIdFb } from './makeIdFb';
import { UPDATE_LESSON_BY_ID } from '../graphql/mutations/lessons/updateLesson';
import { INSERT_NEW_MODULE } from '../graphql/mutations/modules/insetNewModule';
import { INSERT_NEW_LESSON } from '../graphql/mutations/lessons/insertNewLesson';
import { GET_QUESTIONS_PER_LESSON } from '../graphql/queries/questions/getQuestionsPerLesson';
import { IQuestion } from 'src/models/question';

export const updateCoursesTecmilenio = async () => {
  console.log(`=====> Getting Initial Data`);
  const { courses }: { courses: ICourse[] } = await graphqlClientLernit.request(
    GET_INFO_COURSES_BY_INSTANCE,
    {
      clientId: 'tecmilenio',
    },
  );
  const { courses: coursesMP }: { courses: ICourse[] } =
    await graphqlClientLernit.request(GET_COURSES_TECMILENIO_IN_MP);

  const coursesToUpdate = courses.filter((c) => {
    const f = coursesMP.filter((ct) => ct.name === c.name);
    return f.length === 1;
  });
  console.log(`====> Courses to update ${coursesToUpdate.length}`);

  let index = 0;

  for (const course of coursesToUpdate) {
    const { ...allData } = course;
    const f = coursesMP.find((c) => c.name === course.name);

    console.log(
      `====> ${index}.- Actualizando curso ${course.name} - Tec : ${course.course_fb} , Content : ${index + 1} of ${coursesToUpdate.length}`,
    );
    delete allData.name;
    delete allData.course_fb;
    delete allData.origin;
    delete allData.client_id;

    const response = await graphqlClientLernit.request(UPDATE_COURSE_INFO, {
      courseId: course,
      newInfo: allData,
    });
    console.log(`====> Getting lessons`);
    const { lessons: lessonsBase }: { lessons: ILesson[] } =
      await graphqlClientLernit.request(GET_LESSONS_BY_COURSE, {
        courseId: course.course_fb,
      });
    const courseMP = coursesMP.find((c) => c.name === course.name);
    const { lessons: lessonsCourseMP }: { lessons: ILesson[] } =
      await graphqlClientLernit.request(GET_LESSONS_BY_COURSE, {
        courseId: courseMP.course_fb,
      });

    console.log(`===> Getting Modules`);
    const { modules: modulesBase }: { modules: IModule[] } =
      await graphqlClientLernit.request(GET_MODULES_PER_COURSE, {
        courseId: course.course_fb,
      });

    const { modules: modulesCourseMP }: { modules: IModule[] } =
      await graphqlClientLernit.request(GET_MODULES_PER_COURSE, {
        courseId: f.course_fb,
      });

    // Updating or craeting Modules
    for (const mcb of modulesBase) {
      const mMP = modulesCourseMP.find((mcmp) => mcmp.name === mcb.name);
      if (mMP) {
        delete mcb.course_fb;
        delete mcb.module_fb;
        await graphqlClientLernit.request(UPDATE_MODULE_PER_ID, {
          moduleFb: mMP.module_fb,
          moduleInfo: {
            ...mcb,
            deleted_at: mcb.deleted ? new Date().toISOString() : null,
          },
        });
      } else {
        const newId = makeIdFb();
        await graphqlClientLernit.request(INSERT_NEW_MODULE, {
          moduleInfo: { ...mcb, module_fb: newId, course_fb: f.course_fb },
        });
      }
    }
    // Getting again modules recently created or updated
    const { modules: modulesRecentlyCreated }: { modules: IModule[] } =
      await graphqlClientLernit.request(GET_MODULES_PER_COURSE, {
        courseId: f.course_fb,
      });

    // Updating or creating Lessons
    for (const lessonBase of lessonsBase) {
      const lMP = lessonsCourseMP.find((lcmp) => lcmp.name === lessonBase.name);
      const mBase = modulesBase.find(
        (mb) => mb.module_fb === lessonBase.module_id,
      );
      const mFound = modulesRecentlyCreated.find(
        (mcmp) => mcmp.name === mBase.name,
      );
      if (lMP) {
        delete lessonBase.course_fb;
        delete lessonBase.lesson_fb;
        delete lessonBase.module_id;
        delete lessonBase.client_id;
        delete lessonBase.created_at;
        await graphqlClientLernit.request(UPDATE_LESSON_BY_ID, {
          lessonId: lMP.lesson_fb,
          newInfo: {
            ...lessonBase,
            module_id: mFound.module_fb,
            deleted_at: lessonBase.is_deleted ? new Date().toISOString() : null,
          },
        });
        // Updating Questions per lesson
        console.log(`====> Getting Questions`);
        const { questions: questionsBase }: { questions: IQuestion[] } =
          await graphqlClientLernit.request(GET_QUESTIONS_PER_LESSON, {
            lessonId: lessonBase.lesson_fb,
          });

        const { questions: questionsMP }: { questions: IQuestion[] } =
          await graphqlClientLernit.request(GET_QUESTIONS_PER_LESSON, {
            lessonId: lessonBase.lesson_fb,
          });
        // if (questionsBase.length) {
        // }
      } else {
        const newId = makeIdFb();
        await graphqlClientLernit.request(INSERT_NEW_LESSON, {
          lessonInfo: {
            ...lessonBase,
            course_fb: f.course_fb,
            lesson_fb: newId,
            module_id: mFound.module_fb,
            client_id: 'content',
          },
        });
      }
    }

    console.log(
      `====> Lessons to Update ${lessonsBase.length} ${lessonsCourseMP.length}`,
    );

    index++;
    await sleep(2000);
  }
};
