import { CanContext } from "@/components/CanProvider";
import { PetDataContext } from "@/components/PetDataProvider";
import { PetLastTimestampContext } from "@/components/PetLastTimestampProvider";
import ProgressBar from "@/components/ProgressBar";
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
import { Cat, Fish, Hand } from "lucide-react-native";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CleanUpData {
  decrementIntervalHandler: number;
  saveIntervalHandler: number;
}

const lackingCanMessages = ["There is no can left!", "I cannot find any can!"];

const enoughPetMessages = [
  "Enough Petting!",
  "No more pet please!",
  "No more!",
];

const enoughFeedMessages = [
  "Enough food!",
  "I am full!",
  "No more please!",
  "I'm bloated!",
  "Please no more food!",
];

function pickRandom<ElementType>(p_array: Array<ElementType>) {
  const randomizedIndex = Math.round(Math.random() * (p_array.length - 1));
  return p_array[randomizedIndex];
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

  const notifyLackingCan = useCallback(() => {
    Alert.alert(pickRandom(lackingCanMessages));
  }, []);

  const notifyEnoughPet = useCallback(() => {
    Alert.alert(pickRandom(enoughPetMessages));
  }, []);

  const notifyEnoughFeed = useCallback(() => {
    Alert.alert(pickRandom(enoughFeedMessages));
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
      notifyLackingCan();
      return;
    }
    setCan((prev) => prev - 1);
    setFullness((prev) => rectifyFullness(prev + fullnessIncrementPerFeed));
    setExperience((prev) => prev + experienceIncrementPerFeed);
  }, [maxFullness, fullness]);

  const happinessPercentage = useMemo(() => {
    return Math.round((happiness / maxHappiness) * 100);
  }, [happiness, maxHappiness]);

  const fullnessPercentage = useMemo(() => {
    return Math.round((fullness / maxFullness) * 100);
  }, [fullness, maxFullness]);

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
    <SafeAreaView style={style.container}>
      <View style={style.header}>
        <Text style={style.title}>Your Companion</Text>
        <Text style={style.subtitle}>Your caring digital friend</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.section}>
          <View style={style.petCard}>
            <View style={style.petAvatarSection}>
              <Cat size={60}></Cat>
              <Text style={style.petAvatarName}>Skittle</Text>
            </View>
            <View style={style.petProgressSection}>
              <View style={style.petProgress}>
                <Fish></Fish>
                <ProgressBar fillPercentage={fullnessPercentage}></ProgressBar>
              </View>
              <View style={style.petProgress}>
                <Hand></Hand>
                <ProgressBar fillPercentage={happinessPercentage}></ProgressBar>
              </View>
            </View>
            <View style={style.petActionsGrid}>
              <TouchableOpacity style={style.petActionButton} onPress={feed}>
                <Fish></Fish>
                <Text>Feed</Text>
              </TouchableOpacity>
              <TouchableOpacity style={style.petActionButton} onPress={pet}>
                <Hand></Hand>
                <Text>Pet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={style.section}>
          <Text style={style.sectionTitle}>Companion Stats</Text>
          <View style={style.statsGrid}>
            <View style={style.statCard}>
              <Text style={style.statValue}>{fullnessPercentage}%</Text>
              <Text style={style.statLabel}>Fullness</Text>
            </View>
            <View style={style.statCard}>
              <Text style={style.statValue}>{happinessPercentage}%</Text>
              <Text style={style.statLabel}>Happiness</Text>
            </View>
            <View style={style.statCard}>
              <Text style={style.statValue}>{can}</Text>
              <Text style={style.statLabel}>Can count</Text>
            </View>
          </View>
        </View>

        <View style={style.section}>
          <Text style={style.sectionTitle}>Care Tips</Text>
          <View style={style.tipCard}>
            <Text style={style.tipTitle}>Collect cans</Text>
            <Text style={style.tipDescription}>
              Obtain cans from writing diaries and doing breathing exercises.
            </Text>
          </View>
          <View style={style.tipCard}>
            <Text style={style.tipTitle}>Feed your companion</Text>
            <Text style={style.tipDescription}>
              Using cans you collected and feed your companion.
            </Text>
          </View>
          <View style={style.tipCard}>
            <Text style={style.tipTitle}>Pet your companion</Text>
            <Text style={style.tipDescription}>
              Make your companion happy by petting it.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  petCard: {
    marginHorizontal: "auto",
    width: "100%",
    maxWidth: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
  },
  petAvatarSection: {
    padding: 30,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  petAvatarName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  petProgressSection: {
    marginBottom: 20,
  },
  petProgress: {
    padding: 10,
  },
  petActionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  petActionButton: {
    flex: 1,
    backgroundColor: "#F4C2C2",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#8B5CF6",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
});
