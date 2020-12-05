import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { Repository, Transaction, TransactionRepository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import Executor from "../entity/Executor";
import Task from "../entity/Task";

import {
  PaginationOptions,
  StatusHandler,
  TaskStatus,
  ExecutorStatus,
} from "../graphql/Common";
import { TaskCreateInput, TaskUpdateInput } from "../graphql/Task";

import { RESPONSE_INDICATOR } from "../utils/constants";

@Resolver((of) => Task)
export default class TaskResolver {
  constructor(
    @InjectRepository(Executor)
    private readonly executorRepository: Repository<Executor>,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>
  ) {}

  @Query(() => TaskStatus)
  async Tasks(
    @Arg("pagination", { nullable: true })
    pagination: PaginationOptions
  ): Promise<TaskStatus> {
    try {
      const { cursor, offset } = pagination ?? { cursor: 0, offset: 20 };
      const res = await this.taskRepository.find({
        skip: cursor,
        take: offset,
        relations: ["assignee", "taskSubstance"],
      });
      return new StatusHandler(true, RESPONSE_INDICATOR.SUCCESS, res);
    } catch (error) {
      return new StatusHandler(false, JSON.stringify(error), []);
    }
  }

  @Query(() => TaskStatus)
  async QueryTaskByID(@Arg("taskId") taskId: number): Promise<TaskStatus> {
    try {
      const res = await this.taskRepository.findOne({
        where: {
          taskId,
        },
        relations: ["assignee"],
      });

      return new StatusHandler(true, RESPONSE_INDICATOR.SUCCESS, [res] ?? []);
    } catch (error) {
      return new StatusHandler(false, JSON.stringify(error), []);
    }
  }

  @Query(() => ExecutorStatus)
  async QueryTaskAssignee(
    @Arg("taskId") taskId: number
  ): Promise<ExecutorStatus> {
    try {
      const res = await this.taskRepository.findOne({
        where: {
          taskId,
        },
        relations: ["assignee"],
      });

      return new StatusHandler(
        true,
        RESPONSE_INDICATOR.SUCCESS,
        res ? [res.assignee] : []
      );
    } catch (error) {
      return new StatusHandler(false, JSON.stringify(error), []);
    }
  }

  @Query(() => TaskStatus)
  async QueryExecutorTasks(@Arg("uid") uid: number) {
    try {
      const res = await this.taskRepository.find({
        where: {
          assignee: {
            uid,
          },
        },
      });
      return new StatusHandler(true, RESPONSE_INDICATOR.SUCCESS, res);
    } catch (error) {
      return new StatusHandler(false, JSON.stringify(error), []);
    }
  }

  @Transaction()
  @Mutation(() => TaskStatus)
  async ToggleTaskStatus(
    @Arg("taskId") taskId: number,
    @TransactionRepository(Task) taskTransRepo: Repository<Task>
  ): Promise<TaskStatus> {
    try {
      const origin = await taskTransRepo.findOne({ where: { taskId } });

      if (!origin)
        return new StatusHandler(false, RESPONSE_INDICATOR.NOT_FOUND, []);

      const updateRes = await taskTransRepo.update(taskId, {
        taskAccmplished: !origin.taskAccmplished,
      });

      const updatedItem = await taskTransRepo.findOne({
        where: { taskId },
      });

      return new StatusHandler(true, RESPONSE_INDICATOR.SUCCESS, [updatedItem]);
    } catch (error) {
      return new StatusHandler(false, JSON.stringify(error), []);
    }
  }

  @Transaction()
  @Mutation(() => TaskStatus)
  async DeleteTask(
    @Arg("taskId") taskId: number,
    @TransactionRepository(Task) taskTransRepo: Repository<Task>
  ): Promise<TaskStatus> {
    try {
      const res = await taskTransRepo.findOne({
        where: {
          taskId,
        },
      });

      if (!res) {
        return new StatusHandler(false, RESPONSE_INDICATOR.NOT_FOUND, []);
      }

      await taskTransRepo.delete(taskId);

      return new StatusHandler(true, RESPONSE_INDICATOR.SUCCESS, []);
    } catch (error) {
      return new StatusHandler(false, JSON.stringify(error), []);
    }
  }

  @Transaction()
  @Mutation(() => TaskStatus)
  async CreateNewTask(
    @Arg("taskCreateParam") param: TaskCreateInput,
    @TransactionRepository(Task)
    taskTransRepo: Repository<Task>
  ): Promise<TaskStatus> {
    try {
      const res = await taskTransRepo.save(param);
      return new StatusHandler(true, RESPONSE_INDICATOR.SUCCESS, [res]);
    } catch (error) {
      return new StatusHandler(false, JSON.stringify(error), []);
    }
  }

  @Transaction()
  @Mutation(() => TaskStatus)
  async UpdateTaskInfo(
    @Arg("taskUpdateParam") param: TaskUpdateInput,
    @TransactionRepository(Task)
    taskTransRepo: Repository<Task>
  ): Promise<TaskStatus> {
    try {
      const res = await taskTransRepo.update(param.taskId, param);
      return new StatusHandler(true, RESPONSE_INDICATOR.SUCCESS, [res]);
    } catch (error) {
      return new StatusHandler(false, JSON.stringify(error), []);
    }
  }

  @Transaction()
  @Mutation(() => TaskStatus)
  async AssignTask(
    @Arg("taskId") taskId: string,
    @Arg("uid") uid: string,
    @TransactionRepository(Task)
    taskTransRepo: Repository<Task>
  ): Promise<TaskStatus> {
    try {
      const assignee = await this.executorRepository.findOne({ uid });
      if (!assignee) {
        return new StatusHandler(false, RESPONSE_INDICATOR.NOT_FOUND, []);
      }
      const task = await this.taskRepository.findOne(
        {
          taskId,
        },
        {
          relations: ["assignee"],
        }
      );
      if (task?.assignee) {
        return new StatusHandler(false, RESPONSE_INDICATOR.EXISTED, [task]);
      }

      task!.assignee = assignee;

      const assignRes = await taskTransRepo.save(task!);
      return new StatusHandler(true, RESPONSE_INDICATOR.SUCCESS, [assignRes]);
    } catch (error) {
      return new StatusHandler(false, JSON.stringify(error), []);
    }
  }
}
