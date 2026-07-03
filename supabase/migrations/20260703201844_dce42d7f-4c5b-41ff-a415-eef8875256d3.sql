INSERT INTO public.sfz_events (event_name, event_short_description, cover_url, location, location_type, start_at, end_at, event_type, published)
VALUES (
  'SFZ at Community Wellness Center',
  'A mock past event to preview the SFZ Past Events section. Around 60 participants joined this introductory Stress-Free Zone session.',
  NULL,
  'Bangalore, India',
  'in_person',
  now() - interval '30 days' + interval '10 hours',
  now() - interval '30 days' + interval '12 hours',
  'past',
  true
);