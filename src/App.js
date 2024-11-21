import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";
const vacunasMexico = [
  "BCG",
  "Hepatitis B",
  "Hexavalente",
  "DPT",
  "Rotavirus",
  "Neumocócica conjugada",
  "SRP (triple viral)",
  "Influenza",
  "COVID-19",
];

const opcionesDosis = [
  "Al nacer",
  "2 meses",
  "4 meses",
  "6 meses",
  "12 meses",
  "18 meses",
  "1 año",
  "2 años",
  "3 años",
  "4 años",
  "6 años",
  "Primera dosis",
  "Segunda dosis",
  "Dosis anual",
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

  // Manejar cambios en las dosis de una vacuna
  const handleVacunaChange = (vacuna, index, value) => {
    setNuevaPersona((prev) => {
      const vacunas = { ...prev.vacunas };
      vacunas[vacuna] = vacunas[vacuna] || [];
      vacunas[vacuna][index] = value;
      return { ...prev, vacunas };
    });
  };

  // Agregar una nueva dosis a una vacuna
  const agregarDosis = (vacuna) => {
    setNuevaPersona((prev) => {
      const vacunas = { ...prev.vacunas };
  
      // Si no existe la vacuna, inicializa como un arreglo vacío
      if (!vacunas[vacuna]) {
        vacunas[vacuna] = [];
      }
  
      // Agrega solo una nueva dosis vacía
      vacunas[vacuna] = [...vacunas[vacuna], ""];
  
      return { ...prev, vacunas };
    });
  };
  

  const agregarPersona = () => {
    const { iniciales, edad, ultimaVacunacion } = nuevaPersona;
  
    // Validaciones
    if (!iniciales || iniciales.length > 4) {
      alert("Por favor, ingresa las iniciales (máximo 4 caracteres).");
      return;
    }
    if (!edad || isNaN(edad) || edad <= 0) {
      alert("Por favor, ingresa una edad válida.");
      return;
    }
    if (!ultimaVacunacion) {
      alert("Por favor, selecciona la última fecha de vacunación.");
      return;
    }
  
    // Agregar la persona si todas las validaciones pasan
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
        acc[vacuna] = persona.vacunas[vacuna]
          ? persona.vacunas[vacuna].join(", ")
          : "No registrada";
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
          <div key={vacuna} style={{ marginBottom: "15px" }}>
            <h4>{vacuna}</h4>
            {nuevaPersona.vacunas[vacuna]?.map((dosis, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center" }}>
                <select
                  value={dosis || ""}
                  onChange={(e) =>
                    handleVacunaChange(vacuna, index, e.target.value)
                  }
                >
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  {opcionesDosis.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button onClick={() => agregarDosis(vacuna)}>+ Añadir dosis</button>
          </div>
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
