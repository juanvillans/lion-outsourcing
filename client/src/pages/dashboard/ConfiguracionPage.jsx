import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Icon } from "@iconify/react";
import Modal from "../../components/Modal";
import FuturisticButton from "../../components/FuturisticButton";
import { skillsAPI, industriesAPI } from "../../services/api";
import FormField from "../../components/forms/FormField";
import {
  CircularProgress,
  Autocomplete,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useFeedback } from "../../context/FeedbackContext";
import { areasAPI } from "../../services/api";
import { getIndustryIcon } from "../../config/industryIcons";

export default function ConfiguracionPage() {
  const [industries, setIndustries] = useState([]);
  const [skills, setSkills] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModalSkill, setOpenModalSkill] = useState(false);
  const [openModalArea, setOpenModalArea] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState({ id: null, name: "" });
  const [selectedArea, setSelectedArea] = useState({
    id: null,
    name: "",
    industry_id: null,
  });
  const [searchSkillString, setSearchSkillString] = useState("");
  const { showError, showSuccess, showInfo } = useFeedback();

  const searchSkills = useCallback(async (searchTerm) => {
    try {
      const response = await skillsAPI.searchSkills({ search: searchTerm });
      setSkills(response.data);
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

  const getIndustries = useCallback(async () => {
    try {
      const res = await industriesAPI.getIndustries();
      setIndustries(res.data);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  }, []);

  useEffect(() => {
    getIndustries();
    getAreas();
  }, [getAreas, getIndustries]);

  const onSubmitSkill = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedSkill.id) {
        await skillsAPI.updateSkill(selectedSkill.id, selectedSkill);
      } else {
        await skillsAPI.createSkill(selectedSkill);
      }
      setSelectedSkill({ id: null, name: "" });
      searchSkills(searchSkillString);
      showSuccess("Habilidad guardada con éxito");
      setOpenModalSkill(false);
    } catch (e) {
      console.error("Failed to update skill", e);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitArea = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedArea.id) {
        await areasAPI.updateArea(selectedArea.id, selectedArea);
      } else {
        await areasAPI.createArea(selectedArea);
      }
      setSelectedArea({ id: null, name: "", industry_id: null });
      getAreas();
      showSuccess("Area guardada con éxito");
      setOpenModalArea(false);
    } catch (e) {
      console.error("Failed to update area", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await skillsAPI.deleteSkill(id);
      searchSkills(searchSkillString);
      showSuccess("Habilidad eliminada con éxito");
    } catch (e) {
      console.error("Failed to delete skill", e);
    }
  };

  const handleDeleteArea = async (id) => {
    try {
      await areasAPI.deleteArea(id);
      getAreas();
      showSuccess("Area eliminada con éxito");
    } catch (e) {
      console.error("Failed to delete area", e);
    }
  };

  useEffect(() => {
    searchSkills(searchSkillString);
  }, [searchSkillString]);

  return (
    <div>
      <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-5">
        Configuración
      </h1>

      <div className="flex gap-5 flex-col md:flex-row w-full">
        <div className="neuphormism p-4 ">
          <div className="flex items-center mb-3 justify-between">
            <h2 className="text-lg  font-bold text-gray-700">Habilidades</h2>
            <button
              className="p-2  bg-color3 text-white font-bold rounded-xl"
              onClick={() => {
                setSelectedSkill({ id: null, name: "" });
                setOpenModalSkill(true);
              }}
            >
              <Icon icon="mdi:plus" />
            </button>
          </div>
          <label
            htmlFor="search"
            className="flex gap-2 items-center relative  mb-1 w-full"
          >
            <input
              onInput={(e) => setSearchSkillString(e.target.value)}
              type="search"
              placeholder="Buscar habilidad..."
              name="search"
              id=""
              value={searchSkillString}
              className="rounded-xl  outline-none focus:border border-blue-200 p-1.5 px-3 w-full"
            />
            <Icon icon="mdi:magnify" className="absolute right-3 top-2.5" />
          </label>
          <ul>
            {skills.map((skill) => (
              <li
                key={skill.id + skill.name}
                className="group flex items-center hover:text-black justify-between p-2 gap-3 hover:bg-gray-50 rounded transition-colors"
              >
                <span className="flex-1">{skill.name}</span>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <button
                    title="Editar"
                    className="p-1 text-gray-600 hover:text-black rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      setSelectedSkill(skill);
                      setOpenModalSkill(true);
                    }}
                  >
                    <Icon icon="mdi:pencil" />
                  </button>
                  <button
                    title="Eliminar"
                    className="p-1 text-red-600 hover:text-red-700 rounded-md bg-red-100 hover:bg-red-200 transition-colors"
                    onClick={() => {
                      if (
                        window.confirm(
                          "¿Está seguro de eliminar esta habilidad?"
                        )
                      ) {
                        handleDeleteSkill(skill.id);
                      }
                    }}
                  >
                    <Icon icon="mdi:close" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="neuphormism p-4  h-screen overflow-auto">
          <div className="flex items-center mb-3 justify-between">
            <h2 className="text-lg  font-bold text-gray-700">Areas</h2>
            <button
              className="p-2  bg-color3 text-white font-bold rounded-xl"
              onClick={() => {
                setSelectedArea({ id: null, name: "", industry_id: null });
                setOpenModalArea(true);
              }}
            >
              <Icon icon="mdi:plus" />
            </button>
          </div>
          <ul>
            {areas.map((area) => (
              <li
                key={area.id + area.name}
                className="group flex items-center hover:text-black justify-between p-2 pb-1 gap-3 hover:bg-gray-50 rounded transition-colors"
              >
                <span className="flex-1">
                  {area.name}

                  <p className="flex gap-1 text-black/40 text-xs mt-0.5">
                    <Icon icon={getIndustryIcon(area.industry_id)} width={16} />
                    {area.industry.name}
                  </p>
                </span>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <button
                    title="Editar"
                    className="p-1 text-gray-600 hover:text-black rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      setSelectedArea(area);
                      setOpenModalArea(true);
                    }}
                  >
                    <Icon icon="mdi:pencil" />
                  </button>
                  <button
                    title="Eliminar"
                    className="p-1 text-red-600 hover:text-red-700 rounded-md bg-red-100 hover:bg-red-200 transition-colors"
                    onClick={() => {
                      if (
                        window.confirm(
                          "¿Está seguro de eliminar esta area?"
                        )
                      ) {
                        handleDeleteArea(area.id);
                      }
                    }}
                  >
                    <Icon icon="mdi:close" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Modal
        isOpen={openModalSkill}
        onClose={() => {
          setOpenModalSkill(false);
          // Opcional: también limpiar localStorage aquí si quieres
        }}
        title="Habilidad"
        size="sm"
      >
        <form
          className={`space-y-5 md:space-y-0 gap-7 w-full relative`}
          onSubmit={onSubmitSkill}
        >
          <FormField
            label="Nombre de la habilidad"
            name="name"
            value={selectedSkill.name}
            onChange={(e) =>
              setSelectedSkill((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <div className="col-span-2">
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                className={`px-16 py-3 rounded-md font-semibold ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                } ${"bg-color1 text-color4"}`}
              >
                {loading ? "Procesando..." : "Guardar"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={openModalArea}
        onClose={() => {
          setOpenModalArea(false);
          // Opcional: también limpiar localStorage aquí si quieres
        }}
        title="Area"
        size="sm"
      >
        <form
          className={`space-y-5 md:space-y-4 gap-7 w-full relative`}
          onSubmit={onSubmitArea}
        >
          <FormField
            label="Nombre del area"
            name="name"
            value={selectedArea.name}
            onChange={(e) =>
              setSelectedArea((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <FormControl size="small" required fullWidth>
            <InputLabel id="industries-select-label">
              Industria a del area
            </InputLabel>
            <Select
              labelId="industries-select-label"
              id="industries-select"
              value={selectedArea.industry_id}
              label="Industria del area"
              onChange={(event) => {
                setSelectedArea((prev) => ({
                  ...prev,
                  industry_id: event.target.value,
                }));
              }}
            >
              {industries.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Icon
                      icon={getIndustryIcon(option.id)}
                      width={24}
                      style={{ marginRight: 8 }}
                    />
                    {option.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="col-span-2">
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                className={`px-16 py-3 rounded-md font-semibold ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                } ${"bg-color1 text-color4"}`}
              >
                {loading ? "Procesando..." : "Guardar"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
