# Plan de Implementación: Notificaciones Push para Ofertas Flash

## Decisión de UX
**Opción Seleccionada:** Tarjeta integrada en el "Feed" (Opción 2).
**Contexto:** Se mostrará a los usuarios cuando naveguen específicamente a la sección de "Ofertas Flash".
**Objetivo:** Solicitar permiso para enviar notificaciones Push (Web Push API) de manera orgánica y no intrusiva.

## Diseño Propuesto (Soft Prompt)
- **Visual:** Tarjeta destacada en el feed de ofertas con diseño premium (sombras suaves, micro-animaciones, colores que combinen con la marca).
- **Texto sugerido:** *"Las mejores ofertas duran minutos. ¿Te avisamos cuando un comercio publique una Oferta Flash?"*
- **Botones:** 
  - `[ Sí, avísenme ]` (Dispara el prompt nativo del navegador para aceptar notificaciones).
  - `[ No me interesa ]` (Oculta la tarjeta y guarda la preferencia en `localStorage` para no volver a molestar por un tiempo prudencial).

## Checklist Técnico para la Implementación (Para el futuro)
1. **Generar VAPID Keys:** Claves de seguridad estándar necesarias para la comunicación del Web Push.
2. **Service Worker:** Implementar o actualizar el Service Worker (`sw.js`) de la PWA para escuchar los eventos `push` en segundo plano y mostrar la notificación del sistema operativo.
3. **Base de Datos (Supabase):** 
   - Crear una tabla `push_subscriptions` asociada al perfil del usuario (o sesión del dispositivo) para almacenar la información de suscripción que genera el navegador.
4. **Backend (Supabase Edge Functions / Triggers):**
   - Crear un evento automático en la base de datos que se dispare cuando un comercio publique una nueva Oferta Flash.
   - Esta función servidor leerá las suscripciones activas y emitirá el mensaje de notificación.
5. **Frontend (React):**
   - Maquetar el componente visual de la Tarjeta.
   - Implementar la lógica para solicitar el permiso usando la API nativa (`Notification.requestPermission()`).
   - Lógica para suscribir al usuario al `PushManager` del navegador y guardar esa suscripción en Supabase.
