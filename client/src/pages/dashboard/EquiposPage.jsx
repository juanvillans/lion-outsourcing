import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Icon } from "@iconify/react";
import FuturisticButton from "../../components/FuturisticButton";
import CreateWorkTeamModal from "../../components/dashboard/CreateWorkTeamModal";

import { workTeamAPI } from "../../services/api";

export default function EquiposPage() {
  const [workTeams, setWorkTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchWorkTeams = useCallback(async () => {
    try {
      const res = await workTeamAPI.getWorkTeams();
      setWorkTeams(res.data);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  }, []);
  useEffect(() => {}, [fetchWorkTeams]);

  return (
    <div>
      <div>
        <div className="md:flex justify-between items-center mb-4">
          <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-0">
            Equipos de Trabajo
          </h1>
          <FuturisticButton
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <Icon icon="mdi:plus" />
            Nuevo Equipo
          </FuturisticButton>

          <CreateWorkTeamModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditData(null);
            }}
            editMode={false}
            initialData={null}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 lg:gap-10 mt-10">
          <div className="border-t-2  border-l-2 p-4 relative neuphormism bg-gray-100 group cursor-pointer rounded-tl-none hover:text-gray-700  equipoFolder">
            <div
              className="text-gray-500 font-bold border-t-2  flex-col  border-l-2 absolute flex text-xs items-baseline -left-0.5 px-2 rounded-xl rounded-l-none -top-6 pt-1 h-14 w-32"
              style={{ background: "#f7f7f7" }}
            >
              <p>EQUIPO 1</p>
              <p className="text-xs font-normal">9/4/1299</p>
            </div>
            <h2 className="font-semibold mb-2 mt-3">
              Empresa xxi administration US
            </h2>

            <div className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-1 ">
                <Icon
                  icon="fluent:text-description-16-filled"
                  className=" text-gray-500 mt-1 w-4 h-4"
                />
              </div>
              <p className="text-sm text-gray-800 col-span-11">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
                esse maiores a quo enim deserunt. Ipsa minima assumenda adipisci
                laudantium vitae..
              </p>
            </div>

            <div className="grid grid-cols-12 gap-2 w-full">
              <div className="w-16 col-span-1">
                <Icon
                  icon="fluent:people-team-20-filled"
                  className="w-4 h-4 mt-1 text-gray-500"
                ></Icon>
              </div>
              <p className="col-span-11 text-sm text-gray-800">23 Personas</p>
            </div>

            <div className="grid grid-cols-12 gap-2 w-full mt-2">
              <div className="w-16 col-span-1">
                <div className="h-3 w-3 rounded-full mt-1 bg-green-600 shadow-lg shadow-color2"></div>
              </div>
              <p className="col-span-11 text-sm text-gray-800">
                Contratado hasta el 12/05/2027
              </p>
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
