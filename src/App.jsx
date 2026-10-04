import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";

const Home = lazy(() => import("./pages/Home"));
const Channels = lazy(() => import("./pages/Channels"));
const RadiosPlay = lazy(() => import("./pages/RadiosPlay"));
const Movies = lazy(() => import("./pages/Movies"));
const Advertise = lazy(() => import("./pages/Advertise"));
const Admin = lazy(() => import("./pages/Admin"));

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#07090f] text-white">
      <div className="flex items-center gap-3 text-sm font-semibold text-white/70">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-fuchsia-400 border-t-transparent" />
        Cargando Fabulosa Play…
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/canales-play" element={<Channels />} />
            <Route path="/radios-cr" element={<RadiosPlay />} />
            <Route path="/cine-play" element={<Movies />} />
            <Route path="/anunciate" element={<Advertise />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
