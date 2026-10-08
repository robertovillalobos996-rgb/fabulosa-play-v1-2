import { canalesTV } from "./canales_finales";
import { movies } from "./movies";
import { radiosMundo } from "./radios-mundo";

export const defaultChannels = canalesTV;
export const defaultRadios = radiosMundo;
export const defaultMovies = movies;

export const defaultBanners = [
  {
    id: "bienvenida",
    mediaType: "image",
    showContent: true,
    title: "Toda tu señal, en un solo lugar",
    subtitle: "Televisión en vivo, radios y películas con una experiencia más rápida y moderna.",
    image: "/fondo_fabulosa_play.webp",
    actionLabel: "Ver canales",
    actionUrl: "/canales-play",
  },
  {
    id: "publicidad",
    mediaType: "image",
    showContent: true,
    title: "Haz que tu marca se vea y se escuche",
    subtitle: "Publicidad digital para una audiencia conectada dentro y fuera de Costa Rica.",
    image: "/centro-de-publicidad.png",
    actionLabel: "Quiero anunciarme",
    actionUrl: "/anunciate",
  },
];

export const defaultSettings = {
  contactEmail: "FabulosaPlay@gmail.com",
  whatsapp: "+506 6403 5335",
  website: "https://www.fabulosaplay.online",
  cloudinaryCloudName: "",
  cloudinaryUploadPreset: "",
  facebook: "",
  instagram: "",
  businessHours: "Lunes a sábado, 9:00 a. m. – 6:00 p. m.",
  contactIntro: "Cuéntenos qué desea promocionar y prepararemos una propuesta para su negocio.",
};

export const catalogDefaults = {
  homeAdvertising: [],
  channels: defaultChannels,
  radios: defaultRadios,
  movies: defaultMovies,
  banners: defaultBanners,
  settings: defaultSettings,
};
