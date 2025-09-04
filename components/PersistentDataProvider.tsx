import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  PropsWithChildren,
  use,
  useEffect,
  useState,
} from "react";
import z from "zod";

export interface CreatePersistentDataParameters<SchemaType extends z.ZodType> {
  schema: SchemaType;
  initialData: z.infer<SchemaType>;
  key: string;
}

function useMandatoryState<DataType>(initialData: DataType) {
  return useState<DataType>(initialData);
}
type PersistentData<DataType> = ReturnType<typeof useMandatoryState<DataType>>;

export default function createPersistentData<SchemaType extends z.ZodType>({
  schema,
  initialData,
  key,
}: CreatePersistentDataParameters<SchemaType>) {
  const context = createContext<PersistentData<typeof initialData>>([
    initialData,
    (_) => {},
  ]);

  return [
    ({ children }: PropsWithChildren) => {
      const stored =
        schema
          .nullable()
          .parse(JSON.parse(use(AsyncStorage.getItem(key)) ?? "")) ??
        initialData;
      const [data, setData] = useMandatoryState(stored);

      useEffect(() => {
        AsyncStorage.setItem(key, JSON.stringify(data));
      }, [data]);

      return (
        <context.Provider
          value={[data, setData] as PersistentData<typeof initialData>}
        >
          {children}
        </context.Provider>
      );
    },
    context,
  ] as const;
}
