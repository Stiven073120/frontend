"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ConsultarIntegrantesPage: React.FC = () => {
  interface Integrante {
    id: number;
    nombre: string;
    codigo: string;
    edad: number;
  }

  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [codigo, setCodigo] = useState<string>("");
  const [edad, setEdad] = useState<number>(0);

  const fetchIntegrantes = async () => {
    try {
      const response = await fetch("http://localhost:4000/integrantes");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Datos obtenidos:", data); // Verificar los datos obtenidos
      setIntegrantes(data); // Asegúrate de que 'data' sea un array
    } catch (error) {
      console.error("Error fetching integrantes:", error);
    }
  };

  useEffect(() => {
    fetchIntegrantes();
  }, []);

  const handleEdit = (id: number, nombre: string, codigo: string, edad: number) => {
    if (editingId === id) {
      setEditingId(null);
    } else {
      setEditingId(id);
      setNombre(nombre);
      setCodigo(codigo);
      setEdad(edad);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:4000/integrantes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, codigo, edad }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEditingId(null);
      fetchIntegrantes(); 
    } catch (error) {
      console.error("Error updating integrante:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Consultar Integrantes</h1>
      <p className="mb-6">Bienvenido a la página de consulta de integrantes.</p>
      <ul className="w-full max-w-md">
        <li className="bg-gray-300 mb-2 p-4 rounded shadow text-black font-bold flex justify-between">
          <span className="inline-block w-1/3 text-center">Nombre</span>
          <span className="inline-block w-1/3 text-center">Código</span>
          <span className="inline-block w-1/3 text-center">Edad</span>
        </li>
        {integrantes && integrantes.length > 0 ? (
          integrantes.map((integrante) => (
            <li
              key={integrante.id}
              className="bg-gray-100 mb-2 p-4 rounded shadow text-black flex flex-col"
            >
              <div className="flex justify-between items-center">
                <span className="inline-block w-1/4 text-center">
                  {integrante.nombre}
                </span>
                <span className="inline-block w-1/4 text-center">
                  {integrante.codigo}
                </span>
                <span className="inline-block w-1/4 text-center">
                  {integrante.edad}
                </span>
                <button
                  className="inline-block w-1/4 text-center bg-black text-white rounded-full px-4 py-2 hover:bg-gray-700"
                  onClick={() => handleEdit(integrante.id, integrante.nombre, integrante.codigo, integrante.edad)}
                >
                  {editingId === integrante.id ? "Cancelar" : "Modificar"}
                </button>
              </div>
              {editingId === integrante.id && (
                <motion.div
                  className="mt-4 p-4 bg-gray-200 rounded shadow"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-bold mb-2">Editar Integrante</h2>
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUpdate(integrante.id); }}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Código
                      </label>
                      <input
                        type="text"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Edad
                      </label>
                      <input
                        type="number"
                        value={edad}
                        onChange={(e) => setEdad(Number(e.target.value))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-block w-1/4 text-center bg-black text-white rounded-full px-4 py-2 hover:bg-gray-700"
                      >
                        Modificar
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500">No hay integrantes disponibles.</li>
        )}
      </ul>
    </div>
  );
};

export default ConsultarIntegrantesPage;