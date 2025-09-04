import { CanContext } from "@/components/CanProvider";
import { PetDataContext } from "@/components/PetDataProvider";
import { PetLastTimestampContext } from "@/components/PetLastTimestampProvider";
import { ThemedText } from "@/components/ThemedText";
import {
  baseMaxFullness,
  baseMaxHappiness,
  experienceIncrementPerFeed,
  experienceIncrementPerPet,
  experiencePerLevel,
  fullnessDecrementPerSecond,
  fullnessIncrementPerFeed,
  happinessDecrementPerSecond,
  happinessIncrementPerPet,
  maxFullnessIncrementPerLevel,
  maxHappinessIncrementPerLevel,
  saveIntervalDuration,
} from "@/constants/Pet";
import { useAppState } from "@react-native-community/hooks";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button, StyleSheet } from "react-native";

interface CleanUpData {
  decrementIntervalHandler: number;
  saveIntervalHandler: number;
}

export default function Pet() {
  const appState = useAppState();
  const [cleanUpData, setCleanUpData] = useState<CleanUpData | null>(null);
  const [decrementTick, setDecrementTick] = useState<number | null>(null);
  const [saveTick, setSaveTick] = useState<number | null>(null);
  const [can, setCan] = useContext(CanContext);
  const [petData, setPetData] = useContext(PetDataContext);
  const [petLastTimestamp, setPetLastTimestamp] = useContext(
    PetLastTimestampContext
  );
  const [experience, setExperience] = useState(0);

  const active = useMemo(() => {
    return appState === "active";
  }, [appState]);

  const level = useMemo(() => {
    return Math.floor(experience / experiencePerLevel);
  }, [experience]);

  const restExperience = useMemo(() => {
    return experience % experiencePerLevel;
  }, [experience]);

  const maxFullness = useMemo(() => {
    return baseMaxFullness + maxFullnessIncrementPerLevel * level;
  }, [level]);

  const maxHappiness = useMemo(() => {
    return baseMaxHappiness + maxHappinessIncrementPerLevel * level;
  }, [level]);

  const [fullness, setFullness] = useState(maxFullness);
  const [happiness, setHappiness] = useState(maxHappiness);

  const rectifyFullness = useCallback(
    (fullnessValue: number) => {
      return Math.min(maxFullness, Math.max(0, fullnessValue));
    },
    [maxFullness]
  );

  const rectifyHappiness = useCallback(
    (happinessValue: number) => {
      return Math.min(maxHappiness, Math.max(0, happinessValue));
    },
    [maxHappiness]
  );

  const saveState = useCallback(() => {
    const newPetData = {
      experience,
      fullness,
      happiness,
    };
    setPetLastTimestamp(Date.now());
    setPetData(newPetData);
  }, [experience, fullness, happiness]);

  const notifyCanNotEnough = useCallback(() => {
    /// TODO: Implement.
  }, []);

  const notifyEnoughPet = useCallback(() => {
    /// TODO: Implement.
  }, []);

  const notifyEnoughFeed = useCallback(() => {
    /// TODO: Implement.
  }, []);

  const pet = useCallback(() => {
    if (maxHappiness - happiness < 0.1) {
      notifyEnoughPet();
      return;
    }
    setHappiness((prev) => rectifyHappiness(prev + happinessIncrementPerPet));
    setExperience((prev) => prev + experienceIncrementPerPet);
  }, [maxHappiness, happiness]);

  const feed = useCallback(() => {
    if (maxFullness - fullness < 0.1) {
      notifyEnoughFeed();
      return;
    }
    if (can === 0) {
      notifyCanNotEnough();
      return;
    }
    setCan((prev) => prev - 1);
    setFullness((prev) => rectifyFullness(prev + fullnessIncrementPerFeed));
    setExperience((prev) => prev + experienceIncrementPerFeed);
  }, [maxFullness, fullness]);

  useEffect(() => {
    if (decrementTick === null) return;
    setFullness((prev) => rectifyFullness(prev - fullnessDecrementPerSecond));
    setHappiness((prev) =>
      rectifyHappiness(prev - happinessDecrementPerSecond)
    );
  }, [decrementTick]);

  useEffect(() => {
    if (saveTick === null) return;
    saveState();
  }, [saveTick]);

  useEffect(() => {
    const initialize = () => {
      const decrementIntervalHandler = setInterval(() => {
        setDecrementTick(Date.now());
      }, 1000);
      const saveIntervalHandler = setInterval(() => {
        setSaveTick(Date.now());
      }, saveIntervalDuration);
      setCleanUpData({
        decrementIntervalHandler,
        saveIntervalHandler,
      });
    };

    const deinitialize = () => {
      if (cleanUpData === null) return;
      clearInterval(cleanUpData.decrementIntervalHandler);
      clearInterval(cleanUpData.saveIntervalHandler);
      saveState();
      setCleanUpData(null);
    };

    if (active) initialize();
    else deinitialize();

    return deinitialize;
  }, [active]);

  useEffect(() => {
    setExperience(petData.experience);

    const currentTimestamp = Date.now();
    const timePassed = currentTimestamp - petLastTimestamp;
    const newFullness = rectifyFullness(
      petData.fullness - timePassed * fullnessDecrementPerSecond
    );
    const newHappiness = rectifyHappiness(
      petData.happiness - timePassed * happinessDecrementPerSecond
    );

    setFullness(newFullness);
    setHappiness(newHappiness);
  }, []);

  return (
    <>
      <ThemedText>Can: {can}</ThemedText>
      <Button
        title="Increment Can"
        onPress={() => setCan((prev) => prev + 1)}
      ></Button>
      <ThemedText>Level: {level}</ThemedText>
      <ThemedText>Rest Experience: {restExperience}</ThemedText>
      <ThemedText>Experience: {experience}</ThemedText>
      <ThemedText>Fullness: {fullness}</ThemedText>
      <Button
        title="Feed"
        onPress={() => {
          feed();
        }}
      ></Button>
      <ThemedText>Happiness: {happiness}</ThemedText>
      <Button
        title="Pet"
        onPress={() => {
          pet();
        }}
      ></Button>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
