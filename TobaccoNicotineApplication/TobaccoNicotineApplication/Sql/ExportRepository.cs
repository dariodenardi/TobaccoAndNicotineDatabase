﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using TobaccoNicotineApplication.Models;

namespace TobaccoNicotineApplication.Sql
{
    public static class ExportRepository
    {
        private static string QUERY_NO_MR_1 = " FROM [dbo].Variables va, [dbo].Countries co, [dbo].[Values] v LEFT JOIN [dbo].Currencies cu2 "
                                            + "ON v.[CountryCode] = cu2.[CountryCode] "
                                            + "AND v.[Year] = cu2.[Year] "
                                            + "LEFT JOIN [dbo].MappingVariableSource mvs "
                                            + "ON mvs.[CountryCode] = v.[CountryCode] "
                                            + "AND mvs.[Number] = v.[Number] "
                                            + "AND mvs.[Year] = v.[Year] "
                                            + "LEFT JOIN [dbo].Sources s "
                                            + "ON s.[Time] = mvs.[TimeSource] "
                                            + "AND s.[Date] = mvs.[DateSource] "
                                            + "AND s.[Name] = mvs.[NameSource] "
                                            + "WHERE v.[Number] = va.[Number] "
                                            + "AND v.[CountryCode] = co.[CountryCode] ";

        private static string QUERY_NO_MR_2 = " ORDER BY v.[CountryCode], v.[Number], v.[Year]";

        private static string QUERY_MR_1 = " FROM [dbo].Variables va, [dbo].Countries co, [dbo].[Values] v LEFT JOIN [dbo].Currencies cu2 "
                                           + "ON v.[CountryCode] = cu2.[CountryCode] "
                                           + "AND v.[Year] = cu2.[Year] "
                                           + "LEFT JOIN [dbo].MappingVariableSource mvs "
                                           + "ON mvs.[CountryCode] = v.[CountryCode] "
                                           + "AND mvs.[Number] = v.[Number] "
                                           + "AND mvs.[Year] = v.[Year] "
                                           + "LEFT JOIN [dbo].Sources s "
                                           + "ON s.[Time] = mvs.[TimeSource] "
                                           + "AND s.[Date] = mvs.[DateSource] "
                                           + "AND s.[Name] = mvs.[NameSource] "
                                           + "WHERE v.[Number] = va.[Number] "
                                           + "AND v.[CountryCode] = co.[CountryCode] ";

        private static string QUERY_MR_2 = " AND v.Year =(SELECT MAX(v1.Year) "
                                           + "FROM [dbo].[Values] v1 "
                                           + "WHERE (v1.[Data] IS NOT NULL OR v1.[DataUs] IS NOT NULL) "
                                           + "AND v1.[CountryCode] = v.[CountryCode] "
                                           + "AND v1.[Number] = v.[Number]) ";

        private static string QUERY_MR_3 = "UNION ";

        private static string QUERY_MR_4 = " FROM [dbo].Variables va, [dbo].Countries co, [dbo].[Values] v LEFT JOIN [dbo].Currencies cu2 "
                                           + "ON v.[CountryCode] = cu2.[CountryCode] "
                                           + "AND v.[Year] = cu2.[Year] "
                                           + "LEFT JOIN [dbo].MappingVariableSource mvs "
                                           + "ON mvs.[CountryCode] = v.[CountryCode] "
                                           + "AND mvs.[Number] = v.[Number] "
                                           + "AND mvs.[Year] = v.[Year] "
                                           + "LEFT JOIN [dbo].Sources s "
                                           + "ON s.[Time] = mvs.[TimeSource] "
                                           + "AND s.[Date] = mvs.[DateSource] "
                                           + "AND s.[Name] = mvs.[NameSource] "
                                           + "WHERE v.[Number] = va.[Number] "
                                           + "AND v.[CountryCode] = co.[CountryCode] ";

        private static string QUERY_MR_5 = " AND v.Year = (SELECT MAX(v4.[Year])"
                                                           + " FROM [dbo].[Values] v4"
                                                           + " WHERE v4.[CountryCode] = v.[CountryCode]"
                                                           + " AND v4.[Number] = v.[Number]"
                                                           + " AND EXISTS (SELECT *"
                                                                        + " FROM [dbo].[Values] v3"
                                                                        + " WHERE v3.[CountryCode] = v4.[CountryCode]"
                                                                        + " AND v3.[Number] = v4.[Number]"
                                                                        + " AND NOT EXISTS (SELECT *"
                                                                        + " FROM [dbo].[Values] v2"
                                                                        + " WHERE v3.[CountryCode] = v2.[CountryCode]"
                                                                        + " AND v3.[Number] = v2.[Number]"
                                                                        + " AND v3.[Year] = v2.[Year]"
                                                                        + " AND v2.[Year] = (SELECT MAX(v1.[Year])"
                                                                                            + " FROM [dbo].[Values] v1"
                                                                                            + " WHERE (v1.[Data] IS NOT NULL OR v1.[DataUs] IS NOT NULL)"
                                                                                            + " AND v1.[CountryCode] = v2.[CountryCode]"
                                                                                            + " AND v1.[Number] = v2.[Number]))"
                                                                        + " GROUP BY v3.[CountryCode], v3.[Number]"
                                                                        + " HAVING COUNT(v3.[Number]) > @totYear";

        private static string QUERY_MR_6 = ")) ORDER BY v.[CountryCode], v.[Number], v.[Year]";

        private static string NUMBER_YEAR = "SELECT COUNT(DISTINCT v.[Year]) FROM [dbo].[Values] v WHERE v.[Year] >= 2010";

        public static List<ExportView> getExport(List<short> countrySelected, List<short> variableSelected, List<string> yearSelected, List<string> columnSelected)
        {
            List<ExportView> excelViews = new List<ExportView>();
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

                    string columnQuery = "SELECT ";
                    for (int i = 0; i < columnSelected.Count; i++)
                    {
                        switch (columnSelected[i])
                        {
                            case "NEW ID TS":
                                columnQuery += "v.[NomismaCode], ";
                                break;
                            case "Continent_code":
                                columnQuery += "co.[ContinentCode], ";
                                break;
                            case "Continent_name":
                                columnQuery += "co.[ContinentName], ";
                                break;
                            case "Region_code":
                                columnQuery += "co.[RegionCode], ";
                                break;
                            case "Region_name":
                                columnQuery += "co.[RegionName], ";
                                break;
                            case "PMI_coding":
                                columnQuery += "co.[PmiCoding], ";
                                break;
                            case "Country_code":
                                columnQuery += "v.[CountryCode], ";
                                break;
                            case "Country_name":
                                columnQuery += "co.[CountryName], ";
                                break;
                            case "Supply chain phase_code":
                                columnQuery += "va.[PhaseCode], ";
                                break;
                            case "Supply chain phase_name":
                                columnQuery += "va.[PhaseName], ";
                                break;
                            case "Variable_number":
                                columnQuery += "v.[Number], ";
                                break;
                            case "Variable_name":
                                columnQuery += "va.[Name], ";
                                break;
                            case "Measurement_unit":
                                columnQuery += "va.[MeasurementUnitName], ";
                                break;
                            case "Data":
                                columnQuery += "v.[Data], ";
                                break;
                            case "Data_US$":
                                columnQuery += "v.[DataUs], ";
                                break;
                            case "Year":
                                columnQuery += "v.[Year], ";
                                break;
                            case "Source":
                                columnQuery += "s.[Name], ";
                                break;
                            case "Link":
                                columnQuery += "s.[Link], ";
                                break;
                            case "Access or download date":
                                columnQuery += "s.[DateDownload], ";
                                break;
                            case "Exchange_Rate_US$":
                                columnQuery += "cu2.[Value], ";
                                break;
                            case "Notes":
                                columnQuery += "v.[PublicNotes], ";
                                break;
                            case "VAR LC":
                                columnQuery += "va.[VarLc], ";
                                break;
                            case "Area_code":
                                columnQuery += "co.[AreaCode], ";
                                break;
                            case "COMMENTI NOMISMA (interno)":
                                columnQuery += "v.[InternalNotes], ";
                                break;
                            case "CHI ha inserito/modificato il dato":
                                columnQuery += "s.[Username], ";
                                break;
                            case "reference data repository":
                                columnQuery += "s.[Repository], ";
                                break;
                            case "date":
                                columnQuery += "s.[Date], ";
                                break;
                            case "time":
                                columnQuery += "s.[Time], ";
                                break;
                        }

                        if (i == columnSelected.Count - 1)
                            columnQuery = columnQuery.Substring(0, columnQuery.Length - 2);
                    }

                    string countryQuery = "AND (";
                    for (int i = 0; i < countrySelected.Count; i++)
                    {
                        countryQuery += "v.[CountryCode] = " + countrySelected[i];

                        if (i != countrySelected.Count - 1)
                            countryQuery += " OR ";
                        else
                            countryQuery += ") ";
                    }

                    string variableQuery = "AND (";
                    for (int i = 0; i < variableSelected.Count; i++)
                    {
                        variableQuery += "v.[Number] = " + variableSelected[i];

                        if (i != variableSelected.Count - 1)
                            variableQuery += " OR ";
                        else
                            variableQuery += ") ";
                    }

                    string yearQuery = "AND (";
                    for (int i = 0; i < yearSelected.Count; i++)
                    {
                        yearQuery += "v.[Year] = " + yearSelected[i];

                        if (i != yearSelected.Count - 1)
                            yearQuery += " OR ";
                        else
                            yearQuery += ")";
                    }

                    string variableNumberOne = "";
                    if (yearQuery.Contains("MR") && variableQuery.Contains("v.[Number] = 1"))
                        variableNumberOne = " OR v3.[Number] = 1 ";

                    string execute;
                    if (yearQuery.Contains("MR"))
                        execute = columnQuery + QUERY_MR_1 + countryQuery + variableQuery + QUERY_MR_2 + QUERY_MR_3 + columnQuery + QUERY_MR_4 + countryQuery + variableQuery + QUERY_MR_5 + variableNumberOne + QUERY_MR_6;
                    else
                        execute = columnQuery + QUERY_NO_MR_1 + countryQuery + variableQuery + yearQuery + QUERY_NO_MR_2;

                    using (SqlCommand dbCommand = new SqlCommand(execute, dbConn))
                    {
                        if (yearQuery.Contains("MR"))
                            dbCommand.Parameters.Add("totYear", SqlDbType.Int).Value = getYearTot() - 1;

                        //
                        // Instance methods can be used on the SqlCommand.
                        // ... These read data.
                        //
                        
                        int countColumn = columnSelected.Count;

                        if (columnSelected.Contains("Data_collection_year"))
                            countColumn--;
                        if (columnSelected.Contains("Variable"))
                            countColumn--;
                        if (columnSelected.Contains("workin comments_PMI"))
                            countColumn--;

                        ExportView temp;
                        int k = 1;
                        using (SqlDataReader reader = dbCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                for (int i = 0; i < reader.FieldCount / countColumn; i++)
                                {
                                    temp = new ExportView();
                                    k = 1;

                                    if (columnSelected.Contains("NEW ID TS"))
                                        temp.NomismaCode = reader.GetInt32(i);

                                    if (columnSelected.Contains("Continent_code"))
                                        temp.ContinentCode = reader.GetInt16(i + k++);

                                    if (columnSelected.Contains("Continent_name"))
                                        temp.ContinentName = reader.GetString(i + k++);

                                    if (columnSelected.Contains("Region_code"))
                                        temp.RegionCode = reader.GetInt16(i + k++);

                                    if (columnSelected.Contains("Region_name"))
                                        temp.RegionName = reader.GetString(i + k++);

                                    if (columnSelected.Contains("PMI_coding"))
                                        temp.PmiCode = reader.GetString(i + k++);

                                    if (columnSelected.Contains("Country_code"))
                                        temp.CountryCode = reader.GetInt16(i + k++);

                                    if (columnSelected.Contains("Country_name"))
                                        temp.CountryName = reader.GetString(i + k++);

                                    if (columnSelected.Contains("Supply chain phase_code"))
                                        temp.PhaseCode = reader.GetInt16(i + k++);

                                    if (columnSelected.Contains("Supply chain phase_name"))
                                        temp.PhaseName = reader.GetString(i + k++);

                                    if (columnSelected.Contains("Variable_number"))
                                        temp.Number = reader.GetInt16(i + k++);

                                    if (columnSelected.Contains("Variable_name"))
                                        temp.VariableName = reader.GetString(i + k++);

                                    if (columnSelected.Contains("Measurement_unit"))
                                        temp.MeasurementUnitName = reader.GetString(i + k++);

                                    if (columnSelected.Contains("Data"))
                                        temp.Data = ExportRepository.ToNullableDecimal(reader.GetValue(i + k++).ToString());

                                    if (columnSelected.Contains("Data_US$"))
                                        temp.DataUs = ExportRepository.ToNullableDecimal(reader.GetValue(i + k++).ToString());

                                    if (columnSelected.Contains("Year"))
                                        temp.Year = reader.GetInt16(i + k++);

                                    if (columnSelected.Contains("Source"))
                                        temp.SourceName = reader.GetValue(i + k++).ToString();

                                    if (columnSelected.Contains("Link"))
                                        temp.Link = reader.GetValue(i + k++).ToString();

                                    if (columnSelected.Contains("Access or download date"))
                                        temp.DateDownload = ExportRepository.ToNullableDate(reader.GetValue(i + k++).ToString());

                                    if (columnSelected.Contains("Exchange_Rate_US$"))
                                        temp.CurrencyValue = ExportRepository.ToNullableDecimal(reader.GetValue(i + k++).ToString());

                                    if (columnSelected.Contains("Notes"))
                                            temp.PublicNotes = reader.GetValue(i + k++).ToString();

                                    if (columnSelected.Contains("VAR LC"))
                                        temp.VarLc = reader.GetBoolean(i + k++);

                                    if (columnSelected.Contains("Area_code"))
                                        temp.AreaCode = reader.GetBoolean(i + k++);

                                    if (columnSelected.Contains("COMMENTI NOMISMA (interno)"))
                                            temp.InternalNotes = reader.GetValue(i + k++).ToString();

                                    if (columnSelected.Contains("CHI ha inserito/modificato il dato"))
                                        temp.Username = reader.GetValue(i + k++).ToString();

                                    if (columnSelected.Contains("reference data repository"))
                                            temp.Repository = reader.GetValue(i + k++).ToString();

                                    if (columnSelected.Contains("date"))
                                        temp.SourceDate = ExportRepository.ToNullableDate(reader.GetValue(i + k++).ToString());

                                    if (columnSelected.Contains("time"))
                                        temp.SourceTime = ExportRepository.ToNullableTime(reader.GetValue(i + k++).ToString());

                                    excelViews.Add(temp);
                                }
                            } // while
                        }
                    }

                }
                catch (SqlException)
                {
                    throw; // bubble up the exception and preserve the stack trace
                }

                dbConn.Close();
            }

            return excelViews;
        }

        public static int getYearTot()
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
                    using (SqlCommand dbCommand = new SqlCommand(NUMBER_YEAR, dbConn))
                    {
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

        public static decimal? ToNullableDecimal(this string s)
        {
            decimal i;
            if (decimal.TryParse(s, out i))
                return i;

            return null;
        }

        public static DateTime? ToNullableDate(this string s)
        {
            DateTime i;
            if (DateTime.TryParse(s, out i))
                return i;

            return null;
        }

        public static TimeSpan? ToNullableTime(this string s)
        {
            TimeSpan i;
            if (TimeSpan.TryParse(s, out i))
                return i;

            return null;
        }
    }
}