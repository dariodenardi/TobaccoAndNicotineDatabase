CREATE TABLE [dbo].[MappingVariableSource] (
    [Year]        SMALLINT      NOT NULL,
    [Number]      SMALLINT      NOT NULL,
    [CountryCode] SMALLINT      NOT NULL,
    [NameSource]  VARCHAR (255) NOT NULL,
    [DateSource]  DATE          NOT NULL,
    [TimeSource]  TIME (7)      NOT NULL,
    PRIMARY KEY CLUSTERED ([Year] ASC, [Number] ASC, [CountryCode] ASC, [TimeSource] ASC, [NameSource] ASC, [DateSource] ASC),
    FOREIGN KEY ([CountryCode], [Number], [Year]) REFERENCES [dbo].[Values] ([CountryCode], [Number], [Year]) ON DELETE CASCADE,
    FOREIGN KEY ([NameSource], [DateSource], [TimeSource]) REFERENCES [dbo].[Sources] ([Name], [Date], [Time]) ON DELETE CASCADE
);

