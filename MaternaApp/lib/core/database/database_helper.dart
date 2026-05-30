import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../../models/gestante.dart';
import '../../models/control_prenatal.dart';
import '../../models/cita.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._();
  static Database? _db;

  DatabaseHelper._();

  Future<Database> get db async {
    _db ??= await _initDb();
    return _db!;
  }

  Future<Database> _initDb() async {
    final path = join(await getDatabasesPath(), 'materna.db');
    return openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE gestantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        fecha_ultima_regla TEXT NOT NULL,
        telefono TEXT,
        hospital TEXT,
        nombre_doctor TEXT,
        created_at TEXT NOT NULL
      )
    ''');

    await db.execute('''
      CREATE TABLE controles_prenatales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gestante_id INTEGER NOT NULL,
        fecha TEXT NOT NULL,
        semanas_gestacion INTEGER NOT NULL,
        peso REAL,
        presion_sistolica INTEGER,
        presion_diastolica INTEGER,
        altura_uterina REAL,
        observaciones TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (gestante_id) REFERENCES gestantes (id)
      )
    ''');

    await db.execute('''
      CREATE TABLE citas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gestante_id INTEGER NOT NULL,
        fecha TEXT NOT NULL,
        hora TEXT NOT NULL,
        tipo TEXT NOT NULL,
        hospital TEXT,
        doctor TEXT,
        notas TEXT,
        recordatorio_dias INTEGER DEFAULT 1,
        notificacion_programada INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY (gestante_id) REFERENCES gestantes (id)
      )
    ''');
  }

  // ─── Gestante ──────────────────────────────────────────────

  Future<int> insertGestante(Gestante g) async {
    final database = await db;
    return database.insert('gestantes', g.toMap()..remove('id'));
  }

  Future<Gestante?> getGestante() async {
    final database = await db;
    final rows = await database.query('gestantes', limit: 1);
    if (rows.isEmpty) return null;
    return Gestante.fromMap(rows.first);
  }

  Future<void> updateGestante(Gestante g) async {
    final database = await db;
    await database.update('gestantes', g.toMap(), where: 'id = ?', whereArgs: [g.id]);
  }

  // ─── Controles ──────────────────────────────────────────────

  Future<int> insertControl(ControlPrenatal c) async {
    final database = await db;
    return database.insert('controles_prenatales', c.toMap()..remove('id'));
  }

  Future<List<ControlPrenatal>> getControles(int gestanteId) async {
    final database = await db;
    final rows = await database.query(
      'controles_prenatales',
      where: 'gestante_id = ?',
      whereArgs: [gestanteId],
      orderBy: 'fecha DESC',
    );
    return rows.map(ControlPrenatal.fromMap).toList();
  }

  Future<void> deleteControl(int id) async {
    final database = await db;
    await database.delete('controles_prenatales', where: 'id = ?', whereArgs: [id]);
  }

  // ─── Citas ──────────────────────────────────────────────────

  Future<int> insertCita(Cita c) async {
    final database = await db;
    return database.insert('citas', c.toMap()..remove('id'));
  }

  Future<List<Cita>> getCitas(int gestanteId) async {
    final database = await db;
    final rows = await database.query(
      'citas',
      where: 'gestante_id = ?',
      whereArgs: [gestanteId],
      orderBy: 'fecha ASC, hora ASC',
    );
    return rows.map(Cita.fromMap).toList();
  }

  Future<Cita?> getProximaCita(int gestanteId) async {
    final hoy = DateTime.now().toIso8601String().substring(0, 10);
    final database = await db;
    final rows = await database.query(
      'citas',
      where: 'gestante_id = ? AND fecha >= ?',
      whereArgs: [gestanteId, hoy],
      orderBy: 'fecha ASC, hora ASC',
      limit: 1,
    );
    if (rows.isEmpty) return null;
    return Cita.fromMap(rows.first);
  }

  Future<void> updateCitaNotificacion(int id, bool programada) async {
    final database = await db;
    await database.update(
      'citas',
      {'notificacion_programada': programada ? 1 : 0},
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> deleteCita(int id) async {
    final database = await db;
    await database.delete('citas', where: 'id = ?', whereArgs: [id]);
  }
}
