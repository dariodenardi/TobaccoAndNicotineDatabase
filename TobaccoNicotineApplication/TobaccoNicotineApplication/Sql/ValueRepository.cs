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
        private static string DIFFERENT_SOURCE = "SELECT COUNT(DISTINCT mvs.NameSource) "
                                            + "FROM [dbo].[Values] v, [dbo].MappingVariableSource mvs "
                                            + "WHERE mvs.[CountryCode] = v.[CountryCode] "
                                            + "AND mvs.[Number] = v.[Number] "
                                            + "AND mvs.[Year] = v.[Year] "
                                            + "AND v.CountryCode = @countryCode "
                                            + "AND v.Number = @number";

        public static bool getDifferentSource(short countryCode, short number)
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
                    using (SqlCommand dbCommand = new SqlCommand(DIFFERENT_SOURCE, dbConn))
                    {
                        dbCommand.Parameters.Add("countryCode", SqlDbType.SmallInt).Value = countryCode;
                        dbCommand.Parameters.Add("number", SqlDbType.SmallInt).Value = number;

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

                return (count > 1);
            }
        }

    }
}