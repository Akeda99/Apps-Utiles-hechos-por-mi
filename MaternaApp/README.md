# MamiSalud

Aplicación móvil de salud materna para gestantes adolescentes de la región Ucayali, Perú.
Desarrollada con Flutter · Diseñada para uso en postas y hospitales del MINSA.

---

## Pantallas y funcionalidades

### Inicio (Home)
- Tarjeta de bienvenida personalizada con el nombre de la gestante y las semanas de gestación actuales.
- **Tamaño del bebé por semana**: compara el bebé con frutas y objetos cotidianos (semana 4 a 40), mostrando también el tamaño aproximado en centímetros.
- **Tip del día**: 40 consejos de salud materna regionalizados para Ucayali que rotan diariamente según el día del año y las semanas de gestación de cada paciente.
- Accesos directos a las secciones principales de la app.

### Chatbot — "Mami-bot"
Asistente conversacional con árbol de decisión que responde preguntas frecuentes sobre el embarazo, **regionalizado para Ucayali**:
- **Alimentación**: proteínas locales (paiche, boquichico, palometa, sábalos), verduras amazónicas (sachaculantro, shapumba, cocona), tubérculos (yuca, plátano).
- **Comidas típicas**: guía nutricional de patarashca, inchicapi, tacacho con cecina y juane de gallina.
- **Frutas amazónicas**: aguaje (vitamina A), camu camu (vitamina C), pijuayo (betacaroteno), ungurahui (ácidos grasos).
- **Qué NO comer**: chicha fermentada, masato fermentado, ceviche de pescado crudo, carne de monte poco cocida, plantas medicinales sin consultar.
- **Vitaminas y suplementos**: relaciona cada suplemento con fuentes locales; recuerda que ácido fólico, hierro y calcio son gratuitos en los puestos de salud de Pucallpa.
- **Agua e hidratación**: recomienda 10 vasos/día por el calor amazónico, advierte sobre agua de río sin tratar.
- **Señales de alarma**: menciona el Hospital Regional de Pucallpa y promotores de salud en comunidades alejadas.
- **Dengue, malaria y Zika**: síntomas, prevención (mosquitero, ropa protectora, eliminar agua estancada) y alerta de fiebre durante el embarazo.
- **Cuidados con el calor amazónico**: descanso entre 12–3 pm, ropa de algodón, señales de golpe de calor.
- **Bebé semana a semana**: comparaciones de tamaño con frutas locales (semilla de aguaje, plátano de isla, piña pequeña).
- **Controles prenatales**: calendario completo con recordatorio de que son gratuitos en MINSA Ucayali.

### Señales de Alarma
- Listado visual de señales de peligro durante el embarazo, organizadas por urgencia.
- Filtro por categoría: Todas / Urgente / Avisa.
- Tarjetas con badge de color (URGENTE en coral, AVISA en amarillo).
- Botón de emergencia con acceso rápido para llamar al médico.

### Controles Prenatales
- Registro de controles prenatales realizados con fecha, semanas de gestación, peso y observaciones.
- Deslizar una tarjeta hacia la izquierda para eliminarla.
- Formulario para añadir nuevos controles.

### Calculadora Gestacional
- Ingresa la fecha de la última regla (FUR) y calcula automáticamente:
  - Semanas y días de gestación actuales.
  - Trimestre en curso con rango de semanas.
  - Fecha probable de parto (FPP).
  - Próximo control sugerido según protocolo MINSA.
- Botón **"Guardar en mi perfil"** para actualizar la FUR directamente en el perfil de la paciente.

### Mi Perfil
- Datos de la gestante: nombre, semanas de gestación, hospital y médico/obstetra tratante.
- Tarjeta resumen con conteo de controles registrados, citas pendientes y días hasta el parto.
- Información de FUR y FPP actualizada en tiempo real.
- **Edición de perfil**: hoja deslizable para actualizar nombre, FUR (con recalculo automático de semanas), hospital y doctor.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | Flutter (Dart) |
| Estado | Provider + ChangeNotifier |
| Base de datos local | sqflite (SQLite) |
| Tipografía | Google Fonts — Nunito + Quicksand |
| Navegación | IndexedStack con 4 tabs |

---

## Diseño

- Paleta: rosas (`pink50`–`pink500`), menta (`mint50`–`mint600`), coral para alertas, crema de fondo.
- Diseño accesible y cálido pensado para usuarias adolescentes.
- Todos los textos en español peruano con terminología del MINSA.

---

## Contexto

Desarrollado para la **Universidad Nacional de Ucayali (UNU)** como herramienta de apoyo al programa de salud materna en gestantes adolescentes de Pucallpa y comunidades de la región Ucayali.

---

## Licencia y autoría

© 2026 Ray Cardenas. Todos los derechos reservados.

MamiSalud es un proyecto original desarrollado por Ray Cardenas para la Universidad Nacional de Ucayali (UNU), Pucallpa, Perú. Queda prohibida su reproducción, distribución o modificación sin autorización expresa del autor.
