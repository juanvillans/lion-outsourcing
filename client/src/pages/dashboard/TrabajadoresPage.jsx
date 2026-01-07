import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  employeesAPI,
  areasAPI,
  industriesAPI,
  skillsAPI,
} from "../../services/api";
import { Icon } from "@iconify/react";
import Modal from "../../components/Modal";
import FuturisticButton from "../../components/FuturisticButton";
import FormField from "../../components/forms/FormField";
import { CircularProgress, Autocomplete, Box, TextField } from "@mui/material";
import { useFeedback } from "../../context/FeedbackContext";
import { MaterialReactTable } from "material-react-table";

import debounce from "lodash.debounce";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../config/env";
import { useNavigate } from "react-router-dom";
import { getIndustryIcon } from "../../config/industryIcons";

let isThereLocalStorageFormData = localStorage.getItem("formData")
  ? true
  : false;
// Memoized component for test fields to prevent unnecessary re-renders
const MemoizedTestField = React.memo(
  ({ field, value, onChange, testKey, fieldName, id, multiline = false }) => {
    const handleChange = useCallback(
      (e) => {
        onChange(testKey, e);
      },
      [onChange, testKey]
    );

    return (
      <FormField
        key={fieldName + "_" + testKey}
        {...field}
        examination_type_id={testKey}
        value={value || ""}
        onChange={handleChange}
        id={id}
        multiline={multiline}
      />
    );
  },
  // Custom comparison function for better memoization
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value &&
      prevProps.testKey === nextProps.testKey &&
      prevProps.fieldName === nextProps.fieldName &&
      JSON.stringify(prevProps.field) === JSON.stringify(nextProps.field)
    );
  }
);

export default function TrabajadoresPage() {
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess, showInfo } = useFeedback();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageData, setMessageData] = useState({});
  const [resultsToken, setResultsToken] = useState(null);
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const { user } = useAuth();
  const [areas, setAreas] = useState([]);

  const [industries, setIndustries] = useState([]);
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  // Form configuration for ReusableForm
  const patientFormFields = useMemo(() => [
    {
      name: "first_name",
      label: "Nombre completo",
      type: "text",
      required: true,
      className: "col-span-1",
    },
    {
      name: "last_name",
      label: "Apellido",
      type: "text",
      required: true,
      className: "col-span-1",
    },
    {
      name: "date_birth",
      label: "Fecha de Nacimiento",
      type: "date",
      required: true,
      className: "col-span-1",
    },
    {
      name: "email",
      label: "Correo Electrónico",
      type: "email",
      required: false,
      className: "col-span-1",
    },
    {
      name: "phone_number",
      label: "Teléfono",
      type: "text",
      required: false,
      className: "col-span-1",
    },
    {
      name: "address",
      label: "Dirección",
      type: "text",
      required: false,
      className: "col-span-1",
    },
    {
      name: "sex",
      label: "Sexo *",
      type: "select",
      options: [
        { value: "Masculino", label: "Masculino" },
        { value: "Femenino", label: "Femenino" },
      ],
      className: "col-span-1",
    },
    {
      name: "origin_id",
      label: "Procedencia *",
      type: "select",
      options: origins?.map((origin) => ({
        value: origin.id,
        label: origin.name,
      })),
      className: "col-span-2",
    },
  ]);

  const defaultFormData = {
    patient: {
      ci: "",
      first_name: "",
      last_name: "",
      date_birth: "",
      email: "",
      phone_number: "",
      address: "",
      sex: "",
      patient_id: null,
    },
    all_validated: false,
    tests: {},
  };

  const [formData, setFormData] = useState(structuredClone(defaultFormData));
  const [submitString, setSubmitString] = useState("Registrar");
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare both requestsF
      const internalRequest =
        submitString === "Actualizar"
          ? examsAPI.updateExam(formData.id, formData)
          : examsAPI.createExam(formData);

      const externalRequest =
        formData.patient.patient_id === null
          ? externalApi.post("/patients", {
              // Map your formData to the external API's expected format
              id: formData.patient.patient_id,
              ...formData.patient,
              name: formData.patient.first_name,
            })
          : Promise.resolve({ success: true, skipped: true });

      // Execute both requests in parallel
      const [internalResponse, externalResponse] = await Promise.all([
        internalRequest,
        externalRequest.catch((e) => {
          console.error("External API failed (non-critical):", e);
          return { success: false, error: e };
        }),
      ]);

      // Handle success
      if (submitString === "Actualizar") {
        setSubmitString("Registrar");
      }

      showSuccess("Operación completada con éxito");
      setFormData(structuredClone(defaultFormData));
      setIsModalOpen(false);
      setIsFormInitialized(false); // ← Desactivar guardado
      fetchData();
      localStorage.removeItem("formData"); // ← Limpiar
      localStorage.removeItem("submitString");
      // Optional: Log external API result
      if (!externalResponse.success) {
        console.warn("External system update failed (non-critical)");
        // You could show a non-blocking warning here if needed
      }
    } catch (error) {
      // This will only catch errors from the internal API
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error en el sistema principal";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
          return value.map((skill) => {
            return (
              <span
                title={`${
                  skill.id == null ? "Crear nueva habilidad" : skill.name
                }`}
                className={`${
                  skill.id == null ? "bg-red-200 hover:bg-red-300" : ""
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

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("¿Está seguro de eliminar este examen?")) {
        return;
      }
      await examsAPI.deleteExam(id);
      showSuccess("Examen eliminado con éxito");
      fetchData();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      showError(errorMessage);
    }

    // Call your delete API or show a confirmation dialog
  };

  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Server-side state
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
  const [sorting, setSorting] = useState([{ id: "id", desc: true }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [customFilters, setCustomFilters] = useState({});
  // Move useMemo outside the map - process all test sections at once

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await employeesAPI.getEmployees({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
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

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Create debounced function once
  const debouncedSaveFormData = useMemo(
    () =>
      debounce((data, submitStr) => {
        localStorage.setItem("formData", JSON.stringify(data));
        localStorage.setItem("submitString", JSON.stringify(submitStr));
      }, 300),
    []
  );

  useEffect(() => {
    // Solo guardar si el formulario ya fue inicializado por el usuario
    if (isFormInitialized) {
      debouncedSaveFormData(formData, submitString);
    }
  }, [formData, debouncedSaveFormData, isFormInitialized]);

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
      <title>Trabajadores - Lion PR Services</title>
      <div style={{ height: 580, width: "100%" }}>
        <div className="md:flex justify-between items-center mb-4">
          <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-0">
            Trabajadores
          </h1>
          <div className="flex gap-3">
            {isThereLocalStorageFormData && (
              <button
                title="Restaurar formulario sin guardar"
                className="hover:shadow-lg hover:bg-gray-100 flex gap-1 items-center text-gray-600 bg-gray-200 rounded-xl font-bold px-3"
                onClick={() => {
                  setFormData(JSON.parse(localStorage.getItem("formData")));
                  setSubmitString(
                    JSON.parse(localStorage.getItem("submitString"))
                  );
                  setIsModalOpen(true);
                }}
              >
                <small className="text-gray-500">Recuperar</small>
                <Icon
                  icon="line-md:backup-restore"
                  className="w-6 h-6 text-gray-500  "
                />
              </button>
            )}

            {/* <FuturisticButton
              onClick={() => {
                setIsModalOpen(true);
                if (submitString === "Actualizar") {
                  setSubmitString("Registrar");
                  setFormData(structuredClone(defaultFormData));
                }
              }}
            >
              Registrar Trabajador
            </FuturisticButton> */}
          </div>
        </div>

        <div className="flex  gap-4 mb-3">
          <Autocomplete
            id="areas-select-multiple" // Cambiado el ID para mayor claridad
            size="small"
            sx={{
              width: "min-content",
              minWidth: "400px", // Recomendado para que el label y el input no se colapsen
            }}
            options={areas || []}
            autoHighlight
            // disabled={!formData.industry_id}
            getOptionLabel={(option) =>
              option.name + " - " + option.industry.name
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) => {
              setCustomFilters((prev) => ({
                ...prev,
                area_id: value?.id || null,
              }));
              fetchData();
            }}
            value={customFilters.area}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <Box
                  key={key}
                  component="li"
                  {...optionProps}
                  className="hover:text-black text-sm md:text-md  py-0.5 px-8 flex  gap-3 my-1 cursor-pointer"
                >
                  {option.name}

                  <p className="flex gap-1 text-black/40 text-xs mt-1">
                    <Icon
                      icon={getIndustryIcon(option.industry_id)}
                      width={16}
                    />
                    {option.industry.name}
                  </p>
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Área de especialización" // Etiqueta ajustada a plural
                required
              />
            )}
          />

          <Autocomplete
            id="skills-select"
            multiple
            size="small"
            options={skills}
            autoHighlight
            getOptionLabel={(option) => option.name}
            onChange={(_, value) =>
              setCustomFilters((prev) => ({
                ...prev,
                skills: value,
              }))
            }
            sx={{
              width: "min-content",
              minWidth: "400px", // Recomendado para que el label y el input no se colapsen
            }}
            value={customFilters.skills}
            onInputChange={(_, value) => searchSkills(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Habilidades (selecciona 3 hasta 6)"
                placeholder="Buscar habilidad..."
              />
            )}
          />
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            // Opcional: también limpiar localStorage aquí si quieres
          }}
          title="Registrar exámen"
          size="xl"
        >
          {/* <form
            className={`md:grid grid-cols-2 space-y-5 md:space-y-0 gap-7 w-full relative`}
            onSubmit={onSubmit}
          >
            <div className="space-y-3 z-10 md:sticky top-0 h-max">
              <h2 className="text-xl font-bold mb-2">
                Información del Paciente
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {formData?.patient?.ci.length >= 6 && (
                  <div className="w-full col-span-2 h-6 overflow-hidden text-center">
                    {prosecingSearchPatient ? (
                      <Icon
                        icon="eos-icons:three-dots-loading"
                        className="text-3xl inline-block mx-auto"
                      />
                    ) : formData?.patient.patient_id !== null ? (
                      <span className="flex items-center gap-2 text-center mx-auto justify-center">
                        <Icon
                          icon="iconoir:settings-profiles"
                          className="text-2xl text-color3"
                        />
                        <small>Paciente Registrado con historia</small>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-center mx-auto justify-center">
                        <Icon icon="clarity:new-line" className="text-3xl" />
                        <small>Nuevo paciente sin historia</small>
                      </span>
                    )}
                  </div>
                )}
                {patientFormFields.map((field) => {
                  if (field.name === "ci") {
                    return (
                      <div key={field.name}>
                        <FormField
                          {...field}
                          value={formData.patient?.[field.name]}
                          onInput={(e) => {
                            formData.patient.patient_id = null;
                            handlePatientInputChange(e);
                            if (e.target.value.length >= 6) {
                              setProsecingSearchPatient(true);
                              searchPatient(e.target.value);
                            }
                          }}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <FormField
                        key={field.name}
                        {...field}
                        value={formData.patient?.[field.name]}
                        onChange={handlePatientInputChange}
                      />
                    );
                  }
                })}
              </div>
            </div>
            <div className="space-y-3 z-10 ">
              <h2 className="text-xl font-bold">Resultados del Exámen</h2>

              {Object.entries(formData.tests || {}).length === 0 ? (
                <p>Seleccione al menos un tipo de exámen</p>
              ) : (
                <>
                  {processedTestSections.map(({ key, orderedTests }) => (
                    <div
                      key={key}
                      className="bg-color4 p-3 rounded-xl shadow-md mb-1 bg-opacity-5"
                    >
                      <div className="flex justify-between items-center ">
                        <h3 className="text-lg font-bold text-color1 items-center mb-4 flex gap-2">
                          <Icon
                            icon={iconos_examenes[key].icon}
                            className="text-2xl"
                            color={iconos_examenes[key].color}
                          />
                          {formData.tests[key]?.testTypeName}
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          aria-label="Close"
                          onClick={() => {
                            setFormData((prev) => {
                              const { [key]: value, ...rest } = prev.tests;
                              return {
                                ...prev,
                                tests: rest,
                              };
                            });
                          }}
                        >
                          <span className="sr-only">Close</span>
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <MemoizedTestField
                        field={{
                          name: "method",
                          label: "Método",
                          type: "list",
                        }}
                        id={`method-${key}`}
                        value={formData.tests[key]?.method}
                        onChange={() => handleMethodChange(key, event)}
                        testKey={"method"}
                        fieldName={"method"}
                      />

                      <div className="flex flex-col mb-4 md:grid mt-3.5 md:grid-cols-2 gap-4 ">
                        {orderedTests.map((obj, i) => (
                          <React.Fragment key={obj.name + "_" + key + "_" + i}>
                            {i === 0 && key == 7 && (
                              <div className="flex justify-between items-center col-span-2">
                                <h3 className="text-md font-bold text-gray-600 ml-2">
                                  Examen Físico
                                </h3>
                              </div>
                            )}
                            {i === 5 && key == 7 && (
                              <div className="flex justify-between items-center mt-4 col-span-2">
                                <h3 className="text-md font-bold text-gray-600 ml-2">
                                  Examen químico
                                </h3>
                              </div>
                            )}
                            {i === 13 && key == 7 && (
                              <div className="flex justify-between items-center mt-4 col-span-2">
                                <h3 className="text-md font-bold text-gray-600 ml-2">
                                  Examen microscópico
                                </h3>
                              </div>
                            )}
                            <MemoizedTestField
                              field={obj}
                              value={obj.value}
                              onChange={handleTestInputChange}
                              testKey={key}
                              fieldName={obj.name}
                              id={`test-${key}-${obj.name}`}
                            />
                          </React.Fragment>
                        ))}
                      </div>

                      {key == 5 && (
                        <h3 className="text-md font-bold text-gray-600 ml-2 mb-2.5">
                          Examen Microscópico
                        </h3>
                      )}
                      <div className="mb-2 col-span-2">
                        <MemoizedTestField
                          field={{
                            name: "observation",
                            label: "Observación",
                          }}
                          value={formData.tests[key]?.observation}
                          onChange={() => handleObservationChange(key, event)}
                          testKey={"observation"}
                          fieldName={"observation"}
                          multiline={true}
                        />
                      </div>
                      <div className="cursor-pointer   ml-auto col-span-2 flex items-center gap-3">
                        <input
                          type="checkbox"
                          name={`validated-${key}`}
                          readOnly={user?.allow_validate_exam === false}
                          onChange={(e) => {
                            if (user?.allow_validate_exam === false) return;
                            handleValidatedChange(key, e);
                          }}
                          className="invisible"
                          // onChange={(e) => handleValidatedChange(key, e)}
                          checked={formData.tests[key]?.validated || false}
                          id={`validated-${key}`}
                        />

                        <label
                          className="cursor-pointer ml-auto hover:bg-green-100 rounded-xl p-2"
                          htmlFor={`validated-${key}`}
                        >
                          {formData.tests[key]?.validated ? (
                            <span className="flex gap-2 items-center">
                              <small className="text-gray-400">Validado</small>
                              <Icon
                                className="text-color2 w-9 h-9 "
                                icon="bitcoin-icons:verify-filled"
                              />
                            </span>
                          ) : (
                            <span className="flex gap-2 items-center">
                              <small className="text-gray-400">
                                No Validado
                              </small>
                              <Icon
                                icon="octicon:unverifed-24"
                                className="text-gray-600 w-6 h-6"
                              />
                            </span>
                          )}
                        </label>
                      </div>
                    </div>
                  ))}
                </>
              )}
              <div className="flex flex-col md:grid  md:grid-cols-2 gap-2.5 md:gap-6">
                {examinationTypes.map((examType) => {
                  if (formData.tests[examType.id]) {
                    return null;
                  }
                  return (
                    <button
                      type="button"
                      key={examType.id}
                      className="hover neuphormism text-sm py-2 md:py-5 hover:bg-gray-100 hover:shadow-inner hovershadow-3xl hover:shadow-gray-300 duration-75 rounded "
                      onClick={() => {
                        const newtestValues = examType.tests.reduce(
                          (acc, test) => {
                            acc[test.name] = {
                              ...test,
                              value: "", // Add empty value field
                            };
                            return acc;
                          },
                          {}
                        );
                        setFormData((prev) => ({
                          ...prev,
                          all_validated: false,
                          tests: {
                            [examType.id]: {
                              testValues: newtestValues,
                              testTypeName: examType.name,
                              testTypeId: examType.id,
                              validated: false,
                              method: "",
                              observation:
                                examType.id == 5
                                  ? "No se observaron formas evolutivas parasitarias"
                                  : "",
                            },
                            ...prev.tests,
                          },
                        }));
                        setTimeout(() => {
                          // Try to focus on the method field first, then fallback to first test input
                          const methodField = document.querySelector(
                            `#method-${examType.id}`
                          );
                          const firstTestInput = document.querySelector(
                            `input[name="${examType.tests[0]?.name}"]`
                          );
                          const targetElement = methodField || firstTestInput;
                          if (targetElement) {
                            targetElement.focus();
                          }
                        }, 120);
                      }}
                    >
                      <div className="flex flex-col gap-1 items-center">
                        <Icon
                          icon={iconos_examenes[examType.id].icon}
                          className="text-2xl "
                          color={iconos_examenes[examType.id].color}
                        />
                        {examType.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                  className={`px-16 py-3 rounded-md font-semibold ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    submitString == "Actualizar"
                      ? "bg-color4 text-color1"
                      : "bg-color1 text-color4"
                  }`}
                >
                  {loading ? "Procesando..." : submitString}
                </button>
              </div>
            </div>
          </form> */}
        </Modal>
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
                    created_at: false,
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
                    navigate(`/dashboard/trabajadores/${row.original.id}`);
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
