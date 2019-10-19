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
        public DateTime TimeAccessed { get; set; }
        public string UserName { get; set; }
        public string IPAddress { get; set; }
        public string AreaAccessed { get; set; }

        // Default Constructor
        public Log() { }
    }

    public class LogContext : DbContext
    {
        private static readonly LogContext _logContext = new LogContext();

        public LogContext()
            : base("SecurityConnection")
        {
        }

        public static LogContext GetLogContext()
        {
            return _logContext;
        }

        public DbSet<Log> Log { get; set; }
    }
}