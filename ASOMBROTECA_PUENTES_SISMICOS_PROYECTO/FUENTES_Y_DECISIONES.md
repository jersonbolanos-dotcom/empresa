# Fuentes y decisiones · «¿Cómo pueden los puentes resistir los terremotos?»

## Datos verificados
| Afirmación del guion / visual | Verificación | Fuente |
|---|---|---|
| El sismo mueve primero el suelo y las cimentaciones; la estructura responde por inercia | Excitación por la base: la fuerza en la estructura es proporcional a la masa por la aceleración de respuesta | Chopra, A. K. *Dynamics of Structures* (oscilador de un grado de libertad bajo aceleración de base) |
| Si fuera completamente rígido, algunas partes podrían sufrir daños graves | Una estructura rígida (periodo corto) suele quedar en la zona de mayor aceleración espectral → más fuerza en pilas y cimentación. **No** se afirma que un puente rígido siempre falle | FHWA / MCEER, *Seismic Isolation of Highway Bridges* (MCEER-06-SP07, Buckle et al., 2006) |
| Apoyos sísmicos que permiten movimiento entre tablero y soportes | Aisladores elastoméricos laminados (con o sin núcleo de plomo): capas de caucho y láminas de acero vulcanizadas, flexibles en horizontal y rígidas en vertical; alargan el periodo (≈ 2–3 s) | MCEER-06-SP07; AASHTO *Guide Specifications for Seismic Isolation Design* |
| No todos los puentes tienen aisladores | Muchos puentes usan diseño dúctil de pilas (rótulas plásticas) en lugar de aislamiento | AASHTO *Guide Specifications for LRFD Seismic Bridge Design*; Caltrans *Seismic Design Criteria* |
| Disipadores que transforman **parte** de la energía en calor | Amortiguadores viscosos: el pistón obliga al fluido a pasar por orificios; la energía se disipa como calor. Solo una parte de la energía de entrada se disipa en el dispositivo | Taylor Devices, *Fluid Viscous Dampers* (notas técnicas); Constantinou & Symans (1992), NCEER-92-0032 |
| Las juntas y espacios permiten desplazarse sin golpearse inmediatamente | Las juntas de dilatación (de peine o modulares) dan holgura para movimientos térmicos y sísmicos; el golpeteo entre tablero y estribo es un modo de daño conocido | FHWA *Bridge Joint* manuales; informes post‑sismo (Northridge 1994, Chile 2010) |
| Controlar el movimiento para reducir daños y evitar el colapso | Objetivo de desempeño del diseño sísmico de puentes: «no colapso» ante el sismo de diseño, daño reparable | AASHTO LRFD Seismic; Caltrans SDC |
| Ningún diseño garantiza resistir cualquier terremoto | Los diseños se basan en un nivel de peligro (probabilidad de excedencia); un sismo mayor puede superarlo | AASHTO; ASCE 7 (concepto de peligro sísmico) |

## Decisiones visuales
- **Un solo puente** (`P.bridge`, plantilla v1.15) en todas las escenas: valle, terraplenes, estribos, zapatas, pilotes, pilas, cabezales, aisladores, tablero cajón, juntas de peine y disipadores. Los primeros planos son zooms de cámara que acompañan a la pila o al estribo.
- **Física**: suelo = `P.quakeGround` (suma de senos con pulsos al ritmo de la narración); respuesta = `P.sdof` (Newmark): aislado T = 2,5 s, ζ = 20 %; rígido T = 0,6 s, ζ = 5 %. Los disipadores reciben la velocidad relativa del tablero; las juntas se abren y cierran según el desplazamiento relativo (sin llegar a cero).
- **Amplificación**: los desplazamientos reales son de centímetros; se escalan para verse y se rotula «MOVIMIENTO AMPLIFICADO PARA VISUALIZACIÓN» en cada escena con sismo. El corte del aislador se limita a 0,5 de su altura (sin separación de capas).
- **Comparación honesta**: rígido = «más fuerza llega a las pilas»; controlado = «se desplaza más, con menos fuerza», con medidor de demanda calculado del modelo.
- **Sonido**: sin estruendos ni catástrofe; retumbo grave suave, crujido leve, flujo hidráulico, tráfico lejano. Música original (`MUS.epica`) en re menor que pasa a re mayor al hablar de control.
- Paleta del SUPERPROMPT (fondo #0C1720, cielo #25445A, hormigón #A8B1B5/#68767D, acero #596B77/#C4D0D5, elastómero #30383C, disipación #D9A35C, fuerzas #FF674F, movimiento controlado #38C6D0, terreno #786A59, vegetación #425D50, amarillo #FFD447, subtítulos #F6F8F7).
- «Gigantesco» y «miles de toneladas»: un puente de vigas de este tamaño (≈ 4 vanos) pesa del orden de miles de toneladas; se representa con flechas de peso sin cifra concreta.
