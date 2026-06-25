import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = ({ isDark, onBack }) => {
  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px 16px',
    color: isDark ? '#e2e8f0' : '#1e293b',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    lineHeight: '1.6'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
  };

  const sectionStyle = {
    marginBottom: '24px',
    background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
    padding: '20px',
    borderRadius: '12px',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}`
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: isDark ? '#fff' : '#0f172a',
    marginTop: 0,
    marginBottom: '12px'
  };

  return (
    <div style={containerStyle}>
      <button 
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'none', border: 'none', 
          color: isDark ? '#94a3b8' : '#64748b',
          cursor: 'pointer', padding: 0, marginBottom: '20px',
          fontSize: '0.9rem', fontWeight: 500
        }}>
        <ArrowLeft size={16} />
        Volver
      </button>

      <div style={headerStyle}>
        <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '12px', borderRadius: '12px', display: 'flex' }}>
          <ShieldCheck size={28} color="#fff" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', color: isDark ? '#fff' : '#0f172a' }}>Política de Privacidad</h1>
          <p style={{ margin: 0, color: isDark ? '#94a3b8' : '#64748b' }}>Última actualización: Junio 2026</p>
        </div>
      </div>

      <p>
        En <strong>DCompras</strong>, valoramos su privacidad y nos comprometemos a proteger sus datos personales en cumplimiento con la <strong>Ley de Protección de los Datos Personales N° 25.326</strong> de la República Argentina. Esta Política de Privacidad describe cómo recopilamos, usamos y compartimos su información.
      </p>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>1. Información que recopilamos</h2>
        <p><strong>De los Usuarios (Clientes) que navegan la app:</strong></p>
        <ul>
          <li><strong>Datos de Ubicación:</strong> Recopilamos su ubicación (GPS) únicamente con su consentimiento previo para mostrarle la distancia a los comercios o guiarlo hasta ellos mediante el mapa.</li>
          <li><strong>Información de Uso:</strong> Preferencias guardadas localmente en su dispositivo (LocalStorage) para mejorar la experiencia, así como suscripciones a notificaciones Web Push si decide activarlas.</li>
        </ul>
        <p><strong>De los Comercios (Usuarios Registrados):</strong></p>
        <ul>
          <li>Datos de identificación y contacto (correo electrónico, contraseña cifrada).</li>
          <li>Datos públicos del comercio (dirección, teléfonos, perfiles en redes sociales, fotografías y promociones).</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>2. Uso de la Información</h2>
        <p>Utilizamos la información recopilada para los siguientes fines:</p>
        <ul>
          <li>Brindar acceso al panel de control a los dueños de comercios.</li>
          <li>Enviar notificaciones sobre "Ofertas Flash" (solo si el cliente ha dado su consentimiento).</li>
          <li>Mostrar la información de los comercios en el directorio de la aplicación.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>3. Servicios de Terceros e Intermediarios</h2>
        <p>
          DCompras actúa como un directorio digital. <strong>No intermediamos en las ventas ni procesamos pagos.</strong> 
        </p>
        <ul>
          <li><strong>WhatsApp:</strong> Al hacer clic en el botón de contacto de un comercio, el usuario es redirigido a la aplicación WhatsApp. DCompras no tiene acceso, no monitorea ni almacena los mensajes, números de teléfono ni datos compartidos dentro de dicha plataforma de Meta.</li>
          <li><strong>Google Maps / Geolocalización:</strong> Las rutas y mapas son provistos por servicios de terceros. DCompras no guarda un historial de los movimientos o trayectos del usuario.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>4. Derechos ARCO de los Usuarios</h2>
        <p>
          De acuerdo a la Ley 25.326, usted tiene derecho de <strong>Acceso, Rectificación, Cancelación y Oposición</strong> sobre sus datos.
        </p>
        <ul>
          <li><strong>Comercios:</strong> Pueden rectificar o eliminar cualquier información pública o dar de baja su cuenta directamente desde su panel "Mi Comercio". En caso de eliminación, todos los datos vinculados se borrarán de nuestra base de datos.</li>
          <li><strong>Clientes:</strong> Pueden revocar los permisos de notificaciones push o de ubicación directamente desde los ajustes de su navegador web o dispositivo móvil. Puede solicitar el borrado de sus preferencias almacenadas limpiando el caché y datos de la PWA.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>5. Seguridad de los Datos</h2>
        <p>
          Los datos de registro de los comercios (contraseñas y correos) son almacenados y protegidos mediante la infraestructura de <strong>Supabase</strong>, cumpliendo con los estándares de seguridad de la industria.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>6. Contacto</h2>
        <p>
          Si tiene dudas o consultas sobre nuestra política de privacidad o desea ejercer sus derechos sobre sus datos personales, puede comunicarse con nosotros a través de nuestros canales oficiales de contacto dispuestos en la aplicación.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
