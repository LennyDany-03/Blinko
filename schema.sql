-- Blinko Tree database schema setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to ensure clean schema generation (IF NOT EXISTS does not overwrite existing schemas)
DROP TABLE IF EXISTS public.analytics CASCADE;
DROP TABLE IF EXISTS public.links CASCADE;
DROP TABLE IF EXISTS public.social_links CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.trees CASCADE;
DROP TABLE IF EXISTS public.themes CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;


-- 1. THEMES table (Presets definitions)
CREATE TABLE IF NOT EXISTS public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on themes
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on themes" ON public.themes FOR SELECT USING (true);
CREATE POLICY "Allow admin all on themes" ON public.themes FOR ALL USING (true);

-- Populate default themes if not exists
INSERT INTO public.themes (name, config) VALUES 
('Minimal', '{"bgClass": "bg-zinc-950", "previewBg": "#09090b", "accentColor": "#ffffff", "fontFamily": "font-sans", "buttonStyle": "rounded-md", "previewCard": "bg-zinc-900 border-zinc-800 text-zinc-300"}')
ON CONFLICT (name) DO UPDATE SET config = EXCLUDED.config;

INSERT INTO public.themes (name, config) VALUES 
('Dark Pro', '{"bgClass": "bg-zinc-950", "previewBg": "#09090b", "accentColor": "#7c3aed", "fontFamily": "font-sans", "buttonStyle": "rounded-lg", "previewCard": "bg-zinc-900/60 border-zinc-800 text-zinc-300"}')
ON CONFLICT (name) DO UPDATE SET config = EXCLUDED.config;

INSERT INTO public.themes (name, config) VALUES 
('Creator', '{"bgClass": "bg-gradient-to-tr from-violet-950 to-fuchsia-950", "previewBg": "#1e1b4b", "accentColor": "#ec4899", "fontFamily": "font-sans", "buttonStyle": "rounded-full", "previewCard": "bg-white/5 border-white/10 text-white"}')
ON CONFLICT (name) DO UPDATE SET config = EXCLUDED.config;

INSERT INTO public.themes (name, config) VALUES 
('Startup', '{"bgClass": "bg-slate-950", "previewBg": "#020617", "accentColor": "#3b82f6", "fontFamily": "font-sans", "buttonStyle": "rounded-md", "previewCard": "bg-slate-900 border-slate-800 text-slate-350"}')
ON CONFLICT (name) DO UPDATE SET config = EXCLUDED.config;

INSERT INTO public.themes (name, config) VALUES 
('Artist', '{"bgClass": "bg-stone-950", "previewBg": "#0c0a09", "accentColor": "#f59e0b", "fontFamily": "font-serif", "buttonStyle": "rounded-none", "previewCard": "bg-stone-900 border-stone-800 text-stone-300"}')
ON CONFLICT (name) DO UPDATE SET config = EXCLUDED.config;

INSERT INTO public.themes (name, config) VALUES 
('Developer', '{"bgClass": "bg-zinc-950", "previewBg": "#09090b", "accentColor": "#10b981", "fontFamily": "font-mono", "buttonStyle": "rounded-md", "previewCard": "bg-zinc-900/40 border-emerald-500/20 text-emerald-400"}')
ON CONFLICT (name) DO UPDATE SET config = EXCLUDED.config;

INSERT INTO public.themes (name, config) VALUES 
('Luxury', '{"bgClass": "bg-neutral-950", "previewBg": "#0a0a0a", "accentColor": "#d4af37", "fontFamily": "font-serif", "buttonStyle": "rounded-none", "previewCard": "border-amber-500/30 bg-neutral-900 text-neutral-300"}')
ON CONFLICT (name) DO UPDATE SET config = EXCLUDED.config;

INSERT INTO public.themes (name, config) VALUES 
('Glassmorphism', '{"bgClass": "bg-gradient-to-br from-indigo-950 via-slate-950 to-zinc-950", "previewBg": "#1e1e38", "accentColor": "#a855f7", "fontFamily": "font-sans", "buttonStyle": "rounded-xl", "previewCard": "bg-white/5 border-white/10 backdrop-blur-md text-white"}')
ON CONFLICT (name) DO UPDATE SET config = EXCLUDED.config;

INSERT INTO public.themes (name, config) VALUES 
('Gradient Neon', '{"bgClass": "bg-gradient-to-tr from-fuchsia-950 via-violet-950 to-emerald-950", "previewBg": "#2e1065", "accentColor": "#38bdf8", "fontFamily": "font-sans", "buttonStyle": "rounded-full", "previewCard": "bg-zinc-950/80 border-fuchsia-500/35 text-white"}')
ON CONFLICT (name) DO UPDATE SET config = EXCLUDED.config;

INSERT INTO public.themes (name, config) VALUES 
('Cyberpunk', '{"bgClass": "bg-yellow-950/20 bg-zinc-950", "previewBg": "#0f0f15", "accentColor": "#facc15", "fontFamily": "font-mono", "buttonStyle": "rounded-none", "previewCard": "bg-black/60 border-2 border-yellow-500 text-yellow-400"}')
ON CONFLICT (name) DO UPDATE SET config = EXCLUDED.config;

-- 2. TREES table
CREATE TABLE IF NOT EXISTS public.trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  theme_id UUID REFERENCES public.themes(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  template_id VARCHAR(50),
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, name)
);

-- Enable RLS on trees
ALTER TABLE public.trees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to trees" ON public.trees FOR SELECT USING (true);
CREATE POLICY "Allow individual write access to trees" ON public.trees FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. PROFILES table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tree_id UUID UNIQUE NOT NULL REFERENCES public.trees(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50),
  display_name VARCHAR(50) NOT NULL,
  bio VARCHAR(250),
  avatar_url TEXT,
  location VARCHAR(100),
  website TEXT,
  theme_id UUID REFERENCES public.themes(id) ON DELETE SET NULL,
  accent_color VARCHAR(20),
  button_style TEXT,
  font_style TEXT,
  background_type TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow individual write access to profiles" ON public.profiles FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. LINKS table (references trees)
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tree_id UUID NOT NULL REFERENCES public.trees(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  icon VARCHAR(50),
  position INTEGER DEFAULT 0 NOT NULL,
  featured BOOLEAN DEFAULT false NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL,
  open_in_new_tab BOOLEAN DEFAULT true NOT NULL,
  button_style TEXT DEFAULT 'rounded-md' NOT NULL,
  click_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on links
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to links" ON public.links FOR SELECT USING (true);
CREATE POLICY "Allow individual write access to links" ON public.links FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.trees
    WHERE public.trees.id = public.links.tree_id
    AND public.trees.user_id = auth.uid()
  )
);

-- 5. ANALYTICS table (references trees)
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tree_id UUID UNIQUE NOT NULL REFERENCES public.trees(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0 NOT NULL,
  clicks INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on analytics
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to analytics" ON public.analytics FOR SELECT USING (true);
CREATE POLICY "Allow update access to analytics for incrementing" ON public.analytics FOR UPDATE USING (true);
CREATE POLICY "Allow individual full access to analytics" ON public.analytics FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.trees
    WHERE public.trees.id = public.analytics.tree_id
    AND public.trees.user_id = auth.uid()
  )
);

-- 5b. SOCIAL_LINKS table
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tree_id UUID NOT NULL REFERENCES public.trees(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(30) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (tree_id, platform)
);

-- Enable RLS on social_links
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to social_links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Allow individual write access to social_links" ON public.social_links FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. SUBSCRIPTIONS table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(30) DEFAULT 'inactive' NOT NULL,
  plan VARCHAR(50),
  plan_id VARCHAR(50),
  razorpay_customer_id VARCHAR(100),
  razorpay_subscription_id VARCHAR(100),
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow individual read access to subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual write access to subscriptions" ON public.subscriptions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
