CREATE TABLE [dbo].[Variables] (
    [Number]              SMALLINT      NOT NULL,
    [Name]                VARCHAR (255) NOT NULL,
    [PhaseCode]           SMALLINT      NOT NULL,
    [PhaseName]           VARCHAR (255) NOT NULL,
    [MeasurementUnitName] VARCHAR (255) NOT NULL,
    [VarLc]               BIT           DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([Number] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [NameIndex]
    ON [dbo].[Variables]([Name] ASC);

