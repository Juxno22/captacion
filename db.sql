CREATE DATABASE IF NOT EXISTS clientesExpo
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

use clientesExpo;

CREATE TABLE IF NOT EXISTS trabajadores (
    idTrabajador INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(40) NOT NULL,
    apPaterno VARCHAR(40) NOT NULL,
    apMaterno VARCHAR(40) NOT NULL,
    codigoEmpleado VARCHAR(10) UNIQUE NOT NULL,
    activo TINYINT DEFAULT 1
);

INSERT INTO trabajadores VALUE ('Juan Carlos', 'Carrera', 'Cristino', 'JCCC221002');

CREATE TABLE IF NOT EXISTS prospectos (
    idProspecto INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombreProspecto VARCHAR(100) NOT NULL,
    idTrabajador INT NOT NULL,
    codigoEmpleadoUsado VARCHAR(10) NOT NULL,
    origen VARCHAR(60) NOT NULL,
    giro VARCHAR(60) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(40),
    razonSocial VARCHAR(60),
    tipoPersona VARCHAR(30),
    aniosEmpresa INT,
    aniosExperiencia INT,
    sucursales INT,
    acompaniantes INT,
    proveedores TEXT,
    metodoCompra VARCHAR(20),
    diasPlazo INT,
    sistemas TEXT,
    especializacion VARCHAR(80) NOT NULL,
    potencial VARCHAR(40),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idTrabajador) REFERENCES trabajadores(idTrabajador)
);