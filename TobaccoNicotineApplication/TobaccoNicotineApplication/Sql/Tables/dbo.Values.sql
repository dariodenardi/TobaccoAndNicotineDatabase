CREATE TABLE [dbo].[Values] (
    [CountryCode]   SMALLINT        NOT NULL,
    [Number]        SMALLINT        NOT NULL,
    [Year]          SMALLINT        NOT NULL,
    [NomismaCode]   INT             NOT NULL,
    [Data]          DECIMAL (18, 3) NULL,
    [DataPmi]       DECIMAL (18, 3) NULL,
    [PublicNotes]   VARCHAR (1000)  NULL,
    [InternalNotes] VARCHAR (1000)  NULL,
    [PmiNotes]      VARCHAR (1000)  NULL,
    PRIMARY KEY CLUSTERED ([CountryCode] ASC, [Number] ASC, [Year] ASC),
    FOREIGN KEY ([Number]) REFERENCES [dbo].[Variables] ([Number]) ON DELETE CASCADE,
    FOREIGN KEY ([CountryCode]) REFERENCES [dbo].[Countries] ([Code]) ON DELETE CASCADE
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [NomismaCodeIndex]
    ON [dbo].[Values]([NomismaCode] ASC);

