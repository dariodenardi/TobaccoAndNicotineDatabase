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
    using System.ComponentModel.DataAnnotations;

    public partial class Source
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Source()
        {
            this.Values = new HashSet<Value>();
        }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(255, MinimumLength = 2, ErrorMessage = "Source Name must be at least 2 characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Date is required.")]
        public System.DateTime Date { get; set; }

        [Required(ErrorMessage = "Time is required.")]
        public System.TimeSpan Time { get; set; }

        [StringLength(2048, MinimumLength = 0)]
        public string Link { get; set; }

        [StringLength(2048, MinimumLength = 0)]
        public string Repository { get; set; }

        [Required(ErrorMessage = "Date Download is required.")]
        public System.DateTime DateDownload { get; set; }

        [Required(ErrorMessage = "Username is required.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be at least 3 characters.")]
        public string Username { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Value> Values { get; set; }
    }
}
