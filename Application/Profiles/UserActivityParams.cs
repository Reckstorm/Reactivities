using Application.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class UserActivityParams: PagingParams
    {
        public string Predicate { get; set; }
        public string HostUsername { get; set; }
    }
}
