import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sorteio"
        options={{
          title: 'Sorteio',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="gift" color={color} />,
        }}
      />
    </Tabs>
  );
}