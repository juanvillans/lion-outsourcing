// client/src/components/CreateWorkTeamModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import FormField from "../forms/FormField";
import { workTeamAPI } from "../../services/api";
import { useFeedback } from "../../context/FeedbackContext";

const CreateWorkTeamModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  editMode = false,
  initialData = null 
}) => {
  const { showError, showSuccess } = useFeedback();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_hired: false,
    end_date_contract: ""
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
    } else if (!isOpen) {
      setFormData({
        name: "",
        description: "",
        is_hired: false,
        end_date_contract: ""
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode && initialData?.id) {
        await workTeamAPI.updateWorkTeam(initialData.id, formData);
        showSuccess("Equipo actualizado exitosamente");
      } else {
        await workTeamAPI.createWorkTeam(formData);
        showSuccess("Equipo creado exitosamente");
      }
      
      onSuccess?.(); // Refresh data in parent
      onClose();
    } catch (error) {
      showError(error.response?.data?.message || "Error al guardar el equipo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editMode ? "Editar Equipo" : "Crear Nuevo Equipo"}
      size="md"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField
          label="Nombre del Equipo o empresa"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ej: Equipo de Desarrollo"
        />

        <FormField
          label="Descripción"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción del equipo (opcional)"
        />

        <FormField
          label="¿Equipo contratado?"
          name="is_hired"
          type="checkbox"
          checked={formData.is_hired}
          onChange={handleChange}
        />

        {formData.is_hired && (
          <FormField
            label="Fecha de fin de contrato"
            name="end_date_contract"
            type="date"
            value={formData.end_date_contract}
            onChange={handleChange}
          />
        )}

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-caribe text-white rounded-lg hover:brightness-110 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Guardando..." : editMode ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateWorkTeamModal;