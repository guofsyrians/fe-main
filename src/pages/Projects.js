import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Target, CheckCircle, Users, Globe, Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../mock';

const Projects = () => {
  const { t, language, direction } = useLanguage();
  const [filter, setFilter] = useState('all');

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.status === filter);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[650px] md:h-[750px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/projectsHeroImage.png)' }}
        />
        <div className="absolute inset-0 bg-gray-500/20" />
      </section>

      {/* Stats Section */}
      <section className="pt-4 pb-16 px-4" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Card 1: Active Projects */}
            <div 
              className="bg-white rounded-2xl p-8 text-center"
              style={{ backgroundColor: 'rgba(31, 67, 51, 0.05)' }}
            >
              <div className="flex justify-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#dcb557' }}
                >
                  <Target size={24} color="#ffffff" />
                </div>
              </div>
              <h3 
                className="text-3xl font-bold mb-2"
                style={{ color: '#1f4333' }}
              >
                24
              </h3>
              <p className="text-base text-gray-600">
                {language === 'ar' ? 'مشروع نشط' : language === 'en' ? 'Active Projects' : 'Aktif Proje'}
              </p>
            </div>

            {/* Card 2: Completed Projects */}
            <div 
              className="bg-white rounded-2xl p-8 text-center"
              style={{ backgroundColor: 'rgba(220, 181, 87, 0.05)' }}
            >
              <div className="flex justify-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1f4333' }}
                >
                  <CheckCircle size={24} color="#ffffff" />
                </div>
              </div>
              <h3 
                className="text-3xl font-bold mb-2"
                style={{ color: '#1f4333' }}
              >
                87
              </h3>
              <p className="text-base text-gray-600">
                {language === 'ar' ? 'مشروع مكتمل' : language === 'en' ? 'Completed Projects' : 'Tamamlanan Proje'}
              </p>
            </div>

            {/* Card 3: Participants */}
            <div 
              className="bg-white rounded-2xl p-8 text-center"
              style={{ backgroundColor: 'rgba(31, 67, 51, 0.05)' }}
            >
              <div className="flex justify-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#dcb557' }}
                >
                  <Users size={24} color="#ffffff" />
                </div>
              </div>
              <h3 
                className="text-3xl font-bold mb-2"
                style={{ color: '#1f4333' }}
              >
                450+
              </h3>
              <p className="text-base text-gray-600">
                {language === 'ar' ? 'مشارك' : language === 'en' ? 'Participants' : 'Katılımcı'}
              </p>
            </div>

            {/* Card 4: Beneficiary Countries */}
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
                className="text-3xl font-bold mb-2"
                style={{ color: '#1f4333' }}
              >
                15
              </h3>
              <p className="text-base text-gray-600">
                {language === 'ar' ? 'دولة مستفيدة' : language === 'en' ? 'Beneficiary Countries' : 'Yararlanan Ülke'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="py-12 px-4">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1f4333' }}>
              {t('projects.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('projects.subtitle')}
            </p>
          </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            style={{
              backgroundColor: filter === 'all' ? '#1f4333' : 'transparent',
              color: filter === 'all' ? 'white' : '#1f4333',
              borderColor: '#1f4333'
            }}
          >
            {language === 'ar' ? 'الكل' : language === 'en' ? 'All' : 'Tümü'}
          </Button>
          <Button
            onClick={() => setFilter('ongoing')}
            variant={filter === 'ongoing' ? 'default' : 'outline'}
            style={{
              backgroundColor: filter === 'ongoing' ? '#1f4333' : 'transparent',
              color: filter === 'ongoing' ? 'white' : '#1f4333',
              borderColor: '#1f4333'
            }}
          >
            {t('projects.ongoing')}
          </Button>
          <Button
            onClick={() => setFilter('completed')}
            variant={filter === 'completed' ? 'default' : 'outline'}
            style={{
              backgroundColor: filter === 'completed' ? '#1f4333' : 'transparent',
              color: filter === 'completed' ? 'white' : '#1f4333',
              borderColor: '#1f4333'
            }}
          >
            {t('projects.completed')}
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            // Get data from project or use defaults
            const progress = project.progress || 55;
            const memberCount = project.memberCount || 10;
            const categoryColors = ['#3b82f6', '#a855f7', '#16a34a', '#ef4444', '#14b8a6', '#f97316']; // blue, purple, green, red, teal, orange
            const categoryColor = categoryColors[(project.id - 1) % categoryColors.length];
            
            // Format dates from mock data - Always use Gregorian calendar
            const startDate = new Date(project.startDate);
            const endDate = new Date(project.endDate);
            const formattedStartDate = startDate.toLocaleDateString(
              language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'tr-TR', 
              { month: 'long', year: 'numeric', calendar: 'gregory' }
            );
            const formattedEndDate = endDate.toLocaleDateString(
              language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'tr-TR', 
              { month: 'long', year: 'numeric', calendar: 'gregory' }
            );
            
            return (
              <Card key={project.id} className="hover:shadow-xl transition-all overflow-hidden group bg-white rounded-3xl" style={{ borderRadius: '24px' }}>
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title[language]} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Status Badge - Top Right */}
                  <div 
                    className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: project.status === 'ongoing' ? '#10b981' : '#1f4333' }}
                  >
                    {project.status === 'ongoing' 
                      ? (language === 'ar' ? 'قيد التنفيذ' : language === 'en' ? 'Ongoing' : 'Devam Ediyor')
                      : (language === 'ar' ? 'مكتمل' : language === 'en' ? 'Completed' : 'Tamamlandı')}
                  </div>
                  
                  {/* Category Badge - Top Left */}
                  <div 
                    className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: categoryColor }}
                  >
                    {project.category?.[language] || project.category?.en || 'General'}
                  </div>
                  
                  {/* Progress Badge - Bottom Left */}
                  <div 
                    className="absolute bottom-4 left-4 px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm"
                    style={{ color: '#1f4333' }}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: '#10b981', opacity: 0.8 }}
                      />
                      <span className="text-sm font-medium">
                        {progress}% {language === 'ar' ? 'مكتمل' : language === 'en' ? 'Complete' : 'Tamamlandı'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <CardHeader className="p-6">
                  {/* Team Leader & Member Count */}
                  {/* <div className={`flex items-center justify-between mb-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        <User size={20} className="m-auto mt-2.5 text-gray-400" />
                      </div>
                      <div className={direction === 'rtl' ? 'text-right' : 'text-left'}>
                        <p className="text-sm font-semibold" style={{ color: '#1f4333' }}>
                          {language === 'ar' ? 'قائد المشروع' : language === 'en' ? 'Project Leader' : 'Proje Lideri'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {language === 'ar' ? 'منسق المشروع' : language === 'en' ? 'Project Coordinator' : 'Proje Koordinatörü'}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-2 text-gray-500 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Users size={14} />
                      <span className="text-sm">
                        {memberCount} {language === 'ar' ? 'عضو' : language === 'en' ? 'Members' : 'Üye'}
                      </span>
                    </div>
                  </div> */}
                  
                  {/* Title */}
                  <CardTitle className={`text-xl leading-tight mb-3 ${direction === 'rtl' ? 'text-right' : 'text-left'}`} style={{ color: '#1f4333' }}>
                    {project.title[language]}
                  </CardTitle>
                  
                  {/* Description */}
                  <p className={`text-base text-gray-700 leading-relaxed mb-4 line-clamp-3 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {project.description[language]}
                  </p>
                  
                  {/* Dates */}
                  {/* <div className={`flex items-center gap-4 mb-6 flex-wrap ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                      <Calendar size={14} />
                      <span>
                        {language === 'ar' ? 'بدء:' : language === 'en' ? 'Start:' : 'Başlangıç:'} {formattedStartDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                      <Calendar size={14} />
                      <span>
                        {language === 'ar' ? 'انتهاء متوقع:' : language === 'en' ? 'Expected End:' : 'Tahmini Bitiş:'} {formattedEndDate}
                      </span>
                    </div>
                  </div> */}
                  
                  {/* Progress Bar */}
                  {/* <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: categoryColor 
                      }}
                    />
                  </div> */}
                  
                  {/* Action Buttons */}
                  <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    {/* <Button 
                      className="rounded-full px-4 py-2 text-sm font-semibold"
                      style={{ backgroundColor: '#1f4333', color: 'white' }}
                    >
                      {language === 'ar' ? 'انضم للفريق' : language === 'en' ? 'Join Team' : 'Takıma Katıl'}
                    </Button> */}
                    
                    <Link 
                      to={`/projects/${project.id}`}
                      className="flex items-center gap-1 text-sm font-semibold hover:opacity-80 transition-all"
                      style={{ color: '#dcb557' }}
                    >
                      {language === 'ar' ? 'تفاصيل أكثر' : language === 'en' ? 'More Details' : 'Daha Fazla Detay'}
                      <ArrowRight 
                        className={direction === 'rtl' ? 'rotate-180' : ''} 
                        size={16} 
                      />
                    </Link>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
