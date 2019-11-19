using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TobaccoNicotineApplication.Models
{
    public partial class ExportView
    {
        public ExportView()
        {
        }

        public int NomismaCode { get; set; }
        public short ContinentCode { get; set; }
        public string ContinentName { get; set; }
        public short RegionCode { get; set; }
        public string RegionName { get; set; }
        public short CountryCode { get; set; }
        public string PmiCode { get; set; }
        public string CountryName { get; set; }
        public short PhaseCode { get; set; }
        public string PhaseName { get; set; }
        public short Number { get; set; }
        public string VariableName { get; set; }
        public string MeasurementUnitName { get; set; }
        public Nullable<decimal> Data { get; set; }
        public short Year { get; set; }
        public string SourceName { get; set; }
        public string Link { get; set; }
        public Nullable<decimal> CurrencyValue { get; set; }
        public string PublicNotes { get; set; }
        public bool VarLc { get; set; }
        public bool AreaCode { get; set; }
        public string InternalNotes { get; set; }
        public Nullable<DateTime> DateDownload { get; set; }
        public string Repository { get; set; }
        public string Username { get; set; }
        public Nullable<DateTime> SourceDate { get; set; }
        public Nullable<TimeSpan> SourceTime { get; set; }

    }
}