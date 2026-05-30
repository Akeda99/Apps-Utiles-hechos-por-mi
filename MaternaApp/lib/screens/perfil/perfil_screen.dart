import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/gestante_provider.dart';
import '../../models/gestante.dart';

class PerfilScreen extends StatelessWidget {
  const PerfilScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<GestanteProvider>();
    final g = provider.gestante;

    return Scaffold(
      backgroundColor: AppColors.cream,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _TopBar(onEdit: () => _showEditSheet(context, g)),
              const SizedBox(height: 20),
              if (g != null) ...[
                _HeroCard(g: g),
                const SizedBox(height: 16),
                _StatsRow(provider: provider),
                const SizedBox(height: 16),
                _InfoCard(g: g),
                const SizedBox(height: 16),
                _ActionsSection(),
                const SizedBox(height: 16),
                _AboutSection(),
              ],
            ],
          ),
        ),
      ),
    );
  }

  void _showEditSheet(BuildContext context, Gestante? g) {
    if (g == null) return;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _EditSheet(gestante: g),
    );
  }
}

class _TopBar extends StatelessWidget {
  final VoidCallback onEdit;
  const _TopBar({required this.onEdit});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(
          'Mi perfil',
          style: GoogleFonts.quicksand(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: AppColors.ink,
          ),
        ),
        const Spacer(),
        GestureDetector(
          onTap: onEdit,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.pink50,
              borderRadius: BorderRadius.circular(AppColors.rPill),
              border: Border.all(color: AppColors.pink200),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.edit_outlined, size: 16, color: AppColors.pink500),
                const SizedBox(width: 6),
                Text(
                  'Editar',
                  style: GoogleFonts.nunito(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.pink500,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _HeroCard extends StatelessWidget {
  final Gestante g;
  const _HeroCard({required this.g});

  @override
  Widget build(BuildContext context) {
    final semanas = g.semanasGestacion;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFF94B0), Color(0xFFF06A8E)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppColors.rXl),
        boxShadow: const [
          BoxShadow(color: Color(0x30F06A8E), blurRadius: 20, offset: Offset(0, 8)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.25),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Center(
                  child: Text('🤰', style: TextStyle(fontSize: 30)),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      g.nombre,
                      style: GoogleFonts.quicksand(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      g.trimestre,
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: Colors.white.withOpacity(0.85),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '$semanas',
                style: GoogleFonts.quicksand(
                  fontSize: 52,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                  height: 1,
                ),
              ),
              const SizedBox(width: 8),
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Text(
                  'semanas de gestación',
                  style: GoogleFonts.nunito(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Colors.white.withOpacity(0.85),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatsRow extends StatelessWidget {
  final GestanteProvider provider;
  const _StatsRow({required this.provider});

  @override
  Widget build(BuildContext context) {
    final diasParto = provider.gestante?.diasParaParto ?? 0;
    return Row(
      children: [
        Expanded(
          child: _StatChip(
            emoji: '📋',
            value: '${provider.controles.length}',
            label: 'controles',
            color: AppColors.pink50,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _StatChip(
            emoji: '📅',
            value: '${provider.citas.length}',
            label: 'citas',
            color: AppColors.mint50,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _StatChip(
            emoji: '🗓️',
            value: diasParto > 0 ? '$diasParto' : '0',
            label: 'días al parto',
            color: AppColors.sun50,
          ),
        ),
      ],
    );
  }
}

class _StatChip extends StatelessWidget {
  final String emoji;
  final String value;
  final String label;
  final Color color;
  const _StatChip({
    required this.emoji,
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(AppColors.rMd),
      ),
      child: Column(
        children: [
          Text(emoji, style: const TextStyle(fontSize: 20)),
          const SizedBox(height: 4),
          Text(
            value,
            style: GoogleFonts.quicksand(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppColors.ink,
            ),
          ),
          Text(
            label,
            style: GoogleFonts.nunito(
              fontSize: 10,
              fontWeight: FontWeight.w700,
              color: AppColors.inkSoft,
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoCard extends StatelessWidget {
  final Gestante g;
  const _InfoCard({required this.g});

  @override
  Widget build(BuildContext context) {
    final fur = DateFormat('dd MMM yyyy', 'es').format(DateTime.parse(g.fechaUltimaRegla));
    final parto = DateFormat('dd MMM yyyy', 'es').format(g.fechaProbableParto);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppColors.rLg),
        boxShadow: AppColors.shadowCard,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Datos del embarazo',
            style: GoogleFonts.quicksand(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: AppColors.ink,
            ),
          ),
          const SizedBox(height: 12),
          _InfoRow(
            icon: Icons.calendar_month_outlined,
            label: 'Última regla (FUR)',
            value: fur,
          ),
          const SizedBox(height: 10),
          _InfoRow(
            icon: Icons.child_care_outlined,
            label: 'Fecha probable de parto',
            value: parto,
          ),
          if (g.hospital != null && g.hospital!.isNotEmpty) ...[
            const SizedBox(height: 10),
            _InfoRow(
              icon: Icons.local_hospital_outlined,
              label: 'Centro de salud',
              value: g.hospital!,
            ),
          ],
          if (g.nombreDoctor != null && g.nombreDoctor!.isNotEmpty) ...[
            const SizedBox(height: 10),
            _InfoRow(
              icon: Icons.person_outline_rounded,
              label: 'Médico / Obstetra',
              value: g.nombreDoctor!,
            ),
          ],
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  const _InfoRow({required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: AppColors.pink50,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, size: 18, color: AppColors.pink500),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: GoogleFonts.nunito(
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  color: AppColors.inkFaint,
                  letterSpacing: 0.5,
                ),
              ),
              Text(
                value,
                style: GoogleFonts.quicksand(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.ink,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ActionsSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppColors.rLg),
        boxShadow: AppColors.shadowCard,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Accesos rápidos',
            style: GoogleFonts.quicksand(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: AppColors.ink,
            ),
          ),
          const SizedBox(height: 12),
          _ActionTile(
            icon: Icons.calculate_outlined,
            label: 'Calculadora gestacional',
            onTap: () => Navigator.pushNamed(context, '/calculadora'),
          ),
          const SizedBox(height: 8),
          _ActionTile(
            icon: Icons.event_note_outlined,
            label: 'Mis citas médicas',
            onTap: () => Navigator.pushNamed(context, '/citas'),
          ),
          const SizedBox(height: 8),
          _ActionTile(
            icon: Icons.warning_amber_outlined,
            label: 'Señales de alarma',
            onTap: () => Navigator.pushNamed(context, '/alarmas'),
          ),
        ],
      ),
    );
  }
}

class _ActionTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  const _ActionTile({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: AppColors.pink50,
          borderRadius: BorderRadius.circular(AppColors.rMd),
        ),
        child: Row(
          children: [
            Icon(icon, size: 20, color: AppColors.pink500),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                label,
                style: GoogleFonts.nunito(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.ink,
                ),
              ),
            ),
            const Icon(Icons.chevron_right_rounded, size: 20, color: AppColors.inkFaint),
          ],
        ),
      ),
    );
  }
}

// ─── About Section ─────────────────────────────────────────────────────────────

class _AboutSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppColors.rLg),
        boxShadow: AppColors.shadowCard,
      ),
      child: Column(
        children: [
          const Text('🌸', style: TextStyle(fontSize: 28)),
          const SizedBox(height: 8),
          Text(
            'MamiSalud',
            style: GoogleFonts.quicksand(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.ink,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Versión 1.0.0',
            style: GoogleFonts.nunito(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppColors.inkFaint,
            ),
          ),
          const SizedBox(height: 10),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
            decoration: BoxDecoration(
              color: AppColors.pink50,
              borderRadius: BorderRadius.circular(AppColors.rMd),
            ),
            child: Text(
              '© 2026 Ray Cardenas · Todos los derechos reservados\nDesarrollado para la Universidad Nacional de Ucayali (UNU)\nPucallpa, Perú',
              textAlign: TextAlign.center,
              style: GoogleFonts.nunito(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: AppColors.inkSoft,
                height: 1.6,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Edit Sheet ────────────────────────────────────────────────────────────────

class _EditSheet extends StatefulWidget {
  final Gestante gestante;
  const _EditSheet({required this.gestante});

  @override
  State<_EditSheet> createState() => _EditSheetState();
}

class _EditSheetState extends State<_EditSheet> {
  late final TextEditingController _nombreCtrl;
  late final TextEditingController _hospitalCtrl;
  late final TextEditingController _doctorCtrl;
  late DateTime _fur;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _nombreCtrl = TextEditingController(text: widget.gestante.nombre);
    _hospitalCtrl = TextEditingController(text: widget.gestante.hospital ?? '');
    _doctorCtrl = TextEditingController(text: widget.gestante.nombreDoctor ?? '');
    _fur = DateTime.parse(widget.gestante.fechaUltimaRegla);
  }

  @override
  void dispose() {
    _nombreCtrl.dispose();
    _hospitalCtrl.dispose();
    _doctorCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickFur() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _fur,
      firstDate: DateTime.now().subtract(const Duration(days: 294)),
      lastDate: DateTime.now(),
      helpText: 'Fecha de tu última regla',
      locale: const Locale('es'),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(primary: AppColors.pink400),
        ),
        child: child!,
      ),
    );
    if (picked != null) setState(() => _fur = picked);
  }

  Future<void> _guardar() async {
    if (_nombreCtrl.text.trim().isEmpty) return;
    setState(() => _saving = true);
    final updated = widget.gestante.copyWith(
      nombre: _nombreCtrl.text.trim(),
      hospital: _hospitalCtrl.text.trim().isEmpty ? null : _hospitalCtrl.text.trim(),
      nombreDoctor: _doctorCtrl.text.trim().isEmpty ? null : _doctorCtrl.text.trim(),
      fechaUltimaRegla: _fur.toIso8601String().substring(0, 10),
    );
    await context.read<GestanteProvider>().actualizarGestante(updated);
    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.fromLTRB(
        20, 20, 20, MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: SingleChildScrollView(
        child: Column(
        mainAxisSize: MainAxisSize.min,
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
          const SizedBox(height: 16),
          Text(
            'Editar perfil',
            style: GoogleFonts.quicksand(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.ink,
            ),
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _nombreCtrl,
            decoration: const InputDecoration(labelText: 'NOMBRE'),
          ),
          const SizedBox(height: 12),
          // ── FUR picker ──
          GestureDetector(
            onTap: _pickFur,
            child: Container(
              padding: const EdgeInsets.fromLTRB(16, 10, 16, 12),
              decoration: BoxDecoration(
                color: AppColors.pink50,
                borderRadius: BorderRadius.circular(AppColors.rMd),
                border: Border.all(color: AppColors.pink200, width: 1.5),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'ÚLTIMA REGLA (FUR)',
                          style: GoogleFonts.nunito(
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            color: AppColors.pink500,
                            letterSpacing: 0.6,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          DateFormat('dd MMM yyyy', 'es').format(_fur),
                          style: GoogleFonts.quicksand(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: AppColors.ink,
                          ),
                        ),
                        Text(
                          'Toca para cambiar · ${_semanasDesde(_fur)} semanas de gestación',
                          style: GoogleFonts.nunito(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: AppColors.inkSoft,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.calendar_month_outlined,
                      size: 20, color: AppColors.pink500),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.sun50,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                const Icon(Icons.info_outline_rounded,
                    size: 14, color: AppColors.sunFg),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    'Cambiar la FUR recalcula automáticamente las semanas y la fecha de parto.',
                    style: GoogleFonts.nunito(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: AppColors.sunFg,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _hospitalCtrl,
            decoration: const InputDecoration(labelText: 'CENTRO DE SALUD'),
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _doctorCtrl,
            decoration: const InputDecoration(labelText: 'MÉDICO / OBSTETRA'),
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
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Text('Guardar cambios'),
            ),
          ),
        ],
        ),
      ),
    );
  }

  int _semanasDesde(DateTime fur) =>
      (DateTime.now().difference(fur).inDays / 7).floor().clamp(0, 42);
}
