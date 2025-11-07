import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Phone, MapPin, Facebook, Instagram, X } from 'lucide-react';

const Footer = () => {
  const { t, language, changeLanguage, direction } = useLanguage();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/sub-unions', label: t('nav.subUnions') },
    { path: '/articles', label: t('nav.articles') },
    { path: '/projects', label: t('nav.projects') },
    { path: '/offices', label: t('nav.offices') }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1AAVKtJke2/' },
    { icon: X, href: 'https://x.com/guofsyrians?s=21' },
    { icon: Instagram, href: 'https://www.instagram.com/guofsyrians?igsh=MTVtMTE5cnhzdWg2ZA==' }
  ];

  return (
    <footer className="mt-auto" style={{ backgroundColor: '#111827', color: 'white' }}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          {/* Left Column: About & Social Media */}
          <div className={`${direction === 'rtl' ? 'md:order-3' : 'md:order-1'}`}>
            {/* Logo */}
            <div className="mb-8">
              <img 
                src="/assets/logo.png" 
                alt="Logo" 
                className="h-16 w-auto brightness-0 invert"
              />
            </div>
            
            {/* About Text */}
            <p 
              className="text-lg text-gray-400 mb-8 leading-relaxed"
              style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
            >
              {language === 'ar' 
                ? 'اتحاد الطلبة السوريين، منظمة طلابية مستقلة تسعى لخدمة الطلاب السوريين في جميع أنحاء العالم وتمكينهم أكاديمياً ومهنياً.'
                : language === 'en'
                ? 'Syrian Students Union, an independent student organization that seeks to serve Syrian students around the world and empower them academically and professionally.'
                : 'Suriyeli Öğrenciler Birliği, dünya çapında Suriyeli öğrencilere hizmet etmeyi ve onları akademik ve profesyonel olarak güçlendirmeyi amaçlayan bağımsız bir öğrenci örgütüdür.'}
            </p>

            {/* Social Media Icons */}
            <div className={`flex gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                const isX = social.icon === X;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ backgroundColor: '#1f2937' }}
                  >
                    <IconComponent size={isX ? 24 : 18} style={{ color: '#9ca3af' }} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Middle Column: Quick Links */}
          <div className={`${direction === 'rtl' ? 'md:order-2' : 'md:order-2'}`}>
            <h3 
              className="text-xl font-bold mb-6"
              style={{ color: '#dcb557', direction: language === 'ar' ? 'rtl' : 'ltr' }}
            >
              {language === 'ar' ? 'روابط سريعة' : language === 'en' ? 'Quick Links' : 'Hızlı Bağlantılar'}
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-base text-gray-400 hover:text-white transition-colors block"
                    style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Contact & Language */}
          <div className={`${direction === 'rtl' ? 'md:order-1' : 'md:order-3'}`}>
            <h3 
              className="text-xl font-bold mb-6"
              style={{ color: '#dcb557', direction: language === 'ar' ? 'rtl' : 'ltr' }}
            >
              {language === 'ar' ? 'معلومات التواصل' : language === 'en' ? 'Contact Information' : 'İletişim Bilgileri'}
            </h3>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Mail size={16} style={{ color: '#9ca3af' }} />
                <a 
                  href="mailto:info@syrianstudentunion.org" 
                  className="text-base text-gray-400 hover:text-white transition-colors"
                  style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                >
                  guofsysrians@gmail.com
                </a>
              </div>
              <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Phone size={16} style={{ color: '#9ca3af' }} />
                <a 
                  href="tel:+905075308810" 
                  className="text-base text-gray-400 hover:text-white transition-colors"
                  dir="ltr"
                >
                  +90 507 530 88 10
                </a>
              </div>
              <div className={`flex items-start gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <MapPin size={16} style={{ color: '#9ca3af' }} className="mt-1" />
                <p 
                  className="text-base text-gray-400"
                  style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                >
                  Atatürk mahallesi şehit AHMETUĞUR edeoğlu sokak no 11 Kilis Merkez
                </p>
              </div>
            </div>

            {/* Language Selector */}
            <div>
              <p 
                className="text-base font-semibold mb-4"
                style={{ color: '#dcb557', direction: language === 'ar' ? 'rtl' : 'ltr' }}
              >
                {language === 'ar' ? 'اللغة' : language === 'en' ? 'Language' : 'Dil'}
              </p>
              <div className={`flex gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={() => changeLanguage('ar')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    language === 'ar' 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  style={{ 
                    backgroundColor: language === 'ar' ? '#dcb557' : '#1f2937'
                  }}
                >
                  العربية
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    language === 'en' 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  style={{ 
                    backgroundColor: language === 'en' ? '#dcb557' : '#1f2937'
                  }}
                >
                  English
                </button>
                <button
                  onClick={() => changeLanguage('tr')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    language === 'tr' 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  style={{ 
                    backgroundColor: language === 'tr' ? '#dcb557' : '#1f2937'
                  }}
                >
                  Türkçe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-6">
          <p 
            className="text-base text-gray-500 text-center"
            style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
          >
            © {currentYear} {language === 'ar' ? 'اتحاد الطلبة السوريين. جميع الحقوق محفوظة.' : language === 'en' ? 'Syrian Students Union. All rights reserved.' : 'Suriyeli Öğrenciler Birliği. Tüm hakları saklıdır.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
