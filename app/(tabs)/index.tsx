import { motivationalQuotes } from '@/constants/Questionnaires';
import "@/global.css";
import { useRouter } from 'expo-router';
import { Activity, BookOpen, Brain, Music, Sparkles, Wind } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const todayQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const shortcuts = [
    {
      title: 'Mood Check',
      icon: BookOpen,
      color: '#FFB6C1',
      route: '/relaxation'
    },
    {
      title: 'Breathe',
      icon: Wind,
      color: '#B6E5D8',
      route: '/breathing'
    },
    {
      title: 'Music',
      icon: Music,
      color: '#DDA0DD',
      route: '/relaxmusic'
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mt-20 mx-6 mb-5">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-gray-800">Hello Eric,</Text>
            <Text className="text-base text-gray-500 mt-1">How are you feeling today?</Text>
          </View>
        </View>

        {/* Daily Quote */}
        <View className="mx-6 mb-6 p-5 bg-gray-100 rounded-2xl border-l-4 border-purple-500">
          <View className="flex-row items-center mb-2">
            <Sparkles size={20} color="#8B5CF6" />
            <Text className="text-base font-semibold text-purple-500 ml-2">Daily Inspiration</Text>
          </View>
          <Text className="text-sm text-gray-600 leading-6 italic">{todayQuote}</Text>
        </View>

        {/* Mental Health Assessment Cards */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">Mental Health Check-in</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 p-4 bg-blue-50 rounded-2xl shadow-sm">
              <View className="mb-2">
                <Brain size={24} color="#4A90E2" />
              </View>
              <Text className="text-base font-semibold text-gray-800 mb-1">Depression</Text>
              <Text className="text-xs text-gray-500 mb-2">PHQ-9 Screening</Text>
              <Text className="text-sm font-medium text-gray-700">Current: Mild</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 p-4 bg-orange-50 rounded-2xl shadow-sm">
              <View className="mb-2">
                <Activity size={24} color="#F5A623" />
              </View>
              <Text className="text-base font-semibold text-gray-800 mb-1">Anxiety</Text>
              <Text className="text-xs text-gray-500 mb-2">GAD-7 Screening</Text>
              <Text className="text-sm font-medium text-gray-700">Current: Moderate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</Text>
          <View className="flex-row justify-between gap-3">
            {shortcuts.map((shortcut, index) => {
              const IconComponent = shortcut.icon;
              return (
                <TouchableOpacity
                  key={index}
                  className="flex-1 items-center py-5 px-4 rounded-2xl shadow-sm"
                  style={{ backgroundColor: shortcut.color }}
                  onPress={() => router.push(shortcut.route as any)}
                >
                  <IconComponent size={32} color="#FFFFFF" />
                  <Text className="mt-2 text-sm font-semibold text-white text-center">{shortcut.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="h-5" />
      </ScrollView>
    </SafeAreaView>
  );
}