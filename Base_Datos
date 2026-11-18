## Table `registros_mvp`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `codigo_expediente` | `text` |  Nullable |
| `codigo_observacion` | `text` |  Nullable |
| `cliente_uuid` | `uuid` |  Unique |
| `propietario` | `uuid` |  |
| `fecha_creacion` | `timestamptz` |  |
| `origen` | `text` |  |
| `caso` | `text` |  |
| `formato` | `text` |  |
| `codigo_participante` | `text` |  |
| `codigo_evaluador_referencial` | `text` |  Nullable |
| `respuesta` | `text` |  |
| `evidencias` | `jsonb` |  |
| `archivos_metadatos` | `jsonb` |  |
| `detalle` | `jsonb` |  |
| `segundos_activos` | `int4` |  Nullable |
| `solicitudes_ayuda` | `int4` |  |
| `estado` | `text` |  |

## Table `evaluadores_mvp`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `usuario` | `uuid` | Primary |
| `codigo_evaluador` | `text` |  Unique |
| `creado_en` | `timestamptz` |  |

## Table `evaluaciones_mvp`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `registro_id` | `int8` |  Unique |
| `evaluador_usuario` | `uuid` |  |
| `puntuacion_hallazgo` | `int2` |  |
| `puntuacion_fundamento` | `int2` |  |
| `puntuacion_correccion` | `int2` |  |
| `puntuacion_evidencia` | `int2` |  |
| `sin_ayuda` | `bool` |  |
| `error_critico` | `bool` |  |
| `comentarios` | `text` |  |
| `fecha_evaluacion` | `timestamptz` |  |
| `evaluador_user_id` | `uuid` |  Nullable |
| `ayuda_sustantiva` | `bool` |  Nullable |

## RLS Policies

### `evaluaciones_mvp`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `evaluaciones_insert_evaluador` | INSERT | authenticated | PERMISSIVE | — | `(( SELECT es_evaluador_mvp() AS es_evaluador_mvp) AND (evaluador_usuario = ( SELECT auth.uid() AS uid)))` |
| `evaluaciones_select_evaluador` | SELECT | authenticated | PERMISSIVE | `( SELECT es_evaluador_mvp() AS es_evaluador_mvp)` | — |
| `evaluaciones_update_evaluador` | UPDATE | authenticated | PERMISSIVE | `( SELECT es_evaluador_mvp() AS es_evaluador_mvp)` | `(( SELECT es_evaluador_mvp() AS es_evaluador_mvp) AND (evaluador_usuario = ( SELECT auth.uid() AS uid)))` |
| `evaluadores actualizan evaluaciones` | UPDATE | authenticated | PERMISSIVE | `es_evaluador_mvp()` | `es_evaluador_mvp()` |
| `evaluadores crean evaluaciones` | INSERT | authenticated | PERMISSIVE | — | `(es_evaluador_mvp() AND (evaluador_user_id = auth.uid()))` |
| `evaluadores leen evaluaciones` | SELECT | authenticated | PERMISSIVE | `es_evaluador_mvp()` | — |

### `registros_mvp`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `registros_insert_propietario` | INSERT | authenticated | PERMISSIVE | — | `(propietario = ( SELECT auth.uid() AS uid))` |
| `registros_select_propietario_o_evaluador` | SELECT | authenticated | PERMISSIVE | `((propietario = ( SELECT auth.uid() AS uid)) OR ( SELECT es_evaluador_mvp() AS es_evaluador_mvp))` | — |

