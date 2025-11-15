'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import  Link from "next/link";

const links = [
  {
    permission: true,
    name: "Inicio",
    href: "/dashboard",
    icon: "hugeicons:home-09",
  },
  {
    permission: true,
    name: "Trabajadores",
    href: "/dashboard/talents",
    icon: "hugeicons:labs",
  },
    {
    permission: true,
    name: "Empresas",
    href: "/dashboard/bussinesses",
    icon: "hugeicons:labs",
  },
  {
    permission: "allow_handle_users",
    name: "Administradores",
    href: "/dashboard/admins",
    icon: "solar:user-linear",
  },
   {
    permission: "profesions",
    name: "Profesiones",
    href: "/dashboard/admins",
    icon: "solar:user-linear",
  },
];


export default function DashboardNav() {
//   const { logout } = useAuth();
//   const handleLogout = async () => {
//     try {
//       await authAPI.logout();
//       logout();
//     } catch (error) {
//       console.error("Failed to logout", error);
//     }
//   }

//   const { user } = useAuth();
let isActive = false;
  return (
    <nav
      className="flex w-full bg-color1 h-full flex-col px-3 pr-1 py-1 md:py-4 md:px-4"
    >

      <Link
        className={`duration-150 hidden  mb-4 font-exo2 md:flex h-20 items-end justify-end rounded-md bg-white/5   md:h-28 p-4`}
        href="/"
      >
        <div className="w-32 relative duration-150 text-white md:w-40 flex flex-row justify-between items-end">
          <img
            // src={labFalconLogo}
            className={`h-12 logo w-12 duration-150 `}
            alt="logo del sistema"
          />
          
            <p className="block duration-300  absolute -bottom-1 right-1 font-semibold self-end opacity-100">
              Lion Services
            </p>
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {links.map((eachLink) => {
        //   if (eachLink.permission === true || user?.[eachLink?.permission]) {
            return (
              <Link
                href={eachLink.href}
                key={eachLink.href}
                className={
                  `flex h-[48px] hover:text-color3 grow items-center relative justify-between gap-2  text-sm font-medium hover:bg-white/10 rounded-2xl md:flex-none md:justify-between pl-2 ${
                    isActive
                      ? "activeLink text-color1 rounded-2xl md:rounded-none  md:rounded-l-2xl"
                      : "text-gray-50"
                  }`
                }
              >
                <div className="grid grid-cols-12  items-center">
                    {/* <Icon className={` col-span-3 z-10`} icon={eachLink.icon} width={24} height={24} /> */}
                    <span className="hidden md:block opacity-100 duration-200 z-0" >
                      {eachLink.name}
                    </span>

                </div>
              </Link>
            );
          }
        )}
        <div className="hidden h-auto w-full grow rounded-md md:block"></div>
        <div className="flex gap-2 justify-start items-center">
        
          <button
            // onClick={handleLogout}
            title="Cerrar sesión"
            className=" flex text-white text-opacity-50 h-[48px] grow items-center justify-center gap-2 rounded-md  text-sm font-medium hover:bg-sky-100 hover:text-white md:flex-none md:justify-start md:p-2 md:px-1"
          >
            {/* <Icon icon="tabler:logout" width="24" height="24" /> */}
              <span className="sr-only">Cerrar sesión</span>
          </button>
          <p className="text-xs text-left text-opacity-55  text-white ">
            {/* { user?.first_name } */}
          </p>
        </div>
      </div>
    </nav>
  );
}
