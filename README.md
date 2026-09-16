# Inscripciones

App sencilla de inscripción de personas (con invitados) que envía por correo
los métodos de pago disponibles (Bizum y PayPal) tras registrarse.

## Configuración

1. Copia `.env.example` a `.env` y rellena:
   - `RESEND_API_KEY`: API key de [Resend](https://resend.com) para enviar los correos.
   - `EMAIL_FROM`: remitente del correo (debe ser de un dominio verificado en Resend).
   - `BIZUM_NUMERO`: número de teléfono para recibir Bizum.
   - `PAYPAL_LINK`: enlace de pago de PayPal (p. ej. `https://paypal.me/tu-usuario`).
   - `ADMIN_PASSWORD`: contraseña para acceder al panel `/admin`.

2. Instala dependencias y prepara la base de datos:

   ```bash
   npm install
   npx prisma db push
   ```

3. Arranca en desarrollo:

   ```bash
   npm run dev
   ```

## Uso

- `/` — formulario público de inscripción (datos personales + invitados opcionales).
- `/admin` — panel protegido por contraseña con listado de inscripciones y
  exportación a CSV (incluye invitados).

Al enviar el formulario se guarda en la base de datos (SQLite por defecto) y
se envía un correo automático al inscrito con las instrucciones de pago
(Bizum y enlace de PayPal). Si `RESEND_API_KEY` no está configurada, el envío
se omite mostrando un aviso en consola, pero la inscripción se guarda igual.
