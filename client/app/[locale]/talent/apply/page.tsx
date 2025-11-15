"use client";
import { useState, useCallback } from "react";
// import ReusableForm from "@/components/ReusableForm";
import FormField from "@/components/FormField";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import { Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import BusinessIcon from "@mui/icons-material/Business";

const userFormFields = [
  {
    name: "email",
    label: "Correo Electrónico",
    type: "email",
    required: true,
    placeholder: "usuario@hospital.com",
    className: "col-span-2",
  },
  {
    name: "name",
    label: "Nombre completo legal",
    type: "text",
    required: true,
    className: "col-span-1",
  },
  {
    name: "ci",
    label: "Cédula",
    type: "text",
    required: true,
    className: "col-span-1",
  },
  {
    name: "password",
    label: "Contraseña",
    type: "password",
    required: true,
    className: "col-span-1",
  },
  {
    name: "confirm_password",
    label: "Confirmar Contraseña",
    type: "password",
    required: true,
    className: "col-span-1",
  },
];
export default function ApplyPage() {
  const defaultFormData = {
    email: "",
    name: "",
    ci: "",
    category: "",
    allow_validate_exam: false,
    allow_handle_users: false,
    allow_handle_exams: false,
  };
  const [formData, setFormData] = useState(structuredClone(defaultFormData));

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  console.log(formData);

  return (
    <div>
      <header className="text-center my-3 mb-10">
        <h1 className="text-3xl font-bold ">
          Aplica para unirte a nuestro equipo de talentos
        </h1>
        <h2>nos encargarmos de conseguirte el trabajo que estás buscando</h2>
      </header>

      <form className="max-w-[330px] mx-auto bg-white/5 p-5 md:p-10 rounded-2xl">
        <FormControl
          sx={{
            // Targets the label
            "& .MuiInputLabel-root": {
              color: "silver", // Default label color
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "aqua", // Focused label color
            },
            // Targets the input element and outline
            "& .MuiOutlinedInput-root": {
              color: "white", // Input text color
              "& fieldset": {
                borderColor: "silver", // Default border color
              },
              "&:hover fieldset": {
                borderColor: "white", // Hover border color
              },
              "&.Mui-focused fieldset": {
                borderColor: "white", // Focused border color
              },
            },
          }}
          size="small"
          fullWidth
        >
          <InputLabel id="select-iconos-label">Quiero aplicar en</InputLabel>
          <Select
            labelId="select-iconos-label"
            id="select-iconos"
            value={formData.category}
            label="Seleccionar Opción"
            onChange={handleInputChange}
            
          >
            {/* Opción 1: Icono y Texto */}
            <MenuItem value={10}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <HomeIcon fontSize="small" />
                Gas y Petróleo
              </Box>
            </MenuItem>

            {/* Opción 2: Icono y Texto */}
            <MenuItem value={20}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SettingsIcon fontSize="small" />
                Configuración
              </Box>
            </MenuItem>

            {/* Opción 3: Icono y Texto */}
            <MenuItem value={30}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BusinessIcon fontSize="small" />
                Empresa
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
        {userFormFields.map((field) => {
          return (
            <div key={field.name} className="mb-4 mt-4">
              <TextField
                {...field}
                value={formData[field.name]}
                onChange={handleInputChange}
                required={true}
                size="small"
                fullWidth={true}
                sx={{
                  // Targets the label
                  "& .MuiInputLabel-root": {
                    color: "silver", // Default label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "aqua", // Focused label color
                  },
                  // Targets the input element and outline
                  "& .MuiOutlinedInput-root": {
                    color: "white", // Input text color
                    "& fieldset": {
                      borderColor: "silver", // Default border color
                    },
                    "&:hover fieldset": {
                      borderColor: "white", // Hover border color
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white", // Focused border color
                    },
                  },
                }}
              />
            </div>
          );
        })}
        <button
          type="submit"
          className="bg-caribean-sea text-white px-10 py-2 rounded-lg w-full"
        >
          Aplicar
        </button>
      </form>
    </div>
  );
}
