# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Matriz de Trazabilidad - PoC UV Move

| Elemento | Evidencia / Descripción |
| :--- | :--- |
| **Requisito** | **R1:** Autenticación de usuarios y gestión de inicio/fin de viajes. |
| **Regla de negocio** | **RN1:** Usuario activo.<br>**RN2:** Máximo 1 vehículo en uso simultáneo |
| **Módulo solicitante** | `Gestor_Reserva` |
| **Interfaz / Servicio** | `ServicioAutenticacion` y `ServicioRegistroViaje` |
| **Contrato** | `VerificarAutorizacion(id_usuario, id_vehiculo)` |
| **Módulo proveedor** | `Gestor_Autenticacion` |
| **Tablas Db2** | `USUARIO`, `VEHICULO`, `RESERVACION`, `VIAJE` |
| **Escenario exitoso** | Registro de Viaje #101 con estado `'EN_CURSO'` en Db2 |
| **Escenario de rechazo**| Intento de 2° viaje simultáneo bloqueado por regla **RN2** |
