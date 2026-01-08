import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { employeesAPI, industriesAPI } from "../../services/api";
import { useFeedback } from "../../context/FeedbackContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../config/env";
import { Icon } from "@iconify/react";
import Modal from "../../components/Modal";
import FormField from "../../components/forms/FormField";
import {
  CircularProgress,
  FormHelperText,
  TextField,
  Autocomplete,
  Box,
} from "@mui/material";
import { getIndustryIcon } from "../../config/industryIcons";
import { skillsAPI } from "../../services/api";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import { GEOAPIFY_KEY } from "../../config/env.js";

import "@geoapify/geocoder-autocomplete/styles/round-borders.css";

const englishLevels = {
  none: "Ninguno",
  beginner: "Básico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const PdfPreview = ({ employeeId }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await employeesAPI.getEmployeeCV(employeeId);
        console.log(response);
        const blob = response;

        // Validamos que sea un Blob real
        if (!(blob instanceof Blob)) {
          console.error("La respuesta no es un Blob");
          return;
        }

        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch PDF", err);
        setError("No se pudo cargar el PDF");
        setLoading(false);
      }
    };

    fetchPdf();

    // Limpieza: Revocar la URL para evitar fugas de memoria
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [employeeId]);

  if (loading) return <p>Cargando PDF...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src={pdfUrl}
        title="Vista previa CV"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default function DetalleTrabajadorPage() {
  const { id } = useParams();
  const [applicant, setApplicant] = useState(null);
  const { showError, showSuccess, showInfo } = useFeedback();
  const { user } = useAuth();
  const navigate = useNavigate();
  const autocompleteContainerRef = useRef(null);
  const autocompleteInstanceRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone_number: "",
    industry_id: null,
    area_id: null,
    area: null,
    academic_title: "",
    years_of_experience: "",
    english_level: "",
    skills: [],
    new_skills: [{ name: "none" }],
    localization: "",
    desired_monthly_income: "",
    linkedin_url: "",
    website_url: "",
    cv: null,
    photo: null,
    fotoChanged: false,
    cv_changed: false,
  });

  const [industries, setIndustries] = useState([]);
  const [skills, setSkills] = useState([]);

  const fetchInitialData = useCallback(async () => {
    try {
      const response = await industriesAPI.getIndustries();
      setIndustries(response.data);
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

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  // Update photo only
  const handleUpdatePhoto = async () => {
    if (!formData.fotoChanged || !formData.photo) {
      return;
    }

    setLoading(true);
    try {
      const photoData = new FormData();
      photoData.append("photo", formData.photo);

      await employeesAPI.updateEmployee(id, photoData);
      showSuccess("Foto actualizada exitosamente");
      await fetchApplicant();
      setFormData((prev) => ({ ...prev, fotoChanged: false }));
    } catch (e) {
      console.error("Failed to update photo", e);
      showError("Error al actualizar la foto: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Update CV only
  const handleUpdateCV = async () => {
    if (!formData.cv_changed || !formData.cv) {
      return;
    }

    setLoading(true);
    try {
      const cvData = new FormData();
      cvData.append("cv", formData.cv);

      await employeesAPI.updateEmployee(id, cvData);
      showSuccess("CV actualizado exitosamente");
      await fetchApplicant();
      setFormData((prev) => ({ ...prev, cv_changed: false }));
    } catch (e) {
      console.error("Failed to update CV", e);
      showError("Error al actualizar el CV: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Update rest of the data (excluding photo and CV)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear FormData para enviar datos (sin archivos)
      const submitData = new FormData();

      // Agregar todos los campos del formulario excepto photo y cv
      Object.keys(formData).forEach((key) => {
        // Skip file-related fields
        if (key === "photo" || key === "cv" || key === "fotoChanged" || key === "cv_changed") {
          return;
        }

        const value = formData[key];

        if (Array.isArray(value) && value.length > 0) {
          // Arrays de objetos se envían como JSON string
          submitData.append(key, JSON.stringify(value));
        } else if (typeof value === "object" && value !== null) {
          // Objetos individuales también se envían como JSON string
          submitData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined && value !== "") {
          submitData.append(key, value);
        }
      });

      await employeesAPI.updateEmployee(id, submitData);
      showSuccess("Datos actualizados exitosamente");

      // Update photo if changed
      if (formData.fotoChanged) {
        await handleUpdatePhoto();
      }

      // Update CV if changed
      if (formData.cv_changed) {
        await handleUpdateCV();
      }

      await fetchApplicant();
      setShowForm(false);
    } catch (e) {
      console.error("Failed to submit application", e);
      showError("Error al actualizar los datos: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicant = useCallback(async () => {
    try {
      const res = await employeesAPI.getEmployeeById(id);
      setApplicant(res.data);
      setFormData(res.data);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  }, [id]);

  useEffect(() => {
    fetchApplicant();
  }, [fetchApplicant]);

  const handleReject = async () => {
    setLoading(true);
    try {
      await employeesAPI.deleteEmployee(id);
      showSuccess("Trabajador eliminado con éxito");
      navigate("/dashboard/Trabajadors");
    } catch (e) {
      console.error("Failed to reject applicant", e);
      showError("No se pudo rechazar el Trabajador");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (autocompleteContainerRef.current && !autocompleteInstanceRef.current) {
      // Limpieza preventiva ANTES de instanciar
      while (autocompleteContainerRef.current.firstChild) {
        autocompleteContainerRef.current.removeChild(
          autocompleteContainerRef.current.firstChild
        );
      }

      const autocomplete = new GeocoderAutocomplete(
        autocompleteContainerRef.current,
        GEOAPIFY_KEY,
        {
          type: "city",
          placeholder: "Buscar ciudad, estado..",
          lang: "es",
          limit: 5,
        }
      );

      // Set the initial value from formData
      if (formData.localization) {
        autocomplete.setValue(formData.localization);
      }

      autocomplete.on("select", (localization) => {
        if (localization) {
          setFormData((prev) => ({
            ...prev,
            localization: localization.properties.formatted,
          }));
        } else {
          setFormData((prev) => ({ ...prev, localization: "" }));
        }
      });

      autocompleteInstanceRef.current = autocomplete;
    }

    return () => {
      if (autocompleteInstanceRef.current) {
        autocompleteInstanceRef.current = null;
      }
      if (autocompleteContainerRef.current) {
        autocompleteContainerRef.current.innerHTML = "";
      }
    };
  }, [showForm]);

  return (
    <>
      <title>Detalle del Trabajador - Lion PR Services</title>
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2  bg-gray-100 rounded-md"
        >
          <Icon icon="mdi:arrow-left" className="mr-2" />
        </button>
        <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-0">
          Detalle del Trabajador
        </h1>
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-4 p-4 md:p-6 bg-gray-100 neuphormism rounded-2xl">
          <img
            className="w-32 mb-4 mx-auto rounded-md"
            src={applicant?.photo_url}
            alt=""
          />
          <p>
            <strong className="text-dark">Nombre:</strong> {applicant?.fullname}
          </p>
          <p>
            <strong className="text-dark">Correo Electrónico:</strong>{" "}
            {applicant?.email}
          </p>
          <p>
            <strong className="text-dark">Teléfono:</strong>{" "}
            {applicant?.phone_number}
          </p>
          <p>
            <strong className="text-dark">Industria:</strong>{" "}
            {applicant?.industry?.name}
          </p>
          <p>
            <strong className="text-dark">Especialidad:</strong>{" "}
            {applicant?.area?.name}
          </p>

          <p>
            <strong className="text-dark">Habilidades:</strong>{" "}
            {applicant?.skills?.map((skill) => {
              return (
                <span
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  key={skill.id}
                >
                  {skill.name}
                </span>
              );
            })}
          </p>
          <p>
            <strong className="text-dark">Experiencia:</strong>{" "}
            {applicant?.years_of_experience} años
          </p>
          <p>
            <strong className="text-dark">Título/Grado académico:</strong>{" "}
            {applicant?.academic_title}
          </p>
          <p>
            <strong className="text-dark">Ubicación:</strong>{" "}
            {applicant?.localization}
          </p>
          <p>
            <strong className="text-dark">Idioma:</strong>{" "}
            {englishLevels[applicant?.english_level]}
          </p>
          <p>
            <strong className="text-dark">Ingreso Mensual Deseado:</strong>{" "}
            {applicant?.desired_monthly_income}$
          </p>
          <p>
            <strong className="text-dark">LinkedIn:</strong>{" "}
            {applicant?.linkedin_url}
          </p>
          <p>
            <strong className="text-dark">Sitio Web:</strong>{" "}
            {applicant?.website_url}
          </p>
        </div>

        <div className=" col-span-8 p-3 rounded-md">
          <PdfPreview employeeId={id} />
        </div>
      </div>

      <div className=" bottom-8 right-28 flex gap-10 shadow-sm  mt-10">
        <button
          className="bg-gray-300 text-dark px-4 py-2 rounded-lg flex hover:brightness-125 items-center"
          onClick={() =>
            window.confirm("¿Está seguro de eliminar este Trabajador?") &&
            handleReject()
          }
        >
          <Icon icon="mdi:delete" className="mr-2" />
          <span>Eliminar</span>
        </button>
        <button
          className="bg-caribe text-white px-4 py-2 rounded-lg flex hover:brightness-125 items-center"
          onClick={() => setShowForm(true)}
        >
          <Icon icon="mdi:pencil" className="mr-2" />
          <span>Editar</span>
        </button>
      </div>
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Editar Trabajador"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <FormField
            label="Nombre"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
          />
          <FormField
            label="Correo Electrónico"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <FormField
            label="Teléfono"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
          <div className="flex gap-8">
            <div>
              <label htmlFor="photo" className="text-gray-600 text-sm">
                Foto de perfil
                {!formData.fotoChanged && (
                  <div className="bg-gray-200 mt-1 rounded-md w-36 h-44 flex items-center justify-center cursor-pointer hover:bg-gray-400 duration-150">
                    <img
                      className="w-full h-full object-cover"
                      src={applicant?.photo_url}
                      alt=""
                    />
                  </div>
                )}

                {formData.fotoChanged && (
                  <div className="bg-gray-200 mt-1 rounded-md w-36 h-44 flex items-center justify-center cursor-pointer hover:bg-gray-400 duration-150">
                    <img
                        src={URL.createObjectURL(formData.photo)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                  </div>
                )}
              </label>
              <input
                type="file"
                name="photo"
                id="photo"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  
                  setFormData({ ...formData, photo: e.target.files[0], fotoChanged: true })
                }
              />
            </div>

            <FormHelperText>
              <span className="mt-5 text-sm block">
                La foto debe ser tipo carnet y cumplir con lo siguiente:
              </span>
              <span className="text-xs list-disc flex flex-col  mt-2 space-y-1">
                <span>Fondo: Liso, blanco o claro.</span>
                <span>
                  Encuadre: Primer plano de la cara, mirando al frente.
                </span>
                <span>
                  Claridad: Nítida, sin sombras, y la cara completamente
                  visible.
                </span>
                <span>Debe ser JPG, PNG, JPEG o GIF y no superar los 5MB.</span>
              </span>
            </FormHelperText>
          </div>
          <div className="space-y-3">
            <Autocomplete
              id="industries-select"
              size="small"
              options={industries}
              autoHighlight
              getOptionLabel={(option) => option.name}
              onChange={(_, value) =>
                setFormData((prev) => ({
                  ...prev,
                  industry_id: value?.id || null,
                  industry: value || null,
                }))
              }
              value={formData.industry}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box key={key} component="li" {...optionProps}>
                    <Icon
                      icon={getIndustryIcon(option.id)}
                      width={24}
                      style={{ marginRight: 8 }}
                    />
                    {option.name}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="Industria a aplicar" required />
              )}
            />

            <Autocomplete
              id="areas-select-multiple" // Cambiado el ID para mayor claridad
              size="small"
              options={formData.industry?.areas || []}
              autoHighlight
              disabled={!formData.industry_id}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, value) => {
                setFormData((prev) => ({
                  ...prev,
                  area_id: value?.id || null,
                  area: value || null,
                }));
              }}
              value={formData.area}
              // Opcional: Para mostrar las selecciones actuales si el componente es controlado
              // value={
              //   formData.area_ids // Suponiendo que 'area_ids' es un array de IDs seleccionados
              //     ? (formData.industry?.areas || []).filter(area => formData.area_ids.includes(area.id))
              //     : []
              // }

              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box key={key} component="li" {...optionProps}>
                    {option.name}
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
                setFormData((prev) => ({
                  ...prev,
                  skills: value,
                }))
              }
              value={formData.skills}
              onInputChange={(_, value) => searchSkills(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Habilidades (selecciona 3 hasta 6)"
                  placeholder="Buscar habilidad..."
                />
              )}
            />
            <FormField
              label="Años de experiencia *"
              type="select"
              name="years_of_experience"
              value={formData.years_of_experience}
              onChange={handleChange}
              required
              options={[
                { value: "", label: "Seleccionar" },
                { value: "0-1", label: "0-1 años" },
                { value: "1-3", label: "1-3 años" },
                { value: "3-5", label: "3-5 años" },
                { value: "5-10", label: "5-10 años" },
                { value: "10+", label: "10+ años" },
              ]}
            />
            <FormField
              label="Título/Grado académico"
              name="academic_title"
              value={formData.academic_title}
              onChange={handleChange}
              required
              placeholder="Ej: Ingeniero petroquímico, TSU en Informática"
            />

            <FormField
              label="Nivel de Inglés *"
              type="radio"
              name="english_level"
              value={formData.english_level}
              onChange={handleChange}
              required
              options={[
                { value: "none", label: "Ninguno" },
                { value: "beginner", label: "Básico" },
                { value: "intermediate", label: "Intermedio" },
                { value: "advanced", label: "Avanzado" },
              ]}
            />

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Localización de residencia
              </label>
              <div
                ref={autocompleteContainerRef}
                style={{ position: "relative" }}
              />
            </div>

            <FormField
              label="Ingresos mensuales deseados en USD ($)"
              type="number"
              name="desired_monthly_income"
              value={formData.desired_monthly_income}
              onChange={handleChange}
              required
              max={1000000}
            />

            <FormField
              label="Número de teléfono"
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              placeholder="Ej: +52 123 456 7890"
            />

            <FormField
              label="LinkedIn (opcional)"
              type="text"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/tu-perfil"
            />

            <FormField
              label="Página web (opcional)"
              type="text"
              name="website_url"
              value={formData.website_url}
              onChange={handleChange}
              placeholder="https://tu-pagina.com"
            />

            <label htmlFor="cv" className="mt-3 block w-full cursor-pointer">
              <p className="block text-sm font-medium text-gray-700 mb-2">
                📄 CV / Currículum Vitae
              </p>
              {formData.cv_changed ? (
                <p className="text-sm text-gray-500">
                  Archivo seleccionado: {formData.cv.name}
                </p>
              ) : (
                <div className="flex justify-center items-center w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-500 hover:text-blue-500 transition duration-300">
                  <Icon icon="mdi:upload" className="w-5 h-5 mr-2" />
                  <span>Cambiar archivo PDF (Máx. 10 MB)</span>
                </div>
              )}
              <input
                type="file"
                name="cv"
                id="cv"
                accept=".pdf"
                className="sr-only"
                onChange={(e) =>
                  setFormData({ ...formData, cv: e.target.files[0], cv_changed: true })
                }
              />
            </label>

            {/* <span>Añadir otros documentos</span>
            <label
              htmlFor="other_documents"
              className="mt-3 block w-full cursor-pointer"
            >
              <p className="block text-sm font-medium text-gray-700 mb-2">
                📄 Otros documentos
              </p>
              {formData.other_documents ? (
                <p className="text-sm text-gray-500">
                  Archivo seleccionado: {formData.other_documents.name}
                </p>
              ) : (
                <div className="flex justify-center items-center w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-500 hover:text-blue-500 transition duration-300">
                  <Icon icon="mdi:upload" className="w-5 h-5 mr-2" />
                  <span>Seleccionar archivo PDF (Máx. 10 MB)</span>
                </div>
              )}
              <input
                type="file"
                name="other_documents"
                id="other_documents"
                accept=".pdf"
                className="sr-only"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    other_documents: e.target.files[0],
                  })
                }
              />
            </label> */}
          </div>
          <button
            type="submit"
            className="w-full bg-caribe text-white px-4 py-2 rounded-lg"
          >
            Guardar
          </button>
        </form>
      </Modal>
    </>
  );
}
