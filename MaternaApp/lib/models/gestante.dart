class Gestante {
  final int? id;
  final String nombre;
  final String fechaUltimaRegla;
  final String? telefono;
  final String? hospital;
  final String? nombreDoctor;
  final String createdAt;

  const Gestante({
    this.id,
    required this.nombre,
    required this.fechaUltimaRegla,
    this.telefono,
    this.hospital,
    this.nombreDoctor,
    required this.createdAt,
  });

  int get semanasGestacion {
    final fur = DateTime.parse(fechaUltimaRegla);
    final diff = DateTime.now().difference(fur).inDays;
    return (diff / 7).floor().clamp(0, 42);
  }

  int get diasGestacion {
    final fur = DateTime.parse(fechaUltimaRegla);
    return DateTime.now().difference(fur).inDays.clamp(0, 294);
  }

  DateTime get fechaProbableParto {
    final fur = DateTime.parse(fechaUltimaRegla);
    return fur.add(const Duration(days: 280));
  }

  int get diasParaParto {
    return fechaProbableParto.difference(DateTime.now()).inDays;
  }

  String get trimestre {
    final semanas = semanasGestacion;
    if (semanas <= 13) return 'Primer trimestre';
    if (semanas <= 27) return 'Segundo trimestre';
    return 'Tercer trimestre';
  }

  Map<String, dynamic> toMap() => {
        'id': id,
        'nombre': nombre,
        'fecha_ultima_regla': fechaUltimaRegla,
        'telefono': telefono,
        'hospital': hospital,
        'nombre_doctor': nombreDoctor,
        'created_at': createdAt,
      };

  factory Gestante.fromMap(Map<String, dynamic> map) => Gestante(
        id: map['id'] as int?,
        nombre: map['nombre'] as String,
        fechaUltimaRegla: map['fecha_ultima_regla'] as String,
        telefono: map['telefono'] as String?,
        hospital: map['hospital'] as String?,
        nombreDoctor: map['nombre_doctor'] as String?,
        createdAt: map['created_at'] as String,
      );

  Gestante copyWith({
    int? id,
    String? nombre,
    String? fechaUltimaRegla,
    String? telefono,
    String? hospital,
    String? nombreDoctor,
  }) =>
      Gestante(
        id: id ?? this.id,
        nombre: nombre ?? this.nombre,
        fechaUltimaRegla: fechaUltimaRegla ?? this.fechaUltimaRegla,
        telefono: telefono ?? this.telefono,
        hospital: hospital ?? this.hospital,
        nombreDoctor: nombreDoctor ?? this.nombreDoctor,
        createdAt: createdAt,
      );
}
