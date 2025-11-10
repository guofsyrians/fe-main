import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const Signup = () => {
  const { t, language } = useLanguage();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend-only validation
    if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error(language === 'ar' ? 'الرجاء ملء جميع الحقول' : language === 'en' ? 'Please fill all fields' : 'Lütfen tüm alanları doldurun');
      return;
    }
    
    // Validate username format (alphanumeric and underscores only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      toast.error(language === 'ar' ? 'اسم المستخدم يجب أن يحتوي على أحرف وأرقام فقط' : language === 'en' ? 'Username must contain only letters, numbers, and underscores' : 'Kullanıcı adı yalnızca harf, rakam ve alt çizgi içermelidir');
      return;
    }
    
    if (formData.username.length < 3) {
      toast.error(language === 'ar' ? 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' : language === 'en' ? 'Username must be at least 3 characters' : 'Kullanıcı adı en az 3 karakter olmalıdır');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error(language === 'ar' ? 'كلمة المرور غير متطابقة' : language === 'en' ? 'Passwords do not match' : 'Şifreler eşleşmiyor');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error(language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : language === 'en' ? 'Password must be at least 6 characters' : 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await signUp(formData.email, formData.password, formData.username, {
        full_name: formData.name,
      });
      
      if (error) {
        toast.error(
          error.message || 
          (language === 'ar' ? 'خطأ في إنشاء الحساب' : language === 'en' ? 'Signup error' : 'Kayıt hatası')
        );
      } else {
        toast.success(
          language === 'ar' 
            ? 'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني.' 
            : language === 'en' 
            ? 'Account created successfully. Please check your email to verify your account.'
            : 'Hesap başarıyla oluşturuldu. Lütfen e-postanızı kontrol edin.'
        );
        // Optionally navigate to login or home
        navigate('/login');
      }
    } catch (error) {
      toast.error(
        language === 'ar' ? 'حدث خطأ غير متوقع' : language === 'en' ? 'An unexpected error occurred' : 'Beklenmeyen bir hata oluştu'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 md:py-12 px-4" style={{ backgroundColor: '#f7fafc' }}>
      <Card className="w-full max-w-md shadow-xl border-2" style={{ borderColor: '#dcb557' }}>
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-3 md:mb-4">
            <img 
              src="/assets/logo.png" 
              alt="Logo" 
              className="h-16 md:h-20 w-auto"
            />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold" style={{ color: '#1f4333' }}>
            {t('signup.title')}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" style={{ color: '#1f4333' }}>{t('signup.name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('signup.name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-2"
                style={{ borderColor: '#dcb557' }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username" style={{ color: '#1f4333' }}>
                {language === 'ar' ? 'اسم المستخدم' : language === 'en' ? 'Username' : 'Kullanıcı Adı'}
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={language === 'ar' ? 'أدخل اسم المستخدم' : language === 'en' ? 'Enter username' : 'Kullanıcı adı girin'}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                className="border-2"
                style={{ borderColor: '#dcb557' }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: '#1f4333' }}>{t('signup.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('signup.email')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-2"
                style={{ borderColor: '#dcb557' }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: '#1f4333' }}>{t('signup.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('signup.password')}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border-2"
                style={{ borderColor: '#dcb557' }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" style={{ color: '#1f4333' }}>{t('signup.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('signup.confirmPassword')}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="border-2"
                style={{ borderColor: '#dcb557' }}
              />
            </div>
            
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 md:py-6 text-base md:text-lg font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              style={{ backgroundColor: '#1f4333', color: 'white' }}
            >
              {isLoading 
                ? (language === 'ar' ? 'جاري إنشاء الحساب...' : language === 'en' ? 'Creating account...' : 'Hesap oluşturuluyor...')
                : t('signup.submit')
              }
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              {t('signup.hasAccount')}{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: '#dcb557' }}>
                {t('signup.loginLink')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
