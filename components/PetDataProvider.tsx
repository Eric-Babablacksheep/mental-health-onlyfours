import { baseMaxFullness, baseMaxHappiness } from "@/constants/Pet";
import z from "zod";
import createPersistentData from "./PersistentDataProvider";

const schema = z.object({
  experience: z.number(),
  fullness: z.number(),
  happiness: z.number(),
});

type PetData = z.infer<typeof schema>;

const initialData = {
  experience: 0,
  fullness: baseMaxFullness,
  happiness: baseMaxHappiness,
} as PetData;

const [PetDataProvider, context] = createPersistentData({
  schema,
  initialData,
  key: "petData",
});

export const PetDataContext = context;
export default PetDataProvider;
