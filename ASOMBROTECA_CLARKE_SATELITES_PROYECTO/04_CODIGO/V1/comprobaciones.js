// Comprobaciones físicas del episodio 07 (node comprobaciones.js). Falla con código 1 si algo no cuadra.
const RAD = Math.PI / 180, Re = 6378.137, GM = 398600.4418, Tsid = 86164.0905;
let ok = true; const chk = (n, c, v) => { console.log((c ? 'OK   ' : 'FALLO') + ' ' + n + (v !== undefined ? ' → ' + v : '')); if (!c) ok = false; };
const rGeo = Math.cbrt(GM * (Tsid / (2 * Math.PI)) ** 2), alt = rGeo - Re, v = 2 * Math.PI * rGeo / Tsid, vEq = 2 * Math.PI * Re / Tsid, k = rGeo / Re;
chk('radio GEO ≈ 42 164 km', Math.abs(rGeo - 42164) < 2, rGeo.toFixed(1));
chk('altitud GEO ≈ 35 786 km (desde la superficie)', Math.abs(alt - 35786) < 2, alt.toFixed(1));
chk('velocidad GEO ≈ 3,07 km/s', Math.abs(v - 3.07) < 0.01, v.toFixed(3));
chk('velocidad del ecuador ≈ 0,46 km/s', Math.abs(vEq - 0.465) < 0.01, vEq.toFixed(3));
chk('k = 6,61 radios', Math.abs(k - 6.61) < 0.01, k.toFixed(3));
const elev = (lat, lon, lonS, kk = k) => { const c = Math.cos(lat * RAD) * Math.cos((lon - lonS) * RAD); return Math.atan2(c - 1 / kk, Math.sqrt(1 - c * c)) / RAD; };
chk('Londres ve el GEO de 30° O', elev(51.5, -0.13, -30) > 5, elev(51.5, -0.13, -30).toFixed(1) + '°');
chk('Nueva York ve el GEO de 30° O', elev(40.7, -74, -30) > 5, elev(40.7, -74, -30).toFixed(1) + '°');
chk('Londres y Ciudad del Cabo ven la estación de 12° E', elev(51.5, -0.13, 12) > 5 && elev(-33.9, 18.4, 12) > 5);
const psi = Math.acos(1 / k) / RAD, psi5 = Math.acos(Math.cos(5 * RAD) / k) / RAD - 5;
chk('horizonte geométrico ≈ 81,3°', Math.abs(psi - 81.3) < 0.1, psi.toFixed(2)); chk('cobertura útil (5°) ≈ 76,3° → polos fuera', psi5 < 77 && psi5 > 75, psi5.toFixed(2) + '° (shrink ' + (psi5 / psi).toFixed(3) + ')');
const L3 = [-30, 90, -150]; chk('3 satélites separados 120°', L3.every((l, i) => ((L3[(i + 1) % 3] - l + 360) % 360) === 120));
let gap = 0; for (let lon = -180; lon < 180; lon += 1) { if (!L3.some((s) => elev(0, lon, s) > 5)) gap++; } chk('ecuador cubierto entero por los 3 (elev ≥ 5°)', gap === 0);
chk('polo norte sin cobertura', L3.every((s) => elev(90, 0, s) < 0));
// convenio de P.orbView/earth3: a = lon − (rot − 1,6); x = cos(lat)·sin(a). Si rot disminuye, a crece: el punto (y el GEO de longitud fija)
// avanza hacia la derecha por la cara visible = de oeste a este visto con el norte arriba.
const xOf = (lon, rot) => Math.sin(lon * RAD - (rot - 1.6)); chk('rot decreciente ⇒ giro oeste→este', xOf(-8, 1.0 - 0.1) > xOf(-8, 1.0));
process.exit(ok ? 0 : 1);
