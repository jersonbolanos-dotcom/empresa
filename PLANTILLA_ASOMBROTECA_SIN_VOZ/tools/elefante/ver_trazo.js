// previsualiza un trazo SVG (M/C) con relleno y línea: node ver.js path.txt salida.png
const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const d = fs.readFileSync(process.argv[2], 'utf8').replace(/\n/g, ' '); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1100, height: 800 } });
 await p.setContent('<canvas id=c width=1100 height=800></canvas>'); const url = await p.evaluate((d) => { const c = document.getElementById('c'), x = c.getContext('2d'); x.fillStyle = '#0b0b14'; x.fillRect(0, 0, 1100, 800); const P = new Path2D(d);
  x.fillStyle = 'rgba(120,140,255,0.25)'; x.fill(P); x.strokeStyle = '#c9a2ff'; x.lineWidth = 4; x.lineJoin = 'round'; x.stroke(P); return c.toDataURL('image/png'); }, d);
 fs.writeFileSync(process.argv[3], Buffer.from(url.split(',')[1], 'base64')); await b.close(); })();
