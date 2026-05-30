import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/cita.dart';
import '../../providers/gestante_provider.dart';

class CitasScreen extends StatelessWidget {
  const CitasScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<GestanteProvider>();
    final proximas = provider.citas.where((c) => c.esFutura).toList();
    final pasadas = provider.citas.where((c) => !c.esFutura).toList();

    return Scaffold(
      appBar: AppBar(title: const Text('Mis Citas')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showForm(context, provider),
        backgroundColor: AppColors.secondary,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Nueva cita', style: TextStyle(color: Colors.white)),
      ),
      body: provider.citas.isEmpty
          ? const _EmptyState()
          : ListView(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
              children: [
                if (proximas.isNotEmpty) ...[
                  _SectionHeader(title: 'Próximas citas', emoji: '📅', count: proximas.length),
                  const SizedBox(height: 8),
                  ...proximas.map((c) => _CitaCard(cita: c, isPast: false,
                      onDelete: () => provider.eliminarCita(c.id!))),
                ],
                if (pasadas.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  _SectionHeader(title: 'Citas pasadas', emoji: '✅', count: pasadas.length),
                  const SizedBox(height: 8),
                  ...pasadas.map((c) => _CitaCard(cita: c, isPast: true,
                      onDelete: () => provider.eliminarCita(c.id!))),
                ],
              ],
            ),
    );
  }

  void _showForm(BuildContext context, GestanteProvider provider) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _CitaForm(gestanteId: provider.gestante!.id!),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final String emoji;
  final int count;
  const _SectionHeader({required this.title, required this.emoji, required this.count});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(emoji, style: const TextStyle(fontSize: 16)),
        const SizedBox(width: 6),
        Text(title,
            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16, color: AppColors.textPrimary)),
        const SizedBox(width: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
          decoration: BoxDecoration(
            color: AppColors.primaryLight,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Text('$count',
              style: const TextStyle(color: AppColors.primaryDark, fontWeight: FontWeight.w700, fontSize: 12)),
        ),
      ],
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('📅', style: TextStyle(fontSize: 64)),
          SizedBox(height: 16),
          Text('Sin citas programadas',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
          SizedBox(height: 8),
          Text('Agrega tu próxima cita prenatal\npresionando el botón de abajo',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}

class _CitaCard extends StatelessWidget {
  final Cita cita;
  final bool isPast;
  final VoidCallback onDelete;
  const _CitaCard({required this.cita, required this.isPast, required this.onDelete});

  @override
  Widget build(BuildContext context) {
    final fecha = DateFormat('EEEE dd/MM/yyyy', 'es').format(DateTime.parse(cita.fecha));

    return Dismissible(
      key: Key('cita_${cita.id}'),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(color: AppColors.danger, borderRadius: BorderRadius.circular(18)),
        child: const Icon(Icons.delete_outline, color: Colors.white, size: 28),
      ),
      confirmDismiss: (_) async => await showDialog<bool>(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Eliminar cita'),
          content: const Text('¿Estás segura de que quieres eliminar esta cita?'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancelar')),
            TextButton(
              onPressed: () => Navigator.pop(ctx, true),
              child: const Text('Eliminar', style: TextStyle(color: AppColors.danger)),
            ),
          ],
        ),
      ),
      onDismissed: (_) => onDelete(),
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isPast ? const Color(0xFFF9F9F9) : Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isPast ? AppColors.divider : AppColors.secondaryLight,
            width: isPast ? 1 : 2,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: isPast ? AppColors.divider : AppColors.secondaryLight,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    cita.tipo,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: isPast ? AppColors.textSecondary : AppColors.secondary,
                    ),
                  ),
                ),
                const Spacer(),
                if (!isPast)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primaryLight,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      cita.diasFaltantes == 0
                          ? '¡Hoy!'
                          : cita.diasFaltantes == 1
                              ? 'Mañana'
                              : 'En ${cita.diasFaltantes} días',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primaryDark,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              fecha.substring(0, 1).toUpperCase() + fecha.substring(1),
              style: TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 15,
                color: isPast ? AppColors.textSecondary : AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                const Text('🕐', style: TextStyle(fontSize: 13)),
                const SizedBox(width: 4),
                Text(cita.hora, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                if (cita.hospital != null) ...[
                  const SizedBox(width: 12),
                  const Text('🏥', style: TextStyle(fontSize: 13)),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      cita.hospital!,
                      style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ],
            ),
            if (cita.notas != null && cita.notas!.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                cita.notas!,
                style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// ─── Formulario ─────────────────────────────────────────────────────────────

class _CitaForm extends StatefulWidget {
  final int gestanteId;
  const _CitaForm({required this.gestanteId});

  @override
  State<_CitaForm> createState() => _CitaFormState();
}

class _CitaFormState extends State<_CitaForm> {
  final _formKey = GlobalKey<FormState>();
  DateTime _fecha = DateTime.now().add(const Duration(days: 7));
  TimeOfDay _hora = const TimeOfDay(hour: 9, minute: 0);
  String _tipo = Cita.tiposCita.first;
  final _hospitalCtrl = TextEditingController();
  final _doctorCtrl = TextEditingController();
  final _notasCtrl = TextEditingController();
  int _recordatorioDias = 1;
  bool _saving = false;

  @override
  void dispose() {
    _hospitalCtrl.dispose();
    _doctorCtrl.dispose();
    _notasCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickFecha() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _fecha,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx)
            .copyWith(colorScheme: const ColorScheme.light(primary: AppColors.secondary)),
        child: child!,
      ),
    );
    if (picked != null) setState(() => _fecha = picked);
  }

  Future<void> _pickHora() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: _hora,
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx)
            .copyWith(colorScheme: const ColorScheme.light(primary: AppColors.secondary)),
        child: child!,
      ),
    );
    if (picked != null) setState(() => _hora = picked);
  }

  Future<void> _guardar() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);

    final horaStr =
        '${_hora.hour.toString().padLeft(2, '0')}:${_hora.minute.toString().padLeft(2, '0')}';

    final cita = Cita(
      gestanteId: widget.gestanteId,
      fecha: _fecha.toIso8601String().substring(0, 10),
      hora: horaStr,
      tipo: _tipo,
      hospital: _hospitalCtrl.text.trim().isEmpty ? null : _hospitalCtrl.text.trim(),
      doctor: _doctorCtrl.text.trim().isEmpty ? null : _doctorCtrl.text.trim(),
      notas: _notasCtrl.text.trim().isEmpty ? null : _notasCtrl.text.trim(),
      recordatorioDias: _recordatorioDias,
      createdAt: DateTime.now().toIso8601String(),
    );

    await context.read<GestanteProvider>().agregarCita(cita);
    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Center(
                child: Text('Nueva cita prenatal',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              ),
              const SizedBox(height: 20),
              _lbl('Tipo de cita'),
              DropdownButtonFormField<String>(
                value: _tipo,
                items: Cita.tiposCita
                    .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                    .toList(),
                onChanged: (v) => setState(() => _tipo = v!),
                decoration: const InputDecoration(),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _lbl('Fecha'),
                        GestureDetector(
                          onTap: _pickFecha,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              border: Border.all(color: AppColors.cardBorder),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.calendar_today,
                                    size: 16, color: AppColors.secondary),
                                const SizedBox(width: 8),
                                Text(DateFormat('dd/MM/yyyy').format(_fecha),
                                    style: const TextStyle(fontSize: 14)),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _lbl('Hora'),
                        GestureDetector(
                          onTap: _pickHora,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              border: Border.all(color: AppColors.cardBorder),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.access_time,
                                    size: 16, color: AppColors.secondary),
                                const SizedBox(width: 8),
                                Text(
                                    '${_hora.hour.toString().padLeft(2, '0')}:${_hora.minute.toString().padLeft(2, '0')}',
                                    style: const TextStyle(fontSize: 14)),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              _lbl('Hospital o centro de salud'),
              TextFormField(
                controller: _hospitalCtrl,
                decoration: const InputDecoration(hintText: 'Ej: Hospital Regional de Pucallpa'),
                textCapitalization: TextCapitalization.words,
              ),
              const SizedBox(height: 16),
              _lbl('Médico o obstetra'),
              TextFormField(
                controller: _doctorCtrl,
                decoration: const InputDecoration(hintText: 'Ej: Dra. García'),
                textCapitalization: TextCapitalization.words,
              ),
              const SizedBox(height: 16),
              _lbl('Notas'),
              TextFormField(
                controller: _notasCtrl,
                maxLines: 2,
                decoration: const InputDecoration(hintText: 'Ej: Llevar análisis de sangre...'),
              ),
              const SizedBox(height: 16),
              _lbl('Recordarme con cuántos días de anticipación'),
              Row(
                children: [1, 2, 3].map((d) {
                  final selected = _recordatorioDias == d;
                  return GestureDetector(
                    onTap: () => setState(() => _recordatorioDias = d),
                    child: Container(
                      margin: const EdgeInsets.only(right: 10),
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      decoration: BoxDecoration(
                        color: selected ? AppColors.secondary : Colors.white,
                        border: Border.all(
                            color: selected ? AppColors.secondary : AppColors.cardBorder),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '$d día${d > 1 ? 's' : ''}',
                        style: TextStyle(
                          color: selected ? Colors.white : AppColors.textSecondary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _saving ? null : _guardar,
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.secondary),
                child: _saving
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Guardar cita'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _lbl(String t) => Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child:
            Text(t, style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
      );
}
