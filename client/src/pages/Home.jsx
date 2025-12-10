import { Icon } from "@iconify/react";
import FuturisticButton from "../components/FuturisticButton";
import logo from "../assets/logo.png";
import hero from "../assets/hero.svg";
import tip from "../assets/tip.svg";
import HeroSVG from "../components/HeroSVG";
export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <title>Home</title>
      <header>
        <nav className="flex w-full justify-between px-5 lg:px-32 py-5">
          <a href="/" className="flex  items-center  gap-2">
            <img src={logo} alt="logo" className="w-20" />
            <span className="font-bold text-xl text-al leading-4 text-center">
              LION <span className="text-caribe">PR</span>
              <br />
              services
            </span>
          </a>

          <div className="flex gap-5 flex-nowrap  h-min items-center ">
            <FuturisticButton>
              <a href="/contratar">Contratar</a>
            </FuturisticButton>
            <a href="/login">Iniciar Sesión</a>
            {/* <a href="/register" className="flex gap-2 items-center">    <Icon icon="solar:user-circle-outline" width="24" height="24" />  <span> Mi perfil</span></a> */}
          </div>
        </nav>
      </header>
      <main className="mt-10 lg:mt-5 xl:pt-20 px-3 lg:px-32 overflow-hidden">
        <h1 className="text-xl md:text-5xl max-w-[700px] font-semibold">
          Contrata a los expertos que necesitas para tu proyecto
        </h1>
        <p className="max-w-[440px] mb-4 mt-2">
          En Lion Outsourcing reunimos a los mejores talentos en el área de
          petróleo y gas [aquí va la lista de áreas] en Venezuela. ...
        </p>

        <div className="flex flex-col md:flex-row  items-center gap-3 md:gap-10">
          <FuturisticButton>Contratar</FuturisticButton>
          <a href="/aplicar" className="bg-gray-100 rounded-xl px-10 py-3">
            Busco trabajo
          </a>
        </div>
          {/* <img src={hero} alt="hero" className="absolute -right-24 bottom-0 " />
           */}
           <div className="absolute -bottom-14 -right-20 -max  pointer-events-none ">
              <HeroSVG />
           </div>
      </main>
      <footer></footer>
    </div>
  );
}
