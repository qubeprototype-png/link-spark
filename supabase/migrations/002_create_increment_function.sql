-- Create database function for incrementing click count
-- This is more efficient than separate SELECT + UPDATE queries

CREATE OR REPLACE FUNCTION increment_click_count(code TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.links
  SET click_count = click_count + 1
  WHERE short_code = code;
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION increment_click_count(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION increment_click_count(TEXT) TO authenticated;

COMMENT ON FUNCTION increment_click_count IS 'Increments the click count for a link by short code';

