import { Search, CircleUserRound, ArrowRight } from "lucide-react";
import { type NextPageIntlayer, IntlayerClientProvider } from "next-intlayer";
import {IntlayerServerProvider} from "next-intlayer/server";

const Home: NextPageIntlayer = async ({ params }) => {
  const {locale} = await params;
  return (
    <IntlayerServerProvider locale={locale}>
      <IntlayerClientProvider locale={locale}>
        <>
        <title>Home</title>
        <header>
          <nav className="flex w-full justify-between px-5 lg:px-16 py-5">
            <a href="/">Lion Services</a>

            <div className="flex gap-4 items-center">
              <a href="/work" className="hover:bg-white/10  px-5 py-2 rounded-lg">Busco trabajar</a>
              <a href="/hire" className="bg-caribean-sea inline-block px-4 py-2 rounded-lg font-bold">Contratar</a>
              <a href="/login">Iniciar Sesión</a>
              {/* <a href="/register" className="flex gap-2">
                Mi perfil
                <CircleUserRound />
              </a> */}
              {/* <Icon icon="solar:user-circle-outline" width="24" height="24" /> */}
            </div>
          </nav>
        </header>
        <main className="mt-10 lg:mt-40 px-5 lg:px-16">
          <h1 className="text-3xl font-bold">Contrata a los expertos que necesitas para tu proyecto</h1>
          <p className="">
            En Lion Outsourcing reunimos a los mejores talentos en el área de
            petróleo y gas [aquí va la lista de áreas] en Venezuela. ...
          </p>
          
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-10 mt-4">
            <a href="/hire" className="bg-caribean-sea text-xl inline-block px-4 py-2 rounded-lg font-bold">Contratar</a>
          </div>
        </main>
        <footer></footer>
      </>
      </IntlayerClientProvider>

    </IntlayerServerProvider>
  );
};


export default Home;
