import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Image } from "expo-image";
import { Pause, Play } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

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
  { id: 7, title: 'Hello World', duration: '15:00', type: 'nature' },
];

export default function RelaxationScreen() {
  const [activeTrack, setActiveTrack] = useState<number | null>(null);

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

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/relax-music.png")}
          style={{
            height: 250,
            width: 400,
            bottom: 0,
            left: 0,
            position: "absolute",
          }}
        />
      }
    >
      {/* Meditation Music */}
      <ScrollView 
        className="flex-1 pb-8" 
        style={{ backgroundColor: "#F5FFFD" }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          flexGrow: 1,
          minHeight: screenHeight - 300 
        }}
      >
        <View className="p-6 flex-1">
          <View className="pb-3">
            <Text className="text-2xl font-bold text-gray-800">Meditation Music</Text>
            <Text className="text-base text-gray-500">Find your inner peace</Text>
          </View>
          <View className="pb-2 flex-1">
            {musicTracks.map((track) => {
              const isPlaying = activeTrack === track.id;
              const typeColor = getTrackTypeColor(track.type);
              
              return (
                <View
                  key={track.id}
                  className={`bg-white rounded-xl p-4 mb-2 flex-row justify-between items-center shadow-xl ${
                    isPlaying ? 'bg-sky-50 border border-sky-500' : ''
                  }`}
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
                  <TouchableOpacity
                    className="w-12 h-12 rounded-full bg-gray-100 justify-center items-center"
                    onPress={() => toggleTrack(track.id)}
                  >
                    {isPlaying ? (
                      <Pause size={20} color="#8B5CF6" />
                    ) : (
                      <Play size={20} color="#8B5CF6" />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ParallaxScrollView>
  );
}