import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ProfileCard from '../components/ProfileCard';
import { fetchOffices } from '../services/database';
import { toast } from 'sonner';

const Offices = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('board');
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Categories matching the reference website structure
  const categories = [
    { id: 'board', name: { ar: 'مجلس الإدارة', en: 'Board of Directors', tr: 'Yönetim Kurulu' } },
    { id: 'supervisory', name: { ar: 'الهيئة الرقابية', en: 'Supervisory Body', tr: 'Denetim Kurulu' } },
    { id: 'electoral', name: { ar: 'الهيئة الانتخابية', en: 'Electoral Commission', tr: 'Seçim Komisyonu' } },
    { id: 'general_assembly', name: { ar: 'الهيئة العمومية', en: 'General Assembly', tr: 'Genel Kurul' } },
    { id: 'offices', name: { ar: 'المكاتب واللجان التنفيذية', en: 'Offices & Executive Committees', tr: 'Ofisler ve İcra Komiteleri' } },
    
  ];

  useEffect(() => {
    const loadOffices = async () => {
      try {
        setLoading(true);
        const data = await fetchOffices();
        setOffices(data);
      } catch (error) {
        console.error('Error loading offices:', error);
        toast.error(
          language === 'ar' 
            ? 'حدث خطأ في تحميل البيانات' 
            : language === 'en' 
            ? 'Error loading data' 
            : 'Veri yüklenirken hata oluştu'
        );
      } finally {
        setLoading(false);
      }
    };

    loadOffices();
  }, [language]);

  // Filter offices by category
  const filteredOffices = offices.filter(office => office.category === selectedCategory);
  
  // Separate prominent positions from other members
  const getProminentMember = () => {
    if (selectedCategory === 'board') {
      return filteredOffices.find(office => office.position?.en === 'Secretary General');
    } else if (selectedCategory === 'supervisory') {
      return filteredOffices.find(office => 
        office.position?.en === 'President of the Supervisory Body' || 
        office.position?.en === 'Head of the Supervisory Body' ||
        (office.position?.en === 'President' && office.category === 'supervisory')
      );
    } else if (selectedCategory === 'electoral') {
      return filteredOffices.find(office => 
        office.position?.en === 'Head of the Electoral Commission' ||
        office.position?.en === 'President of the Electoral Commission'
      );
    } else if (selectedCategory === 'general_assembly') {
      return filteredOffices.find(office => 
        office.position?.en === 'President of the General Assembly' ||
        office.position?.en === 'Head of the General Assembly' ||
        (office.position?.en === 'President' && office.category === 'general_assembly')
      );
    }
    return null;
  };
  
  const prominentMember = getProminentMember();
  
  const otherMembers = prominentMember 
    ? filteredOffices.filter(office => office.id !== prominentMember.id)
    : filteredOffices;
  
  // All other members will be displayed in a grid (2 per row)

  // Helper function to extract handle from email or name
  const getHandle = (office) => {
    if (office.email) {
      return office.email.split('@')[0];
    }
    return office.head.en.toLowerCase().replace(/\s+/g, '');
  };

  // Handle contact click
  const handleContactClick = (office) => {
    if (office.email) {
      window.location.href = `mailto:${office.email}`;
    } else if (office.phone) {
      window.location.href = `tel:${office.phone}`;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-[2000px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4" style={{ color: '#1f4333' }}>
            {t('offices.title')}
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {t('offices.subtitle')}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-8 md:mb-12">
          <div className="grid grid-cols-2 sm:flex sm:gap-2 md:gap-3 sm:justify-center sm:flex-nowrap gap-2 px-2 sm:px-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-2 sm:px-3 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 whitespace-nowrap min-h-[40px] sm:min-h-[44px] ${
                  selectedCategory === category.id
                    ? 'text-white shadow-lg md:transform md:scale-105'
                    : 'bg-white text-gray-700 border-2 hover:border-opacity-60 hover:shadow-md'
                }`}
                style={
                  selectedCategory === category.id
                    ? { backgroundColor: '#1f4333', borderColor: '#1f4333' }
                    : { borderColor: '#dcb557' }
                }
              >
                {category.name[language]}
              </button>
            ))}
          </div>
        </div>

        {/* Category Title */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1f4333' }}>
            {categories.find(c => c.id === selectedCategory)?.name[language]}
          </h2>
        </div>

        {/* Prominent Member Section - Centered and Prominent (Secretary General, President of Supervisory Body, Head of Electoral Commission) */}
        {prominentMember && (
          <div className="mb-12 md:mb-16">
            {/* <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold" style={{ color: '#dcb557' }}>
                {prominentMember.position[language]}
              </h3>
            </div> */}
            <div className="flex justify-center">
              <ProfileCard
              key={prominentMember.id}
              name={prominentMember.head[language]}
              title={prominentMember.position ? prominentMember.position[language] : prominentMember.name[language]}
              handle={getHandle(prominentMember)}
              status={prominentMember.email || prominentMember.phone || 'N/A'}
              contactText={t('offices.contact') || 'Contact'}
              avatarUrl={prominentMember.image}
              miniAvatarUrl={prominentMember.image}
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              showBehindGradient={false}
              behindGradient="none"
              innerGradient="none"
              iconUrl=""
              grainUrl=""
              className={language !== 'ar' ? 'smaller-text' : ''}
              onContactClick={() => handleContactClick(prominentMember)}
            />
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              {language === 'ar' ? 'جاري التحميل...' : language === 'en' ? 'Loading...' : 'Yükleniyor...'}
            </p>
          </div>
        )}

        {/* Other Members - Grid Layout: 2 per row usually, but configurable */}
        {!loading && otherMembers.length > 0 && (
          <div className={`offices-grid grid gap-2 sm:gap-4 justify-items-center max-w-6xl mx-auto ${
            selectedCategory === 'board' || selectedCategory === 'supervisory'
              ? 'grid-cols-2 md:grid-cols-6 md:gap-8 lg:gap-12' 
              : 'grid-cols-2 md:gap-6 lg:gap-8'
          }`}>
            {otherMembers.map((office, index) => {
              const colSpanClass = selectedCategory === 'board' || selectedCategory === 'supervisory'
                ? (index >= 2 && index < 5 ? 'col-span-1 md:col-span-2' : 'col-span-1 md:col-span-3')
                : 'col-span-1';

              return (
                <div key={office.id} className={`w-full flex justify-center ${colSpanClass}`}>
                  <ProfileCard
                    name={office.head[language]}
                    title={office.position ? office.position[language] : office.name[language]}
                    handle={getHandle(office)}
                    status={office.email || office.phone || 'N/A'}
                    contactText={t('offices.contact') || 'Contact'}
                    avatarUrl={office.image}
                    miniAvatarUrl={office.image}
                    showUserInfo={true}
                    enableTilt={true}
                    enableMobileTilt={false}
                    showBehindGradient={false}
                    behindGradient="none"
                    innerGradient="none"
                    iconUrl=""
                    grainUrl=""
                    className={language !== 'ar' ? 'smaller-text' : ''}
                    onContactClick={() => handleContactClick(office)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offices;
