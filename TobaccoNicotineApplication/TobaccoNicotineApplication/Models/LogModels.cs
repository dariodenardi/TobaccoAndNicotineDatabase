using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace TobaccoNicotineApplication.Models
{
    public class Log
    {
        // Log Properties
        [Key]
        public long id { get; set; }
        public string UserName { get; set; }
        public string IPAddress { get; set; }
        public string AreaAccessed { get; set; }
        public DateTime TimeAccessed { get; set; }

        // Default Constructor
        public Log() { }
    }

    public class LogContext : DbContext
    {
        public LogContext()
            : base("SecurityConnection")
        {
        }

        public DbSet<Log> Log { get; set; }
    }
}