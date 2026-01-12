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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 lg:gap-10 mt-10">
          <div className="p-4 relative neuphormism bg-gray-100 group cursor-pointer hover:text-gray-700 equipoFolder">
              <h2 className="font-semibold mb-2">Equipo 1</h2>

              <div className="flex gap-2">
                <Icon icon="fluent:text-description-16-filled" className="w-16 text-gray-500 mt-1" />
                <p className="text-sm text-gray-800">Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero esse maiores a quo enim deserunt. Ipsa minima assumenda adipisci officiis debitis, quo nam fugiat eum, iste enim dolores laudantium vitae?</p>
              </div>
          </div>
          
          <div className="p-4 relative neuphormism bg-gray-100 group cursor-pointer hover:text-gray-400 equipoFolder">
              <h2 className="font-semibold">Equipo 1</h2>
              <p></p>
          </div>

          <div className="p-4 relative neuphormism bg-gray-100 group cursor-pointer hover:text-gray-400 equipoFolder">
              <h2 className="font-semibold">Equipo 1</h2>
              <p></p>
          </div>

        </div>
      </div>
    </div>
  );
}
