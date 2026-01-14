// client/src/components/CreateWorkTeamModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import FormField from "../forms/FormField";
import { workTeamAPI } from "../../services/api";
import { useFeedback } from "../../context/FeedbackContext";
import FuturisticButton from "../FuturisticButton";

const CreateWorkTeamModal = ({
  isOpen,
  onClose,
  onSuccess,
  editMode = false,
  initialData = null,
  employeeIds = [] // Array of employee IDs to add to the team after creation
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
      let createdTeamId = null;

      if (editMode && initialData?.id) {
        await workTeamAPI.updateWorkTeam(initialData.id, formData);
        showSuccess("Equipo actualizado exitosamente");
        createdTeamId = initialData.id;
      } else {
        // Create the work team and get the response with the ID
        const response = await workTeamAPI.createWorkTeam(formData);
        createdTeamId = response.data.id; // Extract the ID from the response
        showSuccess("Equipo creado exitosamente");
      }

      // If there are employees to add, add them to the team
      if (employeeIds && employeeIds.length > 0 && createdTeamId) {
        try {
          await workTeamAPI.addEmployeeToWorkTeam(createdTeamId, {
            employee_ids: employeeIds,
          });
          showSuccess(`${employeeIds.length} trabajador(es) agregado(s) al equipo`);
        } catch (addError) {
          // Show error but don't fail the whole operation
          showError(addError.response?.data?.message || "Error al agregar trabajadores al equipo");
        }
      }

      // Call onSuccess with the created team ID
      onSuccess?.(createdTeamId);
      onClose();
    } catch (error) {
      const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error en el sistema principal";
    showError(errorMessage);
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
          <FuturisticButton
            type="submit"
            disabled={loading}
          >
            {loading ? "Guardando..." : editMode ? "Actualizar" : "Crear"}
          </FuturisticButton>
        </div>
      </form>
    </Modal>
  );
};

export default CreateWorkTeamModal;