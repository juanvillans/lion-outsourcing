import React, { useState, useEffect, useCallback, useMemo } from "react";
import { adminAPI } from "../../services/api";
import { Icon } from "@iconify/react";
import Modal from "../../components/Modal";
import FuturisticButton from "../../components/FuturisticButton";
import {MaterialReactTable} from 'material-react-table';
import { ReusableForm } from "../../components/forms";


// En las versiones más recientes, no necesitas registrar módulos para funcionalidades básicas
// La versión Community ya incluye el ClientSideRowModel por defecto

// Función reutilizable para crear operadores de filtro para columnas de texto

export default function AdministradoresPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const defaultFormData = {
    email: "",
    fullname: "",
    role: "",
    allow_talents: false,
    allow_bussinesses: false,
    allow_professions: false,
    allow_admins: false,

    type: "administrador",
  };
  const [formData, setFormData] = useState(structuredClone(defaultFormData));
  const [submitString, setSubmitString] = useState("Crear");

  // Form configuration for ReusableForm
  const [userFormFields, setUserFormFields] =  useState([
    
   
  ])

  const validationRules = {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    first_name: {
      minLength: 2,
      maxLength: 50,
    },
    last_name: {
      minLength: 2,
      maxLength: 50,
    },
  };

  const onSubmit = async (submitData) => {
      submitData.permission_names = Object.keys(submitData).filter((key) => key.startsWith("allow_") && submitData[key] === true );
    console.log(submitData);
    try {
      if (submitString === "Actualizar") {
        await adminAPI.updateAdmin(submitData.id, submitData);
        setSubmitString("Crear");
        setFormData(structuredClone(defaultFormData));
      } else {
        await adminAPI.createAdmin(submitData);
      }

      // Reset form data after successful submission
      setFormData(structuredClone(defaultFormData));

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      throw new Error(
        error ||
          `Error al ${submitString.toLowerCase()} el usuario.`
      );  
    }
  };
  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteAdmin(id);
      fetchData();
    } catch (error) {
      throw new Error(
        error ||
          `Error al eliminar el administrador.`
      );  
    }
  };
  
  const columns = useMemo( () => [
    {
      accessorKey: "id",
      header: "ID",
      size: 75,
    },
    {
      accessorKey: "fullname",
      header: "Nombre y Apellido",
      size: 200,
    },
    {
      accessorKey: "email",
      header: "Correo Electrónico",
      size: 200,
    },
    {
      accessorKey: "role",
      header: "Rol",
      size: 150,
    },
    {
      accessorKey: "status",
      header: "Estado",
      size: 150,
    },
    {
      accessorKey: "email_verified_at",
      header: "Validado",
      size: 150,
      Cell: ({ cell }) => cell.getValue() ? <Icon className="text-color2" icon="iconamoon:check-fill" width={20} height={20} /> :  <Icon className="text-red-300" icon="line-md:close" width={18} height={17} />, 
    },
    {
      header: "Acciones",
      id: "actions", // ← obligatorio cuando no usas accessorKey
      size: 100,
      enableColumnFilter: false,
      enableSorting: false,
      Cell: ({ row }) => (
        <div className="flex gap-2 justify-center items-center">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setFormData({ ...row.original, ...row.original.permissions });
              setSubmitString("Actualizar");
            }}
            className="mx-1 p-1 hover:p-2 duration-75 text-gray-500 hover:bg-blue-100 hover:text-color3 rounded-full"

            title="Editar"
          >

            <Icon icon="material-symbols:edit" width={20} height={20} />
          </button>
     
          <button
            onClick={() => {
              setFormData({ ...row.original });
              if (window.confirm("¿Está seguro de eliminar este administrador?")) {
                  handleDelete(row.original.id);
              }
            }}
            className="mx-1 p-1 hover:p-2 duration-75 text-gray-500 hover:bg-red-100 hover:text-red-500 rounded-full"

            title="Eliminar"
          >

            <Icon icon="material-symbols:delete" width={20} height={20} />
          </button>
        </div>
      ),
    }

  ]);
  const [rowData, setRowData] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await adminAPI.getAdmins("/admin/admins");
      console.log(res.admins);
      setRowData(res.admins);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  }, []);


  const getPermissions = useCallback(async () => {
    try {
      const res = await adminAPI.getPermissions();
      setUserFormFields((prev) => [
        {
      name: "email",
      label: "Correo Electrónico",
      type: "email",
      required: true,
      placeholder: "usuario@hospital.com",
      className: "col-span-2",
    },
    {
      name: "fullname",
      label: "Nombre y apellido",
      type: "text",
      required: true,
      className: "col-span-1",
    },
    {
      name: "role",
      label: "Rol",
      type: "text",
      required: true,
      className: "col-span-1",
    }, ...res.permissions.map((permission) => ({
          name: permission.name,
          label: permission.label,
          type: "checkbox",
          helperText: permission.helper_text,
        }))]);
      setPermissions(res.permissions);
    
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  }, []);
  
  useEffect(() => {
    fetchData();
    getPermissions();
  }, [fetchData]);

  return (
    <>
      <title>Gestión de Administradores - lion</title>
      <div style={{ height: 580, width: "100%" }}>
        <div className="md:flex justify-between items-center mb-4">
          <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-0">Gestión de Administradores</h1>
          <FuturisticButton
            onClick={() => {
              if (submitString === "Actualizar") {
                setSubmitString("Crear");
                setFormData(structuredClone(defaultFormData));
              }
              setIsModalOpen(true);
            }}
          >
            Crear usuario
          </FuturisticButton>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          title="Crear Nuevo Usuario"
          size="md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReusableForm
              fields={userFormFields}
              onSubmit={onSubmit}
              onCancel={() => {
                setFormData(structuredClone(defaultFormData));
                setIsModalOpen(false);
              }}
              submitText={submitString}
              cancelText="Cancelar"
              validationRules={validationRules}
              className="col-span-2"
              formData={formData}
              onFormDataChange={setFormData}
            />
          </div>

          {/* Activation Information */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-2">
              Información de activación
            </h3>
            <p className="text-sm text-blue-700">
              Se enviará un enlace de activación al correo electrónico del
              usuario. A través de este enlace, el usuario podrá establecer su
              contraseña y activar su cuenta.
            </p>
            <p className="text-sm text-blue-700 mt-2">
              El enlace de activación caducará en 48 horas. Si el usuario no
              activa su cuenta en este tiempo, el usuario será eliminado.
            </p>
          </div>
        </Modal>
       
        <div
          className="ag-theme-alpine ag-grid-no-border"
          style={{ height: 500 }}
        >

            <MaterialReactTable
              columns={columns}
              data={rowData}
              enableColumnFilters
              enableSorting
              enablePagination
              initialState={{ pagination: { pageSize: 5 } }}
              muiTablePaginationProps={{
                rowsPerPageOptions: [5, 10, 20],
                showFirstButton: true,
                showLastButton: true,
              }}
            />
        </div>
       
      </div>
    </>
  );
}



// 'use client';
// import React, { useState, useEffect, useCallback, useMemo, useLayoutEffect } from "react";
// // import { usersAPI } from "../../services/api";
// // import { Icon } from "@iconify/react";
// import Modal from "@/components/Modal";
// import ReusableForm  from "@/components/ReusableForm";
// // import FuturisticButton from "../../components/FuturisticButton";
// import {MaterialReactTable} from 'material-react-table';
// import { adminService } from "@/services";
// // import { ReusableForm } from "../../components/forms";


// // En las versiones más recientes, no necesitas registrar módulos para funcionalidades básicas
// // La versión Community ya incluye el ClientSideRowModel por defecto

// // Función reutilizable para crear operadores de filtro para columnas de texto

// export default function AdminsPage() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const defaultFormData = {
//     email: "",
//     fullname: "",
//     role: "",
//     allow_talents: false,
//     allow_bussinesses: false,
//     allow_professions: false,
//     allow_admins: false,
//   };
//   const [formData, setFormData] = useState(structuredClone(defaultFormData));
//   const [submitString, setSubmitString] = useState("Crear");

//   // Form configuration for ReusableForm
//   const userFormFields = [
//     {
//       name: "email",
//       label: "Correo Electrónico",
//       type: "email",
//       required: true,
//       placeholder: "usuario@hospital.com",
//       className: "col-span-2",
//     },
//     {
//       name: "fullname",
//       label: "Nombre y apellido",
//       type: "text",
//       required: true,
//       className: "col-span-1",
//     },
//     {
//       name: "role",
//       label: "Rol",
//       type: "text",
//       required: true,
//       className: "col-span-1",
//     },
//     {
//       name: "allow_talents",
//       label: "Puede responde solicitudes de talentos",
//       type: "checkbox",
//     },
//     {
//       name: "allow_bussinesses",
//       label: "Puede responder solicitudes de empresas",
//       type: "checkbox",
//     },
//      {
//       name: "allow_professions",
//       label: "Puede gestionar las profesiones",
//       type: "checkbox",
//       helperText: "Permite crear, editar y eliminar o desabilitar las profesiones ofrecidas, así como las habilidades especificas de cada profesión",

//     },
//     {
//       name: "allow_admins",
//       label: "Puede Gestionar administradores",
//       type: "checkbox",
//       helperText: "Permite crear, editar y eliminar administradores del sistema",
//     },
//   ];  



//   const onSubmit = async (submittedFormData) => {
//     try {
//       if (submitString === "Actualizar") {
//         await adminService.update(formData.id, submittedFormData);
//         setSubmitString("Crear");
//         setFormData(structuredClone(defaultFormData));
//       } else {
//         await adminService.create(submittedFormData);
//       }

//       // Reset form data after successful submission
//       setFormData(structuredClone(defaultFormData));

//       setIsModalOpen(false);
//       fetchData();
//     } catch (error) {
//       throw new Error(
//         error ||
//           `Error al ${submitString.toLowerCase()} el usuario.`
//       );  
//     }
//   };

//   const columns = useMemo( () => [
//     {
//       accessorKey: "id",
//       header: "ID",
//       size: 75,
//     },
//     {
//       accessorKey: "fullname",
//       header: "Nombre y Apellido",
//       size: 150,
//     },

//     {
//       accessorKey: "email",
//       header: "Correo Electrónico",
//       size: 200,
//     },
//     {
//       accessorKey: "role",
//       header: "Rol",
//       size: 150,
//     },
//     {
//       accessorKey: "allow_talents",
//       header: "Puede responder solicitudes de talentos",
//       size: 180,
//       Cell: ({ cell }) => cell.getValue() ? <Icon className="text-color2" icon="iconamoon:check-fill" width={20} height={20} /> :  <Icon className="text-red-300" icon="line-md:close" width={18} height={17} />,
//     },
//     {
//       accessorKey: "allow_bussinesses",
//       header: "Puede responder solicitudes de empresas",
//       size: 180,
//       Cell: ({ cell }) => cell.getValue() ? <Icon className="text-color2" icon="iconamoon:check-fill" width={20} height={20} /> :  <Icon className="text-red-300" icon="line-md:close" width={18} height={17} />,
//     },
//     {
//       accessorKey: "allow_professions",
//       header: "Puede gestionar las profesiones",
//       size: 180,
//       Cell: ({ cell }) => cell.getValue() ? <Icon className="text-color2" icon="iconamoon:check-fill" width={20} height={20} /> :  <Icon className="text-red-300" icon="line-md:close" width={18} height={17} />,
//     },

 
//     {
//       accessorKey: "allow_handle_users",
//       header: "Gestión de administradores",
//       size: 180,
//       Cell: ({ cell }) => cell.getValue() ? <Icon className="text-color2" icon="iconamoon:check-fill" width={20} height={20} /> :  <Icon className="text-red-300" icon="line-md:close" width={18} height={17} />,
//     },
//     {
//       accessorKey: "allow_handle_exams",
//       header: "Gestión de Exámenes",
//       size: 180,
//       Cell: ({ cell }) => cell.getValue() ? <Icon className="text-color2" icon="iconamoon:check-fill" width={20} height={20} /> :  <Icon className="text-red-300" icon="line-md:close" width={18} height={17} />,
//     },
//     {
//       accessorKey: "status",
//       header: "Estado",
//       size: 180,
//     },
//     {
//       header: "Acciones",
//       id: "actions", // ← obligatorio cuando no usas accessorKey
//       size: 100,
//       enableColumnFilter: false,
//       enableSorting: false,
//       Cell: ({ row }) => (
//         <div className="flex gap-2 justify-center items-center">
//           <button
//             onClick={() => {
//               setIsModalOpen(true);
//               setFormData({ ...row.original });
//               setSubmitString("Actualizar");
//             }}
//             className="mx-1 p-1 hover:p-2 duration-75 text-gray-500 hover:bg-blue-100 hover:text-color3 rounded-full"

//             title="Editar"
//           >

//             <Icon icon="material-symbols:edit" width={20} height={20} />
//           </button>
//         </div>
//       ),
//     }

//   ]);
//   const [rowData, setRowData] = useState([]);

//   // const fetchData = useCallback(async () => {
//   //   try {
//   //     const res = await usersAPI.getAllUsers();
//   //     console.log(res.data);
//   //     setRowData(res.data.users);
//   //   } catch (e) {
//   //     console.error("Failed to fetch data", e);
//   //   }
//   // }, []);

//   // useEffect(() => {
//   //   fetchData();
//   // }, [fetchData]);

//   return (
//     <>
//       <title>Administradores - LabFalcón</title>
//       <div style={{ height: 580, width: "100%" }}>
//         <div className="md:flex justify-between items-center mb-4">
//           <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-0">Administradores</h1>
//           <button
//             onClick={() => {
//               if (submitString === "Actualizar") {
//                 setSubmitString("Crear");
//               }
//               setIsModalOpen(true);
//             }}
//           >
//             Crear usuario
//           </button>
//         </div>
//         <Modal
//           isOpen={isModalOpen}
//           onClose={() => {
//             setIsModalOpen(false);
//           }}
//           title="Nuevo Administrador"
//           size="md"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <ReusableForm
//               fields={userFormFields}
//               onSubmit={onSubmit}
//               onCancel={() => {
//                 setFormData(structuredClone(defaultFormData));
//                 setIsModalOpen(false);
//               }}
//               submitText={submitString}
//               cancelText="Cancelar"
//               className="col-span-2"
//               formData={formData}
//               onFormDataChange={setFormData}
//             />
//           </div>

//           {/* Activation Information */}
//           <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
//             <h3 className="text-lg font-medium text-blue-800 mb-2">
//               Información de activación
//             </h3>
//             <p className="text-sm text-blue-700">
//               Se enviará un enlace de activación al correo electrónico del
//               usuario. A través de este enlace, el usuario podrá establecer su
//               contraseña y activar su cuenta.
//             </p>
//             <p className="text-sm text-blue-700 mt-2">
//               El enlace de activación caducará en 48 horas. Si el usuario no
//               activa su cuenta en este tiempo, el usuario será eliminado.
//             </p>
//           </div>
//         </Modal>
//         {!isModalOpen && (
//           <div
//             className="ag-theme-alpine ag-grid-no-border"
//             style={{ height: 500 }}
//           >
//             <MaterialReactTable
//               columns={columns}
//               data={rowData}
//               enableColumnFilters
//               enableSorting
//               enablePagination
//               initialState={{ pagination: { pageSize: 5 } }}
//               muiTablePaginationProps={{
//                 rowsPerPageOptions: [5, 10, 20],
//                 showFirstButton: true,
//                 showLastButton: true,
//               }}
//             />
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
