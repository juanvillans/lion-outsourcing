import logo from "../assets/logo.png";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navigation() {
  const { t: tCommon } = useTranslation("common");

  return (
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
        <a href="#quienes-somos" className="text-caribe font-bold">
          {tCommon("nav.aboutUs")}
        </a>
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
