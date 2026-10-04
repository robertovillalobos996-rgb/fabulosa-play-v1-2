import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "data", "movies-source.json");
const overridesPath = path.join(root, "data", "tmdb-overrides.json");
const rulesPath = path.join(root, "data", "tmdb-rules.json");
const outputPath = path.join(root, "src", "data", "movies.js");
const unmatchedPath = path.join(root, "data", "tmdb-unmatched.json");
const dryRun = process.argv.includes("--dry-run");
const bearerToken = process.env.TMDB_READ_TOKEN?.trim();
const apiKey = process.env.TMDB_API_KEY?.trim();

function normalize(value = "") {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slug(value) {
  return normalize(value).replace(/\s+/g, "-") || "pelicula";
}

function wordSimilarity(left, right) {
  const a = new Set(normalize(left).split(" ").filter(Boolean));
  const b = new Set(normalize(right).split(" ").filter(Boolean));
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((word) => b.has(word)).length;
  return intersection / new Set([...a, ...b]).size;
}

function candidateScore(source, candidate, query, expectedYear) {
  const sourceTitle = normalize(source.title);
  const queryTitle = normalize(query);
  const translatedTitle = normalize(candidate.title);
  const originalTitle = normalize(candidate.original_title);
  const candidateYear = Number(candidate.release_date?.slice(0, 4)) || 0;
  let score = Math.max(
    wordSimilarity(sourceTitle, translatedTitle),
    wordSimilarity(sourceTitle, originalTitle),
    wordSimilarity(queryTitle, translatedTitle),
    wordSimilarity(queryTitle, originalTitle),
  ) * 55;

  if (sourceTitle === translatedTitle || sourceTitle === originalTitle) score += 55;
  if (queryTitle === translatedTitle || queryTitle === originalTitle) score += 65;
  if (expectedYear && candidateYear === Number(expectedYear)) score += 35;
  else if (expectedYear && Math.abs(candidateYear - Number(expectedYear)) === 1) score += 12;
  if (candidate.poster_path) score += 8;
  return score;
}

function authHeaders() {
  return bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {};
}

function apiUrl(endpoint, params = {}) {
  const url = new URL(`https://api.themoviedb.org/3${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
  }
  if (!bearerToken && apiKey) url.searchParams.set("api_key", apiKey);
  return url;
}

async function tmdb(endpoint, params, attempt = 0) {
  const response = await fetch(apiUrl(endpoint, params), {
    headers: { accept: "application/json", ...authHeaders() },
  });

  if (response.status === 429 && attempt < 4) {
    const waitSeconds = Number(response.headers.get("retry-after")) || 2 ** attempt;
    await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
    return tmdb(endpoint, params, attempt + 1);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`TMDB respondió ${response.status}: ${body.slice(0, 180)}`);
  }
  return response.json();
}

async function readJson(filePath, fallback = {}) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

async function readExistingCatalog() {
  try {
    const moduleText = await readFile(outputPath, "utf8");
    const prefix = "export const movies = ";
    const start = moduleText.indexOf(prefix);
    if (start === -1) return [];
    const jsonText = moduleText.slice(start + prefix.length).replace(/;\s*$/, "");
    return JSON.parse(jsonText);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

function existingBySourceId(source, existing) {
  const matches = new Map();

  if (source.length === existing.length) {
    source.forEach((item, index) => matches.set(item.id, existing[index]));
    return matches;
  }

  const byUrl = new Map();
  for (const movie of existing) {
    if (!byUrl.has(movie.url)) byUrl.set(movie.url, []);
    byUrl.get(movie.url).push(movie);
  }

  for (const item of source) {
    const candidates = byUrl.get(item.url) || [];
    const best = candidates
      .map((movie) => ({ movie, score: wordSimilarity(item.title, movie.title) }))
      .sort((left, right) => right.score - left.score)[0];
    if (best) matches.set(item.id, best.movie);
  }

  return matches;
}

function queryVariants(source, rule = {}) {
  const variants = [source.title, ...(rule.queries || [])];
  const withoutHd = source.title.replace(/\s+HD$/i, "").trim();
  const beforeSubtitle = withoutHd.split(/[:–—-]/)[0].trim();
  variants.push(withoutHd, beforeSubtitle);
  return [...new Set(variants.filter(Boolean))];
}

async function findMovie(source, rule, overrideId) {
  if (overrideId) return tmdb(`/movie/${overrideId}`, { language: "es-ES" });

  const expectedYear = rule.year || source.year;
  const candidates = [];

  for (const query of queryVariants(source, rule)) {
    const searches = expectedYear ? [expectedYear, undefined] : [undefined];
    for (const year of searches) {
      const payload = await tmdb("/search/movie", {
        query,
        language: "es-ES",
        include_adult: "false",
        year,
      });
      for (const candidate of payload.results || []) {
        candidates.push({
          candidate,
          score: candidateScore(source, candidate, query, expectedYear),
        });
      }
      if (payload.results?.some((candidate) => candidate.poster_path)) break;
    }
  }

  const ranked = candidates.sort((left, right) => right.score - left.score);

  return ranked[0]?.score >= 62 ? ranked[0].candidate : null;
}

async function run() {
  const source = JSON.parse(await readFile(sourcePath, "utf8"));
  if (dryRun) {
    const rules = await readJson(rulesPath);
    const excluded = source.filter((item) => rules[item.id]?.exclude).length;
    console.log(`Registros de origen: ${source.length}`);
    console.log(`Películas únicas: ${source.length - excluded}`);
    console.log(`Duplicados o especiales eliminados: ${excluded}`);
    console.log("Series incluidas: 0");
    return;
  }

  if (!bearerToken && !apiKey) {
    throw new Error("Falta TMDB_READ_TOKEN o TMDB_API_KEY. Configure una de esas variables antes de importar.");
  }

  const [overrides, rules, genrePayload, existing] = await Promise.all([
    readJson(overridesPath),
    readJson(rulesPath),
    tmdb("/genre/movie/list", { language: "es-ES" }),
    readExistingCatalog(),
  ]);
  const genres = new Map((genrePayload.genres || []).map((genre) => [genre.id, genre.name]));
  const previous = existingBySourceId(source, existing);
  const movies = [];
  const unmatched = [];
  let excluded = 0;
  let reused = 0;

  for (const [index, item] of source.entries()) {
    const rule = rules[item.id] || {};
    if (rule.exclude) {
      excluded += 1;
      console.log(`[${index + 1}/${source.length}] ${item.title} DUPLICADA, OMITIDA`);
      continue;
    }

    const oldMovie = previous.get(item.id);
    if (oldMovie?.poster && !rule.refresh && !overrides[item.id]) {
      movies.push({ ...oldMovie, featured: movies.length === 0 });
      reused += 1;
      console.log(`[${index + 1}/${source.length}] ${item.title} ✓ reutilizada`);
      continue;
    }

    const match = await findMovie(item, rule, overrides[item.id]);
    if (!match?.poster_path) {
      unmatched.push(item);
      movies.push({
        id: item.id,
        title: item.title,
        year: item.year || "",
        category: "Película",
        description: "",
        poster: "",
        backdrop: "",
        url: item.url,
        featured: movies.length === 0,
      });
    } else {
      const releaseYear = match.release_date?.slice(0, 4) || item.year || "";
      movies.push({
        id: `movie-${match.id}`,
        title: match.title || item.title,
        year: releaseYear,
        category: genres.get(match.genre_ids?.[0]) || "Película",
        description: match.overview || "",
        poster: `https://image.tmdb.org/t/p/w500${match.poster_path}`,
        backdrop: match.backdrop_path ? `https://image.tmdb.org/t/p/w1280${match.backdrop_path}` : "",
        url: item.url,
        featured: movies.length === 0,
      });
    }

    console.log(`[${index + 1}/${source.length}] ${item.title} ${match?.poster_path ? "✓" : "SIN COINCIDENCIA"}`);
  }

  const moduleText = `// Generado por scripts/import-movies-tmdb.mjs. No editar manualmente.\nexport const movies = ${JSON.stringify(movies, null, 2)};\n`;
  await writeFile(outputPath, moduleText, "utf8");
  await writeFile(unmatchedPath, `${JSON.stringify(unmatched, null, 2)}\n`, "utf8");
  console.log(`\nCatálogo generado: ${movies.length}`);
  console.log(`Películas reutilizadas: ${reused}`);
  console.log(`Duplicadas eliminadas: ${excluded}`);
  console.log(`Coincidencias pendientes de revisión: ${unmatched.length}`);
  console.log(`Identificadores manuales: ${path.relative(root, overridesPath)}`);
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
