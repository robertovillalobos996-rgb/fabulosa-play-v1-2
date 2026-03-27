// src/data/lists.js

// IMPORTAMOS TUS LISTAS DIRECTAMENTE DESDE LA CARPETA ASSETS
// El "?raw" al final es vital: le dice al programa que lea el contenido como texto.

import accionTxt from '../assets/accion.txt?raw';
import cienciaTxt from '../assets/ciencia ficcion.txt?raw';
import comediaTxt from '../assets/comedia.txt?raw';
import comicsTxt from '../assets/comics.txt?raw';
import dramaTxt from '../assets/drama.txt?raw';
import cristianasTxt from '../assets/peliculas cristianas.txt?raw';
import retroTxt from '../assets/pelis 80 y 90.txt?raw';
import kitsTxt from '../assets/play kits.txt?raw';
import paramountTxt from '../assets/play paramount.txt?raw';
import terrorTxt from '../assets/play terror.txt?raw';
import videoTxt from '../assets/play video.txt?raw';

// AQUÍ CONECTAMOS EL NOMBRE DEL BOTÓN CON EL ARCHIVO DE TEXTO
export const movieLists = {
  "Acción": accionTxt,
  "Ciencia Ficción": cienciaTxt,
  "Comedia": comediaTxt,
  "Comics": comicsTxt,
  "Drama": dramaTxt,
  "Cristianas": cristianasTxt,
  "Retro 80s 90s": retroTxt,
  "Play Kids": kitsTxt,
  "Paramount+": paramountTxt,
  "Terror": terrorTxt,
  "Prime Video": videoTxt
};