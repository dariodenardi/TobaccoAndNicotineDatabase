CREATE TABLE [dbo].[Countries] (
    [Code]          SMALLINT      NOT NULL,
    [Name]          VARCHAR (255) NOT NULL,
    [AreaCode]      BIT           NOT NULL,
    [ContinentCode] SMALLINT      NOT NULL,
    [RegionCode]    SMALLINT      NOT NULL,
    PRIMARY KEY CLUSTERED ([Code] ASC),
    FOREIGN KEY ([ContinentCode], [RegionCode]) REFERENCES [dbo].[Regions] ([ContinentCode], [RegionCode]) ON DELETE CASCADE
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [CountryNameIndex]
    ON [dbo].[Countries]([Name] ASC);

