import sys, numpy as np, sherpa_onnx, json
d = sys.argv[1]; P = d
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f'{P}/sherpa-onnx-whisper-small/small-encoder.int8.onnx', decoder=f'{P}/sherpa-onnx-whisper-small/small-decoder.int8.onnx', tokens=f'{P}/sherpa-onnx-whisper-small/small-tokens.txt', language='es', task='transcribe', num_threads=4)
x = np.fromfile(f'{P}/voz16k.f32', dtype=np.float32); sr = 16000; DUR = len(x) / sr
sil = [tuple(map(float, l.split())) for l in open(f'{P}/sil_major.txt') if l.strip()]
segs = []; prev = 0.0
for s, e in sil:
    if s - prev > 0.05: segs.append([prev, s])
    prev = e
if DUR - prev > 0.05: segs.append([prev, DUR])
out = []
for i, (a, b) in enumerate(segs):
    st = rec.create_stream(); st.accept_waveform(sr, x[int(max(0, a - 0.08) * sr):int(min(DUR, b + 0.08) * sr)]); rec.decode_stream(st)
    out.append({'i': i, 's': round(a, 3), 'e': round(b, 3), 'text': st.result.text.strip()})
    print(i, round(a, 2), round(b, 2), st.result.text.strip(), flush=True)
json.dump(out, open(f'{P}/transcripcion.json', 'w'), ensure_ascii=False, indent=1)
