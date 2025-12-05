import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { fetchArticleById, fetchArticles } from '../services/database';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, direction } = useLanguage();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        const articleData = await fetchArticleById(parseInt(id));
        setArticle(articleData);
        
        // Load related articles
        const allArticles = await fetchArticles();
        setRelatedArticles(allArticles.filter(a => a.id !== parseInt(id)).slice(0, 3));
      } catch (error) {
        console.error('Error loading article:', error);
        toast.error(
          language === 'ar' 
            ? 'حدث خطأ في تحميل المقال' 
            : language === 'en' 
            ? 'Error loading article' 
            : 'Makale yüklenirken hata oluştu'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadArticle();
    }
  }, [id, language]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 text-lg">
            {language === 'ar' ? 'جاري التحميل...' : language === 'en' ? 'Loading...' : 'Yükleniyor...'}
          </p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1f4333' }}>
            {language === 'ar' ? 'المقال غير موجود' : language === 'en' ? 'Article Not Found' : 'Makale Bulunamadı'}
          </h2>
          <Link to="/articles">
            <Button 
              className="mt-4"
              style={{ backgroundColor: '#dcb557', color: '#1f4333' }}
            >
              {language === 'ar' ? 'العودة إلى المقالات' : language === 'en' ? 'Back to Articles' : 'Makalelere Dön'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format date - Always use Gregorian calendar
  const dateObj = new Date(article.date);
  const formattedDate = dateObj.toLocaleDateString(
    language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'tr-TR',
    { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long',
      calendar: 'gregory'
    }
  );

  // Get category label
  const categoryLabels = {
    news: { ar: 'أخبار', en: 'News', tr: 'Haber' },
    events: { ar: 'فعاليات', en: 'Events', tr: 'Etkinlik' },
    announcements: { ar: 'إعلانات', en: 'Announcements', tr: 'Duyuru' },
    cultural: { ar: 'ثقافي', en: 'Cultural', tr: 'Kültürel' },
    academic: { ar: 'أكاديمي', en: 'Academic', tr: 'Akademik' },
    sports: { ar: 'رياضي', en: 'Sports', tr: 'Spor' }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Back Button */}
      <div className="max-w-[1600px] mx-auto px-4 py-4 md:py-8">
        <Button
          onClick={() => navigate('/articles')}
          variant="ghost"
          className="mb-4 md:mb-6 hover:bg-gray-100 transition-all min-h-[44px]"
          style={{ color: '#1f4333' }}
        >
          <ArrowLeft 
            className={`${direction === 'rtl' ? 'ml-2 rotate-180' : 'mr-2'}`} 
            size={20} 
          />
          {language === 'ar' ? 'العودة إلى المقالات' : language === 'en' ? 'Back to Articles' : 'Makalelere Dön'}
        </Button>
      </div>

      {/* Article Content */}
      <div className="max-w-[1200px] mx-auto px-4 pb-8 md:pb-16">
        {/* Article Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 md:mb-8">
          {/* Featured Image */}
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-[500px] overflow-hidden bg-transparent flex items-center justify-center rounded-3xl">
            <img 
              src={article.image} 
              alt={article.title[language]} 
              className="max-w-full max-h-full object-contain rounded-3xl" 
            />
            {/* Category Badge */}
            <div 
              className="absolute top-3 md:top-6 left-3 md:left-6 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold text-white"
              style={{ backgroundColor: '#dcb557' }}
            >
              {categoryLabels[article.category]?.[language] || article.category}
            </div>
          </div>
          
          {/* Article Meta */}
          <div className="p-4 md:p-6 lg:p-8">
            {/* Date and Category */}
            <div className={`flex items-center gap-4 mb-6 text-sm text-gray-500 flex-wrap ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formattedDate}</span>
              </div>
              <span>•</span>
              <span>
                {language === 'ar' 
                  ? 'أخبار الاتحاد' 
                  : language === 'en' 
                  ? 'Union News' 
                  : 'Birlik Haberleri'}
              </span>
            </div>
            
            {/* Title */}
            <h1 
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
              style={{ color: '#1f4333' }}
            >
              {article.title[language]}
            </h1>
          </div>
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-3xl shadow-xl p-4 md:p-8 lg:p-12">
          <div 
            className={`prose prose-lg max-w-none text-sm md:text-base lg:text-lg ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
            style={{ 
              color: '#374151',
              lineHeight: '1.8',
              fontSize: '16px'
            }}
          >
            {/* Article Content - Using full content, fallback to excerpt if content is not available */}
            {(() => {
              const content = article.content?.[language] || article.excerpt[language];
              const isHTML = content && /<[a-z][\s\S]*>/i.test(content);
              
              return (
                <div 
                  className={isHTML ? "leading-relaxed" : "whitespace-pre-wrap leading-relaxed"}
                  style={{ 
                    fontFamily: direction === 'rtl' ? 'Tajawal, sans-serif' : 'inherit'
                  }}
                  {...(isHTML ? { dangerouslySetInnerHTML: { __html: content } } : { children: content })}
                />
              );
            })()}
          </div>

          {/* Article Footer */}
          <div className={`mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={16} />
              <span className="text-sm">
                {language === 'ar' 
                  ? `تم النشر في ${formattedDate}` 
                  : language === 'en' 
                  ? `Published on ${formattedDate}` 
                  : `${formattedDate} tarihinde yayınlandı`}
              </span>
            </div>
            
            <Link to="/articles">
              <Button 
                variant="outline"
                className="hover:shadow-lg transition-all"
                style={{ borderColor: '#dcb557', color: '#dcb557' }}
              >
                {language === 'ar' ? 'جميع المقالات' : language === 'en' ? 'All Articles' : 'Tüm Makaleler'}
                <ArrowLeft 
                  className={`${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2 rotate-180'}`} 
                  size={16} 
                />
              </Button>
            </Link>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
        <div className="mt-8 md:mt-12 lg:mt-16">
          <h2 
            className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
            style={{ color: '#1f4333' }}
          >
            {language === 'ar' ? 'مقالات ذات صلة' : language === 'en' ? 'Related Articles' : 'İlgili Makaleler'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  to={`/articles/${relatedArticle.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
                >
                  <div className="h-48 overflow-hidden bg-transparent flex items-center justify-center rounded-2xl">
                    <img 
                      src={relatedArticle.image} 
                      alt={relatedArticle.title[language]} 
                      className="max-w-full max-h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="p-6">
                    <span 
                      className="text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3"
                      style={{ backgroundColor: '#dcb557', color: '#1f4333' }}
                    >
                      {categoryLabels[relatedArticle.category]?.[language] || relatedArticle.category}
                    </span>
                    <h3 
                      className="text-lg font-bold mb-2 line-clamp-2 leading-tight group-hover:opacity-80 transition-opacity"
                      style={{ color: '#1f4333' }}
                    >
                      {relatedArticle.title[language]}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(relatedArticle.date).toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'tr-TR',
                        { day: 'numeric', month: 'short', year: 'numeric', calendar: 'gregory' }
                      )}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
