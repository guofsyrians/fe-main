import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react';

const MyInfo = () => {
  const { t, language, direction } = useLanguage();

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#f9fafb' }}>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: '#1f4333', direction: direction }}
          >
            {language === 'ar' ? 'معلوماتي' : language === 'en' ? 'My Info' : 'Bilgilerim'}
          </h1>
          <p 
            className="text-lg text-gray-600"
            style={{ direction: direction }}
          >
            {language === 'ar' 
              ? 'عرض وتعديل معلوماتك الشخصية' 
              : language === 'en' 
              ? 'View and edit your personal information' 
              : 'Kişisel bilgilerinizi görüntüleyin ve düzenleyin'}
          </p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-lg border-0 rounded-2xl mb-6">
          <CardContent className="p-8">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              {/* Avatar */}
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#dcb557' }}
              >
                <User size={48} style={{ color: '#1f4333' }} />
              </div>
              
              {/* Name and Title */}
              <div className="flex-1">
                <h2 
                  className="text-2xl font-bold mb-2"
                  style={{ color: '#1f4333', direction: direction }}
                >
                  {language === 'ar' ? 'اسم المستخدم' : language === 'en' ? 'User Name' : 'Kullanıcı Adı'}
                </h2>
                <p 
                  className="text-gray-600"
                  style={{ direction: direction }}
                >
                  {language === 'ar' ? 'عضو في الاتحاد العام للطلبة السوريين' : language === 'en' ? 'Member of Syrian Students Union' : 'Suriyeli Öğrenciler Birliği Üyesi'}
                </p>
              </div>

              {/* Edit Button */}
              <Button
                className="rounded-lg px-6 py-2"
                style={{ backgroundColor: '#dcb557', color: '#1f4333' }}
              >
                <Edit size={18} className="mr-2" />
                {language === 'ar' ? 'تعديل' : language === 'en' ? 'Edit' : 'Düzenle'}
              </Button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 mb-8"></div>

            {/* Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#dcb557', opacity: 0.2 }}
                >
                  <Mail size={20} style={{ color: '#dcb557' }} />
                </div>
                <div className="flex-1">
                  <p 
                    className="text-sm font-semibold text-gray-600 mb-1"
                    style={{ direction: direction }}
                  >
                    {language === 'ar' ? 'البريد الإلكتروني' : language === 'en' ? 'Email' : 'E-posta'}
                  </p>
                  <p 
                    className="text-base font-medium"
                    style={{ color: '#1f4333', direction: direction }}
                  >
                    user@example.com
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#dcb557', opacity: 0.2 }}
                >
                  <Phone size={20} style={{ color: '#dcb557' }} />
                </div>
                <div className="flex-1">
                  <p 
                    className="text-sm font-semibold text-gray-600 mb-1"
                    style={{ direction: direction }}
                  >
                    {language === 'ar' ? 'رقم الهاتف' : language === 'en' ? 'Phone Number' : 'Telefon Numarası'}
                  </p>
                  <p 
                    className="text-base font-medium"
                    style={{ color: '#1f4333', direction: direction }}
                  >
                    +90 555 123 4567
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#dcb557', opacity: 0.2 }}
                >
                  <MapPin size={20} style={{ color: '#dcb557' }} />
                </div>
                <div className="flex-1">
                  <p 
                    className="text-sm font-semibold text-gray-600 mb-1"
                    style={{ direction: direction }}
                  >
                    {language === 'ar' ? 'الموقع' : language === 'en' ? 'Location' : 'Konum'}
                  </p>
                  <p 
                    className="text-base font-medium"
                    style={{ color: '#1f4333', direction: direction }}
                  >
                    {language === 'ar' ? 'إسطنبول، تركيا' : language === 'en' ? 'Istanbul, Turkey' : 'İstanbul, Türkiye'}
                  </p>
                </div>
              </div>

              {/* Join Date */}
              <div className="flex items-start gap-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#dcb557', opacity: 0.2 }}
                >
                  <Calendar size={20} style={{ color: '#dcb557' }} />
                </div>
                <div className="flex-1">
                  <p 
                    className="text-sm font-semibold text-gray-600 mb-1"
                    style={{ direction: direction }}
                  >
                    {language === 'ar' ? 'تاريخ الانضمام' : language === 'en' ? 'Join Date' : 'Katılım Tarihi'}
                  </p>
                  <p 
                    className="text-base font-medium"
                    style={{ color: '#1f4333', direction: direction }}
                  >
                    {new Date().toLocaleDateString(
                      language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'tr-TR',
                      { day: 'numeric', month: 'long', year: 'numeric' }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Section */}
        <Card className="shadow-lg border-0 rounded-2xl">
          <CardContent className="p-8">
            <h2 
              className="text-2xl font-bold mb-6"
              style={{ color: '#1f4333', direction: direction }}
            >
              {language === 'ar' ? 'معلومات إضافية' : language === 'en' ? 'Additional Information' : 'Ek Bilgiler'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <p 
                  className="text-sm font-semibold text-gray-600 mb-2"
                  style={{ direction: direction }}
                >
                  {language === 'ar' ? 'الجامعة' : language === 'en' ? 'University' : 'Üniversite'}
                </p>
                <p 
                  className="text-base"
                  style={{ color: '#1f4333', direction: direction }}
                >
                  {language === 'ar' ? 'جامعة إسطنبول' : language === 'en' ? 'Istanbul University' : 'İstanbul Üniversitesi'}
                </p>
              </div>

              <div>
                <p 
                  className="text-sm font-semibold text-gray-600 mb-2"
                  style={{ direction: direction }}
                >
                  {language === 'ar' ? 'التخصص' : language === 'en' ? 'Field of Study' : 'Çalışma Alanı'}
                </p>
                <p 
                  className="text-base"
                  style={{ color: '#1f4333', direction: direction }}
                >
                  {language === 'ar' ? 'علوم الحاسوب' : language === 'en' ? 'Computer Science' : 'Bilgisayar Bilimleri'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyInfo;

