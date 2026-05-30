import 'package:flutter/material.dart';
import '../models/gestante.dart';
import '../models/control_prenatal.dart';
import '../models/cita.dart';
import '../core/database/database_helper.dart';
import '../core/services/notification_service.dart';

class GestanteProvider extends ChangeNotifier {
  Gestante? _gestante;
  List<ControlPrenatal> _controles = [];
  List<Cita> _citas = [];
  bool _loading = true;

  Gestante? get gestante => _gestante;
  List<ControlPrenatal> get controles => _controles;
  List<Cita> get citas => _citas;
  bool get loading => _loading;
  bool get isRegistered => _gestante != null;

  Cita? get proximaCita {
    final futuras = _citas.where((c) => c.esFutura).toList();
    if (futuras.isEmpty) return null;
    futuras.sort((a, b) => a.fechaHora.compareTo(b.fechaHora));
    return futuras.first;
  }

  Future<void> load() async {
    _loading = true;
    notifyListeners();

    _gestante = await DatabaseHelper.instance.getGestante();
    if (_gestante != null) {
      await _loadControles();
      await _loadCitas();
    }

    _loading = false;
    notifyListeners();
  }

  Future<void> _loadControles() async {
    if (_gestante?.id == null) return;
    _controles = await DatabaseHelper.instance.getControles(_gestante!.id!);
  }

  Future<void> _loadCitas() async {
    if (_gestante?.id == null) return;
    _citas = await DatabaseHelper.instance.getCitas(_gestante!.id!);
  }

  Future<void> registrarGestante(Gestante g) async {
    final id = await DatabaseHelper.instance.insertGestante(g);
    _gestante = g.copyWith(id: id);
    _loading = false;
    notifyListeners();
  }

  Future<void> actualizarGestante(Gestante g) async {
    await DatabaseHelper.instance.updateGestante(g);
    _gestante = g;
    notifyListeners();
  }

  Future<void> agregarControl(ControlPrenatal c) async {
    await DatabaseHelper.instance.insertControl(c);
    await _loadControles();
    notifyListeners();
  }

  Future<void> eliminarControl(int id) async {
    await DatabaseHelper.instance.deleteControl(id);
    _controles.removeWhere((c) => c.id == id);
    notifyListeners();
  }

  Future<void> agregarCita(Cita c) async {
    final id = await DatabaseHelper.instance.insertCita(c);
    final citaConId = Cita(
      id: id,
      gestanteId: c.gestanteId,
      fecha: c.fecha,
      hora: c.hora,
      tipo: c.tipo,
      hospital: c.hospital,
      doctor: c.doctor,
      notas: c.notas,
      recordatorioDias: c.recordatorioDias,
      createdAt: c.createdAt,
    );

    if (citaConId.esFutura) {
      await NotificationService.instance.scheduleForCita(citaConId);
      await DatabaseHelper.instance.updateCitaNotificacion(id, true);
    }

    await _loadCitas();
    notifyListeners();
  }

  Future<void> eliminarCita(int id) async {
    await NotificationService.instance.cancelForCita(id);
    await DatabaseHelper.instance.deleteCita(id);
    _citas.removeWhere((c) => c.id == id);
    notifyListeners();
  }
}
