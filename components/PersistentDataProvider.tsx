import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  PropsWithChildren,
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
      const [value, setValue] = useMandatoryState(initialData);

      useEffect(() => {
        const load = async () => {
          setValue(
            schema
              .nullish()
              .parse(JSON.parse((await AsyncStorage.getItem(key)) ?? "null")) ??
              initialData
          );
        };
        load();
      }, []);

      useEffect(() => {
        AsyncStorage.setItem(key, JSON.stringify(value));
      }, [value]);

      return (
        <context.Provider
          value={[value, setValue] as PersistentData<typeof initialData>}
        >
          {children}
        </context.Provider>
      );
    },
    context,
  ] as const;
}
