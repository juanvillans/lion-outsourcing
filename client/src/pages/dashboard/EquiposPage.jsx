import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Icon } from "@iconify/react";
import FuturisticButton from "../../components/FuturisticButton";
import CreateWorkTeamModal from "../../components/dashboard/CreateWorkTeamModal";

import { workTeamAPI } from "../../services/api";
import { Link } from "react-router-dom";

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
  useEffect(() => {
    fetchWorkTeams();
  }, [fetchWorkTeams]);

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
            onSuccess={() => fetchWorkTeams()}
            editMode={false}
            initialData={null}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 lg:gap-10 mt-10">
          {workTeams.map((workTeam) => (
          <Link 
            to={`/dashboard/equipos/${workTeam.id}`}
            key={workTeam.id}
            className="border-t-2  border-l-2 p-4 relative neuphormism bg-gray-100 group cursor-pointer rounded-tl-none hover:text-gray-700  equipoFolder">
            <div
              className="text-gray-500 font-bold border-t-2  flex-col  border-l-2 absolute flex text-xs items-baseline -left-0.5 px-2 rounded-xl rounded-l-none -top-6 pt-1 h-14 w-32"
              style={{ background: "#f7f7f7" }}
            >
              <p className="text-xs font-normal">9/4/1299</p>
            </div>
            <h2 className="font-semibold mb-2 mt-3">
              {workTeam.name}
            </h2>

            <div className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-1 ">
                <Icon
                  icon="fluent:text-description-16-filled"
                  className=" text-gray-500 mt-1 w-4 h-4"
                />
              </div>
              <p className="text-sm text-gray-800 col-span-11">
                {workTeam.description}
              </p>
            </div>

            <div className="grid grid-cols-12 gap-2 w-full">
              <div className="w-16 col-span-1">
                <Icon
                  icon="fluent:people-team-20-filled"
                  className="w-4 h-4 mt-1 text-gray-500"
                ></Icon>
              </div>
              <p className="col-span-11 text-sm text-gray-800">{workTeam.employees_count} Personas</p>
            </div>

            <div className="grid grid-cols-12 gap-2 w-full mt-2">
              <div className="w-16 col-span-1">
                <div className={`h-3 w-3 rounded-full mt-1 shadow-lg ${workTeam.is_hired ? "bg-green-600 shadow-color3" : "bg-gray-600"}`}></div>
              </div>
              <p className="col-span-11 text-sm text-gray-800">
                {workTeam.is_hired ? "Contratado hasta el " + workTeam.end_date_contract : "No contratado"}
              </p>
            </div>
          </Link>

          

          ))}
        </div>
      </div>
    </div>
  );
}
