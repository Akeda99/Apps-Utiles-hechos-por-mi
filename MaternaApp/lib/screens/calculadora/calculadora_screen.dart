import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/gestante_provider.dart';

class CalculadoraScreen extends StatefulWidget {
  const CalculadoraScreen({super.key});

  @override
  State<CalculadoraScreen> createState() => _CalculadoraScreenState();
}

class _CalculadoraScreenState extends State<CalculadoraScreen> {
  DateTime? _fur;

  int get _semanas {
    if (_fur == null) return 0;
    return (DateTime.now().difference(_fur!).inDays / 7).floor().clamp(0, 42);
  }

  int get _diasExtra {
    if (_fur == null) return 0;
    final totalDias = DateTime.now().difference(_fur!).inDays.clamp(0, 294);
    return totalDias - (_semanas * 7);
  }

  DateTime? get _fpp => _fur?.add(const Duration(days: 280));

  String get _trimestreLabel {
    if (_semanas <= 13) return 'primer trimestre';
    if (_semanas <= 27) return 'segundo trimestre';
    return 'tercer trimestre';
  }

  String get _trimestreRango {
    if (_semanas <= 13) return 'Semana 1 a 13';
    if (_semanas <= 27) return 'Semana 14 a 27';
    return 'Semana 28 a 40';
  }

  String get _proximoControl {
    if (_semanas < 12) return 'Entre semana 10 y 12';
    if (_semanas < 16) return 'Entre semana 14 y 16';
    if (_semanas < 20) return 'Entre semana 18 y 20';
    if (_semanas < 24) return 'Entre semana 22 y 24';
    if (_semanas < 28) return 'Entre semana 26 y 28';
    if (_semanas < 32) return 'Entre semana 30 y 32';
    if (_semanas < 36) return 'Entre semana 34 y 36';
    return 'Consultar médico pronto';
  }

  Future<void> _guardarEnPerfil(BuildContext context) async {
    if (_fur == null) return;
    final provider = context.read<GestanteProvider>();
    if (provider.gestante == null) return;

    final updated = provider.gestante!.copyWith(
      fechaUltimaRegla: _fur!.toIso8601String().substring(0, 10),
    );
    await provider.actualizarGestante(updated);

    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            '✅ FUR actualizada · $_semanas semanas de gestación',
            style: GoogleFonts.nunito(fontWeight: FontWeight.w700),
          ),
          backgroundColor: AppColors.mint600,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
    }
  }

  Future<void> _pickFur() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _fur ?? DateTime.now().subtract(const Duration(days: 70)),
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

  @override
  Widget build(BuildContext context) {
    final hasResult = _fur != null;

    return Scaffold(
      backgroundColor: AppColors.cream,
      body: SafeArea(
        child: Column(
          children: [
            _TopBar(),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      'Cuéntame el primer día de tu última regla (FUR) y yo te digo cuántas semanas llevas 🌷',
                      style: GoogleFonts.nunito(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppColors.inkSoft,
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _FurField(
                      fur: _fur,
                      onTap: _pickFur,
                    ),
                    if (hasResult) ...[
                      const SizedBox(height: 16),
                      _ResultCard(
                        semanas: _semanas,
                        diasExtra: _diasExtra,
                        trimestreLabel: _trimestreLabel,
                      ),
                      const SizedBox(height: 12),
                      _DetailRow(
                        icon: Icons.calendar_month_outlined,
                        label: 'Fecha probable de parto',
                        value: DateFormat('dd MMMM, yyyy', 'es').format(_fpp!),
                      ),
                      const SizedBox(height: 8),
                      _DetailRow(
                        icon: Icons.child_care_outlined,
                        label: 'Trimestre actual',
                        value:
                            '${_trimestreLabel[0].toUpperCase()}${_trimestreLabel.substring(1)} ($_trimestreRango)',
                      ),
                      const SizedBox(height: 8),
                      _DetailRow(
                        icon: Icons.favorite_outline_rounded,
                        label: 'Próximo control sugerido',
                        value: _proximoControl,
                      ),
                    ] else ...[
                      const SizedBox(height: 48),
                      Center(
                        child: Column(
                          children: [
                            Container(
                              width: 72,
                              height: 72,
                              decoration: BoxDecoration(
                                color: AppColors.mint50,
                                borderRadius:
                                    BorderRadius.circular(AppColors.rXl),
                              ),
                              child: const Center(
                                child: Text('🌷',
                                    style: TextStyle(fontSize: 32)),
                              ),
                            ),
                            const SizedBox(height: 14),
                            Text(
                              'Selecciona la fecha de tu\núltima regla para calcular',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.nunito(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppColors.inkSoft,
                                height: 1.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            if (hasResult)
              Container(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  border: Border(top: BorderSide(color: AppColors.line)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _pickFur,
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.pink500,
                          side: const BorderSide(color: AppColors.pink200),
                          shape: const StadiumBorder(),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                        child: const Text('Cambiar FUR'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton(
                        onPressed: () => _guardarEnPerfil(context),
                        child: const Text('Guardar en mi perfil'),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _TopBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Navigator.maybePop(context),
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: AppColors.pink50,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.arrow_back_ios_new_rounded,
                  size: 16, color: AppColors.inkFaint),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'HERRAMIENTA',
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: AppColors.inkFaint,
                    letterSpacing: 0.6,
                  ),
                ),
                Text(
                  '¿Cuántas semanas tengo?',
                  style: GoogleFonts.quicksand(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: AppColors.ink,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _FurField extends StatelessWidget {
  final DateTime? fur;
  final VoidCallback onTap;
  const _FurField({required this.fur, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final label = fur != null
        ? DateFormat('d \'de\' MMMM, yyyy', 'es').format(fur!)
        : 'Seleccionar fecha';

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.fromLTRB(14, 10, 14, 12),
        decoration: BoxDecoration(
          color: fur != null ? Colors.white : AppColors.pink50,
          borderRadius: BorderRadius.circular(AppColors.rMd),
          border: Border.all(
            color: fur != null ? AppColors.pink200 : AppColors.pink100,
            width: fur != null ? 1.5 : 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'PRIMER DÍA DE TU ÚLTIMA REGLA',
              style: GoogleFonts.nunito(
                fontSize: 10,
                fontWeight: FontWeight.w800,
                color: AppColors.pink500,
                letterSpacing: 0.6,
              ),
            ),
            const SizedBox(height: 6),
            Row(
              children: [
                Expanded(
                  child: Text(
                    label,
                    style: GoogleFonts.quicksand(
                      fontSize: fur != null ? 20 : 15,
                      fontWeight: FontWeight.w700,
                      color: fur != null ? AppColors.ink : AppColors.inkFaint,
                    ),
                  ),
                ),
                const Icon(
                  Icons.calendar_month_outlined,
                  size: 20,
                  color: AppColors.pink500,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ResultCard extends StatelessWidget {
  final int semanas;
  final int diasExtra;
  final String trimestreLabel;
  const _ResultCard({
    required this.semanas,
    required this.diasExtra,
    required this.trimestreLabel,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFDEF4E8), Color(0xFFB8E8CD)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppColors.rXl),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppColors.rPill),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.auto_awesome_rounded,
                    size: 11, color: AppColors.mint600),
                const SizedBox(width: 4),
                Text(
                  'RESULTADO',
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: AppColors.mint600,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '$semanas',
                style: GoogleFonts.quicksand(
                  fontSize: 56,
                  fontWeight: FontWeight.w700,
                  color: AppColors.ink,
                  height: 1,
                ),
              ),
              const SizedBox(width: 8),
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'semanas',
                      style: GoogleFonts.quicksand(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.ink,
                      ),
                    ),
                    Text(
                      '+ $diasExtra días',
                      style: GoogleFonts.nunito(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: AppColors.mint600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text.rich(
            TextSpan(
              text: 'Estás en tu ',
              style: GoogleFonts.nunito(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.inkSoft,
              ),
              children: [
                TextSpan(
                  text: trimestreLabel,
                  style: GoogleFonts.nunito(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: AppColors.mint600,
                  ),
                ),
                const TextSpan(text: ' 🌱'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 10, 14, 10),
      decoration: BoxDecoration(
        color: AppColors.pink50,
        borderRadius: BorderRadius.circular(AppColors.rMd),
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: Colors.white,
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
                  label.toUpperCase(),
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
      ),
    );
  }
}
