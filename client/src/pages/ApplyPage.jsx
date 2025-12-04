import { useState, useEffect, useRef } from "react";
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import { GEOAPIFY_KEY } from "../config/env.js";

import "@geoapify/geocoder-autocomplete/styles/minimal.css"; // Import the minimal CSS theme


import { ReusableForm } from "../components/forms";


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
        const autocomplete = new GeocoderAutocomplete(
          autocompleteContainerRef.current,
          GEOAPIFY_KEY,
          {
            type: 'city', // Only show cities
            placeholder: 'Buscar ciudad...',
            lang: 'es', // Spanish language
            limit: 5,
          }
        );

        // Listen for selection
        autocomplete.on('select', (location) => {
          if (location) {
            const cityName = location.properties?.city || location.properties?.formatted || '';
            setFormData(prev => ({ ...prev, city: cityName }));
            console.log('Selected city:', location);
          } else {
            setFormData(prev => ({ ...prev, city: '' }));
          }
        });

        autocompleteInstanceRef.current = autocomplete;
      }

      // Cleanup on unmount
      return () => {
        if (autocompleteInstanceRef.current) {
          // The library doesn't have a destroy method, but we can clear the container
          autocompleteInstanceRef.current = null;
        }
      };
    }, []);

    const onSubmit = (event) => {
      event.preventDefault();
      console.log(formData);
    };

  return (
    <div>
      {/* City autocomplete selector */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Seleccionar Ciudad
        </label>
        <div
          ref={autocompleteContainerRef}
          style={{ position: 'relative' }}
        />
      </div>

      <ReusableForm
        formData={formData}
        setFormData={setFormData}
        fields={formFields}
        submitText={submitString}
        onSubmit={onSubmit}
      />
    </div>
  );
}
