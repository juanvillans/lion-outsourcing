import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Icon } from "@iconify/react";
import FuturisticButton from "../../components/FuturisticButton";

export default function EquiposPage() {
  return (
    <div>
      <div>
        <div className="md:flex justify-between items-center mb-4">
          <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-0">
            Equipos de Trabajo
          </h1>
          <FuturisticButton>
            <Icon icon="mdi:plus" />
            Nuevo Equipo
          </FuturisticButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 lg:gap-10">
          <div className="relative group cursor-pointer hover:text-gray-400 equipoFolder">
            <Icon
              icon="fa6-solid:folder"
              className="text-gray-200 icon group-hover:text-gray-200 absolute w-full h-full cursor-pointer"
            />
            <div className="absolute w-full h-full top-10 left-0">
              <h2>Equipo 1</h2>
            </div>
          </div>
          
          <div className="relative">
            <Icon
              icon="fa6-solid:folder"
              className="text-gray-200 w-full h-full cursor-pointer hover:text-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
