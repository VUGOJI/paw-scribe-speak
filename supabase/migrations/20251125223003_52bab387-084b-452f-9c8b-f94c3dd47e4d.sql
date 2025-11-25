-- Create storage bucket for pet audio recordings
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pet-audio', 'pet-audio', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own audio
CREATE POLICY "Users can upload their own pet audio"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pet-audio' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own audio
CREATE POLICY "Users can view their own pet audio"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'pet-audio' AND
  auth.uid()::text = (storage.foldername(name))[1]
);