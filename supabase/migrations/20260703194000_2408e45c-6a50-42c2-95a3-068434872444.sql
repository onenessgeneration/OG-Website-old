CREATE TABLE public.sfz_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  event_short_description text,
  cover_url text,
  location text,
  location_type text,
  start_at timestamptz NOT NULL,
  end_at timestamptz,
  event_type text NOT NULL DEFAULT 'upcoming',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sfz_events TO anon, authenticated;
GRANT ALL ON public.sfz_events TO service_role;
ALTER TABLE public.sfz_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sfz_events public read" ON public.sfz_events
  FOR SELECT USING (published = true);

CREATE TABLE public.sfz_session_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name text NOT NULL,
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text NOT NULL,
  group_size int NOT NULL,
  date_requested date NOT NULL,
  attendance_type text NOT NULL,
  location text,
  preferred_time text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.sfz_session_requests TO anon, authenticated;
GRANT ALL ON public.sfz_session_requests TO service_role;
ALTER TABLE public.sfz_session_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit sfz request" ON public.sfz_session_requests
  FOR INSERT WITH CHECK (true);