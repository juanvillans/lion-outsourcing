import { Icon } from "@iconify/react";
import FuturisticButton from "../components/FuturisticButton";
import logo from "../assets/logo.png";
import hero from "../assets/hero.svg";
import tip from "../assets/tip.svg";
import HeroSVG from "../components/HeroSVG";
import energy from "../assets/energy.mp4";
export default function Home() {
  return (
    <div>
      <div className="relative h-screen w-screen ">
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
              {/* <FuturisticButton>
              <a href="/contratar">Contratar</a>
            </FuturisticButton> */}
              <a href="/login">Iniciar Sesión</a>
              {/* <a href="/register" className="flex gap-2 items-center">    <Icon icon="solar:user-circle-outline" width="24" height="24" />  <span> Mi perfil</span></a> */}
            </div>
          </nav>
        </header>
        <main className="mt-10 lg:mt-5 xl:pt-16 px-3 w-full lg:px-32 overflow-hidden">
          <h1 className="text-xl md:text-6xl max-w-[700px] font-semibold">
            {/* Contrata a los expertos que necesitas para tu proyecto */}
            Impulsamos sus Proyectos con Personal Técnico de Alto Nivel
            {/* Talento Especializado para los Sectores de Energía e infraestructura */}
          </h1>

          <p className="max-w-[440px] mb-4 mt-2">
            Conectamos a empresas exigentes con expertos certificados en
            Petróleo, Gas y el sector eléctrico de Venezuela
          </p>

          <div className="flex flex-col md:flex-row  items-center gap-3 md:gap-10">
            <FuturisticButton>Contactar</FuturisticButton>
            <a
              href="/aplicar"
              className="bg rounded-xl px-10 py-2.5 border border-caribe hover:bg-pink "
            >
              Postular mi CV
            </a>
          </div>
          <div className="flex  w-[380px] justify-between mt-5 text-gray-400">
            <div className="bg-gray-200 rounded-full p-3 shadow-inner ">
              <Icon icon="temaki:oil-well" width="24" height="24" />
            </div>
            <div className="bg-gray-200 rounded-full p-3 shadow-inner">
              <Icon
                icon="material-symbols-light:electric-bolt"
                width="24"
                height="24"
              />
            </div>
            <div className="bg-gray-200 rounded-full p-3 shadow-inner">
              <Icon icon="mdi:factory" width="24" height="24" />
            </div>
            <div className="bg-gray-200 rounded-full p-3 shadow-inner">
              <Icon
                icon="fluent:gas-propane-20-filled"
                width="24"
                height="24"
              />
            </div>
            <div className="bg-gray-200 rounded-full p-3 shadow-inner">
              <Icon icon="fa7-solid:helmet-safety" width="24" height="24" />
            </div>
          </div>
          {/* <img src={hero} alt="hero" className="absolute -right-24 bottom-0 " />
           */}
          <div className="absolute -bottom-14 -right-20 -max  pointer-events-none ">
            <HeroSVG />
          </div>
        </main>
      </div>
      <section className="relative w-screen text-white">
        
        <video width={"100%"} height={"100vh"} autoPlay muted loop>
          <source src={energy} type="video/mp4" />
        </video>

        <p className="absolute -translate-x-1/2 top-4 left-1/2 tracking-widest font-bold text-sm ">
          Elige como trabajar con Lion PR Services
        </p>
        <div className="absolute w-full text-white grid grid-cols-2 top-0 left-0 h-full">
          <div className="bg-purple/15 text-center">
            <p className="mt-36 text-white/70 tracking-widest font-bold text-sm ">
              EMPRESAS
            </p>

            <h4 className="text-3xl lg:text-4xl mt-20">
              Contrata talento técnico certificado
            </h4>

            <ul className="mt-20 font-bold">
              <li>Reducción de costos operativos </li>
              <li>Profesionales verificados</li>
              <li>Incorporación rápida</li>
            </ul>

            <button className="mt-20 bg-white/30 px-6 py-3 rounded-xl hover:bg-ceil">
                Solicitar consultoria
            </button>

            
          </div>
          <div className="bg-ceil/15 text-center ">
            <p className="mt-36 text-white/70 tracking-widest font-bold text-sm ">
              CANDIDATOS
            </p>
            <h4 className="text-3xl lg:text-4xl mt-20">
              Accede a proyectos de alto nivel
            </h4>

            <ul className="mt-20 font-bold">
              <li>Crecimiento profesional </li>
              <li>Empresas confiables </li>
              <li>Proyectos reales </li>
            </ul>

            <button className="mt-20 bg-white/30 px-6 py-3 rounded-xl hover:bg-purple">
                Postular mi CV
            </button>

            
          </div>
        </div>
      </section>
      <footer></footer>
    </div>
  );
}
