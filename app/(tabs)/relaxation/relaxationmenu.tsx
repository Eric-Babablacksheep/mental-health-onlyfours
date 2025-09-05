import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import { ArrowRight } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

// Lotus Icon Component
const LotusIcon = () => (
  <View className="w-12 h-12 bg-orange-100 rounded-xl items-center justify-center">
    <Text className="text-2xl">🪷</Text>
  </View>
);

const BreatheIcon = () => (
  <View className="w-12 h-12 bg-orange-100 rounded-xl items-center justify-center">
    <Text className="text-2xl">😮‍💨</Text>
  </View>
);

export default function RelaxationMenuScreen() {
  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={['#E8B4CB', '#F4C2C2', '#FFE4E1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <View className="flex-1 px-6 mt-20">
          <View className="mb-4">
            <Text className="text-white text-3xl font-bold text-center leading-10">
              Stress Relief
            </Text>
          </View>

          <View className="mb-8">
            <Text className="text-gray-800 text-center text-base font-medium">
              Welcome Back!
            </Text>
          </View>

          <View className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className="flex-row items-center mb-3">
                  <LotusIcon />
                  <View className="ml-4 flex-1">
                    <Text className="text-gray-900 text-lg font-bold">
                      Meditation Playlist
                    </Text>
                  </View>
                </View>
                
                <Text className="text-gray-600 text-sm leading-5 mb-4">
                  Immerse yourself in gentle melodies designed to quiet the mind and guide you into deep relaxation.
                </Text>
                
                <View className="flex-row items-center justify-between">
                  <View className="flex-1" />
                    <TouchableOpacity 
                        className="bg-orange-400 rounded-full px-6 py-3 flex-row items-center"
                        activeOpacity={0.8}
                        onPress={() => router.push("/relaxation/relaxmusic")}
                    >
                        <Text className="text-white font-semibold mr-2">Start</Text>
                        <ArrowRight size={16} color="white" />
                    </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className="flex-row items-center mb-3">
                  <BreatheIcon />
                  <View className="ml-4 flex-1">
                    <Text className="text-gray-900 text-lg font-bold">
                      Breathing Circle Exercise
                    </Text>
                  </View>
                </View>
                
                <Text className="text-gray-600 text-sm leading-5 mb-4">
                  Follow the guided rhythm of breath to release tension, restore balance and reconnect with your body.
                </Text>
                
                <View className="flex-row items-center justify-between">
                  <View className="flex-1" />
                    <TouchableOpacity 
                        className="bg-orange-400 rounded-full px-6 py-3 flex-row items-center"
                        activeOpacity={0.8}
                        onPress={() => router.push("/relaxation/breathing")}
                    >
                        <Text className="text-white font-semibold mr-2">Start</Text>
                        <ArrowRight size={16} color="white" />
                    </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}