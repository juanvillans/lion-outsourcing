import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  FormHelperText,
  CircularProgress,
  createFilterOptions,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import { GEOAPIFY_KEY } from "../config/env.js";
import { Icon } from "@iconify/react";
import { getIndustryIcon } from "../config/industryIcons";
import { industriesAPI, skillsAPI, applicantsAPI } from "../services/api";
import { useFeedback } from "../context/FeedbackContext";
import Footer from "../components/Footer";
import Navigation from "../components/navigation";

import "@geoapify/geocoder-autocomplete/styles/round-borders.css";

import FormField from "../components/forms/FormField";
import FuturisticButton from "../components/FuturisticButton.jsx";
import logo from "../assets/logo.png";

const defaultFormData = {
  // Paso 1: Datos de Cuenta
  fullname: "",
  email: "",
  photo: null,
  // Paso 2: Perfil Profesional
  industry_id: null,
  area_id: null,
  area: null,
  academic_title: "",
  years_of_experience: "",
  english_level: "",
  skills: [],
  // Paso 3: Info Adicional y Documentos
  localization: "",
  desired_monthly_income: "",
  linkedin_url: "",
  website_url: "",
  cv: null,
  phone_number: "",
};

// Steps are now defined inside the component with translations

export default function ApplyPage() {
  const { t, i18n } = useTranslation("apply");
  const [formData, setFormData] = useState(structuredClone(defaultFormData));
  const [currentStep, setCurrentStep] = useState(1);
  const autocompleteContainerRef = useRef(null);
  const autocompleteInstanceRef = useRef(null);
  const { showSuccess, showError } = useFeedback();

  // Dynamic steps with translations
  const steps = [
    { number: 1, title: t("steps.accountData"), icon: "mdi:account" },
    { number: 2, title: t("steps.professionalProfile"), icon: "mdi:briefcase" },
    { number: 3, title: t("steps.documents"), icon: "mdi:file-document" },
  ];

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
          placeholder: t("step3.localizationPlaceholder"),
          lang: i18n.language,
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
  }, [currentStep]);

  const [industries, setIndustries] = useState([]);
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);

  const filter = createFilterOptions();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear FormData para enviar archivos
      const submitData = new FormData();

      // Agregar todos los campos del formulario
      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        if (value instanceof File) {
          // Archivos se agregan directamente
          submitData.append(key, value);
        } else if (Array.isArray(value) && value.length > 0) {
          // Arrays de objetos se envían como JSON string
          submitData.append(key, JSON.stringify(value));
        } else if (typeof value === "object" && value !== null) {
          // Objetos individuales también se envían como JSON string
          submitData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined && value !== "") {
          submitData.append(key, value);
        }
      });
      await applicantsAPI.submitApplication(submitData);
      showSuccess("Formulario enviado exitosamente");
      setShowForm(false);
    } catch (e) {
      console.error("Failed to submit application", e);
      showError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const form = document.querySelector("form");

    // dispara validaciones HTML5
    if (!form.reportValidity()) return;
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  // Datos de ejemplo (luego vendrán del backend)

  console.log({ formData });

  return (
    <div className=" bg-gray-50 mt-2  ">
      <header className="flex items-center flex-col justify-center relative">
        <Navigation />
        <h1 className="text-center text-2xl font-bold text-gray-800 my-4 mb-7">
          {t("pageTitle")}
        </h1>
      </header>

      {/* Stepper Visual */}
      <div className="max-w-[600px] mx-auto px-5 mb-8">
        <div className="flex items-center justify-between relative">
          <progress
            id="file"
            max="100"
            value={currentStep === 1 ? 10 : currentStep === 2 ? 50 : 100}
            className="custom-progress rounded-full duration-200 text-c absolute w-full z-0 h-1 top-5 pt-0.5 bg-caribe"
          ></progress>
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="flex items-center flex-nowrap justify-end z-10"
            >
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
              {index < steps.length - 1 && (
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

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="max-w-[600px] mx-auto bg-white rounded-lg shadow-md p-6 space-y-4"
        >
          {/* ========== PASO 1: Datos de Cuenta ========== */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                <Icon icon="mdi:account" className="inline mr-2" />
                {t("step1.title")}
              </h2>

              <FormField
                name="fullname"
                label={t("step1.fullname")}
                type="text"
                value={formData.fullname}
                onChange={handleChange}
                required
                placeholder={t("step1.fullnamePlaceholder")}
              />

              <FormField
                name="email"
                label={t("step1.email")}
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t("step1.emailPlaceholder")}
              />

              {/* <div className="grid grid-cols-2 gap-4">
              <FormField
                name="password"
                label="Contraseña"
                type="password"
                value={formData.password}
                minLength={"8"}
                onChange={handleChange}
                required
              />

              <FormField
                name="password_confirmation"
                label="Repetir Contraseña"
                type="password"
                minLength={"8"}
                value={formData.password_confirmation}
                onChange={handleChange}
                required
              />
              {formData.password_confirmation !== formData.password &&
              formData.password_confirmation ? (
                <small className="col-span-2 text-right flex justify-end -mt-3 text-red-700">
                  Las contraseñas no coinciden
                </small>
              ) : null}
              {formData.password.length < 8 && formData.password ? (
                <small className="col-span-2 -mt-3 text-red-700">
                  Mínimo 8 carácteres
                </small>
              ) : null}
            </div> */}
              <div className="flex gap-8">
                <div>
                  <label htmlFor="photo" className="text-gray-600 text-sm">
                    {t("step1.photo.label")}
                    <div className="bg-gray-200 mt-1 rounded-md w-36 h-44 flex items-center justify-center cursor-pointer hover:bg-gray-400 duration-150">
                      {formData.photo ? null : (
                        <Icon
                          icon="tabler:photo-up"
                          className="w-20 h-20 text-gray-300"
                        />
                      )}
                      {formData.photo ? (
                        <img
                          src={URL.createObjectURL(formData.photo)}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                  </label>
                  <input
                    type="file"
                    name="photo"
                    id="photo"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, photo: e.target.files[0] })
                    }
                  />
                </div>

                <FormHelperText>
                  <span className="mt-5 text-sm block">
                    {t("step1.photo.requirements")}
                  </span>
                  <span className="text-xs list-disc flex flex-col  mt-2 space-y-1">
                    {t("step1.photo.reqList", { returnObjects: true }).map((req, i) => (
                      <span key={i}>{req}</span>
                    ))}
                  </span>
                </FormHelperText>
              </div>
            </div>
          )}

          {/* ========== PASO 2: Perfil Profesional ========== */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                <Icon icon="mdi:briefcase" className="inline mr-2" />
                {t("step2.title")}
              </h2>
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
                  <TextField {...params} label={t("step2.industry")} required />
                )}
              />
              <Autocomplete
                id="areas-select-multiple"
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
                    label={t("step2.area")}
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
                value={formData.skills}
                getOptionLabel={(option) => option.name}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  const inputValue = params.inputValue.trim();

                  const exists = options.some(
                    (option) =>
                      option.name.toLowerCase() === inputValue.toLowerCase()
                  );

                  if (inputValue !== "" && !exists) {
                    filtered.push({
                      id: null,
                      name: inputValue,
                      isNew: true,
                    });
                  }

                  return filtered;
                }}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option.isNew ? (
                      <span className="flex items-center gap-2 text-blue-600">
                        <Icon icon="mdi:plus" className="w-6 h-6" />
                        agrega “{option.name}”
                      </span>
                    ) : (
                      option.name
                    )}
                  </li>
                )}
                onChange={(_, value) =>
                  setFormData((prev) => ({
                    ...prev,
                    skills: value.map((item) => ({
                      id: item.id ?? null,
                      name: item.name,
                    })),
                  }))
                }
                onInputChange={(_, value) => searchSkills(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("step2.skills")}
                    placeholder={t("step2.skillsPlaceholder")}
                  />
                )}
              />
              <FormField
                label={t("step2.yearsOfExperience")}
                type="select"
                name="years_of_experience"
                value={formData.years_of_experience}
                onChange={handleChange}
                required
                options={t("step2.experienceOptions", { returnObjects: true })}
              />
              <FormField
                label={t("step2.academicTitle")}
                name="academic_title"
                value={formData.academic_title}
                onChange={handleChange}
                required
                placeholder={t("step2.academicTitlePlaceholder")}
              />
              <FormField
                label={t("step2.englishLevel")}
                type="radio"
                name="english_level"
                value={formData.english_level}
                onChange={handleChange}
                required
                options={t("step2.englishOptions", { returnObjects: true })}
              />
            </div>
          )}

          {/* ========== PASO 3: Información Adicional y Documentos ========== */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                <Icon icon="mdi:file-document" className="inline mr-2" />
                {t("step3.title")}
              </h2>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("step3.localization")}
                </label>
                <div
                  ref={autocompleteContainerRef}
                  style={{ position: "relative" }}
                />
              </div>

              <FormField
                label={t("step3.desiredIncome")}
                type="number"
                name="desired_monthly_income"
                value={formData.desired_monthly_income}
                onChange={handleChange}
                required
                max={1000000}
              />

              <FormField
                label={t("step3.phoneNumber")}
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                placeholder={t("step3.phoneNumberPlaceholder")}
              />

              <FormField
                label={t("step3.linkedin")}
                type="text"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/your-profile"
              />

              <FormField
                label={t("step3.website")}
                type="text"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
                placeholder="https://your-website.com"
              />

              <label htmlFor="cv" className="mt-3 block w-full cursor-pointer">
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  📄 {t("step3.uploadCV")}
                </p>
                {formData.cv ? (
                  <p className="text-sm text-gray-500">
                    {t("step3.fileSelected")}: {formData.cv.name}
                  </p>
                ) : (
                  <div className="flex justify-center items-center w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-500 hover:text-blue-500 transition duration-300">
                    <Icon icon="mdi:upload" className="w-5 h-5 mr-2" />
                    <span>{t("step3.selectPDF")}</span>
                  </div>
                )}
                <input
                  type="file"
                  name="cv"
                  id="cv"
                  accept=".pdf"
                  className="sr-only"
                  onChange={(e) =>
                    setFormData({ ...formData, cv: e.target.files[0] })
                  }
                />
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
              {t("navigation.previous")}
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-caribe text-white rounded-lg font-medium hover:bg-black transition-all"
              >
                {t("navigation.next")}
                <Icon icon="mdi:arrow-right" />
              </button>
            ) : (
              <div onClick={handleSubmit}>
                <FuturisticButton type={"submit"} disabled={loading}>
                  <div className="flex gap-2 ">
                    {loading ? (
                      <CircularProgress size={20} className="mr-2" />
                    ) : null}
                    {t("navigation.submit")} <Icon icon="mdi:check" className="ml-2" />
                  </div>
                </FuturisticButton>
              </div>
            )}
          </div>
        </form>
      )}
      {!showForm && (
        <div className="text-center mx-auto w-max mt-20">
          <h1 className="text-2xl font-bold mb-4">
            {t("success.title")}
          </h1>
          <p>{t("success.thanks")}</p>
          <p>{t("success.message")}</p>
        </div>
      )}

      <Footer />
    </div>
  );
}
