import { useState } from "react";

import { ReusableForm } from "../components/forms";


const defaultFormData = {
    email: "",
    password: "",
    repeat_password: "",

  };
  
  const formFields = [
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
  
    // Form configuration for ReusableForm
   
    const onSubmit = (event) => {
      event.preventDefault();
      console.log(formData);
    };
  return <div>


      <ReusableForm
        formData={formData}
        setFormData={setFormData}
        fields={formFields}
        submitText={submitString}
        onSubmit={onSubmit}
      />

  </div>;

}
