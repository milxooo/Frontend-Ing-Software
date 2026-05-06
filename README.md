# 🚀 OptimaAcademia: Arquitecto de Horarios e Inteligencia Académica

¡Bienvenido al motor de optimización académica definitivo! **OptimaAcademia** es un ecosistema diseñado para transformar la experiencia universitaria mediante algoritmos de vanguardia, sincronización en tiempo real y seguridad bilateral.

## 🧠 Arquitectura Computacional (Core Logic)

Este proyecto no es solo una interfaz bonita; detrás hay un motor de ingeniería robusto dividido en tres pilares fundamentales:

### 1. Motor de Optimización de Horarios (IA Engine - US-05)
El "Arquitecto de Horarios" utiliza un motor de búsqueda heurística que resuelve problemas de satisfacción de restricciones (CSP). 
- **Lógica**: Considera variables como cupos de aula, disponibilidad docente y preferencias del estudiante.
- **Métricas AI Insights**: Calcula en tiempo real el *score* de cada propuesta basándose en:
  - **Eficiencia de Huecos (Gap Score)**: Minimización de tiempos muertos.
  - **Sincronización de Créditos**: Optimización de carga académica por semestre.
  - **Commute/Zone Score**: Factorización de tiempos de desplazamiento.

### 2. Protocolo de Intercambio Bilateral (US-10)
Implementamos un sistema de confirmación mutua inspirado en protocolos de red:
- **Estado 'PENDIENTE'**: Ocurre cuando un estudiante confirma el swap pero espera la contraparte.
- **Validación Atómica**: El intercambio solo se procesa si ambas firmas digitales (POST /confirm) están presentes en el backend, evitando inconsistencias en los cupos.

### 3. Sello Digital de Formalización (US-11)
El cierre legal del intercambio se realiza mediante una integración con el SIA/Banner:
- **Transacción Segura**: Generación de un `transactionId` único (TX-OFFICIAL-...) que sirve como Hash de verificación.
- **Certificado Digital**: Una interfaz premium que visualiza la integridad del sistema y el sello de seguridad del nodo universitario.

## 🛠️ Stack Tecnológico
- **Frontend**: React + TypeScript + Vite.
- **Estilos**: Vanilla CSS + Tailwind CSS (Diseño Premium Dark Mode).
- **Iconografía**: Google Material Symbols (Rounded).
- **Tipografía**: Outfit (Display) e Inter (Cuerpo) para máxima legibilidad y estética premium.

## 🚀 Instalación y Ejecución

1. Clona el repositorio.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el entorno de desarrollo:
   ```bash
   npm run dev
   ```

## ⚠️ Advertencia para el Equipo
Todo el sistema está estructurado bajo **Arquitectura Hexagonal**. Favor no modificar los servicios de la carpeta `src/services/api.ts` ni la lógica de estados en `SwapMarket.tsx` o `ScheduleManager.tsx` sin consultar el protocolo de sincronización, ya que podrías romper la integración con el motor de IA del Backend.

---
**Desarrollado con precisión pedagógica por Santiago Parra & Stitch AI.** 🛡️💎
