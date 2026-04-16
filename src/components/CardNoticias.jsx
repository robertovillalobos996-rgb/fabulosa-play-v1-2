import { Link } from "react-router-dom";
import imagenPortada from "../assets/card-noticias.jpg";
import logoNoticias from "../assets/logo-noticias.png"; //

export default function CardNoticias() {
  return (
    <Link to="/noticias" className="block w-full">
      <div
        className="relative h-[420px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition duration-500 hover:scale-[1.02] group bg-black"
        style={{
          backgroundImage: `url(${imagenPortada})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay CinematogrÃ¡fico */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
        
        {/* Logo PSC INFORMA (Cambio 2) */}
        <div className="absolute inset-0 flex flex-col justify-end p-10">
          <img 
            src={logoNoticias} 
            alt="PSC INFORMA" 
            className="w-48 h-auto mb-4 object-contain brightness-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            style={{ mixBlendMode: 'lighten' }} // Mantiene letras blancas y elimina fondos oscuros
          />
          <div className="w-12 h-[2px] bg-red-600 mb-6" />
          <div className="w-fit bg-white text-black px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-red-600 group-hover:text-white transition-all">
            Acceder al Portal
          </div>
        </div>
      </div>
    </Link>
  );
}