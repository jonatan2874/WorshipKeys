import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { IconHome, IconProfile, IconSongs } from '@/components/icons';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function TabsLayout() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 62,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.bodyMedium,
          fontSize: 10.5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.inicio'),
          tabBarIcon: ({ color, size }) => <IconHome color={String(color)} size={size} />,
        }}
      />
      <Tabs.Screen
        name="canciones"
        options={{
          title: t('tabs.canciones'),
          tabBarIcon: ({ color, size }) => <IconSongs color={String(color)} size={size} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: t('tabs.perfil'),
          tabBarIcon: ({ color, size }) => <IconProfile color={String(color)} size={size} />,
        }}
      />
    </Tabs>
  );
}
