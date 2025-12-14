<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud Aceptada - {{ config('app.name') }}</title>
</head>

<body
    style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">

    <!-- Encabezado con gradiente verde (éxito) -->
    <div
        style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">¡Felicidades {{ $request->fullname }}!</h1>
        <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.95;">Tu solicitud ha sido <strong>aceptada</strong> por
            nuestro equipo administrativo</p>
    </div>

    <!-- Contenido principal -->
    <div
        style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">

        <!-- Mensaje de felicitación -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 64px; color: #10b981; margin-bottom: 15px;">✅</div>
            <h2 style="color: #065f46; font-size: 22px; margin-bottom: 10px;">¡Bienvenido a nuestra base de talentos!
            </h2>
            <p style="color: #4b5563; font-size: 16px;">
                Hemos revisado tu perfil profesional y estamos impresionados con tu experiencia y habilidades.
            </p>
        </div>

        <!-- Detalles de la solicitud -->
        <div
            style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 25px;">
            <h3 style="color: #065f46; margin-top: 0; font-size: 18px;">📋 Detalles de tu solicitud:</h3>
            <p><strong>ID de solicitud:</strong> #{{ $request->id }}</p>
            <p><strong>Fecha de aceptación:</strong> {{ now()->format('d/m/Y') }}</p>
            <p><strong>Nombre:</strong> {{ $request->fullname }}</p>
            <p><strong>Correo registrado:</strong> {{ $request->email }}</p>
            <p><strong>Teléfono:</strong> {{ $request->phone_number }}</p>
        </div>

        <!-- Proceso siguiente -->
        <div style="background: #eff6ff; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #1e40af; margin-top: 0; font-size: 18px;">📞 ¿Qué sigue ahora?</h3>
            <p style="margin-bottom: 15px;">
                Tu perfil ahora forma parte de nuestra base de datos de profesionales.
                <strong>Cuando una empresa esté interesada en tu perfil</strong>, te contactaremos directamente a través
                de:
            </p>

            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div>
                    <strong>Correo electrónico:</strong> {{ $request->email }}
                </div>
            </div>

            <div style="display: flex; align-items: center;">
                <div>
                    <strong>Teléfono:</strong> {{ $request->phone_number }}
                </div>
            </div>

        </div>


        <!-- Llamada a la acción -->
        <div style="text-align: center; padding: 20px; background: #eff6ff; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #1e40af; margin-top: 0;">¿Necesitas actualizar tu información?</h3>
            <p style="margin-bottom: 20px;">Si necesitas modificar algún dato de tu perfil, contáctanos respondiendo a
                este correo.</p>
            <a href="mailto:{{ config('mail.from.address') }}"
                style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; transition: all 0.3s;">
                ✉️ Contactar al equipo
            </a>
        </div>

        <!-- Información de contacto de la empresa -->
        <div
            style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin-bottom: 10px;">
                <strong>{{ config('app.name') }}</strong><br>
                Base de Talentos y Reclutamiento
            </p>
            <p style="margin: 0;">
                Este es un correo automático. Por favor, no respondas a este mensaje.<br>
                &copy; {{ date('Y') }} {{ config('app.name') }}. Todos los derechos reservados.
            </p>
        </div>
    </div>
</body>

</html>
