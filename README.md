# WorshipKeys 🎹

WorshipKeys es una app móvil (Expo / React Native) para aprender piano enfocada en música de adoración. Combina un currículo de lecciones guiadas con detección de tono en tiempo real desde el micrófono, para que el usuario reciba retroalimentación inmediata mientras practica.

## Características

- **Lecciones guiadas** organizadas en un currículo por niveles (`src/lib/curriculum`), con evaluación de la ejecución del alumno (`src/lib/evaluation`).
- **Detección de tono en vivo** usando el micrófono del dispositivo (`pitchfinder`, `expo-audio`) para verificar las notas que el usuario toca.
- **Teclado interactivo** en pantalla y diagramas de mano/teclado para guiar la digitación.
- **Progreso y perfil** del usuario, con autenticación (Firebase Auth + Google Sign-In) y persistencia en Firestore / almacenamiento local.
- **Multi-idioma** vía `i18next` / `react-i18next`.
- Construida con **Expo Router** (rutas tipadas) y soporte para iOS, Android y Web.

## Stack técnico

- [Expo](https://docs.expo.dev/versions/v57.0.0/) 57 + React Native 0.86 + React 19
- Expo Router (file-based routing)
- Firebase (`@react-native-firebase/app`, `auth`, `firestore`)
- `pitchfinder` + `expo-audio` para análisis de audio en tiempo real
- TypeScript, ESLint

## Empezar

1. Instalar dependencias

   ```bash
   npm install
   ```

2. Iniciar la app

   ```bash
   npx expo start
   ```

   Desde ahí puedes abrirla en un [development build](https://docs.expo.dev/develop/development-builds/introduction/), emulador de Android, simulador de iOS, o [Expo Go](https://expo.dev/go).

## Estructura del proyecto

```
src/
  app/            # Rutas (Expo Router) — pantallas de tabs, lección, etc.
  components/     # Componentes UI reutilizables e ilustraciones
  contexts/       # Contextos de React (auth, progreso, ajustes)
  lib/
    curriculum/   # Definición de lecciones y niveles
    evaluation/   # Lógica de evaluación de la ejecución del alumno
    pitch/        # Utilidades de detección de tono
    i18n/         # Configuración de internacionalización
```

## Notas de desarrollo

Este proyecto usa Expo SDK 57. Antes de escribir código, consultar la documentación versionada en https://docs.expo.dev/versions/v57.0.0/, ya que hay cambios respecto a versiones anteriores de Expo.
