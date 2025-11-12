import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import { Search, Filter, GraduationCap, MapPin, Building2, BookOpen } from 'lucide-react';

const Graduates = () => {
  const { t, language, direction } = useLanguage();
  const [graduates, setGraduates] = useState([]);
  const [allGraduates, setAllGraduates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);
  
  // Filter states
  const [filters, setFilters] = useState({
    academic_branch: 'all',
    full_name: '',
    city: 'all',
    university_name: 'all',
  });

  // Fetch all graduates from Supabase
  useEffect(() => {
    const fetchGraduates = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('full_name', { ascending: true });

        if (error) {
          throw error;
        }

        setAllGraduates(data || []);
      } catch (error) {
        console.error('Error fetching graduates:', error);
        toast.error(
          language === 'ar' 
            ? 'حدث خطأ في جلب البيانات' 
            : language === 'en' 
            ? 'Error fetching data' 
            : 'Veri alınırken hata oluştu'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGraduates();
  }, [language]);

  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    const academicBranches = [...new Set(allGraduates.map(g => g.academic_branch).filter(Boolean))].sort();
    const cities = [...new Set(allGraduates.map(g => g.city).filter(Boolean))].sort();
    const universities = [...new Set(allGraduates.map(g => g.university_name).filter(Boolean))].sort();
    
    return {
      academic_branch: academicBranches,
      city: cities,
      university_name: universities,
    };
  }, [allGraduates]);

  // Filter and paginate graduates
  useEffect(() => {
    let filtered = [...allGraduates];

    // Apply filters
    if (filters.academic_branch && filters.academic_branch !== 'all') {
      filtered = filtered.filter(g => g.academic_branch === filters.academic_branch);
    }
    if (filters.full_name) {
      const searchTerm = filters.full_name.toLowerCase();
      filtered = filtered.filter(g => 
        g.full_name?.toLowerCase().includes(searchTerm)
      );
    }
    if (filters.city && filters.city !== 'all') {
      filtered = filtered.filter(g => g.city === filters.city);
    }
    if (filters.university_name && filters.university_name !== 'all') {
      filtered = filtered.filter(g => g.university_name === filters.university_name);
    }

    // Apply pagination
    setGraduates(filtered.slice(0, displayCount));
  }, [allGraduates, filters, displayCount]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setDisplayCount(20); // Reset to initial count when filters change
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 50);
      setLoadingMore(false);
    }, 300);
  };

  const clearFilters = () => {
    setFilters({
      academic_branch: 'all',
      full_name: '',
      city: 'all',
      university_name: 'all',
    });
    setDisplayCount(20);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'full_name') {
      return value !== '';
    }
    return value !== 'all';
  });
  const totalFiltered = useMemo(() => {
    let filtered = [...allGraduates];
    if (filters.academic_branch && filters.academic_branch !== 'all') {
      filtered = filtered.filter(g => g.academic_branch === filters.academic_branch);
    }
    if (filters.full_name) {
      const searchTerm = filters.full_name.toLowerCase();
      filtered = filtered.filter(g => 
        g.full_name?.toLowerCase().includes(searchTerm)
      );
    }
    if (filters.city && filters.city !== 'all') {
      filtered = filtered.filter(g => g.city === filters.city);
    }
    if (filters.university_name && filters.university_name !== 'all') {
      filtered = filtered.filter(g => g.university_name === filters.university_name);
    }
    return filtered.length;
  }, [allGraduates, filters]);

  const hasMore = graduates.length < totalFiltered;

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f9fafb' }}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 md:mb-8" style={{ direction: direction }}>
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4"
            style={{ color: '#1f4333' }}
          >
            {language === 'ar' ? 'الخريجون' : language === 'en' ? 'Graduates' : 'Mezunlar'}
          </h1>
          <p 
            className="text-sm md:text-base lg:text-lg text-gray-600"
          >
            {language === 'ar' 
              ? 'ابحث عن الخريجين المناسبين لشركتك' 
              : language === 'en' 
              ? 'Find the right graduates for your company' 
              : 'Şirketiniz için doğru mezunları bulun'}
          </p>
        </div>

        {/* Filters Section */}
        <Card className="shadow-lg border-0 rounded-2xl mb-6 md:mb-8">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4 md:mb-6" style={{ direction: direction }}>
              <Filter className="w-5 h-5" style={{ color: '#1f4333' }} />
              <h2 
                className="text-xl md:text-2xl font-bold"
                style={{ color: '#1f4333' }}
              >
                {language === 'ar' ? 'الفلاتر' : language === 'en' ? 'Filters' : 'Filtreler'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Full Name Search */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium" style={{ color: '#374151' }}>
                  {language === 'ar' ? 'الاسم الكامل' : language === 'en' ? 'Full Name' : 'Ad Soyad'}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="full_name"
                    type="text"
                    placeholder={language === 'ar' ? 'ابحث بالاسم...' : language === 'en' ? 'Search by name...' : 'İsme göre ara...'}
                    value={filters.full_name}
                    onChange={(e) => handleFilterChange('full_name', e.target.value)}
                    className="pl-10 h-[50px] border-gray-300 rounded-lg"
                    style={{ direction: direction }}
                  />
                </div>
              </div>

              {/* Academic Branch */}
              <div className="space-y-2">
                <Label htmlFor="academic_branch" className="text-sm font-medium" style={{ color: '#374151' }}>
                  {language === 'ar' ? 'التخصص الأكاديمي' : language === 'en' ? 'Academic Branch' : 'Akademik Dal'}
                </Label>
                <Select
                  value={filters.academic_branch}
                  onValueChange={(value) => handleFilterChange('academic_branch', value)}
                >
                  <SelectTrigger className="h-[50px] border-gray-300 rounded-lg" style={{ direction: direction }}>
                    <SelectValue placeholder={language === 'ar' ? 'اختر التخصص' : language === 'en' ? 'Select branch' : 'Dal seçin'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'ar' ? 'الكل' : language === 'en' ? 'All' : 'Tümü'}</SelectItem>
                    {filterOptions.academic_branch.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium" style={{ color: '#374151' }}>
                  {language === 'ar' ? 'المدينة' : language === 'en' ? 'City' : 'Şehir'}
                </Label>
                <Select
                  value={filters.city}
                  onValueChange={(value) => handleFilterChange('city', value)}
                >
                  <SelectTrigger className="h-[50px] border-gray-300 rounded-lg" style={{ direction: direction }}>
                    <SelectValue placeholder={language === 'ar' ? 'اختر المدينة' : language === 'en' ? 'Select city' : 'Şehir seçin'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'ar' ? 'الكل' : language === 'en' ? 'All' : 'Tümü'}</SelectItem>
                    {filterOptions.city.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* University Name */}
              <div className="space-y-2">
                <Label htmlFor="university_name" className="text-sm font-medium" style={{ color: '#374151' }}>
                  {language === 'ar' ? 'الجامعة' : language === 'en' ? 'University' : 'Üniversite'}
                </Label>
                <Select
                  value={filters.university_name}
                  onValueChange={(value) => handleFilterChange('university_name', value)}
                >
                  <SelectTrigger className="h-[50px] border-gray-300 rounded-lg" style={{ direction: direction }}>
                    <SelectValue placeholder={language === 'ar' ? 'اختر الجامعة' : language === 'en' ? 'Select university' : 'Üniversite seçin'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'ar' ? 'الكل' : language === 'en' ? 'All' : 'Tümü'}</SelectItem>
                    {filterOptions.university_name.map((university) => (
                      <SelectItem key={university} value={university}>
                        {university}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="mt-4 md:mt-6 flex justify-end">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="border-gray-300 rounded-lg"
                >
                  {language === 'ar' ? 'مسح الفلاتر' : language === 'en' ? 'Clear Filters' : 'Filtreleri Temizle'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 md:mb-6" style={{ direction: direction }}>
          <p className="text-sm md:text-base text-gray-600">
            {language === 'ar' 
              ? `عرض ${graduates.length} من ${totalFiltered} خريج` 
              : language === 'en' 
              ? `Showing ${graduates.length} of ${totalFiltered} graduates` 
              : `${totalFiltered} mezundan ${graduates.length} tanesi gösteriliyor`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f4333] mx-auto mb-4"></div>
              <p className="text-gray-600">
                {language === 'ar' ? 'جاري التحميل...' : language === 'en' ? 'Loading...' : 'Yükleniyor...'}
              </p>
            </div>
          </div>
        ) : graduates.length === 0 ? (
          <Card className="shadow-lg border-0 rounded-2xl">
            <CardContent className="p-8 md:p-12 text-center">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-600">
                {language === 'ar' 
                  ? 'لم يتم العثور على خريجين' 
                  : language === 'en' 
                  ? 'No graduates found' 
                  : 'Mezun bulunamadı'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Graduates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              {graduates.map((graduate) => (
                <Card key={graduate.id} className="shadow-lg border-0 rounded-2xl hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="space-y-3 md:space-y-4" style={{ direction: direction }}>
                      {/* Full Name */}
                      <div className="flex items-start gap-3">
                        <GraduationCap className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dcb557' }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            {language === 'ar' ? 'الاسم الكامل' : language === 'en' ? 'Full Name' : 'Ad Soyad'}
                          </p>
                          <p className="text-base md:text-lg font-bold" style={{ color: '#1f4333' }}>
                            {graduate.full_name || '-'}
                          </p>
                        </div>
                      </div>

                      {/* Academic Branch */}
                      {graduate.academic_branch && (
                        <div className="flex items-start gap-3">
                          <BookOpen className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dcb557' }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              {language === 'ar' ? 'التخصص الأكاديمي' : language === 'en' ? 'Academic Branch' : 'Akademik Dal'}
                            </p>
                            <p className="text-sm md:text-base" style={{ color: '#1f4333' }}>
                              {graduate.academic_branch}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* City */}
                      {graduate.city && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dcb557' }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              {language === 'ar' ? 'المدينة' : language === 'en' ? 'City' : 'Şehir'}
                            </p>
                            <p className="text-sm md:text-base" style={{ color: '#1f4333' }}>
                              {graduate.city}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* University */}
                      {graduate.university_name && (
                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dcb557' }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              {language === 'ar' ? 'الجامعة' : language === 'en' ? 'University' : 'Üniversite'}
                            </p>
                            <p className="text-sm md:text-base" style={{ color: '#1f4333' }}>
                              {graduate.university_name}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-6 rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#1f4333', color: 'white' }}
                >
                  {loadingMore 
                    ? (language === 'ar' ? 'جاري التحميل...' : language === 'en' ? 'Loading...' : 'Yükleniyor...')
                    : (language === 'ar' ? 'عرض المزيد (50)' : language === 'en' ? 'Load More (50)' : 'Daha Fazla Yükle (50)')
                  }
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Graduates;

