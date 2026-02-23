import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  applicantsAPI,
  areasAPI,
  industriesAPI,
  skillsAPI,
} from "../../services/api";

import { Icon } from "@iconify/react";
import Modal from "../../components/Modal";
import FuturisticButton from "../../components/FuturisticButton";
import FormField from "../../components/forms/FormField";
import { CircularProgress, getInputAdornmentUtilityClass } from "@mui/material";
import { Autocomplete, TextField, Box } from "@mui/material";
import { useFeedback } from "../../context/FeedbackContext";
import { MaterialReactTable } from "material-react-table";

import debounce from "lodash.debounce";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../config/env";
import { useNavigate } from "react-router-dom";
import { getIndustryIcon } from "../../config/industryIcons";
import FilterAreaAndSkill from "../../components/dashboard/FilterAreaAndSkill";

export default function AplicantesPage() {
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess, showInfo } = useFeedback();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageData, setMessageData] = useState({});
  const [resultsToken, setResultsToken] = useState(null);
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [areas, setAreas] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  // Form configuration for ReusableForm

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
        accessorKey: "industry",
        header: "Industria",
        size: 120,
        filterFn: "includesString",
        enableColumnFilter: true,
        enableSorting: true,

        Cell: ({ cell }) => {
          const industryObj = cell.getValue();
          return (
            <p className="flex gap-3">
              {industryObj.name}
              <Icon
                icon={getIndustryIcon(industryObj.id)}
                width={16}
                style={{ marginTop: 3 }}
              />
            </p>
          );
        },
      },
      {
        accessorKey: "area.name",
        header: "Especialidad",
        size: 83,
        enableColumnFilter: true,
        enableSorting: true,
      },

      {
        accessorKey: "email",
        header: "Correo Electrónico",
        size: 200,
      },
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
          return value.map((skill) => {
            return (
              <span
               
                className={`${
                  skill.id == null ? "bg-red-200" : ""
                } inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2`}
                key={skill.id}
               
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

  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Server-side state
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
  const [sorting, setSorting] = useState([{ id: "id", desc: true }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [customFilters, setCustomFilters] = useState({
    area_id: null,
    area: null,
    skills: "",
    skillsArray: [],
  });
  const [skills, setSkills] = useState([]);
  // Move useMemo outside the map - process all test sections at once

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    console.log(customFilters);

    try {
      const res = await applicantsAPI.getApplicants({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        sortField: sorting[0]?.id || "id",
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
        search: globalFilter, // Global search
        filters: JSON.stringify(
          columnFilters.reduce((acc, curr) => {
            acc[curr.id] = curr.value;
            return acc;
          }, {})
        ),
        ...customFilters,
      });
      setData(res.data);
      setRowCount(res.meta.total);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
    setIsLoading(false);
  }, [pagination, sorting, columnFilters, globalFilter, customFilters]);

  const fetchInitialData = useCallback(async () => {
    try {
      // const [examTypesRes, originsRes] = await Promise.all([
      //   examinationTypesAPI.getExaminationTypes(),
      //   originsAPI.getOrigins(),
      // ]);
      // setExaminationTypes(examTypesRes.data.examinationTypes);
      // setOrigins(originsRes.data.origins);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  }, []);

  const getAreas = useCallback(async () => {
    try {
      const res = await areasAPI.getAreas();
      setAreas(res.data);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  }, []);

  const searchSkills = useCallback(async (searchTerm) => {
    try {
      const response = await skillsAPI.searchSkills({ search: searchTerm });
      setSkills(response.data);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  }, []);

  const getIndustries = useCallback(async () => {
    try {
      const res = await industriesAPI.getIndustries();
      setIndustries(res.data);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
    getAreas();
    getIndustries();
  }, [fetchInitialData, getAreas, getIndustries]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced global filter handler
  const debouncedGlobalFilter = useMemo(
    () =>
      debounce((value) => {
        setGlobalFilter(value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page
      }, 300),
    []
  );

  return (
    <>
      <title>Aplicantes - Lion PR Services</title>
      <div style={{ height: 580, width: "100%" }}>
        <div className="md:flex justify-between items-center mb-4">
          <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-0">
            Aplicantes
          </h1>
        </div>

        <FilterAreaAndSkill
          areas={areas}
          skills={skills}
          customFilters={customFilters}
          setCustomFilters={setCustomFilters}
          onFilterChange={fetchData}
          onSearchSkills={searchSkills}
        />
      

        {!isModalOpen && (
          <div
            className="ag-theme-alpine ag-grid-no-border"
            style={{ height: 500 }}
          >
            {
              <MaterialReactTable
                columns={columns}
                data={data}
                rowCount={rowCount}
                manualPagination
                manualSorting
                manualFiltering
                manualGlobalFilter
                initialState={{
                  density: "compact",
                  columnVisibility: {
                    email: false, // This matches the accessorKey
                    localization: false,
                  },
                }}
                state={{
                  pagination,
                  sorting,
                  columnFilters,
                  globalFilter,
                  isLoading,
                }}
                onPaginationChange={setPagination}
                onSortingChange={setSorting}
                onColumnFiltersChange={setColumnFilters}
                onGlobalFilterChange={(value) => debouncedGlobalFilter(value)}
                enableGlobalFilter={true}
                enableColumnFilters={true}
                enableSorting={true}
                enableFilters={true}
                muiTablePaginationProps={{
                  rowsPerPageOptions: [25, 50, 100],
                  showFirstButton: true,
                  showLastButton: true,
                }}
                muiSearchTextFieldProps={{
                  placeholder: "Buscar",
                  sx: { minWidth: "300px" },
                  variant: "outlined",
                }}
                muiTableBodyRowProps={({ row }) => ({
                  onClick: () => {
                    navigate(`/dashboard/aplicantes/${row.original.id}`);
                  },
                  sx: { cursor: "pointer" },
                })}
              />
            }
          </div>
        )}
      </div>
    </>
  );
}
