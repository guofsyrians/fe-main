import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowRight, Calendar, FileText, Users, Eye, Globe, Search, Clock, Heart, MessageCircle } from 'lucide-react';
import { fetchArticles, getCachedData } from '../services/database';
import { toast } from 'sonner';

const Articles = () => {
  const { t, language, direction } = useLanguage();
  const [viewMode, setViewMode] = useState('articles');
  const [articles, setArticles] = useState(() => getCachedData('articles', null) || []);
  const [loading, setLoading] = useState(() => !getCachedData('articles', null));

  useEffect(() => {
    const loadArticles = async () => {
      try {
        // Only show loading if cache is empty
        if (!getCachedData('articles', null)) {
          setLoading(true);
        }
        const data = await fetchArticles();
        setArticles(data);
      } catch (error) {
        console.error('Error loading articles:', error);
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

    loadArticles();
  }, [language]);

  // Filter articles based on viewMode from hero buttons
  const getFilteredArticles = () => {
    if (viewMode === 'news') {
      return articles.filter(article => article.category === 'news');
    } else if (viewMode === 'articles') {
      return articles.filter(article => article.category !== 'news');
    }
    return articles.filter(article => article.category !== 'news');
  };

  const filteredArticles = getFilteredArticles();

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Split Buttons */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden flex flex-col md:flex-row">
        {/* Single Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/omawi.webp)' }}
        />
        
        {/* Left Section - News */}
        <button
          onClick={() => handleViewModeChange('news')}
          className={`relative flex-1 overflow-hidden cursor-pointer group transition-all duration-300 z-10 min-h-[200px] md:min-h-0 ${
            viewMode === 'news' ? 'scale-[1.02]' : ''
          }`}
        >
          {/* Overlay - Secondary color when active, Primary when inactive */}
          <div 
            className="absolute inset-0 transition-all duration-300"
            style={{ 
              backgroundColor: viewMode === 'news' 
                ? 'rgba(220, 181, 87, 0.6)' // Secondary (gold) when active
                : 'rgba(31, 67, 51, 0.6)'     // Primary (dark green) when inactive
            }}
          />
          
          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center z-10">
            {/* Text */}
            <span 
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold transition-all ${
                viewMode === 'news' ? 'scale-110' : ''
              }`}
              style={{ color: '#ffffff', textShadow: '2px 2px 12px rgba(0,0,0,0.8)' }}
            >
              {language === 'ar' ? '| الأخبار' : language === 'en' ? '| News' : '| Haberler'}
            </span>
            
            {/* Microphone Image - Bottom Left */}
            <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 opacity-80 group-hover:opacity-100 transition-opacity">
              <img 
                src="/assets/mic.png" 
                alt="Microphone" 
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
                style={{ filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.8))' }}
              />
            </div>
          </div>
        </button>
        
        {/* Right Section - Articles */}
        <button
          onClick={() => handleViewModeChange('articles')}
          className={`relative flex-1 overflow-hidden cursor-pointer group transition-all duration-300 z-10 min-h-[200px] md:min-h-0 ${
            viewMode === 'articles' ? 'scale-[1.02]' : ''
          }`}
        >
          {/* Overlay - Secondary color when active, Primary when inactive */}
          <div 
            className="absolute inset-0 transition-all duration-300"
            style={{ 
              backgroundColor: viewMode === 'articles' 
                ? 'rgba(220, 181, 87, 0.6)' // Secondary (gold) when active
                : 'rgba(31, 67, 51, 0.6)'     // Primary (dark green) when inactive
            }}
          />
          
          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center z-10">
            {/* Text */}
            <span 
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold transition-all ${
                viewMode === 'articles' ? 'scale-110' : ''
              }`}
              style={{ color: '#ffffff', textShadow: '2px 2px 12px rgba(0,0,0,0.8)' }}
            >
              {language === 'ar' ? 'المقالات |' : language === 'en' ? 'Articles |' : 'Makaleler |'}
            </span>
            
            {/* Newspaper Image - Bottom Right */}
            <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 opacity-80 group-hover:opacity-100 transition-opacity">
              <img 
                src="/assets/newspaper.png" 
                alt="Newspaper" 
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
                style={{ filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.8))' }}
              />
            </div>
          </div>
        </button>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 px-4" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Card 1: Published Articles */}
            <div 
              className="bg-white rounded-2xl p-8 text-center"
              style={{ backgroundColor: 'rgba(31, 67, 51, 0.05)' }}
            >
              <div className="flex justify-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#dcb557' }}
                >
                  <FileText size={24} color="#ffffff" />
                </div>
              </div>
              <h3 
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ color: '#1f4333' }}
              >
                247
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                {language === 'ar' ? 'مقالة منشورة' : language === 'en' ? 'Published Articles' : 'Yayınlanmış Makale'}
              </p>
            </div>

            {/* Card 2: Monthly Views */}
            <div 
              className="bg-white rounded-2xl p-8 text-center"
              style={{ backgroundColor: 'rgba(31, 67, 51, 0.05)' }}
            >
              <div className="flex justify-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#dcb557' }}
                >
                  <Eye size={24} color="#ffffff" />
                </div>
              </div>
              <h3 
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ color: '#1f4333' }}
              >
                125K
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                {language === 'ar' ? 'مشاهدة شهرية' : language === 'en' ? 'Monthly Views' : 'Aylık Görüntüleme'}
              </p>
            </div>

            {/* Card 3: Contributing Writers */}
            <div 
              className="bg-white rounded-2xl p-8 text-center"
              style={{ backgroundColor: 'rgba(220, 181, 87, 0.05)' }}
            >
              <div className="flex justify-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1f4333' }}
                >
                  <Users size={24} color="#ffffff" />
                </div>
              </div>
              <h3 
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ color: '#1f4333' }}
              >
                89
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                {language === 'ar' ? 'كاتب مساهم' : language === 'en' ? 'Contributing Writers' : 'Katkıda Bulunan Yazar'}
              </p>
            </div>

            {/* Card 4: Publishing Languages */}
            <div 
              className="bg-white rounded-2xl p-8 text-center"
              style={{ backgroundColor: 'rgba(220, 181, 87, 0.05)' }}
            >
              <div className="flex justify-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1f4333' }}
                >
                  <Globe size={24} color="#ffffff" />
                </div>
              </div>
              <h3 
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ color: '#1f4333' }}
              >
                3
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                {language === 'ar' ? 'لغات النشر' : language === 'en' ? 'Publishing Languages' : 'Yayın Dilleri'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="py-12 px-4">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4" style={{ color: '#1f4333' }}>
              {viewMode === 'news' 
                ? (language === 'ar' ? 'الأخبار' : language === 'en' ? 'News' : 'Haberler')
                : (language === 'ar' ? 'المقالات' : language === 'en' ? 'Articles' : 'Makaleler')
              }
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              {viewMode === 'news' 
                ? (language === 'ar' ? 'آخر الأخبار والتحديثات' : language === 'en' ? 'Latest news and updates' : 'Son haberler ve güncellemeler')
                : (language === 'ar' ? 'مقالات متنوعة وشاملة' : language === 'en' ? 'Diverse and comprehensive articles' : 'Çeşitli ve kapsamlı makaleler')
              }
            </p>
          </div>

          {/* Search Input Only - No Category Filter */}
          <div className={`flex justify-center mb-8 md:mb-12 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <div className="relative w-full md:w-96">
              <Search 
                className={`absolute top-1/2 -translate-y-1/2 ${direction === 'rtl' ? 'right-4' : 'left-4'} text-gray-400`}
                size={16}
              />
              <input
                type="text"
                placeholder={viewMode === 'news' 
                  ? (language === 'ar' ? 'ابحث في الأخبار...' : language === 'en' ? 'Search news...' : 'Haberlerde ara...')
                  : (language === 'ar' ? 'ابحث في المقالات...' : language === 'en' ? 'Search articles...' : 'Makale ara...')
                }
                className={`w-full h-[50px] rounded-full border border-gray-300 bg-white px-12 ${direction === 'rtl' ? 'text-right pr-12 pl-4' : 'text-left pl-12 pr-4'} focus:outline-none focus:ring-2 focus:ring-[#dcb557] focus:border-transparent`}
                style={{ fontSize: '16px', color: '#adaebc' }}
              />
            </div>
          </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              {language === 'ar' ? 'جاري التحميل...' : language === 'en' ? 'Loading...' : 'Yükleniyor...'}
            </p>
          </div>
        )}

        {/* Conditional Rendering Based on View Mode */}
        {!loading && viewMode === 'news' ? (
          /* NEWS UI - Exact Featured Article Style */
          <div>
            {filteredArticles.map((article, index) => (
              <Link key={article.id} to={`/articles/${article.id}`} className={`block ${index < filteredArticles.length - 1 ? 'mb-20 md:mb-24' : ''}`}>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  {/* Content Section - White Card */}
                  <div className={`bg-white rounded-3xl p-6 md:p-8 lg:p-12 flex flex-col justify-center shadow-xl ${direction === 'rtl' ? 'md:order-2' : 'md:order-1'}`}>
                    {/* Title */}
                    <h2 
                      className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                      style={{ color: '#1f4333' }}
                    >
                      {article.title[language]}
                    </h2>

                    {/* Description */}
                    <p 
                      className={`text-base md:text-lg text-gray-700 mb-6 md:mb-8 leading-relaxed line-clamp-3 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                    >
                      {article.excerpt[language]}
                    </p>

                    {/* Date and Stats */}
                    <div className={`flex items-center gap-6 mb-8 flex-wrap ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={16} />
                        <span className="text-sm">
                          {article.formattedDate?.[language] || article.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Eye size={16} />
                        <span className="text-sm">247</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Heart size={16} />
                        <span className="text-sm">89</span>
                      </div>
                    </div>

                    {/* Read Full News Button */}
                    <Button
                      className="rounded-full px-6 py-4 font-semibold hover:opacity-90 transition-all"
                      style={{ backgroundColor: '#dcb557', color: 'white' }}
                    >
                      {language === 'ar' ? 'اقرأ الخبر كاملاً' : language === 'en' ? 'Read Full News' : 'Haberin Tamamını Oku'}
                      <ArrowRight 
                        className={`${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} 
                        size={16} 
                      />
                    </Button>
                  </div>

                  {/* Image Section - Separate */}
                  <div className={`relative overflow-hidden rounded-3xl flex items-center justify-center h-64 md:h-96 lg:h-[400px] ${direction === 'rtl' ? 'md:order-1' : 'md:order-2'}`} style={{ backgroundColor: 'transparent' }}>
                    <div className="relative w-full h-full">
                      <img 
                        src={article.image} 
                        alt={article.title[language]} 
                        className="w-full h-full max-h-full object-contain bg-transparent rounded-3xl" 
                        style={{ backgroundColor: 'transparent', borderRadius: '1.5rem', display: 'block' }} 
                      />
                      
                      {/* News Badge - Top Right */}
                      <div 
                        className="absolute top-2 md:top-4 right-2 md:right-4 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold text-white"
                        style={{ backgroundColor: '#1f4333' }}
                      >
                        {language === 'ar' ? 'خبر' : language === 'en' ? 'NEWS' : 'HABER'}
                      </div>
                    </div>

                    {/* Read Time Badge - Bottom Left */}
                    <div 
                      className="absolute bottom-3 md:bottom-6 left-3 md:left-6 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-white/90 backdrop-blur-sm"
                      style={{ color: '#1f4333' }}
                    >
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span className="text-xs md:text-sm font-medium">
                          {language === 'ar' ? 'قراءة 5 دقائق' : language === 'en' ? '5 min read' : '5 dk okuma'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : viewMode === 'articles' ? (
          /* ARTICLES UI - Card Grid with Featured Article */
          <>
            {/* Featured Article Card */}
            {filteredArticles.length > 0 && (
              <div className="mb-12 md:mb-24 lg:mb-32">
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  {/* Left: Content */}
                  <div className={`bg-white rounded-3xl p-6 md:p-8 lg:p-12 flex flex-col justify-center shadow-xl ${direction === 'rtl' ? 'md:order-2' : 'md:order-1'}`}>
                    {/* Title */}
                    <h2 
                      className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                      style={{ color: '#1f4333' }}
                    >
                      {filteredArticles[0].title[language]}
                    </h2>

                    {/* Description */}
                    <p 
                      className={`text-base md:text-lg text-gray-700 mb-6 md:mb-8 leading-relaxed line-clamp-3 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                    >
                      {filteredArticles[0].excerpt[language]}
                    </p>

                    {/* Date and Stats */}
                    <div className={`flex items-center gap-6 mb-8 flex-wrap ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={16} />
                        <span className="text-sm">
                          {filteredArticles[0].formattedDate?.[language] || filteredArticles[0].date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Eye size={16} />
                        <span className="text-sm">89</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Heart size={16} />
                        <span className="text-sm">247</span>
                      </div>
                    </div>

                    {/* Read Full Article Button */}
                    <Link to={`/articles/${filteredArticles[0].id}`}>
                      <Button
                        className="rounded-full px-6 py-4 font-semibold hover:opacity-90 transition-all"
                        style={{ backgroundColor: '#dcb557', color: 'white' }}
                      >
                        {language === 'ar' ? 'اقرأ المقال كاملاً' : language === 'en' ? 'Read Full Article' : 'Makalenin Tamamını Oku'}
                        <ArrowRight 
                          className={`${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} 
                          size={16} 
                        />
                      </Button>
                    </Link>
                  </div>

                  {/* Right: Image */}
                  <div className={`relative overflow-hidden rounded-3xl flex items-center justify-center h-64 md:h-96 lg:h-[400px] ${direction === 'rtl' ? 'md:order-1' : 'md:order-2'}`} style={{ backgroundColor: 'transparent' }}>
                    <div className="relative w-full h-full">
                      <img 
                        src={filteredArticles[0].image} 
                        alt={filteredArticles[0].title[language]} 
                        className="w-full h-full max-h-full object-contain bg-transparent rounded-3xl" 
                        style={{ backgroundColor: 'transparent', borderRadius: '1.5rem', display: 'block' }} 
                      />
                      
                      {/* Category Badge - Top Right */}
                      <div 
                        className="absolute top-2 md:top-4 right-2 md:right-4 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold text-white"
                        style={{ backgroundColor: '#dcb557' }}
                      >
                        {language === 'ar' ? 'مقال مميز' : language === 'en' ? 'Featured' : 'Öne Çıkan'}
                      </div>
                    </div>

                    {/* Read Time Badge - Bottom Left */}
                    <div 
                      className="absolute bottom-3 md:bottom-6 left-3 md:left-6 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-white/90 backdrop-blur-sm"
                      style={{ color: '#1f4333' }}
                    >
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span className="text-xs md:text-sm font-medium">
                          {language === 'ar' ? 'قراءة 8 دقائق' : language === 'en' ? '8 min read' : '8 dk okuma'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {filteredArticles.slice(1).map((article) => (
                <Link key={article.id} to={`/articles/${article.id}`}>
                  <Card className="hover:shadow-xl transition-all overflow-hidden group cursor-pointer h-full">
                    {/* Image */}
                    <div className="h-72 md:h-80 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title[language]} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <span 
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{ backgroundColor: '#dcb557', color: '#1f4333' }}
                        >
                          {language === 'ar' ? 'مقال' : language === 'en' ? 'Article' : 'Makale'}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar size={14} />
                          <span>{article.date}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl leading-tight" style={{ color: '#1f4333' }}>
                        {article.title[language]}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {article.excerpt[language]}
                      </p>
                      <div 
                        className="flex items-center font-semibold group/btn"
                        style={{ color: '#dcb557' }}
                      >
                        {t('articles.readMore')}
                        <ArrowRight 
                          className={`${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'} group-hover/btn:translate-x-1 transition-transform`} 
                          size={16} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : null}

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              {language === 'ar' ? 'لا توجد مقالات في هذه الفئة' : language === 'en' ? 'No articles in this category' : 'Bu kategoride makale yok'}
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Articles;
