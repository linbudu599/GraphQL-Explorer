import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import * as TypeORM from "typeorm";

import UserResolver from "../resolver/User";
import User from "../entity/User";
import { log } from "./";

TypeORM.useContainer(Container);

export default async (): Promise<ApolloServer> => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    container: Container,
  });

  await dbConnect();

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const context = {
        req,
      };
      return context;
    },
    tracing: true,
    engine: true,
  });

  return server;
};

export const dbConnect = async (): Promise<any> => {
  log("=== TypeORM Connecting ===");
  try {
    const connection = await TypeORM.createConnection();
    log("=== Database Connection Established ===");
    await connection.manager.insert(User, {
      name: "林不渡1",
      age: 21,
      isFool: true,
    });
    await connection.manager.insert(User, {
      name: "林不渡2",
      age: 21,
      isFool: true,
    });
    await connection.manager.insert(User, {
      name: "林不渡3",
      age: 21,
      isFool: true,
    });
  } catch (error) {
    log(error, "red");
  }
};
