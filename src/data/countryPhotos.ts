// Foto de la capital de cada destino del mapa de la portada (se muestra al
// tocar el país). GENERADO con `pnpm fotos` (scripts/fetch-country-photos.mjs):
// no editar a mano. Las imágenes NO están en el proyecto: se cargan desde
// Wikimedia Commons (thumb.wikimedia.org, o upload.wikimedia.org si ya es
// pequeña), con su autor y licencia.

export type PlacePhoto = {
  src: string;
  width: number;
  height: number;
  /** Página del archivo en Wikimedia Commons */
  page: string;
  author: string;
  license: string;
};
export type CountryPhoto = PlacePhoto & { capital: { es: string; en: string } };

/** Por nombre del destino (el de DESTINATIONS en worldMap.ts) */
export const COUNTRY_PHOTOS: Record<string, CountryPhoto> = {
  "Estados Unidos": {
    "capital": {
      "es": "Washington D. C.",
      "en": "Washington, D.C."
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Aerial_view_of_White_House_and_downtown%2C_Washington%2C_D.C_LCCN2010630891.jpg/500px-Aerial_view_of_White_House_and_downtown%2C_Washington%2C_D.C_LCCN2010630891.jpg",
    "width": 500,
    "height": 264,
    "page": "https://commons.wikimedia.org/wiki/File:Aerial_view_of_White_House_and_downtown,_Washington,_D.C_LCCN2010630891.jpg",
    "author": "Carol M. Highsmith",
    "license": "Public domain"
  },
  "Brasil": {
    "capital": {
      "es": "Brasilia",
      "en": "Brasília"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Planalto_Central_%28cropped%29.jpg/500px-Planalto_Central_%28cropped%29.jpg",
    "width": 500,
    "height": 239,
    "page": "https://commons.wikimedia.org/wiki/File:Planalto_Central_(cropped).jpg",
    "author": "Arturdiasr",
    "license": "CC BY-SA 4.0"
  },
  "España": {
    "capital": {
      "es": "Madrid",
      "en": "Madrid"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Madrid_%2838624991251%29.jpg/500px-Madrid_%2838624991251%29.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Madrid_(38624991251).jpg",
    "author": "Dmitry Dzhus from London",
    "license": "CC BY 2.0"
  },
  "Sudáfrica": {
    "capital": {
      "es": "Pretoria",
      "en": "Pretoria"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Pretoria_CBD1.jpg/500px-Pretoria_CBD1.jpg",
    "width": 500,
    "height": 219,
    "page": "https://commons.wikimedia.org/wiki/File:Pretoria_CBD1.jpg",
    "author": "Petrus Potgieter, Petrus at en.wikipedia",
    "license": "Public domain"
  },
  "China": {
    "capital": {
      "es": "Pekín",
      "en": "Beijing"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Skyline_of_Beijing_CBD_with_B-5906_approaching_%2820211016171955%29.jpg/500px-Skyline_of_Beijing_CBD_with_B-5906_approaching_%2820211016171955%29.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Skyline_of_Beijing_CBD_with_B-5906_approaching_(20211016171955).jpg",
    "author": "N509FZ",
    "license": "CC BY-SA 4.0"
  },
  "Canadá": {
    "capital": {
      "es": "Ottawa",
      "en": "Ottawa"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Ottawa_Montage_2020.jpg/500px-Ottawa_Montage_2020.jpg",
    "width": 500,
    "height": 910,
    "page": "https://commons.wikimedia.org/wiki/File:Ottawa_Montage_2020.jpg",
    "author": "Allice Hunter",
    "license": "CC BY-SA 4.0"
  },
  "Argentina": {
    "capital": {
      "es": "Buenos Aires",
      "en": "Buenos Aires"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Vista_a%C3%A9rea_de_la_Plaza_del_Congreso_10.jpg/500px-Vista_a%C3%A9rea_de_la_Plaza_del_Congreso_10.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_de_la_Plaza_del_Congreso_10.jpg",
    "author": "ProtoplasmaKid",
    "license": "CC BY-SA 4.0"
  },
  "Francia": {
    "capital": {
      "es": "París",
      "en": "Paris"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/500px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg",
    "width": 500,
    "height": 313,
    "page": "https://commons.wikimedia.org/wiki/File:La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques,_Paris_ao%C3%BBt_2014_(2).jpg",
    "author": "Yann Caradec from Paris, France",
    "license": "CC BY-SA 2.0"
  },
  "Nigeria": {
    "capital": {
      "es": "Abuya",
      "en": "Abuja"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/The_National_Assembly_Globe.jpg/500px-The_National_Assembly_Globe.jpg",
    "width": 500,
    "height": 325,
    "page": "https://commons.wikimedia.org/wiki/File:The_National_Assembly_Globe.jpg",
    "author": "Ovinuchi Prince Ejiohuo",
    "license": "CC BY-SA 4.0"
  },
  "Japón": {
    "capital": {
      "es": "Tokio",
      "en": "Tokyo"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Skyscrapers_of_Shinjuku_2009_January_%28revised%29.jpg/500px-Skyscrapers_of_Shinjuku_2009_January_%28revised%29.jpg",
    "width": 500,
    "height": 273,
    "page": "https://commons.wikimedia.org/wiki/File:Skyscrapers_of_Shinjuku_2009_January_(revised).jpg",
    "author": "Morio",
    "license": "CC BY-SA 3.0"
  },
  "México": {
    "capital": {
      "es": "Ciudad de México",
      "en": "Mexico City"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Sobrevuelos_CDMX_HJ2A5091_%2840386338731%29.jpg/500px-Sobrevuelos_CDMX_HJ2A5091_%2840386338731%29.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Sobrevuelos_CDMX_HJ2A5091_(40386338731).jpg",
    "author": "Gobierno CDMX",
    "license": "CC0"
  },
  "Chile": {
    "capital": {
      "es": "Santiago de Chile",
      "en": "Santiago"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Santiago_de_Chile%2C_Desde_Cerro_San_Crist%C3%B3bal_%28cropped%29.jpg/500px-Santiago_de_Chile%2C_Desde_Cerro_San_Crist%C3%B3bal_%28cropped%29.jpg",
    "width": 500,
    "height": 347,
    "page": "https://commons.wikimedia.org/wiki/File:Santiago_de_Chile,_Desde_Cerro_San_Crist%C3%B3bal_(cropped).jpg",
    "author": "Omnespsx (D•ES)",
    "license": "CC BY-SA 4.0"
  },
  "Alemania": {
    "capital": {
      "es": "Berlín",
      "en": "Berlin"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Cityscape_Berlin.jpg/500px-Cityscape_Berlin.jpg",
    "width": 500,
    "height": 256,
    "page": "https://commons.wikimedia.org/wiki/File:Cityscape_Berlin.jpg",
    "author": "Thomas Wolf, www.foto-tw.de",
    "license": "CC BY-SA 3.0"
  },
  "Kenia": {
    "capital": {
      "es": "Nairobi",
      "en": "Nairobi"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Nairobi%2C_view_from_KICC.JPG/500px-Nairobi%2C_view_from_KICC.JPG",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Nairobi,_view_from_KICC.JPG",
    "author": "Daryona",
    "license": "CC BY-SA 3.0"
  },
  "Corea del Sur": {
    "capital": {
      "es": "Seúl",
      "en": "Seoul"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/%EB%8D%95%EC%88%98%EA%B6%81%EC%9D%98_%EA%B0%80%EC%9D%84.jpg/500px-%EB%8D%95%EC%88%98%EA%B6%81%EC%9D%98_%EA%B0%80%EC%9D%84.jpg",
    "width": 500,
    "height": 334,
    "page": "https://commons.wikimedia.org/wiki/File:%EB%8D%95%EC%88%98%EA%B6%81%EC%9D%98_%EA%B0%80%EC%9D%84.jpg",
    "author": "라성민",
    "license": "CC BY-SA 3.0"
  },
  "Perú": {
    "capital": {
      "es": "Lima",
      "en": "Lima"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Plaza_Mayor_de_Lima-1.jpg/500px-Plaza_Mayor_de_Lima-1.jpg",
    "width": 500,
    "height": 279,
    "page": "https://commons.wikimedia.org/wiki/File:Plaza_Mayor_de_Lima-1.jpg",
    "author": "JulioKuLu",
    "license": "CC BY-SA 4.0"
  },
  "Italia": {
    "capital": {
      "es": "Roma",
      "en": "Rome"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Rome_Skyline_%288012016319%29.jpg/500px-Rome_Skyline_%288012016319%29.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Rome_Skyline_(8012016319).jpg",
    "author": "Bert Kaufmann from Roermond, Netherlands",
    "license": "CC BY-SA 2.0"
  },
  "Marruecos": {
    "capital": {
      "es": "Rabat",
      "en": "Rabat"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Kasbah_des_Oudaias_P1060356.JPG/500px-Kasbah_des_Oudaias_P1060356.JPG",
    "width": 500,
    "height": 281,
    "page": "https://commons.wikimedia.org/wiki/File:Kasbah_des_Oudaias_P1060356.JPG",
    "author": "Pline",
    "license": "CC BY-SA 3.0"
  },
  "Arabia Saudita": {
    "capital": {
      "es": "Riad",
      "en": "Riyadh"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Riyadh_Skyline.jpg/500px-Riyadh_Skyline.jpg",
    "width": 500,
    "height": 281,
    "page": "https://commons.wikimedia.org/wiki/File:Riyadh_Skyline.jpg",
    "author": "B.alotaby",
    "license": "CC BY-SA 4.0"
  },
  "Egipto": {
    "capital": {
      "es": "El Cairo",
      "en": "Cairo"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Cairo_Skyline_%282020%29.jpg/500px-Cairo_Skyline_%282020%29.jpg",
    "width": 500,
    "height": 295,
    "page": "https://commons.wikimedia.org/wiki/File:Cairo_Skyline_(2020).jpg",
    "author": "Faris El-Gwely",
    "license": "CC BY 4.0"
  },
  "Tailandia": {
    "capital": {
      "es": "Bangkok",
      "en": "Bangkok"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Temple_of_the_Emerald_of_buddha_or_Wat_Phra_Kaew_%28cropped%29.jpg/500px-Temple_of_the_Emerald_of_buddha_or_Wat_Phra_Kaew_%28cropped%29.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Temple_of_the_Emerald_of_buddha_or_Wat_Phra_Kaew_(cropped).jpg",
    "author": "Preecha.MJ",
    "license": "CC BY-SA 4.0"
  },
  "Emiratos Árabes": {
    "capital": {
      "es": "Abu Dhabi",
      "en": "Abu Dhabi"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/%D0%90%D0%B1%D1%83-%D0%94%D0%B0%D0%B1%D0%B8_%28Abu_Dhabi%29_-_panoramio_%281%29.jpg/500px-%D0%90%D0%B1%D1%83-%D0%94%D0%B0%D0%B1%D0%B8_%28Abu_Dhabi%29_-_panoramio_%281%29.jpg",
    "width": 500,
    "height": 288,
    "page": "https://commons.wikimedia.org/wiki/File:%D0%90%D0%B1%D1%83-%D0%94%D0%B0%D0%B1%D0%B8_(Abu_Dhabi)_-_panoramio_(1).jpg",
    "author": "Валерий Дед",
    "license": "CC BY 3.0"
  },
  "India": {
    "capital": {
      "es": "Nueva Delhi",
      "en": "New Delhi"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/India_Gate_Legendary_Saga_Of_Supreme_Sacrifice.jpg/500px-India_Gate_Legendary_Saga_Of_Supreme_Sacrifice.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:India_Gate_Legendary_Saga_Of_Supreme_Sacrifice.jpg",
    "author": "Navonildutta4",
    "license": "CC BY-SA 4.0"
  },
  "Ecuador": {
    "capital": {
      "es": "Quito",
      "en": "Quito"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/FACHADA_ASAMBLEA_NACIONAL._QUITO%2C_20_DE_FEBRERO_2020._01.jpg/500px-FACHADA_ASAMBLEA_NACIONAL._QUITO%2C_20_DE_FEBRERO_2020._01.jpg",
    "width": 500,
    "height": 244,
    "page": "https://commons.wikimedia.org/wiki/File:FACHADA_ASAMBLEA_NACIONAL._QUITO,_20_DE_FEBRERO_2020._01.jpg",
    "author": "Asamblea Nacional del Ecuador",
    "license": "CC BY-SA 2.0"
  },
  "Venezuela": {
    "capital": {
      "es": "Caracas",
      "en": "Caracas"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Caracas_desde_el_%C3%A1vila.jpg/500px-Caracas_desde_el_%C3%A1vila.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Caracas_desde_el_%C3%A1vila.jpg",
    "author": "Olga Berrios",
    "license": "CC BY 2.0"
  },
  "Bolivia": {
    "capital": {
      "es": "La Paz",
      "en": "La Paz"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/La_Paz-center.jpg/500px-La_Paz-center.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:La_Paz-center.jpg",
    "author": "Wikimedia Commons",
    "license": "CC BY-SA 3.0"
  },
  "Paraguay": {
    "capital": {
      "es": "Asunción",
      "en": "Asunción"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Asunci%C3%B3n_Paraguay.jpg/500px-Asunci%C3%B3n_Paraguay.jpg",
    "width": 500,
    "height": 283,
    "page": "https://commons.wikimedia.org/wiki/File:Asunci%C3%B3n_Paraguay.jpg",
    "author": "AnonymousUnknown author",
    "license": "CC BY-SA 4.0"
  },
  "Uruguay": {
    "capital": {
      "es": "Montevideo",
      "en": "Montevideo"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/The_City_%28198895997%29.jpeg/500px-The_City_%28198895997%29.jpeg",
    "width": 500,
    "height": 281,
    "page": "https://commons.wikimedia.org/wiki/File:The_City_(198895997).jpeg",
    "author": "Marcelo Campi",
    "license": "CC BY-SA 3.0"
  },
  "Senegal": {
    "capital": {
      "es": "Dakar",
      "en": "Dakar"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Pointe_des_Almadies_-_Senegal.jpg/500px-Pointe_des_Almadies_-_Senegal.jpg",
    "width": 500,
    "height": 374,
    "page": "https://commons.wikimedia.org/wiki/File:Pointe_des_Almadies_-_Senegal.jpg",
    "author": "Jeff Attaway",
    "license": "CC BY 2.0"
  },
  "Ghana": {
    "capital": {
      "es": "Acra",
      "en": "Accra"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Accra_town.jpg/500px-Accra_town.jpg",
    "width": 500,
    "height": 281,
    "page": "https://commons.wikimedia.org/wiki/File:Accra_town.jpg",
    "author": "Goldenwabbit",
    "license": "CC BY-SA 4.0"
  },
  "Angola": {
    "capital": {
      "es": "Luanda",
      "en": "Luanda"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Luanda_feb09_ost01.jpg/500px-Luanda_feb09_ost01.jpg",
    "width": 500,
    "height": 332,
    "page": "https://commons.wikimedia.org/wiki/File:Luanda_feb09_ost01.jpg",
    "author": "Lars Rohwer",
    "license": "CC BY-SA 3.0"
  },
  "Etiopía": {
    "capital": {
      "es": "Adís Abeba",
      "en": "Addis Ababa"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/AddisView.jpg/500px-AddisView.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:AddisView.jpg",
    "author": "DaneyWiki",
    "license": "CC BY-SA 4.0"
  },
  "Guatemala": {
    "capital": {
      "es": "Ciudad de Guatemala",
      "en": "Guatemala City"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Buildings_in_Guatemala_City.jpg/500px-Buildings_in_Guatemala_City.jpg",
    "width": 500,
    "height": 266,
    "page": "https://commons.wikimedia.org/wiki/File:Buildings_in_Guatemala_City.jpg",
    "author": "BladimiroAlvarado",
    "license": "CC BY-SA 4.0"
  },
  "Belice": {
    "capital": {
      "es": "Belmopán",
      "en": "Belmopan"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Belmopan_Parliament.jpg/500px-Belmopan_Parliament.jpg",
    "width": 500,
    "height": 370,
    "page": "https://commons.wikimedia.org/wiki/File:Belmopan_Parliament.jpg",
    "author": "Haakon S. Krohn",
    "license": "CC BY-SA 3.0"
  },
  "Honduras": {
    "capital": {
      "es": "Tegucigalpa",
      "en": "Tegucigalpa"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Centro_historico_de_Tegucigalpa_y_Comayag%C3%BCela.jpg/500px-Centro_historico_de_Tegucigalpa_y_Comayag%C3%BCela.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Centro_historico_de_Tegucigalpa_y_Comayag%C3%BCela.jpg",
    "author": "Luis Alfredo Romero",
    "license": "CC BY-SA 4.0"
  },
  "El Salvador": {
    "capital": {
      "es": "San Salvador",
      "en": "San Salvador"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Monumento_al_Salvador_del_Mundo_1.jpg/500px-Monumento_al_Salvador_del_Mundo_1.jpg",
    "width": 500,
    "height": 281,
    "page": "https://commons.wikimedia.org/wiki/File:Monumento_al_Salvador_del_Mundo_1.jpg",
    "author": "Frankjh",
    "license": "CC BY-SA 3.0"
  },
  "Nicaragua": {
    "capital": {
      "es": "Managua",
      "en": "Managua"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/%D0%9A%D0%B0%D1%84%D0%B5%D0%B4%D1%80%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D1%81%D0%BE%D0%B1%D0%BE%D1%80_%D0%B2_%D0%9C%D0%B0%D0%BD%D0%B0%D0%B3%D1%83%D0%B0_%28cropped%29.jpg/500px-%D0%9A%D0%B0%D1%84%D0%B5%D0%B4%D1%80%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D1%81%D0%BE%D0%B1%D0%BE%D1%80_%D0%B2_%D0%9C%D0%B0%D0%BD%D0%B0%D0%B3%D1%83%D0%B0_%28cropped%29.jpg",
    "width": 500,
    "height": 409,
    "page": "https://commons.wikimedia.org/wiki/File:%D0%9A%D0%B0%D1%84%D0%B5%D0%B4%D1%80%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D1%81%D0%BE%D0%B1%D0%BE%D1%80_%D0%B2_%D0%9C%D0%B0%D0%BD%D0%B0%D0%B3%D1%83%D0%B0_(cropped).jpg",
    "author": "Виктор Пинчук",
    "license": "CC BY-SA 4.0"
  },
  "Costa Rica": {
    "capital": {
      "es": "San José",
      "en": "San José"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Cityscape_of_San_Jos%C3%A9%2C_Costa_Rica_%28253552473%29.jpg/500px-Cityscape_of_San_Jos%C3%A9%2C_Costa_Rica_%28253552473%29.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Cityscape_of_San_Jos%C3%A9,_Costa_Rica_(253552473).jpg",
    "author": "Xlionheartx",
    "license": "CC BY 3.0"
  },
  "Panamá": {
    "capital": {
      "es": "Ciudad de Panamá",
      "en": "Panama City"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Panama_City_Skyline_1.jpg/500px-Panama_City_Skyline_1.jpg",
    "width": 500,
    "height": 281,
    "page": "https://commons.wikimedia.org/wiki/File:Panama_City_Skyline_1.jpg",
    "author": "Dr. Thomas Liptak",
    "license": "CC BY-SA 4.0"
  },
  "Cuba": {
    "capital": {
      "es": "La Habana",
      "en": "Havana"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Cuba_libre_%286941395159%29.jpg/500px-Cuba_libre_%286941395159%29.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Cuba_libre_(6941395159).jpg",
    "author": "Christopher Michel",
    "license": "CC BY 2.0"
  },
  "República Dominicana": {
    "capital": {
      "es": "Santo Domingo",
      "en": "Santo Domingo"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Santo_Domingo_%28Dominican_Republic%29_taken_atop_Novocentro_tower_viewing_the_city_to_the_southwest_2010.jpg/500px-Santo_Domingo_%28Dominican_Republic%29_taken_atop_Novocentro_tower_viewing_the_city_to_the_southwest_2010.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Santo_Domingo_(Dominican_Republic)_taken_atop_Novocentro_tower_viewing_the_city_to_the_southwest_2010.jpg",
    "author": "Jjc09",
    "license": "Public domain"
  },
  "Haití": {
    "capital": {
      "es": "Puerto Príncipe",
      "en": "Port-au-Prince"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/US_Navy_100221-N-5787K-002_An_aerial_view_of_the_logistical_area_near_the_port_in_Port-au-Prince_%28cropped%29.jpg/500px-US_Navy_100221-N-5787K-002_An_aerial_view_of_the_logistical_area_near_the_port_in_Port-au-Prince_%28cropped%29.jpg",
    "width": 500,
    "height": 353,
    "page": "https://commons.wikimedia.org/wiki/File:US_Navy_100221-N-5787K-002_An_aerial_view_of_the_logistical_area_near_the_port_in_Port-au-Prince_(cropped).jpg",
    "author": "U.S. Navy photo by Mass Communication Specialist 2nd Class Meranda Keller",
    "license": "Public domain"
  },
  "Puerto Rico": {
    "capital": {
      "es": "San Juan",
      "en": "San Juan"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/San_Juan%2C_Puerto_Rico_%282529298606%29.jpg/500px-San_Juan%2C_Puerto_Rico_%282529298606%29.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:San_Juan,_Puerto_Rico_(2529298606).jpg",
    "author": "James Willamor from Raleigh, NC, USA",
    "license": "CC BY-SA 2.0"
  },
  "Guyana": {
    "capital": {
      "es": "Georgetown",
      "en": "Georgetown"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/St_George%27s_Cathedral.jpg/500px-St_George%27s_Cathedral.jpg",
    "width": 500,
    "height": 123,
    "page": "https://commons.wikimedia.org/wiki/File:St_George%27s_Cathedral.jpg",
    "author": "Johnldasilva",
    "license": "CC BY 3.0"
  },
  "Surinam": {
    "capital": {
      "es": "Paramaribo",
      "en": "Paramaribo"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Waterkant_Paramaribo_with_the_Unesco_Heritage_Buildings.jpg/500px-Waterkant_Paramaribo_with_the_Unesco_Heritage_Buildings.jpg",
    "width": 500,
    "height": 218,
    "page": "https://commons.wikimedia.org/wiki/File:Waterkant_Paramaribo_with_the_Unesco_Heritage_Buildings.jpg",
    "author": "Rafaeljantz",
    "license": "CC BY-SA 4.0"
  },
  "Portugal": {
    "capital": {
      "es": "Lisboa",
      "en": "Lisbon"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Lisboa837.png/500px-Lisboa837.png",
    "width": 500,
    "height": 307,
    "page": "https://commons.wikimedia.org/wiki/File:Lisboa837.png",
    "author": "Lacobrigo",
    "license": "CC BY-SA 4.0"
  },
  "Reino Unido": {
    "capital": {
      "es": "Londres",
      "en": "London"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/500px-London_Skyline_%28125508655%29.jpeg",
    "width": 500,
    "height": 281,
    "page": "https://commons.wikimedia.org/wiki/File:London_Skyline_(125508655).jpeg",
    "author": "Ilya Grigorik",
    "license": "CC BY-SA 3.0"
  },
  "Países Bajos": {
    "capital": {
      "es": "Ámsterdam",
      "en": "Amsterdam"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Amsterdam_airphoto.jpg/500px-Amsterdam_airphoto.jpg",
    "width": 500,
    "height": 330,
    "page": "https://commons.wikimedia.org/wiki/File:Amsterdam_airphoto.jpg",
    "author": "Amsterdam Municipal Department for the Preservation and Restoration of Historic ",
    "license": "Attribution"
  },
  "Suiza": {
    "capital": {
      "es": "Berna",
      "en": "Bern"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Bern_luftaufnahme.png/500px-Bern_luftaufnahme.png",
    "width": 500,
    "height": 337,
    "page": "https://commons.wikimedia.org/wiki/File:Bern_luftaufnahme.png",
    "author": "de:Benutzer:Reaast",
    "license": "Public domain"
  },
  "Suecia": {
    "capital": {
      "es": "Estocolmo",
      "en": "Stockholm"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Stockholm_gamlastan_etc.jpg/500px-Stockholm_gamlastan_etc.jpg",
    "width": 500,
    "height": 351,
    "page": "https://commons.wikimedia.org/wiki/File:Stockholm_gamlastan_etc.jpg",
    "author": "JZ",
    "license": "CC BY-SA 3.0"
  },
  "Polonia": {
    "capital": {
      "es": "Varsovia",
      "en": "Warsaw"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Castle_Square_%2822346p%29.jpg/500px-Castle_Square_%2822346p%29.jpg",
    "width": 500,
    "height": 394,
    "page": "https://commons.wikimedia.org/wiki/File:Castle_Square_(22346p).jpg",
    "author": "Rhododendrites",
    "license": "CC BY-SA 4.0"
  }
};

/** Ciudades del recorrido por Colombia, por nombre (el de CITIES en worldMap.ts) */
export const CITY_PHOTOS: Record<string, PlacePhoto> = {
  "Bogotá": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Centro_internacional.JPG/500px-Centro_internacional.JPG",
    "width": 500,
    "height": 281,
    "page": "https://commons.wikimedia.org/wiki/File:Centro_internacional.JPG",
    "author": "Felipe Restrepo Acosta",
    "license": "CC BY-SA 3.0"
  },
  "Medellín": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Panor%C3%A1mica_de_Medell%C3%ADn_desde_el_Cerro_El_Picacho.jpg/500px-Panor%C3%A1mica_de_Medell%C3%ADn_desde_el_Cerro_El_Picacho.jpg",
    "width": 500,
    "height": 281,
    "page": "https://commons.wikimedia.org/wiki/File:Panor%C3%A1mica_de_Medell%C3%ADn_desde_el_Cerro_El_Picacho.jpg",
    "author": "Luis90f",
    "license": "CC BY-SA 4.0"
  },
  "Cali": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Panor%C3%A1mica_nocturna_de_Cali_2023.jpg/500px-Panor%C3%A1mica_nocturna_de_Cali_2023.jpg",
    "width": 500,
    "height": 281,
    "page": "https://commons.wikimedia.org/wiki/File:Panor%C3%A1mica_nocturna_de_Cali_2023.jpg",
    "author": "Futbolero",
    "license": "CC BY-SA 4.0"
  },
  "Barranquilla": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Barranquilla_Montage.jpg/500px-Barranquilla_Montage.jpg",
    "width": 500,
    "height": 600,
    "page": "https://commons.wikimedia.org/wiki/File:Barranquilla_Montage.jpg",
    "author": "Mr.Jhosimar",
    "license": "CC BY-SA 3.0"
  },
  "Cartagena": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/View_of_Cartagena_from_Convento_de_Santa_Cruz_de_la_Popa_01.jpg/500px-View_of_Cartagena_from_Convento_de_Santa_Cruz_de_la_Popa_01.jpg",
    "width": 500,
    "height": 285,
    "page": "https://commons.wikimedia.org/wiki/File:View_of_Cartagena_from_Convento_de_Santa_Cruz_de_la_Popa_01.jpg",
    "author": "Bernard Gagnon",
    "license": "CC BY-SA 4.0"
  },
  "Cúcuta": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/C%C3%BAcuta_desde_Torcoroma%2C_C%C3%BAcuta.jpeg/500px-C%C3%BAcuta_desde_Torcoroma%2C_C%C3%BAcuta.jpeg",
    "width": 500,
    "height": 253,
    "page": "https://commons.wikimedia.org/wiki/File:C%C3%BAcuta_desde_Torcoroma,_C%C3%BAcuta.jpeg",
    "author": "EEIM",
    "license": "CC BY-SA 3.0"
  },
  "Bucaramanga": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Floridablanca%2C_Sder-Colombia_enr_2022.jpg/500px-Floridablanca%2C_Sder-Colombia_enr_2022.jpg",
    "width": 500,
    "height": 316,
    "page": "https://commons.wikimedia.org/wiki/File:Floridablanca,_Sder-Colombia_enr_2022.jpg",
    "author": "EEIM",
    "license": "CC BY-SA 4.0"
  },
  "Ibagué": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/13/Ibagu%C3%A9%2C_Colombia.jpg/500px-Ibagu%C3%A9%2C_Colombia.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Ibagu%C3%A9,_Colombia.jpg",
    "author": "Ridiculopathy",
    "license": "CC0"
  },
  "Santa Marta": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/2018_Santa_Marta_%28Colombia%29_-_Edificio_de_los_Bancos_en_el_Parque_Sim%C3%B3n_Bol%C3%ADvar.jpg/500px-2018_Santa_Marta_%28Colombia%29_-_Edificio_de_los_Bancos_en_el_Parque_Sim%C3%B3n_Bol%C3%ADvar.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:2018_Santa_Marta_(Colombia)_-_Edificio_de_los_Bancos_en_el_Parque_Sim%C3%B3n_Bol%C3%ADvar.jpg",
    "author": "Felipe Restrepo Acosta",
    "license": "CC BY-SA 4.0"
  },
  "Villavicencio": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Villavicencio_Colombia_by_David.png/500px-Villavicencio_Colombia_by_David.png",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Villavicencio_Colombia_by_David.png",
    "author": "David from Miami, United states",
    "license": "CC BY 2.0"
  },
  "Pereira": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Alto_del_Nudo_-_Pereira.jpg/500px-Alto_del_Nudo_-_Pereira.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Alto_del_Nudo_-_Pereira.jpg",
    "author": "KeilaA",
    "license": "CC BY-SA 3.0"
  },
  "Pasto": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/San_Juan_de_Pasto_de_noche.jpg/500px-San_Juan_de_Pasto_de_noche.jpg",
    "width": 500,
    "height": 374,
    "page": "https://commons.wikimedia.org/wiki/File:San_Juan_de_Pasto_de_noche.jpg",
    "author": "Jorgelrm",
    "license": "CC BY-SA 3.0"
  },
  "Montería": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Monteria_13.jpg/500px-Monteria_13.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Monteria_13.jpg",
    "author": "Carlos Crismatt Mouthon",
    "license": "CC BY-SA 3.0"
  },
  "Neiva": {
    "src": "https://upload.wikimedia.org/wikipedia/commons/9/92/Centro_de_Neiva.jpg",
    "width": 500,
    "height": 667,
    "page": "https://commons.wikimedia.org/wiki/File:Centro_de_Neiva.jpg",
    "author": "KIKESITO(Kikesito)",
    "license": "Public domain"
  }
};
