# Voz gratis con licencia comercial: Kokoro-82M (Apache 2.0)

Es un modelo abierto de texto a voz con licencia **Apache 2.0**, que permite el uso comercial. El archivo `LICENSE` viene dentro del paquete del modelo. Se ejecuta localmente con sherpa-onnx, sin créditos ni suscripción.

| Voz | `sid` | Tono medio |
|---|---|---|
| Dora (mujer) | 28 | ~173 Hz |
| Alex (hombre) | 29 | ~135 Hz |
| Santa (hombre) | 53 | ~137 Hz |

Español latinoamericano: los fonemas salen de espeak-ng `es-419`, con seseo.

## Uso

1. **Instalar dependencias:**

   ```
   pip install sherpa-onnx soundfile espeakng-loader phonemizer-fork
   ```

2. **Descargar el modelo** (unos 350 MB, desde GitHub releases):

   ```
   curl -L -O https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-multi-lang-v1_0.tar.bz2 && tar xjf kokoro-multi-lang-v1_0.tar.bz2
   ```

3. **Crear el léxico del guion.** sherpa-onnx necesita un léxico para el español; este script lo genera con espeak-ng:

   ```
   python3 hacer_lexico.py guion.txt lex-es.txt
   ```

4. **Generar la voz.** El último número es la velocidad:

   ```
   python3 generar_voz.py guion.txt salida 28 1.08
   ```

   Produce `salida_sid28_v1.08.wav`.

5. **Masterizar:** `highpass`, ecualizador suave, compresión y `loudnorm` a −16 LUFS (ver `INSTRUCCIONES_PLANTILLA.md`).

## Notas

- Los signos de apertura `¡` y `¿` se eliminan antes de sintetizar, porque el tokenizador los pega a la palabra.
- **Cifras:** escríbelas con letras en el guion («mil novecientos sesenta y tres»), porque el léxico solo cubre palabras.
- **Calidad:** natural y clara, aunque menos expresiva que ElevenLabs. Revisa siempre que la transcripción automática coincida con el guion.
