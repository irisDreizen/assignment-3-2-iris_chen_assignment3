
-- Create a new table called 'Users' in schema 'SchemaName'
-- Drop the table if it already exists

CREATE TABLE [dbo].[users](
	[user_id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL default NEWID(),
	[username] [varchar](30) NOT NULL UNIQUE,
	[password] [varchar](300) NOT NULL
)


IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
DROP TABLE dbo.Users
GO
-- Create the table in the specified schema
CREATE TABLE dbo.Users
(
    userName [NVARCHAR](50) NOT NULL PRIMARY KEY, -- primary key column
    firstname [NVARCHAR](50) NOT NULL,
    lastname [NVARCHAR](50) NOT NULL,
    password [NVARCHAR](max) NOT NULL,
    email [NVARCHAR](50) NOT NULL,
    photoUrl [NVARCHAR](50) NOT NULL,
    country [NVARCHAR](50) NOT NULL
    -- specify more columns here
);
GO

-- Insert rows into table 'TableName'
DECLARE @HashThis nvarchar(max);  
SET @HashThis = lower(CONVERT(varchar(max), HASHBYTES('SHA2_256', 'test'), 2));
INSERT INTO Users
 -- columns to insert data into
 ([userName],[firstname],[lastname], [password],[email],[photoUrl],[country])
VALUES -- first row: values for the columns in the list above
    (N'test', N'TestF',N'TestL',@HashThis, N'test@test.com',N'testPhotoUrl',N'testCountry')
-- add more rows here
GO
