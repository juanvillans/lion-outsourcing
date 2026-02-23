import logo from "../assets/logo.png";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

export default function Navigation() {
  const { t: tCommon } = useTranslation("common");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="glass-card flex w-full justify-between px-2 md:px-5 lg:px-32 py-2 items-center fixed  md:top-0  z-50  bg-white/10">
      <a href="/" className="flex  items-center  gap-2">
        <img src={logo} alt="logo" className="w-12 md:w-16 " />
        <span className="font-bold text-md md:text-xl text-al leading-3 text-center">
          LION <span className="text-caribe">PR</span>
          <span className="text-[14.5px] mt-0.5  md:text-[16.5px] opacity-90 tracking-wider md:tracking-widest  block md:-mt-2">
          services
          </span>
        </span>
      </a>

      <div className="flex gap-5 flex-nowrap slideIn   h-full  items-center ">
       
        <div
          className={`flex-col lg:flex-row  gap-5 flex lg:flex  ${menuOpen ? "flex" : "hidden"} py-3 absolute lg:static top-full left-0 w-full lg:w-auto bg-white/90 lg:bg-transparent py- lg:py-0 px-5 lg:px-0`}
        >
          <a href="#quienes-somos" className="slideIn text-caribe font-bold">
            {tCommon("nav.aboutUs")}
          </a>
          
        </div>
        <LanguageSwitcher />
         <button
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
          className="cursor-pointer slideIn lg:hidden text-3xl text-caribe"
        >
          <Icon icon="material-symbols-light:menu-rounded" />
        </button>
      </div>
    </nav>
  );
}
