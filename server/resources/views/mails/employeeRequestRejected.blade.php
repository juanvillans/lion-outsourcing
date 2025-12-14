<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud No Aprobada - {{ config('app.name') }}</title>
</head>

<body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

    <div style="background: #ef4444; color: white; padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Actualización de Solicitud</h1>
        <p style="margin: 10px 0 0; font-size: 16px;">Estimado/a {{ $request->fullname }}</p>
    </div>

    <div
        style="background: white; padding: 25px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">

        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; color: #ef4444;">❌</div>
            <h2 style="color: #7f1d1d;">Solicitud No Aprobada</h2>
        </div>

        <p>Después de una cuidadosa revisión, lamentamos informarte que <strong>tu solicitud no ha sido
                aprobada</strong> por nuestro equipo de selección.</p>

        <div style="background: #fef2f2; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="color: #7f1d1d; margin-top: 0;">📋 Detalles:</h3>
            <p><strong>Solicitud #:</strong> {{ $request->id }}</p>
            <p><strong>Nombre:</strong> {{ $request->fullname }}</p>
            <p><strong>Fecha:</strong> {{ now()->format('d/m/Y') }}</p>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">ℹ️ Información</h3>
            <p>Esta decisión se basa en nuestra evaluación de los requisitos específicos para las posiciones disponibles
                actualmente.</p>
            <p><em>Te animamos a aplicar nuevamente en el futuro si tu perfil profesional evoluciona.</em></p>
        </div>

        <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 8px;">
            <p style="margin-bottom: 15px;">¿Deseas más información sobre esta decisión?</p>
            <a href="mailto:{{ config('mail.from.address') }}"
                style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Contactar al equipo
            </a>
        </div>

        <div
            style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
            <p style="margin: 0;">
                &copy; {{ date('Y') }} {{ config('app.name') }} - Equipo de Selección
            </p>
        </div>
    </div>
</body>

</html>
