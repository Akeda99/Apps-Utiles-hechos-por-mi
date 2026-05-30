import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../screens/home/home_screen.dart';
import '../screens/chatbot/chatbot_screen.dart';
import '../screens/controles/controles_screen.dart';
import '../screens/perfil/perfil_screen.dart';

class MainScaffold extends StatefulWidget {
  const MainScaffold({super.key});

  @override
  State<MainScaffold> createState() => MainScaffoldState();
}

class MainScaffoldState extends State<MainScaffold> {
  int _currentIndex = 0;

  void setTab(int index) => setState(() => _currentIndex = index);

  static const _screens = [
    HomeScreen(),
    ChatbotScreen(),
    ControlesScreen(),
    PerfilScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _currentIndex, children: _screens),
      bottomNavigationBar: _MSTabBar(current: _currentIndex, onTap: setTab),
    );
  }
}

class _MSTabBar extends StatelessWidget {
  final int current;
  final void Function(int) onTap;
  const _MSTabBar({required this.current, required this.onTap});

  static const _tabs = [
    _Tab(icon: Icons.cottage_outlined,        label: 'Inicio'),
    _Tab(icon: Icons.chat_bubble_outline_rounded, label: 'Conversa'),
    _Tab(icon: Icons.description_outlined,    label: 'Controles'),
    _Tab(icon: Icons.person_outline_rounded,  label: 'Mi perfil'),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: AppColors.line, width: 1)),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 64,
          child: Row(
            children: List.generate(_tabs.length, (i) {
              final selected = i == current;
              return Expanded(
                child: GestureDetector(
                  onTap: () => onTap(i),
                  behavior: HitTestBehavior.opaque,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 180),
                    margin: const EdgeInsets.symmetric(horizontal: 6, vertical: 8),
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    decoration: BoxDecoration(
                      color: selected ? AppColors.pink50 : Colors.transparent,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          _tabs[i].icon,
                          size: 22,
                          color: selected ? AppColors.pink500 : AppColors.inkFaint,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          _tabs[i].label,
                          style: GoogleFonts.nunito(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: selected ? AppColors.pink500 : AppColors.inkFaint,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

class _Tab {
  final IconData icon;
  final String label;
  const _Tab({required this.icon, required this.label});
}
