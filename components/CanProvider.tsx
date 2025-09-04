import z from "zod";
import createPersistentData from "./PersistentDataProvider";

const [CanProvider, context] = createPersistentData({
  schema: z.number(),
  initialData: 0,
  key: "can",
});

export const CanContext = context;
export default CanProvider;
