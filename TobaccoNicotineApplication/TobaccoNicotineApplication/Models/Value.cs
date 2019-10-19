//------------------------------------------------------------------------------
// <auto-generated>
//     Codice generato da un modello.
//
//     Le modifiche manuali a questo file potrebbero causare un comportamento imprevisto dell'applicazione.
//     Se il codice viene rigenerato, le modifiche manuali al file verranno sovrascritte.
// </auto-generated>
//------------------------------------------------------------------------------

namespace TobaccoNicotineApplication.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Value
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Value()
        {
            this.Sources = new HashSet<Source>();
        }
    
        public short CountryCode { get; set; }
        public short Number { get; set; }
        public short Year { get; set; }
        public int NomismaCode { get; set; }
        public Nullable<decimal> Data { get; set; }
        public Nullable<decimal> DataPmi { get; set; }
        public string PublicNotes { get; set; }
        public string InternalNotes { get; set; }
        public string PmiNotes { get; set; }
    
        public virtual Country Countries { get; set; }
        public virtual Variable Variables { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Source> Sources { get; set; }
    }
}
