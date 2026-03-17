-- ============================================
-- EdgeBorn E-Commerce Database Setup
-- Run this SQL in Supabase SQL Editor
-- ============================================

-- 1. Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT,
    description TEXT,
    category TEXT,
    theme TEXT,
    sizes TEXT[] DEFAULT '{}',
    colors JSONB DEFAULT '[]',
    inventory INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_whatsapp TEXT,
    status TEXT DEFAULT 'Paid',
    total NUMERIC NOT NULL,
    items JSONB DEFAULT '[]',
    shipping_address JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if they don't exist (Migration)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='user_id') THEN
        ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='customer_phone') THEN
        ALTER TABLE orders ADD COLUMN customer_phone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='customer_whatsapp') THEN
        ALTER TABLE orders ADD COLUMN customer_whatsapp TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND table_schema='public' AND column_name='is_admin') THEN
        ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND table_schema='public' AND column_name='email') THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;
END $$;

-- 3. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for products (public read, authenticated write)
DROP POLICY IF EXISTS "Allow public read on products" ON products;
CREATE POLICY "Allow public read on products" ON products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all write on products" ON products;
CREATE POLICY "Allow all write on products" ON products
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- 5. Create policies for orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "Authenticated users can create orders" ON orders;
CREATE POLICY "Authenticated users can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow all write on orders for admin" ON orders;
CREATE POLICY "Allow all write on orders for admin" ON orders
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- 6. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 8. Create policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 9. Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create a trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Insert sample products (optional)
INSERT INTO products (name, price, image, description, category, theme, sizes, colors, inventory, status)
VALUES 
    ('Classic Navy Tee', 29.99, '/placeholder-1.jpg', 'A timeless classic navy t-shirt.', 'Men', 'Classic', ARRAY['S', 'M', 'L', 'XL'], '[{"name": "Navy", "value": "#0f172a"}]'::jsonb, 20, 'Active'),
    ('Anime Hero Hoodie', 59.99, '/placeholder-2.jpg', 'Show your power level with this hoodie.', 'Unisex', 'Anime', ARRAY['M', 'L', 'XL'], '[{"name": "Black", "value": "#000000"}]'::jsonb, 15, 'Active')
ON CONFLICT DO NOTHING;

-- 12. Helper: Set a user as admin (Run manually if needed)
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'YOUR_EMAIL@HERE.COM';
