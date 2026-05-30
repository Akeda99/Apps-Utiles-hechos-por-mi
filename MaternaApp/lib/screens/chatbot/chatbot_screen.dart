import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../data/chatbot_tree.dart';
import '../../providers/gestante_provider.dart';

class _ChatMessage {
  final String text;
  final bool isBot;
  final bool isAlert;
  _ChatMessage({required this.text, required this.isBot, this.isAlert = false});
}

class ChatbotScreen extends StatefulWidget {
  const ChatbotScreen({super.key});

  @override
  State<ChatbotScreen> createState() => _ChatbotScreenState();
}

class _ChatbotScreenState extends State<ChatbotScreen> {
  final List<_ChatMessage> _messages = [];
  final List<String> _history = [];
  String _currentNodeId = 'root';
  final ScrollController _scrollCtrl = ScrollController();

  @override
  void initState() {
    super.initState();
    _loadNode('root', addWelcome: true);
  }

  @override
  void dispose() {
    _scrollCtrl.dispose();
    super.dispose();
  }

  ChatNode get _currentNode => chatNodes[_currentNodeId]!;

  void _loadNode(String nodeId, {bool addWelcome = false}) {
    final node = chatNodes[nodeId]!;
    setState(() {
      _currentNodeId = nodeId;
      if (addWelcome || _messages.isNotEmpty) {
        _messages.add(_ChatMessage(
          text: node.message,
          isBot: true,
          isAlert: node.isAlert,
        ));
      }
    });
    _scrollToBottom();
  }

  void _selectOption(ChatOption option) {
    setState(() {
      _messages.add(_ChatMessage(text: option.label, isBot: false));
      _history.add(_currentNodeId);
    });
    _scrollToBottom();
    Future.delayed(const Duration(milliseconds: 300), () {
      _loadNode(option.nodeId);
    });
  }

  void _goBack() {
    if (_history.isEmpty) return;
    final prev = _history.removeLast();
    setState(() => _messages.add(_ChatMessage(text: '⬅️ Volver', isBot: false)));
    Future.delayed(const Duration(milliseconds: 200), () => _loadNode(prev));
  }

  void _restart() {
    setState(() {
      _messages.clear();
      _history.clear();
    });
    _loadNode('root', addWelcome: true);
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(
          _scrollCtrl.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  String get _userName {
    final g = context.read<GestanteProvider>().gestante;
    if (g == null) return 'amiga';
    final parts = g.nombre.trim().split(' ');
    return parts.first;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream2,
      body: SafeArea(
        child: Column(
          children: [
            _TopBar(onRestart: _restart),
            Expanded(
              child: ListView.builder(
                controller: _scrollCtrl,
                padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
                itemCount: _messages.length + 1,
                itemBuilder: (_, i) {
                  if (i == 0) return _DateChip();
                  final msg = _messages[i - 1];
                  return msg.isBot
                      ? _BotBubble(msg: msg)
                      : _UserBubble(msg: msg);
                },
              ),
            ),
            _OptionsPanel(
              node: _currentNode,
              canGoBack: _history.isNotEmpty,
              onSelect: _selectOption,
              onBack: _goBack,
              userName: _userName,
            ),
            _ComposerBar(),
          ],
        ),
      ),
    );
  }
}

// ─── Top bar ──────────────────────────────────────────────────────────────────

class _TopBar extends StatelessWidget {
  final VoidCallback onRestart;
  const _TopBar({required this.onRestart});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: AppColors.line)),
      ),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFDEF4E8), Color(0xFFB8E8CD)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.mint200, width: 2),
            ),
            child: const Center(
              child: Text('👶', style: TextStyle(fontSize: 18)),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Mami-bot',
                  style: GoogleFonts.quicksand(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.ink,
                  ),
                ),
                Row(
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: AppColors.mint400,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'en línea, lista para ti',
                      style: GoogleFonts.nunito(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: AppColors.mint600,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: onRestart,
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: AppColors.pink50,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.refresh_rounded, size: 18, color: AppColors.pink500),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Date chip ────────────────────────────────────────────────────────────────

class _DateChip extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Center(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.7),
            borderRadius: BorderRadius.circular(AppColors.rPill),
          ),
          child: Text(
            'Hoy',
            style: GoogleFonts.nunito(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: AppColors.inkFaint,
            ),
          ),
        ),
      ),
    );
  }
}

// ─── Bot bubble ───────────────────────────────────────────────────────────────

class _BotBubble extends StatelessWidget {
  final _ChatMessage msg;
  const _BotBubble({required this.msg});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          _BotAvatar(),
          const SizedBox(width: 8),
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: msg.isAlert ? AppColors.coral50 : AppColors.mint100,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(4),
                  topRight: Radius.circular(18),
                  bottomLeft: Radius.circular(18),
                  bottomRight: Radius.circular(18),
                ),
              ),
              child: Text(
                msg.text,
                style: GoogleFonts.nunito(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: msg.isAlert ? AppColors.coral : AppColors.ink,
                  height: 1.45,
                ),
              ),
            ),
          ),
          const SizedBox(width: 40),
        ],
      ),
    );
  }
}

// ─── User bubble ──────────────────────────────────────────────────────────────

class _UserBubble extends StatelessWidget {
  final _ChatMessage msg;
  const _UserBubble({required this.msg});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          const SizedBox(width: 40),
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: const BoxDecoration(
                color: AppColors.pink400,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(18),
                  topRight: Radius.circular(4),
                  bottomLeft: Radius.circular(18),
                  bottomRight: Radius.circular(18),
                ),
              ),
              child: Text(
                msg.text,
                style: GoogleFonts.nunito(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                  height: 1.45,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Bot avatar ───────────────────────────────────────────────────────────────

class _BotAvatar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 30,
      height: 30,
      decoration: const BoxDecoration(
        color: AppColors.mint100,
        shape: BoxShape.circle,
      ),
      child: const Center(child: Text('👶', style: TextStyle(fontSize: 14))),
    );
  }
}

// ─── Options panel ────────────────────────────────────────────────────────────

class _OptionsPanel extends StatelessWidget {
  final ChatNode node;
  final bool canGoBack;
  final void Function(ChatOption) onSelect;
  final VoidCallback onBack;
  final String userName;

  const _OptionsPanel({
    required this.node,
    required this.canGoBack,
    required this.onSelect,
    required this.onBack,
    required this.userName,
  });

  @override
  Widget build(BuildContext context) {
    if (node.isLeaf) {
      return Padding(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (node.isAlert)
              _EmergencyChip()
            else
              _OptionChip(
                icon: '↩️',
                label: 'Volver al menú',
                onTap: () {
                  // pop back through history to root
                  onBack();
                },
              ),
          ],
        ),
      );
    }

    return Container(
      constraints: const BoxConstraints(maxHeight: 260),
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ...node.options.map(
              (opt) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: _OptionChip(
                  icon: opt.label.split(' ').first,
                  label: opt.label.split(' ').skip(1).join(' '),
                  onTap: () => onSelect(opt),
                ),
              ),
            ),
            if (canGoBack)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: _OptionChip(
                  icon: '↩️',
                  label: 'Volver',
                  onTap: onBack,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _OptionChip extends StatelessWidget {
  final String icon;
  final String label;
  final VoidCallback onTap;
  const _OptionChip({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: AppColors.mint200, width: 1.5),
          borderRadius: BorderRadius.circular(AppColors.rPill),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(icon, style: const TextStyle(fontSize: 14)),
            const SizedBox(width: 8),
            Flexible(
              child: Text(
                label,
                style: GoogleFonts.nunito(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: AppColors.mint600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _EmergencyChip extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.coral,
        borderRadius: BorderRadius.circular(AppColors.rMd),
        boxShadow: const [
          BoxShadow(color: Color(0x35FF7E91), blurRadius: 16, offset: Offset(0, 6)),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('🚨', style: TextStyle(fontSize: 18)),
          const SizedBox(width: 8),
          Text(
            'VE AL HOSPITAL AHORA',
            style: GoogleFonts.nunito(
              fontSize: 14,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Composer bar ─────────────────────────────────────────────────────────────

class _ComposerBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 8, 12, 14),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: AppColors.line)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              padding: const EdgeInsets.fromLTRB(16, 10, 6, 10),
              decoration: BoxDecoration(
                color: AppColors.pink50,
                borderRadius: BorderRadius.circular(AppColors.rPill),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      'Escribe tu pregunta…',
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        color: AppColors.inkFaint,
                      ),
                    ),
                  ),
                  Container(
                    width: 38,
                    height: 38,
                    decoration: const BoxDecoration(
                      color: AppColors.pink400,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.send_rounded,
                      size: 18,
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
