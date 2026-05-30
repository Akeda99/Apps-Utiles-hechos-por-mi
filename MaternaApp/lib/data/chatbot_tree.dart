class ChatNode {
  final String id;
  final String message;
  final String emoji;
  final bool isAlert;
  final List<ChatOption> options;

  const ChatNode({
    required this.id,
    required this.message,
    this.emoji = '',
    this.isAlert = false,
    this.options = const [],
  });

  bool get isLeaf => options.isEmpty;
}

class ChatOption {
  final String label;
  final String nodeId;

  const ChatOption({required this.label, required this.nodeId});
}

final Map<String, ChatNode> chatNodes = {
  // ─── RAÍZ ─────────────────────────────────────────────────────────
  'root': const ChatNode(
    id: 'root',
    emoji: '👋',
    message:
        '¡Hola! Soy Mami-bot, tu asistente de salud para gestantes en Ucayali.\n\n¿Sobre qué tema quieres aprender hoy?',
    options: [
      ChatOption(label: '🚨 Señales de alarma', nodeId: 'alarmas_menu'),
      ChatOption(label: '🥗 Alimentación', nodeId: 'alim_menu'),
      ChatOption(label: '💊 Síntomas comunes', nodeId: 'sint_menu'),
      ChatOption(label: '🌸 Cuidados personales', nodeId: 'cuid_menu'),
      ChatOption(label: '👶 Mi bebé semana a semana', nodeId: 'bebe_menu'),
    ],
  ),

  // ─── SEÑALES DE ALARMA ────────────────────────────────────────────
  'alarmas_menu': const ChatNode(
    id: 'alarmas_menu',
    emoji: '🚨',
    isAlert: true,
    message:
        '🚨 Las señales de alarma son síntomas que necesitan atención médica URGENTE.\n\nSi tienes alguno de estos síntomas, ve al Hospital Regional de Pucallpa o al puesto de salud más cercano de inmediato.\n\n¿Cuál de estos estás sintiendo?',
    options: [
      ChatOption(label: '💉 Sangrado vaginal', nodeId: 'alarma_sangrado'),
      ChatOption(label: '🤕 Dolor de cabeza fuerte', nodeId: 'alarma_cabeza'),
      ChatOption(label: '👁️ Visión borrosa o manchas', nodeId: 'alarma_vision'),
      ChatOption(label: '🦵 Hinchazón de cara o manos', nodeId: 'alarma_hinchazon'),
      ChatOption(label: '🤰 Dolor abdominal fuerte', nodeId: 'alarma_dolor'),
      ChatOption(label: '🌡️ Fiebre alta', nodeId: 'alarma_fiebre'),
      ChatOption(label: '👶 El bebé no se mueve', nodeId: 'alarma_movimiento'),
      ChatOption(label: '💧 Líquido que sale de la vagina', nodeId: 'alarma_liquido'),
    ],
  ),

  'alarma_sangrado': const ChatNode(
    id: 'alarma_sangrado',
    emoji: '🚨',
    isAlert: true,
    message:
        '🚨 SANGRADO VAGINAL\n\nCualquier sangrado durante el embarazo es una señal de alarma.\n\n❌ No lo ignores aunque sea poco\n❌ No esperes a que se detenga solo\n❌ No uses tampones\n\n✅ VE AL HOSPITAL REGIONAL DE PUCALLPA AHORA\n\nSi estás en una comunidad alejada, busca al promotor de salud o la obstetra del puesto de salud más cercano de inmediato. Puede indicar: placenta previa, desprendimiento de placenta u otras complicaciones graves.',
  ),

  'alarma_cabeza': const ChatNode(
    id: 'alarma_cabeza',
    emoji: '🚨',
    isAlert: true,
    message:
        '🚨 DOLOR DE CABEZA FUERTE\n\nSi tienes un dolor de cabeza muy intenso que no cede, especialmente con:\n• Visión borrosa o manchas\n• Zumbido en los oídos\n• Hinchazón de cara o manos\n• Náuseas o vómitos\n\n✅ VE AL HOSPITAL REGIONAL DE PUCALLPA O AL PUESTO DE SALUD AHORA\n\n⚠️ En Ucayali el calor puede confundir síntomas — si el dolor es muy intenso o diferente a lo normal, no esperes. Puede indicar preeclampsia, una complicación grave que requiere atención urgente.',
  ),

  'alarma_vision': const ChatNode(
    id: 'alarma_vision',
    emoji: '🚨',
    isAlert: true,
    message:
        '🚨 VISIÓN BORROSA O MANCHAS\n\nVer manchas, destellos de luz, tener visión doble o borrosa son señales MUY URGENTES.\n\n⚠️ Esto puede indicar preeclampsia (presión alta peligrosa) que puede causar convulsiones.\n\n✅ VE AL HOSPITAL AHORA\n\nNo camines sola. Pide ayuda a un familiar para que te lleve. Si estás en comunidad, busca al promotor de salud.',
  ),

  'alarma_hinchazon': const ChatNode(
    id: 'alarma_hinchazon',
    emoji: '🚨',
    isAlert: true,
    message:
        '🚨 HINCHAZÓN REPENTINA\n\nEn Ucayali, algo de hinchazón en pies al final del día por el calor es común.\n\n❌ NO es normal si:\n• La cara (especialmente ojos) se hincha de repente\n• Las manos están muy hinchadas al despertar\n• La hinchazón aparece de golpe\n\n✅ VE AL HOSPITAL si tienes hinchazón repentina en cara o manos, especialmente con dolor de cabeza o presión alta.',
  ),

  'alarma_dolor': const ChatNode(
    id: 'alarma_dolor',
    emoji: '🚨',
    isAlert: true,
    message:
        '🚨 DOLOR ABDOMINAL FUERTE\n\nUn dolor abdominal intenso puede indicar:\n• Contracciones prematuras (antes de las 37 semanas)\n• Desprendimiento de placenta\n• Apendicitis\n• Otras emergencias\n\n✅ VE AL HOSPITAL AHORA si:\n• El dolor es muy intenso o constante\n• El dolor va y viene regularmente\n• El dolor va acompañado de sangrado\n• Sientes presión fuerte en la pelvis\n\n📍 Hospital Regional de Pucallpa: Jr. Raymondi 821',
  ),

  'alarma_fiebre': const ChatNode(
    id: 'alarma_fiebre',
    emoji: '🚨',
    isAlert: true,
    message:
        '🚨 FIEBRE ALTA\n\nSi tienes temperatura mayor a 38°C, busca atención médica.\n\n⚠️ En Ucayali hay riesgo de dengue, malaria y otras enfermedades tropicales. La fiebre en el embarazo puede ser más peligrosa en nuestra región.\n\n❌ No te automediques\n✅ Ve al centro de salud o hospital\n\nEspecialmente urgente si la fiebre viene con:\n• Escalofríos fuertes (puede ser malaria)\n• Dolor de cabeza intenso y manchas en piel (puede ser dengue)\n• Dolor al orinar',
  ),

  'alarma_movimiento': const ChatNode(
    id: 'alarma_movimiento',
    emoji: '🚨',
    isAlert: true,
    message:
        '🚨 EL BEBÉ NO SE MUEVE\n\nA partir de las 20 semanas debes sentir los movimientos de tu bebé.\n\nSi notas que tu bebé se mueve menos de lo normal:\n\n1️⃣ Toma agua fría o come algo (plátano o cocona)\n2️⃣ Acuéstate de lado izquierdo\n3️⃣ Cuenta los movimientos por 1 hora\n\n✅ Si en 1 hora sientes menos de 10 movimientos → VE AL HOSPITAL AHORA',
  ),

  'alarma_liquido': const ChatNode(
    id: 'alarma_liquido',
    emoji: '🚨',
    isAlert: true,
    message:
        '🚨 LÍQUIDO QUE SALE DE LA VAGINA\n\nSi sientes que sale líquido de la vagina (puede ser claro, amarillento o verdoso), puede ser la bolsa de agua que se rompió.\n\nEsto requiere atención médica urgente.\n\n✅ VE AL HOSPITAL AHORA\n\n❌ No uses tampones\n❌ No tengas relaciones sexuales\n❌ No intentes "aguantar" el líquido\n\nAnota la hora en que comenzó. Si estás en comunidad alejada, avisa al promotor de salud mientras consigues transporte.',
  ),

  // ─── ALIMENTACIÓN ─────────────────────────────────────────────────
  'alim_menu': const ChatNode(
    id: 'alim_menu',
    emoji: '🥗',
    message:
        '🥗 La alimentación durante el embarazo es muy importante, ¡y en Ucayali tenemos frutas y pescados increíbles que te van a ayudar mucho!\n\n¿Qué quieres saber?',
    options: [
      ChatOption(label: '✅ ¿Qué debo comer?', nodeId: 'alim_comer'),
      ChatOption(label: '🐟 Pescados y comidas típicas', nodeId: 'alim_tipico'),
      ChatOption(label: '🌿 Frutas amazónicas', nodeId: 'alim_frutas'),
      ChatOption(label: '❌ ¿Qué NO debo comer?', nodeId: 'alim_no_comer'),
      ChatOption(label: '💊 Vitaminas y suplementos', nodeId: 'alim_vitaminas'),
      ChatOption(label: '🤢 Náuseas y vómitos', nodeId: 'alim_nauseas'),
      ChatOption(label: '💧 ¿Cuánta agua debo tomar?', nodeId: 'alim_agua'),
    ],
  ),

  'alim_comer': const ChatNode(
    id: 'alim_comer',
    emoji: '✅',
    message:
        '✅ ALIMENTOS RECOMENDADOS EN UCAYALI\n\n🐟 Proteínas locales:\n• Paiche, boquichico, palometa, sábalos — son excelentes fuentes de proteína y hierro\n• Huevos de gallina de campo\n• Maní y menestras (frijoles, pallares, lentejas)\n\n🌿 Verduras:\n• Sachaculantro, shapumba, cocona — ricas en vitaminas\n• Zapallo, zanahoria, tomate\n\n🍌 Frutas y tubérculos:\n• Yuca, plátano verde y maduro — tu principal fuente de energía\n• Pijuayo, aguaje, camu camu — llenas de vitaminas\n\n🍚 Carbohidratos:\n• Arroz, yuca, plátano, maíz\n\n🥛 Lácteos:\n• Leche evaporada, yogurt, queso\n\n💡 Come 5 veces al día en porciones pequeñas.',
  ),

  'alim_tipico': const ChatNode(
    id: 'alim_tipico',
    emoji: '🐟',
    message:
        '🐟 COMIDAS TÍPICAS DE UCAYALI BUENAS PARA EL EMBARAZO\n\n🟢 MUY RECOMENDADAS:\n\n🐠 Patarashca de paiche o boquichico\nEl pescado se cocina envuelto en hoja de bijao al vapor. Es muy nutritivo, bajo en grasa y fácil de digerir. El paiche tiene más proteína que la carne de res. ¡Ideal para el embarazo!\n\n🍲 Inchicapi (sopa de gallina con maní y maíz)\nLa gallina aporta proteína y hierro. El maní tiene ácido fólico, esencial en el embarazo. La sopa hidrata y nutre.\n\n🍌 Tacacho con cecina (con moderación)\nEl plátano aporta potasio y energía. Pide que no sea muy grasoso.\n\n🌿 Juane de arroz con gallina\nBalanceado, con proteína y carbohidratos. Muy nutritivo.\n\n🟡 CON CUIDADO:\n• Maito de pescado — sí, pero que el pescado esté bien cocido\n• Chicha de maíz — solo la no fermentada (sin alcohol)',
  ),

  'alim_frutas': const ChatNode(
    id: 'alim_frutas',
    emoji: '🌿',
    message:
        '🌿 FRUTAS AMAZÓNICAS QUE TE AYUDAN EN EL EMBARAZO\n\n🟠 Aguaje (huito de aguaje)\nRica en betacaroteno (vitamina A), vitamina E y vitamina C. Ayuda al desarrollo de los ojos y piel de tu bebé. Come la pulpa fresca — no el aguajina con mucha azúcar.\n\n🍋 Camu camu\n¡La fruta con más vitamina C del mundo! Ayuda a que tu cuerpo absorba mejor el hierro y fortalece tu sistema inmunológico. Puedes tomarlo en jugo (sin mucha azúcar).\n\n🟡 Pijuayo (chontaduro)\nRico en betacaroteno, carbohidratos y proteína. Te da energía y es excelente para el embarazo. Cómelo sancochado.\n\n🍌 Plátano (de todas las variedades)\nRico en potasio — alivia los calambres. También tiene vitamina B6 que ayuda con las náuseas.\n\n🟣 Cocona\nRica en vitaminas B y C, ayuda a la digestión y el sistema inmune.\n\n🍊 Ungurahui\nContiene ácidos grasos y vitaminas. Toma el jugo con moderación.',
  ),

  'alim_no_comer': const ChatNode(
    id: 'alim_no_comer',
    emoji: '❌',
    message:
        '❌ ALIMENTOS A EVITAR EN UCAYALI\n\n🍺 Chicha fermentada y masato fermentado\nContienen alcohol. NINGUNA cantidad de alcohol es segura en el embarazo.\n\n🐟 Ceviche de pescado crudo\nEl pescado crudo puede tener parásitos y bacterias. En Ucayali hay riesgo de anisakis y otros parásitos. El pescado debe estar bien cocido.\n\n🍖 Carne de monte sin verificar\nLa carne de animales silvestres (majaz, sajino, venado) puede tener parásitos si no está bien cocida. Si la consumes, que esté MUY bien cocida.\n\n🥚 Huevos crudos o poco cocidos\n\n🌿 Plantas medicinales sin consultar\nAlgunas hierbas amazónicas pueden ser peligrosas en el embarazo. No tomes preparados de plantas sin consultar a la obstetra o médico primero.\n\n☕ Mucho café y gaseosas\n\n💡 Lava bien todas las frutas y verduras antes de comer.',
  ),

  'alim_vitaminas': const ChatNode(
    id: 'alim_vitaminas',
    emoji: '💊',
    message:
        '💊 VITAMINAS Y NUTRIENTES — CON ALIMENTOS DE UCAYALI\n\n🔴 Ácido fólico (muy importante los primeros 3 meses):\nFuentes locales: maní, frijoles, pallares, sachaculantro\nEl puesto de salud te da las pastillas gratis.\n\n🔴 Hierro (previene la anemia):\nFuentes locales: paiche, boquichico, carne de gallina, hígado de pollo, frijoles\n💡 Toma el hierro con jugo de camu camu o de cocona (vitamina C) para que se absorba mejor. No con chicha ni con té.\n\n🔴 Calcio (para los huesos de tu bebé):\nFuentes locales: leche, queso, sardinas enlatadas\n\n🔴 Vitamina A:\nFuentes locales: aguaje, pijuayo, zapallo amarillo, zanahoria — ¡tenemos las mejores fuentes en nuestra selva!\n\n🔴 Vitamina C:\nFuentes locales: camu camu (¡la mejor del mundo!), cocona, cocona, limón\n\n💡 El puesto de salud de Pucallpa te da el ácido fólico, el hierro y el calcio GRATIS. ¡Pídelos en tu control prenatal!',
  ),

  'alim_nauseas': const ChatNode(
    id: 'alim_nauseas',
    emoji: '🤢',
    message:
        '🤢 NÁUSEAS Y VÓMITOS — CONSEJOS PARA UCAYALI\n\nSon muy comunes en los primeros 3 meses. En el calor de Ucayali pueden sentirse más fuertes.\n\n✅ Qué puedes hacer:\n• Come galletas o un pedacito de plátano sancochado antes de levantarte\n• Come poco y frecuente — nunca dejes el estómago vacío\n• El jengibre ayuda: hierve una rodajita en agua y tómalo tibio\n• Toma agua fresca en sorbitos pequeños\n• La cocona en jugo suave puede aliviar la acidez\n• Evita el calor fuerte — descansa en sombra y ventilación\n• Los alimentos fríos como frutas refrigeradas tienen menos olor\n• Evita olores fuertes (frituras, chicharrón)\n\n⚠️ Ve al médico si:\n• Vomitas más de 3 veces al día\n• No puedes tomar ni agua\n• Te sientes muy débil o te da mareos fuertes',
  ),

  'alim_agua': const ChatNode(
    id: 'alim_agua',
    emoji: '💧',
    message:
        '💧 HIDRATACIÓN EN UCAYALI — MUY IMPORTANTE\n\nEn Ucayali el calor es intenso, por eso necesitas tomar MÁS agua que en otras regiones.\n\n✅ Toma mínimo 10 vasos de agua al día (2 a 2.5 litros)\n\n⚠️ Agua segura en Ucayali:\n• Usa agua hervida o filtrada — el agua del río o de pozo sin tratar puede tener parásitos y bacterias\n• Deja hervir el agua por al menos 1 minuto\n• Guárdala en recipientes limpios con tapa\n\n💡 Opciones buenas para hidratarte:\n• Agua hervida enfriada con rodajas de limón\n• Jugo de camu camu diluido (sin mucha azúcar)\n• Jugo de cocona natural\n• Aguajina natural (sin mucha azúcar)\n• Mazamorra de plátano aguada\n\n🔍 Tu orina debe ser amarillo clarito. Si es oscura, toma más agua.',
  ),

  // ─── SÍNTOMAS COMUNES ─────────────────────────────────────────────
  'sint_menu': const ChatNode(
    id: 'sint_menu',
    emoji: '💊',
    message:
        '💊 Durante el embarazo en Ucayali es normal tener varios síntomas, y el calor puede hacerlos más intensos.\n\n¿Cuál de estos tienes?',
    options: [
      ChatOption(label: '🤢 Náuseas matutinas', nodeId: 'sint_nauseas'),
      ChatOption(label: '🔙 Dolor de espalda', nodeId: 'sint_espalda'),
      ChatOption(label: '🦵 Hinchazón de pies', nodeId: 'sint_hinchazon'),
      ChatOption(label: '🔥 Acidez estomacal', nodeId: 'sint_acidez'),
      ChatOption(label: '😴 Cansancio extremo', nodeId: 'sint_cansancio'),
      ChatOption(label: '🚽 Estreñimiento', nodeId: 'sint_estrenimiento'),
      ChatOption(label: '🦟 Picadura / Dengue / Malaria', nodeId: 'sint_tropical'),
    ],
  ),

  'sint_nauseas': const ChatNode(
    id: 'sint_nauseas',
    emoji: '🤢',
    message:
        '🤢 NÁUSEAS MATUTINAS EN UCAYALI\n\nSon muy normales en el primer trimestre. El calor amazónico puede hacerlas más fuertes.\n\n✅ Qué hacer:\n• Come un pedazo de plátano sancochado o galletas antes de levantarte\n• Come poco y frecuente — nunca dejes el estómago vacío\n• El jengibre hervido en agua ayuda mucho\n• Evita frituras y olores fuertes\n• Toma agua fresca en sorbitos\n• Descansa en lugares frescos y con ventilación\n• La cocona en jugo suave puede aliviar\n\n⚠️ Ve al médico si:\n• Vomitas más de 3 veces al día\n• No puedes retener líquidos\n• Te sientes muy débil',
  ),

  'sint_espalda': const ChatNode(
    id: 'sint_espalda',
    emoji: '🔙',
    message:
        '🔙 DOLOR DE ESPALDA\n\nEs muy común conforme crece el bebé y tu panza.\n\n✅ Qué hacer:\n• Evita cargar peso (bolsas de mercado, baldes de agua)\n• Si lavas ropa a mano, descansa seguido\n• Al dormir, usa una almohada o ropa enrollada entre las rodillas\n• Usa chanclas o zapatos bajos y cómodos\n• Camina suavemente cada día — incluso en la casa o el patio\n• Baños de agua tibia en la espalda pueden aliviar\n• Pide ayuda con las tareas pesadas del hogar\n\n⚠️ Ve al médico si el dolor es muy intenso o baja hacia las piernas.',
  ),

  'sint_hinchazon': const ChatNode(
    id: 'sint_hinchazon',
    emoji: '🦵',
    message:
        '🦵 HINCHAZÓN DE PIES EN UCAYALI\n\nEl calor amazónico hace que los pies se hinchen más. Es normal que los pies y tobillos se hinchen al final del día.\n\n✅ Qué hacer:\n• Eleva los pies cuando estés sentada o descansando\n• No te quedes de pie mucho tiempo bajo el sol\n• Descansa en sombra y lugares frescos\n• Reduce la sal en tus comidas\n• Camina suavemente para activar la circulación\n• Duerme de lado izquierdo\n• Evita medias muy apretadas\n\n⚠️ Ve al médico si:\n• La hinchazón es repentina y fuerte\n• También te hincha la cara o las manos\n• Tienes dolor, enrojecimiento o calor en las piernas',
  ),

  'sint_acidez': const ChatNode(
    id: 'sint_acidez',
    emoji: '🔥',
    message:
        '🔥 ACIDEZ ESTOMACAL\n\nMuy común en el embarazo. Las comidas típicas de Ucayali muy condimentadas o grasosas pueden empeorarla.\n\n✅ Qué hacer:\n• Come porciones pequeñas, varias veces al día\n• No te acuestes inmediatamente después de comer (espera 2 horas)\n• Evita el tacacho muy grasoso, las frituras y el ají en exceso\n• La mazamorra de plátano aguada puede calmar el estómago\n• Come despacio y mastica bien\n• Duerme con la cabeza un poco elevada\n• Evita café y gaseosas\n\n⚠️ No tomes antiácidos sin consultar al médico o a la obstetra primero.',
  ),

  'sint_cansancio': const ChatNode(
    id: 'sint_cansancio',
    emoji: '😴',
    message:
        '😴 CANSANCIO EXTREMO EN UCAYALI\n\nEs muy normal, especialmente en el primer y tercer trimestre. El calor de Ucayali lo hace más fuerte.\n\n✅ Qué hacer:\n• Descansa en las horas más calurosas del día (12 a 3 pm)\n• Duerme en lugares frescos y con ventilación\n• Haz una siesta corta en el día si puedes\n• Pide ayuda con las tareas pesadas del hogar — no tienes que hacer todo sola\n• Come bien: el pijuayo sancochado y el plátano te dan energía natural\n• Toma mucha agua fresca para no deshidratarte\n• Sal a caminar en las horas frescas (temprano o al atardecer)\n\n💡 El cansancio mejora mucho en el segundo trimestre.',
  ),

  'sint_estrenimiento': const ChatNode(
    id: 'sint_estrenimiento',
    emoji: '🚽',
    message:
        '🚽 ESTREÑIMIENTO\n\nEs común en el embarazo. En Ucayali tenemos frutas excelentes para esto.\n\n✅ Qué hacer:\n• Toma mucha agua hervida enfriada (mínimo 10 vasos al día)\n• Come papaya de monte — es la mejor para el estreñimiento\n• El aguaje y el ungurahui también ayudan\n• Come yuca sancochada con cáscara (tiene fibra)\n• Come plátano maduro\n• Camina todos los días\n• No ignores las ganas de ir al baño\n\n⚠️ No tomes laxantes sin consultar al médico\n⚠️ Ve al médico si no puedes ir al baño en más de 3 días o si tienes dolor fuerte.',
  ),

  'sint_tropical': const ChatNode(
    id: 'sint_tropical',
    emoji: '🦟',
    message:
        '🦟 DENGUE, MALARIA Y ENFERMEDADES TROPICALES EN EL EMBARAZO\n\nEn Ucayali hay riesgo de estas enfermedades. Durante el embarazo son más peligrosas.\n\n⚠️ SEÑALES DE ALERTA:\n• Fiebre alta con escalofríos → puede ser malaria\n• Fiebre con dolor de cuerpo, manchas rojas y dolor detrás de los ojos → puede ser dengue\n• Fiebre con sarpullido y dolor de articulaciones → puede ser Zika (muy peligroso en el embarazo)\n\n✅ PROTÉGETE:\n• Usa mosquitero en la noche\n• Usa ropa que cubra brazos y piernas al anochecer\n• Elimina el agua estancada cerca de tu casa\n• Usa repelente de insectos (consulta al médico cuál es seguro en el embarazo)\n\n🚨 Si tienes fiebre durante el embarazo → VE AL MÉDICO DE INMEDIATO. No te automediques.',
  ),

  // ─── CUIDADOS PERSONALES ──────────────────────────────────────────
  'cuid_menu': const ChatNode(
    id: 'cuid_menu',
    emoji: '🌸',
    message:
        '🌸 El cuidado personal es muy importante durante el embarazo, especialmente en el clima caluroso de Ucayali.\n\n¿Qué tema te interesa?',
    options: [
      ChatOption(label: '🏃 Ejercicio seguro', nodeId: 'cuid_ejercicio'),
      ChatOption(label: '😴 Sueño y descanso', nodeId: 'cuid_sueno'),
      ChatOption(label: '🚿 Higiene personal', nodeId: 'cuid_higiene'),
      ChatOption(label: '❤️ Salud mental', nodeId: 'cuid_mental'),
      ChatOption(label: '👗 Ropa y calzado', nodeId: 'cuid_ropa'),
      ChatOption(label: '☀️ Cuidados con el calor', nodeId: 'cuid_calor'),
    ],
  ),

  'cuid_ejercicio': const ChatNode(
    id: 'cuid_ejercicio',
    emoji: '🏃',
    message:
        '🏃 EJERCICIO DURANTE EL EMBARAZO EN UCAYALI\n\n✅ Ejercicios seguros:\n• Caminata suave en las horas frescas (6-8am o después de las 5pm)\n• Natación — en Ucayali el río puede ser peligroso; prefiere una piscina segura\n• Ejercicios de respiración y estiramientos en casa\n• Yoga prenatal si hay disponible\n\n❌ Evita:\n• Caminar bajo el sol fuerte (12-3pm) — te deshidratarás rápido\n• Deportes de contacto\n• Cargar cosas pesadas\n• Trabajar mucho tiempo de pie en el calor\n\n💡 El ejercicio reduce el dolor de espalda, mejora el sueño, da energía y prepara tu cuerpo para el parto. ¡Aunque sea un paseo corto cada día ayuda mucho!',
  ),

  'cuid_sueno': const ChatNode(
    id: 'cuid_sueno',
    emoji: '😴',
    message:
        '😴 SUEÑO Y DESCANSO EN EL CALOR DE UCAYALI\n\nDormir bien es fundamental para ti y tu bebé, y el calor amazónico puede dificultar el descanso.\n\n✅ Consejos:\n• Duerme de lado izquierdo — mejora la circulación hacia el bebé\n• Usa una almohada o ropa enrollada entre las rodillas\n• Duerme con ventilación — abre ventanas, usa ventilador si tienes\n• Báñate antes de dormir con agua tibia para refrescarte\n• Usa ropa de algodón ligera para dormir\n• Descansa en la siesta (12-3pm) cuando el calor es más fuerte\n• Evita el celular antes de dormir\n\n💡 Necesitas 8-9 horas de sueño por noche más la siesta del día en este clima.',
  ),

  'cuid_higiene': const ChatNode(
    id: 'cuid_higiene',
    emoji: '🚿',
    message:
        '🚿 HIGIENE PERSONAL EN UCAYALI\n\nEn el clima caluroso de Ucayali, la higiene es aún más importante durante el embarazo.\n\n✅ Recomendaciones:\n• Báñate 2 veces al día con agua tibia — el baño de agua fría muy fría no es recomendado\n• Lávate las manos siempre antes de comer y después del baño\n• Cepíllate los dientes 3 veces al día — el embarazo puede afectar las encías\n• Visita al dentista durante el embarazo es seguro y necesario\n• Ropa interior de algodón, cámbiala todos los días\n• Mantén la zona íntima limpia y seca con agua y jabón neutro\n• No uses duchas vaginales ni desodorantes íntimos\n\n⚠️ Asegúrate de que el agua para bañarte no venga directamente del río sin tratar.',
  ),

  'cuid_mental': const ChatNode(
    id: 'cuid_mental',
    emoji: '❤️',
    message:
        '❤️ SALUD MENTAL EN EL EMBARAZO\n\nEs completamente normal sentir miedo, tristeza, ansiedad o confusión durante el embarazo, especialmente cuando eres joven.\n\n✅ Cuídate también por dentro:\n• Habla con alguien de confianza sobre cómo te sientes — mamá, abuela, una amiga, la obstetra\n• No te quedes sola con tus pensamientos\n• Haz actividades que te gusten — escuchar música, dibujar, tejer, caminar\n• La comunidad de Ucayali tiene redes de apoyo — no tienes que pasar esto sola\n• Si te sientes muy triste o ansiosa, habla con el médico o la obstetra del puesto de salud — tiene solución y es confidencial\n\n💡 Cuidar tu salud mental ES cuidar a tu bebé.\n\n⚠️ Si tienes pensamientos de hacerte daño, busca ayuda inmediatamente en el Hospital Regional.',
  ),

  'cuid_ropa': const ChatNode(
    id: 'cuid_ropa',
    emoji: '👗',
    message:
        '👗 ROPA Y CALZADO PARA EL CLIMA DE UCAYALI\n\n✅ Recomendaciones:\n• Ropa de algodón ligera, holgada y clara (los colores claros no absorben tanto calor)\n• Ropa que no apriete el abdomen ni la cintura\n• Ropa interior amplia de algodón — cámbiala a diario\n• Sostén con buen soporte — tus pechos crecerán durante el embarazo\n• Chanclas o zapatos planos y cómodos — evita los tacones\n• Zapatos que no aprieten — los pies se hinchan más con el calor\n• Si sales, usa sombrero o gorra para protegerte del sol\n\n💡 En Ucayali no necesitas ropa cara — lo más importante es que sea fresca, cómoda y de algodón.',
  ),

  'cuid_calor': const ChatNode(
    id: 'cuid_calor',
    emoji: '☀️',
    message:
        '☀️ CUIDADOS ESPECIALES POR EL CALOR DE UCAYALI\n\nEl calor amazónico puede ser difícil durante el embarazo. Tu cuerpo ya trabaja más duro por el bebé.\n\n✅ Cómo protegerte:\n• Toma agua hervida fresca constantemente — no esperes a tener sed\n• Descansa entre las 12pm y las 3pm, que son las horas más calurosas\n• Evita hacer trabajos pesados bajo el sol fuerte\n• Usa ropa fresca de algodón y colores claros\n• Ventila bien la casa — abre ventanas por la mañana temprano\n• Si te sientes muy agotada, mareada o con la cabeza pesada en el calor → descansa y toma agua\n\n🚨 Señales de golpe de calor — ve al médico:\n• Temperatura corporal muy alta\n• Confusión o desorientación\n• Piel muy caliente y seca sin sudar\n• Desmayo o pérdida del conocimiento',
  ),

  // ─── MI BEBÉ SEMANA A SEMANA ──────────────────────────────────────
  'bebe_menu': const ChatNode(
    id: 'bebe_menu',
    emoji: '👶',
    message:
        '👶 ¡Tu bebé crece y cambia cada semana, aquí en Ucayali como en cualquier parte del mundo!\n\n¿En qué etapa está tu bebé?',
    options: [
      ChatOption(label: '🌱 Primer trimestre (1-13 sem)', nodeId: 'bebe_t1'),
      ChatOption(label: '🌿 Segundo trimestre (14-27 sem)', nodeId: 'bebe_t2'),
      ChatOption(label: '🌳 Tercer trimestre (28-40 sem)', nodeId: 'bebe_t3'),
      ChatOption(label: '🏥 ¿Cuántos controles debo tener?', nodeId: 'bebe_controles'),
    ],
  ),

  'bebe_t1': const ChatNode(
    id: 'bebe_t1',
    emoji: '🌱',
    message:
        '🌱 PRIMER TRIMESTRE (Semanas 1 a 13)\n\n📏 Semana 4: Del tamaño de una semilla de aguaje\n📏 Semana 8: Del tamaño de un frijolito (1.6 cm)\n📏 Semana 12: Del tamaño de un limón chiquito (5-6 cm)\n\n🔬 ¿Qué está pasando?\n• Se forma el corazón y empieza a latir (semana 6) 💓\n• Se desarrollan el cerebro y la columna vertebral\n• Aparecen los brazos y piernas\n• Se forman todos los órganos internos\n• Ya tiene nariz, labios y orejas\n\n💡 Este trimestre las náuseas son más fuertes. Es normal y va a pasar. Come maní y frijoles para el ácido fólico que tu bebé necesita ahora.\n\n🏥 Deberías tener tu PRIMER control prenatal antes de la semana 12. ¡Si aún no lo has hecho, ve al puesto de salud!',
  ),

  'bebe_t2': const ChatNode(
    id: 'bebe_t2',
    emoji: '🌿',
    message:
        '🌿 SEGUNDO TRIMESTRE (Semanas 14 a 27)\n\n📏 Semana 16: Del tamaño de un aguacate (12 cm)\n📏 Semana 20: Del tamaño de un plátano de isla (25 cm)\n📏 Semana 27: Del tamaño de una piña pequeña (36 cm)\n\n🔬 ¿Qué está pasando?\n• ¡Empieza a moverse! Entre semana 16 y 20 sentirás las primeras pataditas 👟\n• Se forman las huellas dactilares únicas\n• Puede ESCUCHAR tu voz — háblale y ponle música\n• Se desarrolla el cabello, cejas y pestañas\n• Puede bostezar, chuparse el dedo y hacer movimientos\n\n💡 Este trimestre te sentirás con más energía. ¡Aprovecha para ir a tus controles y comer bien! Come aguaje y pijuayo para la vitamina A que sus ojos y piel necesitan.',
  ),

  'bebe_t3': const ChatNode(
    id: 'bebe_t3',
    emoji: '🌳',
    message:
        '🌳 TERCER TRIMESTRE (Semanas 28 a 40)\n\n📏 Semana 28: Del tamaño de una berenjena (38 cm)\n📏 Semana 36: Del tamaño de una lechuga grande (47 cm)\n📏 Semana 40: ¡Listo para nacer! (50 cm, ~3 kg)\n\n🔬 ¿Qué está pasando?\n• Abre y cierra los ojos, puede ver luz\n• ¡Ya reconoce tu voz y puede reconocerte al nacer!\n• Acumula grasa para mantenerse tibio\n• Los pulmones se terminan de madurar\n• Se va poniendo de cabeza para el parto\n\n💡 Las pataditas serán más fuertes — eso significa que está sano y activo. El calor de Ucayali puede hacerte sentir más cansada en este trimestre. Descansa mucho y toma agua.\n\n🏥 En el tercer trimestre los controles son más frecuentes — ¡no faltes!',
  ),

  'bebe_controles': const ChatNode(
    id: 'bebe_controles',
    emoji: '🏥',
    message:
        '🏥 CONTROLES PRENATALES EN UCAYALI\n\nEl Ministerio de Salud recomienda al menos 6 controles durante el embarazo. ¡En el puesto de salud o el Hospital Regional de Pucallpa son GRATUITOS!\n\n📅 Cuándo ir:\n• Semana 1-12: Primer control (tan pronto sepas que estás embarazada)\n• Semana 22: Segundo control\n• Semana 27: Tercer control\n• Semana 33: Cuarto control\n• Semana 36: Quinto control\n• Semana 38: Sexto control\n\n🩺 En cada control te harán:\n• Examen de orina y sangre\n• Tomar la presión\n• Pesar\n• Escuchar el corazón del bebé\n• Darte pastillas de hierro, ácido fólico y calcio gratis\n\n💡 Si vives en comunidad alejada, el promotor de salud puede ayudarte a coordinar el transporte.',
  ),
};
