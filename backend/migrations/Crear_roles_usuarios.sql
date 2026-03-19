CREATE TABLE IF NOT EXISTS roles (
  rol_id  SERIAL PRIMARY KEY,
  nombre  VARCHAR(50) UNIQUE NOT NULL
);
 
-- Roles del sistema
INSERT INTO roles (nombre) VALUES
  ('gerente'),
  ('admin'),
  ('coordinador'),
  ('instructor'),
  ('recepcion'),
  ('socio'),
  ('otro')
ON CONFLICT (nombre) DO NOTHING;
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