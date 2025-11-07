import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { articles } from '../mock';
import { Button } from '../components/ui/button';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, direction } = useLanguage();
  
  const article = articles.find(a => a.id === parseInt(id));
  
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
    announcements: { ar: 'إعلانات', en: 'Announcements', tr: 'Duyuru' }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Back Button */}
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/articles')}
          variant="ghost"
          className="mb-6 hover:bg-gray-100 transition-all"
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
      <div className="max-w-[1200px] mx-auto px-4 pb-16">
        {/* Article Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          {/* Featured Image */}
          <div className="relative h-[500px] overflow-hidden bg-transparent flex items-center justify-center rounded-3xl">
            <img 
              src={article.image} 
              alt={article.title[language]} 
              className="max-w-full max-h-full object-contain rounded-3xl" 
            />
            {/* Category Badge */}
            <div 
              className="absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: '#dcb557' }}
            >
              {categoryLabels[article.category]?.[language] || article.category}
            </div>
          </div>
          
          {/* Article Meta */}
          <div className="p-8">
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
              className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
              style={{ color: '#1f4333' }}
            >
              {article.title[language]}
            </h1>
          </div>
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div 
            className={`prose prose-lg max-w-none ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
            style={{ 
              color: '#374151',
              lineHeight: '1.8',
              fontSize: '18px'
            }}
          >
            {/* Article Content - Using excerpt as full content for now */}
            <div 
              className="whitespace-pre-wrap leading-relaxed"
              style={{ 
                fontFamily: direction === 'rtl' ? 'Tajawal, sans-serif' : 'inherit'
              }}
            >
              {article.excerpt[language]}
            </div>
          </div>

          {/* Article Footer */}
          <div className={`mt-12 pt-8 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
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
        <div className="mt-16">
          <h2 
            className={`text-3xl font-bold mb-8 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
            style={{ color: '#1f4333' }}
          >
            {language === 'ar' ? 'مقالات ذات صلة' : language === 'en' ? 'Related Articles' : 'İlgili Makaleler'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {articles
              .filter(a => a.id !== article.id)
              .slice(0, 3)
              .map((relatedArticle) => (
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
      </div>
    </div>
  );
};

export default ArticleDetail;
