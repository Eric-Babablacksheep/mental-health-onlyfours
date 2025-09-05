import { LinearGradient } from "expo-linear-gradient";
import { Play, RotateCcw } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
// import { useNavigation } from "expo-router";
// import { useFocusEffect } from '@react-navigation/native';

export default function RelaxationScreen() {
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCycle, setBreathingCycle] = useState(0);
  
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // const navigation = useNavigation();

  // useFocusEffect(() => {
  //   navigation.getParent()?.setOptions({
  //     tabBarStyle: { display: 'none' }
  //   });

  //   return () => {
  //     // Show tab bar when leaving the screen
  //     navigation.getParent()?.setOptions({
  //       tabBarStyle: { display: 'flex' }
  //     });
  //   };
  // });

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

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Inhale';
      case 'hold': return 'Hold';
      case 'exhale': return 'Exhale';
    }
  };

  const getBreathingDetail = () => { 
    switch (breathingPhase) {
      case 'inhale': return 'Breathe in slowly... (4s)';
      case 'hold': return 'Hold your breathe (4s)';
      case 'exhale': return 'Breathe out slowly... (6s)';
    }
  }

  return (
    <LinearGradient
        colors={['hsl(260 60% 85%)', 'hsl(200 50% 85%)']}
        className="flex-1"
    >
        <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center items-center px-5">
            <View className="px-5 mb-8">
            <Text className="text-3xl text-center font-semibold text-gray-800 pt-1">Breathing Circle</Text>
            <Text className="text-xl text-center font-semibold text-gray-500 my-2 pt-1">Find your inner peace</Text>
            <View className="items-center">
                <View className="h-72 w-50 justify-center items-center my-5">
                <Animated.View
                    className="w-48 h-48 rounded-full bg-indigo-100 justify-center items-center border-4 border-purple-500"
                    style={{
                    transform: [{ scale: scaleAnim }],
                    }}
                >
                    <Text className="text-lg font-semibold text-purple-500 text-center">
                    {isBreathingActive ? getBreathingInstruction() : 'Ready'}
                    </Text>
                </Animated.View>
                </View>
                
                <Text className="pb-3 text-lg font-semibold text-gray-500 text-center">
                    {isBreathingActive ? getBreathingDetail() : ''}
                </Text>

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
                    <TouchableOpacity
                        className="flex-row items-center bg-red-50 py-4 px-8 rounded-3xl gap-2"
                        onPress={stopBreathingExercise}
                    >
                    <RotateCcw size={24} color="#EF4444" />
                    <Text className="text-base font-medium text-red-500">Reset</Text>
                    </TouchableOpacity>
                )}
                <Text className="text-base font-medium text-gray-500 mt-4">
                    Cycle: {breathingCycle}
                </Text>
                </View>
            </View>
            </View>
        </View>
        </SafeAreaView>
    </LinearGradient>
    );
}