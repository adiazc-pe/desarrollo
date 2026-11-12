# MVP GORE Ayacucho v6: identificadores dinámicos y persistencia en Supabase

## Qué se implementó

- El registro de un ejercicio finalizado invoca `auth.signInAnonymously()` si no existe sesión previa.
- Envía un `POST` a `public.registros_mvp` por la API REST de Supabase, usando el SDK oficial (`.insert(...).select(...)`).
- PostgreSQL asigna un `id` secuencial que produce `EXP-DEMO-000001` y `OBS-DEMO-000001` (el valor real depende de la base de datos).
- Guarda caso A/B, formato, códigos de participante y evaluador referencial, texto de la corrección, evidencias didácticas y metadatos de archivos seleccionados. **No envía los archivos reales**.
- Recupera el identificador existente si una petición se confirmó en la base de datos pero la respuesta se perdió y se reintenta con el mismo UUID.
- El botón de registro solo confirma éxito cuando el servidor responde. Si no hay conexión, muestra error y conserva el formulario para reintentar.
- `Registros en la nube` muestra hasta 100 registros a evaluadores autenticados y autorizados; la visibilidad se controla con RLS.

## Activación

1. En Supabase abre el proyecto correcto y ejecuta `SGD_GORE_MVP_BBDD.sql` en **SQL Editor**, **solo si aún no se ejecutó**. Este script inicial no es una migración repetible: si las tablas ya existen, **no vuelvas a correr todo sin revisar las políticas**.
2. En **Authentication → Providers** activa **Anonymous Sign-ins** para participantes de práctica.
3. Crea una cuenta de evaluador en **Authentication → Users** y agrega su `auth.users.id` a la tabla `public.evaluadores_mvp` (ejemplo al final del script SQL, adaptar al correo verdadero).
4. En **Project Settings / API Keys**, copia únicamente **Project URL** y la clave pública **publishable** o clave heredada **anon**. Jamás la `service_role` o una clave secreta.
5. Abre `SGD_GORE_MVP_v6.html` en un editor de texto y reemplaza:

```javascript
const SUPABASE_URL='PEGAR_URL_SUPABASE';
const SUPABASE_PUBLIC_KEY='PEGAR_CLAVE_PUBLICA_SUPABASE';
```

6. Sube el archivo a tu repositorio público `adiazc-pe/desarrollo`, como nueva versión. GitHub Pages sirve el frontend; Supabase almacena los datos.
7. Abre el HTML desde GitHub Pages por **HTTPS** con conexión a Internet. En **Inicio de caso** llena los códigos, la observación, la corrección, las evidencias y la verificación; pulsa **Registrar ejercicio**.
8. Al finalizar, confirma que aparece **Guardado en Supabase** junto a los dos IDs nuevos. En SQL Editor ejecuta `SGD_GORE_MVP_v6_VERIFICACION.sql` para localizar el registro.
9. Desde **Registros en la nube**, inicia sesión con una cuenta evaluadora autorizada y consulta los datos registrados.

## Por qué el número aparece al finalizar

La base de datos reserva el identificador cuando se hace el registro efectivo. Abrir un formulario o abandonar un caso no debe crear registros vacíos. El siguiente ejercicio genera otro identificador. En Supabase se usan columnas generadas a partir del ID secuencial, evitando que dos navegadores produzcan el mismo correlativo.

## Seguridad y limitaciones

- No se necesita crear una API propia para la primera versión: el SDK Supabase invoca la API REST, con sesión anónima y políticas RLS.
- `P01` y `E01` son etiquetas para la práctica; **no son contraseñas** ni habilitan por sí mismos acceso a los datos.
- El HTML expuesto en GitHub debe incluir solo la **clave pública**; todas las autorizaciones se aplican en el servidor de Supabase mediante RLS.
- La versión actual no incluye una interfaz para eliminar registros tras el retiro del consentimiento ni un sistema de carga segura de documentos. No ingreses información real, personal o reservada.
- Si alguien inicia sesión como evaluador en el mismo navegador, el registro posterior puede quedar bajo esa identidad. Para pruebas con participantes, usa ventana/sesión separada del navegador.
- La numeración DEMO es **independiente del SGD oficial**. Se asigna un expediente DEMO por ejercicio; para múltiples observaciones asociadas a un único expediente real habría que normalizar la base de datos.
- Revisa la seguridad RLS, límites de acceso, CAPTCHA/antiabuso y retención de registros antes de abrir una convocatoria pública.

## Prueba de aceptación

1. Guarda el caso A y anota los dos códigos mostrados.
2. En SQL verifica que existe exactamente un registro con esos códigos y los datos ingresados.
3. Usa **Atender otra observación**; comprueba que los campos están vacíos.
4. Guarda el caso B y verifica que se generaron **otros dos códigos**.
5. Inicia sesión como evaluador; ambas filas deben aparecer en **Registros en la nube**.
6. Cierra sesión; otro participante no debe poder consultar el listado de todos los registros.
7. Interrumpe la conexión antes de guardar: se debe mostrar un error, no una confirmación falsa.

## Estado

**El HTML y SQL se prepararon en esta conversación.** No se aplicaron migraciones ni se probó una inserción contra tu proyecto Supabase porque no hay una conexión autorizada a ese proyecto aquí.
