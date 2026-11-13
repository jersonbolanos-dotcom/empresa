# Fuentes y decisiones · ¿Mito o verdad? Cap. 2 · ¿Cerrar las apps que quedan abiertas ahorra batería?

Comprobado el 13 de noviembre de 2026 en las páginas oficiales de Apple y Google (texto leído en la propia página).
Regla de la serie: solo lo publicado; sin cifras si no hay medición fiable; las deducciones se dicen con «puede». Veredicto: **MITO**.

## Datos verificados

| Dato en el vídeo | Fuente 1 | Fuente 2 |
|---|---|---|
| Al salir de una app, el sistema no la deja funcionando: la suspende («la congela») y casi no usa recursos ni energía | [Apple Developer · Configuring background execution modes](https://developer.apple.com/documentation/xcode/configuring-background-execution-modes): «Typically, an app is in a suspended state when it's in the background» · [Apple · Close an app](https://support.apple.com/en-us/109359): «Recently used apps only use resources and power when they're active or when they're performing specific background tasks or services» | [Android Developers · Processes and app lifecycle](https://developer.android.com/guide/components/activities/process-lifecycle): «apps should cease all work while in the cached state» |
| Lo dicen Apple y Google en sus páginas de ayuda: cerrar las apps no ahorra batería | [Apple · Close an app on your iPhone](https://support.apple.com/en-us/109359): «closing all of your apps does not impact your device's overall performance» y «You should close an app only if it's unresponsive» | [Google · Pixel: encontrar, abrir y cerrar apps](https://support.google.com/pixelphone/answer/2781964?hl=en): «Even if you don't close apps, you won't run out of memory or battery. Android manages these automatically» |
| Abrirla desde cero le cuesta más trabajo al celular que retomarla | [Android Developers · App startup time](https://developer.android.com/topic/performance/issues/launch-time): en el arranque en frío «the system and app have more work to do»; «A hot start of your app has lower overhead than a cold start» | [Apple Developer · Reducing your app's launch time](https://developer.apple.com/documentation/xcode/reducing-your-app-s-launch-time): «a resume is when your app already had a process alive, even if suspended… A resume is generally much faster» |
| Sí conviene cerrarla si se traba | [Apple · Close an app](https://support.apple.com/en-us/109359): «If an app won't respond or seems frozen, you can close it» | [Google · Pixel: liberar espacio](https://support.google.com/pixelphone/answer/2840863?hl=en): «You don't usually need to close apps. But if an app isn't responding, you can try to close or force stop the app» |
| …o si usa la ubicación o la música de fondo y ya no la necesitas (esas sí siguen trabajando en segundo plano) | [Apple Developer · Configuring background execution modes](https://developer.apple.com/documentation/xcode/configuring-background-execution-modes): modos que permiten seguir en segundo plano «such as playing audio, receiving location updates» | [Android Developers · Foreground services](https://developer.android.com/develop/background-work/services/fgs): «A music player app that plays music in a foreground service» y «A fitness app that records a user's run in a foreground service» |

## Decisiones

- **Deducción, no medición:** «cerrarla puede gastar MÁS batería, no menos» se deduce de que abrirla desde cero cuesta más trabajo que retomarla. Ni Apple ni Google publican una cifra, así que se dice con «puede» y las baterías del vídeo no llevan números.
- **«Congela» = «suspende».** Apple habla de «suspended state» y Android de proceso «cached». «Congelar» es la imagen para que se entienda. «Casi no gasta batería» (y no «no gasta nada») porque Apple matiza que puede hacer «specific background tasks».
- **Sin porcentajes.** El único número en pantalla es el contador de carga de la app (0 → 100 %), que es una animación de «carga», no un dato.
- **Ubicación y música:** se usa «ubicación» (no «GPS») porque así lo dicen las dos fuentes (location updates / registro de una carrera).
- **Metáfora:** libro con marcapáginas (app congelada = libro abierto con el marcapáginas; cerrarla = cerrar el libro y tirar el marcapáginas). Es una imagen, no una escala.
- **Sin marcas:** celular, apps e iconos genéricos dibujados. «Apple» y «Google» aparecen solo como texto en dos páginas de «AYUDA», sin logos.
- **Voz:** ElevenLabs Eleven v4, voz Dan, 2 tomas (781 caracteres cada una, 1.562 créditos); elegida la toma 1 (52,1 s). Voz intacta (24/24 tramos idénticos en el QC).
- **Manos:** las manos ilustradas del canal (`P.manoImg`, v1.35), a petición del usuario.
- **No usado:** la idea de que cerrar apps «borra datos» o «libera RAM para que el celular vaya más rápido»: no forma parte de la pregunta y las fuentes no la miden.
