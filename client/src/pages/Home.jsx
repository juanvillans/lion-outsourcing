import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import FuturisticButton from "../components/FuturisticButton";
import LanguageSwitcher from "../components/LanguageSwitcher";
import logo from "../assets/logo.png";
import hero from "../assets/hero.svg";
import tip from "../assets/tip.svg";
import HeroSVG from "../components/HeroSVG";
import energy from "../assets/energy.mp4";
import trabajadores from "../assets/trabajadores2.png";
import rueda from "../assets/rueda.svg";
import Navigation from "../components/navigation";

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fadeInUp");
    } else {
      entry.target.classList.remove("fadeInUp");
    }
  });
});

setTimeout(() => {
  const elements = document.querySelectorAll(".animateOnScroll");
  elements.forEach((el) => observer.observe(el));
}, 1000);


export default function Home() {
  const { t } = useTranslation("home");
  const { t: tCommon } = useTranslation("common");

  return (
    <div>
      <div className="relative h-screen w-full overflow-hidden overflow-x-hidden ">
        <title>Home</title>
          <Navigation />
        <main className="mt-36 xl:pt-16 lg:mt-44 px-4 w-full lg:px-32 overflow-hidden">
          <h1 className="fadeInUp text-2xl z-40 md:text-6xl max-w-[700px] font-semibold">
            {t("hero.title")}
          </h1>

          <p className="max-w-[440px] text-sm md:text-base z-40 mb-4 mt-2 fadeInUp">{t("hero.subtitle")}</p>

          <div className="fadeInUp-delay-0-5 flex  md:flex-row  items-center gap-3 md:gap-10">
            <FuturisticButton>{t("hero.cta")}</FuturisticButton>
            <a
              href="/aplicar"
              className="text-sm md:text-base px-5 bg rounded-xl md:px-10 py-2.5 border border-caribe hover:bg-pink "
            >
              {t("hero.ctaSecondary")}
            </a>
          </div>
          <div className="fadeInUp-delay-1 flex  md:w-[380px] mx-auto md:mx-0 justify-center gap-3 md:justify-between mt-5 text-gray-400">
            <div className="bg-gray-200 rounded-full p-2 md:p-3 shadow-inner  flex items-center justify-center w-10 h-10  ">
              <Icon icon="temaki:oil-well" className="" />
            </div>
            <div className="bg-gray-200 rounded-full p-3 shadow-inner flex items-center justify-center w-10 h-10  ">
              <Icon icon="material-symbols-light:electric-bolt" className="" />
            </div>
            <div className="bg-gray-200 rounded-full p-3 shadow-inner flex items-center justify-center w-10 h-10  ">
              <Icon icon="mdi:factory" className="" />
            </div>
            <div className="bg-gray-200 rounded-full p-3 shadow-inner flex items-center justify-center w-10 h-10  ">
              <Icon icon="fluent:gas-propane-20-filled" className="" />
            </div>
            <div className="bg-gray-200 rounded-full p-3 shadow-inner flex items-center justify-center w-10 h-10  ">
              <Icon icon="fa7-solid:helmet-safety" className="" />
            </div>
          </div>
          {/* <img src={hero} alt="hero" className="absolute -right-24 bottom-0 " />
           */}
          <div className="absolute -right-10 -bottom-14 md:-right-20   pointer-events-none ">
            <HeroSVG />
          </div>
        </main>
      </div>

      <section className="relative w-full md:h-[800px] overflow-hidden text-white z-10">
        <video
          width={"100%"}
          className="h-[700px] md:h-[800px] object-cover"
          autoPlay
          muted
          loop
        >
          <source src={energy} type="video/mp4" />
        </video>

        <p className="hidden md:block absolute text-center -translate-x-1/2 top-4 left-1/2 tracking-widest font-bold text-sm ">
          {t("chooseSection.title")}
        </p>
        <div className="absolute w-full text-white grid grid-cols-1 md:grid-cols-2 top-0 left-0 h-full">
          <div className="bg-purple/15 text-center">
            <p className="animateOnScroll mt-10 md:mt-36 text-white/70 tracking-widest font-bold text-sm ">
              {t("chooseSection.companies.label")}
            </p>

            <h4 className="animateOnScroll  px-1 md:px-0 text-xl lg:text-4xl mt-7 md:mt-20 text-white">
              {t("chooseSection.companies.title")}
            </h4>

            <ul className="mt-5 animateOnScroll text-sm md:mt-20  list-disc list-inside ">
              {t("chooseSection.companies.benefits", {
                returnObjects: true,
              }).map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>

            <button className="animateOnScroll shadow mt-5 md:mt-20 bg-white/30 px-6 py-3 rounded-xl hover:bg-caribe">
              <p className="text-shadow">{t("chooseSection.companies.cta")}</p>
            </button>
          </div>

          <div className="bg-ceil/15 text-center ">
            <p className="animateOnScroll mt-10 md:mt-36 text-white/70 tracking-widest font-bold text-sm ">
              {t("chooseSection.candidates.label")}
            </p>
            <h4 className="animateOnScroll  px-1 md:px-0 text-xl text-white lg:text-4xl mt-7 md:mt-20">
              {t("chooseSection.candidates.title")}
            </h4>

            <ul className="animateOnScroll mt-5 text-sm md:mt-20  list-disc list-inside">
              {t("chooseSection.candidates.benefits", {
                returnObjects: true,
              }).map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>

            <button className="animateOnScroll shadow mt-5 md:mt-20 bg-white/30 px-6 py-3 rounded-xl hover:bg-purple">
              {t("chooseSection.candidates.cta")}
            </button>
          </div>
        </div>
      </section>

      <div className="relative animateOnScroll">
        <img
          src={rueda}
          alt="rueda"
          className="absolute -left-[500px] top-[290px] w-[1000px] spinAnimation  "
        />
        
         <img
          src={rueda}
          alt="rueda"
          className="absolute -left-[100px] top-[670px] w-[200px] spinAnimation  spinFaster  "
        />

         <img
          src={rueda}
          alt="rueda"
          className="absolute left-[65px] top-[795px] w-[135px] spinAnimationBackwards spinFaster2  "
        />

         <img
          src={rueda}
          alt="rueda"
          className="absolute -left-[10px] top-[897px] w-[135px] spinAnimation spinFaster2  "
        />
        <section
          id="quienes-somos"
          className="relative gap-5 justify-between mx-auto max-w-[750px] px-1 w-11/12 mt-16 lg:mt-36 md:flex"
        >
          <div className="">
            <h2 className="animateOnScroll z-40 text-2xl md:text-4xl lg:text-7xl font-bold max-w-[520px] md:absolute ">
              {t("about.title")}
            </h2>
            <p className="animateOnScrol leading-5 mt-2 mb-4 lg:mt-60 font-light text-gray-700 text-lg md:text-2xl">
              {t("about.slogan")}
            </p>
          </div>
          <div className="z-10 md:max-w-[450px] md:px-10 relative bg-white ">
            <img
              className="h-[250px] md:h-[470px] animateOnScroll  object-cover rounded-md"
              src={trabajadores}
              alt=""
            />
            <p className="mt-6 md:mt-10 text-sm animateOnScroll text-dark">{t("about.description")}</p>

            <div className="animateOnScroll mt-6 md:mt-10">
              <h4 className="text-lg font-bold md:text-xl text-dark">
                {t("about.whatWeDo.title")}
              </h4>
              <p className="text-sm text-dark">
                {t("about.whatWeDo.description")}
              </p>
            </div>

            <div className="animateOnScroll mt-6 md:mt-10 mb-20">
              <h4 className=" text-lg font-bold md:text-xl text-dark">
                {t("about.scope.title")}
              </h4>
              <ul className="box-border pl-3.5 text-sm text-dark list-item  *:list-disc">
                {t("about.scope.items", { returnObjects: true }).map(
                  (item, i) => (
                    <li key={i}>{item}</li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </section>
      </div>

      <footer></footer>
    </div>
  );
}
