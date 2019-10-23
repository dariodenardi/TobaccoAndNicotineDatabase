using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace TobaccoNicotineApplication.Sql
{
    public class ValueRepository
    {
        // non considero la variabile numero 1
        private static string QUERY_NUMBER_UPDATE_REGION = "SELECT COUNT(*) " +
            "FROM [dbo].[Values] v1 " +
            "WHERE v1.IdContinent = @idContinent AND v1.IdRegion = @idRegion " +
            "AND v1.Number != 1" +
            "AND v1.Year = @yearThis " +
            "AND v1.Data IS NOT NULL " +
            "AND v1.Data != (SELECT v2.Data " +
                            "FROM [dbo].[Values] v2 " +
                            "WHERE v1.IdContinent = v2.idContinent AND v1.IdRegion = v2.IdRegion " +
                            "AND v1.IdCountry = v2.IdCountry " +
                            "AND v2.Number != 1 " +
                            "AND v1.Number = v2.Number " +
                            "AND v2.Year = @yearLast " +
                            "AND v2.Data IS NOT NULL)";

        // non considero la variabile numero 1
        private static string QUERY_NUMBER_UPDATE_COUNTRY = "SELECT COUNT(*) " +
            "FROM [dbo].[Values] v1 " +
            "WHERE v1.IdContinent = @idContinent AND v1.IdRegion = @idRegion AND v1.IdCountry = @idCountry " +
            "AND v1.Number != 1" +
            "AND v1.Year = @yearThis " +
            "AND v1.Data IS NOT NULL " +
            "AND v1.Data != (SELECT v2.Data " +
                            "FROM [dbo].[Values] v2 " +
                            "WHERE v1.IdContinent = v2.idContinent AND v1.IdRegion = v2.IdRegion " +
                            "AND v1.IdCountry = v2.IdCountry " +
                            "AND v2.Number != 1 " +
                            "AND v1.Number = v2.Number " +
                            "AND v2.Year = @yearLast " +
                            "AND v2.Data IS NOT NULL)";

        // non considero la variabile numero 1
        private static string QUERY_NUMBER_UPDATE_VARIABLE = "SELECT COUNT(*) " +
            "FROM [dbo].[Values] v1 " +
            "WHERE v1.Number = @number " +
            "AND v1.Number != 1" +
            "AND v1.Year = @yearThis " +
            "AND v1.Data IS NOT NULL " +
            "AND v1.Data != (SELECT v2.Data " +
                            "FROM [dbo].[Values] v2 " +
                            "WHERE v1.IdContinent = v2.idContinent AND v1.IdRegion = v2.IdRegion " +
                            "AND v1.IdCountry = v2.IdCountry " +
                            "AND v2.Number != 1 " +
                            "AND v1.Number = v2.Number " +
                            "AND v2.Year = @yearLast " +
                            "AND v2.Data IS NOT NULL)";

        // non considero la variabile numero 1
        private static string QUERY_TOT_VALUES_NOT_NULL_REGION = "SELECT COUNT(*) " +
            "FROM [dbo].[Values] v1 " +
            "WHERE v1.IdContinent = @idContinent AND v1.IdRegion = @idRegion " +
            "AND v1.Number != 1" +
            "AND v1.Year = @yearThis " +
            "AND v1.Data IS NOT NULL";

        // non considero la variabile numero 1
        private static string QUERY_TOT_VALUES_NOT_NULL_COUNTRY = "SELECT COUNT(*) " +
            "FROM [dbo].[Values] v1 " +
            "WHERE v1.IdContinent = @idContinent AND v1.IdRegion = @idRegion AND v1.IdCountry = @idCountry " +
            "AND v1.Number != 1" +
            "AND v1.Year = @yearThis " +
            "AND v1.Data IS NOT NULL";

        // non considero la variabile numero 1
        private static string QUERY_TOT_VALUES_NOT_NULL_VARIABLE = "SELECT COUNT(*) " +
            "FROM [dbo].[Values] v1 " +
            "WHERE v1.Number = @number " +
            "AND v1.Number != 1" +
            "AND v1.Year = @yearThis " +
            "AND v1.Data IS NOT NULL";

        // non considero la variabile numero 1
        private static string QUERY_TOT_VALUES_REGION = "SELECT COUNT(*) " +
            "FROM [dbo].[Values] v1 " +
            "WHERE v1.IdContinent = @idContinent AND v1.IdRegion = @idRegion " +
            "AND v1.Number != 1" +
            "AND v1.Year = @yearThis";

        // non considero la variabile numero 1
        private static string QUERY_TOT_VALUES_COUNTRY = "SELECT COUNT(*) " +
            "FROM [dbo].[Values] v1 " +
            "WHERE v1.IdContinent = @idContinent AND v1.IdRegion = @idRegion AND v1.IdCountry = @idCountry " +
            "AND v1.Number != 1" +
            "AND v1.Year = @yearThis";

        // non considero la variabile numero 1
        private static string QUERY_TOT_VALUES_VARIABLE = "SELECT COUNT(*) " +
            "FROM [dbo].[Values] v1 " +
            "WHERE v1.Number = @number " +
            "AND v1.Number != 1" +
            "AND v1.Year = @yearThis";

        public static int getNumerUpdateRegion(short idContinent, short idRegion, short yearThis, short yearLast)
        {
            int count = 0;
            //
            // The program accesses the connection string.
            // ... It uses it on a connection.
            //
            using (SqlConnection dbConn = new SqlConnection(DataSource.conString))
            {
                dbConn.Open();

                try
                {
                    //
                    // SqlCommand should be created inside using.
                    // ... It receives the SQL statement.
                    // ... It receives the connection object.
                    // ... The SQL text works with a specific database.
                    //
                    using (SqlCommand dbCommand = new SqlCommand(QUERY_NUMBER_UPDATE_REGION, dbConn))
                    {
                        dbCommand.Parameters.Add("idContinent", SqlDbType.SmallInt).Value = idContinent;
                        dbCommand.Parameters.Add("idRegion", SqlDbType.SmallInt).Value = idRegion;
                        dbCommand.Parameters.Add("yearThis", SqlDbType.SmallInt).Value = yearThis;
                        dbCommand.Parameters.Add("yearLast", SqlDbType.SmallInt).Value = yearLast;

                        //
                        // Instance methods can be used on the SqlCommand.
                        // ... These read data.
                        //
                        using (SqlDataReader reader = dbCommand.ExecuteReader())
                        {
                            while(reader.Read())
                            {
                                count = reader.GetInt32(0);
                            }
                        }
                    }

                }
                catch (SqlException)
                {
                    throw; // bubble up the exception and preserve the stack trace
                }

                dbConn.Close();
            }

            return count;
        }

        public static int getNumerUpdateCountry(short idContinent, short idRegion, short idCountry, short yearThis, short yearLast)
        {
            int count = 0;
            //
            // The program accesses the connection string.
            // ... It uses it on a connection.
            //
            using (SqlConnection dbConn = new SqlConnection(DataSource.conString))
            {
                dbConn.Open();

                try
                {
                    //
                    // SqlCommand should be created inside using.
                    // ... It receives the SQL statement.
                    // ... It receives the connection object.
                    // ... The SQL text works with a specific database.
                    //
                    using (SqlCommand dbCommand = new SqlCommand(QUERY_NUMBER_UPDATE_COUNTRY, dbConn))
                    {
                        dbCommand.Parameters.Add("idContinent", SqlDbType.SmallInt).Value = idContinent;
                        dbCommand.Parameters.Add("idRegion", SqlDbType.SmallInt).Value = idRegion;
                        dbCommand.Parameters.Add("idCountry", SqlDbType.SmallInt).Value = idCountry;
                        dbCommand.Parameters.Add("yearThis", SqlDbType.SmallInt).Value = yearThis;
                        dbCommand.Parameters.Add("yearLast", SqlDbType.SmallInt).Value = yearLast;

                        //
                        // Instance methods can be used on the SqlCommand.
                        // ... These read data.
                        //
                        using (SqlDataReader reader = dbCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                count = reader.GetInt32(0);
                            }
                        }
                    }

                }
                catch (SqlException)
                {
                    throw; // bubble up the exception and preserve the stack trace
                }

                dbConn.Close();
            }

            return count;
        }

        public static int getNumerUpdateVariable(short number, short yearThis, short yearLast)
        {
            int count = 0;
            //
            // The program accesses the connection string.
            // ... It uses it on a connection.
            //
            using (SqlConnection dbConn = new SqlConnection(DataSource.conString))
            {
                dbConn.Open();

                try
                {
                    //
                    // SqlCommand should be created inside using.
                    // ... It receives the SQL statement.
                    // ... It receives the connection object.
                    // ... The SQL text works with a specific database.
                    //
                    using (SqlCommand dbCommand = new SqlCommand(QUERY_NUMBER_UPDATE_VARIABLE, dbConn))
                    {
                        dbCommand.Parameters.Add("number", SqlDbType.SmallInt).Value = number;
                        dbCommand.Parameters.Add("yearThis", SqlDbType.SmallInt).Value = yearThis;
                        dbCommand.Parameters.Add("yearLast", SqlDbType.SmallInt).Value = yearLast;

                        //
                        // Instance methods can be used on the SqlCommand.
                        // ... These read data.
                        //
                        using (SqlDataReader reader = dbCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                count = reader.GetInt32(0);
                            }
                        }
                    }

                }
                catch (SqlException)
                {
                    throw; // bubble up the exception and preserve the stack trace
                }

                dbConn.Close();
            }

            return count;
        }

        public static int getTotValuesNotNullRegion(short idContinent, short idRegion, short yearThis)
        {
            int count = 0;
            //
            // The program accesses the connection string.
            // ... It uses it on a connection.
            //
            using (SqlConnection dbConn = new SqlConnection(DataSource.conString))
            {
                dbConn.Open();

                try
                {
                    //
                    // SqlCommand should be created inside using.
                    // ... It receives the SQL statement.
                    // ... It receives the connection object.
                    // ... The SQL text works with a specific database.
                    //
                    using (SqlCommand dbCommand = new SqlCommand(QUERY_TOT_VALUES_NOT_NULL_REGION, dbConn))
                    {
                        dbCommand.Parameters.Add("idContinent", SqlDbType.SmallInt).Value = idContinent;
                        dbCommand.Parameters.Add("idRegion", SqlDbType.SmallInt).Value = idRegion;
                        dbCommand.Parameters.Add("yearThis", SqlDbType.SmallInt).Value = yearThis;

                        //
                        // Instance methods can be used on the SqlCommand.
                        // ... These read data.
                        //
                        using (SqlDataReader reader = dbCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                count = reader.GetInt32(0);
                            }
                        }
                    }

                }
                catch (SqlException)
                {
                    throw; // bubble up the exception and preserve the stack trace
                }

                dbConn.Close();
            }

            return count;
        }

        public static int getTotValuesNotNullCountry(short idContinent, short idRegion, short idCountry, short yearThis)
        {
            int count = 0;
            //
            // The program accesses the connection string.
            // ... It uses it on a connection.
            //
            using (SqlConnection dbConn = new SqlConnection(DataSource.conString))
            {
                dbConn.Open();

                try
                {
                    //
                    // SqlCommand should be created inside using.
                    // ... It receives the SQL statement.
                    // ... It receives the connection object.
                    // ... The SQL text works with a specific database.
                    //
                    using (SqlCommand dbCommand = new SqlCommand(QUERY_TOT_VALUES_NOT_NULL_COUNTRY, dbConn))
                    {
                        dbCommand.Parameters.Add("idContinent", SqlDbType.SmallInt).Value = idContinent;
                        dbCommand.Parameters.Add("idRegion", SqlDbType.SmallInt).Value = idRegion;
                        dbCommand.Parameters.Add("idCountry", SqlDbType.SmallInt).Value = idCountry;
                        dbCommand.Parameters.Add("yearThis", SqlDbType.SmallInt).Value = yearThis;

                        //
                        // Instance methods can be used on the SqlCommand.
                        // ... These read data.
                        //
                        using (SqlDataReader reader = dbCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                count = reader.GetInt32(0);
                            }
                        }
                    }

                }
                catch (SqlException)
                {
                    throw; // bubble up the exception and preserve the stack trace
                }

                dbConn.Close();
            }

            return count;
        }

        public static int getTotValuesNotNullVariable(short number, short yearThis)
        {
            int count = 0;
            //
            // The program accesses the connection string.
            // ... It uses it on a connection.
            //
            using (SqlConnection dbConn = new SqlConnection(DataSource.conString))
            {
                dbConn.Open();

                try
                {
                    //
                    // SqlCommand should be created inside using.
                    // ... It receives the SQL statement.
                    // ... It receives the connection object.
                    // ... The SQL text works with a specific database.
                    //
                    using (SqlCommand dbCommand = new SqlCommand(QUERY_TOT_VALUES_NOT_NULL_VARIABLE, dbConn))
                    {
                        dbCommand.Parameters.Add("number", SqlDbType.SmallInt).Value = number;
                        dbCommand.Parameters.Add("yearThis", SqlDbType.SmallInt).Value = yearThis;

                        //
                        // Instance methods can be used on the SqlCommand.
                        // ... These read data.
                        //
                        using (SqlDataReader reader = dbCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                count = reader.GetInt32(0);
                            }
                        }
                    }

                }
                catch (SqlException)
                {
                    throw; // bubble up the exception and preserve the stack trace
                }

                dbConn.Close();
            }

            return count;
        }

        public static int getTotValuesRegion(short idContinent, short idRegion, short yearThis)
        {
            int count = 0;
            //
            // The program accesses the connection string.
            // ... It uses it on a connection.
            //
            using (SqlConnection dbConn = new SqlConnection(DataSource.conString))
            {
                dbConn.Open();

                try
                {
                    //
                    // SqlCommand should be created inside using.
                    // ... It receives the SQL statement.
                    // ... It receives the connection object.
                    // ... The SQL text works with a specific database.
                    //
                    using (SqlCommand dbCommand = new SqlCommand(QUERY_TOT_VALUES_REGION, dbConn))
                    {
                        dbCommand.Parameters.Add("idContinent", SqlDbType.SmallInt).Value = idContinent;
                        dbCommand.Parameters.Add("idRegion", SqlDbType.SmallInt).Value = idRegion;
                        dbCommand.Parameters.Add("yearThis", SqlDbType.SmallInt).Value = yearThis;

                        //
                        // Instance methods can be used on the SqlCommand.
                        // ... These read data.
                        //
                        using (SqlDataReader reader = dbCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                count = reader.GetInt32(0);
                            }
                        }
                    }

                }
                catch (SqlException)
                {
                    throw; // bubble up the exception and preserve the stack trace
                }

                dbConn.Close();
            }

            return count;
        }

        public static int getTotValuesCountry(short idContinent, short idRegion, short idCountry, short yearThis)
        {
            int count = 0;
            //
            // The program accesses the connection string.
            // ... It uses it on a connection.
            //
            using (SqlConnection dbConn = new SqlConnection(DataSource.conString))
            {
                dbConn.Open();

                try
                {
                    //
                    // SqlCommand should be created inside using.
                    // ... It receives the SQL statement.
                    // ... It receives the connection object.
                    // ... The SQL text works with a specific database.
                    //
                    using (SqlCommand dbCommand = new SqlCommand(QUERY_TOT_VALUES_COUNTRY, dbConn))
                    {
                        dbCommand.Parameters.Add("idContinent", SqlDbType.SmallInt).Value = idContinent;
                        dbCommand.Parameters.Add("idRegion", SqlDbType.SmallInt).Value = idRegion;
                        dbCommand.Parameters.Add("idCountry", SqlDbType.SmallInt).Value = idCountry;
                        dbCommand.Parameters.Add("yearThis", SqlDbType.SmallInt).Value = yearThis;

                        //
                        // Instance methods can be used on the SqlCommand.
                        // ... These read data.
                        //
                        using (SqlDataReader reader = dbCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                count = reader.GetInt32(0);
                            }
                        }
                    }

                }
                catch (SqlException)
                {
                    throw; // bubble up the exception and preserve the stack trace
                }

                dbConn.Close();
            }

            return count;
        }

        public static int getTotValuesVariable(short number, short yearThis)
        {
            int count = 0;
            //
            // The program accesses the connection string.
            // ... It uses it on a connection.
            //
            using (SqlConnection dbConn = new SqlConnection(DataSource.conString))
            {
                dbConn.Open();

                try
                {
                    //
                    // SqlCommand should be created inside using.
                    // ... It receives the SQL statement.
                    // ... It receives the connection object.
                    // ... The SQL text works with a specific database.
                    //
                    using (SqlCommand dbCommand = new SqlCommand(QUERY_TOT_VALUES_VARIABLE, dbConn))
                    {
                        dbCommand.Parameters.Add("number", SqlDbType.SmallInt).Value = number;
                        dbCommand.Parameters.Add("yearThis", SqlDbType.SmallInt).Value = yearThis;

                        //
                        // Instance methods can be used on the SqlCommand.
                        // ... These read data.
                        //
                        using (SqlDataReader reader = dbCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                count = reader.GetInt32(0);
                            }
                        }
                    }

                }
                catch (SqlException)
                {
                    throw; // bubble up the exception and preserve the stack trace
                }

                dbConn.Close();
            }

            return count;
        }

    }
}