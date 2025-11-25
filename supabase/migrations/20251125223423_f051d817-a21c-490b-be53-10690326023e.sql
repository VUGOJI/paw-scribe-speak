-- Make the pet-audio bucket public so audio can be played
UPDATE storage.buckets 
SET public = true 
WHERE id = 'pet-audio';