import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/gestante.dart';
import '../../providers/gestante_provider.dart';
import '../../widgets/main_scaffold.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<GestanteProvider>();
    final gestante = provider.gestante!;

    return Scaffold(
      backgroundColor: AppColors.cream,
      body: SafeArea(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            _TopBar(gestante: gestante),
            const SizedBox(height: 6),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: _HeroCard(gestante: gestante),
            ),
            const SizedBox(height: 14),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: _ProximaCitaSection(provider: provider),
            ),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: _QuickActions(gestante: gestante),
            ),
            const SizedBox(height: 14),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
              child: _TipDelDia(semanas: gestante.semanasGestacion),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Top bar ──────────────────────────────────────────────────────────────────

class _TopBar extends StatelessWidget {
  final Gestante gestante;
  const _TopBar({required this.gestante});

  @override
  Widget build(BuildContext context) {
    final firstName = gestante.nombre.split(' ').first;
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 14, 20, 6),
      child: Row(
        children: [
          _Avatar(initials: _initials(gestante.nombre)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('¡Buenos días, mami!',
                    style: GoogleFonts.nunito(
                        fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.inkFaint)),
                Text(firstName,
                    style: GoogleFonts.quicksand(
                        fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.ink)),
              ],
            ),
          ),
          _BellButton(
            hasNotification: context.watch<GestanteProvider>().proximaCita != null,
            onTap: () => _showCitasSheet(context),
          ),
        ],
      ),
    );
  }

  String _initials(String nombre) {
    final parts = nombre.trim().split(' ');
    if (parts.length >= 2) return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    return parts[0].substring(0, min(2, parts[0].length)).toUpperCase();
  }

  void _showCitasSheet(BuildContext context) {
    final citas = context.read<GestanteProvider>().citas
        .where((c) => c.esFutura)
        .toList()
      ..sort((a, b) => a.fechaHora.compareTo(b.fechaHora));

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => _CitasSheet(citas: citas),
    );
  }
}

class _Avatar extends StatelessWidget {
  final String initials;
  const _Avatar({required this.initials});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 44, height: 44,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFFFCFE0), AppColors.pink200],
        ),
        boxShadow: [
          BoxShadow(color: Colors.white, spreadRadius: 2, blurRadius: 0),
          BoxShadow(color: AppColors.pink150, spreadRadius: 4, blurRadius: 0),
        ],
      ),
      child: Center(
        child: Text(initials,
            style: GoogleFonts.quicksand(
                fontSize: 17, fontWeight: FontWeight.w700, color: Colors.white)),
      ),
    );
  }
}

class _BellButton extends StatelessWidget {
  final bool hasNotification;
  final VoidCallback onTap;
  const _BellButton({required this.hasNotification, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
      width: 38, height: 38,
      decoration: BoxDecoration(
        color: AppColors.pink100, borderRadius: BorderRadius.circular(14),
      ),
      child: Stack(
        children: [
          Center(
            child: Icon(Icons.notifications_none_rounded,
                size: 20, color: AppColors.pink500),
          ),
          if (hasNotification)
            Positioned(
              top: 7, right: 7,
              child: Container(
                width: 8, height: 8,
                decoration: const BoxDecoration(
                  color: AppColors.coral, shape: BoxShape.circle,
                ),
              ),
            ),
        ],
      ),
    ),
    );
  }
}

// ─── Hero card ────────────────────────────────────────────────────────────────

class _HeroCard extends StatelessWidget {
  final Gestante gestante;
  const _HeroCard({required this.gestante});

  @override
  Widget build(BuildContext context) {
    final semanas = gestante.semanasGestacion;
    final dias = gestante.diasGestacion % 7;
    final pct = semanas / 40.0;
    final fruta = _BabySize.deSemana(semanas);

    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFFFE5EC), Color(0xFFFFD0DE), Color(0xFFFFC7DA)],
        ),
        borderRadius: BorderRadius.circular(28),
      ),
      padding: const EdgeInsets.all(20),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          // decorative blobs
          Positioned(
            right: -30, top: -30,
            child: Container(
              width: 130, height: 130,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.45),
              ),
            ),
          ),
          Positioned(
            right: 30, top: 40,
            child: Container(
              width: 50, height: 50,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.5),
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Trimestre chip
              _Chip(
                label: gestante.trimestre,
                icon: Icons.eco_outlined,
                bg: AppColors.mint100, fg: AppColors.mint600,
              ),
              const SizedBox(height: 12),
              // Week number
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text('$semanas',
                      style: GoogleFonts.quicksand(
                          fontSize: 64, fontWeight: FontWeight.w700,
                          color: AppColors.ink, height: 1)),
                  const SizedBox(width: 10),
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('semanas',
                            style: GoogleFonts.quicksand(
                                fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.ink)),
                        Text('+ $dias días',
                            style: GoogleFonts.nunito(
                                fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.inkSoft)),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              RichText(
                text: TextSpan(
                  style: GoogleFonts.nunito(
                      fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.inkSoft),
                  children: [
                    const TextSpan(text: 'Tu bebé es del tamaño de '),
                    TextSpan(
                      text: fruta.nombre,
                      style: const TextStyle(color: AppColors.pink500, fontWeight: FontWeight.w800),
                    ),
                    const TextSpan(text: ' 🌱'),
                  ],
                ),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.6),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      '📏 aprox. ${fruta.cm} de largo',
                      style: GoogleFonts.nunito(
                          fontSize: 11, fontWeight: FontWeight.w700,
                          color: AppColors.inkSoft),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              // Progress bar
              ClipRRect(
                borderRadius: BorderRadius.circular(999),
                child: Container(
                  height: 10,
                  color: Colors.white.withOpacity(0.7),
                  child: FractionallySizedBox(
                    widthFactor: pct.clamp(0.02, 1.0),
                    alignment: Alignment.centerLeft,
                    child: Container(
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          colors: [AppColors.mint400, AppColors.pink400],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Semana 1',
                      style: GoogleFonts.nunito(
                          fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.inkSoft)),
                  Text('Semana 40',
                      style: GoogleFonts.nunito(
                          fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.inkSoft)),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

}

// ─── Citas sheet ─────────────────────────────────────────────────────────────

class _CitasSheet extends StatelessWidget {
  final List citas;
  const _CitasSheet({required this.citas});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40, height: 4,
              decoration: BoxDecoration(
                color: AppColors.line,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              const Icon(Icons.notifications_none_rounded, size: 20, color: AppColors.pink500),
              const SizedBox(width: 8),
              Text(
                'Tus próximas citas',
                style: GoogleFonts.quicksand(
                  fontSize: 17, fontWeight: FontWeight.w700, color: AppColors.ink,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          if (citas.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 24),
              decoration: BoxDecoration(
                color: AppColors.pink50,
                borderRadius: BorderRadius.circular(AppColors.rMd),
              ),
              child: Column(
                children: [
                  const Text('📅', style: TextStyle(fontSize: 28)),
                  const SizedBox(height: 8),
                  Text(
                    'No tienes citas próximas',
                    style: GoogleFonts.nunito(
                      fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.inkSoft,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Puedes agregarlas en la pestaña Controles',
                    style: GoogleFonts.nunito(
                      fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.inkFaint,
                    ),
                  ),
                ],
              ),
            )
          else
            ...citas.take(5).map((c) => _CitaTile(cita: c)),
        ],
      ),
    );
  }
}

class _CitaTile extends StatelessWidget {
  final dynamic cita;
  const _CitaTile({required this.cita});

  @override
  Widget build(BuildContext context) {
    final fecha = DateFormat('d MMM', 'es').format(cita.fechaHora);
    final diaSemana = DateFormat('EEE', 'es').format(cita.fechaHora).toUpperCase();
    final dias = cita.diasFaltantes;
    final esHoy = dias == 0;
    final esManana = dias == 1;
    final etiqueta = esHoy ? '¡Hoy!' : esManana ? 'Manana' : 'En $dias dias';
    final colorEtiqueta = esHoy ? AppColors.coral : esManana ? AppColors.sunFg : AppColors.mint600;
    final bgEtiqueta = esHoy ? AppColors.coral.withOpacity(0.12) : esManana ? AppColors.sun50 : AppColors.mint50;

    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Container(
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppColors.rMd),
          boxShadow: AppColors.shadowCard,
        ),
        child: Row(
          children: [
            Container(
              width: 44, height: 44,
              decoration: BoxDecoration(
                color: AppColors.pink50,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(diaSemana,
                      style: GoogleFonts.nunito(
                          fontSize: 9, fontWeight: FontWeight.w800, color: AppColors.pink500)),
                  Text(fecha.split(' ')[0],
                      style: GoogleFonts.quicksand(
                          fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.ink, height: 1)),
                  Text(fecha.split(' ')[1].toUpperCase(),
                      style: GoogleFonts.nunito(
                          fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.inkFaint)),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(cita.tipo,
                      style: GoogleFonts.quicksand(
                          fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.ink)),
                  if (cita.hospital != null && cita.hospital!.isNotEmpty)
                    Text(cita.hospital!,
                        style: GoogleFonts.nunito(
                            fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.inkSoft)),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: bgEtiqueta,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(etiqueta,
                        style: GoogleFonts.nunito(
                            fontSize: 11, fontWeight: FontWeight.w800, color: colorEtiqueta)),
                  ),
                ],
              ),
            ),
            Text(cita.hora,
                style: GoogleFonts.quicksand(
                    fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.inkSoft)),
          ],
        ),
      ),
    );
  }
}

class _BabySize {
  final String nombre;
  final String cm;
  const _BabySize(this.nombre, this.cm);

  static _BabySize deSemana(int s) {
    if (s <= 5)  return const _BabySize('una semilla de sésamo',   '0.2 cm');
    if (s <= 6)  return const _BabySize('una semilla de lenteja',  '0.4 cm');
    if (s <= 7)  return const _BabySize('un arándano',             '1.0 cm');
    if (s <= 8)  return const _BabySize('un frijol',               '1.6 cm');
    if (s <= 9)  return const _BabySize('una uva',                 '2.3 cm');
    if (s <= 10) return const _BabySize('una fresa',               '3.1 cm');
    if (s <= 11) return const _BabySize('un higo',                 '4.1 cm');
    if (s <= 12) return const _BabySize('un limón',                '5.4 cm');
    if (s <= 13) return const _BabySize('un durazno pequeño',      '7.4 cm');
    if (s <= 14) return const _BabySize('un durazno',              '8.7 cm');
    if (s <= 15) return const _BabySize('una manzana',            '10.1 cm');
    if (s <= 16) return const _BabySize('un aguacate',            '11.6 cm');
    if (s <= 17) return const _BabySize('una pera',               '13.0 cm');
    if (s <= 18) return const _BabySize('un mango',               '14.2 cm');
    if (s <= 19) return const _BabySize('un tomate grande',       '15.3 cm');
    if (s <= 20) return const _BabySize('un plátano',             '16.4 cm');
    if (s <= 21) return const _BabySize('una zanahoria',          '18.0 cm');
    if (s <= 22) return const _BabySize('un coco pequeño',        '19.0 cm');
    if (s <= 23) return const _BabySize('una papaya pequeña',     '20.8 cm');
    if (s <= 24) return const _BabySize('un choclo',              '21.3 cm');
    if (s <= 25) return const _BabySize('una coliflor',           '22.4 cm');
    if (s <= 26) return const _BabySize('un pepino',              '23.0 cm');
    if (s <= 27) return const _BabySize('un pijuayo',             '24.0 cm');
    if (s <= 28) return const _BabySize('una berenjena',          '25.0 cm');
    if (s <= 29) return const _BabySize('una calabaza pequeña',   '26.7 cm');
    if (s <= 30) return const _BabySize('un repollo',             '28.0 cm');
    if (s <= 32) return const _BabySize('una piña grande',        '42.4 cm');
    if (s <= 34) return const _BabySize('un melón',               '45.0 cm');
    if (s <= 36) return const _BabySize('una lechuga grande',     '47.4 cm');
    if (s <= 38) return const _BabySize('un puerro gigante',      '49.8 cm');
    return const _BabySize('un bebé listo para nacer',            '~51.0 cm');
  }
}

// ─── Próxima cita ─────────────────────────────────────────────────────────────

class _ProximaCitaSection extends StatelessWidget {
  final GestanteProvider provider;
  const _ProximaCitaSection({required this.provider});

  @override
  Widget build(BuildContext context) {
    final cita = provider.proximaCita;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Próxima cita prenatal',
                style: GoogleFonts.quicksand(
                    fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.ink)),
            GestureDetector(
                  onTap: () => Navigator.pushNamed(context, '/citas'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.pink400,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.add_rounded, size: 14, color: Colors.white),
                        const SizedBox(width: 3),
                        Text('Añadir',
                            style: GoogleFonts.nunito(
                                fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white)),
                      ],
                    ),
                  ),
                ),
          ],
        ),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppColors.rLg),
            boxShadow: AppColors.shadowCard,
          ),
          padding: const EdgeInsets.all(14),
          child: cita == null
              ? _NoCita()
              : Row(
                  children: [
                    // Date block
                    Container(
                      width: 56,
                      decoration: BoxDecoration(
                        color: AppColors.mint100,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Column(
                        children: [
                          Text(
                            DateFormat('MMM', 'es').format(DateTime.parse(cita.fecha)).toUpperCase(),
                            style: GoogleFonts.nunito(
                                fontSize: 11, fontWeight: FontWeight.w800,
                                color: AppColors.mint600, letterSpacing: 0.8),
                          ),
                          Text(
                            DateFormat('d').format(DateTime.parse(cita.fecha)),
                            style: GoogleFonts.quicksand(
                                fontSize: 24, fontWeight: FontWeight.w700,
                                color: AppColors.ink, height: 1.1),
                          ),
                          Text(
                            DateFormat('EEEE', 'es').format(DateTime.parse(cita.fecha)).substring(0, 3),
                            style: GoogleFonts.nunito(
                                fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.mint600),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(cita.tipo,
                              style: GoogleFonts.quicksand(
                                  fontWeight: FontWeight.w600, fontSize: 15, color: AppColors.ink)),
                          const SizedBox(height: 3),
                          Text(
                            '${cita.hospital ?? "Sin hospital"} · ${cita.hora}',
                            style: GoogleFonts.nunito(
                                fontSize: 12, color: AppColors.inkSoft),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              _Chip(
                                label: cita.diasFaltantes == 0
                                    ? '¡Hoy!'
                                    : cita.diasFaltantes == 1
                                        ? 'Mañana'
                                        : 'en ${cita.diasFaltantes} días',
                                bg: AppColors.pink100, fg: AppColors.pink500,
                              ),
                              if (cita.doctor != null) ...[
                                const SizedBox(width: 6),
                                _Chip(
                                  label: cita.doctor!,
                                  bg: AppColors.mint100, fg: AppColors.mint600,
                                ),
                              ],
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
        ),
      ],
    );
  }
}

class _NoCita extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Container(
              width: 44, height: 44,
              decoration: BoxDecoration(
                color: AppColors.mint50,
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Center(child: Text('📅', style: TextStyle(fontSize: 22))),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Sin citas programadas',
                      style: GoogleFonts.quicksand(
                          fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.ink)),
                  Text('Agenda tu próxima cita prenatal',
                      style: GoogleFonts.nunito(
                          fontSize: 12, color: AppColors.inkSoft)),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: () => Navigator.pushNamed(context, '/citas'),
            icon: const Icon(Icons.add_rounded, size: 18),
            label: const Text('Agendar cita'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
          ),
        ),
      ],
    );
  }
}

// ─── Quick actions grid ───────────────────────────────────────────────────────

class _QuickActions extends StatelessWidget {
  final Gestante gestante;
  const _QuickActions({required this.gestante});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 10),
          child: Text('Hoy puedes…',
              style: GoogleFonts.quicksand(
                  fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.ink)),
        ),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          childAspectRatio: 1.45,
          children: [
            _ActionCard(
              tone: _Tone.mint,
              title: 'Conversa con\nMami-bot',
              sub: 'Pregunta lo que quieras',
              icon: Icons.chat_bubble_outline_rounded,
              onTap: () => context.findAncestorStateOfType<MainScaffoldState>()?.setTab(1),
            ),
            _ActionCard(
              tone: _Tone.coral,
              title: 'Señales de\nalarma',
              sub: 'Revisa cuándo ir al centro',
              icon: Icons.warning_amber_rounded,
              onTap: () => Navigator.pushNamed(context, '/alarmas'),
            ),
            _ActionCard(
              tone: _Tone.pink,
              title: 'Anota tu\ncontrol',
              sub: 'Peso, presión, ánimo',
              icon: Icons.description_outlined,
              onTap: () => context.findAncestorStateOfType<MainScaffoldState>()?.setTab(2),
            ),
            _ActionCard(
              tone: _Tone.lilac,
              title: 'Calculadora\nFUR',
              sub: '¿Cuántas semanas tengo?',
              icon: Icons.calculate_outlined,
              onTap: () => Navigator.pushNamed(context, '/calculadora'),
            ),
          ],
        ),
      ],
    );
  }
}

enum _Tone { mint, coral, pink, lilac }

class _ActionCard extends StatelessWidget {
  final _Tone tone;
  final String title;
  final String sub;
  final IconData icon;
  final VoidCallback onTap;

  const _ActionCard({
    required this.tone, required this.title, required this.sub,
    required this.icon, required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final (Color bg, Color fg) = switch (tone) {
      _Tone.mint  => (AppColors.mint100,  AppColors.mint600),
      _Tone.coral => (AppColors.coral50,  AppColors.coral),
      _Tone.pink  => (AppColors.pink100,  AppColors.pink500),
      _Tone.lilac => (AppColors.lilac50,  AppColors.lilacFg),
    };

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: AppColors.shadowCard,
        ),
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 40, height: 40,
              decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(14)),
              child: Icon(icon, size: 20, color: fg),
            ),
            const SizedBox(height: 10),
            Text(title,
                style: GoogleFonts.quicksand(
                    fontWeight: FontWeight.w600, fontSize: 13,
                    color: AppColors.ink, height: 1.2)),
            const SizedBox(height: 2),
            Text(sub,
                style: GoogleFonts.nunito(
                    fontSize: 11, color: AppColors.inkSoft, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}

// ─── Tip del día ──────────────────────────────────────────────────────────────

const _tips = [
  'Toma tu ácido fólico todos los días. Tu bebé lo necesita para desarrollarse bien 💊',
  'Toma 10 vasos de agua hoy. El calor de Ucayali hace que necesites más hidratación 💧',
  'Duerme de lado izquierdo para mejorar la circulación hacia tu bebé 🌙',
  'Cuida tu postura al caminar y sentarte. ¡Tu espalda te lo agradecerá! 🌸',
  'Come camu camu hoy — tiene más vitamina C que cualquier otra fruta del mundo 🍋',
  'Toca tu barriga y háblale a tu bebé. Desde la semana 16 puede escucharte 🎵',
  'El aguaje de Ucayali está lleno de vitamina A para el desarrollo de los ojos de tu bebé 🌴',
  'Si tienes calambres en las piernas, come un plátano — el potasio ayuda mucho 🍌',
  'No cargues cosas pesadas. Pide ayuda sin sentirte mal por eso 💪',
  'Lávate las manos antes de cada comida — previene infecciones que pueden afectar al bebé 🙌',
  'Ventila bien tu cuarto en las mañanas frescas y usa mosquitero en la noche 🌿',
  'El pijuayo sancochado te da energía y vitaminas. ¡Una de las mejores frutas amazónicas! ✨',
  'Ve a tu puesto de salud a recoger tu hierro y ácido fólico. ¡Son GRATUITOS! 🏥',
  'Cuenta los movimientos de tu bebé en la tarde. Deben ser al menos 10 en 1 hora 👶',
  'Descansa entre las 12 y 3 pm. El calor amazónico cansa más durante el embarazo ☀️',
  'Come inchicapi esta semana — la gallina con maní tiene proteína y ácido fólico 🍲',
  'Toma el hierro con jugo de camu camu o limón para que se absorba mejor 🍋',
  'Usa mosquitero esta noche — el dengue y la malaria son más peligrosos en el embarazo 🦟',
  'Come zapallo o zanahoria esta semana — ricos en vitamina A para los ojos de tu bebé 🥕',
  'No te quedes sola con tus emociones. Habla con alguien de confianza sobre cómo te sientes ❤️',
  'Camina suavemente por las mañanas — 20 minutos al día mejoran tu circulación y el sueño 🚶',
  'Cepíllate los dientes 3 veces al día. El embarazo puede afectar las encías 🦷',
  'La patarashca de paiche es una de las mejores comidas para el embarazo en Ucayali 🐟',
  'Anota en tu app cualquier síntoma nuevo para comentarlo en tu próximo control 📋',
  'No te automediques. Cualquier pastilla o hierba, primero consulta a la obstetra 🏥',
  'Duerme con ventilación — el calor puede dificultar el descanso y el sueño 🌬️',
  'Los controles prenatales en el puesto de salud son completamente GRATUITOS ✅',
  'Cántale a tu bebé — ya puede reconocer tu voz y calmarse con ella 🎶',
  'Come yuca sancochada — fácil de digerir, te da energía y tiene fibra buena 🌿',
  'Come 5 veces al día en porciones pequeñas en vez de 3 comidas grandes 🍽️',
  'El jugo de cocona te hidrata y ayuda a la digestión. ¡Tómalo sin mucha azúcar! 🍊',
  'No te bañes con agua muy fría — agua tibia es mejor durante el embarazo 🚿',
  'Evita la chicha fermentada y el masato. Ninguna cantidad de alcohol es segura en el embarazo 🚫',
  'Usa ropa de algodón clara y holgada — así el calor de Ucayali te afecta menos ☁️',
  'Si sientes acidez, evita el tacacho muy grasoso y las frituras esta semana 🔥',
  'El inchicapi tiene maní, que es una fuente natural de ácido fólico. ¡Cómelo seguido! 🥜',
  'Duerme con una almohada entre las rodillas — alivia el dolor de espalda 🛏️',
  'Asegúrate de tomar agua hervida o filtrada. El agua de río sin tratar puede tener parásitos 💧',
  'Habla con tu pareja o familia sobre cómo te sientes. ¡No tienes que pasar esto sola! 👨‍👩‍👧',
  'El ungurahui tiene ácidos grasos buenos para el desarrollo cerebral de tu bebé 🌴',
];

class _TipDelDia extends StatelessWidget {
  final int semanas;
  const _TipDelDia({required this.semanas});

  String get _tipHoy {
    final now = DateTime.now();
    final diaDelAnio = now.difference(DateTime(now.year, 1, 1)).inDays;
    // Cambia cada día y varía también según las semanas de gestación
    final indice = (diaDelAnio + semanas) % _tips.length;
    return _tips[indice];
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.sun50,
        borderRadius: BorderRadius.circular(22),
      ),
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          Container(
            width: 44, height: 44,
            decoration: BoxDecoration(
              color: Colors.white, borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.auto_awesome, size: 22, color: Color(0xFFD08A1F)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('TIP DEL DÍA',
                    style: GoogleFonts.nunito(
                        fontSize: 11, fontWeight: FontWeight.w800,
                        color: AppColors.sunFg, letterSpacing: 0.8)),
                const SizedBox(height: 2),
                Text(
                  _tipHoy,
                  style: GoogleFonts.quicksand(
                      fontWeight: FontWeight.w600, fontSize: 13,
                      color: AppColors.ink, height: 1.3),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Shared chip ─────────────────────────────────────────────────────────────

class _Chip extends StatelessWidget {
  final String label;
  final Color bg;
  final Color fg;
  final IconData? icon;

  const _Chip({required this.label, required this.bg, required this.fg, this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(999)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 12, color: fg),
            const SizedBox(width: 4),
          ],
          Text(label,
              style: GoogleFonts.nunito(
                  fontSize: 11, fontWeight: FontWeight.w800,
                  color: fg, letterSpacing: 0.3)),
        ],
      ),
    );
  }
}
