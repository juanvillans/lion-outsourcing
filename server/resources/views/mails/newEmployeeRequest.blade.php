<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Solicitud de Empleado</title>
</head>

<body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

    <div
        style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Nueva Solicitud de Empleado</h1>
        <p style="margin: 5px 0 0; opacity: 0.9;">ID: #{{ $request->id }} • {{ $request->created_at->format('d/m/Y') }}
        </p>
    </div>

    <div
        style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">

        <h2 style="color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            👤 {{ $request->fullname }}
        </h2>

        <p><strong>📧 Email:</strong> {{ $request->email }}</p>
        <p><strong>📞 Teléfono:</strong> {{ $request->phone_number }}</p>
        <p><strong>📍 Ubicación:</strong> {{ $request->localization }}</p>

        <h3 style="color: #1f2937; margin-top: 25px;">📋 Detalles Profesionales</h3>
        <p><strong>🏢 Industria:</strong> {{ $request->industry->name ?? 'No especificada' }}</p>
        <p><strong>📊 Área:</strong> {{ $request->area->name ?? 'No especificada' }}</p>

        @if ($request->profession)
            <p><strong>💼 Profesión:</strong> {{ $request->profession }}</p>
        @endif



        <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 8px;">
            <a href="{{ config('app.url') . '/admin/employee-requests/' . $request->id }}"
                style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                👁️ Ver Solicitud Completa
            </a>
        </div>

        <div
            style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">
                &copy; {{ date('Y') }} {{ config('app.name') }}.
                <a href="{{ config('app.url') . '/admin/employee_requests' }}" style="color: #2563eb;">Ver todas las
                    solicitudes</a>
            </p>
        </div>
    </div>
</body>

</html>
