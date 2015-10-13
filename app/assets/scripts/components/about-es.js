'use strict';
var React = require('react/addons');
var Router = require('react-router');

var About = module.exports = React.createClass({
  render: function() {
    return (
      <article className="page single about">
        <header className="page-header">
          <div className="inner">
            <div className="page-headline">
              <h1 className="page-title">Acerca de</h1>
            </div>
          </div>
        </header>
        <div className="page-body">
          <div className="inner">
            <div className="prose">
              <h2>El proyecto</h2>
              <p>Este tablero ofrece un análisis de datos públicos de contratación del Gobierno de México.
                 El proyecto ha sido patrocinado por el Banco Mundial y diseñado por Development Seed.</p>
              <p>Los tableros hacen uso de datos públicos de Compranet, el sitio central del Gobierno de México para contratos y licitaciones.
                 Estos datos son evaluados bajo una metodología para evaluar resultados en contrataciones públicas.</p>
              <p>La metodología toma en consideración cinco dimensiones de desempeño en contrataciones públicas:</p>
              <ol>
                <li>Puntualidad</li>
                <li>Eficiencia en costos</li>
                <li>Equidad</li>
                <li>Calidad</li>
                <li>Transparencia</li>
              </ol>
              <p>Las primeras tres de estas dimensiones son analizadas en este portal; las otras dos podrán ser evaluadas cuando estén disponibles más datos.</p>
              <p>También es posible seccionar los datos por <strong>tamaño del proveedor</strong> o el <strong>procedimiento de contratación</strong>.</p>
              <h2>Fuentes de datos</h2>
              <p><strong><a href="https://compranet.funcionpublica.gob.mx/">Compranet</a></strong> es la fuente principal de datos que alimenta estos tableros.</p>
              <h2>Licencia de uso</h2>
              <p>La base de código de la aplicación se hace disponible al dominio público utilizando los términos <a href="https://github.com/procurement-analytics/procurement-analytics/blob/develop/UNLICENSE">Unlicense</a>.</p>
              <p>Utiliza libremente las visualizaciones y datos para crear nuevos proyectos o reutilizarlo para otro fin sin restricción alguna.
                 Sin embargo ¡apreciamos cualquier referencia de vuelta cuando sea posible!</p>
            </div>
          </div>
        </div>
        <footer className="page-footer">
          <div className="inner">
            <ul className="credits-list">
              <li className="wbg-logo-wrapper"><a href="http://www.worldbank.org/" title="Visita El Banco Mundial"><img alt="Logo del Banco Mundial" src="assets/graphics/layout/wbg-logo-pos.svg" width="160" height="32" /><span>El Banco Mundial</span></a></li>
              <li className="ds-logo-wrapper"><a href="https://developmentseed.org/" title="Visita Development Seed"><img alt="Logo de Development Seed" src="assets/graphics/layout/ds-logo-pos.svg" width="188" height="32" /><span>Development Seed</span></a></li>
            </ul>
          </div>
        </footer>
      </article>
    );
  }
});
