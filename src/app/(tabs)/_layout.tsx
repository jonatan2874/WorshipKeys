import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconHome, IconProfile, IconSongs } from '@/components/icons';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function TabsLayout() {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

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
          // La altura fija de la barra de pestañas debe reservar el inset
          // inferior del sistema (barra de navegación de Android); si no,
          // la parte de abajo queda detrás de los botones del sistema y
          // los toques ahí no le llegan a la app (visto en MIUI/Xiaomi,
          // que suele tener una barra de navegación más alta que el resto).
          height: 62 + insets.bottom,
          paddingTop: 8,
          paddingBottom: 8 + insets.bottom,
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
