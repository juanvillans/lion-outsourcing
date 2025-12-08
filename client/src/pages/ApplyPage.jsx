
import { useState, useEffect, useRef } from "react";
import { Box, TextField, Autocomplete } from "@mui/material";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import { GEOAPIFY_KEY } from "../config/env.js";
import { Icon } from "@iconify/react";
import { getIndustryIcon } from "../config/industryIcons";

import "@geoapify/geocoder-autocomplete/styles/round-borders.css";

import { ReusableForm } from "../components/forms";
import FormField from "../components/forms/FormField";
const defaultFormData = {
  email: "",
  password: "",
  repeat_password: "",
  city: "", // Add city to form data
};

const formFields = [
  {
    name: "legal_full_name",
    label: "Nombre legal completo",
    type: "text",
    required: true,
    className: "col-span-2",
  },

  {
    name: "email",
    label: "Correo Electrónico",
    type: "email",
    required: true,
    placeholder: "usuario@hospital.com",
    className: "col-span-2",
  },

  {
    name: "password",
    label: "Contraseña",
    type: "password",
    required: true,
    className: "col-span-1",
  },
  {
    name: "repeat_password",
    label: "Repetir Contraseña",
    type: "password",
    required: true,
    className: "col-span-1",
  },
];

export default function ApplyPage() {
  const [formData, setFormData] = useState(structuredClone(defaultFormData));
  const [submitString, setSubmitString] = useState("Aplicar");
  const autocompleteContainerRef = useRef(null);
  const autocompleteInstanceRef = useRef(null);

  // Initialize Geocoder Autocomplete
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
          type: "city", // Only show cities
          placeholder: "Buscar ciudad...",
          lang: "es", // Spanish language
          limit: 5,
        }
      );

      // Listen for selection
      autocomplete.on("select", (location) => {
        if (location) {
          console.log(location.properties.formatted);
          setFormData((prev) => ({
            ...prev,
            location: location.properties.formatted,
          }));
          console.log("Selected city:", location);
        } else {
          setFormData((prev) => ({ ...prev, city: "" }));
        }
      });

      autocompleteInstanceRef.current = autocomplete;
    }

    // Cleanup on unmount
    // Cleanup on unmount
    return () => {
      if (autocompleteInstanceRef.current) {
        // No destroy() → no existe
        autocompleteInstanceRef.current = null;
      }

      // Limpiar DOM para evitar doble autocomplete en futuros montajes
      if (autocompleteContainerRef.current) {
        autocompleteContainerRef.current.innerHTML = "";
      }
    };
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };
  const industries = [
    {id: 1, name: "Petróleo y gas" },
   
  ]
  return (
    <div>
      {/* City autocomplete selector */}
      <form
        action="#"
        className="max-w-[600px] mx-auto w-[600px] space-y-3 p-5"
      >
        <div className="space-y-3">
          <Autocomplete
            id="industries-select-demo"
            // sx={{ width: 300 }}
            size="small"
            options={industries}
            autoHighlight
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <Box
                  key={key}
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...optionProps}
                >
                  <Icon icon={getIndustryIcon(option.id)} width={24} style={{ marginRight: 8 }} />
                  {option.name}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Industria"
                slotProps={{
                  htmlInput: {
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill
                  },
                }}
              />
            )}
          />

          <FormField
            name="legal_full_name"
            label="Nombre legal completo"
            type="text"
            value={formData.legal_full_name}
            onChange={handleChange}
            required
            className="col-span-2"
          />

          <FormField
            name="email"
            label="Correo Electrónico"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="col-span-2"
          />

          <FormField
            name="password"
            label="Contraseña"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="col-span-1"
          />

          <FormField
            name="repeat_password"
            label="Repetir Contraseña"
            type="password"
            value={formData.repeat_password}
            onChange={handleChange}
            required
            className="col-span-1"
          />
        </div>

        <div style={{ marginBottom: "0.2rem" }}>
          <label
            style={{ display: "block", marginBottom: "0.1rem" }}
            className="text-sm text-gray-600"
          >
            Localización de residencia
          </label>
          <div
            ref={autocompleteContainerRef}
            style={{ position: "relative" }}
          ></div>
        </div>

        <FormField
          label="Años de experiencia"
          type="select"
          name="years_of_experience"
          value={formData.years_of_experience}
          onChange={handleChange}
          required
          className="col-span-1"
          options={[
            { value: "", label: "Seleccionar" },
            { value: "0-1", label: "0-1" },
            { value: "1-3", label: "1-3" },
            { value: "3-5", label: "3-5" },
            { value: "5-10", label: "5-10" },
            { value: "10+", label: "10+" },
          ]}
        />

        <FormField
          label="Nivél de Inglés"
          type="radio"
          name="english_level"
          value={formData.english_level}
          onChange={handleChange}
          required
          className="col-span-1"
          options={[
            { value: "none", label: "Ninguno" },
            { value: "begginner", label: "Básico" },
            { value: "intermediate", label: "Intermedio" },
            { value: "advanced", label: "Avanzado" },
          ]}
        />

        <FormField
          label="Página web (opcional)"
          placeholder="tu pagina web personal"
          type="text"
          name="website_url"
          value={formData.website}
          onChange={handleChange}
          className="col-span-2"
        />
        <FormField
          label="LinkedIn (opcional)"
          type="text"
          name="linkedin_url"
          value={formData.linkedin}
          onChange={handleChange}
          className="col-span-2"
          placeholder="La URL de tu perfíl de Linkedin"
        />

        <FormField
          label="Ingresos mensuales deseados en USD ($)"
          type="number"
          name="desired_monthly_income"
          value={formData.desired_monthly_income}
          onChange={handleChange}
          className="col-span-1"
        />
      </form>

      {/* Reusable form 
  
  <ReusableForm
    formData={formData}
    setFormData={setFormData}
    fields={formFields}
    submitText={submitString}
    onSubmit={onSubmit}
  />
  
  */}
    </div>
  );
}
