import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import {
  buildSchema,
  Resolver,
  Query,
  Field,
  ID,
  ObjectType,
  InputType,
} from "type-graphql";
import cors from "cors";

@ObjectType()
class Recipe {
  @Field((type) => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  creationDate?: Date;

  @Field((type) => [String])
  ingredients!: string[];
}

@Resolver(Recipe)
class RecipeResolver {
  private recipesCollection: Recipe[] = [
    { id: "1", title: "Fried Rice", ingredients: ["Rice", "Peas", "Egg"] },
  ];

  @Query(() => String)
  async hello() {
    return this.recipesCollection[0].id;
  }
}

// @InputType({ description: "New recipe data" })
// class AddRecipeInput implements Partial<Recipe> {
//   @Field()
//   title: string;

//   @Field({ nullable: true })
//   description?: string;
// }

const main = async () => {
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
  });

  const apolloServer = new ApolloServer({ schema });

  const app = express();
  app.use(cors());

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server Started on http://localhost:4000/graphql");
  });
};

main();
