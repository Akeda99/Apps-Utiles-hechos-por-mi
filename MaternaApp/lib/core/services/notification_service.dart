import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import '../../models/cita.dart';

class NotificationService {
  static final NotificationService instance = NotificationService._();
  NotificationService._();

  final _plugin = FlutterLocalNotificationsPlugin();

  static const _channelId = 'materna_citas';
  static const _channelName = 'Recordatorios de citas';

  Future<void> initialize() async {
    const android = AndroidInitializationSettings('@mipmap/ic_launcher');
    const settings = InitializationSettings(android: android);
    await _plugin.initialize(settings);

    await _plugin
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(
          const AndroidNotificationChannel(
            _channelId,
            _channelName,
            description: 'Recordatorios de citas prenatales',
            importance: Importance.high,
          ),
        );
  }

  Future<void> scheduleForCita(Cita cita) async {
    if (cita.id == null) return;

    // Notificación 1 día antes
    final fechaAntes = cita.fechaHora.subtract(Duration(days: cita.recordatorioDias));
    if (fechaAntes.isAfter(DateTime.now())) {
      await _plugin.zonedSchedule(
        cita.id!,
        '📅 Recordatorio de cita',
        '${cita.tipo} mañana a las ${cita.hora}${cita.hospital != null ? ' en ${cita.hospital}' : ''}',
        tz.TZDateTime.from(fechaAntes, tz.local),
        NotificationDetails(
          android: AndroidNotificationDetails(
            _channelId,
            _channelName,
            importance: Importance.high,
            priority: Priority.high,
            styleInformation: BigTextStyleInformation(
              '${cita.tipo} mañana a las ${cita.hora}${cita.hospital != null ? ' en ${cita.hospital}' : ''}',
            ),
          ),
        ),
        androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
        uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
      );
    }

    // Notificación el mismo día a las 8am
    final fechaCita = cita.fechaHora;
    final notifMismoDia = DateTime(fechaCita.year, fechaCita.month, fechaCita.day, 8, 0);
    if (notifMismoDia.isAfter(DateTime.now())) {
      await _plugin.zonedSchedule(
        cita.id! + 10000,
        '🌸 ¡Hoy tienes una cita!',
        '${cita.tipo} hoy a las ${cita.hora}${cita.hospital != null ? ' en ${cita.hospital}' : ''}',
        tz.TZDateTime.from(notifMismoDia, tz.local),
        NotificationDetails(
          android: AndroidNotificationDetails(
            _channelId,
            _channelName,
            importance: Importance.high,
            priority: Priority.high,
            styleInformation: BigTextStyleInformation(
              '${cita.tipo} hoy a las ${cita.hora}${cita.hospital != null ? ' en ${cita.hospital}' : ''}',
            ),
          ),
        ),
        androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
        uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
      );
    }
  }

  Future<void> cancelForCita(int citaId) async {
    await _plugin.cancel(citaId);
    await _plugin.cancel(citaId + 10000);
  }

  Future<void> showImmediate(String title, String body) async {
    await _plugin.show(
      999,
      title,
      body,
      const NotificationDetails(
        android: AndroidNotificationDetails(
          _channelId,
          _channelName,
          importance: Importance.defaultImportance,
        ),
      ),
    );
  }
}
