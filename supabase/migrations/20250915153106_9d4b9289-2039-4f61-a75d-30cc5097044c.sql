-- Create enum for age groups
CREATE TYPE age_group AS ENUM ('child', 'teen', 'adult', 'senior');

-- Create enum for lesson difficulty
CREATE TYPE lesson_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');

-- Create enum for badge types
CREATE TYPE badge_type AS ENUM ('beginner_unlocked', 'module_completed', 'quiz_master', 'weekend_warrior');

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  age INTEGER,
  age_group age_group,
  guardian_email TEXT,
  parental_consent BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB,
  module_name TEXT NOT NULL,
  difficulty lesson_difficulty DEFAULT 'beginner',
  estimated_duration INTEGER, -- in minutes
  order_in_module INTEGER DEFAULT 1,
  weekend_only BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user progress table
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started', -- not_started, in_progress, completed
  progress_percentage INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  quiz_attempts INTEGER DEFAULT 0,
  quiz_score INTEGER,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  badge_type badge_type NOT NULL,
  icon TEXT,
  requirements JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user badges table
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create analytics table for tracking user activity
CREATE TABLE public.analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- lesson_start, lesson_complete, quiz_attempt, etc.
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create changelog table for auto-documentation
CREATE TABLE public.changelog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_name TEXT NOT NULL,
  file_updated TEXT,
  author TEXT,
  description TEXT,
  change_type TEXT DEFAULT 'update', -- create, update, delete
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.changelog ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for lessons (public read access)
CREATE POLICY "Anyone can view lessons" 
ON public.lessons 
FOR SELECT 
USING (true);

-- RLS Policies for user progress
CREATE POLICY "Users can view their own progress" 
ON public.user_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.user_progress 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for badges (public read)
CREATE POLICY "Anyone can view badges" 
ON public.badges 
FOR SELECT 
USING (true);

-- RLS Policies for user badges
CREATE POLICY "Users can view their own badges" 
ON public.user_badges 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges" 
ON public.user_badges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for analytics
CREATE POLICY "Users can view their own analytics" 
ON public.analytics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics" 
ON public.analytics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for changelog (public read)
CREATE POLICY "Anyone can view changelog" 
ON public.changelog 
FOR SELECT 
USING (true);

-- Function to automatically set age group based on age
CREATE OR REPLACE FUNCTION set_age_group()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.age IS NOT NULL THEN
    IF NEW.age <= 12 THEN
      NEW.age_group = 'child';
    ELSIF NEW.age <= 17 THEN
      NEW.age_group = 'teen';
    ELSIF NEW.age <= 64 THEN
      NEW.age_group = 'adult';
    ELSE
      NEW.age_group = 'senior';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set age group
CREATE TRIGGER set_age_group_trigger
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION set_age_group();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'last_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
BEFORE UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial badges
INSERT INTO public.badges (name, description, badge_type, icon, requirements) VALUES
('Beginner Unlocked', 'Welcome to Learn1on1! Complete your first lesson.', 'beginner_unlocked', '🎓', '{"lessons_completed": 1}'),
('Module Master', 'Complete an entire module', 'module_completed', '🏆', '{"module_completion": true}'),
('Quiz Champion', 'Score 90% or higher on 5 quizzes', 'quiz_master', '🧠', '{"quiz_score": 90, "quiz_count": 5}'),
('Weekend Warrior', 'Complete 10 weekend lessons', 'weekend_warrior', '⚡', '{"weekend_lessons": 10}');

-- Insert sample lessons
INSERT INTO public.lessons (title, description, module_name, difficulty, estimated_duration, order_in_module, content) VALUES
('Computer Basics: Getting Started', 'Learn the fundamentals of using a computer', 'Computer Basics', 'beginner', 30, 1, '{"sections": [{"title": "Introduction", "content": "Welcome to computer basics!"}]}'),
('Understanding Files and Folders', 'Organize your digital workspace', 'Computer Basics', 'beginner', 25, 2, '{"sections": [{"title": "File Management", "content": "Learn to organize files"}]}'),
('Microsoft Word: Introduction', 'Start creating documents with Word', 'Microsoft Office', 'beginner', 40, 1, '{"sections": [{"title": "Word Basics", "content": "Introduction to Microsoft Word"}]}'),
('Excel Basics: Spreadsheets', 'Learn spreadsheet fundamentals', 'Microsoft Office', 'beginner', 45, 2, '{"sections": [{"title": "Excel Introduction", "content": "Getting started with Excel"}]}'),
('Internet Safety', 'Stay safe while browsing the web', 'Internet & Email', 'beginner', 35, 1, '{"sections": [{"title": "Online Safety", "content": "Important safety tips"}]}'),
('Email Essentials', 'Master email communication', 'Internet & Email', 'beginner', 30, 2, '{"sections": [{"title": "Email Basics", "content": "Learn email fundamentals"}]}');