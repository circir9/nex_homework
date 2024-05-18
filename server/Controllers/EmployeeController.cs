using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase{
    private HomeworkContext _sqliteContext;

    public EmployeeController(HomeworkContext context){
        _sqliteContext = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Employee>>> GetAll(){
        await using var db = _sqliteContext;
        try{
            var results = await (from employee in db.Employees
                                select employee).ToListAsync();

            return results;
        }
        catch{
            return NoContent();
        }
    }

    [HttpGet("{name}")]
    public async Task<ActionResult<bool>> IsEmployeeExist(string name){
        await using var db = _sqliteContext;
        try{
            var exist = await db.Employees.AnyAsync(e => e.Name == name);
            return exist;
        }
        catch{
            return NoContent();
        }
    }

    [HttpPost]
    public async Task<IActionResult> POSTEmployees(Employee employee){
        await using var db = _sqliteContext;

        try{
            await db.Employees.AddAsync(new Employee
            {
                Name = employee.Name,
                DateOfBirth = employee.DateOfBirth,
                Salary = employee.Salary,
                Address = employee.Address
            });
            await db.SaveChangesAsync();

            return NoContent();
        }
        catch{
            return NoContent();
        }
    }
}