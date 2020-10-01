import { plainToClass } from "class-transformer";
import { Difficulty, Cook, Recipe } from "../graphql/Recipe";

const createCook = (cookData: Partial<Cook>): Cook =>
  plainToClass(Cook, cookData);

const createRecipe = (recipeData: Partial<Recipe>): Recipe =>
  plainToClass(Recipe, recipeData);

export const sampleCooks = [
  createCook({
    name: "Gordon Ramsay",
    yearsOfExperience: 21,
  }),
  createCook({
    name: "Kim Kardashian",
    yearsOfExperience: 1,
  }),
];

export const sampleRecipes = [
  createRecipe({
    title: "Recipe 1",
    description: "Desc 1",
    preparationDifficulty: Difficulty.Easy,
    ingredients: ["one", "two", "three"],
    cook: sampleCooks[1],
  }),
  createRecipe({
    title: "Recipe 2",
    description: "Desc 2",
    preparationDifficulty: Difficulty.Easy,
    ingredients: ["four", "five", "six"],
    cook: sampleCooks[0],
  }),
  createRecipe({
    title: "Recipe 3",
    preparationDifficulty: Difficulty.Beginner,
    ingredients: ["seven", "eight", "nine"],
    cook: sampleCooks[1],
  }),
  createRecipe({
    title: "Recipe 4",
    description: "Desc 4",
    preparationDifficulty: Difficulty.MasterChef,
    ingredients: ["ten", "eleven", "twelve"],
    cook: sampleCooks[0],
  }),
  createRecipe({
    title: "Recipe 5",
    preparationDifficulty: Difficulty.Hard,
    ingredients: ["thirteen", "fourteen", "fifteen"],
    cook: sampleCooks[0],
  }),
];
