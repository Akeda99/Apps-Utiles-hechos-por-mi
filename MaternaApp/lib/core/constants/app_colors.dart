import 'package:flutter/material.dart';

class AppColors {
  // ─── Pink scale ───────────────────────────────────────────────────
  static const Color pink50  = Color(0xFFFFF5F8);
  static const Color pink100 = Color(0xFFFFE5EC);
  static const Color pink150 = Color(0xFFFFD4DF);
  static const Color pink200 = Color(0xFFFFB6CC);
  static const Color pink400 = Color(0xFFFF94B0);
  static const Color pink500 = Color(0xFFF06A8E);

  // ─── Mint scale ───────────────────────────────────────────────────
  static const Color mint50  = Color(0xFFF1FAF5);
  static const Color mint100 = Color(0xFFDEF4E8);
  static const Color mint200 = Color(0xFFB8E8CD);
  static const Color mint400 = Color(0xFF8FD9B6);
  static const Color mint600 = Color(0xFF4FAA82);

  // ─── Neutral / cream ─────────────────────────────────────────────
  static const Color cream   = Color(0xFFFFFCFD);
  static const Color cream2  = Color(0xFFFFF8FA);
  static const Color ink     = Color(0xFF3F2E37);
  static const Color inkSoft = Color(0xFF6E5B65);
  static const Color inkFaint= Color(0xFFA89AA1);
  static const Color line    = Color(0xFFF2DDE4);

  // ─── Accent tones ────────────────────────────────────────────────
  static const Color coral   = Color(0xFFFF7E91);
  static const Color coral50 = Color(0xFFFFE2E6);
  static const Color sun     = Color(0xFFFFC971);
  static const Color sun50   = Color(0xFFFFF3DC);
  static const Color sky     = Color(0xFFBCE0F5);
  static const Color sky50   = Color(0xFFEAF5FC);
  static const Color lilac   = Color(0xFFD6C2EE);
  static const Color lilac50 = Color(0xFFF1EAFB);
  static const Color lilacFg = Color(0xFF7A5BB0);
  static const Color sunFg   = Color(0xFFB07419);

  // ─── Shadows ─────────────────────────────────────────────────────
  static const List<BoxShadow> shadowCard = [
    BoxShadow(color: Color(0x14C06384), blurRadius: 18, offset: Offset(0, 6)),
    BoxShadow(color: Color(0x0AC06384), blurRadius: 2,  offset: Offset(0, 1)),
  ];
  static const List<BoxShadow> shadowPop = [
    BoxShadow(color: Color(0x2EC06384), blurRadius: 32, offset: Offset(0, 14)),
  ];

  // ─── Radius helpers ──────────────────────────────────────────────
  static const double rSm   = 12;
  static const double rMd   = 18;
  static const double rLg   = 24;
  static const double rXl   = 28;
  static const double rPill = 999;

  // ─── Legacy aliases (keep screens compiling during migration) ────
  static const Color primary      = pink400;
  static const Color primaryDark  = pink500;
  static const Color primaryLight = pink100;
  static const Color secondary    = mint600;
  static const Color secondaryLight = mint100;
  static const Color danger       = coral;
  static const Color background   = cream;
  static const Color cardBorder   = line;
  static const Color divider      = line;
  static const Color textPrimary  = ink;
  static const Color textSecondary= inkSoft;
  static const Color textHint     = inkFaint;
}
