# Fuentes y decisiones · «¿Cómo construyen túneles debajo de los ríos sin que se inunden?»

## Datos verificados
| Afirmación / visual | Verificación | Fuente |
|---|---|---|
| Muchos túneles bajo ríos se excavan bajo el lecho con tuneladoras de escudo | Las tuneladoras de frente presurizado (EPB y de lodos) permiten excavar bajo el nivel freático en suelos blandos; ejemplos: túneles bajo el Elba (Hamburgo, 4.º tubo), el Támesis (Crossrail/Thames Tideway), el Escalda (Amberes) | ITA-AITES WG14 / WG17, *Guidelines for the use of mechanized tunnelling*; BTS/ICE, *Closed-face tunnelling machines and ground stability* (2005) |
| No todos se construyen así | Alternativas: túneles sumergidos (prefabricados y hundidos en una zanja del lecho), cajones neumáticos y métodos convencionales | ITA WG11, *Immersed and floating tunnels* |
| Tuneladora EPB: la cámara llena de terreno acondicionado sostiene el frente; el tornillo sinfín regula la salida | En una EPB la presión de soporte se mantiene con el propio terreno excavado y acondicionado (espumas/aditivos) en la cámara; se controla con el empuje y la velocidad del tornillo | EFNARC, *Specification and guidelines for the use of specialist products for mechanised tunnelling* (2005); Maidl et al., *Mechanised Shield Tunnelling* (2.ª ed., 2012) |
| EPB ≠ tuneladora de lodos | La de lodos (hidroescudo) sostiene el frente con bentonita presurizada y extrae por tuberías; aquí solo se representa la EPB (tornillo + cinta + vagonetas) | Maidl et al. (2012); BTS/ICE (2005) |
| La cabeza de corte gira; el escudo avanza con cilindros que empujan contra el último anillo | Los cilindros de empuje se apoyan en el revestimiento ya colocado; el escudo no gira | Maidl et al. (2012) |
| Dovelas prefabricadas forman anillos (aquí 6 + llave); juntas escalonadas entre anillos | Configuraciones habituales 5+1 a 8+1; el erector coloca cada dovela y la llave cierra el anillo | ITA WG2, *Guidelines for the design of segmental tunnel linings* (2019) |
| Sellos elastoméricos en las juntas | Perfiles de EPDM en ranuras perimetrales que se comprimen al montar; su estanqueidad depende de la compresión, la separación y la presión del agua (se ensayan a presión) | ITA WG2 (2019); STUVA, *Recommendations for testing and application of sealing gaskets in segmental linings* |
| Relleno del espacio anular | El hueco entre el terreno excavado y el anillo se rellena con lechada/mortero inyectado por la cola del escudo; es distinto del sello de las juntas | EFNARC (2005); ITA WG14 |
| El túnel terminado necesita instalaciones posteriores | Vía, catenaria, ventilación, iluminación y sistemas se instalan después de la obra civil | Práctica general de túneles ferroviarios |

## Decisiones
- **Un solo sistema de coordenadas** (`P.TUN`, plantilla v1.16): el túnel va bajo el lecho, en la capa de arcilla (terreno típico para una EPB), con cobertura bajo el lecho. Sin profundidades ni presiones numéricas inventadas.
- **Secciones**: longitudinal (por el eje del túnel, el río aparece en sección) y transversal (el río fluye a lo ancho, el túnel es un círculo). La cámara desciende y asciende por la misma sección.
- **Presiones**: flechas cualitativas; la presión de soporte se muestra en un indicador con «margen de diseño» (no «mayor que toda la presión exterior»); la aguja oscila dentro del margen.
- **Ciclo de la máquina**: excavar empujando contra el último anillo → montar el anillo; en «excava y reviste» el tiempo se acelera y se rotula.
- **Impermeabilización**: se rotula que depende del diseño, la instalación y la presión (no es absoluta).
- Paleta del SUPERPROMPT (#0B1821, #123D54, #2987A7, #D7EDF0, #76624D, #A27B59, #C2A67C, #8E8B80, #626C71, #354751, #A9BCC5, #E4A33B, #B4BEC0, #303C43, #FF735A, #43D0C6, #FFD447, #F4F7F8). Música y efectos originales sintetizados (sin material protegido).

## Revisión V2 (coherencia mecánica)
- **Ciclo EPB**: avance con los cilindros apoyados en el último anillo → retracción de los cilindros del sector a montar → montaje del anillo con el erector → apoyo de los cilindros en el anillo nuevo → siguiente avance (Herrenknecht, descripciones técnicas de EPB Shield; Maidl et al., 2012; FHWA, *Technical Manual for Design and Construction of Road Tunnels — Civil Elements*, FHWA-NHI-10-034, cap. 7 y 10).
- **Regulación de la presión**: en una EPB la presión de soporte se mantiene con el material acondicionado en la cámara y se ajusta con la velocidad de avance y la de extracción del tornillo sinfín (FHWA-NHI-10-034; BTS/ICE 2005). Se representa con un indicador cualitativo (baja · margen de diseño · alta), sin cifras.
- **Rojo / cian**: rojo = presión exterior del terreno y del agua subterránea; cian = presión de soporte del material en la cámara. El empuje de los cilindros se muestra aparte como movimiento mecánico, no como una flecha de presión. Se rotula que las flechas son fuerzas, no movimiento del terreno.
- **Juntas escalonadas**: las juntas longitudinales de anillos consecutivos se desfasan para no formar juntas cruciformes continuas (ITA WG2, 2019).
- **Aplicabilidad**: la EPB es adecuada en suelos cohesivos o acondicionables; en otros terrenos se usan hidroescudos de lodos u otros métodos. No todos los túneles bajo ríos se construyen así (también túneles sumergidos).
