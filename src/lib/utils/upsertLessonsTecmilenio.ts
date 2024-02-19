import { ILesson } from 'src/models/lesson';
import { GET_LESSONS_BY_COURSE_AND_MODULE } from '../graphql/queries/lessons/getLessonsByCourseAndModule';
import graphqlClientLernit from '../graphql/client';
import { ICourse } from 'src/models/course';
import { IModule } from 'src/models/module';
import { UPDATE_LESSON_BY_ID } from '../graphql/mutations/lessons/updateLesson';
import { IQuestion } from 'src/models/question';
import { GET_QUESTIONS_PER_LESSON } from '../graphql/queries/questions/getQuestionsPerLesson';
import { UPDATE_QUESTION_PER_ID } from '../graphql/mutations/questions/updateQuestion';
import { makeIdFb } from './makeIdFb';
import { INSERT_NEW_QUESTION } from '../graphql/mutations/questions/insertNewQuestion';
import { DELETING_QUESTION_PER_ID } from '../graphql/mutations/questions/deletingQuestion';
import { INSERT_NEW_LESSON } from '../graphql/mutations/lessons/insertNewLesson';

export const upsertLessonsTecmilenioForExistenModule = async (
  course: ICourse,
  f: ICourse,
  mcb: IModule,
  mMP: IModule,
) => {
  const { lessons: lessonsModule }: { lessons: ILesson[] } =
    await graphqlClientLernit.request(GET_LESSONS_BY_COURSE_AND_MODULE, {
      courseId: course.course_fb,
      moduleId: mcb.module_fb,
    });
  const { lessons: lessonsCourseMP }: { lessons: ILesson[] } =
    await graphqlClientLernit.request(GET_LESSONS_BY_COURSE_AND_MODULE, {
      courseId: f.course_fb,
      moduleId: mMP.module_fb,
    });

  for (const lessonBase of lessonsModule) {
    console.log(`\n----- Updating lesson ${lessonBase.name}`);

    if (lessonBase.name === 'Foro general del curso') continue;
    const lMP = lessonsCourseMP.find(
      (lcmp) =>
        lcmp.name === lessonBase.name &&
        lcmp.description === lessonBase.description,
    );
    if (lMP) {
      console.log(`!!!!!! Lesson found`);
      const newLessonData = { ...lessonBase };
      delete newLessonData.course_fb;
      delete newLessonData.lesson_fb;
      delete newLessonData.module_id;
      delete newLessonData.client_id;
      await graphqlClientLernit.request(UPDATE_LESSON_BY_ID, {
        lessonId: lMP.lesson_fb,
        newInfo: {
          ...newLessonData,
          module_id: mMP.module_fb,
          deleted_at: lessonBase.is_deleted ? new Date().toISOString() : null,
        },
      });

      // Updating Questions per lesson
      const { questions: questionsBase }: { questions: IQuestion[] } =
        await graphqlClientLernit.request(GET_QUESTIONS_PER_LESSON, {
          lessonId: lessonBase.lesson_fb,
        });

      const { questions: questionsMP }: { questions: IQuestion[] } =
        await graphqlClientLernit.request(GET_QUESTIONS_PER_LESSON, {
          lessonId: lMP.lesson_fb,
        });
      if (questionsBase.length) {
        for (const qBase of questionsBase) {
          const qMP = questionsMP.find((qmp) => qmp.text === qBase.text);
          if (qMP) {
            delete qBase.lesson_fb;
            delete qBase.question_fb;
            await graphqlClientLernit.request(UPDATE_QUESTION_PER_ID, {
              questionId: qMP.question_fb,
              questionInfo: { ...qBase },
            });
          } else {
            const newQuestionId = makeIdFb();
            await graphqlClientLernit.request(INSERT_NEW_QUESTION, {
              questionInfo: {
                ...qBase,
                lesson_fb: lMP.lesson_fb,
                question_fb: newQuestionId,
              },
            });
          }
        }
        // Deleting question that not were found
        const { questions: questionsMPUpdated }: { questions: IQuestion[] } =
          await graphqlClientLernit.request(GET_QUESTIONS_PER_LESSON, {
            lessonId: lMP.lesson_fb,
          });
        for (const q of questionsMPUpdated) {
          const qf = questionsBase.find((qB) => qB.text === q.text);
          if (!qf)
            await graphqlClientLernit.request(DELETING_QUESTION_PER_ID, {
              questionId: q.question_fb,
            });
        }
      }
    } else {
      console.log(`!!!!!! Lesson not found`);
      const newId = makeIdFb();
      await graphqlClientLernit.request(INSERT_NEW_LESSON, {
        lessonInfo: {
          ...lessonBase,
          course_fb: f.course_fb,
          lesson_fb: newId,
          module_id: mMP.module_fb,
          client_id: 'content',
        },
      });
      const { questions: questionsBase }: { questions: IQuestion[] } =
        await graphqlClientLernit.request(GET_QUESTIONS_PER_LESSON, {
          lessonId: lessonBase.lesson_fb,
        });
      if (questionsBase.length) {
        for (const qBase of questionsBase) {
          console.log(`------ Updating question`);
          const newQuestionId = makeIdFb();
          await graphqlClientLernit.request(INSERT_NEW_QUESTION, {
            questionInfo: {
              ...qBase,
              lesson_fb: newId,
              question_fb: newQuestionId,
            },
          });
        }
      }
    }
  }
};
