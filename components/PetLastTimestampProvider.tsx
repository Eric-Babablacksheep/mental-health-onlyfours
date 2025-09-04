import z from "zod";
import createPersistentData from "./PersistentDataProvider";

const [PetLastTimestampProvider, context] = createPersistentData({
  schema: z.number(),
  initialData: Date.now(),
  key: "petLastTimestamp",
});

export const PetLastTimestampContext = context;
export default PetLastTimestampProvider;
