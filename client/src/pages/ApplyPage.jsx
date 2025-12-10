import { useState, useEffect, useRef } from "react";
import { Box, TextField, Autocomplete, FormHelperText } from "@mui/material";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import { GEOAPIFY_KEY } from "../config/env.js";
import { Icon } from "@iconify/react";
import { getIndustryIcon } from "../config/industryIcons";

import "@geoapify/geocoder-autocomplete/styles/round-borders.css";

import FormField from "../components/forms/FormField";
import FuturisticButton from "../components/FuturisticButton.jsx";

const defaultFormData = {
  // Paso 1: Datos de Cuenta
  legal_full_name: "",
  email: "",
  password: "",
  repeat_password: "",
  photo: null,
  // Paso 2: Perfil Profesional
  industry_id: null,
  area_id: null,
  academic_title: "",
  years_of_experience: "",
  english_level: "",
  skills: [],
  // Paso 3: Info Adicional y Documentos
  location: "",
  desired_monthly_income: "",
  linkedin_url: "",
  website_url: "",
  cv: null,
};

const STEPS = [
  { number: 1, title: "Datos de Cuenta", icon: "mdi:account" },
  { number: 2, title: "Perfil Profesional", icon: "mdi:briefcase" },
  { number: 3, title: "Documentos", icon: "mdi:file-document" },
];

export default function ApplyPage() {
  const [formData, setFormData] = useState(structuredClone(defaultFormData));
  const [currentStep, setCurrentStep] = useState(1);
  const autocompleteContainerRef = useRef(null);
  const autocompleteInstanceRef = useRef(null);

  // Initialize Geocoder Autocomplete (solo cuando estamos en el paso 3)
  useEffect(() => {
    if (currentStep !== 3) return;

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
          placeholder: "Buscar ciudad...",
          lang: "es",
          limit: 5,
        }
      );

      autocomplete.on("select", (location) => {
        if (location) {
          setFormData((prev) => ({
            ...prev,
            location: location.properties.formatted,
          }));
        } else {
          setFormData((prev) => ({ ...prev, location: "" }));
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
  }, [currentStep]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    // Aquí iría la lógica para enviar al backend
  };

  // Datos de ejemplo (luego vendrán del backend)
  const industries = [{ id: 1, name: "Petróleo y gas" }];
  const areas = [{ id: 1, name: "Exploración" }, { id: 2, name: "Producción" }];
  const skillsList = [
    { id: 1, name: "Gestión de operaciones petroleras" },
    { id: 2, name: "Control de procesos" },
    { id: 3, name: "Optimización de producción" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">
        Formulario de Aplicación
      </h1>

      {/* Stepper Visual */}
      <div className="max-w-[600px] mx-auto px-5 mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex items-center flex-nowrap justify-end">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    currentStep === step.number
                      ? "bg-caribe border-color4 border-2  text-white"
                      : currentStep > step.number
                      ? "bg-caribe  text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStep > step.number ? (
                    <Icon icon="mdi:check" className="w-6 h-6" />
                  ) : (
                    <Icon icon={step.icon} className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    currentStep >= step.number ? "text-caribe" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded ${
                    currentStep > step.number ? "bg-caribe" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-[600px] mx-auto bg-white rounded-lg shadow-md p-6 space-y-4"
      >
        {/* ========== PASO 1: Datos de Cuenta ========== */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              <Icon icon="mdi:account" className="inline mr-2" />
              Datos de Cuenta
            </h2>

            <FormField
              name="legal_full_name"
              label="Nombre legal completo"
              type="text"
              value={formData.legal_full_name}
              onChange={handleChange}
              required
              placeholder="Tu nombre completo como aparece en tu documento de identidad"
            />

            <FormField
              name="email"
              label="Correo Electrónico"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="password"
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <FormField
                name="repeat_password"
                label="Repetir Contraseña"
                type="password"
                value={formData.repeat_password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex gap-8">
              <div>
                <label htmlFor="photo" className="text-gray-600 text-sm">
                  Foto de perfil
                  <div className="bg-gray-200 mt-1 rounded-md w-36 h-44 flex items-center justify-center cursor-pointer hover:bg-gray-400 duration-150">
                    <Icon
                      icon="tabler:photo-up"
                      className="w-20 h-20 text-gray-300"
                    />
                  </div>
                </label>
                <input type="file" name="photo" id="photo" className="hidden" accept="image/*" />
              </div>

              <FormHelperText>
                <p className="mt-5 text-sm">
                  La foto debe ser tipo carnet y cumplir con lo siguiente:
                </p>
                <ul className="text-xs list-disc pl-4 mt-2 space-y-1">
                  <li>Fondo: Liso, blanco o claro.</li>
                  <li>Encuadre: Primer plano de la cara, mirando al frente.</li>
                  <li>Claridad: Nítida, sin sombras, y la cara completamente visible.</li>
                </ul>
              </FormHelperText>
            </div>
          </div>
        )}

        {/* ========== PASO 2: Perfil Profesional ========== */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              <Icon icon="mdi:briefcase" className="inline mr-2" />
              Perfil Profesional
            </h2>

            <Autocomplete
              id="industries-select"
              size="small"
              options={industries}
              autoHighlight
              getOptionLabel={(option) => option.name}
              onChange={(_, value) => setFormData(prev => ({ ...prev, industry_id: value?.id || null }))}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box key={key} component="li" {...optionProps}>
                    <Icon icon={getIndustryIcon(option.id)} width={24} style={{ marginRight: 8 }} />
                    {option.name}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="Industria a aplicar" required />
              )}
            />

            <Autocomplete
              id="areas-select"
              size="small"
              options={areas}
              autoHighlight
              getOptionLabel={(option) => option.name}
              onChange={(_, value) => setFormData(prev => ({ ...prev, area_id: value?.id || null }))}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box key={key} component="li" {...optionProps}>
                    {option.name}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="Área de especialización" required />
              )}
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
              label="Años de experiencia"
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
              label="Nivel de Inglés"
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

            <Autocomplete
              id="skills-select"
              multiple
              size="small"
              options={skillsList}
              autoHighlight
              getOptionLabel={(option) => option.name}
              onChange={(_, value) => setFormData(prev => ({ ...prev, skills: value.map(v => v.id) }))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Habilidades (selecciona 3 hasta 6)"
                  placeholder="Buscar habilidad..."
                />
              )}
            />
          </div>
        )}

        {/* ========== PASO 3: Información Adicional y Documentos ========== */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              <Icon icon="mdi:file-document" className="inline mr-2" />
              Información Adicional y Documentos
            </h2>

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
              placeholder="Ej: 1500"
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
                📄 Subir CV / Currículum Vitae
              </p>
              <div className="flex justify-center items-center w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-500 hover:text-blue-500 transition duration-300">
                <Icon icon="mdi:upload" className="w-5 h-5 mr-2" />
                <span>Seleccionar archivo PDF (Máx. 5 MB)</span>
              </div>
              <input type="file" name="cv" id="cv" accept=".pdf" className="sr-only" />
            </label>
          </div>
        )}

        {/* ========== Botones de Navegación ========== */}
        <div className="flex justify-between pt-6 border-t mt-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
              currentStep === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Icon icon="mdi:arrow-left" />
            Anterior
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-caribe text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              Siguiente
              <Icon icon="mdi:arrow-right" />
            </button>
          ) : (
            <FuturisticButton>
              <div className="flex gap-2">


              Enviar Solicitud              <Icon icon="mdi:check" />
              </div>

            </FuturisticButton>
           
          )}
        </div>
      </form>
    </div>
  );
}
