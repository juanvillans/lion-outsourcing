import { useReactToPrint } from "react-to-print";
import React, { useRef, useState, useEffect } from "react";
import { workTeamAPI } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useFeedback } from "../context/FeedbackContext";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/env";

const WorkTeamPDF = ({ workTeamId }) => {
  const [workTeam, setWorkTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchWorkTeam = useCallback(async () => {
    try {
      const res = await workTeamAPI.getWorkTeam(workTeamId);
      setWorkTeam(res.data);
      setLoading(false);
    } catch (e) {
      console.error("Failed to fetch data", e);
      setError("No se pudo cargar el equipo");
      setLoading(false);
    }
  }, [workTeamId]);

  useEffect(() => {
    fetchWorkTeam();
  }, [fetchWorkTeam]);

  if (loading) return <p>Cargando PDF...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src={pdfUrl}
        title="Vista previa CV"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default WorkTeamPDF;
