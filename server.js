const {prompt} = require('inquirer');
const mysql = require('mysql2');
const logo = require('asciiart-logo');
const sequelize = require('./config/connection');
const env = require('dotenv').config();


 
init();

function init() {

    const text = logo({name: 'Employee Tracker'}).render();
    console.log(text);

loadMainPrompts();
}


function loadMainPrompts() {
    prompt([
        {
        type:"list",
        name:"choice",
        message:"What would you like to do?",
        choices: [
            {
                name: "View All Employees",
                value: "VIEW_EMPLOYEES"
            },
            {
                name: "View All Employees By Department",
                value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
            },
            {
                name: "View All Employees By Manager",
                value: "VIEW_EMPLOYEES_BY_MANAGER"
            },
            {
                name: "Add Employee",
                value: "ADD_EMPLOYEE"
            },
            {
                name: "Remove Employee",
                value: "REMOVE_EMPLOYEE"
            },
            {
                name: "Update Employee Role",
                value: "UPDATE_EMPLOYEE_ROLE"
            },
            {
                name: "Update Employee Manager",
                value: "UPDATE_EMPLOYEE_MANAGER"
            },
            {
                name: "View All Roles",
                value: "VIEW_ROLES"
            },
            {
                name: "Add Role",
                value: "Add_Roles"
            },
            {
                name: "View All Departments",
                value: "VIEW_DEPARTMENTS"
            },
            {
                name: "Add Department",
                value: "ADD_DEPARTMENT"
            },
            {
                name: "Remove Department",
                value: "REMOVE_DEPARTMENT"
            },
            {
                name: "View Department Budget",
                value: "Department Budget"
            },
            {
                name: "Quit",
                value: "QUIT"
            }
        ]
}
    ]).then(res => {
        let choice = res.choice;
        switch(choice) {
            case "VIEW_EMPLOYEES":
                viewEmployee();
                break;
            case "VIEW_EMPLOYEES_BY_DEPARTMENT":
                viewEmployeesByDepartment();
                break;
            case "VIEW_EMPLOYEES_BY_MANAGER":
                viewEmployeesByManager();
                break;
            case "ADD_EMPLOYEE":
                addEmployee();
                break;
            case "REMOVE_EMPLOYEE":
                removeEmployee();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            case "UPDATE_EMPLOYEE_MANAGER":
                updateEmployeeManager();
                break;
            case "VIEW_ROLES":
                viewRoles();
                break;
                case "Add_Roles":
                    addRole();
                    break;
            
            case "VIEW_DEPARTMENTS":
                viewDepartments();
                break;
            case "ADD_DEPARTMENT":
                addDepartment();
                break;
             case "REMOVE_DEPARTMENT":
                 removeDepartment();
                 break;
            case "QUIT":
                quit();

        }
    }
    )
}

function viewEmployee() {
    sequelize.query('SELECT * FROM employee')
    .then(([rows]) => {
        let employees = rows;
        console.log('\n');
        console.table(employees);
        
    })
    .then(() => loadMainPrompts());

}

function viewEmployeesByDepartment() {
    sequelize.query('SELECT * FROM department')
        .then(([rows]) => {
            let departments = rows;
            const departmentsChoices = departments.map(({id, name}) => ({
                name: name,
                value: id
            }));
            return prompt([
                {
                    type: "list",
                    name: "departmentId",
                    message: "Which department would you like to see employees for?",
                    choices: departmentsChoices
                }
            ])
        
            .then(res => sequelize.query('SELECT * FROM department WHERE Id = ?', { replacements: [res.departmentId], type: sequelize.QueryTypes.SELECT }))
        .then(([rows]) => {
            let employees = rows;
            console.log('\n');
            console.table(employees);
        })
        .then(() => loadMainPrompts())
    });
}

function viewEmployeesByManager() {
    sequelize.query('SELECT * FROM employee WHERE manager_id IS NULL')
    .then(([rows]) => {
        let managers = rows;
        const managerChoices = managers.map(({id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "managerId",
                message: "Which manager would you like to see employees for?",
                choices: managerChoices
            }
        ])
        .then(res => sequelize.query('SELECT * FROM employee WHERE manager_id = ?', { replacements: [res.managerId], type: sequelize.QueryTypes.SELECT }))
        .then(([rows]) => {
            let employees = rows;
            console.log('\n');
            console.table(employees);
        })
        .then(() => loadMainPrompts());
    });
}

function removeEmployee() {
    sequelize.query('SELECT * FROM employee')
    .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee would you like to remove?",
                choices: employeeChoices
            }
        ])
        .then(res => sequelize.query('DELETE FROM employee WHERE id = ?', { replacements: [res.employeeId]}))
        .then(() => console.log('Employee removed'))
        .then(() => loadMainPrompts());
    });
}
 function updateEmployeeRole() {
        sequelize.query('SELECT * FROM employee')
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({id, first_name, last_name}) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee's role would you like to update?",
                    choices: employeeChoices
                }
            ])
            .then(res => {
                let employeeId = res.employeeId;
                sequelize.query('SELECT * FROM role')
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({id, title}) => ({
                        name: title,
                        value: id
                    }));
                    prompt([
                        {
                            type: "list",
                            name: "roleId",
                            message: "What is the employee's new role?",
                            choices: roleChoices
                        }
                    ])
                    .then(res => sequelize.query('UPDATE employee SET role_id = ? WHERE id = ?', { replacements: [res.roleId, employeeId]}))
                    .then(() => console.log('Employee role updated'))
                    .then(() => loadMainPrompts());
                });
            });
        });
 }

    function updateEmployeeManager() {
        sequelize.query('SELECT * FROM employee')
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({id, first_name, last_name}) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee's manager would you like to update?",
                    choices: employeeChoices
                }
            ])
            .then(res => {
                let employeeId = res.employeeId;
                sequelize.query('SELECT * FROM employee WHERE manager_id IS NULL')
                .then(([rows]) => {
                    let managers = rows;
                    const managerChoices = managers.map(({id, first_name, last_name}) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));
                    prompt([
                        {
                            type: "list",
                            name: "managerId",
                            message: "Who is the employee's new manager?",
                            choices: managerChoices
                        }
                    ])
                    .then(res => sequelize.query('UPDATE employee SET manager_id = ? WHERE id = ?', { replacements: [res.managerId, employeeId]}))
                    .then(() => console.log('Employee manager updated'))
                    .then(() => loadMainPrompts());
                });
            });
        });
    }

    function viewRoles() {
        sequelize.query('SELECT * FROM role')
        .then(([rows]) => {
            let roles = rows;
            console.log('\n');
            console.table(roles);
        })
        .then(() => loadMainPrompts());
    }
    

    function viewDepartments() {
        sequelize.query('SELECT * FROM department')
        .then(([rows]) => {
            let departments = rows;
            console.log('\n');
            console.table(departments);
        })
        .then(() => loadMainPrompts());
    }

    function addDepartment() {
        sequelize.query('SELECT * FROM department') 
        .then(([rows]) => {
            let departments = rows;
            const department = departments.map(({id, name, budget}) => ({
                name: name,
                value: id,
                budget: budget
            }));
            prompt([
                {
                    name: "name",
                    message: "What is the name of the department?"
                },
                {
                    name: "budget",
                    message: "What is the budget for the department?"
                }
                
            ])
            .then(department => {
                sequelize.query('INSERT INTO department (name, budget) VALUES (?, ?)',
                {replacements:[department.name,department.budget], type: sequelize.QueryTypes.INSERT})
            
            })
            .then(() => console.log('Department added to the database!'))
            .then(() => loadMainPrompts());
        });
    }

    function removeDepartment() {
        sequelize.query('SELECT * FROM department')
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({id, name}) => ({
                name: name,
                value: id
            }));
            prompt([
                {
                    type: "list",
                    name: "departmentId",
                    message: "Which department would you like to remove? (Will also delete employees and roles!)",
                    choices: departmentChoices
                }
            ])
            .then(res => sequelize.query('DELETE FROM department WHERE id = ?', { replacements: [res.departmentId]}))
            .then(() => console.log('removed from database!'))
            .then(() => loadMainPrompts());
        });
    }
     

function addEmployee() {
    prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        }
])
.then(res => {
    let firstName = res.first_name;
    let lastName = res.last_name;

    sequelize.query('SELECT * FROM role')
    .then(([rows]) => {
        let roles = rows;
        const roleChoices = roles.map(({id, title}) => ({
            name: title,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "roleId",
                message: "What is the employee's role?",
                choices: roleChoices
            }
        ])
        .then(res => {
            let roleId = res.roleId;

            sequelize.query('SELECT * FROM employee')
            .then(([rows]) => {
                let employees = rows;
                const managerChoices = employees.map(({id, first_name, last_name}) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                }));
                managerChoices.unshift({name: "None", value: null});
                prompt([
                    {
                        type: "list",
                        name: "managerId",
                        message: "Who is the employee's manager?",
                        choices: managerChoices
                    }
                ])
                .then(res => {
                    let managerId = res.managerId;
                    let employee = {
                        manager_id: managerId,
                        role_id: roleId,
                        first_name: firstName,
                        last_name: lastName
                    }
                    console.log(employee)
                    sequelize.query('INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (?, ?, ?, ?)',
                {replacements:[employee.first_name, employee.last_name, employee.manager_id, employee.role_id], type: sequelize.QueryTypes.INSERT})
                })
                .then(() => console.log('Employee added to the database'))
                .then(() => loadMainPrompts());
            });
        });
    }
    );
})}
function addRole() {
    sequelize.query('SELECT * FROM department')
    .then(([rows]) => {
        let departments = rows;
        
        prompt([
            {
                name: "title",
                message: "What is the title of the role?"
            },
            {
                name: "salary",
                message: "What is the salary of the role?"
            },
            {
                name: "deptId",
                type:"list",
                message: "What department is the role in?",
                choices: departments
            }
        ])
        .then(role => {
            const chosenDepartment = departments.find(department => department.name === role.deptId)
        
            sequelize.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
            {replacements:[role.title, role.salary, chosenDepartment.id ], type: sequelize.QueryTypes.INSERT})
        })
        .then(() => console.log('Role added to the database!'))
        .then(() => loadMainPrompts());
    });

}

function quit() {
    console.log("Goodbye!");
    process.exit();
  }


