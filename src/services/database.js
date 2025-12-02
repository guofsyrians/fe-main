import { supabase } from '../lib/supabase';

// Transform database row to match component expectations
const transformCity = (row) => ({
  id: row.city_code,
  name: {
    ar: row.name_ar,
    en: row.name_en,
    tr: row.name_tr
  },
  svgX: row.svg_x,
  svgY: row.svg_y,
  colorZone: row.color_zone,
  clickZone: row.click_zone
});

const transformSubUnion = (row) => ({
  id: row.id,
  name: {
    ar: row.name_ar,
    en: row.name_en,
    tr: row.name_tr
  },
  city: row.cities ? {
    ar: row.cities.name_ar,
    en: row.cities.name_en,
    tr: row.cities.name_tr
  } : null,
  cityId: row.city_id,
  contact: row.contact_email,
  phone: row.phone,
  members: row.member_count,
  establishedYear: row.established_year,
  status: row.status,
  logo: row.logo_url,
  aboutDescription: {
    ar: row.about_description_ar,
    en: row.about_description_en,
    tr: row.about_description_tr
  },
  cardDescription: {
    ar: row.card_description_ar,
    en: row.card_description_en,
    tr: row.card_description_tr
  },
  contactNumber: {
    ar: row.contact_number_ar,
    en: row.contact_number_en,
    tr: row.contact_number_tr
  },
  activitiesAndAchievements: {
    ar: row.activities_and_achievements_ar,
    en: row.activities_and_achievements_en,
    tr: row.activities_and_achievements_tr
  },
  specialAchievements: {
    ar: row.special_achievements_ar,
    en: row.special_achievements_en,
    tr: row.special_achievements_tr
  },
  currentAdministrativeTeam: {
    ar: row.current_administrative_team_ar,
    en: row.current_administrative_team_en,
    tr: row.current_administrative_team_tr
  },
  notes: {
    ar: row.notes_ar,
    en: row.notes_en,
    tr: row.notes_tr
  }
});

const transformArticle = (row) => ({
  id: row.id,
  title: {
    ar: row.title_ar,
    en: row.title_en,
    tr: row.title_tr
  },
  excerpt: {
    ar: row.excerpt_ar,
    en: row.excerpt_en,
    tr: row.excerpt_tr
  },
  content: {
    ar: row.content_ar,
    en: row.content_en,
    tr: row.content_tr
  },
  date: row.date,
  formattedDate: {
    ar: row.formatted_date_ar,
    en: row.formatted_date_en,
    tr: row.formatted_date_tr
  },
  category: row.category,
  image: row.image_url
});

const transformProject = (row) => ({
  id: row.id,
  title: {
    ar: row.title_ar,
    en: row.title_en,
    tr: row.title_tr
  },
  description: {
    ar: row.description_ar,
    en: row.description_en,
    tr: row.description_tr
  },
  status: row.status,
  image: row.image_url,
  startDate: row.start_date,
  endDate: row.end_date,
  progress: row.progress,
  memberCount: row.member_count,
  category: {
    ar: row.category_ar,
    en: row.category_en,
    tr: row.category_tr
  }
});

const transformOffice = (row) => ({
  id: row.id,
  category: row.category,
  name: {
    ar: row.name_ar,
    en: row.name_en,
    tr: row.name_tr
  },
  head: {
    ar: row.head_name_ar,
    en: row.head_name_en,
    tr: row.head_name_tr
  },
  position: {
    ar: row.position_ar,
    en: row.position_en,
    tr: row.position_tr
  },
  email: row.email,
  phone: row.phone,
  image: row.image_url
});

// Fetch functions
export const fetchCities = async () => {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name_en', { ascending: true });

    if (error) throw error;
    return data.map(transformCity);
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

export const fetchSubUnions = async (cityId = null) => {
  try {
    let query = supabase
      .from('sub_unions')
      .select(`
        id,
        name_ar, name_en, name_tr,
        city_id,
        logo_url,
        status,
        established_year,
        card_description_ar, card_description_en, card_description_tr,
        cities (
          id,
          name_ar,
          name_en,
          name_tr,
          city_code
        )
      `)
      .eq('status', 'active')
      .order('name_en', { ascending: true });

    if (cityId) {
      // If cityId is a city_code string, we need to find the city first
      const city = await supabase
        .from('cities')
        .select('id')
        .eq('city_code', cityId)
        .single();
      
      if (city.data) {
        query = query.eq('city_id', city.data.id);
      }
    }

    const { data, error } = await query;

    if (error) throw error;
    return data.map(transformSubUnion);
  } catch (error) {
    console.error('Error fetching sub-unions:', error);
    throw error;
  }
};

export const fetchSubUnionById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('sub_unions')
      .select(`
        *,
        cities (
          id,
          name_ar,
          name_en,
          name_tr,
          city_code
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return transformSubUnion(data);
  } catch (error) {
    console.error('Error fetching sub-union details:', error);
    throw error;
  }
};

export const fetchArticles = async (category = null) => {
  try {
    let query = supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('date', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data.map(transformArticle);
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const fetchArticleById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();

    if (error) throw error;
    return data ? transformArticle(data) : null;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};

export const fetchProjects = async (status = null) => {
  try {
    let query = supabase
      .from('projects')
      .select('*')
      .order('start_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data.map(transformProject);
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const fetchProjectById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? transformProject(data) : null;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const fetchOffices = async (category = null) => {
  try {
    let query = supabase
      .from('offices')
      .select('*')
      .order('order_index', { ascending: true })
      .order('id', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data.map(transformOffice);
  } catch (error) {
    console.error('Error fetching offices:', error);
    throw error;
  }
};

