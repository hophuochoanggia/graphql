import { GraphQLInt, GraphQLString, GraphQLNonNull } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { pathOr, lensPath, set } from "ramda";
import moment from "moment";

import { resolverWithRole } from "../../utils/resolverWithRole";
import { event, config, sequelize } from "../../models";
import { eventType } from "../type";
import { eventInput } from "../input";
import { eventFieldForInput } from "../field";

export const createEvent = mutationWithClientMutationId({
  name: "createEvent",
  inputFields: {
    ...eventFieldForInput
  },
  outputFields: () => ({
    response: {
      type: eventType.nodeType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: (params, { role }) =>
    resolverWithRole("createEvent", role, {}, () =>
      sequelize
        .transaction(transaction => event.create(params, { transaction }))
        .catch(err => {
          throw err;
        })
    )
});

export const finishStudyTask = mutationWithClientMutationId({
  name: "finishStudyTask",
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    taskId: { type: new GraphQLNonNull(GraphQLInt) },
    date: { type: new GraphQLNonNull(GraphQLString) },
    actor: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: () => ({
    response: {
      type: eventType.nodeType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: ({ id, taskId, date, actor }, ctx) =>
    event.findById(id).then(instance =>
      resolverWithRole(
        "finishStudyTask",
        ctx.role,
        {
          targetId: id,
          actorId: ctx.id,
          instance,
          model: "event"
        },
        async () => {
          let newInstance;
          // Load config to get total tasks
          const tasksConfig = (await config.find({ name: "STUDY-TASK" }))
            .dataValues.setting.tasks;

          if (!instance) throw new Error("Can't found event");
          const appointment = pathOr(
            null,
            ["data", "study", "appointment"],
            instance.dataValues
          );

          if (!appointment)
            throw new Error("Please set up appointment date first");

          const tasks = pathOr(
            [],
            ["data", "study", "tasks"],
            instance.dataValues
          );
          const currentTask = pathOr(false, [taskId], tasks);

          if (currentTask) {
            throw new Error("The task has been completed");
          }

          const tasksLens = lensPath(["data", "study", "tasks"]);
          const tasksIndexLens = lensPath(["data", "study", "tasks", taskId]);

          // First task happen before appointment
          if (taskId === 0) {
            if (moment(appointment) < moment(date)) {
              throw new Error("This date is after the appointment");
            } else {
              newInstance = set(
                tasksLens,
                [{ date, actor }],
                instance.dataValues
              );

              return instance.update(newInstance);
            }
          }

          if (taskId === tasksConfig.length - 1) {
            // last task
            const nextToLastTaskDate = pathOr(
              undefined,
              [tasksConfig.lenth - 2, "date"],
              tasks
            );
            if (moment(nextToLastTaskDate) > moment(date)) {
              throw new Error("The date can't not before previous task date");
            }
            if (moment(appointment) > moment(date)) {
              throw new Error("This date is before the appointment");
            }

            const studyDocuments = pathOr(
              [],
              ["data", "study", "files"],
              instance.dataValues
            );

            if (studyDocuments.length === 0) {
              throw new Error(
                "Please upload study document before the task can finish"
              );
            }
            const isPass = pathOr(
              undefined,
              ["data", "study", "isPass"],
              instance.dataValues
            );
            if (isPass === undefined) {
              throw new Error("Please mark the study pass or fail");
            }
            const quality = pathOr(
              undefined,
              ["data", "study", "quality"],
              instance.dataValues
            );
            if (quality === undefined) {
              throw new Error("Please rate the study quality");
            }

            const comment = pathOr(
              undefined,
              ["data", "study", "comment"],
              instance.dataValues
            );
            if (comment === undefined) {
              throw new Error("Please leave a comment on study");
            }
            newInstance = set(
              tasksIndexLens,
              { date, actor },
              instance.dataValues
            );
            newInstance.status = "completed";
            return instance.update(newInstance);
          }

          const prevTask = pathOr(false, [taskId - 1, "date"], tasks);
          if (!prevTask) {
            throw new Error("Please complete previous task");
          }
          const currTask = pathOr(false, [taskId], tasks);
          if (currTask) {
            throw new Error("The task has been updated");
          }
          if (moment(prevTask) > moment(date)) {
            throw new Error("The date can't not before previous task date");
          }

          newInstance = set(
            tasksIndexLens,
            { date, actor },
            instance.dataValues
          );
          return instance.update(newInstance);
        }
      )
    )
});

export const editEventById = mutationWithClientMutationId({
  name: "editEventById",
  inputFields: {
    id: {
      type: GraphQLInt
    },
    data: {
      type: eventInput
    }
  },
  outputFields: () => ({
    response: {
      type: eventType.nodeType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: ({ id, data }, ctx) =>
    event.findById(id).then(instance =>
      resolverWithRole(
        "editEventById",
        ctx.role,
        {
          targetId: id,
          actorId: ctx.id,
          instance,
          model: "event"
        },
        () =>
          sequelize.transaction(transaction =>
            instance.update(data, { transaction })
          )
      )
    )
});
