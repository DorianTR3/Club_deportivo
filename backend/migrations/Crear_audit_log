
CREATE TABLE IF NOT EXISTS audit_logs (
  log_id        SERIAL PRIMARY KEY,
  usuario_id    INT           REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
  entidad       VARCHAR(50)   NOT NULL,
  entidad_id    INT,
  tipo_evento   VARCHAR(50)   NOT NULL,
  datos_antes   JSONB         NULL,
  datos_despues JSONB         NULL,
  ip            VARCHAR(45),
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Índice compuesto para búsquedas rápidas por entidad
CREATE INDEX IF NOT EXISTS idx_audit_entidad ON audit_logs(entidad, entidad_id);

-- Índice adicional por usuario para historial de acciones
CREATE INDEX IF NOT EXISTS idx_audit_usuario ON audit_logs(usuario_id);