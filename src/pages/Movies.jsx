import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import logoFabulosa from "../assets/logo_fabulosa.png";

/* 🎬 CATEGORÍAS */
const CATEGORIES = [
  "Acción", "Terror", "Comedia", "Drama",
  "Sci-Fi", "Documentales", "Estrenos",
  "Animación", "Suspenso"
];

/* 🔑 LAS 14 KEYS */
const YOUTUBE_API_KEYS = [
  "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww",
  "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
  "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk",
  "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
  "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g",
  "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
  "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8",
  "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
  "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg",
  "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
  "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI",
  "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
  "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q",
  "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

const Movies = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Acción");
  const [loading, setLoading] = useState(false);
  const [fecha, setFecha] = useState(new Date());
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);

  /* 🎮 CONTROL REMOTO */
  const [focusedSection, setFocusedSection] = useState("grid");
  const [focusedIndex, setFocusedIndex] = useState(0);

  const gridRef = useRef(null);

  /* 🕒 RELOJ */
  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* 🧼 LIMPIAR TÍTULO */
  const cleanTitle = (title) => {
    return title
      .replace(/\[.*?\]/g, "")
      .replace(/\(.*?\)/g, "")
      .replace(/pelicula completa|completa|full movie|hd|4k|latino|español|estreno/gi, "")
      .replace(/[|:\-–—]/g, "")
      .trim();
  };

  /* 🔥 FETCH CON ROTACIÓN REAL DE KEYS */
  const fetchMovies = async (query) => {
    setLoading(true);

    let attempts = 0;
    let success = false;

    while (attempts < YOUTUBE_API_KEYS.length && !success) {
      const key = YOUTUBE_API_KEYS[(currentKeyIndex + attempts) % YOUTUBE_API_KEYS.length];

      try {
        const q = query || activeCategory;

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=40&q=${q}+pelicula+completa+espanol+latino&type=video&videoDuration=long&key=${key}`
        );

        const data = await response.json();

        if (data.error && (data.error.code === 403 || data.error.code === 429)) {
          attempts++;
          continue;
        }

        if (data.items) {
          setMovies(data.items);
          setCurrentKeyIndex((currentKeyIndex + attempts) % YOUTUBE_API_KEYS.length);
          success = true;
        }

      } catch (err) {
        attempts++;
      }
    }

    setLoading(false);
  };

  /* 🔄 CARGA AUTOMÁTICA POR CATEGORÍA */
  useEffect(() => {
    fetchMovies();
  }, [activeCategory]);

  /* 🔍 BUSCADOR */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        fetchMovies(searchTerm);
      } else {
        fetchMovies();
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  /* 🎮 CONTROL REMOTO COMPLETO */
  useEffect(() => {
    const handleKeyDown = (e) => {

      if (currentMovie) {
        if (e.key === "Escape" || e.key === "Backspace") {
          setCurrentMovie(null);
        }
        return;
      }

      const cols = window.innerWidth >= 1280 ? 6 :
                   window.innerWidth >= 1024 ? 5 : 2;

      if (focusedSection === "grid") {
        if (e.key === "ArrowRight")
          setFocusedIndex(i => Math.min(i + 1, movies.length - 1));

        if (e.key === "ArrowLeft") {
          if (focusedIndex % cols === 0) {
            setFocusedSection("categories");
            setFocusedIndex(0);
          } else {
            setFocusedIndex(i => Math.max(i - 1, 0));
          }
        }

        if (e.key === "ArrowDown")
          setFocusedIndex(i => Math.min(i + cols, movies.length - 1));

        if (e.key === "ArrowUp") {
          if (focusedIndex < cols) {
            setFocusedSection("categories");
          } else {
            setFocusedIndex(i => Math.max(i - cols, 0));
          }
        }

        if (e.key === "Enter") {
          setCurrentMovie(movies[focusedIndex]);
        }
      }

      else if (focusedSection === "categories") {
        if (e.key === "ArrowRight")
          setFocusedIndex(i => Math.min(i + 1, CATEGORIES.length - 1));

        if (e.key === "ArrowLeft")
          setFocusedIndex(i => Math.max(i - 1, 0));

        if (e.key === "ArrowDown") {
          setFocusedSection("grid");
          setFocusedIndex(0);
        }

        if (e.key === "Enter") {
          setActiveCategory(CATEGORIES[focusedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedSection, focusedIndex, movies, currentMovie]);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <header className="p-6 flex justify-between items-center">
        <button onClick={() => navigate("/")} className="bg-red-600 p-3 rounded-full">
          <ArrowLeft />
        </button>

        <img src={logoFabulosa} className="h-10" />

        <span>{fecha.toLocaleTimeString()}</span>
      </header>

      {/* BUSCADOR */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full p-3 rounded bg-white/10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* CATEGORÍAS */}
      <div className="flex overflow-x-auto gap-3 p-4">
        {CATEGORIES.map((cat, idx) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full ${
              activeCategory === cat ? "bg-red-600" : "bg-white/10"
            } ${
              focusedSection === "categories" && focusedIndex === idx
                ? "ring-2 ring-white"
                : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      {loading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
          {movies.map((movie, idx) => (
            <div
              key={movie.id.videoId}
              onClick={() => setCurrentMovie(movie)}
              className={`cursor-pointer p-2 bg-[#111] rounded ${
                focusedSection === "grid" && focusedIndex === idx
                  ? "ring-4 ring-red-600 scale-105"
                  : ""
              }`}
            >
              <img src={movie.snippet.thumbnails.high.url} />
              <p className="text-xs mt-2">{cleanTitle(movie.snippet.title)}</p>
            </div>
          ))}
        </div>
      )}

      {/* PLAYER */}
      <AnimatePresence>
        {currentMovie && (
          <motion.div className="fixed inset-0 bg-black z-50">
            <button
              onClick={() => setCurrentMovie(null)}
              className="absolute top-4 right-4 bg-red-600 p-3 rounded-full"
            >
              <X />
            </button>

            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${currentMovie.id.videoId}?autoplay=1`}
              allowFullScreen
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Movies;