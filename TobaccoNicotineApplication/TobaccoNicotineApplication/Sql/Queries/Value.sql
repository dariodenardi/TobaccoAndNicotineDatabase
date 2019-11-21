SELECT COUNT(DISTINCT mvs.NameSource)
FROM [dbo].[Values] v, [dbo].MappingVariableSource mvs
WHERE mvs.[CountryCode] = v.[CountryCode]
AND mvs.[Number] = v.[Number]
AND mvs.[Year] = v.[Year]
AND v.CountryCode = 4
AND v.Number = 4