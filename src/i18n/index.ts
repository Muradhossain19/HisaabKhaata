import { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setLanguage } from '../store/langSlice';

const translations: Record<string, Record<string, any>> = {
  bn: {
    auth: {
      loginTitle: 'স্বাগতম!',
      loginSubtitle: 'আপনার একাউন্টে লগইন করুন',
      registerTitle: 'নতুন একাউন্ট তৈরি করুন',
      registerSubtitle: 'আপনার খরচের হিসাব রাখতে যুক্ত হোন',
      placeholders: {
        name: 'আপনার পুরো নাম',
        phone: 'আপনার ফোন নম্বর',
        email: 'আপনার ইমেইল',
        password: 'আপনার পাসওয়ার্ড',
        confirmPassword: 'পাসওয়ার্ডটি পুনরায় দিন',
      },
      forgotTitle: 'পাসওয়ার্ড রিসেট',
      forgotSubtitle: 'আপনার ইমেইল দিন — আমরা রিসেট লিংক পাঠাবো',
      buttons: {
        login: 'লগইন করুন',
        register: 'একাউন্ট তৈরি করুন',
        sendReset: 'রিসেট লিংক পাঠান',
      },
      links: {
        signupPrompt: 'একাউন্ট নেই?',
        signupLink: 'একাউন্ট তৈরি করুন',
        forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
        loginPrompt: 'ইতিমধ্যে একাউন্ট আছে?',
        loginLink: 'লগইন করুন',
      },
      alerts: {
        requiredInfo: 'অনুগ্রহ করে প্রয়োজনীয় তথ্য দিন।',
        registrationSuccess: 'আপনার একাউন্ট তৈরি হয়েছে।',
        registrationFailed: 'রেজিস্ট্রেশন ব্যর্থ, পুনরায় চেষ্টা করুন।',
        loginFailed: 'লগইন ব্যর্থ, পুনরায় চেষ্টা করুন।',
        forgotPasswordSent: 'পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।',
        forgotPasswordFailed: 'পাসওয়ার্ড রিসেট পাঠানো যায়নি, পরে চেষ্টা করুন।',
      },
      validation: {
        nameRequired: 'নাম প্রবেশ করুন',
        phoneRequired: 'ফোন নম্বর দিন',
        phoneInvalid: 'ফোন নম্বর সঠিক নয়',
        emailRequired: 'ইমেইল দিন',
        emailInvalid: 'ইমেইল সঠিক নয়',
        passwordRequired: 'পাসওয়ার্ড দিন',
        passwordShort: 'কমপক্ষে 6 অক্ষর হওয়া উচিত',
        passwordMismatch: 'পাসওয়ার্ড মেলেনি',
      },
    },
  },
  en: {
    auth: {
      loginTitle: 'Welcome!',
      loginSubtitle: 'Sign in to your account',
      registerTitle: 'Create a new account',
      registerSubtitle: 'Join us to track your expenses',
      placeholders: {
        name: 'Full name',
        phone: 'Phone number',
        email: 'Email address',
        password: 'Password',
        confirmPassword: 'Confirm password',
      },
      forgotTitle: 'Reset password',
      forgotSubtitle: 'Enter your email and we will send a reset link',
      buttons: {
        login: 'Sign In',
        register: 'Create account',
        sendReset: 'Send reset link',
      },
      links: {
        signupPrompt: "Don't have an account?",
        signupLink: 'Create account',
        forgotPassword: 'Forgot password?',
        loginPrompt: 'Already have an account?',
        loginLink: 'Sign in',
      },
      alerts: {
        requiredInfo: 'Please provide required information.',
        registrationSuccess: 'Your account has been created.',
        registrationFailed: 'Registration failed, try again.',
        loginFailed: 'Login failed, try again.',
        forgotPasswordSent: 'Password reset link sent.',
        forgotPasswordFailed: 'Failed to send reset link, try again.',
      },
      validation: {
        nameRequired: 'Enter name',
        phoneRequired: 'Enter phone',
        phoneInvalid: 'Phone number is invalid',
        emailRequired: 'Enter email',
        emailInvalid: 'Invalid email',
        passwordRequired: 'Enter password',
        passwordShort: 'Password must be at least 6 characters',
        passwordMismatch: 'Passwords do not match',
      },
    },
  },
};

export function useTranslation() {
  const lang = useAppSelector(s => s.lang.lang);
  const dispatch = useAppDispatch();

  const t = useMemo(() => {
    return (key: string) => {
      const parts = key.split('.');
      let cur: any = translations[lang] ?? translations.bn;
      for (const p of parts) {
        if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
        else return key;
      }
      return typeof cur === 'string' ? cur : key;
    };
  }, [lang]);

  const setLang = (l: 'bn' | 'en') => dispatch(setLanguage(l));

  return { t, lang, setLang } as const;
}

export default translations;
