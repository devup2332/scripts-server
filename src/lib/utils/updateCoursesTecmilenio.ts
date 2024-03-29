import { ICourse } from 'src/models/course';
import graphqlClientLernit from '../graphql/client';
import { GET_INFO_COURSES_BY_INSTANCE } from '../graphql/queries/courses/getInfoCoursesByInstance';
import { GET_COURSES_TECMILENIO_IN_MP } from '../graphql/queries/courses/getCoursesTecmilenioInMP';
import { UPDATE_COURSE_INFO } from '../graphql/mutations/courses/update_courses_cl';
import { sleep } from './methods/sleep';
import { GET_LESSONS_BY_COURSE } from '../graphql/queries/lessons/getLessonsByCourse';
import { ILesson } from 'src/models/lesson';
import { GET_MODULES_PER_COURSE } from '../graphql/queries/modules/getModulesPerCourse';
import { IModule } from 'src/models/module';
import { UPDATE_MODULE_PER_ID } from '../graphql/mutations/modules/updateModulesPerId';
import { makeIdFb } from './methods/makeIdFb';
import { INSERT_NEW_MODULE } from '../graphql/mutations/modules/insetNewModule';
import { upsertLessonsTecmilenioForExistenModule } from './upsertLessonsTecmilenio';

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
  console.log({ courses: coursesMP.length });

  for (const course of coursesToUpdate) {
    const { ...allData } = course;
    const f = coursesMP.find((c) => c.name === course.name);

    console.log(
      `====> ${index + 1}.- Actualizando curso ${course.name} - Tec : ${course.course_fb} , Content : ${index + 1} of ${coursesToUpdate.length}`,
    );
    delete allData.name;
    delete allData.course_fb;
    delete allData.origin;
    delete allData.client_id;

    await graphqlClientLernit.request(UPDATE_COURSE_INFO, {
      courseId: f.course_fb,
      newInfo: allData,
    });

    console.log(`=> Getting Modules - ${course.course_fb}`);
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
      console.log(`=> Updating or creating module ${mcb.name}`);
      const mMP = modulesCourseMP.find(
        (mcmp) =>
          mcmp.name === mcb.name && mcmp.description === mcb.description,
      );
      if (mMP) {
        console.log(`==> Module found`);
        const copyModule = { ...mcb };
        delete copyModule.course_fb;
        delete copyModule.module_fb;
        delete copyModule.updated_at;
        await graphqlClientLernit.request(UPDATE_MODULE_PER_ID, {
          moduleFb: mMP.module_fb,
          moduleInfo: {
            ...copyModule,
            deleted_at: copyModule.deleted ? new Date().toISOString() : null,
          },
        });
        console.log('`CREATING OR UPDATING LESSONS`');
        await upsertLessonsTecmilenioForExistenModule(course, f, mcb, mMP);
      } else {
        console.log(`==> Module not found`);
        const newId = makeIdFb();
        const { module }: { module: IModule } =
          await graphqlClientLernit.request(INSERT_NEW_MODULE, {
            moduleInfo: { ...mcb, module_fb: newId, course_fb: f.course_fb },
          });
        console.log('`CREATING OR UPDATING LESSONS`');
        await upsertLessonsTecmilenioForExistenModule(course, f, mcb, module);
      }
    }

    //Deleting modules that not were found in MP course

    console.log(`DELETING MODULES NOT FOUND IN MP COURSE`);
    const { modules: modulesBase2 }: { modules: IModule[] } =
      await graphqlClientLernit.request(GET_MODULES_PER_COURSE, {
        courseId: course.course_fb,
      });

    const { modules: modulesCourseMP2 }: { modules: IModule[] } =
      await graphqlClientLernit.request(GET_MODULES_PER_COURSE, {
        courseId: f.course_fb,
      });
    const modulesNotFound = modulesCourseMP2.filter((mb) => {
      const m = modulesBase2.find(
        (mcmp) => mcmp.name === mb.name && mcmp.description === mb.description,
      );
      return !m;
    });
    for (const mNotFound of modulesNotFound) {
      console.log(`==> Delelting module ${mNotFound.name}`);
      await graphqlClientLernit.request(UPDATE_MODULE_PER_ID, {
        moduleFb: mNotFound.module_fb,
        moduleInfo: {
          deleted: true,
          deleted_at: new Date().toISOString(),
        },
      });
    }
    console.log(`====> Done`);

    index++;
    await sleep(500);
  }
};
