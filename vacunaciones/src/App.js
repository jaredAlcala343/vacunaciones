import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";


const vacunasMexico = [
  { nombre: "BCG", refuerzo: false },
  { nombre: "Hepatitis B", refuerzo: true },
  { nombre: "Pentavalente", refuerzo: true },
  { nombre: "Rotavirus", refuerzo: false },
  { nombre: "Neumococo", refuerzo: true },
  { nombre: "Influenza", refuerzo: true },
  { nombre: "Triple Viral (SRP)", refuerzo: false },
  { nombre: "DPT", refuerzo: true },
  { nombre: "Varicela", refuerzo: false },
  { nombre: "VPH", refuerzo: true },
];

const App = () => {
  const [personas, setPersonas] = useState([]);
  const [nuevaPersona, setNuevaPersona] = useState({
    iniciales: "",
    edad: "",
    ultimaVacunacion: "",
    vacunas: {},
  });

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaPersona({ ...nuevaPersona, [name]: value });
  };

  // Manejar selección de vacunas
  const handleVacunaChange = (nombre) => {
    setNuevaPersona((prev) => ({
      ...prev,
      vacunas: {
        ...prev.vacunas,
        [nombre]: !prev.vacunas[nombre],
      },
    }));
  };

  // Agregar persona al registro
  const agregarPersona = () => {
    setPersonas([...personas, nuevaPersona]);
    setNuevaPersona({
      iniciales: "",
      edad: "",
      ultimaVacunacion: "",
      vacunas: {},
    });
  };

  // Generar archivo Excel
  const generarExcel = () => {
    const datos = personas.map((persona, index) => ({
      "#": index + 1,
      Iniciales: persona.iniciales,
      Edad: persona.edad,
      "Última Vacunación": persona.ultimaVacunacion,
      ...vacunasMexico.reduce((acc, vacuna) => {
        acc[vacuna.nombre] = persona.vacunas[vacuna.nombre] ? "Sí" : "No";
        return acc;
      }, {}),
    }));

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registro de Vacunación");

    XLSX.writeFile(wb, "registro_vacunacion.xlsx");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Campaña de Vacunación</h1>

      {/* Formulario */}
      <div>
        <h2>Registrar Persona</h2>
        <input
          type="text"
          name="iniciales"
          placeholder="Iniciales"
          value={nuevaPersona.iniciales}
          onChange={handleChange}
        />
        <input
          type="number"
          name="edad"
          placeholder="Edad"
          value={nuevaPersona.edad}
          onChange={handleChange}
        />
        <input
          type="date"
          name="ultimaVacunacion"
          placeholder="Última Vacunación"
          value={nuevaPersona.ultimaVacunacion}
          onChange={handleChange}
        />

        <h3>Vacunas</h3>
        {vacunasMexico.map((vacuna) => (
          <label key={vacuna.nombre} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={!!nuevaPersona.vacunas[vacuna.nombre]}
              onChange={() => handleVacunaChange(vacuna.nombre)}
            />
            {vacuna.nombre} {vacuna.refuerzo && "(Con refuerzo)"}
          </label>
        ))}

        <button onClick={agregarPersona}>Agregar Persona</button>
      </div>

      {/* Lista de personas registradas */}
      <div>
        <h2>Personas Registradas</h2>
        {personas.length === 0 ? (
          <p>No hay personas registradas.</p>
        ) : (
          <ul>
            {personas.map((persona, index) => (
              <li key={index}>
                {persona.iniciales} - {persona.edad} años - Última vacunación:{" "}
                {persona.ultimaVacunacion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botón para finalizar */}
      <button onClick={generarExcel}>Finalizar y Exportar a Excel</button>
    </div>
  );
};

export default App;
