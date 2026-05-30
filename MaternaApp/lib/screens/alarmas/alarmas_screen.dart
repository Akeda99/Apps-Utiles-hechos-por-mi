import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';

enum _Tone { coral, sun }

class _Signal {
  final String emoji;
  final String title;
  final String desc;
  final _Tone tone;
  const _Signal({
    required this.emoji,
    required this.title,
    required this.desc,
    required this.tone,
  });
}

const _signals = [
  _Signal(
    emoji: '🩸',
    title: 'Sangrado vaginal',
    desc: 'Aunque sea poquito, no esperes.',
    tone: _Tone.coral,
  ),
  _Signal(
    emoji: '😣',
    title: 'Dolor fuerte de barriga',
    desc: 'Que no se quita al descansar.',
    tone: _Tone.coral,
  ),
  _Signal(
    emoji: '🤕',
    title: 'Dolor de cabeza intenso',
    desc: 'Sobre todo si ves luces o manchas.',
    tone: _Tone.sun,
  ),
  _Signal(
    emoji: '👁️',
    title: 'Visión borrosa',
    desc: 'O ver "lucecitas" de repente.',
    tone: _Tone.sun,
  ),
  _Signal(
    emoji: '🦶',
    title: 'Hinchazón en cara o manos',
    desc: 'Especialmente al despertar.',
    tone: _Tone.sun,
  ),
  _Signal(
    emoji: '🌡️',
    title: 'Fiebre alta (más de 38°)',
    desc: 'Con escalofríos o malestar.',
    tone: _Tone.coral,
  ),
  _Signal(
    emoji: '💧',
    title: 'Pérdida de líquido',
    desc: 'Como si te orinaras sin querer.',
    tone: _Tone.sun,
  ),
  _Signal(
    emoji: '👶',
    title: 'El bebé no se mueve',
    desc: 'Después de las 20 semanas.',
    tone: _Tone.coral,
  ),
];

class AlarmasScreen extends StatefulWidget {
  const AlarmasScreen({super.key});

  @override
  State<AlarmasScreen> createState() => _AlarmasScreenState();
}

class _AlarmasScreenState extends State<AlarmasScreen> {
  int _filter = 0;

  List<_Signal> get _filtered {
    if (_filter == 1) return _signals.where((s) => s.tone == _Tone.coral).toList();
    if (_filter == 2) return _signals.where((s) => s.tone == _Tone.sun).toList();
    return _signals;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _TopBar(),
            _HeroBanner(),
            _FilterRow(current: _filter, onTap: (i) => setState(() => _filter = i)),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(16, 6, 16, 16),
                child: Column(
                  children: [
                    _SignalsGrid(signals: _filtered),
                    const SizedBox(height: 16),
                    const _EmergencyCTA(),
                  ],
                ),
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
          Text(
            'Señales de alarma',
            style: GoogleFonts.quicksand(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppColors.ink,
            ),
          ),
        ],
      ),
    );
  }
}

class _HeroBanner extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFFFFE2E6), Color(0xFFFFCBD3)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(AppColors.rLg),
        ),
        child: Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x4DFF7E91),
                    blurRadius: 12,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: const Icon(Icons.warning_amber_rounded,
                  size: 26, color: AppColors.coral),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Si sientes algo así, ve YA al centro de salud',
                    style: GoogleFonts.quicksand(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.ink,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'No esperes a la próxima cita. Cuidarte es cuidar a tu bebé 💖',
                    style: GoogleFonts.nunito(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.inkSoft,
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

class _FilterRow extends StatelessWidget {
  final int current;
  final void Function(int) onTap;
  const _FilterRow({required this.current, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 6),
      child: Row(
        children: [
          _FilterChip(label: 'Todas', active: current == 0, onTap: () => onTap(0)),
          const SizedBox(width: 8),
          _FilterChip(label: '🩸 Urgente', active: current == 1, onTap: () => onTap(1)),
          const SizedBox(width: 8),
          _FilterChip(
            label: '⚠️ Avisa pronto',
            active: current == 2,
            onTap: () => onTap(2),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool active;
  final VoidCallback onTap;
  const _FilterChip({required this.label, required this.active, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: active ? AppColors.pink400 : Colors.white,
          borderRadius: BorderRadius.circular(AppColors.rPill),
          boxShadow: active ? [] : AppColors.shadowCard,
        ),
        child: Text(
          label,
          style: GoogleFonts.nunito(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: active ? Colors.white : AppColors.inkSoft,
          ),
        ),
      ),
    );
  }
}

class _SignalsGrid extends StatelessWidget {
  final List<_Signal> signals;
  const _SignalsGrid({required this.signals});

  @override
  Widget build(BuildContext context) {
    final rows = <Widget>[];
    for (var i = 0; i < signals.length; i += 2) {
      rows.add(
        IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(child: _SignalCard(signal: signals[i])),
              const SizedBox(width: 10),
              i + 1 < signals.length
                  ? Expanded(child: _SignalCard(signal: signals[i + 1]))
                  : const Expanded(child: SizedBox()),
            ],
          ),
        ),
      );
      if (i + 2 < signals.length) rows.add(const SizedBox(height: 10));
    }
    return Column(children: rows);
  }
}

class _SignalCard extends StatelessWidget {
  final _Signal signal;
  const _SignalCard({required this.signal});

  @override
  Widget build(BuildContext context) {
    final isCoral = signal.tone == _Tone.coral;
    final bg = isCoral ? AppColors.coral50 : AppColors.sun50;
    final fg = isCoral ? AppColors.coral : const Color(0xFFC18620);
    final borderColor = isCoral ? AppColors.coral50 : AppColors.sun50;
    final badge = isCoral ? 'URGENTE' : 'AVISA';

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: borderColor, width: 1.5),
        boxShadow: AppColors.shadowCard,
      ),
      child: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: bg,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Center(
                  child: Text(signal.emoji, style: const TextStyle(fontSize: 24)),
                ),
              ),
              const SizedBox(height: 10),
              Text(
                signal.title,
                style: GoogleFonts.quicksand(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.ink,
                  height: 1.25,
                ),
              ),
              const SizedBox(height: 3),
              Text(
                signal.desc,
                style: GoogleFonts.nunito(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: AppColors.inkSoft,
                  height: 1.35,
                ),
              ),
            ],
          ),
          Positioned(
            top: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
              decoration: BoxDecoration(
                color: bg,
                borderRadius: BorderRadius.circular(AppColors.rPill),
              ),
              child: Text(
                badge,
                style: GoogleFonts.nunito(
                  fontSize: 9,
                  fontWeight: FontWeight.w800,
                  color: fg,
                  letterSpacing: 0.6,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _EmergencyCTA extends StatelessWidget {
  const _EmergencyCTA();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.coral,
        borderRadius: BorderRadius.circular(22),
        boxShadow: const [
          BoxShadow(color: Color(0x59FF7E91), blurRadius: 20, offset: Offset(0, 8)),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.25),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.phone_rounded, color: Colors.white, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'EMERGENCIA',
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: 0.6,
                  ),
                ),
                Text(
                  'Llamar al 106 / SAMU',
                  style: GoogleFonts.quicksand(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right_rounded, color: Colors.white, size: 22),
        ],
      ),
    );
  }
}
