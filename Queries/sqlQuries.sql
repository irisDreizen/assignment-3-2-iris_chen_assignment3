DROP TABLE users;
DROP TABLE recipes;


--users table
CREATE TABLE [dbo].[Users]
(
    user_id [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL default NEWID(),
    username [NVARCHAR](50) NOT NULL UNIQUE, -- primary key column
    firstname [NVARCHAR](50) NOT NULL,
    lastname [NVARCHAR](50) NOT NULL,
    country [NVARCHAR](50) NOT NULL,
    userPassword [NVARCHAR](3000) NOT NULL,
    email [NVARCHAR](50) NOT NULL,
    photoUser [NVARCHAR](50) NOT NULL,
);


CREATE TABLE [dbo].[UsersAndRecieps]
(
    username [NVARCHAR](50) NOT NULL, -- primary key column
    recipeId [NVARCHAR](50) NOT NULL,
    watched [int] NOT NULL  ,
    saveFavorites [int] NOT NULL,
    PRIMARY KEY (recipeId, username),

   
);
GO



CREATE TABLE [dbo].[UsersHistoryRecieps]
(
    username [NVARCHAR](50) NOT NULL, -- primary key column
    recipeId [NVARCHAR](50) NOT NULL,
    serialNumber int IDENTITY(1,1),  
    PRIMARY KEY (recipeId, username),

   
);
GO

-- -- Insert rows into table 'TableName'
-- DECLARE @HashThis nvarchar(max);  
-- SET @HashThis = lower(CONVERT(varchar(max), HASHBYTES('SHA2_256', 'test'), 2));
-- INSERT INTO Users
--  -- columns to insert data into
--  ([userName],[firstname],[lastname], [password],[email],[photoUrl],[country])
-- VALUES -- first row: values for the columns in the list above
--     (N'test', N'TestF',N'TestL',@HashThis, N'test@test.com',N'testPhotoUrl',N'testCountry')
-- -- add more rows here
-- GO




INSERT INTO UsersAndRecieps(username, recipeId, watched, saveFavorites)
VALUES ('iris', '1', 1, 0);
GO


INSERT INTO UsersAndRecieps(username, recipeId, watched, saveFavorites)
VALUES ('en', '638038', 1, 1);
GO

INSERT INTO personalRecipes (recipeId, username, recipeTitle, recipeImage, recipeTime, recipeVegan, recipeVegiterian, recipeGlutenFree, recipeInstructions, recipeNumOfMeals)
VALUES ('123', 'en', 'a', 'b','b1',7,6,7,'f',5)
GO

INSERT INTO personalRecipes (recipeId, username, recipeTitle, recipeImage, recipeTime,recipeVegan, recipeVegiterian, recipeGlutenFree, recipeInstructions, recipeNumOfMeals)
VALUES ('124', 'en', 'a', 'b','b1',7,6,7,'f',5)
GO

INSERT INTO personalRecipesIngredients (recipeId, username,recipeIngrediant)
VALUES ('123', 'en','batata')
GO

INSERT INTO personalRecipesIngredients (recipeId, username,recipeIngrediant)
VALUES ('123', 'en','potato')
GO

INSERT INTO UsersHistoryRecieps(recipeId,username)
VALUES('638038','en')
GO
INSERT INTO UsersHistoryRecieps(recipeId,username)
VALUES('716272','en')
GO
INSERT INTO UsersHistoryRecieps(recipeId,username)
VALUES('661557','en')
GO




DELETE FROM UsersAndRecieps WHERE username='en';


INSERT INTO Users (username, firstname, lastname, country, userPassword, email, photoUser)
VALUES ('iris', 'chen', 'avra', 'israel', '4006', 'ch@12.com','cscs@.com');
GO



INSERT INTO Users (username, firstname, lastname, country, userPassword, email, photoUser)
VALUES ('en', 'chen', 'avra', 'israel', '1234', 'ch@12.com','cscs@.com');
GO





CREATE TABLE [dbo].[personalRecipes](
	recipeId [NVARCHAR] (50) NOT NULL,
	username [NVARCHAR](50) NOT NULL,
	recipeTitle [NVARCHAR](300) NOT NULL,
    recipeImage [NVARCHAR](300) NOT NULL,
    recipeTime [NVARCHAR](300) NOT NULL,
    recipeVegan [int] DEFAULT 0,
    recipeVegiterian [int] DEFAULT 0,
    recipeGlutenFree [int] DEFAULT 0,
    recipeInstructions [text] NOT NULL,
    recipeNumOfMeals [int] NOT NULL,
	PRIMARY KEY (recipeId, username),

);
GO

CREATE TABLE [dbo].[familylRecipes](
	recipeId [NVARCHAR] (300) NOT NULL,
	ownerRecipe [NVARCHAR](300) NOT NULL,
	recipeTitle [NVARCHAR](300) NOT NULL,
    periodRecipe [NVARCHAR](300) NOT NULL,
    ingredients [NVARCHAR](300) NOT NULL,
    instructions [NVARCHAR](300) NOT NULL,
    recipeImage  [NVARCHAR](300) NOT NULL, 
	PRIMARY KEY (recipeId, ownerRecipe),

);
GO


CREATE TABLE [dbo].[personalRecipesIngredients](
	recipeId [NVARCHAR](300) NOT NULL,
	username [NVARCHAR](300) NOT NULL,
	recipeIngrediant [NVARCHAR](300) NOT NULL,
	PRIMARY KEY (recipeId, username),

);
GO


CREATE TABLE [dbo].[familyRecipesIngredients](
	recipeId [NVARCHAR] (300) NOT NULL,
	ownerRecipe [NVARCHAR](300) NOT NULL,
	recipeIngrediant [NVARCHAR](300) NOT NULL,
	PRIMARY KEY (recipeId, ownerRecipe),

);
GO

