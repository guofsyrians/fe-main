import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Users, MapPin, Briefcase, Building2, ArrowRight, Target, Eye, Heart, BookOpen, Lightbulb, TrendingUp, ExternalLink, ChevronLeft, ChevronRight, Calendar, ArrowLeft, X, Mail, Radio, Handshake } from 'lucide-react';
import { articles, projects, offices } from '../mock';
import subunionsData from '../data/subunions.json';
import '../styles/animations.css';

const Home = () => {
  const { t, language, direction } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoSlideTimerRef = useRef(null);
  const pauseTimeoutRef = useRef(null);
  const [selectedUnion, setSelectedUnion] = useState(null);

  const stats = [
    { value: '5000+', label: t('home.stats.students'), icon: Users },
    { value: '15+', label: t('home.stats.unions'), icon: MapPin },
    { value: '12+', label: t('home.stats.projects'), icon: Briefcase },
    { value: '8+', label: t('home.stats.cities'), icon: Building2 }
  ];

  const recentArticles = articles.slice(0, 5);
  const recentProjects = projects.filter(p => p.status === 'ongoing').slice(0, 3);
  const [featuredArticleIndex, setFeaturedArticleIndex] = useState(0);

  // Start auto-sliding
  const startAutoSlide = () => {
    // Clear any existing timer
    if (autoSlideTimerRef.current) {
      clearInterval(autoSlideTimerRef.current);
    }
    
    autoSlideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % recentArticles.length);
    }, 5000); // Change slide every 5 seconds
  };

  // Pause auto-sliding temporarily
  const pauseAutoSlide = () => {
    // Clear current timer
    if (autoSlideTimerRef.current) {
      clearInterval(autoSlideTimerRef.current);
      autoSlideTimerRef.current = null;
    }
    
    // Clear any existing pause timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    // Resume auto-sliding after 10 seconds
    pauseTimeoutRef.current = setTimeout(() => {
      startAutoSlide();
    }, 10000);
  };

  // Auto-play slider on mount
  useEffect(() => {
    startAutoSlide();
    
    return () => {
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current);
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [recentArticles.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % recentArticles.length);
    pauseAutoSlide();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + recentArticles.length) % recentArticles.length);
    pauseAutoSlide();
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    pauseAutoSlide();
  };

  return (
    <div className="min-h-screen">
      {/* Modal */}
      {selectedUnion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUnion(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header with Image */}
            <div className="relative h-64 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
              <button
                onClick={() => setSelectedUnion(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all z-10"
              >
                <X size={24} style={{ color: '#1f4333' }} />
              </button>
              <img
                src="/assets/sampleLogo.png"
                alt={selectedUnion.name}
                className="w-40 h-40 object-contain"
              />
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Title and City Badge */}
              <div className="mb-6">
                <div className="inline-block px-4 py-1 rounded-full text-sm font-semibold text-white mb-3" style={{ backgroundColor: '#dcb557' }}>
                  <MapPin size={14} className="inline mr-1" />
                  {selectedUnion.city}
                </div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: '#1f4333', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                  {selectedUnion.name}
                </h2>
                <p className="text-gray-600" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                  {selectedUnion.location}
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3" style={{ color: '#1f4333', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                  {language === 'ar' ? 'نبذة عن الاتحاد' : language === 'tr' ? 'Birlik Hakkında' : 'About the Union'}
                </h3>
                <p className="text-gray-700 leading-relaxed" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                  {language === 'ar'
                    ? 'يمثل هذا الاتحاد الطلبة السوريين في الجامعة ويعمل على تقديم الدعم الأكاديمي والاجتماعي والثقافي لهم. تأسس الاتحاد بمبادرة من الطلاب لتوحيد جهودهم وتمثيل مصالحهم داخل الجامعة وخارجها، وتنظيم الفعاليات والأنشطة التي تعزز الهوية الوطنية والتواصل بين الطلبة.'
                    : language === 'tr'
                      ? 'Bu birlik, üniversitedeki Suriyeli öğrencileri temsil eder ve onlara akademik, sosyal ve kültürel destek sağlamak için çalışır. Birlik, öğrencilerin çabalarını birleştirmek ve üniversite içinde ve dışında çıkarlarını temsil etmek için öğrenci inisiyatifiyle kurulmuştur.'
                      : 'This union represents Syrian students at the university and works to provide them with academic, social, and cultural support. The union was established by student initiative to unite their efforts and represent their interests inside and outside the university.'}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar size={20} style={{ color: '#dcb557' }} className="mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'تاريخ التأسيس' : language === 'tr' ? 'Kuruluş Tarihi' : 'Established'}
                    </p>
                    <p className="text-gray-800 font-bold">2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Users size={20} style={{ color: '#dcb557' }} className="mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'الحالة' : language === 'tr' ? 'Durum' : 'Status'}
                    </p>
                    <p className="text-gray-800 font-bold">
                      {language === 'ar' ? 'نشط' : language === 'tr' ? 'Aktif' : 'Active'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  className="flex-1 px-6 py-3 rounded-lg text-base font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#1f4333', color: 'white' }}
                >
                  <ExternalLink size={18} />
                  {language === 'ar' ? 'زيارة الموقع' : language === 'tr' ? 'Siteyi Ziyaret Et' : 'Visit Website'}
                </button>
                <button
                  className="px-6 py-3 rounded-lg text-base font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#dcb557', color: '#1f4333' }}
                >
                  <Mail size={18} />
                  {language === 'ar' ? 'تواصل معنا' : language === 'tr' ? 'Bize Ulaşın' : 'Contact Us'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Background Image */}
      <section 
        className="relative py-64 px-4 bg-cover bg-center overflow-hidden flex items-center"
        style={{ 
          backgroundImage: 'url(/assets/galata.png)',
          minHeight: '700px',
          border: 'none',
          outline: 'none'
        }}
      >
        {/* Animated Gradient Overlay */}
        <div 
          className="absolute inset-0 animate-gradient" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(31, 67, 51, 0.6), rgba(220, 181, 87, 0.3), rgba(31, 67, 51, 0.6))'
          }}
        ></div>
        
        {/* Floating Decorative Elements */}
        <div 
          className="absolute top-20 left-10 w-20 h-20 rounded-full blur-xl animate-float"
          style={{ backgroundColor: 'rgba(220, 181, 87, 0.2)' }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-32 h-32 rounded-full blur-xl animate-float-delayed"
          style={{ backgroundColor: 'rgba(31, 67, 51, 0.2)' }}
        ></div>
        <div 
          className="absolute top-1/2 right-20 w-24 h-24 rounded-full blur-xl animate-float"
          style={{ backgroundColor: 'rgba(220, 181, 87, 0.15)', animationDelay: '1s' }}
        ></div>
        
        {/* Glassmorphism Content Container */}
        <div className="relative z-10 max-w-4xl ml-auto mr-24 pr-8">
          <div 
            className="glass-ultra rounded-3xl p-8 md:p-12 shadow-2xl"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none'
            }}
          >
            <h1 
              className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight text-white"
              style={{
                textShadow: '0 0 20px rgba(31, 67, 51, 0.8), 0 0 40px rgba(31, 67, 51, 0.4)'
              }}
            >
              {t('home.hero.title')}
            </h1>
            <p 
              className="text-sm md:text-base lg:text-lg font-bold text-white mb-10 max-w-xl leading-relaxed"
              style={{
                textShadow: '0 0 20px rgba(31, 67, 51, 0.8), 0 0 40px rgba(31, 67, 51, 0.4)'
              }}
            >
              {t('home.hero.subtitle')}
            </p>
            <Link to="/login">
              <Button 
                size="lg" 
                className="group relative overflow-hidden text-lg px-12 py-8 rounded-2xl font-bold transition-all hover:scale-105 shadow-glow-gold"
                style={{ backgroundColor: '#dcb557', color: '#1f4333' }}
              >
                <span className="relative z-10 flex items-center group-hover:text-white transition-colors">
                  {t('home.hero.cta')}
                  <ArrowRight 
                    className={`${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-2 transition-transform`} 
                    size={24} 
                  />
                </span>
                <span 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #1f4333, #2c5f4a)' }}
                ></span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative overflow-hidden" style={{ backgroundColor: '#0a1f1a', border: 'none', outline: 'none' }}>
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10 grid-pattern"></div>
        
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className="group relative p-8 rounded-2xl backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: 'none',
                    boxShadow: '0 0 0 rgba(220, 181, 87, 0)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(220, 181, 87, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 rgba(220, 181, 87, 0)';
                  }}
                >
                  {/* Glow Effect on Hover */}
                  <div 
                    className="absolute inset-0 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(220, 181, 87, 0.1), transparent)'
                    }}
                  ></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-6">
                      <div 
                        className="p-4 rounded-2xl group-hover:scale-110 transition-transform"
                        style={{ 
                          background: 'linear-gradient(135deg, rgba(220, 181, 87, 0.2), rgba(220, 181, 87, 0.05))'
                        }}
                      >
                        <Icon 
                          size={40} 
                          style={{ color: '#dcb557' }} 
                          className="group-hover:rotate-12 transition-transform"
                        />
                      </div>
                    </div>
                    <div 
                      className="text-4xl md:text-5xl font-bold mb-3"
                      style={{ color: '#dcb557' }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm md:text-base text-white opacity-80">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Decorative Elements */}
        <div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(220, 181, 87, 0.1)' }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(31, 67, 51, 0.1)' }}
        ></div>
        
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <span 
                className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
                style={{ backgroundColor: '#dcb557', color: '#1f4333' }}
              >
                {language === 'ar' ? 'من نحن' : language === 'en' ? 'About Us' : 'Hakkımızda'}
              </span>
              <h2 
                className="text-6xl md:text-5xl font-bold mb-6"
                style={{ color: '#1f4333' }}
              >
                {t('home.about.title')}
              </h2>
              <p className="text-sm md:text-base lg:text-lg font-bold text-gray-700 leading-relaxed mb-6">
                {t('home.about.description')}
              </p>
              {/* <Link to="/about">
                <Button 
                  className="rounded-xl font-semibold hover:shadow-lg transition-all"
                  style={{ backgroundColor: '#1f4333', color: 'white' }}
                >
                  {language === 'ar' ? 'اعرف المزيد' : language === 'en' ? 'Learn More' : 'Daha Fazla'}
                  <ArrowRight className={`${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} size={18} />
                </Button>
              </Link> */}
            </div>
            
            {/* Right: Status Image */}
            <div className="flex items-center justify-center">
              <img
                src="/assets/status.png"
                alt={language === 'ar' ? 'إحصائيات الاتحاد' : language === 'en' ? 'Union Statistics' : 'Birlik İstatistikleri'}
                className="w-full max-w-2xl h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Goals/Objectives Section */}
      <section className="py-32 px-4" style={{ backgroundColor: '#0a1f1a' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {language === 'ar' ? 'أهدافنا' : language === 'en' ? 'Our Goals' : 'Hedeflerimiz'}
            </h2>
            <p className="text-lg text-white/70">
              {language === 'ar' ? 'نسعى لتحقيق أهداف طموحة لخدمة الطلبة السوريين' : language === 'en' ? 'We strive to achieve ambitious goals to serve Syrian students' : 'Suriyeli öğrencilere hizmet etmek için iddialı hedeflere ulaşmaya çalışıyoruz'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                number: '01',
                icon: Target,
                title: language === 'ar' ? 'تمثيل الطلبة' : language === 'en' ? 'Student Representation' : 'Öğrenci Temsili',
                desc: language === 'ar' ? 'تمثيل الطلبة السوريين في تركيا ومتابعة مشاكلهم ورعاية مصالحهم' : language === 'en' ? 'Representing Syrian students in Turkey and following up on their problems and caring for their interests' : 'Türkiye\'deki Suriyeli öğrencileri temsil etmek ve sorunlarını takip etmek'
              },
              {
                number: '02',
                icon: Lightbulb,
                title: language === 'ar' ? 'تنمية المواهب' : language === 'en' ? 'Talent Development' : 'Yetenek Geliştirme',
                desc: language === 'ar' ? 'تنمية المواهب والقدرات الأدبية والثقافية والفنية والعلمية والقيادية في صفوف الطلاب' : language === 'en' ? 'Developing literary, cultural, artistic, scientific and leadership talents among students' : 'Öğrenciler arasında edebi, kültürel, sanatsal, bilimsel ve liderlik yeteneklerini geliştirme'
              },
              {
                number: '03',
                icon: Heart,
                title: language === 'ar' ? 'العمل التطوعي' : language === 'en' ? 'Volunteer Work' : 'Gönüllü Çalışma',
                desc: language === 'ar' ? 'تنمية الشعور بأهمية العمل التطوعي في الاتحاد وما يترتب عليه من آثار' : language === 'en' ? 'Developing a sense of the importance of volunteer work in the union and its effects' : 'Birlikte gönüllü çalışmanın önemi duygusunu geliştirme'
              },
              {
                number: '04',
                icon: BookOpen,
                title: language === 'ar' ? 'متابعة الفعاليات' : language === 'en' ? 'Event Follow-up' : 'Etkinlik Takibi',
                desc: language === 'ar' ? 'متابعة كافة الفعاليات والأنشطة العلمية والثقافية والتنسيق مع الجهات الراعية' : language === 'en' ? 'Following up on all scientific and cultural events and coordinating with sponsors' : 'Tüm bilimsel ve kültürel etkinlikleri takip etme ve sponsorlarla koordinasyon'
              }
            ].map((goal, index) => {
              const IconComponent = goal.icon;
              return (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl border-2 transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(220, 181, 87, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#dcb557';
                    e.currentTarget.style.backgroundColor = 'rgba(220, 181, 87, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(220, 181, 87, 0.3)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  {/* Number Badge */}
                  <div 
                    className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ backgroundColor: '#dcb557', color: '#1f4333' }}
                  >
                    {goal.number}
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-xl group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: 'rgba(220, 181, 87, 0.2)' }}
                    >
                      <IconComponent size={32} style={{ color: '#dcb557' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-white">
                        {goal.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        {goal.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div 
              className="relative p-10 rounded-3xl overflow-hidden shadow-2xl"
              style={{ 
                background: 'linear-gradient(135deg, rgba(31, 67, 51, 0.95), rgba(44, 95, 74, 0.9))'
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: 'rgba(220, 181, 87, 0.2)' }}
                  >
                    <Eye size={32} style={{ color: '#dcb557' }} />
                  </div>
                  <h3 className="text-3xl font-bold text-white">
                    {language === 'ar' ? 'رؤيتنا' : language === 'en' ? 'Our Vision' : 'Vizyonumuz'}
                  </h3>
                </div>
                <p className="text-lg text-white/90 leading-relaxed">
                  {language === 'ar' 
                    ? 'نطمح إلى أن يكون الاتحاد رائداً في توحيد الطلاب السوريين في تركيا، وأن يكون عنواناً للتعاون والتفاهم بين الثقافات، والمساهمة بفعالية في تعزيز التعليم والاندماج في المجتمع المحلي'
                    : language === 'en'
                    ? 'We aspire for the union to be a pioneer in uniting Syrian students in Turkey, a symbol of cooperation and understanding between cultures, and to contribute effectively to enhancing education and integration into the local community'
                    : 'Birliğin Türkiye\'deki Suriyeli öğrencileri birleştirmede öncü olmasını, kültürler arası işbirliği ve anlayışın sembolü olmasını hedefliyoruz'}
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div 
              className="relative p-10 rounded-3xl overflow-hidden shadow-2xl"
              style={{ 
                background: 'linear-gradient(135deg, rgba(220, 181, 87, 0.95), rgba(201, 165, 66, 0.9))'
              }}
            >
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: 'rgba(31, 67, 51, 0.2)' }}
                  >
                    <TrendingUp size={32} style={{ color: '#1f4333' }} />
                  </div>
                  <h3 className="text-3xl font-bold" style={{ color: '#1f4333' }}>
                    {language === 'ar' ? 'رسالتنا' : language === 'en' ? 'Our Mission' : 'Misyonumuz'}
                  </h3>
                </div>
                <p className="text-lg leading-relaxed" style={{ color: '#1f4333' }}>
                  {language === 'ar'
                    ? 'إنشاء روابط قوية تجمع بين الطلاب السوريين وتعزز من تجربتهم التعليمية والحياتية. من خلال التعاون والتواصل، يهدف إلى تحقيق أهداف مشتركة وبناء جسور التفاهم والأخوة مع المجتمع المحلي'
                    : language === 'en'
                    ? 'Creating strong bonds that bring Syrian students together and enhance their educational and life experiences. Through cooperation and communication, it aims to achieve common goals and build bridges of understanding and brotherhood with the local community'
                    : 'Suriyeli öğrencileri bir araya getiren ve eğitim ve yaşam deneyimlerini geliştiren güçlü bağlar oluşturmak. İşbirliği ve iletişim yoluyla ortak hedeflere ulaşmayı amaçlıyoruz'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-32 px-4" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#1f4333' }}>
              {language === 'ar' ? 'شركاء النجاح' : language === 'en' ? 'Success Partners' : 'Başarı Ortakları'}
            </h2>
          </div>

          {/* Top Row - 4 Logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 items-center justify-items-center">
            <div className="flex items-center justify-center w-full h-40">
              <img
                src="/assets/KalemLogo.png"
                alt="Kalem"
                className="max-h-32 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-center w-full h-40">
              <img
                src="/assets/GaziLogo.png"
                alt="Al Gazi"
                className="max-h-32 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-center w-full h-40">
              <img
                src="/assets/coreLogo.png"
                alt="Core Istanbul"
                className="max-h-32 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-center w-full h-48">
              <img
                src="/assets/new-horizons.png"
                alt="New Horizons"
                className="max-h-40 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
            </div>
          </div>

          {/* Bottom Row - 2 Logos Centered */}
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center justify-center w-full max-w-xs h-40">
              <img
                src="/assets/IsuLogo.png"
                alt="Istanbul University"
                className="max-h-32 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-center w-full max-w-xs h-40">
              <a
                href="https://www.qk-dev.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-full"
              >
                <img
                  src="/assets/Qk-dev-no-bg -partner-logo.png"
                  alt="Qk-dev Software Services"
                  className="max-h-32 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="py-24 px-4" style={{ backgroundColor: '#f9fafb' }}>
        <div className="max-w-[1600px] mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <p 
              className="text-lg font-semibold mb-4"
              style={{ color: '#dcb557' }}
            >
              {language === 'ar' ? 'مشاريعنا' : language === 'en' ? 'Our Projects' : 'Projelerimiz'}
            </p>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: '#1f4333' }}
            >
              {language === 'ar' 
                ? 'المشاريع والمبادرات' 
                : language === 'en' 
                ? 'Projects & Initiatives' 
                : 'Projeler ve Girişimler'}
            </h2>
            <p 
              className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              {language === 'ar'
                ? 'نعمل على تطوير وتنفيذ مشاريع متنوعة تهدف إلى دعم الطلاب وتطوير مهاراتهم وتحقيق طموحاتهم الأكاديمية والمهنية'
                : language === 'en'
                ? 'We work on developing and implementing diverse projects aimed at supporting students, developing their skills, and achieving their academic and professional aspirations'
                : 'Öğrencileri desteklemek, becerilerini geliştirmek ve akademik ve profesyonel hayallerine ulaşmak için çeşitli projeler geliştiriyor ve uyguluyoruz'}
            </p>
          </div>

          {/* Project Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {recentProjects.map((project, index) => {
              // Determine status badge color based on project status
              let badgeBgColor = '#dcb557'; // default: active/gold (#dcb557)
              let badgeText = language === 'ar' ? 'نشط' : language === 'en' ? 'Active' : 'Aktif';
              
              if (project.status === 'new') {
                badgeBgColor = '#1f4333'; // new: dark green (#1f4333)
                badgeText = language === 'ar' ? 'جديد' : language === 'en' ? 'New' : 'Yeni';
              } else if (project.status === 'ongoing') {
                badgeBgColor = '#10b981'; // ongoing: green-500 (#10b981)
                badgeText = language === 'ar' ? 'مستمر' : language === 'en' ? 'Ongoing' : 'Devam Ediyor';
              } else if (project.status === 'completed') {
                badgeBgColor = '#10b981'; // completed: green-500
                badgeText = language === 'ar' ? 'مكتمل' : language === 'en' ? 'Completed' : 'Tamamlandı';
              }

              return (
                <div
                  key={project.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Image Container with Status Badge Overlay */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title[language]} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    {/* Status Badge - Top Right */}
                    <div 
                      className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: badgeBgColor }}
                    >
                      {badgeText}
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-8">
                    <h3 
                      className="text-2xl font-bold mb-4"
                      style={{ color: '#1f4333' }}
                    >
                      {project.title[language]}
                    </h3>
                    <p 
                      className="text-gray-600 mb-6 leading-relaxed line-clamp-2"
                      style={{ fontSize: '16px', lineHeight: '26px' }}
                    >
                      {project.description[language]}
                    </p>
                    {/* Read More Link */}
                    <div className="flex items-center justify-end">
                      <Link 
                        to={`/projects/${project.id}`}
                        className="flex items-center text-base font-semibold hover:translate-x-1 transition-transform group/link"
                        style={{ color: '#dcb557' }}
                      >
                        {language === 'ar' ? 'اقرأ المزيد' : language === 'en' ? 'Read More' : 'Daha Fazla Oku'}
                        <ArrowRight 
                          className={`${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'} group-hover/link:translate-x-1 transition-transform`} 
                          size={16} 
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Width View All Button */}
          <div className="mt-10">
            <Link to="/projects" className="block">
              <Button 
                className="w-full py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-all"
                style={{ backgroundColor: '#1f4333', color: 'white' }}
              >
                {language === 'ar' ? 'عرض جميع المشاريع' : language === 'en' ? 'View All Projects' : 'Tüm Projeleri Görüntüle'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent News */}
      <section className="py-24 px-4" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-[1600px] mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            {/* Title Section - Left */}
            <div className={direction === 'rtl' ? 'text-right' : 'text-left'}>
              <p 
                className="text-lg font-semibold mb-2"
                style={{ color: '#dcb557' }}
              >
                {language === 'ar' ? 'أحدث الأخبار' : language === 'en' ? 'Latest News' : 'Son Haberler'}
              </p>
              <h2 
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: '#1f4333' }}
              >
                {language === 'ar' 
                  ? 'المقالات والأخبار' 
                  : language === 'en' 
                  ? 'Articles & News' 
                  : 'Makaleler ve Haberler'}
              </h2>
              <p 
                className="text-lg text-gray-600"
              >
                {language === 'ar'
                  ? 'تابع آخر المستجدات والفعاليات والأخبار المهمة للطلاب السوريين'
                  : language === 'en'
                  ? 'Follow the latest updates, events, and important news for Syrian students'
                  : 'Suriyeli öğrenciler için son gelişmeleri, etkinlikleri ve önemli haberleri takip edin'}
              </p>
            </div>
            
            {/* View All Button - Right */}
            <Link to="/articles">
              <Button 
                className="rounded-full px-6 py-3 font-semibold hover:opacity-90 transition-all"
                style={{ backgroundColor: '#dcb557', color: 'white' }}
              >
                {language === 'ar' ? 'عرض جميع الأخبار' : language === 'en' ? 'View All News' : 'Tüm Haberleri Görüntüle'}
              </Button>
            </Link>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-[2fr_1fr] gap-6">
            {/* Left: Featured Article */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              {/* Featured Image */}
              <div className="relative h-80 overflow-hidden bg-transparent flex items-center justify-center rounded-2xl">
                <img 
                  src={recentArticles[featuredArticleIndex].image} 
                  alt={recentArticles[featuredArticleIndex].title[language]} 
                  className="max-w-full max-h-full object-contain rounded-2xl" 
                />
                {/* Featured Badge */}
                <div 
                  className="absolute bottom-4 right-4 px-4 py-2 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: '#dcb557' }}
                >
                  {language === 'ar' ? 'خبر رئيسي' : language === 'en' ? 'Featured' : 'Öne Çıkan'}
                </div>
              </div>
              
              {/* Article Content */}
              <div className="p-8">
                {/* Date and Category */}
                <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                  <span>
                    {language === 'ar' 
                      ? 'أخبار الاتحاد' 
                      : language === 'en' 
                      ? 'Union News' 
                      : 'Birlik Haberleri'}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(recentArticles[featuredArticleIndex].date).toLocaleDateString(
                      language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'tr-TR',
                      { day: 'numeric', month: 'long', year: 'numeric', calendar: 'gregory' }
                    )}
                  </span>
                </div>
                
                {/* Title */}
                <h3 
                  className="text-2xl font-bold mb-4 leading-tight"
                  style={{ color: '#1f4333' }}
                >
                  {recentArticles[featuredArticleIndex].title[language]}
                </h3>
                
                {/* Excerpt */}
                <p className="text-base text-gray-600 mb-6 leading-relaxed">
                  {recentArticles[featuredArticleIndex].excerpt[language]}
                </p>
                
                {/* Read Full Article Link */}
                <Link to={`/articles/${recentArticles[featuredArticleIndex].id}`}>
                  <span className="flex items-center text-lg font-semibold hover:translate-x-1 transition-transform group/link" style={{ color: '#dcb557' }}>
                    {language === 'ar' ? 'قراءة المقال كاملاً' : language === 'en' ? 'Read Full Article' : 'Makalenin Tamamını Oku'}
                    <ArrowRight 
                      className={`${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'} group-hover/link:translate-x-1 transition-transform`} 
                      size={18} 
                    />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right: Side Articles */}
            <div className="flex flex-col gap-4">
              {recentArticles
                .filter((_, index) => index !== featuredArticleIndex)
                .slice(0, 4)
                .map((article, idx) => {
                  const articleIndex = recentArticles.findIndex(a => a.id === article.id);
                  // Format date - Always use Gregorian calendar
                  const dateObj = new Date(article.date);
                  const formattedDate = dateObj.toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    calendar: 'gregory'
                  });
                  
                  return (
                    <div
                      key={article.id}
                      onClick={() => setFeaturedArticleIndex(articleIndex)}
                      className="group bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className={`flex gap-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                            {formattedDate}
                          </p>
                          <h3 
                            className="text-sm font-semibold mb-2 line-clamp-2 leading-snug group-hover:opacity-80 transition-opacity"
                            style={{ color: '#1f4333' }}
                          >
                            {article.title[language]}
                          </h3>
                          <span 
                            className="text-xs font-semibold inline-block"
                            style={{ color: '#dcb557' }}
                          >
                            {language === 'ar' ? 'اقرأ المزيد' : language === 'en' ? 'Read More' : 'Daha Fazla Oku'}
                          </span>
                        </div>
                        
                        {/* Image */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-transparent flex items-center justify-center">
                            <img 
                              src={article.image} 
                              alt={article.title[language]} 
                              className="max-w-full max-h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      

      {/* Branch Unions Section */}
      <section className="py-20 px-4" style={{ backgroundColor: '#f7fafc' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#1f4333' }}>
              {language === 'ar' ? 'اتحاداتنا الفرعية' : language === 'en' ? 'Our Branch Unions' : 'Şube Birliklerimiz'}
            </h2>
            <Link to="/sub-unions">
              <Button 
                variant="outline"
                style={{ 
                  borderColor: '#dcb557',
                  color: '#dcb557'
                }}
                className="hover:bg-opacity-10"
              >
                {language === 'ar' ? 'عرض الكل' : language === 'en' ? 'View All' : 'Hepsini Gör'}
                <ArrowRight className={`${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} size={16} />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {(() => {
              // Get first 3 Istanbul subunions
              const istanbulUnions = (subunionsData.unions || [])
                .filter(u => u.city === 'إسطنبول')
                .slice(0, 3);
              
              // Helper function to get region color based on city
              const getRegionColor = (cityName) => {
                const cityLower = cityName.toLowerCase();
                if (cityLower.includes('إسطنبول') || cityLower.includes('istanbul')) return '#ef4444';
                if (cityLower.includes('إزمير') || cityLower.includes('izmir')) return '#3b82f6';
                if (cityLower.includes('مرسين') || cityLower.includes('mersin')) return '#10b981';
                return '#eab308';
              };

              return istanbulUnions.map((u, idx) => {
                const establishedYear = 2015 + Math.floor(Math.random() * 10);

                return (
                  <Card
                    key={`${u.name}-${idx}`}
                    className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer"
                    style={{ borderRadius: '24px' }}
                    onClick={() => setSelectedUnion(u)}
                  >
                    {/* Image Header - larger size */}
                    <div className="relative w-full h-80 overflow-hidden bg-white flex items-center justify-center">
                      <img
                        src="/assets/sampleLogo.png"
                        alt={u.name}
                        className="w-64 h-64 object-contain"
                        onError={(e) => {
                          e.target.src = '/assets/sampleLogo.png';
                          e.target.className = 'w-48 h-48 object-contain opacity-20';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
                      {/* Region/City Badge - Top Right */}
                      <div
                        className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-semibold text-white z-10"
                        style={{ backgroundColor: getRegionColor(u.city) }}
                      >
                        {u.city}
                      </div>
                    </div>

                    {/* Content - matching Figma spacing */}
                    <div className="p-8">
                      {/* Title */}
                      <h3
                        className="text-2xl font-bold mb-2 leading-8"
                        style={{ color: '#1f4333', direction: language === 'ar' ? 'rtl' : 'ltr' }}
                      >
                        {u.name}
                      </h3>
                      {/* Location */}
                      <p
                        className="text-base text-gray-600 mb-4"
                        style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                      >
                        {u.location}
                      </p>
                      {/* Description */}
                      <p
                        className="text-base text-gray-700 mb-6 leading-relaxed"
                        style={{ direction: language === 'ar' ? 'rtl' : 'ltr', minHeight: '78px' }}
                      >
                        {language === 'ar'
                          ? 'يمثل هذا الاتحاد الطلبة السوريين في الجامعة ويعمل على تقديم الدعم الأكاديمي والاجتماعي والثقافي لهم.'
                          : language === 'tr'
                            ? 'Bu birlik, üniversitedeki Suriyeli öğrencileri temsil eder ve onlara akademik, sosyal ve kültürel destek sağlar.'
                            : 'This union represents Syrian students at the university and works to provide them with academic, social, and cultural support.'}
                      </p>

                      {/* Footer - Learn More and Established Date */}
                      <div className="flex items-center justify-between">
                        {/* Established Date with Calendar Icon */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          <span>
                            {language === 'ar' ? `تأسس ${establishedYear}` : language === 'tr' ? `${establishedYear} Kuruluş` : `Est. ${establishedYear}`}
                          </span>
                        </div>
                        {/* Learn More Link */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUnion(u);
                          }}
                          className="text-base font-medium hover:opacity-80 transition-opacity flex items-center gap-1"
                          style={{ color: '#dcb557', direction: language === 'ar' ? 'rtl' : 'ltr' }}
                        >
                          {language === 'ar' ? 'تعرف أكثر' : language === 'tr' ? 'Daha Fazla Bilgi' : 'Learn More'}
                          {language === 'ar' ? <ArrowLeft size={16} className="rotate-180" /> : <ArrowLeft size={16} />}
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* Offices Section */}
      <section className="py-32 px-4 relative overflow-hidden" style={{ backgroundColor: '#1f4333' }}>
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p 
              className="text-lg font-semibold mb-4"
              style={{ color: '#dcb557' }}
            >
              {language === 'ar' ? 'هيكلنا التنظيمي' : language === 'en' ? 'Our Organizational Structure' : 'Örgütsel Yapımız'}
            </p>
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
            >
              {language === 'ar' ? 'المكاتب والهيئات' : language === 'en' ? 'Offices and Bodies' : 'Ofisler ve Organlar'}
            </h2>
            <p 
              className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              {language === 'ar'
                ? 'نعمل من خلال شبكة متكاملة من المكاتب والهيئات المتخصصة لتقديم أفضل الخدمات وتحقيق أهدافنا بكفاءة عالية'
                : language === 'en'
                ? 'We work through an integrated network of specialized offices and bodies to provide the best services and achieve our goals with high efficiency'
                : 'En iyi hizmetleri sunmak ve hedeflerimize yüksek verimlilikle ulaşmak için uzmanlaşmış ofisler ve organlardan oluşan entegre bir ağ aracılığıyla çalışıyoruz'}
            </p>
          </div>

          {/* Category Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                id: 'board',
                icon: Users,
                name: { ar: 'مجلس الإدارة', en: 'Board of Directors', tr: 'Yönetim Kurulu' },
                description: {
                  ar: ['يضم أعضاء مجلس الإدارة الذين', 'يديرون شؤون الاتحاد واتخاذ القرارات'],
                  en: ['Includes board members who', 'manage union affairs and make decisions'],
                  tr: ['Birliğin işlerini yöneten', 've kararlar alan yönetim kurulu üyelerini içerir']
                }
              },
              {
                id: 'supervisory',
                icon: Eye,
                name: { ar: 'الهيئة الرقابية', en: 'Supervisory Body', tr: 'Denetim Kurulu' },
                description: {
                  ar: ['تراقب وتشرف على أعمال الاتحاد', 'وتضمن الشفافية والمساءلة'],
                  en: ['Monitors and supervises union activities', 'ensures transparency and accountability'],
                  tr: ['Birlik faaliyetlerini izler ve denetler', 'şeffaflık ve hesap verebilirliği sağlar']
                }
              },
              {
                id: 'electoral',
                icon: Target,
                name: { ar: 'الهيئة الانتخابية', en: 'Electoral Commission', tr: 'Seçim Komisyonu' },
                description: {
                  ar: ['تنظم وتشرف على الانتخابات', 'وتضمن نزاهتها وشفافيتها'],
                  en: ['Organizes and supervises elections', 'ensures their integrity and transparency'],
                  tr: ['Seçimleri organize eder ve denetler', 'dürüstlüklerini ve şeffaflıklarını sağlar']
                }
              },
              {
                id: 'offices',
                icon: Briefcase,
                name: { ar: 'المكاتب واللجان التنفيذية', en: 'Offices & Executive Committees', tr: 'Ofisler ve İcra Komiteleri' },
                description: {
                  ar: ['تضم المكاتب المتخصصة واللجان', 'التي تنفذ برامج ومشاريع الاتحاد'],
                  en: ['Includes specialized offices and committees', 'that implement union programs and projects'],
                  tr: ['Birlik programlarını ve projelerini', 'uygulayan uzmanlaşmış ofisler ve komiteleri içerir']
                }
              }
            ].map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className="relative p-8 rounded-2xl transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {/* Icon Container */}
                  <div className="flex justify-center mb-8">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#dcb557' }}
                    >
                      <IconComponent size={24} style={{ color: '#1f4333' }} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-xl font-bold text-center mb-4 text-white"
                    style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                  >
                    {category.name[language]}
                  </h3>

                  {/* Description */}
                  <div className="text-center mb-6">
                    {category.description[language].map((line, lineIndex) => (
                      <p 
                        key={lineIndex}
                        className="text-sm text-gray-300 leading-relaxed"
                        style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>

                  {/* Learn More Link */}
                  <div className="text-center">
                    <Link to="/offices">
                      <button
                        className="text-sm font-medium hover:opacity-80 transition-opacity"
                        style={{ color: '#dcb557', direction: language === 'ar' ? 'rtl' : 'ltr' }}
                      >
                        {language === 'ar' ? 'اعرف المزيد' : language === 'en' ? 'Learn More' : 'Daha Fazla Bilgi'}
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Learn About Organizational Structure Button */}
          <div className="flex justify-center">
            <Link to="/offices">
              <Button
                className="rounded-full px-8 py-6 text-lg font-semibold hover:opacity-90 transition-all"
                style={{ backgroundColor: '#dcb557', color: 'white' }}
              >
                {language === 'ar' ? 'تعرف على الهيكل التنظيمي' : language === 'en' ? 'Learn About Organizational Structure' : 'Örgütsel Yapıyı Keşfedin'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 mx-auto" style={{ backgroundColor: '#f9fafb' }}>
        <section className="py-16" style={{ backgroundColor: '#f9fafb' }}>
          <div className="container mx-auto px-4">
            {/* Title and Golden Banner */}
            <div className={`flex flex-col-reverse lg:flex-row justify-center items-center lg:items-center mb-12 gap-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              {/* Title */}
              <h2 
                className={`text-4xl lg:text-7xl font-bold order-2 lg:order-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                style={{ color: '#1f4333', direction: language === 'ar' ? 'rtl' : 'ltr' }}
              >
                {language === 'ar' ? (
                  <>
                    خارطة انتشار الاتحاد<br />
                    <span className="text-4xl lg:text-7xl">فـــــــــــي&nbsp;تــركيـــــــــــــــا</span>
                  </>
                ) : language === 'en' ? (
                  <>
                    Union Spread Map<br />
                    <span className="text-4xl lg:text-7xl">in Turkey</span>
                  </>
                ) : (
                  <>
                    Birlik Yayılma Haritası<br />
                    <span className="text-4xl lg:text-7xl">Türkiye'de</span>
                  </>
                )}
              </h2>

              {/* Golden Banner */}
              <div 
                className="px-8 py-6 rounded-2xl flex flex-row items-center gap-4 shadow-lg order-1 lg:order-2"
                style={{ backgroundColor: '#dcb557' }}
              >
                <MapPin size={64} style={{ color: '#1f4333' }} className="w-16 h-16" />
                <div className="text-4xl lg:text-8xl font-bold" style={{ color: '#1f4333' }}>
                  21
                </div>
                <div className="text-xl lg:text-4xl font-medium text-center" style={{ color: '#1f4333' }}>
                  {language === 'ar' ? (
                    <>
                      ولاية<br />
                      تركية
                    </>
                  ) : language === 'en' ? (
                    <>
                      Turkish<br />
                      Provinces
                    </>
                  ) : (
                    <>
                      Türk<br />
                      İli
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="flex justify-center">
              <Link to="/sub-unions" className="block w-full max-w-4xl">
                <div className="relative w-full h-96 lg:h-[500px] group cursor-pointer transition-all duration-300 hover:-translate-y-2">
                  <img 
                    src="/assets/map.png" 
                    alt={language === 'ar' ? 'خريطة انتشار الاتحاد في تركيا' : language === 'en' ? 'Union Spread Map in Turkey' : 'Türkiye\'de Birlik Yayılma Haritası'}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    style={{ position: 'absolute', height: '100%', width: '100%', inset: 0 }}
                  />
                </div>
              </Link>
            </div>

            {/* Description */}
            <div className="text-center mt-8">
              <p 
                className="text-xl font-semibold max-w-3xl mx-auto leading-relaxed"
                style={{ color: '#1f4333', direction: language === 'ar' ? 'rtl' : 'ltr' }}
              >
                {language === 'ar' 
                  ? 'ينتشر الاتحاد العام للطلبة السوريين في 21 ولاية تركية، ويضم عشرات الاتحادات الفرعية التي تخدم الطلبة السوريين في مختلف الجامعات التركية'
                  : language === 'en'
                  ? 'The Syrian Students Union spreads across 21 Turkish provinces, and includes dozens of branch unions that serve Syrian students in various Turkish universities'
                  : 'Suriyeli Öğrenciler Birliği, Türkiye\'nin 21 ilinde yayılmakta ve çeşitli Türk üniversitelerinde Suriyeli öğrencilere hizmet veren onlarca şube birliğine sahiptir'}
              </p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Home;
