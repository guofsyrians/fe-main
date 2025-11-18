import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, Phone, Users, X, MapPin, Calendar, ExternalLink, ArrowLeft } from 'lucide-react';
import { fetchCities, fetchSubUnions } from '../services/database';
import { toast } from 'sonner';
import TurkeyMap from '../components/TurkeyMap';

const SubUnions = () => {
  const { t, language } = useLanguage();
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedUnion, setSelectedUnion] = useState(null);
  const [cities, setCities] = useState([]);
  const [subUnions, setSubUnions] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapEndRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [citiesData, subUnionsData] = await Promise.all([
          fetchCities(),
          fetchSubUnions()
        ]);
        setCities(citiesData);
        setSubUnions(subUnionsData);
      } catch (error) {
        console.error('Error loading data:', error);
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

    loadData();
  }, [language]);

  // Helper function to find database union by name
  const findDatabaseUnion = (unionName) => {
    if (typeof unionName === 'string') {
      return subUnions.find(dbUnion => 
        dbUnion.name.ar === unionName || 
        dbUnion.name.en === unionName || 
        dbUnion.name.tr === unionName
      );
    }
    // If unionName is already an object with name property
    if (unionName && unionName.name) {
      return subUnions.find(dbUnion => 
        dbUnion.id === unionName.id ||
        (dbUnion.name.ar === unionName.name?.ar || 
         dbUnion.name.en === unionName.name?.en || 
         dbUnion.name.tr === unionName.name?.tr)
      );
    }
    return null;
  };

  // Helper function to get union-specific description or fallback to generic
  const getUnionDescription = (union, type = 'cardDescription') => {
    // If union is already from database (has id and matches), use it directly
    if (union.id && subUnions.find(u => u.id === union.id)) {
      const fieldMap = {
        'cardDescription': 'cardDescription',
        'aboutDescription': 'aboutDescription'
      };
      const field = fieldMap[type] || type;
      const value = union[field];
      
      if (value && value[language]) {
        return value[language];
      }
    }
    
    // Otherwise try to find it in database
    const dbUnion = findDatabaseUnion(union);
    
    if (dbUnion) {
      const fieldMap = {
        'cardDescription': 'cardDescription',
        'aboutDescription': 'aboutDescription'
      };
      const field = fieldMap[type] || type;
      const value = dbUnion[field];
      
      if (value && value[language]) {
        return value[language];
      }
    }
    
    // Fallback to generic description
    return t(`subUnions.${type}`);
  };

  // Helper function to get union-specific field data
  const getUnionField = (union, fieldName) => {
    // If union is already from database, use it directly
    if (union.id && subUnions.find(u => u.id === union.id)) {
      const value = union[fieldName];
      if (value && value[language]) {
        return value[language];
      }
    }
    
    // Otherwise try to find it in database
    const dbUnion = findDatabaseUnion(union);
    
    if (dbUnion) {
      const value = dbUnion[fieldName];
      if (value && value[language]) {
        return value[language];
      }
    }
    
    return null;
  };

  // Helper function to get union logo URL
  const getUnionLogo = (union) => {
    // If union is already from database, use it directly
    if (union.id && subUnions.find(u => u.id === union.id)) {
      if (union.logo) {
        return union.logo;
      }
    }
    
    // Otherwise try to find it in database
    const dbUnion = findDatabaseUnion(union);
    
    if (dbUnion && dbUnion.logo) {
      return dbUnion.logo;
    }
    
    return '/assets/sampleLogo.png';
  };

  const handleCityClick = (cityId) => {
    setSelectedCity(cityId);
    // Scroll to end of map section with smooth animation
    setTimeout(() => {
      mapEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };


  return (
    <div className="min-h-screen py-12 px-4">
      {/* Modal */}
      {selectedUnion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUnion(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header with Image */}
            <div className="relative h-48 md:h-64 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
              <button
                onClick={() => setSelectedUnion(null)}
                className="absolute top-3 md:top-4 right-3 md:right-4 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                <X size={24} style={{ color: '#1f4333' }} />
              </button>
              <img
                src={getUnionLogo(selectedUnion)}
                alt={selectedUnion.name}
                className="w-40 h-40 object-contain"
                onError={(e) => {
                  e.target.src = '/assets/sampleLogo.png';
                }}
              />
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-6 lg:p-8">
              {/* Title and City Badge */}
              <div className="mb-4 md:mb-6">
                {selectedUnion.city && (
                <div className="inline-block px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-semibold text-white mb-2 md:mb-3" style={{ backgroundColor: '#dcb557' }}>
                  <MapPin size={12} className="inline mr-1 w-3 h-3 md:w-3.5 md:h-3.5" />
                  {selectedUnion.city[language]}
                </div>
                )}
                <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#1f4333', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                  {selectedUnion.name[language]}
                </h2>
                {selectedUnion.city && (
                <p className="text-sm md:text-base text-gray-600" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                  {language === 'ar' ? `في ${selectedUnion.city.ar}` : language === 'en' ? `In ${selectedUnion.city.en}` : `${selectedUnion.city.tr}'de`}
                </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: '#1f4333', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                  {t('subUnions.aboutUnion')}
                </h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                  {getUnionDescription(selectedUnion, 'aboutDescription')}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {(() => {
                  const dbUnion = findDatabaseUnion(selectedUnion.name);
                  const establishedYear = dbUnion?.establishedYear;
                  return establishedYear ? (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Calendar size={20} style={{ color: '#dcb557' }} className="mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          {t('subUnions.established')}
                        </p>
                        <p className="text-gray-800 font-bold">{establishedYear}</p>
                      </div>
                    </div>
                  ) : null;
                })()}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Users size={20} style={{ color: '#dcb557' }} className="mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      {t('subUnions.status')}
                    </p>
                    <p className="text-gray-800 font-bold">
                      {t('subUnions.active')}
                    </p>
                  </div>
                </div>
                {getUnionField(selectedUnion, 'contactNumber') && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone size={20} style={{ color: '#dcb557' }} className="mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-gray-600">
                        {t('subUnions.contactNumber')}
                      </p>
                      <p className="text-gray-800 font-bold">
                        {getUnionField(selectedUnion, 'contactNumber')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Activities and Achievements */}
              {getUnionField(selectedUnion, 'activitiesAndAchievements') && (
                <div className="mb-4 md:mb-6">
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: '#1f4333', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                    {t('subUnions.activitiesAndAchievements')}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                    {getUnionField(selectedUnion, 'activitiesAndAchievements')}
                  </p>
                </div>
              )}

              {/* Special Achievements */}
              {getUnionField(selectedUnion, 'specialAchievements') && (
                <div className="mb-4 md:mb-6">
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: '#1f4333', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                    {t('subUnions.specialAchievements')}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                    {getUnionField(selectedUnion, 'specialAchievements')}
                  </p>
                </div>
              )}

              {/* Current Administrative Team */}
              {getUnionField(selectedUnion, 'currentAdministrativeTeam') && (
                <div className="mb-4 md:mb-6">
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: '#1f4333', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                    {t('subUnions.currentAdministrativeTeam')}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                    {getUnionField(selectedUnion, 'currentAdministrativeTeam')}
                  </p>
                </div>
              )}

              {/* Notes */}
              {getUnionField(selectedUnion, 'notes') && (
                <div className="mb-4 md:mb-6">
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: '#1f4333', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                    {t('subUnions.notes')}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                    {getUnionField(selectedUnion, 'notes')}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {/*  <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2 min-h-[44px]"
                  style={{ backgroundColor: '#1f4333', color: 'white' }}
                >
                  <ExternalLink size={16} className="md:w-[18px] md:h-[18px]" />
                  {t('subUnions.visitWebsite')}
                </button>
                <button
                  className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2 min-h-[44px]"
                  style={{ backgroundColor: '#dcb557', color: '#1f4333' }}
                >
                  <Mail size={16} className="md:w-[18px] md:h-[18px]" />
                  {t('subUnions.contact')}
                </button>
              </div>*/}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4" style={{ color: '#1f4333' }}>
            {t('subUnions.title')}
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {t('subUnions.subtitle')}
          </p>
        </div>

        {/* Turkey Map Section */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 md:mb-6 text-center" style={{ color: '#1f4333' }}>
            {t('subUnions.mapTitle')}
          </h2>

          <Card className="overflow-hidden border-2" style={{ borderColor: '#1f4333' }}>
            <CardContent className="p-0">
              {/* Map Container */}
              <div className="relative w-full bg-gradient-to-br from-blue-50 to-blue-100 h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[600px]">
                {/* Detailed Turkey Map with all 81 provinces from tr-04.svg - clickable provinces */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <TurkeyMap
                    onProvinceClick={handleCityClick}
                    selectedCity={selectedCity}
                    cities={cities}
                    subUnions={subUnions}
                  />
                  
                </div>
                {/* Scroll anchor at end of map */}
                <div ref={mapEndRef}></div>
              </div>
            </CardContent>
          </Card>
          
        </div>


        {/* Unions List by selected city */}
        {!loading && (
        <div>
          {selectedCity ? (() => {
            const cityObj = cities.find(c => c.id === selectedCity);
            // Filter sub-unions by city_id or city name match
            const unionsForCity = subUnions.filter(u => {
              if (u.cityId) {
                // Match by city_id if available
                const city = cities.find(c => c.id === selectedCity);
                return u.city && (
                  u.city.ar === cityObj?.name?.ar ||
                  u.city.en === cityObj?.name?.en ||
                  u.city.tr === cityObj?.name?.tr
                );
              }
              // Fallback to name matching
              return u.city && (
                u.city.ar === cityObj?.name?.ar ||
                u.city.en === cityObj?.name?.en ||
                u.city.tr === cityObj?.name?.tr
              );
            });
            return (
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#1f4333' }}>
                  {cityObj?.name?.[language] || ''}
                </h2>
                {unionsForCity.length === 0 ? (
                  <p className="text-gray-600">{t('subUnions.noUnionsInCity')}</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                    {unionsForCity.map((u, idx) => {
                      // Mock data for member count and tags - can be replaced with real data
                      const memberCount = Math.floor(Math.random() * 1000) + 100;
                      const tags = [
                        t('subUnions.academic'),
                        t('subUnions.cultural'),
                        t('subUnions.social')
                      ];
                      const establishedYear = 2015 + Math.floor(Math.random() * 10);

                      return (
                        <Card
                          key={u.id || idx}
                          className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer"
                          style={{ borderRadius: '24px' }}
                          onClick={() => setSelectedUnion(u)}
                        >
                          {/* Image Header - larger size */}
                          <div className="relative w-full h-40 sm:h-60 md:h-80 overflow-hidden bg-white flex items-center justify-center">
                            <img
                              src={getUnionLogo(u)}
                              alt={u.name[language]}
                              className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain"
                              onError={(e) => {
                                e.target.src = '/assets/sampleLogo.png';
                                e.target.className = 'w-48 h-48 object-contain opacity-20';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
                            {/* Region/City Badge - Top Right */}
                            {u.city && (
                            <div
                              className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 px-2 py-0.5 sm:px-3 sm:py-1 md:px-4 md:py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white z-10"
                              style={{ backgroundColor: idx % 4 === 0 ? '#ef4444' : idx % 4 === 1 ? '#3b82f6' : idx % 4 === 2 ? '#10b981' : '#eab308' }}
                            >
                              {u.city[language]}
                            </div>
                            )}
                            {/* Member Count Badge - Bottom Left */}
                            {/* <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Users size={14} style={{ color: '#1f4333' }} />
                                <span className="text-sm font-medium" style={{ color: '#1f4333' }}>
                                  {memberCount.toLocaleString()} {language === 'ar' ? 'عضو' : language === 'tr' ? 'üye' : 'members'}
                                </span>
                              </div>
                            </div> */}
                          </div>

                          {/* Content - matching Figma spacing */}
                          <div className="p-3 sm:p-5 md:p-8">
                            {/* Title */}
                            <h3
                              className="text-sm sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 leading-tight sm:leading-8 line-clamp-2"
                              style={{ color: '#1f4333', direction: language === 'ar' ? 'rtl' : 'ltr' }}
                            >
                              {u.name[language]}
                            </h3>
                            {/* Location */}
                            {u.city && (
                            <p
                              className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3 md:mb-4 line-clamp-1"
                              style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                            >
                              {language === 'ar' ? `في ${u.city.ar}` : language === 'en' ? `In ${u.city.en}` : `${u.city.tr}'de`}
                            </p>
                            )}
                            {/* Description */}
                            <p
                              className="text-xs sm:text-sm md:text-base text-gray-700 mb-3 sm:mb-4 md:mb-6 leading-relaxed line-clamp-3 sm:line-clamp-none sm:min-h-[78px]"
                              style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                            >
                              {getUnionDescription(u, 'cardDescription')}
                            </p>

                            {/* Tags */}
                            {/* <div className="flex flex-wrap gap-2 mb-6" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                              {tags.slice(0, 3).map((tag, tagIdx) => (
                                <span
                                  key={tagIdx}
                                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                                  style={{ 
                                    backgroundColor: 'rgba(31, 67, 51, 0.1)',
                                    color: '#1f4333'
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div> */}

                            {/* Footer - Learn More and Established Date */}
                            <div className="flex items-center justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                              {/* Established Date with Calendar Icon */}
                              {u.establishedYear && (
                              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                                <Calendar size={12} className="sm:w-3.5 sm:h-3.5 md:w-[14px] md:h-[14px]" />
                                <span>
                                  {language === 'ar' ? `${t('subUnions.establishedYear')} ${u.establishedYear}` : language === 'tr' ? `${u.establishedYear} ${t('subUnions.establishedYear')}` : `${t('subUnions.establishedYear')} ${u.establishedYear}`}
                                </span>
                              </div>
                              )}
                              {/* Learn More Link */}
                              <button
                                className="text-xs sm:text-sm md:text-base font-medium hover:opacity-80 transition-opacity flex items-center gap-1"
                                style={{ color: '#dcb557', direction: language === 'ar' ? 'rtl' : 'ltr' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUnion(u);
                                }}
                              >
                                {t('subUnions.learnMore')}
                                {language === 'ar' ? <ArrowLeft size={12} className="sm:w-4 sm:h-4 md:w-4 md:h-4 rotate-180" /> : <ArrowLeft size={12} className="sm:w-4 sm:h-4 md:w-4 md:h-4" />}
                              </button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })() : (
            <div className="text-center py-16">
              <div className="inline-block p-6 rounded-full mb-4" style={{ backgroundColor: '#f7fafc' }}>
                <Users size={48} style={{ color: '#1f4333' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#1f4333' }}>
                {t('subUnions.selectCity')}
              </h3>
              <p className="text-gray-600">
                {t('subUnions.clickCityToView')}
              </p>
            </div>
          )}
        </div>
        )}

        {/* All Subunions */}
        {!loading && (
        <div className="mt-16 md:mt-24 lg:mt-40">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-12 md:mb-16 lg:mb-20 text-center" style={{ color: '#1f4333' }}>
            {t('subUnions.allSubunions')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            {subUnions.map((u, idx) => {
              // Determine region color based on city
              const getRegionColor = (cityObj) => {
                if (!cityObj) return '#eab308';
                const cityName = cityObj.ar || cityObj.en || cityObj.tr || '';
                const cityLower = cityName.toLowerCase();
                if (cityLower.includes('إسطنبول') || cityLower.includes('istanbul')) return '#ef4444';
                if (cityLower.includes('إزمير') || cityLower.includes('izmir')) return '#3b82f6';
                if (cityLower.includes('مرسين') || cityLower.includes('mersin')) return '#10b981';
                return '#eab308';
              };

              return (
                <Card
                  key={u.id || idx}
                  className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer"
                  style={{ borderRadius: '24px' }}
                  onClick={() => setSelectedUnion(u)}
                >
                  {/* Image Header - larger size */}
                  <div className="relative w-full h-40 sm:h-60 md:h-80 overflow-hidden bg-white flex items-center justify-center">
                    <img
                      src={getUnionLogo(u)}
                      alt={u.name[language]}
                      className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain"
                      onError={(e) => {
                        e.target.src = '/assets/sampleLogo.png';
                        e.target.className = 'w-48 h-48 object-contain opacity-20';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
                    {/* Region/City Badge - Top Right */}
                    {u.city && (
                    <div
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 px-2 py-0.5 sm:px-3 sm:py-1 md:px-4 md:py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white z-10"
                      style={{ backgroundColor: getRegionColor(u.city) }}
                    >
                      {u.city[language]}
                    </div>
                    )}
                    {/* Member Count Badge - Bottom Left */}
                    {/* <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users size={14} style={{ color: '#1f4333' }} />
                        <span className="text-sm font-medium" style={{ color: '#1f4333' }}>
                          {memberCount.toLocaleString()} {language === 'ar' ? 'عضو' : language === 'tr' ? 'üye' : 'members'}
                        </span>
                      </div>
                    </div> */}
                  </div>

                  {/* Content - matching Figma spacing */}
                  <div className="p-3 sm:p-5 md:p-8">
                    {/* Title */}
                    <h3
                      className="text-sm sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 leading-tight sm:leading-8 line-clamp-2"
                      style={{ color: '#1f4333', direction: language === 'ar' ? 'rtl' : 'ltr' }}
                    >
                      {u.name[language]}
                    </h3>
                    {/* Location */}
                    {u.city && (
                    <p
                      className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3 md:mb-4 line-clamp-1"
                      style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                    >
                      {language === 'ar' ? `في ${u.city.ar}` : language === 'en' ? `In ${u.city.en}` : `${u.city.tr}'de`}
                    </p>
                    )}
                    {/* Description */}
                    <p
                      className="text-xs sm:text-sm md:text-base text-gray-700 mb-3 sm:mb-4 md:mb-6 leading-relaxed line-clamp-3 sm:line-clamp-none sm:min-h-[78px]"
                      style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                    >
                      {getUnionDescription(u, 'cardDescription')}
                    </p>

                    {/* Tags */}
                    {/* <div className="flex flex-wrap gap-2 mb-6" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                      {tags.slice(0, 3).map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-3 py-1.5 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: 'rgba(31, 67, 51, 0.1)',
                            color: '#1f4333'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div> */}

                    {/* Footer - Learn More and Established Date */}
                    <div className="flex items-center justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                      {/* Established Date with Calendar Icon */}
                      {u.establishedYear && (
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                        <Calendar size={12} className="sm:w-3.5 sm:h-3.5 md:w-[14px] md:h-[14px]" />
                        <span>
                          {language === 'ar' ? `${t('subUnions.establishedYear')} ${u.establishedYear}` : language === 'tr' ? `${u.establishedYear} ${t('subUnions.establishedYear')}` : `${t('subUnions.establishedYear')} ${u.establishedYear}`}
                        </span>
                      </div>
                      )}
                      {/* Learn More Link */}
                      <button
                        className="text-xs sm:text-sm md:text-base font-medium hover:opacity-80 transition-opacity flex items-center gap-1"
                        style={{ color: '#dcb557', direction: language === 'ar' ? 'rtl' : 'ltr' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUnion(u);
                        }}
                      >
                        {t('subUnions.learnMore')}
                        {language === 'ar' ? <ArrowLeft size={12} className="sm:w-4 sm:h-4 md:w-4 md:h-4 rotate-180" /> : <ArrowLeft size={12} className="sm:w-4 sm:h-4 md:w-4 md:h-4" />}
                      </button>
                    </div>
                  </div>
                </Card>
              );
              })}
            </div>
          </div>
        )}
        </div>
    </div>
  );
};

export default SubUnions;
