import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/gestante.dart';
import '../../providers/gestante_provider.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nombreCtrl = TextEditingController();
  final _telefonoCtrl = TextEditingController();
  final _hospitalCtrl = TextEditingController();
  final _doctorCtrl = TextEditingController();
  DateTime? _fur;
  bool _saving = false;

  @override
  void dispose() {
    _nombreCtrl.dispose();
    _telefonoCtrl.dispose();
    _hospitalCtrl.dispose();
    _doctorCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickFur() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().subtract(const Duration(days: 70)),
      firstDate: DateTime.now().subtract(const Duration(days: 294)),
      lastDate: DateTime.now(),
      helpText: 'Selecciona la fecha de tu última regla',
      locale: const Locale('es'),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(primary: AppColors.primary),
        ),
        child: child!,
      ),
    );
    if (picked != null) setState(() => _fur = picked);
  }

  Future<void> _guardar() async {
    if (!_formKey.currentState!.validate()) return;
    if (_fur == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor ingresa la fecha de tu última regla'),
          backgroundColor: AppColors.coral,
        ),
      );
      return;
    }

    setState(() => _saving = true);

    final gestante = Gestante(
      nombre: _nombreCtrl.text.trim(),
      fechaUltimaRegla: _fur!.toIso8601String().substring(0, 10),
      telefono: _telefonoCtrl.text.trim().isEmpty ? null : _telefonoCtrl.text.trim(),
      hospital: _hospitalCtrl.text.trim().isEmpty ? null : _hospitalCtrl.text.trim(),
      nombreDoctor: _doctorCtrl.text.trim().isEmpty ? null : _doctorCtrl.text.trim(),
      createdAt: DateTime.now().toIso8601String(),
    );

    await context.read<GestanteProvider>().registrarGestante(gestante);

    if (mounted) {
      Navigator.of(context).pushReplacementNamed('/main');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16),
                const Center(child: Text('🤱', style: TextStyle(fontSize: 64))),
                const SizedBox(height: 16),
                const Center(
                  child: Text(
                    '¡Bienvenida!',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w800,
                      color: AppColors.primary,
                    ),
                  ),
                ),
                const Center(
                  child: Text(
                    'Cuéntanos un poco sobre ti',
                    style: TextStyle(fontSize: 16, color: AppColors.textSecondary),
                  ),
                ),
                const SizedBox(height: 32),
                _label('¿Cuál es tu nombre? *'),
                TextFormField(
                  controller: _nombreCtrl,
                  decoration: const InputDecoration(
                    hintText: 'Tu nombre completo',
                    prefixIcon: Icon(Icons.person_outline, color: AppColors.primary),
                  ),
                  textCapitalization: TextCapitalization.words,
                  validator: (v) =>
                      v == null || v.trim().isEmpty ? 'Por favor ingresa tu nombre' : null,
                ),
                const SizedBox(height: 20),
                _label('¿Cuándo fue tu última regla? *'),
                GestureDetector(
                  onTap: _pickFur,
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(
                        color: _fur != null ? AppColors.primary : AppColors.cardBorder,
                        width: _fur != null ? 2 : 1,
                      ),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.calendar_today,
                          color: _fur != null ? AppColors.primary : AppColors.textHint,
                        ),
                        const SizedBox(width: 12),
                        Text(
                          _fur != null
                              ? DateFormat('dd/MM/yyyy').format(_fur!)
                              : 'Seleccionar fecha',
                          style: TextStyle(
                            color: _fur != null ? AppColors.textPrimary : AppColors.textHint,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                _label('Teléfono (opcional)'),
                TextFormField(
                  controller: _telefonoCtrl,
                  decoration: const InputDecoration(
                    hintText: 'Ej: 999 888 777',
                    prefixIcon: Icon(Icons.phone_outlined, color: AppColors.primary),
                  ),
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 20),
                _label('Centro de salud u hospital (opcional)'),
                TextFormField(
                  controller: _hospitalCtrl,
                  decoration: const InputDecoration(
                    hintText: 'Ej: Hospital Regional de Pucallpa',
                    prefixIcon: Icon(Icons.local_hospital_outlined, color: AppColors.primary),
                  ),
                  textCapitalization: TextCapitalization.words,
                ),
                const SizedBox(height: 20),
                _label('Nombre del médico o obstetra (opcional)'),
                TextFormField(
                  controller: _doctorCtrl,
                  decoration: const InputDecoration(
                    hintText: 'Ej: Dra. García',
                    prefixIcon: Icon(Icons.medical_services_outlined, color: AppColors.primary),
                  ),
                  textCapitalization: TextCapitalization.words,
                ),
                const SizedBox(height: 32),
                ElevatedButton(
                  onPressed: _saving ? null : _guardar,
                  child: _saving
                      ? const SizedBox(
                          height: 22,
                          width: 22,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2.5,
                          ),
                        )
                      : const Text('Comenzar'),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _label(String text) => Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Text(
          text,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 15,
            color: AppColors.textPrimary,
          ),
        ),
      );
}
