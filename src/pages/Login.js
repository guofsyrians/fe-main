import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { toast } from 'sonner';
import { User, Lock, Eye, EyeOff, Globe, ChevronDown, Mail } from 'lucide-react';

const Login = () => {
  const { t, language, direction, changeLanguage } = useLanguage();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Frontend-only validation
    if (!formData.username || !formData.password) {
      toast.error(language === 'ar' ? 'الرجاء ملء جميع الحقول' : language === 'en' ? 'Please fill all fields' : 'Lütfen tüm alanları doldurun');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await signIn(formData.username, formData.password);
      
      if (error) {
        toast.error(
          error.message || 
          (language === 'ar' ? 'خطأ في تسجيل الدخول' : language === 'en' ? 'Login error' : 'Giriş hatası')
        );
      } else {
        toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : language === 'en' ? 'Login successful' : 'Giriş başarılı');
        navigate('/');
      }
    } catch (error) {
      toast.error(
        language === 'ar' ? 'حدث خطأ غير متوقع' : language === 'en' ? 'An unexpected error occurred' : 'Beklenmeyen bir hata oluştu'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const languages = [
    { code: 'ar', flag: '🇸🇾', name: 'العربية' },
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'tr', flag: '🇹🇷', name: 'Türkçe' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div className="min-h-screen flex relative bg-gray-50" style={{ direction: 'ltr' }}>
      {/* Language Selector */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50" style={{ direction: direction }}>
        <Button
          variant="outline"
          onClick={() => {
            const currentIndex = languages.findIndex(l => l.code === language);
            const nextIndex = (currentIndex + 1) % languages.length;
            changeLanguage(languages[nextIndex].code);
          }}
          className="bg-white border-gray-300 rounded-lg px-3 md:px-4 py-2 h-9 md:h-10 flex items-center gap-1.5 md:gap-2 hover:bg-gray-50 min-w-[44px] min-h-[44px]"
        >
          <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
          <span className="text-xs md:text-sm text-gray-600 hidden sm:inline">{currentLanguage.flag}</span>
          <span className="text-xs md:text-sm text-gray-600 hidden md:inline">{currentLanguage.name}</span>
          <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
        </Button>
      </div>

      {/* Split Screen Layout */}
      <div className="flex flex-col lg:flex-row w-full" style={{ direction: direction }}>
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 md:py-12" style={{ direction: direction }}>
          <Card className="w-full max-w-[448px] shadow-lg border-0 rounded-2xl">
            <CardContent className="p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#1f4333' }}>
                  {t('login.title')}
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  {t('login.welcomeBack')}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium" style={{ color: '#374151' }}>
                    {t('login.username')}
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="username"
                      type="text"
                      placeholder={language === 'ar' ? 'أدخل اسم المستخدم' : language === 'en' ? 'Enter your username' : 'Kullanıcı adınızı girin'}
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="pl-10 h-[50px] border-gray-300 rounded-lg"
                      style={{ direction: direction }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium" style={{ color: '#374151' }}>
                    {t('login.password')}
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={language === 'ar' ? 'أدخل كلمة المرور' : language === 'en' ? 'Enter your password' : 'Şifrenizi girin'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10 h-[50px] border-gray-300 rounded-lg"
                      style={{ direction: direction }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                      className="border-black rounded-sm"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
                      {t('login.rememberMe')}
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-sm font-medium hover:underline"
                    style={{ color: '#dcb557' }}
                  >
                    {t('login.forgotPassword')}
                  </button>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#1f4333', color: 'white' }}
                >
                  {isLoading 
                    ? (language === 'ar' ? 'جاري تسجيل الدخول...' : language === 'en' ? 'Logging in...' : 'Giriş yapılıyor...')
                    : t('login.submit')
                  }
                </Button>

                {/* Divider */}
                {/* <div className="relative flex items-center justify-center py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative bg-white px-4">
                    <span className="text-sm text-gray-500">{t('login.or')}</span>
                  </div>
                </div> */}

                {/* Social Login Buttons */}
                {/* <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-[50px] border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">{t('login.google')}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-[50px] border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-sm text-gray-700">{t('login.facebook')}</span>
                  </Button>
                </div> */}
              </form>

              {/* Forgot Password Modal */}
              <Dialog open={showForgotPasswordModal} onOpenChange={setShowForgotPasswordModal}>
                <DialogContent className="sm:max-w-[425px]" style={{ direction: direction }}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold" style={{ color: '#1f4333' }}>
                      {language === 'ar' ? 'نسيت كلمة المرور؟' : language === 'en' ? 'Forgot Password?' : 'Şifrenizi mi Unuttunuz?'}
                    </DialogTitle>
                    <DialogDescription className="text-base pt-2">
                      {language === 'ar' 
                        ? 'يرجى الاتصال بفريق تكنولوجيا المعلومات للحصول على المساعدة في إعادة تعيين كلمة المرور الخاصة بك.'
                        : language === 'en'
                        ? 'Please contact the IT team for assistance with resetting your password.'
                        : 'Şifrenizi sıfırlamak için lütfen BT ekibi ile iletişime geçin.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5" style={{ color: '#dcb557' }} />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          {language === 'ar' ? 'البريد الإلكتروني:' : language === 'en' ? 'Email:' : 'E-posta:'}
                        </p>
                        <a
                          href="mailto:ssu@ssu.org"
                          className="text-base font-semibold hover:underline"
                          style={{ color: '#1f4333' }}
                        >
                          ssu@ssu.org
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setShowForgotPasswordModal(false)}
                      className="px-6"
                      style={{ backgroundColor: '#1f4333', color: 'white' }}
                    >
                      {language === 'ar' ? 'إغلاق' : language === 'en' ? 'Close' : 'Kapat'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Signup Link */}
              {/* <div className="mt-6 text-center space-y-1">
                <p className="text-base text-gray-600">{t('login.noAccount')}</p>
                <Link
                  to="/signup"
                  className="text-base font-medium hover:underline block"
                  style={{ color: '#dcb557' }}
                >
                  {t('login.signupLink')}
                </Link>
              </div> */}
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Background with Overlay */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#1f4333] to-[#2d5a47]">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 opacity-20">
            <img
              src="/assets/logo.png"
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 md:px-12 lg:px-16 text-center" style={{ direction: direction }}>
            {/* Logo */}
            <div className="mb-6 md:mb-8">
              <img
                src="/assets/logo.png"
                alt="Logo"
                className="w-16 h-16 md:w-20 md:h-20 mx-auto object-contain"
              />
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4" style={{ color: 'white' }}>
              {t('login.unionTitle')}
            </h2>

            {/* Subtitle */}
            <p className="text-base md:text-lg lg:text-xl text-white opacity-90 mb-8 md:mb-12 max-w-md px-4">
              {t('login.unionSubtitle')}
            </p>

            {/* Stats */}
            <div className="flex gap-6 md:gap-8 lg:gap-12 mt-4 md:mt-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">+50</div>
                <div className="text-xs md:text-sm text-white opacity-80">{t('login.subUnions')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">15K</div>
                <div className="text-xs md:text-sm text-white opacity-80">{t('login.memberStudents')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">+30</div>
                <div className="text-xs md:text-sm text-white opacity-80">{t('login.countries')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
