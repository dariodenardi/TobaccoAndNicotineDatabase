using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TobaccoNicotineApplication.Pagination
{
    public static class Pagination
    {
        public static PagedData<T> PagedResult<T>(IQueryable<T> iQuerable, int PageNumber, int PageSize) where T : class
        {
            PagedData<T> result = new PagedData<T>();
            result.Data = iQuerable.Skip(PageSize * (PageNumber - 1)).Take(PageSize).ToList();
            result.TotalPages = Convert.ToInt32(Math.Ceiling((double)iQuerable.Count() / PageSize));
            result.CurrentPage = PageNumber;
            return result;
        }
    }
}