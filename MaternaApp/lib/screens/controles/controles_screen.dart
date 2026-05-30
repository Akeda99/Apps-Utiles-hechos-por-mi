import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/control_prenatal.dart';
import '../../providers/gestante_provider.dart';

class ControlesScreen extends StatelessWidget {
  const ControlesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<GestanteProvider>();

    return Scaffold(
      backgroundColor: AppColors.cream,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _TopBar(onAdd: () => _showForm(context, provider)),
            Expanded(
              child: provider.controles.isEmpty
                  ? const _EmptyState()
                  : ListView.builder(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 100),
                      itemCount: provider.controles.length,
                      itemBuilder: (_, i) => _ControlCard(
                        control: provider.controles[i],
                        onDelete: () =>
                            provider.eliminarControl(provider.controles[i].id!),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  void _showForm(BuildContext context, GestanteProvider provider) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _ControlForm(gestanteId: provider.gestante!.id!),
    );
  }
}

class _TopBar extends StatelessWidget {
  final VoidCallback onAdd;
  const _TopBar({required this.onAdd});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 12),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Mis Controles',
                  style: GoogleFonts.quicksand(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: AppColors.ink,
                  ),
                ),
                Text(
                  'Registro de controles prenatales',
                  style: GoogleFonts.nunito(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.inkSoft,
                  ),
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: onAdd,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: AppColors.pink400,
                borderRadius: BorderRadius.circular(AppColors.rPill),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x30F06A8E),
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.add_rounded, size: 18, color: Colors.white),
                  const SizedBox(width: 4),
                  Text(
                    'Agregar',
                    style: GoogleFonts.nunito(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppColors.pink50,
                borderRadius: BorderRadius.circular(AppColors.rXl),
              ),
              child: const Center(
                child: Text('📋', style: TextStyle(fontSize: 36)),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Sin controles registrados',
              style: GoogleFonts.quicksand(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppColors.ink,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Registra tu primer control prenatal\npresionando el botón de arriba',
              textAlign: TextAlign.center,
              style: GoogleFonts.nunito(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.inkSoft,
                height: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ControlCard extends StatelessWidget {
  final ControlPrenatal control;
  final VoidCallback onDelete;
  const _ControlCard({required this.control, required this.onDelete});

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: Key('ctrl_${control.id}'),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(
          color: AppColors.coral,
          borderRadius: BorderRadius.circular(18),
        ),
        child: const Icon(Icons.delete_outline, color: Colors.white, size: 28),
      ),
      confirmDismiss: (_) async {
        return await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Eliminar control'),
            content: const Text('¿Estás segura de que quieres eliminar este control?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx, false),
                child: const Text('Cancelar'),
              ),
              TextButton(
                onPressed: () => Navigator.pop(ctx, true),
                child: Text(
                  'Eliminar',
                  style: GoogleFonts.nunito(color: AppColors.coral),
                ),
              ),
            ],
          ),
        );
      },
      onDismissed: (_) => onDelete(),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: AppColors.shadowCard,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.pink50,
                    borderRadius: BorderRadius.circular(AppColors.rPill),
                  ),
                  child: Text(
                    'Sem. ${control.semanasGestacion}',
                    style: GoogleFonts.nunito(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: AppColors.pink500,
                    ),
                  ),
                ),
                const Spacer(),
                Text(
                  DateFormat('dd MMM yyyy', 'es').format(DateTime.parse(control.fecha)),
                  style: GoogleFonts.nunito(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.inkFaint,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _Stat(emoji: '⚖️', label: 'Peso', value: control.pesoTexto),
                const SizedBox(width: 20),
                _Stat(emoji: '💓', label: 'Presión', value: control.presionArterial),
                if (control.alturaUterina != null) ...[
                  const SizedBox(width: 20),
                  _Stat(
                    emoji: '📏',
                    label: 'Altura uterina',
                    value: '${control.alturaUterina!.toStringAsFixed(1)} cm',
                  ),
                ],
              ],
            ),
            if (control.observaciones != null &&
                control.observaciones!.isNotEmpty) ...[
              const SizedBox(height: 10),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppColors.pink50,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.pink150, width: 1),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('📝', style: TextStyle(fontSize: 12)),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        control.observaciones!,
                        style: GoogleFonts.nunito(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppColors.inkSoft,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  final String emoji;
  final String label;
  final String value;
  const _Stat({required this.emoji, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '$emoji $label',
          style: GoogleFonts.nunito(
            fontSize: 10,
            fontWeight: FontWeight.w800,
            color: AppColors.inkFaint,
            letterSpacing: 0.3,
          ),
        ),
        Text(
          value,
          style: GoogleFonts.quicksand(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: AppColors.ink,
          ),
        ),
      ],
    );
  }
}

// ─── Formulario ────────────────────────────────────────────────────────────────

class _ControlForm extends StatefulWidget {
  final int gestanteId;
  const _ControlForm({required this.gestanteId});

  @override
  State<_ControlForm> createState() => _ControlFormState();
}

class _ControlFormState extends State<_ControlForm> {
  final _formKey = GlobalKey<FormState>();
  DateTime _fecha = DateTime.now();
  final _pesoCtrl = TextEditingController();
  final _sistolicaCtrl = TextEditingController();
  final _diastolicaCtrl = TextEditingController();
  final _alturaCtrl = TextEditingController();
  final _obsCtrl = TextEditingController();
  bool _saving = false;

  @override
  void dispose() {
    _pesoCtrl.dispose();
    _sistolicaCtrl.dispose();
    _diastolicaCtrl.dispose();
    _alturaCtrl.dispose();
    _obsCtrl.dispose();
    super.dispose();
  }

  int get _semanas {
    final gestante = context.read<GestanteProvider>().gestante!;
    final fur = DateTime.parse(gestante.fechaUltimaRegla);
    return (_fecha.difference(fur).inDays / 7).floor().clamp(0, 42);
  }

  Future<void> _pickFecha() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _fecha,
      firstDate: DateTime.now().subtract(const Duration(days: 294)),
      lastDate: DateTime.now(),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(primary: AppColors.pink400),
        ),
        child: child!,
      ),
    );
    if (picked != null) setState(() => _fecha = picked);
  }

  Future<void> _guardar() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);

    final control = ControlPrenatal(
      gestanteId: widget.gestanteId,
      fecha: _fecha.toIso8601String().substring(0, 10),
      semanasGestacion: _semanas,
      peso: _pesoCtrl.text.isNotEmpty ? double.tryParse(_pesoCtrl.text) : null,
      presionSistolica:
          _sistolicaCtrl.text.isNotEmpty ? int.tryParse(_sistolicaCtrl.text) : null,
      presionDiastolica:
          _diastolicaCtrl.text.isNotEmpty ? int.tryParse(_diastolicaCtrl.text) : null,
      alturaUterina:
          _alturaCtrl.text.isNotEmpty ? double.tryParse(_alturaCtrl.text) : null,
      observaciones: _obsCtrl.text.trim().isEmpty ? null : _obsCtrl.text.trim(),
      createdAt: DateTime.now().toIso8601String(),
    );

    await context.read<GestanteProvider>().agregarControl(control);
    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.line,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 6),
              Center(
                child: Text(
                  'NUEVO CONTROL',
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: AppColors.inkFaint,
                    letterSpacing: 0.6,
                  ),
                ),
              ),
              const SizedBox(height: 4),
              Center(
                child: Text(
                  'Anota tu control',
                  style: GoogleFonts.quicksand(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: AppColors.ink,
                  ),
                ),
              ),
              const SizedBox(height: 4),
              Center(
                child: Text(
                  'Solo te toma un minuto. Lo guardamos en tu historia 💕',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.nunito(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.inkSoft,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              _field('Fecha del control',
                child: GestureDetector(
                  onTap: _pickFecha,
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          DateFormat('dd/MM/yyyy').format(_fecha),
                          style: GoogleFonts.quicksand(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: AppColors.ink,
                          ),
                        ),
                      ),
                      const Icon(
                        Icons.calendar_today_outlined,
                        size: 18,
                        color: AppColors.pink500,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              _field('Tu peso hoy (kg)',
                child: TextFormField(
                  controller: _pesoCtrl,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(
                    hintText: 'Ej: 58.5',
                    suffixText: 'kg',
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.zero,
                    isDense: true,
                  ),
                  style: GoogleFonts.quicksand(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.ink,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              _field('Presión arterial',
                child: Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _sistolicaCtrl,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                          hintText: 'Sistólica',
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.zero,
                          isDense: true,
                        ),
                        style: GoogleFonts.quicksand(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: AppColors.ink,
                        ),
                      ),
                    ),
                    Text(
                      ' / ',
                      style: GoogleFonts.quicksand(
                        fontSize: 18,
                        color: AppColors.inkFaint,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Expanded(
                      child: TextFormField(
                        controller: _diastolicaCtrl,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                          hintText: 'Diastólica',
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.zero,
                          isDense: true,
                        ),
                        style: GoogleFonts.quicksand(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: AppColors.ink,
                        ),
                      ),
                    ),
                    Text(
                      ' mmHg',
                      style: GoogleFonts.nunito(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppColors.inkSoft,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              _field('Altura uterina — opcional (cm)',
                child: TextFormField(
                  controller: _alturaCtrl,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(
                    hintText: 'Ej: 28.0',
                    suffixText: 'cm',
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.zero,
                    isDense: true,
                  ),
                  style: GoogleFonts.quicksand(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.ink,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              _field('Observaciones (opcional)',
                child: TextFormField(
                  controller: _obsCtrl,
                  maxLines: 3,
                  decoration: InputDecoration(
                    hintText: 'Escribe lo que dijo el médico...',
                    hintStyle: GoogleFonts.nunito(
                      fontSize: 13,
                      color: AppColors.inkFaint,
                      fontStyle: FontStyle.italic,
                    ),
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.zero,
                    isDense: true,
                  ),
                  style: GoogleFonts.nunito(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.ink,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _saving ? null : _guardar,
                  child: _saving
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child:
                              CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : const Text('Guardar control'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _field(String label, {required Widget child}) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 10, 14, 12),
      decoration: BoxDecoration(
        color: AppColors.pink50,
        borderRadius: BorderRadius.circular(AppColors.rMd),
        border: Border.all(color: AppColors.pink150, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label.toUpperCase(),
            style: GoogleFonts.nunito(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              color: AppColors.pink500,
              letterSpacing: 0.6,
            ),
          ),
          const SizedBox(height: 6),
          child,
        ],
      ),
    );
  }
}
