import React from 'react';
import { Landmark, ArrowLeft } from 'lucide-react';

const TermsAndConditions = ({ isDark, onBack }) => {
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
        <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '12px', borderRadius: '12px', display: 'flex' }}>
          <Landmark size={28} color="#fff" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', color: isDark ? '#fff' : '#0f172a' }}>Términos y Condiciones</h1>
          <p style={{ margin: 0, color: isDark ? '#94a3b8' : '#64748b' }}>Última actualización: Junio 2026</p>
        </div>
      </div>

      <p>
        Bienvenido a <strong>DCompras</strong>. Al utilizar nuestra aplicación, ya sea como comercio registrado o como cliente, usted acepta los siguientes términos y condiciones de uso.
      </p>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>1. Objeto del Servicio</h2>
        <p>
          DCompras proporciona un directorio digital y una herramienta de autogestión para comercios locales. El objetivo es facilitar la conexión entre los negocios y los consumidores de la zona mediante información actualizada y derivación directa a canales de comunicación como WhatsApp.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>2. Exención de Responsabilidad en Transacciones</h2>
        <p>
          <strong>DCompras no es una tienda online, no procesa pagos, ni interviene en las operaciones comerciales.</strong>
        </p>
        <ul>
          <li>Cualquier compra, reserva, transacción económica o intercambio de bienes y servicios se realiza de forma exclusiva y directa entre el Cliente y el Comercio.</li>
          <li>DCompras no asume responsabilidad alguna por la calidad de los productos, disputas comerciales, incumplimientos, estafas o demoras en la entrega.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>3. Responsabilidades de los Comercios</h2>
        <p>Los negocios que registran un perfil en nuestra plataforma se comprometen a:</p>
        <ul>
          <li>Proveer información veraz, actualizada y legal sobre su negocio.</li>
          <li>No publicar imágenes, productos o servicios que violen las leyes vigentes o los derechos de propiedad intelectual de terceros.</li>
          <li>Respetar la privacidad de los clientes que los contactan vía WhatsApp, comprometiéndose a <strong>no utilizar sus números para enviar Spam, publicidad no solicitada o cederlos a terceros</strong>.</li>
        </ul>
        <p>DCompras se reserva el derecho de suspender o eliminar sin previo aviso cualquier cuenta comercial que incumpla estas normas.</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>4. Responsabilidades de los Clientes</h2>
        <p>
          El cliente se compromete a hacer un uso responsable de la aplicación, interactuando con los comercios de buena fe, respetando los canales de comunicación y no realizando pedidos falsos.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>5. Disponibilidad del Servicio</h2>
        <p>
          DCompras hace su mejor esfuerzo por mantener la aplicación disponible y funcionando correctamente. Sin embargo, no garantizamos que el servicio sea ininterrumpido o libre de errores. Nos reservamos el derecho de modificar, pausar o dar de baja funciones de la plataforma en cualquier momento.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
