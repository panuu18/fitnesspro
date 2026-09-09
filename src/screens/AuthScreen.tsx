import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Flame,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
import {
  AuthUser,
  signInWithEmail,
  signUpWithEmail,
  signInDemoUser,
  signInWithGoogle,
} from '../services/authService';

interface AuthScreenProps {
  onAuthSuccess: (user: AuthUser) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleToggleMode = (signUpMode: boolean) => {
    clearMessages();
    setIsSignUp(signUpMode);
  };

  const handleSubmit = async () => {
    clearMessages();

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (isSignUp) {
      if (!displayName.trim()) {
        setErrorMsg('Please provide your full name or nickname.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify both fields.');
        return;
      }
    }

    setIsLoading(true);
    try {
      let user: AuthUser;
      if (isSignUp) {
        user = await signUpWithEmail(email, password, displayName);
        setSuccessMsg('Account created successfully! Welcome to FitPulse Pro.');
      } else {
        user = await signInWithEmail(email, password);
        setSuccessMsg('Welcome back! Logging you in...');
      }
      setTimeout(() => {
        onAuthSuccess(user);
      }, 400);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    clearMessages();
    setIsLoading(true);
    try {
      const user = await signInDemoUser();
      setSuccessMsg('Logged in with Demo Account (Alex Rivers)');
      setTimeout(() => {
        onAuthSuccess(user);
      }, 300);
    } catch (err: any) {
      setErrorMsg('Could not start demo session.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    clearMessages();
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      setSuccessMsg('Authenticated with Google!');
      setTimeout(() => {
        onAuthSuccess(user);
      }, 300);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google sign-in was cancelled or encountered an error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Flame size={36} color="#10B981" />
          </View>
          <Text style={styles.brandTitle}>FitPulse <Text style={styles.brandPro}>Pro</Text></Text>
          <Text style={styles.brandSubtitle}>
            AI-Powered Fitness, Indian Nutrition & Macro Engine
          </Text>

          {/* Feature Highlights Banner */}
          <View style={styles.highlightsRow}>
            <View style={styles.highlightPill}>
              <Sparkles size={12} color="#10B981" />
              <Text style={styles.highlightText}>AI Food Scanner</Text>
            </View>
            <View style={styles.highlightPill}>
              <Zap size={12} color="#3B82F6" />
              <Text style={styles.highlightText}>500+ Indian Meals</Text>
            </View>
            <View style={styles.highlightPill}>
              <ShieldCheck size={12} color="#EC4899" />
              <Text style={styles.highlightText}>Mifflin-St Jeor</Text>
            </View>
          </View>
        </View>

        {/* Auth Card */}
        <View style={styles.authCard}>
          {/* Tab Switcher */}
          <View style={styles.tabSwitcher}>
            <TouchableOpacity
              style={[styles.tabButton, !isSignUp && styles.activeTabButton]}
              onPress={() => handleToggleMode(false)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabButtonText, !isSignUp && styles.activeTabText]}>
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, isSignUp && styles.activeTabButton]}
              onPress={() => handleToggleMode(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabButtonText, isSignUp && styles.activeTabText]}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Feedback Messages */}
          {errorMsg && (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color="#EF4444" style={styles.msgIcon} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {successMsg && (
            <View style={styles.successBox}>
              <CheckCircle2 size={16} color="#10B981" style={styles.msgIcon} />
              <Text style={styles.successText}>{successMsg}</Text>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.formGroup}>
            {isSignUp && (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputRow}>
                  <User size={18} color="#64748B" style={styles.inputFieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. John Doe"
                    placeholderTextColor="#475569"
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputRow}>
                <Mail size={18} color="#64748B" style={styles.inputFieldIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="name@example.com"
                  placeholderTextColor="#475569"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputRow}>
                <Lock size={18} color="#64748B" style={styles.inputFieldIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Minimum 6 characters"
                  placeholderTextColor="#475569"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#94A3B8" />
                  ) : (
                    <Eye size={18} color="#94A3B8" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {isSignUp && (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputRow}>
                  <Lock size={18} color="#64748B" style={styles.inputFieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Repeat your password"
                    placeholderTextColor="#475569"
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>
              </View>
            )}

            {/* Primary Submit Button */}
            <TouchableOpacity
              style={[styles.primaryBtn, isLoading && styles.disabledBtn]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#090D16" size="small" />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>
                    {isSignUp ? 'Create FitPulse Account' : 'Sign In to FitPulse'}
                  </Text>
                  <ArrowRight size={18} color="#090D16" style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR EXPLORE INSTANTLY</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Quick Demo Access Button */}
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={handleDemoLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <View style={styles.demoIconBadge}>
              <Zap size={16} color="#F59E0B" />
            </View>
            <View style={styles.demoTextCol}>
              <Text style={styles.demoBtnTitle}>⚡ Quick Demo Access</Text>
              <Text style={styles.demoBtnSubtitle}>
                1-Click login with preloaded Indian meals & fitness metrics
              </Text>
            </View>
          </TouchableOpacity>

          {/* Social Sign-in Option */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <Text style={styles.googleIconText}>G</Text>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Security / Privacy Trust Badge */}
        <View style={styles.footerTrust}>
          <ShieldCheck size={14} color="#10B981" />
          <Text style={styles.footerTrustText}>
            Secure 256-bit Encrypted Session • Private Health & Nutrition Data
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 40,
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  brandPro: {
    color: '#10B981',
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 290,
    lineHeight: 18,
  },
  highlightsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  highlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  highlightText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  authCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#131B2E',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#090D16',
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  activeTabText: {
    color: '#10B981',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  msgIcon: {
    marginRight: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: '#F87171',
    fontWeight: '500',
    lineHeight: 16,
  },
  successText: {
    flex: 1,
    fontSize: 12,
    color: '#34D399',
    fontWeight: '500',
    lineHeight: 16,
  },
  formGroup: {
    gap: 14,
  },
  inputWrapper: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#090D16',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    height: 48,
  },
  inputFieldIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#F8FAFC',
    paddingVertical: 8,
  },
  eyeBtn: {
    padding: 6,
  },
  primaryBtn: {
    backgroundColor: '#10B981',
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  disabledBtn: {
    opacity: 0.65,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#090D16',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    paddingHorizontal: 10,
    letterSpacing: 0.8,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  demoIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  demoTextCol: {
    flex: 1,
  },
  demoBtnTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FBBF24',
  },
  demoBtnSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 14,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#090D16',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    height: 46,
  },
  googleIconText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#3B82F6',
    marginRight: 10,
  },
  googleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  footerTrust: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
  },
  footerTrustText: {
    fontSize: 11,
    color: '#64748B',
  },
});
