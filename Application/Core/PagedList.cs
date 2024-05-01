using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Core
{
    public class PagedList<T> : List<T>
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public PagedList(IEnumerable<T> items, int pageNumber, int pageSize, int count, int totalPages)
        {
            CurrentPage = pageNumber;
            TotalPages = totalPages;
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);
        }
        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = await source.CountAsync();
            var totalPages = (int)Math.Ceiling(count / (double)pageSize);
            pageNumber = pageNumber > totalPages ? totalPages : pageNumber;
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(items, pageNumber, pageSize, count, totalPages);
        }
    }
}
