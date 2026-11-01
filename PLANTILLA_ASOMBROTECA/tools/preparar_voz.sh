#!/usr/bin/env bash
# Prepara una voz para la plantilla: duración, pausas (mayores y menores) y transcripción Whisper local.
# Uso: bash tools/preparar_voz.sh ../01_ENTRADA/audio/voz.mp3 trabajo/
# Salida en trabajo/: duracion.txt, sil_major.txt, sil_minor.txt, voz16k.f32, transcripcion.json, tramos_borrador.txt
set -e
VOZ="$1"; OUT="${2:-trabajo}"; mkdir -p "$OUT"
DIR="$(cd "$(dirname "$0")" && pwd)"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$VOZ" | tee "$OUT/duracion.txt"
pairs() { awk '/silence_start/{s=$NF} /silence_end/{for(i=1;i<=NF;i++) if($i=="silence_end:") print s, $(i+1)}'; }
ffmpeg -hide_banner -i "$VOZ" -af silencedetect=noise=-38dB:d=0.25 -f null - 2>&1 | pairs > "$OUT/sil_major.txt"
ffmpeg -hide_banner -i "$VOZ" -af silencedetect=noise=-36dB:d=0.09 -f null - 2>&1 | pairs > "$OUT/sil_minor.txt"
ffmpeg -v error -y -i "$VOZ" -ac 1 -ar 16000 -f f32le "$OUT/voz16k.f32"
echo "tramos de voz: $(( $(wc -l < "$OUT/sil_major.txt") + 1 )) (aprox.)"
# Whisper small (sherpa-onnx). Requiere: pip install sherpa-onnx numpy ; el modelo se descarga de GitHub releases.
if python3 -c "import sherpa_onnx" 2>/dev/null; then
  if [ ! -d "$OUT/sherpa-onnx-whisper-small" ]; then
    curl -sSL -o "$OUT/w.tar.bz2" https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-small.tar.bz2 && tar xjf "$OUT/w.tar.bz2" -C "$OUT" && rm "$OUT/w.tar.bz2"
  fi
  python3 -I "$DIR/transcribir_whisper.py" "$OUT"
  python3 -I -c "import json,sys; d=json.load(open(sys.argv[1])); open(sys.argv[2],'w').write('\n'.join(x['text'] for x in d)+'\n')" "$OUT/transcripcion.json" "$OUT/tramos_borrador.txt"
  echo "Revisa y corrige $OUT/tramos_borrador.txt (nombres propios, cifras con forma hablada) y guárdalo como 03_GUION/tramos.txt"
else
  echo "sherpa-onnx no instalado: escribe 03_GUION/tramos.txt a mano (una línea por tramo de voz)."
fi
