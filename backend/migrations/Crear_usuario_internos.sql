
-- Tipo ENUM para sexo
DO $$ BEGIN
  CREATE TYPE sexo_enum AS ENUM ('Hombre', 'Mujer', 'Otro');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS usuariosInternos (
  usuario_id  SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  curp        VARCHAR(18)  NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  contrasena  VARCHAR(255) NOT NULL,
  rol_empresa INT          NOT NULL REFERENCES roles(rol_id),
  fecha_nac   DATE         NOT NULL,
  sexo        sexo_enum    NOT NULL,
  direccion   VARCHAR(200) NOT NULL,
  activo      SMALLINT     DEFAULT 1,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);