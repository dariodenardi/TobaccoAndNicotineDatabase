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

    public partial class Variable
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Variable()
        {
            this.Values = new HashSet<Value>();
        }

        [Required(ErrorMessage = "Number is required.")]
        public short Number { get; set; }

        [Required(ErrorMessage = "Variable Name is required.")]
        [StringLength(100, MinimumLength = 5, ErrorMessage = "Variable Name must be at least 5 characters.")]
        [RegularExpression("^[^0-9]+$", ErrorMessage = "Numbers aren't valid")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Phase Code is required.")]
        public short PhaseCode { get; set; }

        [Required(ErrorMessage = "Phase Name is required.")]
        [StringLength(30, MinimumLength = 4, ErrorMessage = "Phase Name must be at least 4 characters.")]
        [RegularExpression("^[^0-9]+$", ErrorMessage = "Numbers aren't valid")]
        public string PhaseName { get; set; }

        [Required(ErrorMessage = "Measurement Unit Name is required.")]
        [StringLength(30, MinimumLength = 1, ErrorMessage = "Measurement Unit Name must be at least 1 characters.")]
        [RegularExpression("^[^0-9]+$", ErrorMessage = "Numbers aren't valid")]
        public string MeasurementUnitName { get; set; }

        [Required(ErrorMessage = "Var Lc is required.")]
        public bool VarLc { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Value> Values { get; set; }
    }
}
