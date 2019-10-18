CREATE TABLE [dbo].[Currencies] (
    [CountryCode] SMALLINT         NOT NULL,
    [Year]        SMALLINT         NOT NULL,
    [Value]       DECIMAL (18, 10) NOT NULL,
    [Notes]       VARCHAR (1000)   NULL,
    PRIMARY KEY CLUSTERED ([CountryCode] ASC, [Year] ASC),
    FOREIGN KEY ([CountryCode]) REFERENCES [dbo].[Countries] ([Code]) ON DELETE CASCADE
);

