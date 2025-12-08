import { useState, useEffect, useRef } from "react";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import { GEOAPIFY_KEY } from "../config/env.js";

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
          console.log( location.properties.formatted)
          setFormData((prev) => ({ ...prev, location: location.properties.formatted }));
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
    console.log(formData);
  };

  // console.log(formData);


  return (
    <div>
      {/* City autocomplete selector */}
      <form action="#" className="max-w-[600px] mx-auto w-[600px] space-y-3 p-5">
        <FormField
          name="legal_full_name"
          label="Nombre legal completo"
          type="text"
          value={formData.legal_full_name}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              legal_full_name: e.target.value,
            }))
          }
          required
          className="col-span-2"
        />
        
        <FormField
          name="email"
          label="Correo Electrónico"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          required
          className="col-span-2"
        />
        
        <FormField
          name="password"
          label="Contraseña"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          required
          className="col-span-1"
        />
        <FormField
          name="repeat_password"
          label="Repetir Contraseña"
          type="password"
          value={formData.repeat_password}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              repeat_password: e.target.value,
            }))
          }
          required
          className="col-span-1"
        />

        <div style={{ marginBottom: "0.2rem" }} >
          <label style={{ display: "block", marginBottom: "0.1rem" }} className="text-sm text-gray-600">
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
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              years_of_experience: e.target.value,
            }))
          }
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
          label="Página web (opcional)"
          placeholder="tu pagina web personal"
          type="text"
          name="website"
          value={formData.website}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, website: e.target.value }))
          }
          className="col-span-2"
        />
        <FormField
          label="LinkedIn (opcional)"
          type="text"
          name="linkedin"
          value={formData.linkedin}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, linkedin: e.target.value }))
          }
          className="col-span-2"
          placeholder="La URL de tu perfíl de Linkedin"
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
