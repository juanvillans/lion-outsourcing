<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a {{ config('app.name') }} API</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
        }

        .container {
            text-align: center;
            background: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 600px;
        }

        h1 {
            color: #1a73e8;
            font-size: 2.5em;
            margin-bottom: 20px;
        }

        p {
            font-size: 1.2em;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        a {
            color: #1a73e8;
            text-decoration: none;
            font-weight: bold;
        }

        a:hover {
            text-decoration: underline;
        }

        .footer {
            margin-top: 30px;
            font-size: 0.9em;
            color: #777;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>¡Bienvenido a la API de {{ config('app.name') }}!</h1>
        <p>
            Estamos emocionados de tenerte aquí. Nuestra API te permite interactuar con las funcionalidades de
            {{ config('app.name') }} de manera sencilla y eficiente. Explora nuestra documentación para comenzar a
            integrar y aprovechar al máximo todas las posibilidades.
        </p>
        <p>
            Punto de acceso principal: <a href="{{ config('app.api_url') }}">{{ config('app.api_url') }}</a>
        </p>
        <p>
            ¿Listo para empezar? Visita nuestra <a href="{{ config('app.api_url') }}/docs">documentación oficial</a>
            para obtener más detalles sobre los endpoints, autenticación y ejemplos de uso.
        </p>
        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. Todos los derechos reservados.
        </div>
    </div>
</body>

</html>
