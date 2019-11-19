--MR:

-- Parte in alto: trovo il MR dei dati not null
-- Parte in basso: trovo i dati null delle variabili che non compaiono nella query di sopra
-- Si suddivide in molte subquery:
-- v1 e v2: è il codice del MR: trovo i dati MR not null delle variabili
-- v3: prendo tutte le variabili che non compaiono nel risultato di v2. Quindi sono dati null
-- v4: prendo l'anno più recente perchè avrei più anni
-- v5: ottengo la tupla completa del valore

SELECT co.[ContinentCode], co.[ContinentName], co.[RegionCode], co.[RegionName], v.[CountryCode], co.[PmiCoding], co.[CountryName], va.[PhaseCode], va.[PhaseName], v.[Number], va.[Name], va.[MeasurementUnitName], v.[Data], v.[Year], s.[Name], s.[Link], cu2.[Value],
v.[PublicNotes], va.[VarLc], co.[AreaCode], v.[InternalNotes], s.[DateDownload], s.[Repository], s.[Username], s.[Date], s.[Time]
FROM [dbo].Variables va, [dbo].Countries co, [dbo].[Values] v LEFT JOIN [dbo].Currencies cu2
ON v.[CountryCode] = cu2.[CountryCode]
AND v.[Year] = cu2.[Year]
LEFT JOIN [dbo].MappingVariableSource mvs
ON mvs.[CountryCode] = v.[CountryCode]
AND mvs.[Number] = v.[Number]
AND mvs.[Year] = v.[Year]
LEFT JOIN [dbo].Sources s
ON s.[Time] = mvs.[TimeSource]
AND s.[Date] = mvs.[DateSource]
AND s.[Name] = mvs.[NameSource]
WHERE v.[Number] = va.[Number]
AND v.[CountryCode] = co.[CountryCode]
AND v.CountryCode = 108
AND v.Year =(SELECT MAX(v1.Year)
				FROM [dbo].[Values] v1
				WHERE v1.Data IS NOT NULL
				AND v1.[CountryCode] = v.[CountryCode]
				AND v1.[Number] = v.[Number])
UNION
SELECT co.[ContinentCode], co.[ContinentName], co.[RegionCode], co.[RegionName], v.[CountryCode], co.[PmiCoding], co.[CountryName], va.[PhaseCode], va.[PhaseName], v.[Number], va.[Name], va.[MeasurementUnitName], v.[Data], v.[Year], s.[Name], s.[Link], cu2.[Value],
v.[PublicNotes], va.[VarLc], co.[AreaCode], v.[InternalNotes], s.[DateDownload], s.[Repository], s.[Username], s.[Date], s.[Time]
FROM [dbo].Variables va, [dbo].Countries co, [dbo].[Values] v LEFT JOIN [dbo].Currencies cu2
ON v.[CountryCode] = cu2.[CountryCode]
AND v.[Year] = cu2.[Year]
LEFT JOIN [dbo].MappingVariableSource mvs
ON mvs.[CountryCode] = v.[CountryCode]
AND mvs.[Number] = v.[Number]
AND mvs.[Year] = v.[Year]
LEFT JOIN [dbo].Sources s
ON s.[Time] = mvs.[TimeSource]
AND s.[Date] = mvs.[DateSource]
AND s.[Name] = mvs.[NameSource]
WHERE v.[Number] = va.[Number]
AND v.[CountryCode] = co.[CountryCode]
AND v.CountryCode = 108
AND v.Year = (SELECT MAX(v4.[Year])
					FROM [dbo].[Values] v4
					WHERE v4.[CountryCode] = v.[CountryCode]
					AND v4.[Number] = v.[Number]
					AND EXISTS (SELECT *
								FROM [dbo].[Values] v3
								WHERE v3.[CountryCode] = v4.[CountryCode]
								AND v3.[Number] = v4.[Number]
								AND NOT EXISTS (SELECT *
													FROM [dbo].[Values] v2
													WHERE v3.[CountryCode] = v2.[CountryCode]
													AND v3.[Number] = v2.[Number]
													AND v3.[Year] = v2.[Year]
													AND v2.[Year] =(SELECT MAX(v1.[Year])
																	FROM [dbo].[Values] v1
																	WHERE v1.[Data] IS NOT NULL
																	AND v1.[CountryCode] = v2.[CountryCode]
																	AND v1.[Number] = v2.[Number]))
								GROUP BY v3.[CountryCode], v3.[Number]
								HAVING COUNT(v3.[Number]) > 9 OR v3.[Number] = 1 ))
ORDER BY v.[CountryCode], v.[Number], v.[Year]

-- 9: 11 anni disponibili - 1 (anno 0) - 1 anno che è stato selezionato

-----------

--NO MR:

SELECT co.[ContinentCode], co.[ContinentName], co.[RegionCode], co.[RegionName], v.[CountryCode], co.[PmiCoding], co.[CountryName], va.[PhaseCode], va.[PhaseName], v.[Number], va.[Name], va.[MeasurementUnitName], v.[Data], v.[Year], s.[Name], s.[Link], cu2.[Value],
v.[PublicNotes], va.[VarLc], co.[AreaCode], v.[InternalNotes], s.[DateDownload], s.[Repository], s.[Username], s.[Date], s.[Time]
FROM [dbo].Variables va, [dbo].Countries co, [dbo].[Values] v LEFT JOIN [dbo].Currencies cu2
ON v.[CountryCode] = cu2.[CountryCode]
AND v.[Year] = cu2.[Year]
LEFT JOIN [dbo].MappingVariableSource mvs
ON mvs.[CountryCode] = v.[CountryCode]
AND mvs.[Number] = v.[Number]
AND mvs.[Year] = v.[Year]
LEFT JOIN [dbo].Sources s
ON s.[Time] = mvs.[TimeSource]
AND s.[Date] = mvs.[DateSource]
AND s.[Name] = mvs.[NameSource]
WHERE v.[Number] = va.[Number]
AND v.[CountryCode] = co.[CountryCode]
AND v.CountryCode = 108
ORDER BY v.[CountryCode], v.[Number], v.[Year]