CREATE TABLE [dbo].[Sources] (
    [Name]         VARCHAR (255)  NOT NULL,
    [Date]         DATE           NOT NULL,
    [Time]         TIME (7)       NOT NULL,
    [Link]         VARCHAR (2048) NULL,
    [Repository]   VARCHAR (2048) NULL,
    [DateDownload] DATE           NULL,
    [Username]     VARCHAR (255)  NOT NULL,
    PRIMARY KEY CLUSTERED ([Name] ASC, [Date] ASC, [Time] ASC)
);

