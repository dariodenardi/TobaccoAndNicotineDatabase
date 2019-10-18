CREATE TABLE [dbo].[Regions] (
    [ContinentCode] SMALLINT      NOT NULL,
    [RegionCode]    SMALLINT      NOT NULL,
    [ContinentName] VARCHAR (255) NOT NULL,
    [RegionName]    VARCHAR (255) NOT NULL,
    [PmiCoding]     VARCHAR (255) NOT NULL,
    PRIMARY KEY CLUSTERED ([ContinentCode] ASC, [RegionCode] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [RegionNameIndex]
    ON [dbo].[Regions]([RegionName] ASC);

