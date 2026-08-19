import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export default StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  data: { fontSize: 14, fontFamily: fonts.regular, color: colors.textSecondary },
  hora: { fontSize: 14, fontFamily: fonts.regular, color: colors.textMuted },
  pressaoContainer: { alignItems: 'center', marginBottom: 12 },
  pressaoLabel: { fontSize: 12, fontFamily: fonts.regular, color: colors.textMuted, marginBottom: 4 },
  pressaoValor: { fontSize: 32, fontFamily: fonts.extraBold, color: colors.textPrimary },
  separador: { fontSize: 24, fontFamily: fonts.regular, color: colors.textMuted },
  unidade: { fontSize: 14, fontFamily: fonts.regular, color: colors.textSecondary },
  badge: { alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 12, fontFamily: fonts.semiBold },
});
