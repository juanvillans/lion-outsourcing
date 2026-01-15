import React, { useState, useEffect, useCallback, useMemo } from "react";
import { workTeamAPI } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useFeedback } from "../../context/FeedbackContext";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "@iconify/react";
import { MaterialReactTable } from "material-react-table";
import TrabajadoresPage from "./TrabajadoresPage";
import Modal from "../../components/Modal";

import { API_URL } from "../../config/env";

export default function DetalleEquipoPage() {
  const { id } = useParams();
  const [workTeam, setWorkTeam] = useState(null);
  const { showError, showSuccess, showInfo } = useFeedback();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = useState({});
  const [isOpenModal, setIsOpenModal] = useState(false);
  const selectedRowData = Object.keys(rowSelection)
    .filter((key) => rowSelection[key])
    .map((key) => workTeam?.employees[parseInt(key)].id);

  const fetchWorkTeam = useCallback(async () => {
    try {
      const res = await workTeamAPI.getWorkTeam(id);
      setWorkTeam(res.data);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  }, [id]);

  const removeEmployee = async (teamId, employeeIds) => {
    try {
      await workTeamAPI.removeEmployeeFromWorkTeam(teamId, {
        employee_ids: employeeIds,
      });
      showSuccess("Trabajador removido del equipo con éxito");
      fetchWorkTeam();
      setRowSelection({});
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      showError(errorMessage);
    }
  };

  useEffect(() => {
    fetchWorkTeam();
  }, [fetchWorkTeam]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Cód",
        size: 60,
        enableColumnFilter: true,
        enableSorting: true,
      },
      {
        accessorKey: "photo",
        header: "Foto",
        size: 110,
        filterFn: "includesString",
        enableColumnFilter: true,
        enableSorting: true,
        Cell: ({ cell }) => (
          <img
            src={API_URL + "/storage/" + cell.getValue()}
            alt="Profile"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "4px",
              objectFit: "cover",
            }}
            // This ensures the image is loaded before the print dialog opens
            loading="lazy"
          />
        ),
      },
      {
        accessorKey: "fullname",
        header: "Nombre completo",
        size: 110,
        filterFn: "includesString",
        enableColumnFilter: true,
        enableSorting: true,
      },
      {
        accessorKey: "industry.name",
        header: "Industria",
        size: 120,
        filterFn: "includesString",
        enableColumnFilter: true,
        enableSorting: true,
      },
      {
        accessorKey: "area.name",
        header: "Especialidad",
        size: 83,
        enableColumnFilter: false,
        enableSorting: true,
      },
      //   {
      //     accessorKey: "email",
      //     header: "Correo Electrónico",
      //     size: 200,
      //   },
      {
        accessorKey: "phone_number",
        header: "Teléfono",
        size: 100,
      },
      {
        accessorKey: "localization",
        header: "Ubicación",
        size: 100,
      },
      {
        accessorKey: "academic_title",
        header: "Título/Grado acádemico",
        size: 100,
      },

      {
        accessorKey: "created_at",
        header: "Fecha",
        size: 155,
        filterFn: "equals",

        enableColumnFilter: true,
        enableSorting: true,
        Cell: ({ cell }) => {
          const dateString = cell.getValue();

          // Safety check in case the value is null or undefined
          if (!dateString) return "N/A";

          return new Date(dateString).toLocaleString(navigator.language, {
            dateStyle: "medium",
            timeStyle: "short",
          });
        },
        // Optional: make the column look nicer
        muiTableBodyCellProps: {
          sx: { whiteSpace: "nowrap" },
        },
      },
      {
        accessorKey: "skills",
        header: "Habilidades",
        size: 100,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value.map((skill, i) => {
            return (
              <span
                title={`${
                  skill?.id == null ? "Crear nueva habilidad" : skill.name
                }`}
                className={`${
                  skill.id == null ? "bg-red-200 hover:bg-red-300" : ""
                } inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2`}
                key={skill.id + i + skill.name}
                onClick={(e) => {
                  if (skill.id == null) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Handle creation of new skill
                    setSelectedWorkerForNewSkill({
                      index: i,
                      skillName: skill.name,
                      worker: cell.row.original,
                    });
                    setOpenModalSkill(true);
                  }
                }}
              >
                {skill.id == null ? (
                  <Icon icon="mdi:plus" className="inline mr-1" />
                ) : null}
                {skill.name}
              </span>
            );
          });
        },
        enableSorting: false,
      },
    ],
    []
  );

  return (
    <div>
      <title>Detalle de Equipo - Lion PR Services</title>
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2  bg-gray-100 rounded-md"
        >
          <Icon icon="mdi:arrow-left" className="mr-2" />
        </button>
        <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-0">
          Detalle del equipo
        </h1>
      </div>

      <div className="col-span-4 mb-10 w-max p-4 md:p-6 bg-gray-100 neuphormism rounded-2xl">
        <p>
          <strong className="text-dark">Nombre:</strong> {workTeam?.name}
        </p>
        <p>
          <strong className="text-dark">Descripción:</strong>{" "}
          {workTeam?.description}
        </p>
        <p>
          <strong className="text-dark">Equipo contratado:</strong>{" "}
          {workTeam?.is_hired ? "Sí" : "No"}
        </p>
        <p>
          <strong className="text-dark">Fecha de fin de contrato:</strong>{" "}
          {workTeam?.end_date_contract}
        </p>
      </div>

      <div>
        <div className="flex justify-between">
          <h2 className="text-center font-semibold mb-5">
            Miembros del equipo
          </h2>
          <button
            className="px-4 py-2 mb-3 bg-caribe text-white rounded-lg hover:brightness-110"
            onClick={() => setIsOpenModal(true)}
          >
            Agregar miembros
          </button>
        </div>
        <MaterialReactTable
          columns={columns}
          data={workTeam?.employees || []}
          enableColumnFilters
          enableSorting
          enablePagination
          // Habilitar selección de filas
          enableRowSelection
          enableMultiRowSelection={true} // Permite seleccionar múltiples filas
          positionToolbarAlertBanner="top" // Muestra el contador de selección
          // Opcional: Selección inicial
          initialState={{
            density: "compact",
            columnVisibility: {
              created_at: false,
            },
            rowSelection: {}, // Para selección inicial si es necesario
          }}
          // Estado para la selección
          state={{
            rowSelection, // Añade esto
          }}
          // Handler para cambios en selección
          onRowSelectionChange={setRowSelection}
          muiTablePaginationProps={{
            rowsPerPageOptions: [5, 10, 25, 50],
            showFirstButton: true,
            showLastButton: true,
          }}
        />
      </div>

      {selectedRowData.length > 0 && (
        <div className="flex z-50 fixed bottom-10  gap-3 justify-end pt-4">
          <button
            className="px-4 py-2 bg-gray-400 text-black rounded-lg hover:brightness-110"
            onClick={() => {
              removeEmployee(id, selectedRowData);
            }}
          >
            Quitar de este equipo
          </button>
        </div>
      )}

      <Modal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        title="Agregar miembros"
        size="full"
      >
        <TrabajadoresPage
          onSuccessTeam={() => {
            fetchWorkTeam();
            setIsOpenModal(false);
          }}
          useForWorkTeam={true}
          workTeamId={id}
          employeeIdsObj={workTeam?.employees.reduce((acc, employee) => {
            acc[employee.id] = true;
            return acc;
          }, {})}
        />
      </Modal>
    </div>
  );
}
