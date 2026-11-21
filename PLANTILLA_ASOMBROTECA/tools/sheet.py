import sys, subprocess, glob, os
# sheet.py out.png cols files...   (v2.4: «--ficha <modo> <duración>» al final añade la ficha con la casilla «Resultado FB 24 h»)
args = sys.argv[1:]; ficha = None
if '--ficha' in args:
    i = args.index('--ficha'); ficha = args[i + 1:i + 3]; args = args[:i]
out, cols, files = args[0], int(args[1]), args[2:]
lst = out + '.txt'
open(lst, 'w').write(''.join(f"file '{os.path.abspath(f)}'\n" for f in files))
rows = (len(files) + cols - 1) // cols
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-vf', f'scale=360:640,tile={cols}x{rows}:padding=4', '-frames:v', '1', out], check=True)
if ficha:
    subprocess.run([sys.executable, '-I', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ficha_hoja.py'), out] + ficha, check=True)
