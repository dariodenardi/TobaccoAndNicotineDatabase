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
    
    public partial class Country
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Country()
        {
            this.Currencies = new HashSet<Currency>();
            this.Values = new HashSet<Value>();
        }
    
        public short CountryCode { get; set; }
        public short ContinentCode { get; set; }
        public short RegionCode { get; set; }
        public string CountryName { get; set; }
        public string ContinentName { get; set; }
        public string RegionName { get; set; }
        public string PmiCoding { get; set; }
        public bool AreaCode { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Currency> Currencies { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Value> Values { get; set; }
    }
}
