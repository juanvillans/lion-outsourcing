
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { workTeamAPI } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useFeedback } from "../../context/FeedbackContext";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "@iconify/react";

export default function DetalleEquipoPage() {
  const { id } = useParams();
  const [workTeam, setWorkTeam] = useState(null);
  const { showError, showSuccess, showInfo } = useFeedback();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchWorkTeam = useCallback(async () => {
    try {
      const res = await workTeamAPI.getWorkTeam(id);
      setWorkTeam(res.data);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkTeam();
  }, [fetchWorkTeam]);

  return (
    <div>
      <h1>Detalle del Equipo</h1>
    </div>
  );
}
