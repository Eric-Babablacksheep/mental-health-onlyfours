import tailwindConfig from "@/tailwind.config";
import { LinearGradient } from "expo-linear-gradient";
import { Pause, Play, RotateCcw } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import resolveConfig from "tailwindcss/resolveConfig";

const fullConfig = resolveConfig(tailwindConfig);

interface MusicTrack {
  id: number;
  title: string;
  duration: string;
  type: 'nature' | 'meditation' | 'ambient';
}

const musicTracks: MusicTrack[] = [
  { id: 1, title: 'Forest Rain', duration: '10:00', type: 'nature' },
  { id: 2, title: 'Ocean Waves', duration: '15:30', type: 'nature' },
  { id: 3, title: 'Mindful Meditation', duration: '20:00', type: 'meditation' },
  { id: 4, title: 'Deep Focus', duration: '25:00', type: 'ambient' },
  { id: 5, title: 'Night Sounds', duration: '30:00', type: 'nature' },
  { id: 6, title: 'Zen Garden', duration: '18:45', type: 'meditation' },
];

export default function RelaxationScreen() {
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCycle, setBreathingCycle] = useState(0);
  
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let cancelled = false;

    const runBreathingCycle = async () => {
      while (!cancelled && isBreathingActive) {
        // Inhale (4s)
        setBreathingPhase("inhale");
        await new Promise<void>((resolve) => {
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: 4000,
            useNativeDriver: true,
          }).start(() => resolve());
        });

        if (cancelled) break;
        setBreathingPhase("hold");
        await new Promise<void>((resolve) => setTimeout(resolve, 4000));

        if (cancelled) break;
        setBreathingPhase("exhale");
        await new Promise<void>((resolve) => {
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 6000,
            useNativeDriver: true,
          }).start(() => resolve());
        });

        if (cancelled) break;
        setBreathingCycle((prev) => prev + 1);
        await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      }
    };

    if (isBreathingActive) {
      runBreathingCycle();
    }

    return () => {
      cancelled = true;
    };
  }, [isBreathingActive]); 

  const startBreathingExercise = () => {
    setBreathingCycle(0);
    setIsBreathingActive(true);
  };

  const stopBreathingExercise = () => {
    setIsBreathingActive(false);
    setBreathingPhase("inhale");
    scaleAnim.stopAnimation(() => {
      scaleAnim.setValue(1);
    });
  };

  const toggleTrack = (trackId: number) => {
    if (activeTrack === trackId) {
      setActiveTrack(null);
    } else {
      setActiveTrack(trackId);
    }
  };

  const getTrackTypeColor = (type: string) => {
    switch (type) {
      case 'nature': return '#10B981';
      case 'meditation': return '#8B5CF6';
      case 'ambient': return '#06B6D4';
      default: return '#6B7280';
    }
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Inhale';
      case 'hold': return 'Hold';
      case 'exhale': return 'Exhale';
    }
  };

  const getBreathingDetail = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe in slowly...';
      case 'hold': return 'Hold your breathe';
      case 'exhale': return 'Breathe out slowly...';
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 pt-12 pb-4">
        <Text className="text-4xl text-center font-bold text-gray-800">Relaxation</Text>
        <Text className="text-base text-center text-gray-500 mt-1">Find your inner peace</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Breathing Exercise */}
        <View className="px-5 mb-8">
          <LinearGradient colors={(fullConfig.theme as any).linearGradient.calm} style={{ borderRadius: 16 }}>
            <View className="px-5 mb-8">
              <Text className="text-xl text-center font-semibold text-gray-800 my-4 pt-1">Breathing Circle</Text>
              <View className="items-center">
                <View className="h-60 w-50 justify-center items-center mb-8">
                  <Animated.View 
                    className="w-36 h-36 rounded-full bg-indigo-100 justify-center items-center border-4 border-purple-500"
                    style={{
                      transform: [{ scale: scaleAnim }]
                    }}
                  >
                    <Text className="text-lg font-semibold text-purple-500 text-center">
                      {isBreathingActive ? getBreathingInstruction() : 'Ready'}
                    </Text>
                  </Animated.View>
                </View>
                {isBreathingActive && (
                  <Text className="pb-3 text-lg font-semibold text-gray-500 text-center">
                    {getBreathingDetail()}
                  </Text>
                )}
                <View className="items-center">
                  {!isBreathingActive ? (
                    <TouchableOpacity 
                      className="flex-row items-center bg-purple-500 py-4 px-8 rounded-3xl gap-2"
                      onPress={startBreathingExercise}
                    >
                      <Play size={24} color="#FFFFFF" />
                      <Text className="text-base font-semibold text-white">Start</Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="items-center gap-4">
                      <TouchableOpacity 
                        className="flex-row items-center bg-red-50 py-3 px-5 rounded-2xl gap-2"
                        onPress={stopBreathingExercise}
                      >
                        <RotateCcw size={20} color="#EF4444" />
                        <Text className="text-sm font-medium text-red-500">Reset</Text>
                      </TouchableOpacity>
                      <Text className="text-base font-medium text-gray-500">Cycle: {breathingCycle}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Meditation Music */}
        <View className="px-5 mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">Meditation Music</Text>
          {musicTracks.map((track) => {
            const isPlaying = activeTrack === track.id;
            const typeColor = getTrackTypeColor(track.type);
            
            return (
              <TouchableOpacity
                key={track.id}
                className={`bg-white rounded-xl p-4 mb-2 flex-row justify-between items-center shadow-xl ${
                  isPlaying ? 'bg-sky-50 border border-sky-500' : ''
                }`}
                onPress={() => toggleTrack(track.id)}
              >
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-base font-semibold text-gray-800 flex-1">{track.title}</Text>
                    <View 
                      className="me-2 py-1 px-2 rounded-xl ml-2"
                      style={{ backgroundColor: typeColor }}
                    >
                      <Text className="text-xs font-semibold text-white uppercase">{track.type}</Text>
                    </View>
                  </View>
                  <Text className="text-sm text-gray-500">{track.duration}</Text>
                </View>
                <View className="w-12 h-12 rounded-full bg-gray-100 justify-center items-center">
                  {isPlaying ? (
                    <Pause size={20} color="#8B5CF6" />
                  ) : (
                    <Play size={20} color="#8B5CF6" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Relaxation Tips */}
        <View className="px-5 mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">Quick Relaxation Tips</Text>
          <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <Text className="text-base font-semibold text-gray-800 mb-2">🌸 Progressive Muscle Relaxation</Text>
            <Text className="text-sm text-gray-500 leading-5">
              Tense and then relax each muscle group, starting from your toes to your head.
            </Text>
          </View>
          <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <Text className="text-base font-semibold text-gray-800 mb-2">🍃 Mindful Observation</Text>
            <Text className="text-sm text-gray-500 leading-5">
              Find 5 things you can see, 4 you can hear, 3 you can touch, 2 you can smell, and 1 you can taste.
            </Text>
          </View>
          <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <Text className="text-base font-semibold text-gray-800 mb-2">💭 Visualization</Text>
            <Text className="text-sm text-gray-500 leading-5">
              Imagine a peaceful place where you feel completely safe and relaxed.
            </Text>
          </View>
        </View>

        <View className="h-5" />
      </ScrollView>
    </SafeAreaView>
  );
}