import sherpa_onnx, soundfile as sf, sys, numpy as np
import os; D=os.environ.get('KOKORO_DIR','kokoro-multi-lang-v1_0')
cfg=sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(model=f'{D}/model.onnx',voices=f'{D}/voices.bin',tokens=f'{D}/tokens.txt',data_dir=f'{D}/espeak-ng-data',lexicon=os.environ.get('KOKORO_LEX','lex-es.txt'),dict_dir=f'{D}/dict',lang='es'),num_threads=4),max_num_sentences=1)
tts=sherpa_onnx.OfflineTts(cfg)
text=open(sys.argv[1],encoding='utf-8').read().replace('¡','').replace('¿','')
for sid in map(int,sys.argv[3].split(',')):
    for sp in map(float,sys.argv[4].split(',')):
        a=tts.generate(text,sid=sid,speed=sp)
        sf.write(f'{sys.argv[2]}_sid{sid}_v{sp}.wav',np.array(a.samples),a.sample_rate)
        print(sid,sp,a.sample_rate,len(a.samples)/a.sample_rate)
