import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'core/constants/app_colors.dart';
import 'providers/gestante_provider.dart';
import 'screens/splash/splash_screen.dart';
import 'screens/onboarding/onboarding_screen.dart';
import 'screens/calculadora/calculadora_screen.dart';
import 'screens/alarmas/alarmas_screen.dart';
import 'screens/citas/citas_screen.dart';
import 'widgets/main_scaffold.dart';

class MaternaApp extends StatelessWidget {
  const MaternaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MaternaApp',
      debugShowCheckedModeBanner: false,
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [Locale('es')],
      locale: const Locale('es'),
      theme: _buildTheme(),
      home: const _RootRouter(),
      routes: {
        '/onboarding':  (_) => const OnboardingScreen(),
        '/main':        (_) => const MainScaffold(),
        '/calculadora': (_) => const CalculadoraScreen(),
        '/alarmas':     (_) => const AlarmasScreen(),
        '/citas':       (_) => const CitasScreen(),
      },
    );
  }

  ThemeData _buildTheme() {
    final base = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.pink400,
        primary: AppColors.pink400,
        secondary: AppColors.mint600,
        surface: AppColors.cream,
      ),
      scaffoldBackgroundColor: AppColors.cream,
    );

    return base.copyWith(
      textTheme: GoogleFonts.nunitoTextTheme(base.textTheme).copyWith(
        displayLarge:  GoogleFonts.quicksand(fontWeight: FontWeight.w700, color: AppColors.ink),
        displayMedium: GoogleFonts.quicksand(fontWeight: FontWeight.w700, color: AppColors.ink),
        displaySmall:  GoogleFonts.quicksand(fontWeight: FontWeight.w700, color: AppColors.ink),
        headlineMedium:GoogleFonts.quicksand(fontWeight: FontWeight.w700, color: AppColors.ink),
        headlineSmall: GoogleFonts.quicksand(fontWeight: FontWeight.w600, color: AppColors.ink),
        titleLarge:    GoogleFonts.quicksand(fontWeight: FontWeight.w700, color: AppColors.ink),
        titleMedium:   GoogleFonts.quicksand(fontWeight: FontWeight.w600, color: AppColors.ink),
        bodyLarge:     GoogleFonts.nunito(color: AppColors.ink),
        bodyMedium:    GoogleFonts.nunito(color: AppColors.ink),
        bodySmall:     GoogleFonts.nunito(color: AppColors.inkSoft),
        labelLarge:    GoogleFonts.nunito(fontWeight: FontWeight.w700, color: AppColors.ink),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.cream,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.quicksand(
          fontSize: 19, fontWeight: FontWeight.w700, color: AppColors.ink,
        ),
        iconTheme: const IconThemeData(color: AppColors.inkFaint),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.pink400,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: const StadiumBorder(),
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
          textStyle: GoogleFonts.nunito(fontSize: 15, fontWeight: FontWeight.w700),
          minimumSize: const Size(double.infinity, 50),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.pink50,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppColors.rMd),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppColors.rMd),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppColors.rMd),
          borderSide: const BorderSide(color: AppColors.pink200, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        labelStyle: GoogleFonts.nunito(
          fontSize: 11, fontWeight: FontWeight.w800,
          color: AppColors.pink500, letterSpacing: 0.8,
        ),
      ),
    );
  }
}

class _RootRouter extends StatelessWidget {
  const _RootRouter();

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<GestanteProvider>();
    if (provider.loading) return const SplashScreen();
    if (!provider.isRegistered) return const OnboardingScreen();
    return const MainScaffold();
  }
}
