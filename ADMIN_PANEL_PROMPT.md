# Admin Panel Development Prompt

## Project Overview

Create a comprehensive admin panel for the **Syrian Student Union** website. This is a separate application that will manage all content and data for the main public-facing website. The admin panel should be a modern, secure, and user-friendly interface for managing the union's digital presence.

## Application Context

The main website is a React-based application that displays:
- **Home Page**: Hero section, statistics, about section, goals, vision/mission, partners, recent projects, recent news, branch unions preview, offices overview, and Turkey map
- **Sub-Unions Page**: Interactive Turkey map showing all branch unions by city, with detailed union information
- **Articles & News Page**: Categorized content (news, events, announcements) with featured articles
- **Projects Page**: Showcase of ongoing and completed projects with progress tracking
- **Offices Page**: Organizational structure showing board members, supervisory body, electoral commission, and executive committees
- **User Authentication**: Username/email-based login system with user profiles

The website supports **three languages**: Arabic (ar), English (en), and Turkish (tr), with RTL support for Arabic.

## Database Structure (DETAILED)

The admin panel will interact with a PostgreSQL database (Supabase) with the following detailed schema:

### 1. **user_profiles** Table
- `id` (UUID, PRIMARY KEY) - References auth.users(id) ON DELETE CASCADE
- `username` (TEXT, UNIQUE, NOT NULL) - Username for login
- `full_name` (TEXT) - User's full name
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

**Indexes:**
- `idx_user_profiles_username` on `username`

**RLS Policies:**
- Users can view/update/insert their own profile
- Public can view usernames and full_name

### 2. **cities** Table
- `id` (SERIAL, PRIMARY KEY)
- `city_code` (TEXT, UNIQUE, NOT NULL) - Unique identifier for the city
- `name_ar` (TEXT, NOT NULL) - City name in Arabic
- `name_en` (TEXT, NOT NULL) - City name in English
- `name_tr` (TEXT, NOT NULL) - City name in Turkish
- `svg_x` (INTEGER, NOT NULL) - X coordinate for SVG map positioning
- `svg_y` (INTEGER, NOT NULL) - Y coordinate for SVG map positioning
- `color_zone` (INTEGER, NOT NULL) - Color zone identifier for map styling
- `click_zone` (INTEGER, NOT NULL) - Click zone identifier for map interaction
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

**Indexes:**
- `idx_cities_city_code` on `city_code`

**RLS Policies:**
- Public read access

### 3. **sub_unions** Table
- `id` (SERIAL, PRIMARY KEY)
- `name_ar` (TEXT, NOT NULL) - Union name in Arabic
- `name_en` (TEXT, NOT NULL) - Union name in English
- `name_tr` (TEXT, NOT NULL) - Union name in Turkish
- `city_id` (INTEGER, REFERENCES cities(id) ON DELETE SET NULL) - Foreign key to cities table
- `contact_email` (TEXT, NOT NULL) - Contact email address
- `phone` (TEXT, NOT NULL) - Phone number
- `member_count` (INTEGER, DEFAULT 0) - Number of members
- `established_year` (INTEGER) - Year the union was established
- `status` (sub_union_status ENUM, DEFAULT 'active') - Status: 'active' or 'inactive'
- `logo_url` (TEXT) - URL to union logo image
- `about_description_ar` (TEXT) - About description in Arabic
- `about_description_en` (TEXT) - About description in English
- `about_description_tr` (TEXT) - About description in Turkish
- `card_description_ar` (TEXT) - Short description for card display in Arabic
- `card_description_en` (TEXT) - Short description for card display in English
- `card_description_tr` (TEXT) - Short description for card display in Turkish
- `contact_number_ar` (TEXT) - Contact number display text in Arabic
- `contact_number_en` (TEXT) - Contact number display text in English
- `contact_number_tr` (TEXT) - Contact number display text in Turkish
- `activities_and_achievements_ar` (TEXT) - Activities and achievements in Arabic
- `activities_and_achievements_en` (TEXT) - Activities and achievements in English
- `activities_and_achievements_tr` (TEXT) - Activities and achievements in Turkish
- `special_achievements_ar` (TEXT) - Special achievements in Arabic
- `special_achievements_en` (TEXT) - Special achievements in English
- `special_achievements_tr` (TEXT) - Special achievements in Turkish
- `current_administrative_team_ar` (TEXT) - Current administrative team info in Arabic
- `current_administrative_team_en` (TEXT) - Current administrative team info in English
- `current_administrative_team_tr` (TEXT) - Current administrative team info in Turkish
- `notes_ar` (TEXT) - Additional notes in Arabic
- `notes_en` (TEXT) - Additional notes in English
- `notes_tr` (TEXT) - Additional notes in Turkish
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

**Indexes:**
- `idx_sub_unions_city_id` on `city_id`
- `idx_sub_unions_status` on `status`

**RLS Policies:**
- Public read access

### 4. **articles** Table
- `id` (SERIAL, PRIMARY KEY)
- `title_ar` (TEXT, NOT NULL) - Article title in Arabic
- `title_en` (TEXT, NOT NULL) - Article title in English
- `title_tr` (TEXT, NOT NULL) - Article title in Turkish
- `excerpt_ar` (TEXT, NOT NULL) - Short excerpt in Arabic
- `excerpt_en` (TEXT, NOT NULL) - Short excerpt in English
- `excerpt_tr` (TEXT, NOT NULL) - Short excerpt in Turkish
- `content_ar` (TEXT) - Full article content in Arabic
- `content_en` (TEXT) - Full article content in English
- `content_tr` (TEXT) - Full article content in Turkish
- `date` (DATE, NOT NULL) - Publication date
- `formatted_date_ar` (TEXT, NOT NULL) - Formatted date string in Arabic
- `formatted_date_en` (TEXT, NOT NULL) - Formatted date string in English
- `formatted_date_tr` (TEXT, NOT NULL) - Formatted date string in Turkish
- `category` (article_category ENUM, NOT NULL) - Category: 'news', 'events', or 'announcements'
- `image_url` (TEXT, NOT NULL) - URL to article image
- `author_id` (UUID, REFERENCES user_profiles(id) ON DELETE SET NULL) - Author reference
- `published` (BOOLEAN, DEFAULT true) - Publication status
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

**Indexes:**
- `idx_articles_category` on `category`
- `idx_articles_date` on `date`
- `idx_articles_published` on `published`
- `idx_articles_author_id` on `author_id`

**RLS Policies:**
- Public can view published articles only

### 5. **projects** Table
- `id` (SERIAL, PRIMARY KEY)
- `title_ar` (TEXT, NOT NULL) - Project title in Arabic
- `title_en` (TEXT, NOT NULL) - Project title in English
- `title_tr` (TEXT, NOT NULL) - Project title in Turkish
- `description_ar` (TEXT, NOT NULL) - Project description in Arabic
- `description_en` (TEXT, NOT NULL) - Project description in English
- `description_tr` (TEXT, NOT NULL) - Project description in Turkish
- `status` (project_status ENUM, NOT NULL) - Status: 'ongoing', 'completed', or 'planned'
- `image_url` (TEXT) - URL to project image
- `start_date` (DATE, NOT NULL) - Project start date
- `end_date` (DATE) - Project end date (nullable)
- `progress` (INTEGER, DEFAULT 0, CHECK 0-100) - Progress percentage (0-100)
- `member_count` (INTEGER, DEFAULT 0) - Number of project members
- `category_ar` (TEXT, NOT NULL) - Project category in Arabic
- `category_en` (TEXT, NOT NULL) - Project category in English
- `category_tr` (TEXT, NOT NULL) - Project category in Turkish
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

**Indexes:**
- `idx_projects_status` on `status`
- `idx_projects_start_date` on `start_date`

**RLS Policies:**
- Public read access

### 6. **offices** Table
- `id` (SERIAL, PRIMARY KEY)
- `category` (office_category ENUM, NOT NULL) - Category: 'board', 'supervisory', 'electoral', 'offices', or 'general_assembly'
- `name_ar` (TEXT) - Office/committee name in Arabic (optional)
- `name_en` (TEXT) - Office/committee name in English (optional)
- `name_tr` (TEXT) - Office/committee name in Turkish (optional)
- `head_name_ar` (TEXT, NOT NULL) - Head/leader name in Arabic
- `head_name_en` (TEXT, NOT NULL) - Head/leader name in English
- `head_name_tr` (TEXT, NOT NULL) - Head/leader name in Turkish
- `position_ar` (TEXT, NOT NULL) - Position title in Arabic
- `position_en` (TEXT, NOT NULL) - Position title in English
- `position_tr` (TEXT, NOT NULL) - Position title in Turkish
- `email` (TEXT, NOT NULL) - Contact email
- `phone` (TEXT) - Contact phone (optional)
- `image_url` (TEXT) - URL to profile image
- `order_index` (INTEGER, DEFAULT 0) - Display order within category
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

**Indexes:**
- `idx_offices_category` on `category`
- `idx_offices_order_index` on `order_index`

**RLS Policies:**
- Public read access

### Database Enums

1. **sub_union_status**: 'active', 'inactive'
2. **article_category**: 'news', 'events', 'announcements'
3. **project_status**: 'ongoing', 'completed', 'planned'
4. **office_category**: 'board', 'supervisory', 'electoral', 'offices', 'general_assembly'

### Database Features

- **Automatic Timestamps**: All tables have `created_at` and `updated_at` fields with automatic triggers
- **Row Level Security (RLS)**: Enabled on all tables with appropriate policies
- **Foreign Key Relationships**: 
  - `sub_unions.city_id` → `cities.id`
  - `articles.author_id` → `user_profiles.id`
- **Triggers**: `update_updated_at_column()` function automatically updates `updated_at` on row updates

## Admin Panel Requirements

### Core Features

1. **Authentication & Authorization**
   - Secure login system (integrate with Supabase Auth)
   - Role-based access control (Admin, Editor, etc.)
   - Session management
   - Password reset functionality

2. **Dashboard**
   - Overview statistics (total articles, projects, sub-unions, etc.)
   - Recent activity feed
   - Quick action buttons
   - Charts/graphs for key metrics

3. **Content Management**

   **a. Cities Management**
   - CRUD operations for cities
   - Map coordinate editor (svg_x, svg_y)
   - Color zone and click zone configuration
   - Multi-language name editing (ar, en, tr)

   **b. Sub-Unions Management**
   - Full CRUD operations
   - Rich text editors for all description fields (multi-language)
   - Image upload for logos
   - City assignment with dropdown
   - Status toggle (active/inactive)
   - Member count management
   - Established year input
   - Contact information management
   - All multilingual fields support

   **c. Articles Management**
   - Full CRUD operations
   - Rich text editor for content (multi-language)
   - Image upload
   - Category selection (news, events, announcements)
   - Publication date picker
   - Formatted date fields (auto-generate or manual)
   - Author assignment (dropdown from user_profiles)
   - Publish/unpublish toggle
   - Preview functionality
   - Bulk operations (publish, unpublish, delete)

   **d. Projects Management**
   - Full CRUD operations
   - Rich text editor for descriptions (multi-language)
   - Image upload
   - Status management (ongoing, completed, planned)
   - Date range picker (start_date, end_date)
   - Progress slider (0-100%)
   - Member count input
   - Category management (multi-language)
   - Project timeline visualization

   **e. Offices Management**
   - Full CRUD operations
   - Category-based organization (board, supervisory, electoral, offices)
   - Profile image upload
   - Multi-language name and position fields
   - Contact information (email, phone)
   - Drag-and-drop or numeric ordering (order_index)
   - Special handling for "Secretary General" position (featured display)

4. **User Management**
   - View all user profiles
   - Edit user information
   - User role assignment
   - User activity tracking

5. **Media Library**
   - Image upload and management
   - File organization
   - Image cropping/resizing tools
   - URL generation for easy copy-paste

6. **Settings**
   - General site settings
   - Language configuration
   - Email templates
   - System configuration

### Technical Requirements

1. **Technology Stack**
   - Modern React framework (Next.js recommended for SEO and performance)
   - TypeScript for type safety
   - Tailwind CSS or similar for styling
   - Supabase client for database operations
   - React Hook Form for form management
   - Rich text editor (Tiptap, Quill, or similar)
   - Image upload library (with preview and cropping)
   - Chart library for dashboard (Recharts, Chart.js, etc.)
   - Date picker library
   - Toast notifications

2. **UI/UX Requirements**
   - Clean, modern admin interface
   - Responsive design (mobile, tablet, desktop)
   - Dark mode support (optional but recommended)
   - Multi-language support (ar, en, tr) with RTL for Arabic
   - Accessible components (WCAG compliance)
   - Loading states and error handling
   - Confirmation dialogs for destructive actions
   - Search and filtering capabilities
   - Pagination for large datasets
   - Bulk selection and operations

3. **Data Validation**
   - Client-side validation for all forms
   - Server-side validation via Supabase RLS policies
   - Required field indicators
   - Error messages in all supported languages

4. **Performance**
   - Optimistic UI updates
   - Image optimization
   - Lazy loading for large lists
   - Caching strategies

5. **Security**
   - Secure authentication
   - Role-based access control
   - Input sanitization
   - XSS prevention
   - CSRF protection
   - Secure file uploads

### Specific Admin Panel Pages

1. **Login Page**
   - Username/email and password fields
   - "Remember me" option
   - Forgot password link

2. **Dashboard**
   - Statistics cards
   - Activity timeline
   - Quick links
   - Charts

3. **Cities List Page**
   - Table view with search/filter
   - Add/Edit/Delete actions
   - Map preview integration

4. **Sub-Unions List Page**
   - Table/grid view
   - Filter by city, status
   - Search functionality
   - Bulk actions

5. **Sub-Union Form Page**
   - Multi-step or tabbed form
   - All multilingual fields
   - Image upload section
   - City selection
   - Rich text editors

6. **Articles List Page**
   - Table view with filters (category, published status, date range)
   - Search functionality
   - Bulk publish/unpublish
   - Quick preview

7. **Article Form Page**
   - Tabbed interface for languages
   - Rich text editor
   - Image upload
   - Category and date selection
   - Author assignment
   - Preview pane

8. **Projects List Page**
   - Table/grid view
   - Filter by status
   - Search functionality
   - Progress indicators

9. **Project Form Page**
   - Multi-language form
   - Status and progress management
   - Date range picker
   - Image upload

10. **Offices List Page**
    - Category tabs/filters
    - Drag-and-drop ordering
    - Quick edit capabilities

11. **Office Form Page**
    - Category selection
    - Multi-language fields
    - Image upload
    - Contact information

12. **Users List Page**
    - User table
    - Role management
    - Activity tracking

13. **Media Library Page**
    - Grid view of images
    - Upload interface
    - Search and filter
    - Image details modal

### Color Scheme

Use the main website's color scheme:
- Primary: `#1f4333` (Dark Green)
- Secondary: `#dcb557` (Gold)
- Background: `#f9fafb` (Light Gray)
- Text: `#1f4333` (Dark Green) / `#ffffff` (White on dark backgrounds)

### Additional Considerations

1. **Image Handling**
   - Support for common image formats (JPG, PNG, WebP)
   - Automatic image optimization
   - Thumbnail generation
   - Image alt text management

2. **Rich Text Editor Features**
   - Basic formatting (bold, italic, underline)
   - Headings
   - Lists (ordered, unordered)
   - Links
   - Image embedding
   - Code blocks
   - Multi-language content switching

3. **Export/Import**
   - Export data to CSV/Excel (optional)
   - Bulk import capabilities (optional)

4. **Audit Trail**
   - Track who created/updated records
   - Timestamp logging
   - Change history (optional)

5. **Notifications**
   - Success/error toast messages
   - Email notifications for important actions (optional)

## Deliverables

1. Complete admin panel application
2. Responsive design for all screen sizes
3. Multi-language support (Arabic with RTL, English, Turkish)
4. Comprehensive documentation
5. Deployment instructions

## Notes

- The admin panel is a **separate application** from the main website
- It should connect to the same Supabase database
- All database operations should respect existing RLS policies (may need to create admin-specific policies)
- Focus on usability and efficiency for content managers
- Ensure all forms handle the multilingual nature of the data properly

