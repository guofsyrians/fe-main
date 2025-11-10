import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ProfileCard from '../components/ProfileCard';
import { offices } from '../mock';

const Offices = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('board');

  // Categories matching the reference website structure
  const categories = [
    { id: 'board', name: { ar: 'مجلس الإدارة', en: 'Board of Directors', tr: 'Yönetim Kurulu' } },
    { id: 'supervisory', name: { ar: 'الهيئة الرقابية', en: 'Supervisory Body', tr: 'Denetim Kurulu' } },
    { id: 'electoral', name: { ar: 'الهيئة الانتخابية', en: 'Electoral Commission', tr: 'Seçim Komisyonu' } },
    { id: 'offices', name: { ar: 'المكاتب واللجان التنفيذية', en: 'Offices & Executive Committees', tr: 'Ofisler ve İcra Komiteleri' } }
  ];

  // Filter offices by category
  const filteredOffices = offices.filter(office => office.category === selectedCategory);
  
  // Separate Secretary General from other board members
  const secretaryGeneral = selectedCategory === 'board' 
    ? filteredOffices.find(office => office.position?.en === 'Secretary General')
    : null;
  
  const otherMembers = secretaryGeneral 
    ? filteredOffices.filter(office => office.id !== secretaryGeneral.id)
    : filteredOffices;

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
        <div className="mb-8 md:mb-12 overflow-x-auto">
          <div className="flex gap-2 md:gap-3 justify-center flex-wrap md:flex-nowrap min-w-max px-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-all duration-300 whitespace-nowrap min-h-[44px] ${
                  selectedCategory === category.id
                    ? 'text-white shadow-lg transform scale-105'
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

        {/* Secretary General Section - Centered and Prominent */}
        {secretaryGeneral && (
          <div className="mb-12 md:mb-16">
            {/* <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold" style={{ color: '#dcb557' }}>
                {secretaryGeneral.position[language]}
              </h3>
            </div> */}
            <div className="flex justify-center">
              <ProfileCard
              key={secretaryGeneral.id}
              name={secretaryGeneral.head[language]}
              title={secretaryGeneral.position ? secretaryGeneral.position[language] : secretaryGeneral.name[language]}
              handle={getHandle(secretaryGeneral)}
              status={secretaryGeneral.email || secretaryGeneral.phone ? t('offices.available') || 'Available' : 'N/A'}
              contactText={t('offices.contact') || 'Contact'}
              avatarUrl={secretaryGeneral.image}
              miniAvatarUrl={secretaryGeneral.image}
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              showBehindGradient={false}
              behindGradient="none"
              innerGradient="none"
              iconUrl=""
              grainUrl=""
              className={language !== 'ar' ? 'smaller-text' : ''}
              onContactClick={() => handleContactClick(secretaryGeneral)}
            />
            </div>
          </div>
        )}

        {/* Other Members - Two Rows: 2 cards then 3 cards */}
        <div className="space-y-6 md:space-y-8">
          {/* First Row: 2 cards */}
          {firstRowMembers.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
              {firstRowMembers.map((office) => (
                <div key={office.id} className="flex-shrink-0">
                  <ProfileCard
                    name={office.head[language]}
                    title={office.position ? office.position[language] : office.name[language]}
                    handle={getHandle(office)}
                    status={office.email || office.phone ? t('offices.available') || 'Available' : 'N/A'}
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
              ))}
            </div>
          )}

          {/* Second Row: 3 cards */}
          {secondRowMembers.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
              {secondRowMembers.map((office) => (
                <div key={office.id} className="flex-shrink-0">
                  <ProfileCard
                    name={office.head[language]}
                    title={office.position ? office.position[language] : office.name[language]}
                    handle={getHandle(office)}
                    status={office.email || office.phone ? t('offices.available') || 'Available' : 'N/A'}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Offices;
