import React, { useState, useEffect, useCallback, useMemo } from "react";
import { applicantsAPI } from "../../services/api";
import { useFeedback } from "../../context/FeedbackContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../config/env";
import { Icon } from "@iconify/react";

const englishLevels = {
  none: "Ninguno",
  beginner: "Básico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const PdfPreview = ({ employeeId }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await applicantsAPI.getApplicantCV(employeeId);
        console.log(response);
        const blob = response;

        // Validamos que sea un Blob real
        if (!(blob instanceof Blob)) {
          console.error("La respuesta no es un Blob");
          return;
        }

        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch PDF", err);
        setError("No se pudo cargar el PDF");
        setLoading(false);
      }
    };

    fetchPdf();

    // Limpieza: Revocar la URL para evitar fugas de memoria
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [employeeId]);

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

export default function DetalleAplicantePage() {
  const { id } = useParams();
  const [applicant, setApplicant] = useState(null);
  const { showError, showSuccess, showInfo } = useFeedback();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchApplicant = useCallback(async () => {
    try {
      const res = await applicantsAPI.getApplicant(id);
      setApplicant(res.data);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  }, [id]);

  useEffect(() => {
    fetchApplicant();
  }, [fetchApplicant]);

  const [aceptLoading, setAceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const handleAccept = async () => {
    setAceptLoading(true);
    try {
      await applicantsAPI.acceptApplicant(id);
      showSuccess("Aplicante aceptado con éxito");
      navigate("/dashboard/aplicantes");
    } catch (e) {
      console.error("Failed to accept applicant", e);
      showError("No se pudo aceptar el aplicante");
    }
    setAceptLoading(false);
  };
  const handleReject = async () => {
    
    setRejectLoading(true);
    try {
      await applicantsAPI.rejectApplicant(id);
      showSuccess("Aplicante rechazado con éxito");
      navigate("/dashboard/aplicantes");
    } catch (e) {
      console.error("Failed to reject applicant", e);
      showError("No se pudo rechazar el aplicante");
    }
    
    setRejectLoading(false);
  };

  return (
    <>
      <title>Detalle del Aplicante - Lion PR Services</title>
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2  bg-gray-100 rounded-md"
        >
          <Icon icon="mdi:arrow-left" className="mr-2" />
        </button>
        <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-0">
          Detalle del Aplicante
        </h1>
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-4 p-4 md:p-6 bg-gray-100 neuphormism rounded-2xl">
          <img className="w-32 mb-4 mx-auto rounded-md" src={applicant?.photo_url} alt="" />
          <p>
            <strong className="text-dark">Nombre:</strong> {applicant?.fullname}
          </p>
          <p>
            <strong className="text-dark">Correo Electrónico:</strong> {applicant?.email}
          </p>
          <p>
            <strong className="text-dark">Teléfono:</strong> {applicant?.phone_number}
          </p>
          <p>
            <strong className="text-dark">Industria:</strong> {applicant?.industry?.name}
          </p>
          <p>
            <strong className="text-dark">Especialidad:</strong> {applicant?.area?.name}
          </p>

          <p>
            <strong className="text-dark">Habilidades:</strong>{" "}
            {applicant?.skills?.map((skill, i) => {
              return (
                <span
                  className={`inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 ${
                    skill.id == null ? "bg-red-200" : ""
                  }`}
                  key={skill.id+skill.name+i}
                >
                  {skill.name}
                </span>
              );
            })}
          </p>
          <p>
            <strong className="text-dark">Experiencia:</strong> {applicant?.years_of_experience} años
          </p>
          <p>
            <strong className="text-dark">Título/Grado académico:</strong> {applicant?.academic_title}
          </p>
          <p>
            <strong className="text-dark">Ubicación:</strong> {applicant?.localization}
          </p>
          <p>
            <strong className="text-dark">Idioma:</strong> {englishLevels[applicant?.english_level]}
          </p>
          <p>
            <strong className="text-dark">Ingreso Mensual Deseado:</strong>{" "}
            {applicant?.desired_monthly_income}$
          </p>
          <p>
            <strong className="text-dark">LinkedIn:</strong> {applicant?.linkedin_url}
          </p>
          <p>
            <strong className="text-dark">Sitio Web:</strong> {applicant?.website_url}
          </p>
        </div>

        <div className=" col-span-8 p-3 rounded-md">
           <PdfPreview employeeId={id} />
        </div>
      </div>


      <div className="fixed bottom-8 right-28 flex gap-10 shadow-sm ">
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg"
        onClick={() => window.confirm("¿Está seguro de eliminar este aplicante?") && handleReject()}
        >
          {rejectLoading ? (
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
              <span>Cargando...</span>
            </div>
          ) : (
            <span>Rechazar</span>
          )}
        </button>
        <button className="bg-caribe text-white px-4 py-2 rounded-lg" onClick={handleAccept}>
          
          {aceptLoading ? (
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
              <span>Cargando...</span>
            </div>
          ) : (
            <span>Aceptar</span>
          )}
        </button>
      </div>

    </>
  );
}
