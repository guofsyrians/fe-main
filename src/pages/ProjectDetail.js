import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Clock, Target } from 'lucide-react';
import { fetchProjectById, fetchProjects } from '../services/database';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, direction } = useLanguage();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const projectData = await fetchProjectById(parseInt(id));
        setProject(projectData);
        
        // Load related projects
        const allProjects = await fetchProjects();
        setRelatedProjects(allProjects.filter(p => p.id !== parseInt(id)).slice(0, 3));
      } catch (error) {
        console.error('Error loading project:', error);
        toast.error(
          language === 'ar' 
            ? 'حدث خطأ في تحميل المشروع' 
            : language === 'en' 
            ? 'Error loading project' 
            : 'Proje yüklenirken hata oluştu'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProject();
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

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1f4333' }}>
            {language === 'ar' ? 'المشروع غير موجود' : language === 'en' ? 'Project Not Found' : 'Proje Bulunamadı'}
          </h2>
          <Link to="/projects">
            <Button 
              className="mt-4"
              style={{ backgroundColor: '#dcb557', color: '#1f4333' }}
            >
              {language === 'ar' ? 'العودة إلى المشاريع' : language === 'en' ? 'Back to Projects' : 'Projelere Dön'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get status badge color and text
  let badgeBgColor = '#dcb557'; // default: active/gold
  let badgeText = language === 'ar' ? 'نشط' : language === 'en' ? 'Active' : 'Aktif';
  
  if (project.status === 'new') {
    badgeBgColor = '#1f4333'; // new: dark green
    badgeText = language === 'ar' ? 'جديد' : language === 'en' ? 'New' : 'Yeni';
  } else if (project.status === 'ongoing') {
    badgeBgColor = '#10b981'; // ongoing: green-500
    badgeText = language === 'ar' ? 'مستمر' : language === 'en' ? 'Ongoing' : 'Devam Ediyor';
  } else if (project.status === 'completed') {
    badgeBgColor = '#10b981'; // completed: green-500
    badgeText = language === 'ar' ? 'مكتمل' : language === 'en' ? 'Completed' : 'Tamamlandı';
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Back Button */}
      <div className="max-w-[1600px] mx-auto px-4 py-4 md:py-8">
        <Button
          onClick={() => navigate('/projects')}
          variant="ghost"
          className="mb-4 md:mb-6 hover:bg-gray-100 transition-all min-h-[44px]"
          style={{ color: '#1f4333' }}
        >
          <ArrowLeft 
            className={`${direction === 'rtl' ? 'ml-2 rotate-180' : 'mr-2'}`} 
            size={20} 
          />
          {language === 'ar' ? 'العودة إلى المشاريع' : language === 'en' ? 'Back to Projects' : 'Projelere Dön'}
        </Button>
      </div>

      {/* Project Content */}
      <div className="max-w-[1200px] mx-auto px-4 pb-8 md:pb-16">
        {/* Project Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 md:mb-8">
          {/* Featured Image */}
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-[500px] overflow-hidden bg-transparent flex items-center justify-center rounded-3xl">
            <img 
              src={project.image} 
              alt={project.title[language]} 
              className="max-w-full max-h-full object-contain rounded-3xl" 
            />
            {/* Status Badge */}
            <div 
              className="absolute top-3 md:top-6 left-3 md:left-6 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold text-white"
              style={{ backgroundColor: badgeBgColor }}
            >
              {badgeText}
            </div>
          </div>
          
          {/* Project Meta */}
          <div className="p-4 md:p-6 lg:p-8">
            {/* Status and Category */}
            <div className={`flex items-center gap-4 mb-6 text-sm text-gray-500 flex-wrap ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-2">
                <Target size={16} />
                <span>
                  {language === 'ar' 
                    ? 'مشروع الاتحاد' 
                    : language === 'en' 
                    ? 'Union Project' 
                    : 'Birlik Projesi'}
                </span>
              </div>
              <span>•</span>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: badgeBgColor, color: 'white' }}
              >
                {badgeText}
              </span>
            </div>
            
            {/* Title */}
            <h1 
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
              style={{ color: '#1f4333' }}
            >
              {project.title[language]}
            </h1>
          </div>
        </div>

        {/* Project Body */}
        <div className="bg-white rounded-3xl shadow-xl p-4 md:p-8 lg:p-12">
          <div 
            className={`prose prose-lg max-w-none text-sm md:text-base lg:text-lg ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
            style={{ 
              color: '#374151',
              lineHeight: '1.8',
              fontSize: '16px'
            }}
          >
            {/* Project Content - Using description as full content for now */}
            <div 
              className="whitespace-pre-wrap leading-relaxed"
              style={{ 
                fontFamily: direction === 'rtl' ? 'Tajawal, sans-serif' : 'inherit'
              }}
            >
              {project.description[language]}
            </div>
          </div>

          {/* Project Footer */}
          <div className={`mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={16} />
              <span className="text-sm">
                {language === 'ar' 
                  ? `الحالة: ${badgeText}` 
                  : language === 'en' 
                  ? `Status: ${badgeText}` 
                  : `Durum: ${badgeText}`}
              </span>
            </div>
            
            <Link to="/projects">
              <Button 
                variant="outline"
                className="hover:shadow-lg transition-all"
                style={{ borderColor: '#dcb557', color: '#dcb557' }}
              >
                {language === 'ar' ? 'جميع المشاريع' : language === 'en' ? 'All Projects' : 'Tüm Projeler'}
                <ArrowLeft 
                  className={`${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2 rotate-180'}`} 
                  size={16} 
                />
              </Button>
            </Link>
          </div>
        </div>

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
        <div className="mt-8 md:mt-12 lg:mt-16">
          <h2 
            className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
            style={{ color: '#1f4333' }}
          >
            {language === 'ar' ? 'مشاريع أخرى' : language === 'en' ? 'Other Projects' : 'Diğer Projeler'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {relatedProjects.map((relatedProject) => {
                // Get status badge color
                let relatedBadgeBgColor = '#dcb557';
                let relatedBadgeText = language === 'ar' ? 'نشط' : language === 'en' ? 'Active' : 'Aktif';
                
                if (relatedProject.status === 'new') {
                  relatedBadgeBgColor = '#1f4333';
                  relatedBadgeText = language === 'ar' ? 'جديد' : language === 'en' ? 'New' : 'Yeni';
                } else if (relatedProject.status === 'ongoing') {
                  relatedBadgeBgColor = '#10b981';
                  relatedBadgeText = language === 'ar' ? 'مستمر' : language === 'en' ? 'Ongoing' : 'Devam Ediyor';
                } else if (relatedProject.status === 'completed') {
                  relatedBadgeBgColor = '#10b981';
                  relatedBadgeText = language === 'ar' ? 'مكتمل' : language === 'en' ? 'Completed' : 'Tamamlandı';
                }

                return (
                  <Link
                    key={relatedProject.id}
                    to={`/projects/${relatedProject.id}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
                  >
                    <div className="relative h-48 overflow-hidden bg-transparent flex items-center justify-center rounded-2xl">
                      <img 
                        src={relatedProject.image} 
                        alt={relatedProject.title[language]} 
                        className="max-w-full max-h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300" 
                      />
                      {/* Status Badge */}
                      <div 
                        className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: relatedBadgeBgColor }}
                      >
                        {relatedBadgeText}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 
                        className="text-lg font-bold mb-2 line-clamp-2 leading-tight group-hover:opacity-80 transition-opacity"
                        style={{ color: '#1f4333' }}
                      >
                        {relatedProject.title[language]}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedProject.description[language]}
                      </p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;

