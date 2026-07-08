-- Agregar la columna slug a la tabla comercios
ALTER TABLE comercios ADD COLUMN IF NOT EXISTS slug TEXT;

-- Crear una función auxiliar para limpiar el texto (minúsculas, sin acentos ni espacios)
CREATE OR REPLACE FUNCTION generate_slug(original_text TEXT) RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  slug := lower(original_text);
  slug := replace(slug, 'á', 'a');
  slug := replace(slug, 'é', 'e');
  slug := replace(slug, 'í', 'i');
  slug := replace(slug, 'ó', 'o');
  slug := replace(slug, 'ú', 'u');
  slug := replace(slug, 'ñ', 'n');
  slug := regexp_replace(slug, '[^a-z0-9]', '', 'g');
  
  -- Si queda vacío por alguna razón, asignamos un valor por defecto aleatorio
  IF slug = '' OR slug IS NULL THEN
    slug := 'comercio' || floor(random() * 10000)::text;
  END IF;
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Actualizar los comercios existentes asignando un slug
WITH numbered AS (
  SELECT id,
         generate_slug(name) AS base_slug,
         ROW_NUMBER() OVER(PARTITION BY generate_slug(name) ORDER BY id) as rn
  FROM comercios
)
UPDATE comercios c
SET slug = n.base_slug || CASE WHEN n.rn > 1 THEN '-' || n.rn ELSE '' END
FROM numbered n
WHERE c.id = n.id AND (c.slug IS NULL OR c.slug = '');

-- Agregar la restricción de que el slug debe ser único
ALTER TABLE comercios ADD CONSTRAINT comercios_slug_unique UNIQUE (slug);
