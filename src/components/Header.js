import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import GooeyNav from './GooeyNav';
import { toast } from 'sonner';

const Header = () => {
  const { language, changeLanguage, t, direction } = useLanguage();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error(
          language === 'ar' 
            ? 'حدث خطأ أثناء تسجيل الخروج' 
            : language === 'en' 
            ? 'Error logging out' 
            : 'Çıkış yapılırken hata oluştu'
        );
      } else {
        toast.success(
          language === 'ar' 
            ? 'تم تسجيل الخروج بنجاح' 
            : language === 'en' 
            ? 'Logged out successfully' 
            : 'Başarıyla çıkış yapıldı'
        );
        navigate('/');
        setMobileMenuOpen(false);
      }
    } catch (error) {
      toast.error(
        language === 'ar' 
          ? 'حدث خطأ غير متوقع' 
          : language === 'en' 
          ? 'An unexpected error occurred' 
          : 'Beklenmeyen bir hata oluştu'
      );
    }
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/sub-unions', label: t('nav.subUnions') },
    { path: '/articles', label: t('nav.articles') },
    { path: '/projects', label: t('nav.projects') },
    { path: '/offices', label: t('nav.offices') },
    { path: '/graduates', label: t('nav.graduates') },
    // { path: '/my-info', label: t('nav.myInfo') }
  ];

  // Convert navLinks to GooeyNav items format
  const gooeyNavItems = useMemo(() => 
    navLinks.map(link => ({
      label: link.label,
      href: link.path
    })),
    [navLinks]
  );

  // Find active index based on current location
  const activeIndex = useMemo(() => {
    const index = navLinks.findIndex(link => link.path === location.pathname);
    return index >= 0 ? index : -1;
  }, [location.pathname, navLinks]);

  // Handle navigation when GooeyNav item is clicked
  const handleGooeyNavClick = (item, index) => {
    navigate(item.href);
  };

  const languages = [
    { code: 'ar', flag: '🇸🇾', name: 'العربية' },
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'tr', flag: '🇹🇷', name: 'Türkçe' }
  ];

  return (
    <header className="shadow-sm sticky top-0 z-50" style={{ backgroundColor: '#1f4333' }}>
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/assets/logo.png" 
              alt="Syrian Student Union Logo" 
              className="h-8 md:h-12 w-auto"
            />
            <span className="text-sm md:text-lg font-bold text-white sm:inline">
              {language === 'ar' ? 'اتحاد الطلبة السوريين' : language === 'en' ? 'Syrian Student Union' : 'Suriyeli Öğrenciler Birliği'}
            </span>
          </Link>

          {/* Desktop Navigation - GooeyNav */}
          <div className="hidden lg:flex items-center">
            <GooeyNav
              items={gooeyNavItems}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              activeIndex={activeIndex}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
              onItemClick={handleGooeyNavClick}
            />
          </div>

          {/* Language Switcher & Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-2 border rounded-lg p-1" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    language === lang.code ? 'shadow-sm' : 'hover:opacity-70'
                  }`}
                  style={{
                    backgroundColor: language === lang.code ? '#dcb557' : 'transparent',
                    color: language === lang.code ? '#1f4333' : 'white'
                  }}
                  title={lang.name}
                >
                  {lang.flag}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            {user ? (
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-2 hover:bg-opacity-10 transition-all flex items-center gap-2"
                style={{ borderColor: 'white', color: 'white' }}
              >
                <LogOut className="w-4 h-4" />
                {t('nav.logout')}
              </Button>
            ) : (
              <Link to="/login">
                <Button 
                  variant="outline" 
                  className="border-2 hover:bg-opacity-10 transition-all"
                  style={{ borderColor: 'white', color: 'white' }}
                >
                  {t('nav.login')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'white' }}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-medium transition-colors px-4 py-2 rounded-lg ${
                    location.pathname === link.path ? 'font-bold' : ''
                  }`}
                  style={{ 
                    color: location.pathname === link.path ? '#dcb557' : 'white',
                    backgroundColor: location.pathname === link.path ? 'rgba(220,181,87,0.1)' : 'transparent'
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px my-2" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
              
              {/* Language Selector Mobile */}
              <div className="flex items-center gap-2 px-4">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 flex items-center justify-center gap-2 ${
                      language === lang.code ? 'shadow-sm' : ''
                    }`}
                    style={{
                      backgroundColor: language === lang.code ? '#dcb557' : 'rgba(255,255,255,0.1)',
                      color: language === lang.code ? '#1f4333' : 'white'
                    }}
                  >
                    {lang.code === 'ar' ? (
                      <img 
                        src="/assets/syrialogo.webp" 
                        alt="Syrian Flag" 
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <span>{lang.flag}</span>
                    )}
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex flex-col gap-3 px-4 mt-2">
                {user ? (
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="w-full border-2 flex items-center justify-center gap-2"
                    style={{ borderColor: 'white', color: 'white' }}
                  >
                    <LogOut className="w-4 h-4" />
                    {t('nav.logout')}
                  </Button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        variant="outline" 
                        className="w-full border-2"
                        style={{ borderColor: 'white', color: 'white' }}
                      >
                        {t('nav.login')}
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        className="w-full"
                        style={{ backgroundColor: '#dcb557', color: '#1f4333' }}
                      >
                        {t('nav.signup')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
