# Configuración de base de datos – MVP SGD GORE Ayacucho

**Alcance:** prototipo académico, no conectado al SGD oficial. Los IDs `EXP-DEMO-*` y `OBS-DEMO-*` pertenecen únicamente al MVP.

## Archivos del paquete

- `SGD_GORE_MVP_BBDD.sql`: crea las tablas, IDs automáticos y políticas de acceso.
- `SGD_GORE_MVP_v4_BBDD.html`: conserva la subsanación guiada y el laboratorio HS01 (primer formato continuo, segundo estructurado; caso A/B sorteado). Incorpora conexión y consulta de registros.

## Pasos de implementación

1. Crear un proyecto en https://supabase.com/dashboard. No se ha creado ningún proyecto desde esta conversación.
2. Abrir **SQL Editor**, pegar `SGD_GORE_MVP_BBDD.sql` y ejecutar. Verificar que existan las tablas `registros_mvp`, `evaluadores_mvp` y `evaluaciones_mvp`.
3. En **Authentication → Providers → Anonymous**, habilitar **anonymous sign-ins**. Sin esta opción, el navegador no puede guardar registros con el flujo actual. Configurar protección antiabuso/CAPTCHA si la publicación será pública y las pruebas no estarán restringidas.
4. En Supabase, copiar la **Project URL** y la **publishable key** (o la clave pública heredada `anon`, según el proyecto). Nunca copiar `service_role` ni claves privadas.
5. En el HTML, reemplazar estas dos líneas:

   ```javascript
   const SUPABASE_URL='PEGAR_URL_SUPABASE';
   const SUPABASE_PUBLIC_KEY='PEGAR_CLAVE_PUBLICA_SUPABASE';
   ```

6. Publicar el HTML actualizado en GitHub Pages. Supabase se consume por HTTPS mediante JavaScript. No hay que alojar PHP ni crear un servidor propio para la primera integración.
7. Abrir el MVP, utilizar un **código de participante** y completar el recorrido; en «Registro de demostración completado» verificar que aparezca **Guardado en Supabase** y que se asignaron `EXP-DEMO-000001` y `OBS-DEMO-000001` (son ejemplos: los números reales dependerán de la base de datos).
8. Abrir **Table Editor → registros_mvp** en Supabase para comprobar el registro.

## Habilitar el panel de evaluadores

1. Crear una cuenta con correo y contraseña en **Authentication → Users** (o mediante el flujo autorizado por la institución).
2. En SQL Editor, con un usuario administrador, ejecutar sustituyendo el correo real y el código de evaluador:

   ```sql
   insert into public.evaluadores_mvp(usuario, codigo_evaluador)
   select id, 'E01' from auth.users
   where email = 'evaluador@ejemplo.com';
   ```

3. Abrir **Registros** dentro del HTML; iniciar sesión con el correo y contraseña del evaluador; seleccionar «Actualizar registros».
4. Solo los evaluadores habilitados en `evaluadores_mvp` pueden ver la lista completa. Los participantes anónimos solo pueden leer sus propios registros mediante las políticas RLS. `P01` y `E01` son etiquetas académicas, no contraseñas.

## Qué registra

- Código correlativo de expediente de demostración y de observación, creados por PostgreSQL.
- Fecha, caso A/B, formato continuo/estructurado, código del participante, evaluador referencial.
- Respuesta redactada; referencias a evidencias de muestra; metadatos de archivos locales (nombre y tamaño, **no contenido**).
- Para HS01, las cuatro respuestas y métricas de tiempo y solicitudes de ayuda.
- El almacenamiento no constituye aprobación técnica de una subsanación.

## Consideraciones importantes

- Cada registro creado asigna un **nuevo identificador de expediente de demostración y observación**. Esta estructura simplificada es apropiada para registrar ejercicios independientes. Si un expediente oficial debe contener múltiples observaciones, deberá evolucionar a un diseño relacional `expedientes → observaciones → respuestas` antes del despliegue institucional.
- Sin configurar Supabase, la pantalla muestra que el registro **solo existe localmente** y permite descargar JSON. No afirma que se haya guardado en la nube.
- Los IDs pueden tener saltos por transacciones canceladas; PostgreSQL asegura unicidad, no continuidad matemática sin huecos.
- Se necesita una conexión a internet para Supabase y para cargar la librería JS desde CDN.
- Configurar políticas de retención, eliminación de registros ante retiro del consentimiento, soporte y auditoría antes de pasar de piloto académico a un uso real. La versión actual no incluye un flujo completo de eliminación de copias exportadas.
- **Advertencia metodológica HS01:** el orden fijo continuo→estructurado puede favorecer el segundo formato por aprendizaje. El caso A/B se sortea, pero eso no elimina el sesgo de orden.
- Antes de usarlo en pruebas reales, revisar el esquema y las políticas RLS con un responsable de seguridad y privacidad.

## ¿Qué falta para que funcione en tu nube?

El SQL no está aplicado en ningún proyecto Supabase, y las dos constantes URL/clave siguen como marcadores. No se ha conectado a tu cuenta ni desplegado al repositorio GitHub. Tras la configuración descrita, pueden comprobarse las inserciones reales y su lectura controlada.
