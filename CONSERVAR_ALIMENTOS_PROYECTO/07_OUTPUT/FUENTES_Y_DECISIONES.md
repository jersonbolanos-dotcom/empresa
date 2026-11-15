# Fuentes y decisiones · ¿Cómo conservaban los alimentos sin neveras?

Vídeo único, gancho C en segunda persona · plantilla v1.41 · consultado el 14-11-2026. Dos fuentes por dato.

> **Cómo se verificó.** Todas las páginas se leyeron **completas** (descargadas y leídas en su texto). Ningún dato sale solo del resumen del buscador.
> Fuentes: la FAO (organismo de la ONU para la alimentación), la Universidad de California (programa de extensión UC ANR / UC Master Food Preserver), Penn State Extension y Wikipedia como apoyo.
> Los artículos científicos de PubMed Central piden un captcha y no se pudieron leer, así que no se usan.

## Fuentes
- **[FAO]** FAO, *Manual on simple methods of meat preservation* (FAO Animal Production and Health Paper 79), capítulos 1, 2, 4 y 5: https://www.fao.org/4/x6932e/x6932e02.htm (y x6932e01, x6932e04, x6932e05)
- **[UC-AW]** UC Master Food Preserver (Universidad de California, UC ANR), «Water Activity and its Role in Food Preservation» (2025): https://ucanr.edu/program/uc-master-food-preserver-program/article/water-activity-and-its-role-food-preservation
- **[UC-TEC]** UC ANR, «Food Preservation Techniques» (PDF): https://ucanr.edu/sites/default/files/2020-09/336040.pdf
- **[UC-OC]** UC Master Food Preserver Program, Orange County (UC ANR), «About Food Preservation»: https://ucanr.edu/site/uc-master-food-preserver-program-orange-county/about-food-preservation
- **[PSU]** Penn State Extension, «Proper Processing of Wild Game and Fish»: https://extension.psu.edu/proper-processing-of-wild-game-and-fish
- **[WIKI-SAL]** Wikipedia, «Salting (food)»: https://en.wikipedia.org/wiki/Salting_(food)
- **[WIKI-CONS]** Wikipedia, «Food preservation»: https://en.wikipedia.org/wiki/Food_preservation
- **[WIKI-CH]** Wikipedia, «Jerky» (sección «Ch'arki»): https://en.wikipedia.org/wiki/Jerky

## Datos verificados
| Dato en el vídeo | Fuente 1 | Fuente 2 |
|---|---|---|
| La comida se daña porque crecen bacterias y hongos | [FAO] cap. 1: el deterioro de la carne lo causan las bacterias («food-spoiling bacteria»); cap. 2 y 5: crecimiento de bacterias y mohos | [UC-AW]: los organismos que dañan la comida son bacterias, levaduras y mohos |
| Para quedarse necesitan **agua** | [UC-AW]: «Most bacteria require a water activity above 0.91 to grow» | [FAO] cap. 5: valores mínimos de agua para que crezcan (bacterias 0,91; levaduras 0,88; mohos 0,80); [UC-TEC]: «spoilage bacteria require water to grow and reproduce» |
| … y **estar cómodos** (temperatura) | [PSU]: con más calor «spoilage occurs more quickly and bacteria… grow much faster» | [FAO] cap. 1: los microorganismos encuentran un ambiente favorable en la carne guardada a temperatura ambiente |
| La sal les saca el agua (y se arrugan) | [UC-TEC]: la sal funciona «by drawing water out of the spoilage organisms, thus preventing their growth» | [WIKI-SAL]: «Salt inhibits the growth of microorganisms by drawing water out of microbial cells through osmosis»; también [FAO] cap. 2: la sal mantiene seca la superficie e inhibe bacterias y mohos |
| El sol y el viento secan la carne | [FAO] cap. 2: secar la carne al aire y al sol «is the oldest method of meat preservation» | [WIKI-CONS]: el agua se quita «by using methods such as air drying, sun drying, smoking or wind drying»; [UC-TEC]: «Drying removes water from the food» |
| Como el charqui de los Andes | [WIKI-CH]: ch'arki (del quechua, carne seca y salada); el charqui andino se hace en Perú, Bolivia y Chile, sobre todo salando y secando al sol | [FAO] cap. 2: el «charque» de Brasil y otros países sudamericanos, conservado con sal y secado; cap. 5: el charque se conserva sin frío por su poca agua |
| El humo la seca y la cubre con sustancias que los frenan | [UC-TEC]: «Smoking adds smoke-born chemicals to food that help destroy potential spoilage organisms» | [WIKI-CONS]: el humo y la sal «improve on the drying process and add antimicrobial agents» (fenoles); [FAO] cap. 2: «Specific antimicrobial agents in smoke» |
| La fermentación invita a microbios buenos que llenan todo de ácido, y los malos no caben | [UC-OC]: las bacterias lácticas convierten azúcares en ácido láctico y «the lactic acid environment then prevents other microorganisms» de colonizar la comida | [UC-TEC]: la fermentación deja la comida con más ácido, «an inhospitable environment for spoilage bacteria»; [WIKI-CONS]: bacterias que producen ácido láctico |
| Les quitaban lo que necesitan para multiplicarse | Es el resumen de los datos de arriba: cada técnica quita agua o deja un ambiente hostil y así impide su crecimiento ([UC-TEC]: «preventing their growth»; [UC-AW]) | [FAO] cap. 4: los productos tradicionales de cap. 2 son estables sin frío «because of their low water activity» |

## Decisiones
- **V2** (la versión anterior está en `V1/`: vídeo, portada, `episodio.js` y mezcla; la voz no se tocó):
  - en el patio (gancho, abuela, final y portada) la carne ya no es un pedazo gigante: son tres pedazos medianos y tres tiras colgados en la cuerda, a tamaño creíble (≈ 65 % del ancho entre todos), con el patio, la casa y el fogón a la vista; la lupa de la portada va sobre uno de los pedazos;
  - sonido (plantilla v1.42): las etiquetas normales suenan a −10 dB y el «tin» (`FX.clave`) suena solo 4 veces, en los cuatro pasos (sal, sol y viento, humo, fermentación); antes sonaba 24 veces. Los golpes no cambian.
- **Voz:** una sola toma (Eleven v4, voz Dan; 889 caracteres, 58,8 s, 889 créditos). No hizo falta `[QUITAR]` ni `[PAUSA]`. Voz intacta (md5 por tramo, 22/22 iguales).
- **Guion:** a petición del usuario, la revelación cierra el círculo con el gancho («No era magia… Por eso la carne de tu abuela colgaba al sol… y no se pudría») y se quitó «Hoy existen normas para hacerlo seguro», porque no hay ninguna receta.
- **Seguridad, sin recetas:** no se dan cantidades, tiempos, temperaturas ni pasos; ninguna técnica se presenta como algo que hacer en casa. La vasija de la fermentación no dice qué alimento lleva.
- **Sin cifras ni fechas en la voz.** No se dice que el charqui «nació» con los Incas (en Wikipedia esa frase no tiene cita).
- **Metáfora:** los microbios como invitados colados en una fiesta que necesitan agua y estar cómodos; cada truco de la abuela les arruina la fiesta.
- **Exageraciones didácticas:** las bacterias con cara, gorros y colores, el tamaño de las gotitas y de los cristales de sal, el grano de sal que cae a cámara, la X roja y las bacterias que «rebotan» en la carne son ilustrativos. Las bacterias reales no tienen cara ni se ven a simple vista. «Se arrugan como pasas» es una imagen de la pérdida de agua por ósmosis.
- **Personajes:** abuela y niño dibujados, genéricos; las manos de la sal son las ilustradas del canal (`P.manoImg`).
- **Sin fotos, sin marcas, sin logos:** patio de finca, casa de adobe, fogón de leña y Andes dibujados.
- **Portada:** «SIN / NEVERA» con NEVERA en rojo y la etiqueta «¿CÓMO LO HACÍAN?»; la carne colgada al sol con una lupa de microscopio que muestra las bacterias y las gotitas; la marca debajo, fuera del dibujo (`--marca-y 1850`).
- **Red del entorno:** se añadieron ucanr.edu, la FAO y PubMed Central para leer las fuentes completas.
