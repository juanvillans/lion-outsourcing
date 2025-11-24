import { Icon } from "@iconify/react";
import FuturisticButton from "../components/FuturisticButton";


export default function Home() {
  return (
    <>
        <title>Home</title>
        <header>

            <nav className="flex w-full justify-between px-5 lg:px-32 py-5">


                <a href="/">Lion Services</a>

                <div className="flex gap-5 items-center">
                    <FuturisticButton>
                    <a href="/contratar">Contratar</a>
                    </FuturisticButton>
                        <a href="/aplicar">Busco trabajo</a>
                    <a href="/login">Iniciar Sesión</a>
                    {/* <a href="/register" className="flex gap-2 items-center">    <Icon icon="solar:user-circle-outline" width="24" height="24" />  <span> Mi perfil</span></a> */}
                 
                </div>
            </nav>
        </header>
        <main className="mt-10 lg:mt-20 xl:pt-32 px-3 lg:px-32">
            <h1 className="text-xl md:text-4xl">Contrata a los expertos que necesitas para tu proyecto</h1>
            <p className="max-w-[600px] mb-4 mt-1">
                En Lion Outsourcing reunimos a los mejores talentos en el área de petróleo y gas [aquí va la lista de áreas] en Venezuela. ... 
            </p>


            <div className="flex flex-col md:flex-row  items-center gap-3 md:gap-10">
                <FuturisticButton>
                    Contratar
                </FuturisticButton>
                <a href="/aplicar" className="bg-gray-100 rounded-xl px-10 py-3">Busco trabajo</a>

            </div>
        </main>
        <footer>

        </footer>
    </>
  );
}                                                                                                                                                                                                                                               