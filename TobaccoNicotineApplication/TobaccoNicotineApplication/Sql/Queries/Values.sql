-- QUERY_NUMBER_UPDATE_REGION
SELECT COUNT(*)
FROM [dbo].[Values] v1
WHERE v1.IdContinent = @idContinent AND v1.IdRegion = @idRegion
	AND v1.Number != 1
	AND v1.Year = @yearThis
	AND v1.Data IS NOT NULL
	AND v1.Data != (SELECT v2.Data
					FROM [dbo].[Values] v2
					WHERE v1.IdContinent = v2.idContinent AND v1.IdRegion = v2.IdRegion
					AND v1.IdCountry = v2.IdCountry
					AND v2.Number != 1
					AND v1.Number = v2.Number
					AND v2.Year = @yearLast
					AND v2.Data IS NOT NULL)
					
-- QUERY_NUMBER_UPDATE_COUNTRY
SELECT COUNT(*)
FROM [dbo].[Values] v1
WHERE v1.IdContinent = @idContinent AND v1.IdRegion = @idRegion AND v1.IdCountry = @idCountry
	AND v1.Number != 1
	AND v1.Year = @yearThis
	AND v1.Data IS NOT NULL
	AND v1.Data != (SELECT v2.Data
					FROM [dbo].[Values] v2
					WHERE v1.IdContinent = v2.idContinent AND v1.IdRegion = v2.IdRegion
					AND v1.IdCountry = v2.IdCountry
					AND v2.Number != 1
					AND v1.Number = v2.Number
					AND v2.Year = @yearLast
					AND v2.Data IS NOT NULL)
					
-- QUERY_NUMBER_UPDATE_VARIABLE
SELECT COUNT(*)
FROM [dbo].[Values] v1
WHERE v1.Number = @number
	AND v1.Number != 1
	AND v1.Year = @yearThis
	AND v1.Data IS NOT NULL
	AND v1.Data != (SELECT v2.Data
					FROM [dbo].[Values] v2
					WHERE v1.IdContinent = v2.idContinent AND v1.IdRegion = v2.IdRegion
					AND v1.IdCountry = v2.IdCountry
					AND v2.Number != 1
					AND v1.Number = v2.Number
					AND v2.Year = @yearLast
					AND v2.Data IS NOT NULL)
					
-- QUERY_TOT_VALUES_NOT_NULL_REGION
SELECT COUNT(*)
FROM [dbo].[Values] v1
WHERE v1.IdContinent = @idContinent AND v1.IdRegion = @idRegion
AND v1.Number != 1
AND v1.Year = @yearThis
AND v1.Data IS NOT NULL

-- QUERY_TOT_VALUES_NOT_NULL_COUNTRY
SELECT COUNT(*)
FROM [dbo].[Values] v1
WHERE v1.IdContinent = @idContinent AND v1.IdRegion = @idRegion AND v1.IdCountry = @idCountry
AND v1.Number != 1
AND v1.Year = @yearThis
AND v1.Data IS NOT NULL

-- QUERY_TOT_VALUES_NOT_NULL_NUMBER
SELECT COUNT(*)
FROM [dbo].[Values] v1
WHERE v1.Number = @number
AND v1.Number != 1
AND v1.Year = @yearThis
AND v1.Data IS NOT NULL

-- QUERY_TOT_VALUES_REGION
SELECT COUNT(*)
FROM [dbo].[Values] v1
WHERE v1.IdContinent = @idContinent AND v1.IdRegion = @idRegion
AND v1.Number != 1
AND v1.Year = @yearThis

-- QUERY_TOT_VALUES_COUNTRY
SELECT COUNT(*)
FROM [dbo].[Values] v1
WHERE v1.IdContinent = @idContinent AND v1.IdRegion = @idRegion AND v1.IdCountry = @idCountry
AND v1.Number != 1
AND v1.Year = @yearThis

-- QUERY_TOT_VALUES_NUMBER
SELECT COUNT(*)
FROM [dbo].[Values] v1
WHERE v1.Number = @number
AND v1.Number != 1
AND v1.Year = @yearThis

-- QUERY_MAX_YEAR_AVAILABLE
SELECT MAX(v1.Year)
FROM [dbo].[Values] v1