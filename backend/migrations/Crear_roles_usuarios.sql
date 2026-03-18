CREATE TABLE IF NOT EXISTS roles (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(50) UNIQUE NOT NULL,
  descripcion VARCHAR(150)
);

INSERT INTO roles (nombre, descripcion) VALUES
  ('admin',    'Acceso total al sistema'),
  ('empleado', 'Gestión de actividades y socios'),
  ('socio',    'Acceso a su perfil y actividades');

CREATE TABLE IF NOT EXISTS usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  apellido      VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id       INT NOT NULL REFERENCES roles(id),
  estado        VARCHAR(20) DEFAULT 'activo',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);