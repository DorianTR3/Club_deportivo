
-- Tipos ENUM
DO $$ BEGIN
  CREATE TYPE genero_enum      AS ENUM ('Hombre', 'Mujer', 'Otro');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE tipo_socio_enum  AS ENUM ('accionista', 'rentista');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE modalidad_enum   AS ENUM ('individual', 'familiar');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE estado_socio_enum AS ENUM ('activo', 'suspendido', 'baja');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS socios (
  socio_id          SERIAL PRIMARY KEY,
  usuario_id        INT              REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
  numero_socio      VARCHAR(10)      UNIQUE,
  curp              VARCHAR(18)      UNIQUE NOT NULL,
  nombre            VARCHAR(100),
  apellido          VARCHAR(100),
  fecha_nacimiento  DATE,
  genero            genero_enum,
  tipo_socio        tipo_socio_enum,
  modalidad         modalidad_enum,
  accion_familiar_id INT             NULL,
  estado            estado_socio_enum DEFAULT 'activo',
  telefono          VARCHAR(15),
  email_contacto    VARCHAR(150),
  direccion         TEXT,
  nombre_emergencia VARCHAR(100),
  tel_emergencia    VARCHAR(15),
  created_at        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_socios_curp         ON socios(curp);
CREATE INDEX IF NOT EXISTS idx_socios_numero_socio ON socios(numero_socio);
CREATE INDEX IF NOT EXISTS idx_socios_nombre       ON socios(nombre);