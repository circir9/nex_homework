using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Employee
{
    public string Name { get; set; } = null!;

    public DateTime? DateOfBirth { get; set; }

    public int? Salary { get; set; }

    public string? Address { get; set; }
}
