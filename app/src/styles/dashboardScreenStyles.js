import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  saudacao: {
    fontSize: 24,
    fontFamily: fonts.extraBold,
    color: colors.textPrimary,
  },
  subtitulo: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  secao: {
    marginBottom: 24,
  },
  secaoTitulo: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  descricaoSecao: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 18,
  },
  botaoChat: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoChatTexto: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 15,
  },
});
