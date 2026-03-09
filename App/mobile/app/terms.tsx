import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.mainTitle}>Términos de uso y Política de privacidad</Text>
        <Text style={styles.updated}>Última actualización: marzo 2025</Text>

        {/* ── TÉRMINOS DE USO ──────────────────────────────── */}
        <Text style={styles.partTitle}>TÉRMINOS DE USO</Text>

        <Section title="1. Descargo de responsabilidad nutricional">
          <P>
            La información proporcionada en NutriScan Peru tiene fines informativos y educativos
            únicamente. No constituye asesoramiento médico, nutricional ni profesional de ningún tipo.
          </P>
          <P>
            Para recomendaciones específicas sobre salud, dieta o condiciones médicas, consulte a
            un profesional de la salud calificado.
          </P>
        </Section>

        <Section title="2. Fuente de los datos">
          <P>
            Parte de la información de productos proviene de bases de datos públicas como Open Food
            Facts, cuyos datos son contribuidos por la comunidad. Por ello, no se garantiza que toda
            la información sea completamente precisa, completa o actualizada.
          </P>
          <P>
            Siempre verifique la información directamente en el etiquetado físico del producto.
          </P>
        </Section>

        <Section title="3. Precisión de la información">
          <P>
            Aunque realizamos esfuerzos razonables para mantener la información actualizada, la
            aplicación puede contener errores, omisiones o información incompleta. Los usuarios
            deben verificar la información directamente en el etiquetado del producto antes de
            tomar decisiones de consumo.
          </P>
        </Section>

        <Section title="4. Uso bajo responsabilidad del usuario">
          <P>
            El uso de la aplicación es responsabilidad exclusiva del usuario. NutriScan Peru no se
            responsabiliza por decisiones de consumo tomadas con base en la información mostrada en
            la aplicación.
          </P>
        </Section>

        <Section title="5. Contenido generado por usuarios">
          <P>
            Los usuarios que envíen información, reportes o contribuciones de productos son
            responsables del contenido que proporcionen. NutriScan Peru se reserva el derecho de
            revisar, modificar o eliminar contenido que considere incorrecto, incompleto o
            inapropiado.
          </P>
        </Section>

        <Section title="6. Limitación de responsabilidad">
          <P>
            En la medida máxima permitida por la ley, los desarrolladores de NutriScan Peru no
            serán responsables por daños directos, indirectos, incidentales o consecuentes derivados
            del uso o la imposibilidad de uso de la aplicación.
          </P>
        </Section>

        <Section title="7. Propiedad intelectual">
          <P>
            El diseño, software, logotipos y contenido original de NutriScan Peru están protegidos
            por derechos de autor y no pueden ser reproducidos, distribuidos ni utilizados sin
            autorización expresa de sus desarrolladores.
          </P>
        </Section>

        <Section title="8. Modificaciones a los términos">
          <P>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios
            serán publicados dentro de la aplicación. El uso continuado de la aplicación tras la
            publicación de cambios implica la aceptación de los nuevos términos.
          </P>
        </Section>

        {/* ── POLÍTICA DE PRIVACIDAD ───────────────────────── */}
        <Text style={styles.partTitle}>POLÍTICA DE PRIVACIDAD</Text>

        <Section title="1. Información que recopilamos">
          <P>Recopilamos la siguiente información cuando usas NutriScan Peru:</P>
          <P>• Correo electrónico y nombre de usuario al registrarte.</P>
          <P>• Historial de productos escaneados y favoritos.</P>
          <P>• Contribuciones y reportes de productos que envíes.</P>
          <P>• Datos de uso de la aplicación (pantallas visitadas, errores).</P>
        </Section>

        <Section title="2. Cómo usamos tu información">
          <P>Usamos tu información para:</P>
          <P>• Brindarte las funciones de la aplicación (historial, favoritos, puntos).</P>
          <P>• Enviarte correos relacionados con tu cuenta (recuperación de contraseña).</P>
          <P>• Mejorar la base de datos de productos con tus contribuciones.</P>
          <P>• No vendemos ni compartimos tu información personal con terceros.</P>
        </Section>

        <Section title="3. Almacenamiento de datos">
          <P>
            Tus datos se almacenan en servidores seguros. Los datos locales (historial offline,
            favoritos locales) se guardan en el dispositivo y pueden eliminarse al desinstalar
            la aplicación.
          </P>
        </Section>

        <Section title="4. Tus derechos">
          <P>
            Puedes solicitar la eliminación de tu cuenta y datos personales en cualquier momento
            contactándonos. También puedes acceder y corregir tu información desde la configuración
            de tu perfil.
          </P>
        </Section>

        <Section title="5. Contacto">
          <P>
            Para consultas sobre privacidad o para solicitar la eliminación de tu cuenta, escríbenos
            a: nutriscanperu@gmail.com
          </P>
        </Section>

        <View style={styles.footer}>
          <Text style={styles.footerText}>NutriScan Peru © 2025</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 48 },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  updated: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  partTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 6,
  },
  footer: { marginTop: 32, alignItems: 'center' },
  footerText: { fontSize: 13, color: Colors.textLight },
});
