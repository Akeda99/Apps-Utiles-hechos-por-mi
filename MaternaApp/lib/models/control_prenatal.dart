class ControlPrenatal {
  final int? id;
  final int gestanteId;
  final String fecha;
  final int semanasGestacion;
  final double? peso;
  final int? presionSistolica;
  final int? presionDiastolica;
  final double? alturaUterina;
  final String? observaciones;
  final String createdAt;

  const ControlPrenatal({
    this.id,
    required this.gestanteId,
    required this.fecha,
    required this.semanasGestacion,
    this.peso,
    this.presionSistolica,
    this.presionDiastolica,
    this.alturaUterina,
    this.observaciones,
    required this.createdAt,
  });

  String get presionArterial {
    if (presionSistolica != null && presionDiastolica != null) {
      return '$presionSistolica/$presionDiastolica mmHg';
    }
    return 'No registrada';
  }

  String get pesoTexto => peso != null ? '${peso!.toStringAsFixed(1)} kg' : 'No registrado';

  Map<String, dynamic> toMap() => {
        'id': id,
        'gestante_id': gestanteId,
        'fecha': fecha,
        'semanas_gestacion': semanasGestacion,
        'peso': peso,
        'presion_sistolica': presionSistolica,
        'presion_diastolica': presionDiastolica,
        'altura_uterina': alturaUterina,
        'observaciones': observaciones,
        'created_at': createdAt,
      };

  factory ControlPrenatal.fromMap(Map<String, dynamic> map) => ControlPrenatal(
        id: map['id'] as int?,
        gestanteId: map['gestante_id'] as int,
        fecha: map['fecha'] as String,
        semanasGestacion: map['semanas_gestacion'] as int,
        peso: map['peso'] as double?,
        presionSistolica: map['presion_sistolica'] as int?,
        presionDiastolica: map['presion_diastolica'] as int?,
        alturaUterina: map['altura_uterina'] as double?,
        observaciones: map['observaciones'] as String?,
        createdAt: map['created_at'] as String,
      );
}
