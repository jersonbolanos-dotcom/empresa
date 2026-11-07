# FUENTES Y DECISIONES · «¿Cómo enviaban mensajes antes del teléfono? El telégrafo óptico de Claude Chappe» (Episodio 06)

## Fuentes consultadas (07-11-2026)
- **Musée des Arts et Métiers, ficha «Modèle : Télégraphe optique système Chappe»** (https://www.arts-et-metiers.net/musee/modele-telegraphe-optique-systeme-chappe):
  - presentado en 1792 a la Convención Nacional; transmitía órdenes en pocos minutos hasta las fronteras con señales ópticas codificadas;
  - semáforos separados unos 25 km, cada uno con un mástil, un regulador que pivota y dos indicadores móviles;
  - cada indicador lleva láminas de cobre y puede tomar 8 posiciones, de las que se usaron 7: en total, 196 señales correspondientes a un vocabulario elaborado por Chappe;
  - la línea París–Lille funcionaba en 1794 y la red se completó en 1830; la electricidad acabó con el sistema.
- **Smithsonian Libraries, «The Chappe Semaphore»** (https://sil.si.edu/Exhibitions/Underwater-web/uw-optic-02.htm): sistema de 1792; los brazos indicaban números que remitían a palabras; las señales se veían con telescopio y se retransmitían de torre en torre; las torres solían estar a unos 32 km; con mal tiempo o de noche era prácticamente inútil.
- **IEEE / ETHW, Dilhac**: el PDF indicado no existe en esa URL (la página está vacía). No se usó.

## Decisiones
- **Modelo maestro**: es una reconstrucción y no reproduce las medidas de una estación concreta. Torre de piedra, mástil, regulador con láminas, dos indicadores articulados con contrapeso, poleas en cada eje y cuerdas que bajan al manipulador. Se usa el mismo modelo en todas las escenas.
- **Manipulador**: el corte técnico muestra cómo el operador mueve una réplica pequeña y las cuerdas transmiten ese movimiento al mecanismo. Se rotula como reconstrucción didáctica del principio de mando.
- **Señales A, B y C**: son etiquetas didácticas, no letras del código de Chappe. En pantalla solo se da el dato verificado de «196 señales posibles ligadas a un vocabulario».
- **Distancias**: el texto dice «estaciones a decenas de kilómetros, según el terreno» (25 km según el museo; unos 32 km según el Smithsonian). La escena 3D separa las torres 9 km, y en vista general se marcan con indicadores porque a esa distancia apenas se ven, que es precisamente para lo que servían los telescopios.
- **París–Lille**: el trazado es esquemático, con 9 puntos de muestra; París y Lille están en su posición real y las estaciones intermedias no tienen ubicación exacta.
- **Caballo**: la comparación es conceptual y no da ninguna velocidad.
- **Clima**: niebla, lluvia intensa y noche reducen la visibilidad hasta impedir distinguir la señal. No se dice que toda lluvia detuviera el sistema.
- **Telégrafo eléctrico**: se presenta como otra tecnología (postes, cables y manipulador genérico del s. XIX), no como una transformación de las torres.
- **Claude Chappe**: inventor francés. El personaje del taller es una reconstrucción y su retrato es un grabado del siglo XIX.
- **Narración**: no contiene errores históricos. Dice «hace más de dos siglos» (1792–1794) y «en 1794 ya funcionaba una línea entre París y Lille», y ambas cosas coinciden con las fuentes.

## Voz
Archivo original `01_ENTRADA/audio/voz_original_telegrafo_chappe.mp3` (88,45 s; md5 4504573385e0ff81822934b43bfa64d2), sin alterar. Transcripción Whisper local y alineación (21 tramos, 229 palabras).

## Música y efectos
Originales: MUS.piano, MUS.pulso y MUS.epica. Efectos FX nuevos: galope, polea, telescopio y clicMorse, más viento y lluvia. Mezcla con sidechain a −14 LUFS.

## Mejora definitiva (V2 · `ASOMBROTECA_TELEGRAFO_OPTICO_FINAL.mp4`)
- **196 combinaciones**: el Musée des Arts et Métiers indica 8 posiciones por indicador, de las que se usaron 7, y 196 señales ligadas a un vocabulario. No precisa la etapa del código, así que en pantalla se atribuye la cifra al museo y las señales A, B y C se rotulan como «ilustrativas». La documentación aclara que el sistema y su código cambiaron con el tiempo.
- **Estación v2**: reconstrucción genérica de una arquitectura coherente. No es una estación concreta.
- **Cadena causa → efecto**: la torre A mantiene la señal, el telescopio de B muestra la misma configuración, el operador de B mueve el manipulador, las cuerdas accionan los brazos y B la reproduce. Después C observa a B y la copia. La señal transmitida conserva siempre la misma configuración, salvo el error de la escena de precisión, que se corrige.
- **Línea de visión**: es un esquema discontinuo. Se muestra primero una colina que tapa la vista y después la estación colocada en la cima.
- **Telégrafo eléctrico**: en esta escena sí se representa una corriente por el hilo, porque es otra tecnología y otra época.
- **Red antes de internet**: la analogía se limita a la existencia de una red de estaciones que retransmitía información. No se compara con protocolos ni con transmisión automática.
- **Narración**: no se detectaron datos discutibles.
