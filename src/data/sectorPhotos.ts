// Carrusel con que empieza el mapa de la portada: sectores exclusivos de
// Bogotá, en orden. GENERADO con `pnpm fotos` (SECTORS en
// scripts/fetch-country-photos.mjs): no editar a mano. Las imágenes NO están en
// el proyecto: se cargan desde Wikimedia Commons, con su autor y licencia.
import type { PlacePhoto } from "@/data/countryPhotos";

export const SECTOR_PHOTOS: (PlacePhoto & { name: string })[] = [
  {
    "name": "El Nogal, Chapinero",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Bogot%C3%A1%2C_edifiicios_del_barrio_El_Nogal.JPG/960px-Bogot%C3%A1%2C_edifiicios_del_barrio_El_Nogal.JPG",
    "width": 960,
    "height": 720,
    "page": "https://commons.wikimedia.org/wiki/File:Bogot%C3%A1,_edifiicios_del_barrio_El_Nogal.JPG",
    "author": "Felipe Restrepo Acosta",
    "license": "CC BY-SA 4.0"
  },
  {
    "name": "Hacienda Santa Bárbara, Usaquén",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Plaza_Hacienda_Santa_Barbara.jpg/960px-Plaza_Hacienda_Santa_Barbara.jpg",
    "width": 960,
    "height": 640,
    "page": "https://commons.wikimedia.org/wiki/File:Plaza_Hacienda_Santa_Barbara.jpg",
    "author": "Sfabarafe",
    "license": "CC BY-SA 3.0"
  },
  {
    "name": "Carrera Séptima, norte de Chapinero",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Bogot%C3%A1_Edificios_en_la_S%C3%A9otima_con_94.JPG/960px-Bogot%C3%A1_Edificios_en_la_S%C3%A9otima_con_94.JPG",
    "width": 960,
    "height": 720,
    "page": "https://commons.wikimedia.org/wiki/File:Bogot%C3%A1_Edificios_en_la_S%C3%A9otima_con_94.JPG",
    "author": "Felipe Restrepo Acosta",
    "license": "CC BY-SA 3.0"
  },
  {
    "name": "El Refugio, Chapinero",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Bogot%C3%A1%2C_carrera_7_con_calle_88_barrio_El_Refugio.JPG/960px-Bogot%C3%A1%2C_carrera_7_con_calle_88_barrio_El_Refugio.JPG",
    "width": 960,
    "height": 640,
    "page": "https://commons.wikimedia.org/wiki/File:Bogot%C3%A1,_carrera_7_con_calle_88_barrio_El_Refugio.JPG",
    "author": "Felipe Restrepo Acosta",
    "license": "CC BY-SA 3.0"
  },
  {
    "name": "Parque de la 93, El Chicó",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Bogot%C3%A1_barrio_El_Chic%C3%B3_-_Parque_de_la_93_tras_la_renovaci%C3%B3n.JPG/960px-Bogot%C3%A1_barrio_El_Chic%C3%B3_-_Parque_de_la_93_tras_la_renovaci%C3%B3n.JPG",
    "width": 960,
    "height": 720,
    "page": "https://commons.wikimedia.org/wiki/File:Bogot%C3%A1_barrio_El_Chic%C3%B3_-_Parque_de_la_93_tras_la_renovaci%C3%B3n.JPG",
    "author": "Felipe Restrepo Acosta",
    "license": "CC BY-SA 4.0"
  }
];
