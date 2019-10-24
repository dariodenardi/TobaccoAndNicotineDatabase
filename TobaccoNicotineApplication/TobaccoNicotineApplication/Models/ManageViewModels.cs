using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;

namespace TobaccoNicotineApplication.Models
{
    /*
         ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])(?!.*userName)(?!.*(.)\1{2,}).{8,}$
         ^                         // from start
         (?=.*[a-z])              // has at least one lower case character
         (?=.*[A-Z])              // has at least one upper case character
         (?=.*\d)                 // has at least one digit
         (?=.*[!@#$%^&*()])       // has at least one special character
         (?!.*userName)           // has not userName => set it by a variable
         (?!.*(.)\1{2,})          // has not an repeated character more than twice
         .{8,}                    // has a length of 8 and more
         $                         //to the end
     */

    public class IndexViewModel
    {
        public bool HasPhoto { get; set; }
        public bool BrowserRemembered { get; set; }
    }

    public class ChangePasswordViewModel
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}