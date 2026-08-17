import { useCallback, useEffect, useRef, useState } from 'react';
import { getRecordingPermissionsAsync, requestRecordingPermissionsAsync, useAudioStream } from 'expo-audio';
import { YIN } from 'pitchfinder';

import { DetectedNote, frequencyToNote } from './note-utils';

const SAMPLE_RATE = 48000;
// Rango del piano acústico (A0 a C8); descarta ruido/graves fuera de ese rango.
const MIN_FREQUENCY = 27;
const MAX_FREQUENCY = 4200;
// Por debajo de este pico de amplitud se considera silencio/ruido de fondo;
// YIN devuelve frecuencias basura (agudos falsos) en vez de null cuando la señal es muy débil.
const MIN_PEAK_AMPLITUDE = 0.02;
// Cuánto se mantiene visible la última nota detectada tras dejar de captarse,
// para que un toque breve (attack-decay de una tecla) alcance a verse en pantalla.
const HOLD_MS = 600;
// YIN es O(n²) sobre el buffer que recibe. A 48kHz un buffer de 100ms (4800
// muestras) le cuesta ~4M operaciones — suficiente para saturar el hilo de JS
// en un teléfono y volver la UI no responsiva. Se reduce la resolución antes
// de analizar (decimación simple); se conserva la ventana de tiempo completa
// para no perder capacidad de detectar frecuencias graves.
const DECIMATION_FACTOR = 3;

function decimate(samples: Float32Array, factor: number): Float32Array {
  const out = new Float32Array(Math.floor(samples.length / factor));
  for (let i = 0; i < out.length; i++) {
    out[i] = samples[i * factor];
  }
  return out;
}

export interface MicPitchDetectorState {
  isListening: boolean;
  hasPermission: boolean | null;
  detectedNote: DetectedNote | null;
  start: () => Promise<void>;
  stop: () => void;
}

export function useMicPitchDetector(): MicPitchDetectorState {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [detectedNote, setDetectedNote] = useState<DetectedNote | null>(null);

  // El sample rate real puede diferir del solicitado según el hardware,
  // así que el detector YIN se reconstruye si cambia entre buffers.
  const detectorRef = useRef<{ sampleRate: number; detect: (buf: Float32Array) => number | null } | null>(null);
  const lastDetectionAtRef = useRef(0);
  // El buffer llega ~10 veces/seg; solo se actualiza el estado (y se re-renderiza)
  // cuando la nota mostrada realmente cambia, para no saturar el hilo de JS
  // (eso volvía la UI, incluido el botón "Detener", poco responsiva).
  const lastShownNoteNameRef = useRef<string | null>(null);

  const { stream } = useAudioStream({
    sampleRate: SAMPLE_RATE,
    channels: 1,
    encoding: 'float32',
    onBuffer: (buffer) => {
      const samples = new Float32Array(buffer.data);

      let peak = 0;
      for (let i = 0; i < samples.length; i++) {
        const abs = Math.abs(samples[i]);
        if (abs > peak) peak = abs;
      }

      if (peak < MIN_PEAK_AMPLITUDE) {
        if (Date.now() - lastDetectionAtRef.current > HOLD_MS && lastShownNoteNameRef.current !== null) {
          lastShownNoteNameRef.current = null;
          setDetectedNote(null);
        }
        return;
      }

      const effectiveSampleRate = buffer.sampleRate / DECIMATION_FACTOR;
      if (!detectorRef.current || detectorRef.current.sampleRate !== effectiveSampleRate) {
        detectorRef.current = { sampleRate: effectiveSampleRate, detect: YIN({ sampleRate: effectiveSampleRate }) };
      }

      const frequency = detectorRef.current.detect(decimate(samples, DECIMATION_FACTOR));

      if (frequency && frequency >= MIN_FREQUENCY && frequency <= MAX_FREQUENCY) {
        lastDetectionAtRef.current = Date.now();
        const note = frequencyToNote(frequency);
        if (note && note.noteName !== lastShownNoteNameRef.current) {
          lastShownNoteNameRef.current = note.noteName;
          setDetectedNote(note);
        }
      } else if (Date.now() - lastDetectionAtRef.current > HOLD_MS && lastShownNoteNameRef.current !== null) {
        lastShownNoteNameRef.current = null;
        setDetectedNote(null);
      }
    },
  });

  // El módulo nativo lanza si se llama a stop() sobre un stream que nunca
  // arrancó (o que ya se liberó) — se rastrea el estado real para no
  // invocarlo de más, tanto desde stop() como desde el cleanup al desmontar.
  const isStreamingRef = useRef(false);

  const start = useCallback(async () => {
    const current = await getRecordingPermissionsAsync();
    let granted = current.granted;
    if (!granted) {
      const result = await requestRecordingPermissionsAsync();
      granted = result.granted;
    }
    setHasPermission(granted);
    if (!granted) return;

    detectorRef.current = null;
    lastDetectionAtRef.current = 0;
    lastShownNoteNameRef.current = null;
    await stream.start();
    isStreamingRef.current = true;
    setIsListening(true);
  }, [stream]);

  const stop = useCallback(() => {
    if (isStreamingRef.current) {
      isStreamingRef.current = false;
      try {
        stream.stop();
      } catch {
        // el stream puede haberse liberado ya (p. ej. al desmontar); ignorar.
      }
    }
    setIsListening(false);
    setDetectedNote(null);
  }, [stream]);

  useEffect(() => {
    return () => {
      if (isStreamingRef.current) {
        isStreamingRef.current = false;
        try {
          stream.stop();
        } catch {
          // ver comentario en stop().
        }
      }
    };
  }, [stream]);

  return { isListening, hasPermission, detectedNote, start, stop };
}
