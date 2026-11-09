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
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/US_Capitol_east_side.JPG/500px-US_Capitol_east_side.JPG",
    "width": 500,
    "height": 265,
    "page": "https://commons.wikimedia.org/wiki/File:US_Capitol_east_side.JPG",
    "author": "Martin Falbisoner",
    "license": "CC BY-SA 3.0"
  },
  "Brasil": {
    "capital": {
      "es": "Brasilia",
      "en": "Brasília"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Catedral_Metropolitana_de_Brasilia.jpg/500px-Catedral_Metropolitana_de_Brasilia.jpg",
    "width": 500,
    "height": 467,
    "page": "https://commons.wikimedia.org/wiki/File:Catedral_Metropolitana_de_Brasilia.jpg",
    "author": "Tissiana de A. de Souza",
    "license": "CC BY-SA 4.0"
  },
  "España": {
    "capital": {
      "es": "Madrid",
      "en": "Madrid"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/Palacio_Real_de_Madrid_Julio_2016_%28cropped%29.jpg/500px-Palacio_Real_de_Madrid_Julio_2016_%28cropped%29.jpg",
    "width": 500,
    "height": 378,
    "page": "https://commons.wikimedia.org/wiki/File:Palacio_Real_de_Madrid_Julio_2016_(cropped).jpg",
    "author": "Tim Adams",
    "license": "CC BY-SA 4.0"
  },
  "Sudáfrica": {
    "capital": {
      "es": "Pretoria",
      "en": "Pretoria"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Uniegebou.jpg/500px-Uniegebou.jpg",
    "width": 500,
    "height": 327,
    "page": "https://commons.wikimedia.org/wiki/File:Uniegebou.jpg",
    "author": "Davinci77",
    "license": "CC BY-SA 3.0"
  },
  "China": {
    "capital": {
      "es": "Pekín",
      "en": "Beijing"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Temple_of_Heaven_20160323_01.jpg/500px-Temple_of_Heaven_20160323_01.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Temple_of_Heaven_20160323_01.jpg",
    "author": "Shujianyang",
    "license": "CC BY-SA 4.0"
  },
  "Canadá": {
    "capital": {
      "es": "Ottawa",
      "en": "Ottawa"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Ottawa_-_ON_-_Stadtansicht.jpg/500px-Ottawa_-_ON_-_Stadtansicht.jpg",
    "width": 500,
    "height": 240,
    "page": "https://commons.wikimedia.org/wiki/File:Ottawa_-_ON_-_Stadtansicht.jpg",
    "author": "Wladyslaw",
    "license": "CC BY-SA 3.0"
  },
  "Argentina": {
    "capital": {
      "es": "Buenos Aires",
      "en": "Buenos Aires"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Panorama_Obelisco_de_Buenos_Aires_2019.jpg/500px-Panorama_Obelisco_de_Buenos_Aires_2019.jpg",
    "width": 500,
    "height": 290,
    "page": "https://commons.wikimedia.org/wiki/File:Panorama_Obelisco_de_Buenos_Aires_2019.jpg",
    "author": "Luis Santos",
    "license": "CC BY-SA 2.0"
  },
  "Francia": {
    "capital": {
      "es": "París",
      "en": "Paris"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/500px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
    "width": 500,
    "height": 833,
    "page": "https://commons.wikimedia.org/wiki/File:Tour_Eiffel_Wikimedia_Commons_(cropped).jpg",
    "author": "Benh LIEU SONG",
    "license": "Public domain"
  },
  "Nigeria": {
    "capital": {
      "es": "Abuya",
      "en": "Abuja"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Abuja_National_Mosque.jpg/500px-Abuja_National_Mosque.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Abuja_National_Mosque.jpg",
    "author": "Mark Fischer",
    "license": "CC BY-SA 2.0"
  },
  "Japón": {
    "capital": {
      "es": "Tokio",
      "en": "Tokyo"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Tokyo_Tower_2023.jpg/500px-Tokyo_Tower_2023.jpg",
    "width": 500,
    "height": 667,
    "page": "https://commons.wikimedia.org/wiki/File:Tokyo_Tower_2023.jpg",
    "author": "Akonnchiroll",
    "license": "CC BY-SA 4.0"
  },
  "México": {
    "capital": {
      "es": "Ciudad de México",
      "en": "Mexico City"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Bellas_Artes_01.jpg/500px-Bellas_Artes_01.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Bellas_Artes_01.jpg",
    "author": "Xavier Quetzalcoatl Contreras Castillo",
    "license": "CC BY-SA 3.0"
  },
  "Chile": {
    "capital": {
      "es": "Santiago de Chile",
      "en": "Santiago"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Palacio_de_La_Moneda_-_miguelreflex.jpg/500px-Palacio_de_La_Moneda_-_miguelreflex.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Palacio_de_La_Moneda_-_miguelreflex.jpg",
    "author": "Miguel hernandez",
    "license": "CC BY-SA 2.0"
  },
  "Alemania": {
    "capital": {
      "es": "Berlín",
      "en": "Berlin"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Brandenburger_Tor_abends.jpg/500px-Brandenburger_Tor_abends.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Brandenburger_Tor_abends.jpg",
    "author": "Thomas Wolf, www.foto-tw.de",
    "license": "CC BY-SA 3.0"
  },
  "Kenia": {
    "capital": {
      "es": "Nairobi",
      "en": "Nairobi"
    },
    "src": "https://upload.wikimedia.org/wikipedia/commons/c/c5/KICC_nairobi_kenya.jpg",
    "width": 500,
    "height": 667,
    "page": "https://commons.wikimedia.org/wiki/File:KICC_nairobi_kenya.jpg",
    "author": "Original uploader was Mkimemia at en.wikipedia",
    "license": "CC BY-SA 3.0"
  },
  "Corea del Sur": {
    "capital": {
      "es": "Seúl",
      "en": "Seoul"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/%EA%B4%91%ED%99%94%EB%AC%B8_%EC%9B%94%EB%8C%80.jpg/500px-%EA%B4%91%ED%99%94%EB%AC%B8_%EC%9B%94%EB%8C%80.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:%EA%B4%91%ED%99%94%EB%AC%B8_%EC%9B%94%EB%8C%80.jpg",
    "author": "서울관광 아카이브",
    "license": "KOGL Type 1"
  },
  "Perú": {
    "capital": {
      "es": "Lima",
      "en": "Lima"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Lima%2C_Peru%E2%80%A6the_Plaza_de_Armas_de_Lima_by_day_%288444360764%29.jpg/500px-Lima%2C_Peru%E2%80%A6the_Plaza_de_Armas_de_Lima_by_day_%288444360764%29.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Lima,_Peru%E2%80%A6the_Plaza_de_Armas_de_Lima_by_day_(8444360764).jpg",
    "author": "Murray Foubister",
    "license": "CC BY-SA 2.0"
  },
  "Italia": {
    "capital": {
      "es": "Roma",
      "en": "Rome"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/500px-Colosseo_2020.jpg",
    "width": 500,
    "height": 350,
    "page": "https://commons.wikimedia.org/wiki/File:Colosseo_2020.jpg",
    "author": "FeaturedPics",
    "license": "CC BY-SA 4.0"
  },
  "Marruecos": {
    "capital": {
      "es": "Rabat",
      "en": "Rabat"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Hassan_Tower%2C_Rabat%2C_Marocco_%28%D8%B5%D9%88%D9%85%D8%B9%D8%A9_%D8%AD%D8%B3%D8%A7%D9%86_%29.jpg/500px-Hassan_Tower%2C_Rabat%2C_Marocco_%28%D8%B5%D9%88%D9%85%D8%B9%D8%A9_%D8%AD%D8%B3%D8%A7%D9%86_%29.jpg",
    "width": 500,
    "height": 684,
    "page": "https://commons.wikimedia.org/wiki/File:Hassan_Tower,_Rabat,_Marocco_(%D8%B5%D9%88%D9%85%D8%B9%D8%A9_%D8%AD%D8%B3%D8%A7%D9%86_).jpg",
    "author": "Petar Milošević",
    "license": "CC BY-SA 4.0"
  },
  "Arabia Saudita": {
    "capital": {
      "es": "Riad",
      "en": "Riyadh"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Kingdomcentreinriyadhsaudiarabia.JPG/500px-Kingdomcentreinriyadhsaudiarabia.JPG",
    "width": 500,
    "height": 680,
    "page": "https://commons.wikimedia.org/wiki/File:Kingdomcentreinriyadhsaudiarabia.JPG",
    "author": "King Eliot",
    "license": "CC BY-SA 3.0"
  },
  "Egipto": {
    "capital": {
      "es": "El Cairo",
      "en": "Cairo"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Flickr_-_HuTect_ShOts_-_Citadel_of_Salah_El.Din_and_Masjid_Muhammad_Ali_%D9%82%D9%84%D8%B9%D8%A9_%D8%B5%D9%84%D8%A7%D8%AD_%D8%A7%D9%84%D8%AF%D9%8A%D9%86_%D8%A7%D9%84%D8%A3%D9%8A%D9%88%D8%A8%D9%8A_%D9%88%D9%85%D8%B3%D8%AC%D8%AF_%D9%85%D8%AD%D9%85%D8%AF_%D8%B9%D9%84%D9%8A_-_Cairo_-_Egypt_-_17_04_2010_%284%29.jpg/500px-thumbnail.jpg",
    "width": 500,
    "height": 305,
    "page": "https://commons.wikimedia.org/wiki/File:Flickr_-_HuTect_ShOts_-_Citadel_of_Salah_El.Din_and_Masjid_Muhammad_Ali_%D9%82%D9%84%D8%B9%D8%A9_%D8%B5%D9%84%D8%A7%D8%AD_%D8%A7%D9%84%D8%AF%D9%8A%D9%86_%D8%A7%D9%84%D8%A3%D9%8A%D9%88%D8%A8%D9%8A_%D9%88%D9%85%D8%B3%D8%AC%D8%AF_%D9%85%D8%AD%D9%85%D8%AF_%D8%B9%D9%84%D9%8A_-_Cairo_-_Egypt_-_17_04_2010_(4).jpg",
    "author": "Ahmed Al.Badawy from Cairo, Egypt",
    "license": "CC BY-SA 2.0"
  },
  "Tailandia": {
    "capital": {
      "es": "Bangkok",
      "en": "Bangkok"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/%E0%B9%80%E0%B8%88%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B8%B8%E0%B8%932.jpg/500px-%E0%B9%80%E0%B8%88%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B8%B8%E0%B8%932.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:%E0%B9%80%E0%B8%88%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B8%B8%E0%B8%932.jpg",
    "author": "Mastertongapollo",
    "license": "CC BY-SA 4.0"
  },
  "Emiratos Árabes": {
    "capital": {
      "es": "Abu Dhabi",
      "en": "Abu Dhabi"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Sheikh_Zayed_Mosque_Silhouette.jpg/500px-Sheikh_Zayed_Mosque_Silhouette.jpg",
    "width": 500,
    "height": 281,
    "page": "https://commons.wikimedia.org/wiki/File:Sheikh_Zayed_Mosque_Silhouette.jpg",
    "author": "PotatoWitch",
    "license": "CC BY-SA 4.0"
  },
  "India": {
    "capital": {
      "es": "Nueva Delhi",
      "en": "New Delhi"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/India_Gate_front.jpg/500px-India_Gate_front.jpg",
    "width": 500,
    "height": 546,
    "page": "https://commons.wikimedia.org/wiki/File:India_Gate_front.jpg",
    "author": "AKS.9955",
    "license": "CC BY-SA 4.0"
  },
  "Ecuador": {
    "capital": {
      "es": "Quito",
      "en": "Quito"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/El_Voto_Nacional_._Quito%2C_Ecuador.JPG/330px-El_Voto_Nacional_._Quito%2C_Ecuador.JPG",
    "width": 500,
    "height": 667,
    "page": "https://commons.wikimedia.org/wiki/File:El_Voto_Nacional_._Quito,_Ecuador.JPG",
    "author": "Samuelistok",
    "license": "CC BY-SA 4.0"
  },
  "Venezuela": {
    "capital": {
      "es": "Caracas",
      "en": "Caracas"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Catedral_de_Caracas_2013_001.JPG/500px-Catedral_de_Caracas_2013_001.JPG",
    "width": 500,
    "height": 667,
    "page": "https://commons.wikimedia.org/wiki/File:Catedral_de_Caracas_2013_001.JPG",
    "author": "Veronidae",
    "license": "CC BY-SA 3.0"
  },
  "Bolivia": {
    "capital": {
      "es": "La Paz",
      "en": "La Paz"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/L%C3%ADnea_Roja_de_Mi_Telef%C3%A9rico_en_La_Paz%2C_Bolivia.jpg/500px-L%C3%ADnea_Roja_de_Mi_Telef%C3%A9rico_en_La_Paz%2C_Bolivia.jpg",
    "width": 500,
    "height": 332,
    "page": "https://commons.wikimedia.org/wiki/File:L%C3%ADnea_Roja_de_Mi_Telef%C3%A9rico_en_La_Paz,_Bolivia.jpg",
    "author": "EEJCC",
    "license": "CC BY-SA 4.0"
  },
  "Paraguay": {
    "capital": {
      "es": "Asunción",
      "en": "Asunción"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Palacio_de_los_L%C3%B3pez_Asunci%C3%B3n_1.jpg/500px-Palacio_de_los_L%C3%B3pez_Asunci%C3%B3n_1.jpg",
    "width": 500,
    "height": 395,
    "page": "https://commons.wikimedia.org/wiki/File:Palacio_de_los_L%C3%B3pez_Asunci%C3%B3n_1.jpg",
    "author": "MosheA",
    "license": "CC0"
  },
  "Uruguay": {
    "capital": {
      "es": "Montevideo",
      "en": "Montevideo"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Palaciosalvouruguay.jpg/500px-Palaciosalvouruguay.jpg",
    "width": 500,
    "height": 667,
    "page": "https://commons.wikimedia.org/wiki/File:Palaciosalvouruguay.jpg",
    "author": "Coolcaesar",
    "license": "CC BY-SA 3.0"
  },
  "Senegal": {
    "capital": {
      "es": "Dakar",
      "en": "Dakar"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/The_African_Renaissance_Monument.jpg/500px-The_African_Renaissance_Monument.jpg",
    "width": 500,
    "height": 439,
    "page": "https://commons.wikimedia.org/wiki/File:The_African_Renaissance_Monument.jpg",
    "author": "Richard N Horne",
    "license": "CC BY 4.0"
  },
  "Ghana": {
    "capital": {
      "es": "Acra",
      "en": "Accra"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Independence_Square%2C_Accra%2C_Ghana.JPG/500px-Independence_Square%2C_Accra%2C_Ghana.JPG",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Independence_Square,_Accra,_Ghana.JPG",
    "author": "Rjruiziii",
    "license": "CC BY-SA 3.0"
  },
  "Angola": {
    "capital": {
      "es": "Luanda",
      "en": "Luanda"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Memorial_Antonio_Agostinho_Neto_%2819882325368%29.jpg/500px-Memorial_Antonio_Agostinho_Neto_%2819882325368%29.jpg",
    "width": 500,
    "height": 667,
    "page": "https://commons.wikimedia.org/wiki/File:Memorial_Antonio_Agostinho_Neto_(19882325368).jpg",
    "author": "David Stanley from Nanaimo, Canada",
    "license": "CC BY 2.0"
  },
  "Etiopía": {
    "capital": {
      "es": "Adís Abeba",
      "en": "Addis Ababa"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Addis_Ababa_Ethiopia_2.jpg/500px-Addis_Ababa_Ethiopia_2.jpg",
    "width": 500,
    "height": 363,
    "page": "https://commons.wikimedia.org/wiki/File:Addis_Ababa_Ethiopia_2.jpg",
    "author": "Gize12",
    "license": "CC BY-SA 4.0"
  },
  "Guatemala": {
    "capital": {
      "es": "Ciudad de Guatemala",
      "en": "Guatemala City"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/20230914_GG_IZADA_DE_LA_BANDERA_NACIONAL_1_%282%29.jpg/500px-20230914_GG_IZADA_DE_LA_BANDERA_NACIONAL_1_%282%29.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:20230914_GG_IZADA_DE_LA_BANDERA_NACIONAL_1_(2).jpg",
    "author": "Gobierno de Guatemala",
    "license": "Public domain"
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
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Catedral_Metropolitana_de_San_Miguel_Arc%C3%A1ngel_de_Tegucigalpa.jpg/500px-Catedral_Metropolitana_de_San_Miguel_Arc%C3%A1ngel_de_Tegucigalpa.jpg",
    "width": 500,
    "height": 340,
    "page": "https://commons.wikimedia.org/wiki/File:Catedral_Metropolitana_de_San_Miguel_Arc%C3%A1ngel_de_Tegucigalpa.jpg",
    "author": "Luis Alfredo Romero",
    "license": "CC BY-SA 4.0"
  },
  "El Salvador": {
    "capital": {
      "es": "San Salvador",
      "en": "San Salvador"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/The_National_Palace_of_El_Salvador.jpg/500px-The_National_Palace_of_El_Salvador.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:The_National_Palace_of_El_Salvador.jpg",
    "author": "Busition",
    "license": "CC BY-SA 4.0"
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
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Costa_Rica-Teatro_Nacional.JPG/500px-Costa_Rica-Teatro_Nacional.JPG",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Costa_Rica-Teatro_Nacional.JPG",
    "author": "Andres Alvarez",
    "license": "CC BY-SA 3.0"
  },
  "Panamá": {
    "capital": {
      "es": "Ciudad de Panamá",
      "en": "Panama City"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Casco_Antiguo_%28San_Felipe%29_-_Pamama.jpg/500px-Casco_Antiguo_%28San_Felipe%29_-_Pamama.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Casco_Antiguo_(San_Felipe)_-_Pamama.jpg",
    "author": "Garcia.dennis",
    "license": "CC BY-SA 4.0"
  },
  "Cuba": {
    "capital": {
      "es": "La Habana",
      "en": "Havana"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/El_Capitolio_Havana_Cuba.jpg/500px-El_Capitolio_Havana_Cuba.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:El_Capitolio_Havana_Cuba.jpg",
    "author": "Nigel Pacquette",
    "license": "CC BY-SA 3.0"
  },
  "República Dominicana": {
    "capital": {
      "es": "Santo Domingo",
      "en": "Santo Domingo"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Maison_du_gouverneur_Don_Diego_Colomb.jpg/500px-Maison_du_gouverneur_Don_Diego_Colomb.jpg",
    "width": 500,
    "height": 281,
    "page": "https://commons.wikimedia.org/wiki/File:Maison_du_gouverneur_Don_Diego_Colomb.jpg",
    "author": "Caribeanvybz",
    "license": "CC BY-SA 4.0"
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
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Castillo_San_Felipe_Del_Morro_%2816869927311%29.jpg/500px-Castillo_San_Felipe_Del_Morro_%2816869927311%29.jpg",
    "width": 500,
    "height": 211,
    "page": "https://commons.wikimedia.org/wiki/File:Castillo_San_Felipe_Del_Morro_(16869927311).jpg",
    "author": "Chad Sparkes from Kissimmee,Florida, United States",
    "license": "CC BY 2.0"
  },
  "Guyana": {
    "capital": {
      "es": "Georgetown",
      "en": "Georgetown"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/20191121_Guyana_0048_Georgetown_sRGB_%2849295795336%29.jpg/500px-20191121_Guyana_0048_Georgetown_sRGB_%2849295795336%29.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:20191121_Guyana_0048_Georgetown_sRGB_(49295795336).jpg",
    "author": "Dan Lundberg",
    "license": "CC BY-SA 2.0"
  },
  "Surinam": {
    "capital": {
      "es": "Paramaribo",
      "en": "Paramaribo"
    },
    "src": "https://upload.wikimedia.org/wikipedia/commons/0/08/Presidential_palace%2C_Paramaribo%2C_Suriname.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Presidential_palace,_Paramaribo,_Suriname.jpg",
    "author": "Ian Mackenzie from Ottawa, Canada",
    "license": "CC BY 2.0"
  },
  "Portugal": {
    "capital": {
      "es": "Lisboa",
      "en": "Lisbon"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Torre_Bel%C3%A9m_April_2009-4a.jpg/500px-Torre_Bel%C3%A9m_April_2009-4a.jpg",
    "width": 500,
    "height": 477,
    "page": "https://commons.wikimedia.org/wiki/File:Torre_Bel%C3%A9m_April_2009-4a.jpg",
    "author": "Alvesgaspar",
    "license": "CC BY-SA 3.0"
  },
  "Reino Unido": {
    "capital": {
      "es": "Londres",
      "en": "London"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Tower_Bridge_at_Dawn.jpg/500px-Tower_Bridge_at_Dawn.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Tower_Bridge_at_Dawn.jpg",
    "author": "Fuzzypiggy",
    "license": "CC BY-SA 3.0"
  },
  "Países Bajos": {
    "capital": {
      "es": "Ámsterdam",
      "en": "Amsterdam"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Imagen_de_los_canales_conc%C3%A9ntricos_en_%C3%81msterdam.png/500px-Imagen_de_los_canales_conc%C3%A9ntricos_en_%C3%81msterdam.png",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Imagen_de_los_canales_conc%C3%A9ntricos_en_%C3%81msterdam.png",
    "author": "Andrés Barrios",
    "license": "CC BY-SA 4.0"
  },
  "Suiza": {
    "capital": {
      "es": "Berna",
      "en": "Bern"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Zytglogge_01.jpg/500px-Zytglogge_01.jpg",
    "width": 500,
    "height": 750,
    "page": "https://commons.wikimedia.org/wiki/File:Zytglogge_01.jpg",
    "author": "Mike Lehmann, Mike Switzerland 13:37, 2 July 2006 (UTC)",
    "license": "CC BY-SA 3.0"
  },
  "Suecia": {
    "capital": {
      "es": "Estocolmo",
      "en": "Stockholm"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Gamla_stan_September_2014_01.jpg/500px-Gamla_stan_September_2014_01.jpg",
    "width": 500,
    "height": 334,
    "page": "https://commons.wikimedia.org/wiki/File:Gamla_stan_September_2014_01.jpg",
    "author": "Arild Vågen",
    "license": "CC BY-SA 4.0"
  },
  "Polonia": {
    "capital": {
      "es": "Varsovia",
      "en": "Warsaw"
    },
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Royal_Castle_in_Warsaw%2C_Poland%2C_2022%2C_03.jpg/500px-Royal_Castle_in_Warsaw%2C_Poland%2C_2022%2C_03.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Royal_Castle_in_Warsaw,_Poland,_2022,_03.jpg",
    "author": "Chris Olszewski",
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
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Plaza_Botero_-_Medell%C3%ADn.jpg/500px-Plaza_Botero_-_Medell%C3%ADn.jpg",
    "width": 500,
    "height": 334,
    "page": "https://commons.wikimedia.org/wiki/File:Plaza_Botero_-_Medell%C3%ADn.jpg",
    "author": "Yimicorrea",
    "license": "CC BY-SA 3.0"
  },
  "Cali": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/La_Ermita_es_de_los_Cale%C3%B1os.jpg/500px-La_Ermita_es_de_los_Cale%C3%B1os.jpg",
    "width": 500,
    "height": 625,
    "page": "https://commons.wikimedia.org/wiki/File:La_Ermita_es_de_los_Cale%C3%B1os.jpg",
    "author": "Juanes016",
    "license": "CC0"
  },
  "Barranquilla": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Ventanalmundo.jpg/500px-Ventanalmundo.jpg",
    "width": 500,
    "height": 667,
    "page": "https://commons.wikimedia.org/wiki/File:Ventanalmundo.jpg",
    "author": "Jdvillalobos",
    "license": "CC BY-SA 4.0"
  },
  "Cartagena": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/024_Torre_del_Reloj_Cartagena_Colombia.JPG/500px-024_Torre_del_Reloj_Cartagena_Colombia.JPG",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:024_Torre_del_Reloj_Cartagena_Colombia.JPG",
    "author": "David Shankbone",
    "license": "CC BY-SA 3.0"
  },
  "Cúcuta": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Monumento_Nacional_Templo_Historico.jpg/500px-Monumento_Nacional_Templo_Historico.jpg",
    "width": 500,
    "height": 376,
    "page": "https://commons.wikimedia.org/wiki/File:Monumento_Nacional_Templo_Historico.jpg",
    "author": "Jhoan daniel",
    "license": "CC BY-SA 4.0"
  },
  "Bucaramanga": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Iglesia_Sagrada_Familia%2C_Bucaramanga%2C_Santander.JPG/500px-Iglesia_Sagrada_Familia%2C_Bucaramanga%2C_Santander.JPG",
    "width": 500,
    "height": 667,
    "page": "https://commons.wikimedia.org/wiki/File:Iglesia_Sagrada_Familia,_Bucaramanga,_Santander.JPG",
    "author": "Claudio A Moreno",
    "license": "CC BY-SA 3.0"
  },
  "Ibagué": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Conservatorio_del_Tolima.jpg/500px-Conservatorio_del_Tolima.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Conservatorio_del_Tolima.jpg",
    "author": "Digitalinforma",
    "license": "CC BY-SA 4.0"
  },
  "Santa Marta": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Llegada_a_la_Quinta_de_San_Pedro_Alejandrino.jpg/500px-Llegada_a_la_Quinta_de_San_Pedro_Alejandrino.jpg",
    "width": 500,
    "height": 366,
    "page": "https://commons.wikimedia.org/wiki/File:Llegada_a_la_Quinta_de_San_Pedro_Alejandrino.jpg",
    "author": "SALOMON BERMUDEZ",
    "license": "CC BY-SA 3.0"
  },
  "Villavicencio": {
    "src": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Catedral_Parque.jpg",
    "width": 500,
    "height": 701,
    "page": "https://commons.wikimedia.org/wiki/File:Catedral_Parque.jpg",
    "author": "Cristian27de",
    "license": "CC0"
  },
  "Pereira": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Viaducto_Cesar_Gaviria_Truillo._Vista_nocturna.jpg/500px-Viaducto_Cesar_Gaviria_Truillo._Vista_nocturna.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:Viaducto_Cesar_Gaviria_Truillo._Vista_nocturna.jpg",
    "author": "Norbey",
    "license": "CC BY-SA 4.0"
  },
  "Pasto": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Catedral_de_Pasto_%28Nari%C3%B1o%29.JPG/500px-Catedral_de_Pasto_%28Nari%C3%B1o%29.JPG",
    "width": 500,
    "height": 472,
    "page": "https://commons.wikimedia.org/wiki/File:Catedral_de_Pasto_(Nari%C3%B1o).JPG",
    "author": "Gersonparra11",
    "license": "CC BY-SA 3.0"
  },
  "Montería": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Ronda_del_Sin%C3%BA.jpg/500px-Ronda_del_Sin%C3%BA.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Ronda_del_Sin%C3%BA.jpg",
    "author": "Vgallego66",
    "license": "CC BY-SA 4.0"
  },
  "Neiva": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/Capilla_de_La_Inmaculada_Concepci%C3%B3n.jpg/500px-Capilla_de_La_Inmaculada_Concepci%C3%B3n.jpg",
    "width": 500,
    "height": 667,
    "page": "https://commons.wikimedia.org/wiki/File:Capilla_de_La_Inmaculada_Concepci%C3%B3n.jpg",
    "author": "Martinduquea",
    "license": "CC BY-SA 3.0"
  }
};

/** Localidades de Bogotá, por nombre (el de LOCALITIES en bogotaMap.ts) */
export const LOCALITY_PHOTOS: Record<string, PlacePhoto> = {
  "Usaquén": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Bogot%C3%A1_barrio_Usaqu%C3%A9n_plaza.JPG/500px-Bogot%C3%A1_barrio_Usaqu%C3%A9n_plaza.JPG",
    "width": 500,
    "height": 361,
    "page": "https://commons.wikimedia.org/wiki/File:Bogot%C3%A1_barrio_Usaqu%C3%A9n_plaza.JPG",
    "author": "Felipe Restrepo Acosta",
    "license": "CC BY-SA 4.0"
  },
  "Chapinero": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/2019_Bogot%C3%A1_-_Nuestra_Se%C3%B1ora_de_Lourdes.jpg/500px-2019_Bogot%C3%A1_-_Nuestra_Se%C3%B1ora_de_Lourdes.jpg",
    "width": 500,
    "height": 667,
    "page": "https://commons.wikimedia.org/wiki/File:2019_Bogot%C3%A1_-_Nuestra_Se%C3%B1ora_de_Lourdes.jpg",
    "author": "Felipe Restrpo Acosta",
    "license": "CC BY-SA 4.0"
  },
  "Santa Fe": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Monserrate_Sanctuary.JPG/500px-Monserrate_Sanctuary.JPG",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Monserrate_Sanctuary.JPG",
    "author": "pipeafcr",
    "license": "CC BY-SA 3.0"
  },
  "San Cristóbal": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Parroquia_del_Divino_Ni%C3%B1o%2C_fachada.JPG/500px-Parroquia_del_Divino_Ni%C3%B1o%2C_fachada.JPG",
    "width": 500,
    "height": 667,
    "page": "https://commons.wikimedia.org/wiki/File:Parroquia_del_Divino_Ni%C3%B1o,_fachada.JPG",
    "author": "Mavelus",
    "license": "CC BY-SA 3.0"
  },
  "Usme": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Sur_de_la_Localidad_de_Usme%2C_Bogot%C3%A1.jpg/500px-Sur_de_la_Localidad_de_Usme%2C_Bogot%C3%A1.jpg",
    "width": 500,
    "height": 294,
    "page": "https://commons.wikimedia.org/wiki/File:Sur_de_la_Localidad_de_Usme,_Bogot%C3%A1.jpg",
    "author": "EEIM",
    "license": "CC BY-SA 4.0"
  },
  "Tunjuelito": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Laguna_d_El_Tunal_Bt%C3%A1.jpeg/500px-Laguna_d_El_Tunal_Bt%C3%A1.jpeg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Laguna_d_El_Tunal_Bt%C3%A1.jpeg",
    "author": "EEIM",
    "license": "CC BY-SA 3.0"
  },
  "Bosa": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Alameda_El_Porvenir_Puente_R%C3%ADo_Tunjuelo.jpg/500px-Alameda_El_Porvenir_Puente_R%C3%ADo_Tunjuelo.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Alameda_El_Porvenir_Puente_R%C3%ADo_Tunjuelo.jpg",
    "author": "Otwo1983",
    "license": "CC BY-SA 4.0"
  },
  "Kennedy": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Biblioteca_Tintal.jpg/500px-Biblioteca_Tintal.jpg",
    "width": 500,
    "height": 300,
    "page": "https://commons.wikimedia.org/wiki/File:Biblioteca_Tintal.jpg",
    "author": "Baiji",
    "license": "CC BY-SA 4.0"
  },
  "Fontibón": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/El-dorado-from-air.jpg/500px-El-dorado-from-air.jpg",
    "width": 500,
    "height": 333,
    "page": "https://commons.wikimedia.org/wiki/File:El-dorado-from-air.jpg",
    "author": "EFE",
    "license": "CC BY-SA 4.0"
  },
  "Engativá": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Domos_del_Tropicario_de_Bogot%C3%A1.jpg/500px-Domos_del_Tropicario_de_Bogot%C3%A1.jpg",
    "width": 500,
    "height": 281,
    "page": "https://commons.wikimedia.org/wiki/File:Domos_del_Tropicario_de_Bogot%C3%A1.jpg",
    "author": "Jardín Botánico José Celestino Mutis",
    "license": "CC BY-SA 4.0"
  },
  "Suba": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Humedal_de_la_conejera.jpg/500px-Humedal_de_la_conejera.jpg",
    "width": 500,
    "height": 95,
    "page": "https://commons.wikimedia.org/wiki/File:Humedal_de_la_conejera.jpg",
    "author": "Panorámica de uno de los espejos de agua recuperados por la Fundación La Conejer",
    "license": "Public domain"
  },
  "Barrios Unidos": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Palacio_de_los_Deportes_Bogot%C3%A1_Copa_Davis_2020.jpg/500px-Palacio_de_los_Deportes_Bogot%C3%A1_Copa_Davis_2020.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Palacio_de_los_Deportes_Bogot%C3%A1_Copa_Davis_2020.jpg",
    "author": "Futbolero",
    "license": "CC BY-SA 4.0"
  },
  "Teusaquillo": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Estadio_El_Campin_vac%C3%ADo.jpg/500px-Estadio_El_Campin_vac%C3%ADo.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Estadio_El_Campin_vac%C3%ADo.jpg",
    "author": "Futbolero",
    "license": "CC BY-SA 4.0"
  },
  "Los Mártires": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/2017_Bogot%C3%A1_c%C3%BApula_de_la_bas%C3%ADlica_del_Voto_Nacional.jpg/500px-2017_Bogot%C3%A1_c%C3%BApula_de_la_bas%C3%ADlica_del_Voto_Nacional.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:2017_Bogot%C3%A1_c%C3%BApula_de_la_bas%C3%ADlica_del_Voto_Nacional.jpg",
    "author": "Felipe Restrepo Acosta",
    "license": "CC BY-SA 4.0"
  },
  "Antonio Nariño": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Bogot%C3%A1%2C_calle_4%2C_iglesia_de_San_Antonio_de_Padua.JPG/500px-Bogot%C3%A1%2C_calle_4%2C_iglesia_de_San_Antonio_de_Padua.JPG",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Bogot%C3%A1,_calle_4,_iglesia_de_San_Antonio_de_Padua.JPG",
    "author": "Felipe Restrepo Acosta",
    "license": "CC BY-SA 4.0"
  },
  "Puente Aranda": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Avenida_de_Las_Am%C3%A9ricas%2C_Bogot%C3%A1.JPG/500px-Avenida_de_Las_Am%C3%A9ricas%2C_Bogot%C3%A1.JPG",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Avenida_de_Las_Am%C3%A9ricas,_Bogot%C3%A1.JPG",
    "author": "Felipe Restrepo Acosta",
    "license": "CC BY-SA 3.0"
  },
  "La Candelaria": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Plaza_de_Bolivar%2C_Bogota%2C_Colombia_%285770632336%29.jpg/500px-Plaza_de_Bolivar%2C_Bogota%2C_Colombia_%285770632336%29.jpg",
    "width": 500,
    "height": 335,
    "page": "https://commons.wikimedia.org/wiki/File:Plaza_de_Bolivar,_Bogota,_Colombia_(5770632336).jpg",
    "author": "Pedro Szekely from Los Angeles, USA",
    "license": "CC BY-SA 2.0"
  },
  "Rafael Uribe Uribe": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Localidad_Rafael_Uribe_Uribe.jpg/500px-Localidad_Rafael_Uribe_Uribe.jpg",
    "width": 500,
    "height": 375,
    "page": "https://commons.wikimedia.org/wiki/File:Localidad_Rafael_Uribe_Uribe.jpg",
    "author": "Omar Alfedo Moya",
    "license": "CC BY-SA 4.0"
  },
  "Ciudad Bolívar": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/TransMiCable_Pilona.jpg/500px-TransMiCable_Pilona.jpg",
    "width": 500,
    "height": 896,
    "page": "https://commons.wikimedia.org/wiki/File:TransMiCable_Pilona.jpg",
    "author": "Barto920203",
    "license": "CC BY-SA 4.0"
  },
  "Sumapaz": {
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/P%C3%A1ramo_de_Sumapaz.jpg/500px-P%C3%A1ramo_de_Sumapaz.jpg",
    "width": 500,
    "height": 335,
    "page": "https://commons.wikimedia.org/wiki/File:P%C3%A1ramo_de_Sumapaz.jpg",
    "author": "Luis Alejandro Bernal Romero",
    "license": "CC BY-SA 2.0"
  }
};
