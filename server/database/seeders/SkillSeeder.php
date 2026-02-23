<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = [
            // Habilidades técnicas generales de petróleo y gas
            ['name' => 'Gestión de operaciones petroleras'],
            ['name' => 'Control de procesos'],
            ['name' => 'Optimización de producción'],
            ['name' => 'Análisis de datos de yacimientos'],
            ['name' => 'Simulación de yacimientos'],
            ['name' => 'Geología de petróleo'],
            ['name' => 'Geofísica'],
            ['name' => 'Petrofísica'],

            // Perforación y Workover
            ['name' => 'Diseño de pozos'],
            ['name' => 'Programas de perforación'],
            ['name' => 'Control de pozos'],
            ['name' => 'Fluidos de perforación'],
            ['name' => 'Cementación de pozos'],
            ['name' => 'Operaciones de workover'],
            ['name' => 'Completación de pozos'],
            ['name' => 'Equipos de perforación'],

            // Ingeniería de producción
            ['name' => 'Diseño de sistemas de producción'],
            ['name' => 'Lift artificial'],
            ['name' => 'Análisis nodal'],
            ['name' => 'Tratamiento de fluidos'],
            ['name' => 'Separación de fases'],
            ['name' => 'Medición de producción'],
            ['name' => 'Estimulación de pozos'],

            // Ingeniería de facilidades
            ['name' => 'Diseño de plantas de proceso'],
            ['name' => 'Ingeniería de piping'],
            ['name' => 'Diseño de recipientes a presión'],
            ['name' => 'Sistemas de tuberías'],
            ['name' => 'Layout de plantas'],
            ['name' => 'Balance de materia y energía'],

            // Mantenimiento
            ['name' => 'Mantenimiento predictivo'],
            ['name' => 'Mantenimiento preventivo'],
            ['name' => 'Análisis de vibraciones'],
            ['name' => 'Termografía'],
            ['name' => 'Gestión de lubricantes'],
            ['name' => 'Reparación de bombas'],
            ['name' => 'Mantenimiento de compresores'],
            ['name' => 'Sistemas hidráulicos'],
            ['name' => 'Electricidad industrial'],
            ['name' => 'Subestaciones eléctricas'],
            ['name' => 'Motores eléctricos'],
            ['name' => 'Sistemas de protección'],
            ['name' => 'PLC (Controladores Lógicos Programables)'],
            ['name' => 'DCS (Sistemas de Control Distribuido)'],
            ['name' => 'Instrumentación industrial'],
            ['name' => 'Calibración de instrumentos'],
            ['name' => 'Sensores y transmisores'],

            // HSE
            ['name' => 'Gestión HSE'],
            ['name' => 'Análisis de riesgos'],
            ['name' => 'Permisos de trabajo'],
            ['name' => 'Investigación de incidentes'],
            ['name' => 'Procedimientos de emergencia'],
            ['name' => 'Gestión de residuos'],
            ['name' => 'Control de emisiones'],
            ['name' => 'ERGONOMÍA'],

            // Logística y transporte
            ['name' => 'Gestión de cadena de suministro'],
            ['name' => 'Transporte de materiales peligrosos'],
            ['name' => 'Logística offshore'],
            ['name' => 'Gestión de almacenes'],
            ['name' => 'Planificación de rutas'],
            ['name' => 'Certificación de materiales'],

            // Oleoductos y gasoductos
            ['name' => 'Diseño de pipelines'],
            ['name' => 'Integridad de ductos'],
            ['name' => 'Inspección de pipelines'],
            ['name' => 'Corrosión y protección catódica'],
            ['name' => 'Pruebas hidrostáticas'],
            ['name' => 'Detección de fugas'],

            // Refinación
            ['name' => 'Procesos de refinación'],
            ['name' => 'Operación de unidades de proceso'],
            ['name' => 'Craqueo catalítico'],
            ['name' => 'Reformación catalítica'],
            ['name' => 'Tratamiento de crudo'],
            ['name' => 'Control de calidad de productos'],

            // Construcción industrial
            ['name' => 'Lectura de planos'],
            ['name' => 'Soldadura industrial'],
            ['name' => 'Montaje de equipos'],
            ['name' => 'Pruebas de presión'],
            ['name' => 'Gestión de proyectos de construcción'],
            ['name' => 'Inspección de soldaduras'],

            // Servicios especializados
            ['name' => 'Wireline services'],
            ['name' => 'Coiled tubing'],
            ['name' => 'Fishing tools'],
            ['name' => 'Cementing services'],
            ['name' => 'Mud logging'],

            // Laboratorio
            ['name' => 'Análisis de crudo'],
            ['name' => 'Pruebas de fluidos'],
            ['name' => 'Cromatografía'],
            ['name' => 'Control de calidad de agua'],
            ['name' => 'Análisis de gases'],
            ['name' => 'Metrología'],

            // TIC/Sistemas
            ['name' => 'SCADA'],
            ['name' => 'Sistemas de monitoreo'],
            ['name' => 'Gestión de bases de datos'],
            ['name' => 'Sistemas de información geográfica (GIS)'],
            ['name' => 'Desarrollo de software industrial'],
            ['name' => 'Ciberseguridad industrial'],
            ['name' => 'Redes industriales'],

            // Administración y soporte
            ['name' => 'Gestión de contratos'],
            ['name' => 'Elaboración de presupuestos'],
            ['name' => 'Control de costos'],
            ['name' => 'Planificación de proyectos'],
            ['name' => 'Gestión documental'],
            ['name' => 'Procedimientos operativos'],
            ['name' => 'Reportes técnicos'],

            // Energía y servicios auxiliares
            ['name' => 'Generación de energía'],
            ['name' => 'Sistemas de vapor'],
            ['name' => 'Sistemas de refrigeración'],
            ['name' => 'Tratamiento de agua'],
            ['name' => 'Gestión de utilities'],
            ['name' => 'Eficiencia energética'],

            // Relaciones comunitarias y RRHH
            ['name' => 'Relaciones comunitarias'],
            ['name' => 'Gestión social'],
            ['name' => 'Comunicación corporativa'],
            ['name' => 'Desarrollo sostenible'],
            ['name' => 'Responsabilidad social'],
            ['name' => 'Gestión de talento'],
            ['name' => 'Capacitación técnica'],
            ['name' => 'Selección de personal'],

            // Habilidades transversales
            ['name' => 'Inglés técnico'],
            ['name' => 'Interpretación de planos'],
            ['name' => 'AutoCAD'],
            ['name' => 'Microstation'],
            ['name' => 'Office avanzado'],
            ['name' => 'SAP'],
            ['name' => 'Maximo'],
            ['name' => 'Liderazgo técnico'],
            ['name' => 'Trabajo en equipo'],
            ['name' => 'Resolución de problemas'],
            ['name' => 'Análisis crítico'],
            ['name' => 'Comunicación efectiva'],
            ['name' => 'Gestión del tiempo'],

            // Habilidades específicas de alto valor
            ['name' => 'Simulación de procesos (HYSYS)'],
            ['name' => 'Diseño 3D (PDMS/PDS)'],
            ['name' => 'Análisis de estrés (CAESAR II)'],
            ['name' => 'Gestión de activos'],
            ['name' => 'Confiabilidad operacional'],
            ['name' => 'RCM (Mantenimiento Centrado en Confiabilidad)'],
            ['name' => 'Six Sigma'],
            ['name' => 'Lean manufacturing'],

            // Normativas y estándares
            ['name' => 'Normas API'],
            ['name' => 'Normas ASME'],
            ['name' => 'Normas ANSI'],
            ['name' => 'ISO 9001'],
            ['name' => 'ISO 14001'],
            ['name' => 'ISO 45001'],
            ['name' => 'Procedimientos OSHA'],

            // Habilidades de emergencia
            ['name' => 'Primeros auxilios'],
            ['name' => 'Respuesta a emergencias'],
            ['name' => 'Combate de incendios'],
            ['name' => 'Rescate en espacios confinados'],
            ['name' => 'Respuesta a derrames'],

            // Software especializado
            ['name' => 'Petrel'],
            ['name' => 'Eclipse'],
            ['name' => 'OLGA'],
            ['name' => 'PIPESIM'],
            ['name' => 'PVTSim'],
            ['name' => 'AutoPIPE'],

            // Tecnologías emergentes
            ['name' => 'Digital Oil Field'],
            ['name' => 'IoT Industrial'],
            ['name' => 'Analítica predictiva'],
            ['name' => 'Realidad aumentada para mantenimiento'],
            ['name' => 'Drones para inspección'],
            ['name' => 'Robótica en operaciones'],

            // Habilidades técnicas para Energía Eléctrica
            ['name' => 'Análisis de sistemas eléctricos de potencia'],
            ['name' => 'Diseño de redes de distribución'],
            ['name' => 'Cálculo de cortocircuito'],
            ['name' => 'Coordinación de protecciones eléctricas'],
            ['name' => 'Estudios de flujo de carga'],
            ['name' => 'Análisis de estabilidad transitoria'],
            ['name' => 'Operación de centrales hidroeléctricas'],
            ['name' => 'Operación de centrales termoeléctricas'],
            ['name' => 'Operación de centrales eólicas'],
            ['name' => 'Operación de parques solares fotovoltaicos'],
            ['name' => 'Mantenimiento de transformadores de potencia'],
            ['name' => 'Mantenimiento de interruptores de alta tensión'],
            ['name' => 'Diagnóstico de fallas en redes eléctricas'],
            ['name' => 'Programación de sistemas SCADA'],
            ['name' => 'Automatización de subestaciones'],
            ['name' => 'Normativa eléctrica (IEC, IEEE, NOM)'],
            ['name' => 'Gestión de calidad de energía'],
            ['name' => 'Análisis de armónicas'],
            ['name' => 'Compensación de energía reactiva'],
            ['name' => 'Protección contra sobretensiones'],
            ['name' => 'Sistemas de puesta a tierra'],
            ['name' => 'Coordinación de aislamiento'],
            ['name' => 'Eficiencia energética industrial'],
            ['name' => 'Auditorías energéticas'],
            ['name' => 'Gestión de demanda eléctrica'],
            ['name' => 'Integración de energías renovables a la red'],
            ['name' => 'Sistemas de almacenamiento de energía (BESS)'],
            ['name' => 'Microrredes eléctricas'],
            ['name' => 'Smart Grids / Redes inteligentes'],
            ['name' => 'Medición inteligente (AMI)'],
            ['name' => 'Telemedición y telegestión'],
            ['name' => 'Análisis de confiabilidad de sistemas eléctricos'],
            ['name' => 'Mantenimiento predictivo en subestaciones'],
            ['name' => 'Termografía eléctrica'],
            ['name' => 'Análisis de aceite dieléctrico'],
            ['name' => 'Pruebas de equipos eléctricos de potencia'],
            ['name' => 'Comercialización de energía en mercado mayorista'],
            ['name' => 'Gestión de contratos de suministro eléctrico'],
            ['name' => 'Regulación del sector eléctrico'],
            ['name' => 'Valoración de activos eléctricos'],
            ['name' => 'Gestión de riesgos eléctricos'],
            ['name' => 'Estudios de impacto ambiental para proyectos eléctricos'],
            ['name' => 'Diseño de líneas de transmisión'],
            ['name' => 'Tendido de cables subterráneos'],
            ['name' => 'Montaje de subestaciones eléctricas'],
            ['name' => 'Manejo de software especializado (DIgSILENT, ETAP, SKM, PowerFactory)'],
            ['name' => 'Dibujo de planos eléctricos (AutoCAD Electrical)'],
            ['name' => 'Modelado BIM para proyectos eléctricos'],
            ['name' => 'Supervisión de obras eléctricas'],
            ['name' => 'Coordinación de trabajos en tensión'],
            ['name' => 'Seguridad en trabajos eléctricos (NFPA 70E)'],
            ['name' => 'Procedimientos de bloqueo y etiquetado (LOTO)'],
            ['name' => 'Gestión de permisos de trabajo en instalaciones eléctricas'],


        ];

        Skill::insert($skills);
    }
}
