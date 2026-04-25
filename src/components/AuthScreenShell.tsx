import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  StyleSheet,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authColors, authGradientColors, authMetrics } from '../theme/authTheme';

type Props = {
  children: React.ReactNode;
  centerVertical?: boolean;
};

const AuthScreenShell = ({ children, centerVertical = true }: Props) => {
  const { width } = useWindowDimensions();
  const m = authMetrics(width);

  return (
    <LinearGradient
      colors={[...authGradientColors]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <StatusBar barStyle="dark-content" backgroundColor={authColors.gradientMid} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboard}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 6 : 0}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={[
              styles.scrollInner,
              centerVertical && styles.scrollCentered,
              centerVertical ? styles.scrollPadCentered : styles.scrollPadScroll,
              { paddingHorizontal: m.horizontalPadding },
            ]}
          >
            <View
              style={[
                styles.card,
                {
                  maxWidth: m.cardMaxWidth,
                  borderRadius: m.cardRadius,
                },
              ]}
            >
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  keyboard: {
    flex: 1,
  },
  scrollInner: {
    flexGrow: 1,
  },
  scrollCentered: {
    justifyContent: 'center',
  },
  scrollPadCentered: {
    paddingTop: 12,
    paddingBottom: 28,
  },
  scrollPadScroll: {
    paddingTop: 20,
    paddingBottom: 28,
  },
  card: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: authColors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: authColors.surfaceBorder,
    paddingHorizontal: 22,
    paddingVertical: 26,
    shadowColor: authColors.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.09,
    shadowRadius: 28,
    elevation: 10,
  },
});

export default AuthScreenShell;
