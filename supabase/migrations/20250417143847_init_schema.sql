-- Create listings table
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  asin text not null,
  title text,
  image_url text,
  rating float,
  review_count integer,
  sales_est text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create analyses table
create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  summary text,
  keywords text[],
  competitor_notes text,
  seo_notes text,
  recommendations text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
