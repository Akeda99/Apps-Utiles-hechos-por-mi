class Cita {
  final int? id;
  final int gestanteId;
  final String fecha;
  final String hora;
  final String tipo;
  final String? hospital;
  final String? doctor;
  final String? notas;
  final int recordatorioDias;
  final bool notificacionProgramada;
  final String createdAt;

  const Cita({
    this.id,
    required this.gestanteId,
    required this.fecha,
    required this.hora,
    required this.tipo,
    this.hospital,
    this.doctor,
    this.notas,
    this.recordatorioDias = 1,
    this.notificacionProgramada = false,
    required this.createdAt,
  });

  DateTime get fechaHora {
    final parts = hora.split(':');
    final d = DateTime.parse(fecha);
    return DateTime(d.year, d.month, d.day, int.parse(parts[0]), int.parse(parts[1]));
  }

  bool get esFutura => fechaHora.isAfter(DateTime.now());

  int get diasFaltantes => fechaHora.difference(DateTime.now()).inDays;

  static const List<String> tiposCita = [
    'Control prenatal',
    'Ecografía',
    'Análisis de laboratorio',
    'Consulta con especialista',
    'Vacuna',
    'Otro',
  ];

  Map<String, dynamic> toMap() => {
        'id': id,
        'gestante_id': gestanteId,
        'fecha': fecha,
        'hora': hora,
        'tipo': tipo,
        'hospital': hospital,
        'doctor': doctor,
        'notas': notas,
        'recordatorio_dias': recordatorioDias,
        'notificacion_programada': notificacionProgramada ? 1 : 0,
        'created_at': createdAt,
      };

  factory Cita.fromMap(Map<String, dynamic> map) => Cita(
        id: map['id'] as int?,
        gestanteId: map['gestante_id'] as int,
        fecha: map['fecha'] as String,
        hora: map['hora'] as String,
        tipo: map['tipo'] as String,
        hospital: map['hospital'] as String?,
        doctor: map['doctor'] as String?,
        notas: map['notas'] as String?,
        recordatorioDias: map['recordatorio_dias'] as int? ?? 1,
        notificacionProgramada: (map['notificacion_programada'] as int? ?? 0) == 1,
        createdAt: map['created_at'] as String,
      );

  Cita copyWith({bool? notificacionProgramada}) => Cita(
        id: id,
        gestanteId: gestanteId,
        fecha: fecha,
        hora: hora,
        tipo: tipo,
        hospital: hospital,
        doctor: doctor,
        notas: notas,
        recordatorioDias: recordatorioDias,
        notificacionProgramada: notificacionProgramada ?? this.notificacionProgramada,
        createdAt: createdAt,
      );
}
