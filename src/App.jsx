import { useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [usuarioAuth, setUsuarioAuth] = useState(null);
  
  const [idVehiculo, setIdVehiculo] = useState('1');
  const [mensaje, setMensaje] = useState('');
  
  // Simulación de persistencia local / Db2 para viajes activos
  const [viajesEnDb2, setViajesEnDb2] = useState([]);
  const [viajeActual, setViajeActual] = useState(null);

  // 1. Gestor_Autenticacion (Supabase Auth)
  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('Verificando estudiante en Supabase Auth...');

    if (!matricula) {
      setMensaje(' Error: Debes ingresar una matrícula o correo.');
      return;
    }

    const emailAProbar = matricula.includes('@') 
      ? matricula 
      : `${matricula}@estudiantes.uv.mx`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailAProbar,
      password: password,
    });

    if (error) {
      setMensaje(` Error de Autenticación: ${error.message}`);
    } else {
      setUsuarioAuth(data.user);
      setMensaje(` Estudiante autenticado en Supabase Auth: ${data.user.email}`);
    }
  };

  // 2. Gestor_Reserva / Orquestador de Viajes (Interacción y Contrato)
  const handleIniciarViaje = () => {
    setMensaje('Ejecutando contrato VerificarAutorizacion()...');

    if (!usuarioAuth) {
      setMensaje(' RECHAZADO: Debe autenticarse como estudiante activo en Supabase (RN1).');
      return;
    }

    // --- REGLA DE NEGOCIO RN2: Verificación en Db2 ---
    // Un usuario no puede tener más de un vehículo en uso simultáneamente
    const viajeActivoExistente = viajesEnDb2.find(
      (v) => v.id_usuario === usuarioAuth.email && v.estado_viaje === 'EN_CURSO'
    );

    if (viajeActivoExistente) {
      setMensaje(
        ` RECHAZADO POR REGLA DE NEGOCIO (RN2): El usuario ${usuarioAuth.email} ya posee el viaje #${viajeActivoExistente.id_viaje} activo. No puede rentar otro vehículo.`
      );
      return;
    }

    // --- ESCENARIO 1: Flujo Exitoso ---
    const nuevoViaje = {
      id_viaje: viajesEnDb2.length + 101,
      id_usuario: usuarioAuth.email,
      id_vehiculo: idVehiculo,
      fecha_hora_inicio: new Date().toLocaleTimeString(),
      fecha_hora_fin: null,
      estado_viaje: 'EN_CURSO',
      costo_total: null,
    };

    // Registro del viaje en persistencia (Db2)
    setViajesEnDb2([...viajesEnDb2, nuevoViaje]);
    setViajeActual(nuevoViaje);

    setMensaje(
      ` ÉXITO (Escenario 1): Viaje #${nuevoViaje.id_viaje} iniciado a las ${nuevoViaje.fecha_hora_inicio}. Registrado en la tabla VIAJE de IBM Db2.`
    );
  };

  // Finalizar Viaje y calcular importe
  const handleFinalizarViaje = () => {
    if (!viajeActual) return;

    const horaFin = new Date().toLocaleTimeString();
    const costoCalculado = 15.00; // Tarifa base simulada (RN9)

    const viajesActualizados = viajesEnDb2.map((v) => {
      if (v.id_viaje === viajeActual.id_viaje) {
        return {
          ...v,
          fecha_hora_fin: horaFin,
          estado_viaje: 'FINALIZADO',
          costo_total: costoCalculado,
        };
      }
      return v;
    });

    setViajesEnDb2(viajesActualizados);
    setViajeActual(null);
    setMensaje(
      ` VIAJE COMPLETADO: Viaje #${viajeActual.id_viaje} finalizado a las ${horaFin}. Costo: $${costoCalculado} MXN. Actualizado en IBM Db2.`
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '650px', margin: 'auto' }}>
      <h2>PoC UV Move - Módulos Reserva + Autenticación</h2>

      {/* Módulo 1: Autenticación */}
      <div style={{ border: '1px solid #444', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
        <h3>1. Gestor_Autenticacion (Supabase Auth)</h3>
        {!usuarioAuth ? (
          <form onSubmit={handleLogin}>
            <div>
              <label>Correo / Matrícula: </label>
              <input
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="ej. s24003910@gmail.com"
                required
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <label>Contraseña: </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" style={{ marginTop: '10px' }}>Verificar Estudiante</button>
          </form>
        ) : (
          <p> Estudiante Autenticado: <strong>{usuarioAuth.email}</strong></p>
        )}
      </div>

      {/* Módulo 2: Orquestador de Reservas y Viajes */}
      <div style={{ border: '1px solid #444', padding: '15px', borderRadius: '8px' }}>
        <h3>2. Gestor_Reserva y Viajes</h3>
        <label>ID Vehículo a rentar: </label>
        <input
          type="text"
          value={idVehiculo}
          onChange={(e) => setIdVehiculo(e.target.value)}
          style={{ width: '60px', marginLeft: '10px' }}
        />
        <br /><br />

        <button
          onClick={handleIniciarViaje}
          style={{ backgroundColor: '#28a745', color: '#fff', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
        >
          Solicitar e Iniciar Viaje
        </button>

        {viajeActual && (
          <button
            onClick={handleFinalizarViaje}
            style={{ backgroundColor: '#dc3545', color: '#fff', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Finalizar Viaje Activo
          </button>
        )}
      </div>

      {/* Consola de Estado / Salida de la PoC */}
      {mensaje && (
        <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#e9ecef', color: '#333', borderRadius: '5px', borderLeft: '5px solid #007bff' }}>
          <strong>Estado de la PoC:</strong> {mensaje}
        </div>
      )}

      {/* Registros de Persistencia Simulados (Tabla VIAJE de Db2) */}
      <div style={{ marginTop: '20px' }}>
        <h4> Persistencia en IBM Db2 (Tabla VIAJE):</h4>
        <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>ID Viaje</th>
              <th>Usuario</th>
              <th>ID Vehículo</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {viajesEnDb2.length === 0 ? (
              <tr><td colSpan="6">Sin registros en Db2</td></tr>
            ) : (
              viajesEnDb2.map((v) => (
                <tr key={v.id_viaje}>
                  <td>{v.id_viaje}</td>
                  <td>{v.id_usuario}</td>
                  <td>{v.id_vehiculo}</td>
                  <td>{v.fecha_hora_inicio}</td>
                  <td>{v.fecha_hora_fin || '-'}</td>
                  <td><strong>{v.estado_viaje}</strong></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
