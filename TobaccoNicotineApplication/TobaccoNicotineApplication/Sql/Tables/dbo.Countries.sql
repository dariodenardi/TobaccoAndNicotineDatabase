CREATE TABLE [dbo].[Countries] (
    [CountryCode]   SMALLINT      NOT NULL,
    [ContinentCode] SMALLINT      NOT NULL,
    [RegionCode]    SMALLINT      NOT NULL,
    [CountryName]   VARCHAR (255) NOT NULL,
    [ContinentName] VARCHAR (255) NOT NULL,
    [RegionName]    VARCHAR (255) NOT NULL,
    [PmiCoding]     VARCHAR (255) NOT NULL,
    [AreaCode]      BIT           NOT NULL,
    PRIMARY KEY CLUSTERED ([CountryCode] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [CountryNameIndex]
    ON [dbo].[Countries]([CountryName] ASC);

