import sys, subprocess, glob, os
# sheet.py out.png cols files...
out, cols, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
lst = out + '.txt'
open(lst, 'w').write(''.join(f"file '{os.path.abspath(f)}'\n" for f in files))
rows = (len(files) + cols - 1) // cols
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-vf', f'scale=360:640,tile={cols}x{rows}:padding=4', '-frames:v', '1', out], check=True)
